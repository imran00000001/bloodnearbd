const express = require("express");
const users = require("../../models/user");
const { sendPushToUser } = require("../../utils/push");

const router = express.Router();

// frontend calls this to get the public key needed to subscribe
router.get("/push/vapidPublicKey", (req, res) => {
  res.send({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// save a donor's browser push subscription against their account
router.post("/push/subscribe", async (req, res) => {
  const { email, subscription } = req.body;
  if (!email || !subscription?.endpoint) {
    return res.status(400).send({ message: "email and subscription are required" });
  }

  const result = await users.updateOne(
    { email },
    { $addToSet: { pushSubscriptions: subscription } }
  );

  res.send(result);
});

// remove a subscription (e.g. user turned off notifications)
router.post("/push/unsubscribe", async (req, res) => {
  const { email, endpoint } = req.body;
  if (!email || !endpoint) {
    return res.status(400).send({ message: "email and endpoint are required" });
  }

  const result = await users.updateOne(
    { email },
    { $pull: { pushSubscriptions: { endpoint } } }
  );

  res.send(result);
});

// someone found a donor in search and wants to alert them directly
// (separate from the automatic "new donation request" notification)
router.post("/push/notify-donor", async (req, res) => {
  const { donorEmail, requesterName, message } = req.body;
  if (!donorEmail) {
    return res.status(400).send({ message: "donorEmail is required" });
  }

  const donor = await users.findOne({ email: donorEmail });
  if (!donor) {
    return res.status(404).send({ message: "donor not found" });
  }
  if (!donor.pushSubscriptions?.length) {
    return res.status(400).send({ message: "this donor has not enabled notifications" });
  }

  await sendPushToUser(donor, {
    title: "কেউ আপনাকে খুঁজছেন",
    body: message || `${requesterName || "একজন"} আপনার সাথে যোগাযোগ করতে চান।`,
    url: "/dashboard",
  });

  res.send({ success: true });
});

module.exports = router;
