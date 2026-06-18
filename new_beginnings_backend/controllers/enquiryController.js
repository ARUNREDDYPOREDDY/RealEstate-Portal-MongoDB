// controllers/enquiryController.js
const Enquiry = require("../models/Enquiry");
const Property = require("../models/Property");
const mongoose = require("mongoose");

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

    // Insert enquiry
    const enquiry = await Enquiry.create({
      property_id,
      user_id: req.user?.id || null,
      name,
      email,
      phone: phone || null,
      message: message || null,
    });

    res.status(201).json({
      success: true,
      message: "Enquiry sent! The owner will contact you soon.",
      enquiry_id: enquiry.id,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/enquiries
exports.getEnquiries = async (req, res, next) => {
  try {
    let enquiries;

    if (req.user.role === "admin") {
      enquiries = await Enquiry.find()
        .populate("property_id", "title city")
        .sort({ createdAt: -1 });
    } else {
      enquiries = await Enquiry.find({ user_id: req.user.id })
        .populate("property_id", "title city")
        .sort({ createdAt: -1 });
    }

    // Format output to match Postgres keys (property_title, property_city)
    const formatted = enquiries.map((e) => {
      const plain = e.toJSON();
      return {
        ...plain,
        property_title: e.property_id ? e.property_id.title : null,
        property_city: e.property_id ? e.property_id.city : null,
        property_id: e.property_id ? e.property_id.id : null,
        date: e.createdAt.toLocaleDateString("en-IN"),
      };
    });

    res.json({
      success: true,
      enquiries: formatted,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/enquiries/:id/status
exports.updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid enquiry ID" });
    }

    if (!["new", "read", "replied"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be: new, read, or replied",
      });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(id, { status }, { new: true });

    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    res.json({
      success: true,
      message: "Enquiry status updated",
    });
  } catch (err) {
    next(err);
  }
};