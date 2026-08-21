var express = require("express");
const upuzilas = require("../../models/Upuzila");

var router = express.Router();

//get upuzzila data

router.get("/upuzilas/:id", async (req, res) => {
  const id = req.params.id;
  const qeury = { district_id: id };
  const result = await upuzilas.find(qeury);
  res.send(result);
});

module.exports = router;
