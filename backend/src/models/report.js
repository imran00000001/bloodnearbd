const { Schema, model } = require("mongoose");

const reportSchema = new Schema(
  {
    reporterName: { type: String, required: true },
    reporterEmail: { type: String, required: true },
    donorEmail: { type: String, required: true },
    donorName: { type: String },
    reason: { type: String, required: true },
    photoUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "reviewed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const report = model("reports", reportSchema);

module.exports = report;
