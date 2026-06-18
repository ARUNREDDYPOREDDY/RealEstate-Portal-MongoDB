// config/db.js — MongoDB connection using Mongoose
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/new_beginnings_db");
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ DB Error:", err.message);
    process.exit(1);
  }
};

connectDB();

module.exports = mongoose.connection;