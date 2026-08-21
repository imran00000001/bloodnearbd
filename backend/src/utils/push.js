const webpush = require("web-push");

// Guard: only configure web-push if VAPID keys are actually set.
// Without this, missing keys crash the whole server at startup, the
// same way an empty Stripe key did (see routes/fund/index.js).
const vapidConfigured = Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);

if (vapidConfigured) {
  webpush.setVapidDetails(
    "mailto:admin@blooddonation.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} else {
  console.warn("VAPID keys not set — push notifications are disabled until VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY are added to .env");
}

// Sends a push notification to a single user's saved subscriptions.
// If a subscription has expired/unsubscribed (410/404 response), it is removed.
const sendPushToUser = async (userDoc, payload) => {
  if (!vapidConfigured) return;
  if (!userDoc?.pushSubscriptions?.length) return;

  const users = require("../models/user");
  const stillValid = [];

  for (const sub of userDoc.pushSubscriptions) {
    try {
      await webpush.sendNotification(sub, JSON.stringify(payload));
      stillValid.push(sub);
    } catch (err) {
      if (err.statusCode !== 410 && err.statusCode !== 404) {
        stillValid.push(sub);
      }
      console.warn("Push failed for one subscription:", err.statusCode || err.message);
    }
  }

  if (stillValid.length !== userDoc.pushSubscriptions.length) {
    await users.updateOne({ _id: userDoc._id }, { $set: { pushSubscriptions: stillValid } });
  }
};

module.exports = { webpush, sendPushToUser };
