// controllers/adminController.js
const Property = require("../models/Property");
const User = require("../models/User");

// STATS
exports.getStats = async (req, res, next) => {
  try {
    const total_properties = await Property.countDocuments();
    const total_users = await User.countDocuments();

    res.json({
      success: true,
      stats: { total_properties, total_users },
    });
  } catch (err) {
    next(err);
  }
};

// USERS
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

// PENDING PROPERTIES
exports.getPendingProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json({ success: true, properties });
  } catch (err) {
    next(err);
  }
};