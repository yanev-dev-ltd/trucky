import {
  onDocumentWritten,
  // onDocumentCreated,
  onDocumentUpdated,
  // onDocumentDeleted,
  // Change,
  // FirestoreEvent,
} from "firebase-functions/v2/firestore";
import {log} from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import Stripe from "stripe";
import {
  getFirestore,
  Query,
  QuerySnapshot,
  DocumentData,
  // CollectionReference,
  // DocumentSnapshot,
} from "firebase-admin/firestore";
// import {getAuth} from "firebase-admin/auth";
import {initializeApp} from "firebase-admin/app";
import {setGlobalOptions} from "firebase-functions/v2";
import {Storage} from "@google-cloud/storage";

setGlobalOptions({region: "europe-west1", maxInstances: 10});

const app = initializeApp();
const firestore = getFirestore(app);
// const auth = getAuth(app);
firestore.settings({ignoreUndefinedProperties: true});


const stripe = new Stripe(process.env.STRIPE_KEY || "", {
  apiVersion: "2023-08-16",
});

export const registerNewUser = functions.auth.user().onCreate(async (user) => {
  const customer = await stripe.customers.create({
    email: user.email,
  });
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    trial_period_days: 30,
    items: [
      {
        price: "price_1ONgoiCW2lhHJV8BmVbpeCgu",
        quantity: 0,
      },
    ],
    metadata: {
      userId: user.uid,
    },
  });
  await firestore.collection("settings").doc(user.uid).set({
    currency: "EUR",
    theme: "light",
    units: "km",
  }, {merge: true});
  await firestore.collection("profile").doc(user.uid).set({
    company: "",
    phone: "",
    address: "",
  }, {merge: true});
  return firestore.collection("customers").doc(user.uid).set({
    status: "active",
    created: new Date().getTime(),
    stripe_customer_id: customer.id,
    stripe_subscription_id: subscription.id,
    stripe_item_id: subscription.items.data[0].id,
    userId: user.uid,
  });
});

export const deleteUser = functions.auth.user().onDelete(async (user) => {
  const customer = await firestore.collection("customers").doc(user.uid).get();
  if (customer.get("userId") === user.uid) {
    const storage = new Storage();
    const bucket = storage.bucket("trucky-one.appspot.com");
    bucket.deleteFiles({prefix: `user/${user.uid}/`});
    customer.get("stripe_subscription_id") && await stripe.subscriptions.cancel(customer.get("stripe_subscription_id"));
    customer.get("stripe_customer_id") && await stripe.customers.del(customer.get("stripe_customer_id"));
    await firestore.collection("settings").doc(user.uid).delete();
    await firestore.collection("profile").doc(user.uid).delete();
    const vehicles = await firestore.collection("vehicles").where("userId", "==", user.uid).get();
    vehicles.forEach(async (vehicle) => {
      await vehicle.ref.delete();
    });
    const drivers = await firestore.collection("drivers").where("userId", "==", user.uid).get();
    drivers.forEach(async (driver) => {
      await driver.ref.delete();
    });
    const clients = await firestore.collection("clients").where("userId", "==", user.uid).get();
    clients.forEach(async (client) => {
      await client.ref.delete();
    });
    const maintenances = await firestore.collection("maintenances").where("userId", "==", user.uid).get();
    maintenances.forEach(async (maintenance) => {
      await maintenance.ref.delete();
    });
    const orders = await firestore.collection("orders").where("userId", "==", user.uid).get();
    orders.forEach(async (order) => {
      await order.ref.delete();
    });
    const receipts = await firestore.collection("receipts").where("userId", "==", user.uid).get();
    receipts.forEach(async (receipt) => {
      await receipt.ref.delete();
    });
    const routes = await firestore.collection("routes").where("userId", "==", user.uid).get();
    routes.forEach(async (route) => {
      await route.ref.delete();
    });
    return firestore.collection("customers").doc(user.uid).delete();
  }
  return new Promise((resolve) => resolve(true));
});

export const updateProfile = onDocumentWritten(
    "profile/{userId}",
    async (event) => {
      const data = event?.data?.after.data();
      const userId = event.params.userId;
      const customerSnapshot = await firestore.collection("customers").doc(userId).get();
      if (customerSnapshot.exists) {
        const customer = customerSnapshot.data();
        return stripe.customers.update(customer?.stripe_customer_id, {
          name: data?.company,
          phone: data?.phone,
          address: data?.address,
        });
      }
      return new Promise((resolve) => resolve(true));
    });

export const updateSubscription = onDocumentWritten(
    "vehicles/{vehicleId}",
    async (event) => {
      const data = event?.data?.after.data();
      const prevData = event?.data?.before.data();
      const userId = data?.userId || prevData?.userId;
      if (!userId) return;
      const vehiclesColl = firestore.collection("vehicles");
      const q1: Query<DocumentData> = vehiclesColl.where("userId", "==", userId);
      const querySnapshot: QuerySnapshot<DocumentData> = await q1.get();
      const customerSnapshot = await firestore.collection("customers").doc(userId).get();
      if (customerSnapshot.exists) {
        const customer = customerSnapshot.data();
        await stripe.subscriptions.update(customer?.stripe_subscription_id, {
          items: [
            {
              id: customer?.stripe_item_id,
              quantity: querySnapshot.size,
            },
          ],
        });
      }
    });

