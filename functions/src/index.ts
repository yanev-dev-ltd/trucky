import {
  onDocumentWritten,
  onDocumentCreated,
  onDocumentUpdated,
  // onDocumentDeleted,
  // Change,
  // FirestoreEvent,
} from "firebase-functions/v2/firestore";
import * as functions from "firebase-functions";
import {onSchedule} from "firebase-functions/v2/scheduler";
import Stripe from "stripe";
import {
  getFirestore,
  Query,
  QuerySnapshot,
  DocumentData,
  CollectionReference,
  DocumentSnapshot,
} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth";
import {initializeApp} from "firebase-admin/app";
import {setGlobalOptions} from "firebase-functions/v2";
import {Storage} from "@google-cloud/storage";

setGlobalOptions({region: "europe-west1", maxInstances: 10});

const app = initializeApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
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
  });
  await firestore.collection("settings").doc(user.uid).set({
    currency: "EUR",
    theme: "light",
    units: "km",
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

export const makeUnpaid = onDocumentCreated(
    "routes/{routeId}",
    (event) => firestore.doc("/routes/" + event.params.routeId).update({
      status: "UNPAID",
      created: new Date().getTime(),
    }));

export const addPaymentMethod = onDocumentUpdated(
    "customers/{userId}",
    async (event) => {
      const prevData = event?.data?.before.data();
      const data = event?.data?.after.data();
      try {
        if (data?.payment_method_id && !prevData?.payment_method_id) {
          await stripe.paymentMethods.attach(
              data.payment_method_id,
              {customer: data.stripe_customer_id}
          );
          await stripe.customers.update(
              data.stripe_customer_id,
              {
                invoice_settings: {
                  default_payment_method: data.payment_method_id,
                }});
        } else if (!data?.payment_method_id && prevData?.payment_method_id) {
          await stripe.customers.update(
              data?.stripe_customer_id,
              {
                invoice_settings: {
                  default_payment_method: undefined,
                }});
          await stripe.paymentMethods.detach(prevData.payment_method_id);
        }
      } catch (e: any) {
        const errorRef = firestore.collection("errors").doc();
        await errorRef.set({
          userId: event.params.userId,
          name: "addPaymentMethod",
          error: e?.message,
          date: new Date().getTime(),
        });
      }
    });

export const makeManualPayment = onDocumentUpdated(
    "customers/{userId}",
    async (event) => {
      const data = event?.data?.after.data().try_payment;
      if (typeof data === "string" && event.params.userId) {
        try {
          const invoice = await stripe.invoices.retrieve(data);
          if (invoice.status !== "paid") {
            const pay = await stripe.invoices.pay(data);
            const batch = firestore.batch();
            const receiptsColl: CollectionReference<DocumentData> =
              firestore.collection("receipts");
            const q2: Query<DocumentData> =
              receiptsColl.where("invoice", "==", data);
            const querySnapshot2: QuerySnapshot<DocumentData> = await q2.get();
            if (pay.status === "paid") {
              const userColl: CollectionReference<DocumentData> =
                firestore.collection("routes");
              const q1: Query<DocumentData> =
                userColl
                    .where("status", "==", "UNPAID")
                    .where("userId", "==", event.params.userId);
              const querySnapshot: QuerySnapshot<DocumentData> = await q1.get();
              querySnapshot.forEach((doc) => {
                batch.update(
                    firestore.doc("/routes/" + doc.id),
                    {status: "PAID"});
              });
              querySnapshot2.forEach((doc) => {
                batch.update(
                    firestore.doc("/receipts/" + doc.id),
                    {
                      status: "paid",
                      receipt: pay?.invoice_pdf,
                      amount_paid: pay?.amount_paid || 0,
                    });
              });
              batch.update(
                  firestore.doc("/customers/" + event.params.userId),
                  {status: "active", try_payment: null});
            } else {
              batch.update(
                  firestore.doc("/customers/" + event.params.userId),
                  {status: "inactive", try_payment: null});
              querySnapshot2.forEach((doc) => {
                batch.update(
                    firestore.doc("/receipts/" + doc.id),
                    {status: "declined", receipt: null});
              });
            }
            await batch.commit();
          }
        } catch (e: any) {
          const errorRef = firestore.collection("errors").doc();
          await errorRef.set({
            userId: event.params.userId,
            name: "makeManualPayment",
            error: e?.message,
            date: new Date().getTime(),
          });
        }
      }
    });

export const createInvoice = onSchedule(
    "0 0 1 * *", // * * * * * - every minute for testing
    async () => {
      try {
        const userColl: CollectionReference<DocumentData> = firestore.collection("routes");
        const q1: Query<DocumentData> = userColl.where("status", "==", "UNPAID");
        const querySnapshot: QuerySnapshot<DocumentData> = await q1.get();
        if (querySnapshot.size > 0) {
          const routes: {key: string, userId: string}[] = [];
          querySnapshot.forEach((doc) => {
            routes.push({key: doc.id, userId: doc.data().userId});
          });
          auth.listUsers().then((users) => {
            users.users.forEach(async (user) => {
              const customer: DocumentSnapshot<DocumentData> = await firestore.collection("customers").doc(user.uid).get();
              if (customer.get("status") === "active") {
                let products = 0;
                const batch = firestore.batch();
                for (const route of routes) {
                  if (route.userId === user.uid) {
                    products++;
                  }
                }
                if (products > 0) {
                  const invoice = await stripe.invoices.create({
                    customer: customer.get("stripe_customer_id"),
                    currency: "eur",
                  });
                  await stripe.invoiceItems.create({
                    customer: customer.get("stripe_customer_id"),
                    price: "price_1NtE3MCW2lhHJV8B1XaHJs0m",
                    quantity: products,
                    invoice: invoice.id,
                    currency: "eur",
                  });
                  try {
                    let pay;
                    if (customer.get("auto_payments") === true) {
                      pay = await stripe.invoices.pay(invoice.id);
                    } else {
                      pay = {status: "manual"};
                    }
                    if (pay.status === "paid") {
                      for (const route of routes) {
                        batch.update(
                            firestore.doc("/routes/" + route.key),
                            {status: "PAID"});
                      }
                      if (typeof pay?.charge === "string") {
                        const charge = await stripe
                            .charges.retrieve(pay?.charge);
                        batch.set(firestore.collection("receipts").doc(),
                            {
                              receipt:
                                charge.receipt_url?.split("?")[0] + "/pdf" ||
                                charge.receipt_url,
                              date: new Date().getTime(),
                              amount_due: pay.amount_due,
                              amount_paid: pay.amount_paid,
                              invoice: invoice.id,
                              status: pay.status,
                              userId: user.uid});
                      }
                      batch.update(
                          firestore.doc("/customers/" + user.uid),
                          {status: "active"});
                    } else {
                      const nInvoice = await stripe.invoices.retrieve(invoice.id);
                      batch.set(firestore.collection("receipts").doc(),
                          {
                            receipt: null,
                            date: new Date().getTime(),
                            amount_due: nInvoice.amount_due,
                            amount_paid: 0,
                            invoice: invoice.id,
                            status: nInvoice.status,
                            userId: user.uid});
                      batch.update(
                          firestore.doc("/customers/" + user.uid),
                          {status: "inactive"});
                    }
                    await batch.commit();
                  } catch (e) {
                    e && Object.keys(e).length > 0 &&
                    batch.set(firestore.collection("receipts").doc(), {
                      receipt: null,
                      date: new Date().getTime(),
                      amount_due: products * 20,
                      amount_paid: products * 20,
                      invoice: invoice.id,
                      status: "declined",
                      userId: user.uid,
                    });
                    batch.update(
                        firestore.doc("/customers/" + user.uid),
                        {status: "inactive"});
                    await batch.commit();
                  }
                }
              }
            });
          });
        }
      } catch (e) {
        const errorRef = firestore.collection("errors").doc();
        await errorRef.set({
          name: "createInvoice",
          error: e,
          date: new Date().getTime(),
        });
      }
    });
