import {
  onDocumentWritten,
  onDocumentCreated,
} from "firebase-functions/v2/firestore";
// import {onSchedule} from "firebase-functions/v2/scheduler";
import Stripe from "stripe";
import * as admin from "firebase-admin";
import {setGlobalOptions} from "firebase-functions/v2";

setGlobalOptions({region: "europe-west1", maxInstances: 10});

const stripe = new Stripe(process.env.STRIPE_KEY || "", {
  apiVersion: "2023-08-16",
});

admin.initializeApp();

export const makeUnpaid = onDocumentCreated(
    {document: "routes/{userId}/{routeId}", region: "europe-west1"},
    (event) => event.data?.ref.update({
      status: "UNPAID",
      created: new Date().getTime(),
    }));

export const addPaymentMethod = onDocumentWritten(
    "/stripe_customers/{userId}",
    async (event) => {
      const prevData = event.data?.before.data();
      const data = event.data?.after.data();
      if (data?.payment_method_id && !prevData?.payment_method_id) {
        await stripe.paymentMethods.attach(
            data.payment_method_id,
            {customer: data.customer_id}
        );
      } else if (!data?.payment_method_id && prevData?.payment_method_id) {
        await stripe.paymentMethods.detach(prevData.payment_method_id);
      }
      return null;
    });

// type E<T> = {
//     [K in keyof T]: [K, T[K]];
//   }[keyof T][];

// export const createInvoice = onSchedule(
//     "every 1 minute",
//     async () => {
//       const db = admin.database();
//       const auth = admin.auth();
//       const ref = db.ref("/routes");
//       ref
//           .once("value")
//           .then(async (snapshot) => {
//             const routes = snapshot.val();
//             auth.listUsers().then(async (users) => {
//               users.users.forEach(async (user) => {
//               const stripeUser: any = db.ref("/stripe_customers/"+user.uid);
//                 const userVal = stripeUser.val();
//                 let products = 0;
//                 const unpaid: { [key: string]: string } = {};
//                 for (
//                   const
//                     [k, v]
//                   of
//                     Object.entries(routes[user.uid]) as E<typeof routes>) {
//                   const status = v.status;
//                   if (status === "UNPAID") {
//                     products++;
//                     unpaid[user.uid + "/" + k + "/status"] = "PAID";
//                   }
//                 }
//                 if (products > 0) {
//                   const invoice = await stripe.invoices.create({
//                     customer: userVal.customer_id,
//                   });
//                   await stripe.invoiceItems.create({
//                     customer: userVal.customer_id,
//                     amount: 20,
//                     quantity: products,
//                     invoice: invoice.id,
//                   });
//                   const pay = await stripe.invoices.pay(
//                       invoice.id,
//                       {
//                         payment_method: userVal.payment_method_id,
//                       }
//                   );
//                   if (pay.status === "paid") {
//                     db.ref("/routes").update(unpaid);
//                     stripeUser.child("status").update("active");
//                   } else {
//                     stripeUser.child("status").update("inactive");
//                   }
//                 } else {
//                   stripeUser.child("status").update("active");
//                 }
//               });
//             });
//           });
//       return new Promise((resolve) => resolve());
//     });
