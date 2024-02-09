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
import {onSchedule} from "firebase-functions/v2/scheduler";
import {getAuth} from "firebase-admin/auth";
import {initializeApp} from "firebase-admin/app";
import {setGlobalOptions} from "firebase-functions/v2";
import {Storage} from "@google-cloud/storage";
import {email} from "./email";
import {en} from "./locales/en";
import {bg} from "./locales/bg";

setGlobalOptions({region: "europe-west1", maxInstances: 10});

export const kmToMiles = 0.621371192;
export const milesToKm = 1.609344;
const baseUrl = "http://localhost:3001/";

const getLocale = (locale: string) => {
  switch (locale) {
    case "bg":
      return bg;
    default:
      return en;
  }
};

const app = initializeApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
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
    const trailers = await firestore.collection("trailers").where("userId", "==", user.uid).get();
    trailers.forEach(async (trailer) => {
      await trailer.ref.delete();
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
    const notifications = await firestore.collection("notifications").where("userId", "==", user.uid).get();
    notifications.forEach(async (notification) => {
      await notification.ref.delete();
    });
    const groups = await firestore.collection("groups").where("userId", "==", user.uid).get();
    groups.forEach(async (group) => {
      await group.ref.delete();
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

// update vehicle and trailer mileage on route change
export const updateRoute = onDocumentWritten(
    "routes/{routeId}",
    async (event) => {
      const data = event?.data?.after.data();
      const prevData = event?.data?.before.data();
      const vehicleId = data?.vehicleId || prevData?.vehicleId;
      const vehicleSnapshot = await firestore.collection("vehicles").doc(vehicleId).get();
      if (!vehicleSnapshot.exists) return;
      const vehicle = vehicleSnapshot.data();
      if (!vehicle || vehicle.units === "h") return;
      let multiplier = 1;
      const units = data?.units || prevData?.units;
      switch (vehicle.units) {
        case "km":
          multiplier = (units === "km") ? 1 : milesToKm;
          break;
        case "mi":
          multiplier = (units === "mi") ? 1 : kmToMiles;
          break;
        default:
          break;
      }
      if (!event?.data?.before.exists && event?.data?.after.exists) {
        if (data?.trailerId) {
          const trailerSnapshot = await firestore.collection("trailers").doc(data?.trailerId).get();
          if (trailerSnapshot.exists) {
            const trailer = trailerSnapshot.data();
            let trailerMultiplier = 1;
            switch (trailer?.units) {
              case "km":
                trailerMultiplier = (units === "km") ? 1 : milesToKm;
                break;
              case "mi":
                trailerMultiplier = (units === "mi") ? 1 : kmToMiles;
                break;
              default:
                break;
            }
            await firestore.collection("trailers").doc(data?.trailerId).set({
              mileage: Math.round((trailer?.mileage || 0) + (data?.distance.reduce((a: number, b: number) => a + b, 0)/1000 * trailerMultiplier)),
            }, {merge: true});
          }
        }
        await firestore.collection("vehicles").doc(vehicleId).set({
          mileage: Math.round((vehicle.mileage || 0) + (data?.distance.reduce((a: number, b: number) => a + b, 0)/1000 * multiplier)),
        }, {merge: true});
      }
      if (event?.data?.before.exists && event?.data?.after.exists) {
        if (data?.trailerId) {
          const trailerSnapshot = await firestore.collection("trailers").doc(data?.trailerId).get();
          if (trailerSnapshot.exists) {
            const trailer = trailerSnapshot.data();
            let trailerMultiplier = 1;
            switch (trailer?.units) {
              case "km":
                trailerMultiplier = (units === "km") ? 1 : milesToKm;
                break;
              case "mi":
                trailerMultiplier = (units === "mi") ? 1 : kmToMiles;
                break;
              default:
                break;
            }
            await firestore.collection("trailers").doc(data?.trailerId).set({
              mileage: Math.round((trailer?.mileage || 0) + (data?.distance.reduce((a: number, b: number) => a + b, 0)/1000 * trailerMultiplier)),
            }, {merge: true});
          }
        }
        if (prevData?.trailerId) {
          const prevTrailerSnapshot = await firestore.collection("trailers").doc(prevData?.trailerId).get();
          if (prevTrailerSnapshot.exists) {
            const prevTrailer = prevTrailerSnapshot.data();
            let trailerMultiplier = 1;
            switch (prevTrailer?.units) {
              case "km":
                trailerMultiplier = (units === "km") ? 1 : milesToKm;
                break;
              case "mi":
                trailerMultiplier = (units === "mi") ? 1 : kmToMiles;
                break;
              default:
                break;
            }
            const mileage = prevTrailer?.mileage ?
            prevTrailer.mileage - Math.round(prevData?.distance.reduce((a: number, b: number) => a + b, 0)/1000 * trailerMultiplier) :
            0;
            await firestore.collection("trailers").doc(prevData?.trailerId).set({
              mileage,
            }, {merge: true});
          }
        }
        await firestore.collection("vehicles").doc(vehicleId).set({
          mileage: (vehicle.mileage || 0) + (
            Math.round(
                (data?.distance.reduce((a: number, b: number) => a + b, 0) -
                prevData?.distance.reduce((a: number, b: number) => a + b, 0))/1000 *
            multiplier)
          ),
        }, {merge: true});
      }
      if (event?.data?.before.exists && !event?.data?.after.exists) {
        if (prevData?.trailerId) {
          const prevTrailerSnapshot = await firestore.collection("trailers").doc(prevData?.trailerId).get();
          if (prevTrailerSnapshot.exists) {
            const prevTrailer = prevTrailerSnapshot.data();
            let trailerMultiplier = 1;
            switch (prevTrailer?.units) {
              case "km":
                trailerMultiplier = (units === "km") ? 1 : milesToKm;
                break;
              case "mi":
                trailerMultiplier = (units === "mi") ? 1 : kmToMiles;
                break;
              default:
                break;
            }
            const mileage = prevTrailer?.mileage ?
            prevTrailer.mileage - Math.round(prevData?.distance.reduce((a: number, b: number) => a + b, 0)/1000 * trailerMultiplier) :
            0;
            await firestore.collection("trailers").doc(prevData?.trailerId).set({
              mileage,
            }, {merge: true});
          }
        }
        const mileage = vehicle.mileage ?
        vehicle.mileage - Math.round(prevData?.distance.reduce((a: number, b: number) => a + b, 0)/1000 * multiplier) :
        0;
        await firestore.collection("vehicles").doc(vehicleId).set({
          mileage: mileage > 0 ? mileage : 0,
        }, {merge: true});
      }
    });

// check if vehicle maintenance is due
export const updateVehicle = onDocumentWritten(
    "vehicles/{vehicleId}",
    async (event) => {
      const data = event?.data?.after.data();
      const prevData = event?.data?.before.data();
      const vehicleId = event.params.vehicleId;
      if (!data || data?.mileage <= prevData?.mileage) return;
      const maintenancesColl = firestore.collection("maintenances");
      const q1: Query<DocumentData> = maintenancesColl.where("vehicleId", "==", vehicleId).where("status", "==", "active");
      const querySnapshot: QuerySnapshot<DocumentData> = await q1.get();
      querySnapshot.forEach(async (maintenance) => {
        const maintenanceData = maintenance.data();
        if (Number(maintenanceData.reminderMileage) > 0 &&
        (Number(data.mileage) >= Number(maintenanceData.reminderMileage) + Number(maintenanceData?.startMileage))) {
          const settings = await firestore.collection("settings").doc(maintenanceData.userId).get();
          const locale = getLocale(settings.get("locale"));
          await maintenance.ref.set({
            status: "completed",
            completed: new Date().getTime(),
          }, {merge: true});
          const emailTo = (await auth.getUser(maintenanceData?.userId)).email;
          await firestore.collection("notifications").add({
            userId: maintenanceData?.userId,
            to: emailTo,
            message: {
              subject: maintenanceData?.type,
              html: email({
                title: maintenanceData?.type,
                message: locale.maintenanceVehicleDescription.replace("{vehicle}", data?.name),
                actionLink: `${baseUrl}vehicles/${maintenanceData.vehicleId}`,
                actionText: locale["checkVehicle"],
                locale: settings.get("locale"),
              }),
              text: maintenanceData?.type,
              description: locale.maintenanceVehicleDescription.replace("{vehicle}", data?.name),
            },
            status: "unread",
            url: `${baseUrl}vehicles/${maintenanceData.vehicleId}`,
            date: new Date().getTime(),
          });
        }
      });
    });

// check if vehicle maintenance is due
export const updateTrailer = onDocumentWritten(
    "trailers/{trailerId}",
    async (event) => {
      const data = event?.data?.after.data();
      const prevData = event?.data?.before.data();
      const trailerId = event.params.trailerId;
      if (!data || data?.mileage <= prevData?.mileage) return;
      const maintenancesColl = firestore.collection("maintenances");
      const q1: Query<DocumentData> = maintenancesColl.where("vehicleId", "==", trailerId).where("status", "==", "active");
      const querySnapshot: QuerySnapshot<DocumentData> = await q1.get();
      querySnapshot.forEach(async (maintenance) => {
        const maintenanceData = maintenance.data();
        if (Number(maintenanceData.reminderMileage) > 0 &&
        (Number(data.mileage) >= Number(maintenanceData.reminderMileage) + Number(maintenanceData?.startMileage))) {
          const settings = await firestore.collection("settings").doc(maintenanceData.userId).get();
          const locale = getLocale(settings.get("locale"));
          await maintenance.ref.set({
            status: "completed",
            completed: new Date().getTime(),
          }, {merge: true});
          const emailTo = (await auth.getUser(maintenanceData?.userId)).email;
          await firestore.collection("notifications").add({
            userId: maintenanceData?.userId,
            to: emailTo,
            message: {
              subject: maintenanceData?.type,
              html: email({
                title: maintenanceData?.type,
                message: locale.maintenanceTrailerDescription.replace("{trailer}", data?.name),
                actionLink: `${baseUrl}trailers/${maintenanceData.vehicleId}`,
                actionText: locale["checkTrailer"],
                locale: settings.get("locale"),
              }),
              text: maintenanceData?.type,
              description: locale.maintenanceTrailerDescription.replace("{trailer}", data?.name),
            },
            status: "unread",
            url: `${baseUrl}trailers/${maintenanceData.vehicleId}`,
            date: new Date().getTime(),
          });
        }
      });
    });

export const scheduleMaintenance = onSchedule("every day 00:00", async () => {
  const maintenancesColl = firestore.collection("maintenances");
  const q1: Query<DocumentData> = maintenancesColl.where("reminderDate", "<=", new Date().getTime());
  const querySnapshot: QuerySnapshot<DocumentData> = await q1.get();
  querySnapshot.forEach(async (maintenance) => {
    const maintenanceData = maintenance.data();
    await maintenance.ref.set({
      dateStatus: "completed",
      dateCompleted: new Date().getTime(),
    }, {merge: true});
    if (!maintenanceData.reminderDate || maintenanceData.dateStatus === "completed") return;
    const user = await auth.getUser(maintenanceData?.userId);
    const settings = await firestore.collection("settings").doc(maintenanceData.userId).get();
    const vehicle = await firestore.collection(maintenanceData.isTrailer ? "trailers" : "vehicles").doc(maintenanceData.vehicleId).get();
    const locale = getLocale(settings.get("locale"));
    await firestore.collection("notifications").add({
      userId: maintenanceData?.userId,
      to: user.email,
      message: {
        subject: maintenanceData?.type,
        html: email({
          title: maintenanceData?.type,
          message: maintenanceData.isTrailer ?
            locale.maintenanceTrailerDateDescription.replace("{trailer}", vehicle.get("name")) :
            locale.maintenanceVehicleDateDescription.replace("{vehicle}", vehicle.get("name")),
          actionLink: `${baseUrl}${maintenanceData.isTrailer ? "trailers" : "vehicles"}/${maintenanceData.vehicleId}`,
          actionText: maintenanceData.isTrailer ? locale["checkTrailer"] : locale["checkVehicle"],
          locale: settings.get("locale"),
        }),
        text: maintenanceData?.type,
        description: maintenanceData.isTrailer ?
        locale.maintenanceTrailerDateDescription.replace("{trailer}", vehicle.get("name")) :
        locale.maintenanceVehicleDateDescription.replace("{vehicle}", vehicle.get("name")),
      },
      status: "unread",
      url: `${baseUrl}${maintenanceData.isTrailer ? "trailers" : "vehicles"}/${maintenanceData.vehicleId}`,
      date: new Date().getTime(),
    });
  });
});
