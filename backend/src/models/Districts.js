const mongoose = require("mongoose");

const districtsSchema = new mongoose.Schema({
  districtId: {
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

const districts = mongoose.model("district", districtsSchema);

module.exports = districts;
