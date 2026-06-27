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

// Promote a user to admin
exports.promoteUser = async (req, res, next) => {
  try {
    const { userId, email } = req.body;

    if (!userId && !email) {
      return res.status(400).json({ success: false, message: 'Provide `userId` or `email` to promote.' });
    }

    const query = userId ? { _id: userId } : { email };
    const user = await User.findOne(query);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'admin') return res.json({ success: true, message: 'User already an admin' });

    user.role = 'admin';
    await user.save();

    res.json({ success: true, message: 'User promoted to admin', user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};