export const addPaymentMethod = onDocumentUpdated(
    "profile/{userId}",
    async (event) => {
      const prevData = event?.data?.before.data();
      const data = event?.data?.after.data();
      const customerSnapshot = await firestore.collection("customers").doc(event.params.userId).get();
      if (!customerSnapshot.exists) return;
      const customer = customerSnapshot.data();
      try {
        if (data?.payment_method_id && !prevData?.payment_method_id) {
          await stripe.paymentMethods.attach(
              data.payment_method_id,
              {customer: customer?.stripe_customer_id}
          );
          await stripe.customers.update(
              customer?.stripe_customer_id,
              {
                invoice_settings: {
                  default_payment_method: data.payment_method_id,
                }});
        } else if (!data?.payment_method_id && prevData?.payment_method_id) {
          await stripe.customers.update(
              customer?.stripe_customer_id,
              {
                invoice_settings: {
                  default_payment_method: undefined,
                }});
          await stripe.paymentMethods.detach(prevData.payment_method_id);
        }
      } catch (e) {
        if (e instanceof Stripe.errors.StripeError) {
          await firestore.collection("profile").doc(event.params.userId).set({
            card_error: e.decline_code || e.code,
            payment_method_id: null,
            card_brand: null,
            card_country: null,
            card_email: null,
            card_exp_month: null,
            card_exp_year: null,
            card_last4: null,
            card_name: null,
            card_phone: null,
          }, {merge: true});
        }
      }
    });

export const manualPayment = onDocumentUpdated(
    "receipts/{receiptId}",
    async (event) => {
      const prevData = event?.data?.before.data();
      const data = event?.data?.after.data();
      if (!prevData?.try_payment && data?.try_payment && data?.invoice) {
        try {
          await stripe.invoices.pay(data?.invoice);
        } catch (e) {
          if (e instanceof Stripe.errors.StripeError) {
            const errorRef = firestore.collection("errors").doc();
            await errorRef.set({
              userId: data?.userId,
              name: "manualPayment",
              error: e?.message,
              date: new Date().getTime(),
            });
          }
        }
        await firestore.collection("receipts").doc(event.params.receiptId).set({
          try_payment: false,
        }, {merge: true});
      }
    });

export const stripeWebhook = onRequest(
    {timeoutSeconds: 1200, cors: true},
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig || "", endpointSecret);
        let userId;
        let q1;
        let intent;
        let client;
        let vehicles;
        switch (event.type) {
          case "invoice.paid":
            userId = event.data.object?.subscription_details?.metadata?.userId || "";
            userId && await firestore.collection("customers").doc(userId).set({
              status: "active",
            }, {merge: true});
            q1 = await firestore.collection("receipts").where("invoice", "==", event.data.object.id).get();
            q1.forEach(async (receipt) => {
              await receipt.ref.delete();
            });
            userId && await firestore.collection("receipts").add({
              userId,
              invoicePdf: event.data.object.invoice_pdf,
              invoice: event.data.object.id,
              amount: event.data.object.amount_paid,
              status: event.data.object.status,
              date: event.data.object.created,
            });
            client = await firestore.collection("customers").doc(userId).get();
            vehicles = await firestore.collection("vehicles").where("userId", "==", userId).get();
            await stripe.subscriptions.update(
                client.get("stripe_subscription_id"),
                {
                  items: [
                    {
                      id: client.get("stripe_item_id"),
                      quantity: vehicles.size,
                    },
                  ],
                }
            );
            break;
          case "invoice.payment_failed":
            userId = event.data.object?.subscription_details?.metadata?.userId || "";
            await firestore.collection("customers").doc(userId).set({
              status: "inactive",
            }, {merge: true});
            q1 = await firestore.collection("receipts").where("invoice", "==", event.data.object.id).get();
            q1.forEach(async (receipt) => {
              await receipt.ref.delete();
            });
            intent = await stripe.paymentIntents.retrieve(event.data.object.payment_intent?.toString() || "");
            userId && await firestore.collection("receipts").add({
              userId,
              invoicePdf: event.data.object.invoice_pdf,
              invoice: event.data.object.id,
              amount: event.data.object.amount_due,
              status: event.data.object.status,
              date: event.data.object.created,
              client_secret: intent.client_secret,
            });
            client = await firestore.collection("customers").doc(userId).get();
            await stripe.subscriptions.update(
                client.get("stripe_subscription_id"),
                {
                  items: [
                    {
                      id: client.get("stripe_item_id"),
                      quantity: 0,
                    },
                  ],
                }
            );
            break;
          default:
            log(`Unhandled event type ${event.type}`);
        }
      } catch (err) {
        if (err instanceof Stripe.errors.StripeSignatureVerificationError) {
          const errorRef = firestore.collection("errors").doc();
          await errorRef.set({
            name: "stripeWebhook",
            error: err.message,
            headers: req.headers,
            date: new Date().getTime(),
          });
          res.status(400).send(`Webhook Error: ${err.message}`);
          return;
        }
      }
      res.json({received: true});
      return;
    });
