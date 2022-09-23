const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, "newsAPI");
    // iat: Math.floor(Date.now() / 1000) - 30 }
    const user = await User.findById({ _id: decode._id });
    req.user = user
    next();
  } catch (err) {
    res.send(err.message);
  }
};

module.exports = auth;
