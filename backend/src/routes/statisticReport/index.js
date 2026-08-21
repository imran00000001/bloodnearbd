const express = require("express");

const fund = require('../../models/fund');
const bloodDonation = require("../../models/bloodDonation");
const user = require("../../models/user");
var router = express.Router();


//get total fund amount 
router.get('/totalFund', async (req, res) => {
    const result = await fund.aggregate([
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" }
            }
        }
    ])

    const totalAmount = result[0] ? result[0].totalAmount : 0;
    console.log("total fund", totalAmount);

    res.send({ totalAmount: totalAmount })

})


// get total blood donation request

router.get('/statictisData', async (req, res) => {
    const donationTotalReq = await bloodDonation.estimatedDocumentCount()
    const totalUsers = await user.estimatedDocumentCount()

    const totalFund = await fund.aggregate([
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" }
            }
        }
    ])

    const totalFundAmount = totalFund[0] ? totalFund[0].totalAmount : 0;

    res.send({ donationTotalReq, totalFundAmount, totalUsers })
})



module.exports = router