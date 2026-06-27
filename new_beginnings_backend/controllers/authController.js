// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── Helper ────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const sanitizeUser = (user) => {
  const plain = user.toJSON ? user.toJSON() : user;
  const { password, ...safe } = plain;
  return safe;
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ── POST /api/auth/register ───────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, city, password, admin_secret } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "first_name, last_name, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Check existing user
    const existing = await User.findOne({ email: email.toLowerCase() });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Allow creating an admin when a matching secret is provided
    const role = admin_secret && admin_secret === process.env.CREATE_ADMIN_SECRET ? 'admin' : undefined;

    // Insert user
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      phone: phone || null,
      city: city || null,
      password: hashed,
      role,
    });

    const token = signToken(user.id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/login ──────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const identifier = typeof email === "string" ? email.trim() : "";

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or name and password are required",
      });
    }

    const normalized = identifier.toLowerCase();
    const nameParts = normalized.split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ");

    const user = await User.findOne({
      $or: [
        { email: normalized },
        ...(firstName ? [{ first_name: { $regex: `^${escapeRegex(firstName)}$`, $options: "i" } }] : []),
        ...(firstName && lastName
          ? [{ first_name: { $regex: `^${escapeRegex(firstName)}$`, $options: "i" }, last_name: { $regex: `^${escapeRegex(lastName)}$`, $options: "i" } }]
          : []),
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email, name, or password",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = signToken(user.id);

    res.json({
      success: true,
      message: `Welcome back, ${user.first_name}!`,
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/auth/me ──────────────────────────────────────────
exports.updateMe = async (req, res, next) => {
  try {
    const { first_name, last_name, phone, city } = req.body;

    await User.findByIdAndUpdate(
      req.user.id,
      {
        first_name,
        last_name,
        phone: phone || null,
        city: city || null,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/auth/change-password ─────────────────────────────
exports.changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: "Both current and new password are required",
      });
    }

    if (new_password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    const user = await User.findById(req.user.id);

    const match = await bcrypt.compare(current_password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashed = await bcrypt.hash(new_password, 10);

    user.password = hashed;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    next(err);
  }
};