import {
  // onDocumentWritten,
  onDocumentCreated,
  onDocumentUpdated,
  // onDocumentDeleted,
  // Change,
  // FirestoreEvent,
} from "firebase-functions/v2/firestore";
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

setGlobalOptions({region: "europe-west1", maxInstances: 10});

const app = initializeApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
firestore.settings({ignoreUndefinedProperties: true});


const stripe = new Stripe(process.env.STRIPE_KEY || "", {
  apiVersion: "2023-08-16",
});

export const makeUnpaid = onDocumentCreated(
    "routes/{routeId}",
    (event) => firestore.doc("/routes/" + event.params.routeId).update({
      status: "UNPAID",
      created: new Date().getTime(),
    }));

export const addPaymentMethodOrMakeManualPayment = onDocumentUpdated(
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
        if (
          data?.try_payment &&
          typeof data.try_payment === "string" && event.params.userId) {
          const pay = await stripe.invoices.pay(data.try_payment);
          const batch = firestore.batch();
          const receiptsColl: CollectionReference<DocumentData> =
            firestore.collection("receipts");
          const q2: Query<DocumentData> =
            receiptsColl.where("invoice", "==", data.try_payment);
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
            const charge = await stripe.charges.retrieve(pay?.charge as string);
            querySnapshot2.forEach((doc) => {
              batch.update(
                  firestore.doc("/receipts/" + doc.id),
                  {
                    status: "paid",
                    receipt:
                      charge.receipt_url ?
                      charge.receipt_url.split("?")[0] + "/pdf" : null,
                    amount_paid: charge?.amount_captured || 0,
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
      } catch (e) {
        const errorRef = firestore.collection("errors").doc();
        await errorRef.set({
          userId: event.params.userId,
          error: "addPaymentMethodOrMakeManualPayment",
        });
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
                            amount_paid: nInvoice.amount_paid,
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
          error: e,
        });
      }
    });
