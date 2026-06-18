// controllers/visitController.js
const Visit = require("../models/Visit");
const Property = require("../models/Property");
const mongoose = require("mongoose");

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

    if (!mongoose.Types.ObjectId.isValid(property_id)) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Check property exists
    const prop = await Property.findById(property_id);
    if (!prop) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const visit = await Visit.create({
      property_id,
      user_id: req.user?.id || null,
      name,
      phone: phone || null,
      visit_date: new Date(visit_date),
      visit_time: visit_time || null,
    });

    res.status(201).json({
      success: true,
      message: "Visit scheduled! The owner will confirm shortly.",
      visit_id: visit.id,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/visits
exports.getVisits = async (req, res, next) => {
  try {
    let visits;

    if (req.user.role === "admin") {
      visits = await Visit.find()
        .populate("property_id", "title")
        .sort({ visit_date: -1 });
    } else {
      visits = await Visit.find({ user_id: req.user.id })
        .populate("property_id", "title")
        .sort({ visit_date: -1 });
    }

    const formatted = visits.map((v) => {
      const plain = v.toJSON();
      return {
        ...plain,
        property_title: v.property_id ? v.property_id.title : null,
        property_id: v.property_id ? v.property_id.id : null,
      };
    });

    res.json({
      success: true,
      visits: formatted,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/visits/:id/status
exports.updateVisitStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid visit ID" });
    }

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be: pending, confirmed, or cancelled",
      });
    }

    const visit = await Visit.findByIdAndUpdate(id, { status }, { new: true });

    if (!visit) {
      return res.status(404).json({ success: false, message: "Visit not found" });
    }

    res.json({
      success: true,
      message: "Visit status updated",
    });
  } catch (err) {
    next(err);
  }
};