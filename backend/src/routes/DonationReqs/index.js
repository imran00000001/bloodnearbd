const express = require("express");
const bloodDonation = require("../../models/bloodDonation");
const users = require("../../models/user");
const { sendPushToUser } = require("../../utils/push");
const { sendSMS, SMS_COST_PER_MESSAGE } = require("../../utils/sms");
const verifyToken = require('../../middlewares/verifyToken')


var router = express.Router();

//post donoReqs
router.post("/donationReqs", async (req, res) => {
  const donationReq = req.body;

  const result = await bloodDonation.create(donationReq);
  console.log(result);
  res.send(result);

  // fire-and-forget: notify nearby eligible donors, doesn't block the response
  notifyEligibleDonors(donationReq).catch((err) =>
    console.error("notifyEligibleDonors failed:", err)
  );
});

// HARD_MAX prevents an accidental/abusive request from notifying (or "SMS-ing")
// an unreasonably large number of people no matter what the client sends.
const HARD_MAX_NOTIFY = 100;

// finds donors who: have the matching blood group, are in the same district,
// and either never donated or haven't donated in the last 4 months.
// `notifyLimit` and `notifyChannel` come from the requester's own choice
// (set on the donation request form), capped by HARD_MAX_NOTIFY.
const notifyEligibleDonors = async (donationReq) => {
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

  const requestedLimit = parseInt(donationReq.notifyLimit) || 15;
  const notifyLimit = Math.min(Math.max(requestedLimit, 1), HARD_MAX_NOTIFY);
  const channel = donationReq.notifyChannel || "push"; // "push" | "sms" | "both"

  const eligibleDonors = await users
    .find({
      role: "Donor",
      status: "Active",
      blood: donationReq.blood,
      districts: donationReq.districts,
      $or: [
        { lastDonationDate: null },
        { lastDonationDate: { $lte: fourMonthsAgo } },
      ],
    })
    .limit(notifyLimit);

  const message = `জরুরি রক্তের প্রয়োজন: ${donationReq.blood} - ${donationReq.hospitalInfo || ""}. Blood Donation App এ বিস্তারিত দেখুন।`;
  const pushPayload = {
    title: "জরুরি রক্তের প্রয়োজন",
    body: `${donationReq.blood} রক্তের প্রয়োজন - ${donationReq.hospitalInfo || ""}`,
    url: "/donationRequest",
  };

  let pushSent = 0;
  let smsSent = 0;

  for (const donor of eligibleDonors) {
    if (channel === "push" || channel === "both") {
      if (donor.pushSubscriptions?.length) {
        await sendPushToUser(donor, pushPayload);
        pushSent++;
      }
    }
    if (channel === "sms" || channel === "both") {
      const smsResult = await sendSMS(donor.phone, message);
      if (!smsResult.skipped && !smsResult.error) smsSent++;
    }
  }

  console.log(
    `Notify summary for ${donationReq.blood} request: ${eligibleDonors.length} eligible donor(s) found, ` +
    `push sent to ${pushSent}, sms sent to ${smsSent} (~${smsSent * SMS_COST_PER_MESSAGE} BDT).`
  );
};

// admin get donor request
router.get("/admin/donationReqs", verifyToken, async (req, res) => {
  const { page, limit } = req.query;
  const result = await bloodDonation.find().skip((page - 1) * limit).limit(limit);
  res.send(result);
});

//user get donation request list

router.get("/donationsReqs/:email", verifyToken, async (req, res) => {
  const { page, limit } = req.query;
  const result = await bloodDonation.find({ requesterEmail: req.params.email }).skip((page - 1) * limit).limit(limit);
  res.send(result);
});
//user get donation req for donor home page
router.get("/donationsReqHome/:email", verifyToken, async (req, res) => {

  const result = await bloodDonation.find({ requesterEmail: req.params.email }).limit(3);
  res.send(result);
});

//user get donation singledata for update
router.get('/donationReq/:id', async (req, res) => {
  const result = await bloodDonation.findOne({ _id: req.params.id })
  res.send(result)
})

//user donation req updated single data

router.patch('/donationReqs/:id', async (req, res) => {
  const updateData = req.body
  const result = await bloodDonation.updateOne({ _id: req.params.id }, {
    $set: {
      requesterName: updateData.requesterName,
      requesterEmail: updateData.requesterEmail,
      recipientName: updateData.recipientName,
      blood: updateData.blood,
      districts: updateData.districts,
      upuzlia: updateData.upuzlia,
      hospitalInfo: updateData.hospitalInfo,
      donorReqAddress: updateData.donorReqAddress,
      donateDate: updateData.donateDate,
      donateTime: updateData.donateTime,
      reqMessage: updateData.reqMessage,
      donationStatus: "pending",
    },


  })

  res.send(result);
})




//public get donation details table

router.get("/donationDetails/:id", async (req, res) => {
  const result = await bloodDonation.findOne({ _id: req.params.id });

  res.send(result);
});

//donation pending req card for public view

router.get("/donationReqPending", async (req, res) => {
  const result = await bloodDonation.find({ donationStatus: "pending" });
  res.send(result);
});

//donation submit by donor

router.patch("/donorDataInDonation/:id", async (req, res) => {
  const donor = req.body;
  const result = await bloodDonation.updateOne(
    { _id: req.params.id },
    {
      $set: {
        donorName: donor?.donorName,
        donorEmail: donor?.donorEmail,
        donationStatus: "inprogress",
      },
    }
  );

  res.send(result);
});

//donation request update status inprogres done for in
router.patch("/donationDone/:id", async (req, res) => {
  const result = await bloodDonation.updateOne(
    { _id: req.params.id },
    {
      $set: {
        donationStatus: "done",
      },
    }
  );

  // record this as the donor's last donation date so they won't be
  // asked again for the next 4 months
  const donationDoc = await bloodDonation.findOne({ _id: req.params.id });
  if (donationDoc?.donorEmail) {
    await users.updateOne(
      { email: donationDoc.donorEmail },
      { $set: { lastDonationDate: new Date() } }
    );
  }

  console.log(result);
  res.send(result);
});
//donation request update status cancel
router.patch("/donationReqInCancel/:id", async (req, res) => {
  const result = await bloodDonation.updateOne(
    { _id: req.params.id },
    {
      $set: {
        donationStatus: "cancel",
      },
    }
  );


  res.send(result);
});

// donaorReq Delete

router.delete("/donorReqDelete/:id", async (req, res) => {
  const result = await bloodDonation.deleteOne({ _id: req.params.id });
  res.send(result)
});

module.exports = router;
