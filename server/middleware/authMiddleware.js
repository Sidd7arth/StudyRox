const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")) {

    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.id === "admin_id") {
        req.user = {
          _id: "admin_id",
          name: process.env.ADMIN_NAME || "Admin",
          email: process.env.ADMIN_EMAIL,
          role: "admin"
        };
      } else {
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
          throw new Error("User not found");
        }
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions"
      });
    }
    next();
  };
};