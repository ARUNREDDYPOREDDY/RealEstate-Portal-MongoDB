// routes/visitRoutes.js
const express = require("express");
const router = express.Router();
const { scheduleVisit, getVisits, updateVisitStatus } = require("../controllers/visitController");
const { protect, optionalAuth, adminOnly } = require("../middleware/auth");

router.post("/",                optionalAuth, scheduleVisit);
router.get("/",                 protect,      getVisits);
router.patch("/:id/status",     protect,      adminOnly, updateVisitStatus);

module.exports = router;
