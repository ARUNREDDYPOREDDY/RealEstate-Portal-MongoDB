// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// ── Helper ────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const sanitizeUser = (user) => {
  const { password, ...safe } = user;
  return safe;
};

// ── POST /api/auth/register ───────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, city, password } = req.body;

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
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (existing.rows.length) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, phone, city, password)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [first_name, last_name, email.toLowerCase(), phone || null, city || null, hashed]
    );

    const userId = result.rows[0].id;
    const token = signToken(userId);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: userId,
        first_name,
        last_name,
        email: email.toLowerCase(),
        phone,
        city,
        role: "user",
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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (!result.rows.length) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

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
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, phone, city, role, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/auth/me ──────────────────────────────────────────
exports.updateMe = async (req, res, next) => {
  try {
    const { first_name, last_name, phone, city } = req.body;

    await pool.query(
      `UPDATE users
       SET first_name = $1, last_name = $2, phone = $3, city = $4
       WHERE id = $5`,
      [first_name, last_name, phone || null, city || null, req.user.id]
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

    const result = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [req.user.id]
    );

    const match = await bcrypt.compare(
      current_password,
      result.rows[0].password
    );

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashed = await bcrypt.hash(new_password, 10);

    await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashed, req.user.id]
    );

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    next(err);
  }
};