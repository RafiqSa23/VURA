const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error("JWT Verify Error:", error.message);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
