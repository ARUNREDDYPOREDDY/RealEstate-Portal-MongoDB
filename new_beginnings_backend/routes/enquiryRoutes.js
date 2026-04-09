// routes/enquiryRoutes.js
const express = require("express");
const router = express.Router();
const { createEnquiry, getEnquiries, updateEnquiryStatus } = require("../controllers/enquiryController");
const { protect, optionalAuth, adminOnly } = require("../middleware/auth");

router.post("/",                    optionalAuth, createEnquiry);
router.get("/",                     protect,      getEnquiries);
router.patch("/:id/status",         protect,      adminOnly, updateEnquiryStatus);

module.exports = router;
