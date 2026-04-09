const express = require("express");
const router = express.Router();

const {
  getProperties,
  getFeatured,
  getRecommended,
  getPropertyById,
  createProperty,
  updateProperty,
  updateStatus,
  deleteProperty
} = require("../controllers/propertyController");

const { protect, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");

// PUBLIC ROUTES
router.get("/", getProperties);
router.get("/featured", getFeatured);
router.get("/recommended", getRecommended);
router.get("/:id", getPropertyById);

// PROTECTED ROUTES
router.post("/", protect, upload.array("images"), createProperty);
router.put("/:id", protect, updateProperty);   // ✅ FIXED
router.patch("/:id/status", protect, adminOnly, updateStatus);
router.delete("/:id", protect, adminOnly, deleteProperty);

module.exports = router;