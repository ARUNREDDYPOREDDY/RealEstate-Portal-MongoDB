const pool = require("../config/db");

// STATS
exports.getStats = async (req, res, next) => {
  try {
    const total_properties = (await pool.query("SELECT COUNT(*) FROM properties")).rows[0].count;
    const total_users = (await pool.query("SELECT COUNT(*) FROM users")).rows[0].count;

    res.json({
      success: true,
      stats: { total_properties, total_users }
    });
  } catch (err) { next(err); }
};

// USERS
exports.getUsers = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY created_at DESC");
    res.json({ success: true, users: result.rows });
  } catch (err) { next(err); }
};

// PENDING PROPERTIES
exports.getPendingProperties = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM properties WHERE status='pending'"
    );
    res.json({ success: true, properties: result.rows });
  } catch (err) { next(err); }
};