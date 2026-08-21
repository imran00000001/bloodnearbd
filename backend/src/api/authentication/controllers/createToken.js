var jwt = require("jsonwebtoken");
const generateToken = require("../../../utils/generateToken");
require("dotenv").config();

const createToken = async (req, res, next) => {
  const user = req.body;

  const token = generateToken(user);

  res.send({ token });
};

module.exports = createToken;
