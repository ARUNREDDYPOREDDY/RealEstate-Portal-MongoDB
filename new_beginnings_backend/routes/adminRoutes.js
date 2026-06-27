const express = require("express");
const router = express.Router();

const {
  getStats,
  getUsers,
  getPendingProperties,
  promoteUser,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/auth");

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.get("/pending-properties", getPendingProperties);
router.post("/promote", promoteUser);

module.exports = router;