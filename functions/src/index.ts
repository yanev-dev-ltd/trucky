import {
  onDocumentWritten,
  // onDocumentCreated,
  onDocumentUpdated,
  // onDocumentDeleted,
  // Change,
  // FirestoreEvent,
} from "firebase-functions/v2/firestore";
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
          const errorRef = firestore.collection("errors").doc();
          await errorRef.set({
            userId: event.params.userId,
            name: "addPaymentMethod",
            error: e?.message,
            date: new Date().getTime(),
          });
        }
      }
    });
