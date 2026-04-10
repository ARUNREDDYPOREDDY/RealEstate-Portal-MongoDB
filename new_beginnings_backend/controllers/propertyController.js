// controllers/propertyController.js
const pool = require("../config/db");

// ── Helpers ───────────────────────────────────────────────────
const attachAmenities = async (properties) => {
  if (!properties.length) return properties;

  const ids = properties.map((p) => p.id);

  const result = await pool.query(
    `SELECT property_id, name FROM amenities WHERE property_id = ANY($1)`,
    [ids]
  );

  const map = {};
  result.rows.forEach((r) => {
    (map[r.property_id] = map[r.property_id] || []).push(r.name);
  });

  return properties.map((p) => ({ ...p, amenities: map[p.id] || [] }));
};

const attachImages = async (properties) => {
  if (!properties.length) return properties;

  const ids = properties.map((p) => p.id);

  const result = await pool.query(
    `SELECT property_id, url, is_primary FROM property_images WHERE property_id = ANY($1)`,
    [ids]
  );

  const map = {};
  result.rows.forEach((r) => {
    (map[r.property_id] = map[r.property_id] || []).push({
      url: r.url,
      is_primary: !!r.is_primary,
    });
  });

  return properties.map((p) => ({ ...p, images: map[p.id] || [] }));
};

