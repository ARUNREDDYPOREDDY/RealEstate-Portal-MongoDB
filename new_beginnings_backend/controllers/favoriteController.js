// controllers/favoriteController.js
const pool = require("../config/db");

// GET /api/favorites
exports.getFavorites = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT p.*, f.created_at AS saved_at
       FROM favorites f
       JOIN properties p ON p.id = f.property_id
       WHERE f.user_id = $1 AND p.status = 'active'
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );

    res.json({ success: true, favorites: result.rows });
  } catch (err) {
    next(err);
  }
};

// POST /api/favorites/:property_id
exports.addFavorite = async (req, res, next) => {
  try {
    const { property_id } = req.params;

    // Check property exists
    const prop = await pool.query(
      "SELECT id FROM properties WHERE id = $1",
      [property_id]
    );

    if (!prop.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // PostgreSQL equivalent of INSERT IGNORE
    await pool.query(
      `INSERT INTO favorites (user_id, property_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, property_id) DO NOTHING`,
      [req.user.id, property_id]
    );

    res.status(201).json({
      success: true,
      message: "Added to favorites",
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/favorites/:property_id
exports.removeFavorite = async (req, res, next) => {
  try {
    await pool.query(
      "DELETE FROM favorites WHERE user_id = $1 AND property_id = $2",
      [req.user.id, req.params.property_id]
    );

    res.json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/favorites/ids
exports.getFavoriteIds = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT property_id FROM favorites WHERE user_id = $1",
      [req.user.id]
    );

    res.json({
      success: true,
      ids: result.rows.map((r) => r.property_id),
    });
  } catch (err) {
    next(err);
  }
};