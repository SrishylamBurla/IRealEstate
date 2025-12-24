// import Notification from "../models/Notification.js";
// import { emitNotification } from "../../socket.js";

// export const createNotification = async ({
//   userId,
//   title,
//   message,
//   type,
//   propertyId,
// }) => {
//   const notification = await Notification.create({
//     user: userId,
//     title,
//     message,
//     type,
//     property: propertyId,
//   });

//   // ⚡ REAL-TIME EMIT
//   emitNotification(userId, notification);

//   return notification;
// };


import PushSubscription from "../models/PushSubscription.js";
import { sendPush } from "./push.js";

const sub = await PushSubscription.findOne({ user: userId });

if (sub) {
  await sendPush(sub.subscription, {
    title,
    body: message,
    url: `/properties/${propertyId}`,
  });
}
