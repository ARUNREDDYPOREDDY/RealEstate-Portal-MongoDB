// controllers/reviewController.js
const pool = require("../config/db");

// GET /api/reviews/testimonials
exports.getTestimonials = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM reviews WHERE property_id IS NULL ORDER BY created_at DESC LIMIT 6"
    );

    res.json({ success: true, reviews: result.rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/reviews/:property_id
exports.getPropertyReviews = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM reviews WHERE property_id = $1 ORDER BY created_at DESC",
      [req.params.property_id]
    );

    res.json({ success: true, reviews: result.rows });
  } catch (err) {
    next(err);
  }
};

// POST /api/reviews/:property_id
exports.createReview = async (req, res, next) => {
  try {
    const { rating, review_text, role_label } = req.body;

    if (!rating || !review_text) {
      return res.status(400).json({
        success: false,
        message: "rating and review_text are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "rating must be between 1 and 5",
      });
    }

    const propId = req.params.property_id;

    // Check property exists
    const prop = await pool.query(
      "SELECT id FROM properties WHERE id = $1",
      [propId]
    );

    if (!prop.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const name = `${req.user.first_name} ${req.user.last_name}`;

    // Insert review
    await pool.query(
      `INSERT INTO reviews (property_id, user_id, name, role_label, rating, review_text)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        propId,
        req.user.id,
        name,
        role_label || "Member",
        rating,
        review_text,
      ]
    );

    // Recalculate rating
    const statsResult = await pool.query(
      "SELECT AVG(rating) AS avg_rating, COUNT(*) AS cnt FROM reviews WHERE property_id = $1",
      [propId]
    );

    const avgRating = statsResult.rows[0].avg_rating;
    const count = statsResult.rows[0].cnt;

    await pool.query(
      "UPDATE properties SET rating = $1, review_count = $2 WHERE id = $3",
      [parseFloat(avgRating).toFixed(2), count, propId]
    );

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
    });
  } catch (err) {
    next(err);
  }
};