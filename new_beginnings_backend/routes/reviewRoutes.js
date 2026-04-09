// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const { getTestimonials, getPropertyReviews, createReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

router.get("/testimonials",         getTestimonials);
router.get("/:property_id",         getPropertyReviews);
router.post("/:property_id",        protect, createReview);

module.exports = router;
