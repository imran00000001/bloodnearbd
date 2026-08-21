const { Schema, model } = require("mongoose");

const msgSchema = new Schema({
    text: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
    },
    userEmail: {
        type: String,
        require: true,
    },
    photoUrl: {
        type: String,
        require: true,
    },

});

const message = model("messages", msgSchema);

module.exports = message;