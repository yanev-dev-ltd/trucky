import {
  onValueWritten,
  onValueCreated,
} from "firebase-functions/v2/database";
import {onSchedule} from "firebase-functions/v2/scheduler";
import Stripe from "stripe";
import {getDatabase} from "firebase-admin/database";
import {getAuth} from "firebase-admin/auth";
import {initializeApp} from "firebase-admin/app";
import {setGlobalOptions} from "firebase-functions/v2";

const app = initializeApp();
const db = getDatabase(app);
const auth = getAuth(app);

setGlobalOptions({region: "europe-west1", maxInstances: 10});

const stripe = new Stripe(process.env.STRIPE_KEY || "", {
  apiVersion: "2023-08-16",
});

export const makeUnpaid = onValueCreated(
    "/routes/{userId}/{routeId}",
    (event) => event.data?.ref.update({
      status: "UNPAID",
      created: new Date().getTime(),
    }));

export const addPaymentMethod = onValueWritten(
    "/stripe_customers/{userId}",
    async (event) => {
      const prevData = event.data?.before.val();
      const data = event.data?.after.val();
      if (data?.payment_method_id && !prevData?.payment_method_id) {
        await stripe.paymentMethods.attach(
            data.payment_method_id,
            {customer: data.customer_id}
        );
        await stripe.customers.update(
            data.customer_id,
            {
              invoice_settings: {
                default_payment_method: data.payment_method_id,
              }});
      } else if (!data?.payment_method_id && prevData?.payment_method_id) {
        await stripe.customers.update(
            data.customer_id,
            {
              invoice_settings: {
                default_payment_method: undefined,
              }});
        await stripe.paymentMethods.detach(prevData.payment_method_id);
      }
      return new Promise((resolve) => resolve(true));
    });

type E<T> = {
    [K in keyof T]: [K, T[K]];
  }[keyof T][];

export const createInvoice = onSchedule(
    "0 0 1 * *", // * * * * * - every minute for testing
    () => {
      const ref = db.ref("/routes");
      ref
          .once("value", (snapshot) => {
            const routes = snapshot.val();
            auth.listUsers().then((users) => {
              users.users.forEach(async (user) => {
                const stripeUser = db.ref("/stripe_customers/" + user.uid);
                stripeUser.once("value", async (userValue) => {
                  const userVal = userValue.val();
                  let products = 0;
                  const unpaid: { [key: string]: string } = {};
                  for (
                    const [k, v]
                    of Object.entries(routes[user.uid]) as E<typeof routes>) {
                    if (v.status === "UNPAID") {
                      products++;
                      unpaid[user.uid + "/" + k + "/status"] = "PAID";
                    }
                  }
                  if (products > 0) {
                    const invoice = await stripe.invoices.create({
                      customer: userVal.customer_id,
                      currency: "eur",
                    });
                    await stripe.invoiceItems.create({
                      customer: userVal.customer_id,
                      price: "price_1NtE3MCW2lhHJV8B1XaHJs0m",
                      quantity: products,
                      invoice: invoice.id,
                      currency: "eur",
                    });
                    try {
                      const pay = await stripe.invoices.pay(invoice.id);
                      if (pay.status === "paid") {
                        if (typeof pay?.charge === "string") {
                          const charge = await stripe
                              .charges.retrieve(pay?.charge);
                          db
                              .ref(`/receipts/${user.uid}`)
                              .push({
                                receipt:
                                  charge.receipt_url?.split("?")[0] + "/pdf" ||
                                  charge.receipt_url,
                                date: new Date().getTime(),
                                amount_due: pay.amount_due,
                                amount_paid: pay.amount_paid,
                                invoice: invoice.id,
                                status: "Payed"});
                        }
                        ref.update(unpaid);
                        stripeUser.child("status").update("active");
                      } else {
                        db
                            .ref(`/receipts/${user.uid}`)
                            .push({
                              receipt: null,
                              date: new Date().getTime(),
                              amount_due: pay.amount_due,
                              amount_paid: pay.amount_paid,
                              invoice: invoice.id,
                              status: "Declined"});
                        stripeUser.child("status").update("inactive");
                      }
                    } catch (e) {
                      e && Object.keys(e).length > 0 &&
                      db
                          .ref(`/receipts/${user.uid}`)
                          .push({
                            receipt: null,
                            date: new Date().getTime(),
                            amount_due: products * 20,
                            amount_paid: products * 20,
                            invoice: invoice.id,
                            status: "Declined"});
                      stripeUser.child("status").update("inactive");
                    }
                  } else {
                    stripeUser.child("status").update("active");
                  }
                });
              });
            });
          });
    });
