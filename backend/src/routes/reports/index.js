var express = require("express");
const report = require("../../models/report");
const verifyToken = require("../../middlewares/verifyToken");

var router = express.Router();

// anyone logged in can report a donor (with an optional photo proof URL,
// uploaded to imgbb on the frontend first, same as profile pictures)
router.post("/reports", async (req, res) => {
  const reportData = req.body;
  const result = await report.create(reportData);
  res.send(result);
});

// admin-only: view all reports
router.get("/reports", verifyToken, async (req, res) => {
  const result = await report.find().sort({ createdAt: -1 });
  res.send(result);
});

// admin marks a report as reviewed
router.patch("/reports/:id", verifyToken, async (req, res) => {
  const result = await report.updateOne(
    { _id: req.params.id },
    { $set: { status: "reviewed" } }
  );
  res.send(result);
});

module.exports = router;
