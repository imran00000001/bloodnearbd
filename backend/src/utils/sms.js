/**
 * SMS sending utility.
 *
 * Right now this runs in MOCK mode: no SMS is actually sent, no cost is
 * incurred, and no API key is required. It only logs what would have been
 * sent. Once the project is approved and you sign up with a gateway
 * (e.g. BulkSMSBD, SSL Wireless, Alpha SMS), add these to your .env:
 *
 *   SMS_API_URL=<gateway's send-sms endpoint>
 *   SMS_API_KEY=<your api key>
 *   SMS_SENDER_ID=<your approved sender id, if the gateway requires one>
 *
 * ...and fill in the real request inside sendSMS() below (each gateway's
 * request format is slightly different, so check their docs when you get
 * there — the mock stays as a safe fallback if the keys are missing).
 */

const axios = require("axios");

const SMS_API_URL = process.env.SMS_API_URL || null;
const SMS_API_KEY = process.env.SMS_API_KEY || null;
const SMS_SENDER_ID = process.env.SMS_SENDER_ID || null;

const SMS_COST_PER_MESSAGE = 1; // taka, adjust to your gateway's actual rate

const sendSMS = async (phone, message) => {
  if (!phone) return { skipped: true, reason: "no phone number on file" };

  if (!SMS_API_URL || !SMS_API_KEY) {
    console.log(`[SMS-MOCK] Would send to ${phone}: "${message}" (~${SMS_COST_PER_MESSAGE} BDT)`);
    return { mocked: true, phone, message, cost: SMS_COST_PER_MESSAGE };
  }

  try {
    // --- Example integration (uncomment & adjust for your chosen gateway) ---
    // const res = await axios.post(SMS_API_URL, {
    //   api_key: SMS_API_KEY,
    //   senderid: SMS_SENDER_ID,
    //   number: phone,
    //   message,
    // });
    // return res.data;

    console.log(`[SMS] Gateway configured but integration code not filled in yet.`);
    return { skipped: true, reason: "integration not implemented" };
  } catch (err) {
    console.error("SMS send failed:", err.message);
    return { error: err.message };
  }
};

module.exports = { sendSMS, SMS_COST_PER_MESSAGE };
