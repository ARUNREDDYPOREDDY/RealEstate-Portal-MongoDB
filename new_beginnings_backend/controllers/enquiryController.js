// controllers/enquiryController.js
const pool = require("../config/db");

// POST /api/enquiries
exports.createEnquiry = async (req, res, next) => {
  try {
    const { property_id, name, email, phone, message } = req.body;

    if (!property_id || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "property_id, name and email are required",
      });
    }

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

    // Insert enquiry
    const result = await pool.query(
      `INSERT INTO enquiries (property_id, user_id, name, email, phone, message)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        property_id,
        req.user?.id || null,
        name,
        email,
        phone || null,
        message || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Enquiry sent! The owner will contact you soon.",
      enquiry_id: result.rows[0].id,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/enquiries
exports.getEnquiries = async (req, res, next) => {
  try {
    let query, params;

    if (req.user.role === "admin") {
      query = `
        SELECT e.*, p.title AS property_title, p.city AS property_city
        FROM enquiries e
        LEFT JOIN properties p ON p.id = e.property_id
        ORDER BY e.created_at DESC
      `;
      params = [];
    } else {
      query = `
        SELECT e.*, p.title AS property_title, p.city AS property_city
        FROM enquiries e
        LEFT JOIN properties p ON p.id = e.property_id
        WHERE e.user_id = $1
        ORDER BY e.created_at DESC
      `;
      params = [req.user.id];
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      enquiries: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/enquiries/:id/status
exports.updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["new", "read", "replied"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be: new, read, or replied",
      });
    }

    await pool.query(
      "UPDATE enquiries SET status = $1 WHERE id = $2",
      [status, req.params.id]
    );

    res.json({
      success: true,
      message: "Enquiry status updated",
    });
  } catch (err) {
    next(err);
  }
};