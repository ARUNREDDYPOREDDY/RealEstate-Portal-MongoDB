// controllers/visitController.js
const pool = require("../config/db");

// POST /api/visits
exports.scheduleVisit = async (req, res, next) => {
  try {
    const { property_id, name, phone, visit_date, visit_time } = req.body;

    if (!property_id || !name || !visit_date) {
      return res.status(400).json({
        success: false,
        message: "property_id, name and visit_date are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO visits (property_id, user_id, name, phone, visit_date, visit_time)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        property_id,
        req.user?.id || null,
        name,
        phone || null,
        visit_date,
        visit_time || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Visit scheduled! The owner will confirm shortly.",
      visit_id: result.rows[0].id,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/visits
exports.getVisits = async (req, res, next) => {
  try {
    let query, params;

    if (req.user.role === "admin") {
      query = `
        SELECT v.*, p.title AS property_title
        FROM visits v
        LEFT JOIN properties p ON p.id = v.property_id
        ORDER BY v.visit_date DESC
      `;
      params = [];
    } else {
      query = `
        SELECT v.*, p.title AS property_title
        FROM visits v
        LEFT JOIN properties p ON p.id = v.property_id
        WHERE v.user_id = $1
        ORDER BY v.visit_date DESC
      `;
      params = [req.user.id];
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      visits: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/visits/:id/status
exports.updateVisitStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be: pending, confirmed, or cancelled",
      });
    }

    await pool.query(
      "UPDATE visits SET status = $1 WHERE id = $2",
      [status, req.params.id]
    );

    res.json({
      success: true,
      message: "Visit status updated",
    });
  } catch (err) {
    next(err);
  }
};