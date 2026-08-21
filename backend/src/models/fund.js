const { Schema, model } = require("mongoose");

const fundSchema = new Schema({
    funderName: {
        type: String,
        require: true,
    },
    funderEmail: {
        type: String,
        require: true,
    },
    funderCompany: {
        type: String,
        require: true,
    },
    funderLogo: {
        type: String,
        require: true,
    },
    transactionId: {
        type: String,
        require: true,
    },
    date: {
        type: String,
        require: true,
    },
    amount: {
        type: Number,
        require: true,
    },
    status: {
        type: String,
        require: true,
    },
});

const fund = model("funds", fundSchema);

module.exports = fund;