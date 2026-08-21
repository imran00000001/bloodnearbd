var express = require("express");
const districts = require("../../models/Districts");

var router = express.Router();

//get districts data

router.get("/districts", async (req, res) => {

  const cursor = await districts.find();
  res.send(cursor)
});


module.exports = router;




// for insert many
// router.get("/district", async (req, res) => {
//   const district = await districts.insertMany()
//   // const cursor = await districts.find();
//   res.send(district)
// });



// (err, data) => {
//     if (err) {
//       res.status(500).json({
//         error: "there was a server side error",
//       });
//     } else {
//       res.status(200).json({
//         result: data,
//         message: "Get Data Successfully",
//       });
//     }
//   }
