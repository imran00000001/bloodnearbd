const { Schema, model } = require("mongoose");

const upuzilaSchema = new Schema({
  district_id: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  bn_name: {
    type: String,
    require: true,
  },
  lat: {
    type: String,
    require: true,
  },
  lon: {
    type: String,
    require: true,
  },
  url: {
    type: String,
    require: true,
  },
});

const upuzilas = model("upuzila", upuzilaSchema);

module.exports = upuzilas;
