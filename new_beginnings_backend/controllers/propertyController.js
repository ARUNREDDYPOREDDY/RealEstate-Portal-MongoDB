// controllers/propertyController.js
const Property = require("../models/Property");
const Review = require("../models/Review");
const mongoose = require("mongoose");

// ── GET /api/properties ───────────────────────────────────────
exports.getProperties = async (req, res, next) => {
  try {
    const {
      search, type, city, min_price, max_price, beds,
      area_min, area_max, badge, status = "active",
      sort = "newest", page = 1, per_page = 8,
    } = req.query;

    const queryObj = { status };

    if (search) {
      const searchRegex = new RegExp(search, "i");
      queryObj.$or = [
        { title: searchRegex },
        { city: searchRegex },
        { locality: searchRegex }
      ];
    }

    if (type) {
      queryObj.type = type;
    }

    if (city) {
      queryObj.city = new RegExp(city, "i");
    }

    if (min_price || max_price) {
      queryObj.price = {};
      if (min_price) queryObj.price.$gte = Number(min_price);
      if (max_price) queryObj.price.$lte = Number(max_price);
    }

    if (beds) {
      if (beds === "4+") {
        queryObj.beds = { $gte: 4 };
      } else {
        queryObj.beds = Number(beds);
      }
    }

    if (area_min || area_max) {
      queryObj.area = {};
      if (area_min) queryObj.area.$gte = Number(area_min);
      if (area_max) queryObj.area.$lte = Number(area_max);
    }

    if (badge) {
      queryObj.badge = badge;
    }

    const orderMap = {
      newest: { createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      area: { area: -1 },
      rating: { rating: -1 },
    };

    const sortBy = orderMap[sort] || { createdAt: -1 };

    const limit = Math.min(Number(per_page) || 8, 50);
    const offset = (Math.max(Number(page), 1) - 1) * limit;

    const total = await Property.countDocuments(queryObj);
    const properties = await Property.find(queryObj)
      .sort(sortBy)
      .limit(limit)
      .skip(offset);

    res.json({
      success: true,
      total,
      page: Number(page),
      per_page: limit,
      total_pages: Math.ceil(total / limit),
      properties,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/properties/featured ─────────────────────────────
exports.getFeatured = async (req, res, next) => {
  try {
    const properties = await Property.find({ badge: "featured", status: "active" })
      .sort({ rating: -1 })
      .limit(6);

    res.json({ success: true, properties });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/properties/recommended ──────────────────────────
exports.getRecommended = async (req, res, next) => {
  try {
    const properties = await Property.find({ status: "active" })
      .sort({ rating: -1 })
      .limit(4);

    res.json({ success: true, properties });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/properties/:id ───────────────────────────────────
exports.getPropertyById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    const prop = await Property.findById(req.params.id);

    if (!prop) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    const reviews = await Review.find({ property_id: prop._id }).sort({ createdAt: -1 });

    const propJSON = prop.toJSON();
    propJSON.reviews_list = reviews;

    res.json({ success: true, property: propJSON });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/properties ──────────────────────────────────────
exports.createProperty = async (req, res, next) => {
  try {
    const {
      title, type, price, area, beds, baths, city, locality,
      address, description, owner_name, owner_phone,
      badge, emoji, lat, lng,
    } = req.body;

    let parsedAmenities = [];
    const rawAmenities = req.body.amenities || req.body["amenities[]"];
    if (rawAmenities) {
      if (Array.isArray(rawAmenities)) parsedAmenities = rawAmenities;
      else if (typeof rawAmenities === "string") parsedAmenities = [rawAmenities];
    }

    const images = [];
    if (req.files?.length) {
      for (let i = 0; i < req.files.length; i++) {
        images.push({
          url: `/uploads/${req.files[i].filename}`,
          is_primary: i === 0,
        });
      }
    }

    const prop = await Property.create({
      title,
      type,
      price: Number(price),
      area: Number(area),
      beds: Number(beds) || 0,
      baths: Number(baths) || 0,
      city,
      locality: locality || null,
      address: address || null,
      description: description || null,
      owner_name: owner_name || null,
      owner_phone: owner_phone || null,
      owner_id: req.user.id,
      badge: badge || "new",
      emoji: emoji || "🏠",
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
      status: "active",
      amenities: parsedAmenities,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Property created",
      property_id: prop.id,
    });
  } catch (err) {
    next(err);
  }
};

// ── UPDATE PROPERTY ─────────────────────────────────────────
exports.updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    const prop = await Property.findById(id);

    if (!prop) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Only owner or admin
    if (req.user.role !== "admin" && prop.owner_id?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const {
      title, type, price, area, beds, baths, city, locality,
      address, description, owner_name, owner_phone,
      badge, emoji, lat, lng,
    } = req.body;

    prop.title = title || prop.title;
    prop.type = type || prop.type;
    prop.price = price ? Number(price) : prop.price;
    prop.area = area ? Number(area) : prop.area;
    prop.beds = beds !== undefined ? Number(beds) : prop.beds;
    prop.baths = baths !== undefined ? Number(baths) : prop.baths;
    prop.city = city || prop.city;
    prop.locality = locality || prop.locality;
    prop.address = address || prop.address;
    prop.description = description || prop.description;
    prop.owner_name = owner_name || prop.owner_name;
    prop.owner_phone = owner_phone || prop.owner_phone;
    prop.badge = badge || prop.badge;
    prop.emoji = emoji || prop.emoji;
    prop.lat = lat !== undefined ? Number(lat) : prop.lat;
    prop.lng = lng !== undefined ? Number(lng) : prop.lng;

    await prop.save();

    res.json({ success: true, message: "Property updated" });
  } catch (err) {
    next(err);
  }
};

// ── UPDATE STATUS ───────────────────────────────────────────
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    const allowed = ["active", "pending", "sold", "rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const prop = await Property.findByIdAndUpdate(id, { status }, { new: true });
    if (!prop) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.json({ success: true, message: "Status updated" });
  } catch (err) {
    next(err);
  }
};

// ── DELETE PROPERTY ─────────────────────────────────────────
exports.deleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    const prop = await Property.findByIdAndDelete(id);

    if (!prop) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Clean up related reviews, enquiries, visits, favorites
    await Review.deleteMany({ property_id: id });

    res.json({ success: true, message: "Property deleted" });
  } catch (err) {
    next(err);
  }
};