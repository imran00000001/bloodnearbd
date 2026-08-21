const express = require("express");
const fund = require('../../models/fund')
const verifyToken = require('../../middlewares/verifyToken')
require('dotenv').config();

// Guard: only initialize Stripe if a key is actually configured.
// Without this, an empty STRIPE_SECRET_KEY crashes the whole server at
// startup (Stripe throws inside its constructor), not just the /fund route.
const stripe = process.env.STRIPE_SECRET_KEY
    ? require('stripe')(process.env.STRIPE_SECRET_KEY)
    : null;

var router = express.Router();

router.post('/create-payment-intent', async (req, res) => {
    if (!stripe) {
        return res.status(503).send({ message: "Payment is not configured yet (missing STRIPE_SECRET_KEY)." });
    }

    const { amount } = req.body;

    // NOTE ON CURRENCY: the UI now labels/collects this amount as BDT (৳),
    // but Stripe is still told currency: "usd" here — Stripe does not support
    // settling in BDT for most accounts. That means whatever number the donor
    // types (e.g. "500") is currently charged as $500.00 USD, NOT ৳500.
    // Before going live with real payments you must either:
    //   1) convert the BDT amount to USD cents using a live exchange rate, or
    //   2) switch to a payment gateway that supports BDT (e.g. SSLCommerz,
    //      bKash, Nagad), since Stripe itself isn't available for BDT payouts
    //      in Bangladesh.
    const fundAmount = parseInt(amount * 100)
    const paymentIntent = await stripe.paymentIntents.create({
        amount: fundAmount,
        currency: "usd",
        payment_method_types: ['card'],
    })

    res.send({ clientSecret: paymentIntent.client_secret })
})

router.post('/payments', async (req, res) => {
    const payment = req.body;
    const paymentResult = await fund.create(payment)


    res.send({ paymentResult })
})

// get public fund history 

router.get('/fundHistory/:email', async (req, res) => {
    const { page, limit } = req.query;
    const result = await fund.find({ funderEmail: req.params.email }).skip((page - 1) * limit).limit(limit)

    res.send(result)
})

//get all fund history
router.get('/fundHistory', async (req, res) => {
    const { page, limit } = req.query;
    const result = await fund.find().skip((page - 1) * limit).limit(limit)

    res.send(result)
})







module.exports = router