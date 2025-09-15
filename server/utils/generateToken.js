const jwt = require("jsonwebtoken");

exports.generateToken = (payload, role) => {
  const expiresIn = role === "admin" ? "1h" : "7d";
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
};