// ── GET /api/properties ───────────────────────────────────────
exports.getProperties = async (req, res, next) => {
  try {
    const {
      search, type, city, min_price, max_price, beds,
      area_min, area_max, badge, status = "active",
      sort = "newest", page = 1, per_page = 8,
    } = req.query;

    const conditions = [`p.status = $1`];
    const params = [status];

    if (search) {
      const like = `%${search}%`;
      conditions.push(`(p.title ILIKE $${params.length+1} OR p.city ILIKE $${params.length+2} OR p.locality ILIKE $${params.length+3})`);
      params.push(like, like, like);
    }

    if (type) { params.push(type); conditions.push(`p.type = $${params.length}`); }
    if (city) { params.push(`%${city}%`); conditions.push(`p.city ILIKE $${params.length}`); }
    if (min_price) { params.push(Number(min_price)); conditions.push(`p.price >= $${params.length}`); }
    if (max_price) { params.push(Number(max_price)); conditions.push(`p.price <= $${params.length}`); }

    if (beds) {
      if (beds === "4+") conditions.push("p.beds >= 4");
      else { params.push(Number(beds)); conditions.push(`p.beds = $${params.length}`); }
    }

    if (area_min) { params.push(Number(area_min)); conditions.push(`p.area >= $${params.length}`); }
    if (area_max) { params.push(Number(area_max)); conditions.push(`p.area <= $${params.length}`); }
    if (badge) { params.push(badge); conditions.push(`p.badge = $${params.length}`); }

    const where = conditions.join(" AND ");

    const orderMap = {
      newest: "p.created_at DESC",
      "price-asc": "p.price ASC",
      "price-desc": "p.price DESC",
      area: "p.area DESC",
      rating: "p.rating DESC",
    };

    const orderBy = orderMap[sort] || "p.created_at DESC";

    const limit = Math.min(Number(per_page) || 8, 50);
    const offset = (Math.max(Number(page), 1) - 1) * limit;

    const totalResult = await pool.query(
      `SELECT COUNT(*) FROM properties p WHERE ${where}`,
      params
    );

    const total = totalResult.rows[0].count;

    const result = await pool.query(
      `SELECT p.* FROM properties p WHERE ${where}
       ORDER BY ${orderBy}
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    let properties = await attachAmenities(result.rows);
    properties = await attachImages(properties);

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
    const result = await pool.query(
      "SELECT * FROM properties WHERE badge = 'featured' AND status = 'active' ORDER BY rating DESC LIMIT 6"
    );

    let props = await attachAmenities(result.rows);
    props = await attachImages(props);

    res.json({ success: true, properties: props });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/properties/recommended ──────────────────────────
exports.getRecommended = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM properties WHERE status = 'active' ORDER BY rating DESC LIMIT 4"
    );

    let props = await attachAmenities(result.rows);
    props = await attachImages(props);

    res.json({ success: true, properties: props });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/properties/:id ───────────────────────────────────
exports.getPropertyById = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM properties WHERE id = $1",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    let [prop] = await attachAmenities(result.rows);
    [prop] = await attachImages([prop]);

    const reviews = await pool.query(
      "SELECT * FROM reviews WHERE property_id = $1 ORDER BY created_at DESC",
      [prop.id]
    );

    prop.reviews_list = reviews.rows;

    res.json({ success: true, property: prop });
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
      badge, emoji, lat, lng, amenities = [],
    } = req.body;

    const result = await pool.query(
      `INSERT INTO properties
       (title, type, price, area, beds, baths, city, locality, address, description,
        owner_name, owner_phone, owner_id, badge, emoji, lat, lng, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       RETURNING id`,
      [
        title, type, price, area, beds || 0, baths || 0,
        city, locality || null, address || null, description || null,
        owner_name || null, owner_phone || null, req.user.id,
        badge || "new", emoji || "🏠", lat || null, lng || null,
        "active",
      ]
    );

    const propId = result.rows[0].id;

    if (Array.isArray(amenities)) {
      for (const name of amenities) {
        await pool.query(
          "INSERT INTO amenities (property_id, name) VALUES ($1,$2)",
          [propId, name]
        );
      }
    }

    if (req.files?.length) {
      for (let i = 0; i < req.files.length; i++) {
        await pool.query(
          "INSERT INTO property_images (property_id, url, is_primary) VALUES ($1,$2,$3)",
          [propId, `/uploads/${req.files[i].filename}`, i === 0]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: "Property created",
      property_id: propId,
    });
  } catch (err) {
    next(err);
  }
};

// ── UPDATE / DELETE similar pattern (already fixed logic above)
exports.updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM properties WHERE id = $1",
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    const prop = result.rows[0];

    if (req.user.role !== "admin" && prop.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const {
      title, type, price, area, beds, baths,
      city, locality, address, description,
      owner_name, owner_phone, badge, emoji, lat, lng
    } = req.body;

    await pool.query(
      `UPDATE properties SET
        title=$1, type=$2, price=$3, area=$4, beds=$5, baths=$6,
        city=$7, locality=$8, address=$9, description=$10,
        owner_name=$11, owner_phone=$12, badge=$13, emoji=$14,
        lat=$15, lng=$16
       WHERE id=$17`,
      [
        title || prop.title,
        type || prop.type,
        price || prop.price,
        area || prop.area,
        beds ?? prop.beds,
        baths ?? prop.baths,
        city || prop.city,
        locality || prop.locality,
        address || prop.address,
        description || prop.description,
        owner_name || prop.owner_name,
        owner_phone || prop.owner_phone,
        badge || prop.badge,
        emoji || prop.emoji,
        lat || prop.lat,
        lng || prop.lng,
        id
      ]
    );

    res.json({ success: true, message: "Property updated" });
  } catch (err) {
    next(err);
  }
};
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowed = ["active", "pending", "sold", "rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    await pool.query(
      "UPDATE properties SET status=$1 WHERE id=$2",
      [status, req.params.id]
    );

    res.json({ success: true, message: "Status updated" });
  } catch (err) {
    next(err);
  }
};
exports.deleteProperty = async (req, res, next) => {
  try {
    await pool.query(
      "DELETE FROM properties WHERE id=$1",
      [req.params.id]
    );

    res.json({ success: true, message: "Property deleted" });
  } catch (err) {
    next(err);
  }
};

exports.updateProperty = async (req, res, next) => {
  res.json({ message: "update working" });
};

exports.updateStatus = async (req, res, next) => {
  res.json({ message: "status working" });
};

exports.deleteProperty = async (req, res, next) => {
  res.json({ message: "delete working" });
};
// ✅ UPDATE PROPERTY
exports.updateProperty = async (req, res, next) => {
  try {
    res.json({ success: true, message: "updateProperty working" });
  } catch (err) {
    next(err);
  }
};

// ✅ UPDATE STATUS
exports.updateStatus = async (req, res, next) => {
  try {
    res.json({ success: true, message: "updateStatus working" });
  } catch (err) {
    next(err);
  }
};

// ✅ DELETE PROPERTY
exports.deleteProperty = async (req, res, next) => {
  try {
    res.json({ success: true, message: "deleteProperty working" });
  } catch (err) {
    next(err);
  }
};

// ── UPDATE PROPERTY ─────────────────────────────────────────
exports.updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const check = await pool.query(
      "SELECT * FROM properties WHERE id = $1",
      [id]
    );

    if (!check.rows.length) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    const prop = check.rows[0];

    // Only owner or admin
    if (req.user.role !== "admin" && prop.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const {
      title, type, price, area, beds, baths, city, locality,
      address, description, owner_name, owner_phone,
      badge, emoji, lat, lng
    } = req.body;

    await pool.query(
      `UPDATE properties SET
        title=$1, type=$2, price=$3, area=$4, beds=$5, baths=$6,
        city=$7, locality=$8, address=$9, description=$10,
        owner_name=$11, owner_phone=$12,
        badge=$13, emoji=$14, lat=$15, lng=$16
       WHERE id=$17`,
      [
        title || prop.title,
        type || prop.type,
        price || prop.price,
        area || prop.area,
        beds ?? prop.beds,
        baths ?? prop.baths,
        city || prop.city,
        locality || prop.locality,
        address || prop.address,
        description || prop.description,
        owner_name || prop.owner_name,
        owner_phone || prop.owner_phone,
        badge || prop.badge,
        emoji || prop.emoji,
        lat || prop.lat,
        lng || prop.lng,
        id
      ]
    );

    res.json({ success: true, message: "Property updated" });
  } catch (err) {
    next(err);
  }
};


// ── UPDATE STATUS ───────────────────────────────────────────
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowed = ["active", "pending", "sold", "rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    await pool.query(
      "UPDATE properties SET status = $1 WHERE id = $2",
      [status, req.params.id]
    );

    res.json({ success: true, message: "Status updated" });
  } catch (err) {
    next(err);
  }
};


// ── DELETE PROPERTY ─────────────────────────────────────────
exports.deleteProperty = async (req, res, next) => {
  try {
    const result = await pool.query(
      "DELETE FROM properties WHERE id = $1 RETURNING id",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.json({ success: true, message: "Property deleted" });
  } catch (err) {
    next(err);
  }
};