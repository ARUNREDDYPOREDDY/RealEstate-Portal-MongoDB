const express = require("express");
const router = express.Router();

const {
  getStats,
  getUsers,
  getPendingProperties,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/auth");

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.get("/pending-properties", getPendingProperties);

module.exports = router;