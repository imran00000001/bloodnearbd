const mongoose = require("mongoose");

const bloodDonationSchema = new mongoose.Schema({
  requesterName: {
    type: String,
    require: true,
  },
  requesterEmail: {
    type: String,
    require: true,
  },
  recipientName: {
    type: String,
    require: true,
  },
  blood: {
    type: String,
    require: true,
  },
  districts: {
    type: String,
    require: true,
  },
  upuzlia: {
    type: String,
    require: true,
  },
  hospitalInfo: {
    type: String,
    require: true,
  },
  donorReqAddress: {
    type: String,
    require: true,
  },
  donateDate: {
    type: String,
    require: true,
  },
  donateTime: {
    type: String,
    require: true,
  },
  reqMessage: {
    type: String,
  },
  donorName: {
    type: String,
  },
  donorEmail: {
    type: String,
  },
  donationStatus: {
    type: String,
    enum: ["pending", "inprogress", "done", "cancel"],
  },
  notifyLimit: {
    type: Number,
    default: 15,
  },
  notifyChannel: {
    type: String,
    enum: ["push", "sms", "both"],
    default: "push",
  },
});

const bloodDonation = mongoose.model("donationReqs", bloodDonationSchema);

module.exports = bloodDonation;
