// scripts/createAdmin.js — One-time script to seed an admin user
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
require("../config/db");

const bcrypt      = require("bcryptjs");
const User        = require("../models/User");
const mongoose    = require("mongoose");

const ADMIN = {
  first_name: "Rohith Reddy",
  last_name:  "Poreddy",
  email:      "poreddyrohith@gmail.com",
  password:   "123456",
  role:       "admin",
};

(async () => {
  // Wait for mongoose to connect
  await new Promise((resolve) => {
    if (mongoose.connection.readyState === 1) return resolve();
    mongoose.connection.once("open", resolve);
  });

  try {
    const existing = await User.findOne({ email: ADMIN.email });

    if (existing) {
      if (existing.role !== "admin") {
        existing.role = "admin";
        await existing.save();
        console.log(`✅ Existing user promoted to admin: ${ADMIN.email}`);
      } else {
        console.log(`ℹ️  Admin already exists: ${ADMIN.email}`);
      }
      process.exit(0);
    }

    const hashed = await bcrypt.hash(ADMIN.password, 10);

    const user = await User.create({
      first_name: ADMIN.first_name,
      last_name:  ADMIN.last_name,
      email:      ADMIN.email,
      password:   hashed,
      role:       "admin",
      is_active:  true,
    });

    console.log("\n🎉 Admin user created successfully!");
    console.log(`   Name  : ${user.first_name} ${user.last_name}`);
    console.log(`   Email : ${user.email}`);
    console.log(`   Role  : ${user.role}`);
    console.log(`   ID    : ${user._id}\n`);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
