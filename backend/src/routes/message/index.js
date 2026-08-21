var express = require("express");
const message = require("../../models/messages");



var router = express.Router();


router.post("/msg", async (req, res) => {
    const msgData = req.body;

    const result = await message.create(msgData);
    console.log(result);
    res.send(result);
});
router.get("/msg", async (req, res) => {


    const result = await message.find();
    console.log(result);
    res.send(result);
});


module.exports = router;
