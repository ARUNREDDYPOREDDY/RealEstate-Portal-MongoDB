// controllers/favoriteController.js
const Favorite = require("../models/Favorite");
const Property = require("../models/Property");
const mongoose = require("mongoose");

// GET /api/favorites
exports.getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user_id: req.user.id })
      .populate({
        path: "property_id",
        match: { status: "active" },
      })
      .sort({ createdAt: -1 });

    // Filter out favorites whose property is not found or not active (which returns null after populate match)
    const validFavorites = favorites
      .filter((f) => f.property_id !== null)
      .map((f) => {
        const prop = f.property_id.toJSON();
        return {
          ...prop,
          saved_at: f.createdAt,
        };
      });

    res.json({ success: true, favorites: validFavorites });
  } catch (err) {
    next(err);
  }
};

// POST /api/favorites/:property_id
exports.addFavorite = async (req, res, next) => {
  try {
    const { property_id } = req.params;

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

    // Insert or do nothing on conflict
    await Favorite.findOneAndUpdate(
      { user_id: req.user.id, property_id },
      { user_id: req.user.id, property_id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      success: true,
      message: "Added to favorites",
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/favorites/:property_id
exports.removeFavorite = async (req, res, next) => {
  try {
    const { property_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(property_id)) {
      return res.status(400).json({ success: false, message: "Invalid property ID" });
    }

    await Favorite.deleteOne({ user_id: req.user.id, property_id });

    res.json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/favorites/ids
exports.getFavoriteIds = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user_id: req.user.id }).select("property_id");

    res.json({
      success: true,
      ids: favorites.map((r) => r.property_id.toString()),
    });
  } catch (err) {
    next(err);
  }
};