// config/seed.js — MongoDB version
require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const Property = require("../models/Property");
const Review = require("../models/Review");

const seed = async () => {
  console.log("🌱 Starting MongoDB seed...");

  try {
    // Wait for connection to be ready
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve, reject) => {
        mongoose.connection.once("connected", resolve);
        mongoose.connection.once("error", reject);
      });
    }

    // ── USERS ─────────────────────────────────────
    const userExists = await User.findOne({ email: "user@demo.com" });
    const adminExists = await User.findOne({ email: "admin@demo.com" });
    const hash = (p) => bcrypt.hashSync(p, 10);

    if (!userExists) {
      await User.create({
        first_name: "Arjun",
        last_name: "Sharma",
        email: "user@demo.com",
        phone: "+91 98765 43210",
        city: "Hyderabad",
        password: hash("demo123"),
        role: "user",
      });
      console.log("✅ Demo User seeded");
    }

    if (!adminExists) {
      await User.create({
        first_name: "Admin",
        last_name: "User",
        email: "admin@demo.com",
        phone: "+91 98765 00000",
        city: "Hyderabad",
        password: hash("admin123"),
        role: "admin",
      });
      console.log("✅ Demo Admin seeded");
    }

    // ── PROPERTIES ────────────────────────────────
    const propCount = await Property.countDocuments();

    if (propCount === 0) {
      // Find admin to assign as owner if needed
      const adminUser = await User.findOne({ role: "admin" });
      const ownerId = adminUser ? adminUser._id : null;

      await Property.create([
        {
          title: "Luxury 3BHK in Banjara Hills",
          type: "Apartment",
          price: 8500000,
          area: 1800,
          beds: 3,
          baths: 3,
          city: "Hyderabad",
          locality: "Banjara Hills",
          address: "Road No.12",
          description: "Luxury flat with premium features, spacious layout and excellent locality.",
          owner_name: "Rajesh",
          owner_phone: "98765",
          owner_id: ownerId,
          rating: 4.8,
          review_count: 24,
          badge: "featured",
          emoji: "🏢",
          lat: 17.41,
          lng: 78.43,
          status: "active",
          amenities: ["Parking", "Gym", "Power Backup", "Security"],
          images: [{ url: "/uploads/luxury_apartment.jpg", is_primary: true }],
        },
        {
          title: "Affordable 2BHK",
          type: "Apartment",
          price: 4200000,
          area: 1100,
          beds: 2,
          baths: 2,
          city: "Hyderabad",
          locality: "Kukatpally",
          address: "KPHB",
          description: "Budget home ideal for families, close to schools and shopping areas.",
          owner_name: "Farhan",
          owner_phone: "98765",
          owner_id: ownerId,
          rating: 4.2,
          review_count: 31,
          badge: "new",
          emoji: "🏠",
          lat: 17.49,
          lng: 78.39,
          status: "active",
          amenities: ["Parking", "Lift", "Water Facility"],
          images: [{ url: "/uploads/budget_apartment.jpg", is_primary: true }],
        },
      ]);

      console.log("✅ Properties + Amenities seeded");
    }

    // ── REVIEWS (TESTIMONIALS) ───────────────────
    const reviewCount = await Review.countDocuments({ property_id: null });

    if (reviewCount === 0) {
      await Review.create([
        {
          property_id: null,
          user_id: null,
          name: "Siddharth",
          role_label: "Buyer",
          rating: 5,
          review_text: "Great platform! Found my dream home within a few days.",
        },
        {
          property_id: null,
          user_id: null,
          name: "Meena",
          role_label: "Seller",
          rating: 5,
          review_text: "Very useful and intuitive portal. The admin approvals were fast and clean.",
        },
      ]);

      console.log("✅ Reviews seeded");
    }

    console.log("\n🎉 Seed completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

// Import db to connect
require("./db");
seed();