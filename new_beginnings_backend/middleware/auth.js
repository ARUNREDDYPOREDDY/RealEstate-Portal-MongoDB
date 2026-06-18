// middleware/auth.js — JWT authentication & role guards
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Verifies the JWT from the Authorization header.
 * Attaches req.user = User document on success.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated — no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || !user.is_active) {
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists or is deactivated" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

/** Optional auth — attaches req.user if a valid token is present, otherwise continues as guest */
const optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user && user.is_active) {
      req.user = user;
    }
  } catch (_) {
    /* ignore — treat as guest */
  }
  next();
};

/** Restrict access to admin role only (must be used after protect) */
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Access denied — Admin only" });
  }
  next();
};

module.exports = { protect, optionalAuth, adminOnly };
