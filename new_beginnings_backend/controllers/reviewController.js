// controllers/reviewController.js
const Review = require("../models/Review");
const Property = require("../models/Property");
const mongoose = require("mongoose");

// GET /api/reviews/testimonials
exports.getTestimonials = async (req, res, next) => {
  try {
    const reviews = await Review.find({ property_id: null })
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({ success: true, reviews });
  } catch (err) {
    next(err);
  }
};

// GET /api/reviews/:property_id
exports.getPropertyReviews = async (req, res, next) => {
  try {
    const { property_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(property_id)) {
      return res.status(400).json({ success: false, message: "Invalid property ID" });
    }

    const reviews = await Review.find({ property_id })
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (err) {
    next(err);
  }
};

// POST /api/reviews/:property_id
exports.createReview = async (req, res, next) => {
  try {
    const { rating, review_text, role_label } = req.body;
    const propId = req.params.property_id;

    if (!rating || !review_text) {
      return res.status(400).json({
        success: false,
        message: "rating and review_text are required",
      });
    }

    const ratingNum = Number(rating);
    if (ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        success: false,
        message: "rating must be between 1 and 5",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(propId)) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Check property exists
    const prop = await Property.findById(propId);

    if (!prop) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const name = `${req.user.first_name} ${req.user.last_name}`;

    // Insert review
    await Review.create({
      property_id: propId,
      user_id: req.user.id,
      name,
      role_label: role_label || "Member",
      rating: ratingNum,
      review_text,
    });

    // Recalculate rating
    const statsResult = await Review.aggregate([
      { $match: { property_id: new mongoose.Types.ObjectId(propId) } },
      {
        $group: {
          _id: "$property_id",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const avgRating = statsResult[0] ? statsResult[0].avgRating : ratingNum;
    const count = statsResult[0] ? statsResult[0].count : 1;

    await Property.findByIdAndUpdate(propId, {
      rating: Number(parseFloat(avgRating).toFixed(2)),
      review_count: count,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
    });
  } catch (err) {
    next(err);
  }
};