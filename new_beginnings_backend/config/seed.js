// config/seed.js — PostgreSQL version
require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("./db");

const seed = async () => {
  console.log("🌱 Starting PostgreSQL seed...");

  try {
    // ── USERS ─────────────────────────────────────
    const userResult = await pool.query("SELECT COUNT(*) FROM users");
    const userCount = parseInt(userResult.rows[0].count);

    if (userCount === 0) {
      const hash = (p) => bcrypt.hashSync(p, 10);

      await pool.query(
        `INSERT INTO users (first_name, last_name, email, phone, city, password, role)
         VALUES 
         ($1,$2,$3,$4,$5,$6,$7),
         ($8,$9,$10,$11,$12,$13,$14)`,
        [
          "Arjun", "Sharma", "user@demo.com", "+91 98765 43210", "Hyderabad", hash("demo123"), "user",
          "Admin", "User", "admin@demo.com", "+91 98765 00000", "Hyderabad", hash("admin123"), "admin"
        ]
      );

      console.log("✅ Users seeded");
    }

    // ── PROPERTIES ────────────────────────────────
    const propResult = await pool.query("SELECT COUNT(*) FROM properties");
    const propCount = parseInt(propResult.rows[0].count);

    if (propCount === 0) {
      const result = await pool.query(
        `INSERT INTO properties 
        (title, type, price, area, beds, baths, city, locality, address, description,
         owner_name, owner_phone, rating, review_count, badge, emoji, lat, lng, status)
        VALUES
        ('Luxury 3BHK in Banjara Hills','Apartment',8500000,1800,3,3,'Hyderabad','Banjara Hills','Road No.12','Luxury flat','Rajesh','98765',4.8,24,'featured','🏢',17.41,78.43,'active'),
        ('Affordable 2BHK','Apartment',4200000,1100,2,2,'Hyderabad','Kukatpally','KPHB','Budget home','Farhan','98765',4.2,31,'new','🏠',17.49,78.39,'active')
        RETURNING id`
      );

      const ids = result.rows.map(r => r.id);

      // ── AMENITIES ─────────────────────────────
      for (const id of ids) {
        await pool.query(
          "INSERT INTO amenities (property_id, name) VALUES ($1,$2)",
          [id, "Parking"]
        );
      }

      console.log("✅ Properties + Amenities seeded");
    }

    // ── REVIEWS (TESTIMONIALS) ───────────────────
    const reviewResult = await pool.query(
      "SELECT COUNT(*) FROM reviews WHERE property_id IS NULL"
    );

    if (parseInt(reviewResult.rows[0].count) === 0) {
      await pool.query(
        `INSERT INTO reviews (property_id, user_id, name, role_label, rating, review_text)
         VALUES
         (NULL,NULL,'Siddharth','Buyer',5,'Great platform'),
         (NULL,NULL,'Meena','Seller',5,'Very useful')`
      );

      console.log("✅ Reviews seeded");
    }

    console.log("\n🎉 Seed completed successfully!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

seed();