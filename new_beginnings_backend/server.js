// server.js — New Beginnings Real Estate Portal — Express Entry Point
require("dotenv").config();
require("./config/db");
const express  = require("express");
const cors     = require("cors");
const path     = require("path");
const fs       = require("fs");

// Import routes
const authRoutes     = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const enquiryRoutes  = require("./routes/enquiryRoutes");
const reviewRoutes   = require("./routes/reviewRoutes");
const visitRoutes    = require("./routes/visitRoutes");
const adminRoutes    = require("./routes/adminRoutes");

// Error handlers
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// ── Ensure uploads directory exists ──────────────────────────
const uploadsDir = process.env.UPLOAD_PATH || "./uploads";
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:5009",
    "http://127.0.0.1:5009",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    process.env.CLIENT_URL,
  ].filter(Boolean).concat([/\.onrender\.com$/]),
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// ── Static files ──────────────────────────────────────────────
// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve the frontend (index.html + assets) from /public
app.use(express.static(path.join(__dirname, "public")));

// ── API Routes ────────────────────────────────────────────────
app.use("/api/auth",        authRoutes);
app.use("/api/properties",  propertyRoutes);
app.use("/api/favorites",   favoriteRoutes);
app.use("/api/enquiries",   enquiryRoutes);
app.use("/api/reviews",     reviewRoutes);
app.use("/api/visits",      visitRoutes);
app.use("/api/admin",       adminRoutes);

// ── Health check ──────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "New Beginnings API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// ── Catch-all: serve frontend for non-API routes ──────────────
app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "public", "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ success: false, message: "Frontend not found in /public" });
  }
});

// ── Error handling middleware (must be last) ──────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🏠  New Beginnings Real Estate API`);
  console.log(`🚀  Server running on http://localhost:${PORT}`);
  console.log(`🌍  Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📂  Uploads directory: ${path.resolve(uploadsDir)}`);
  console.log(`\n   API Endpoints:`);
  console.log(`   ├── POST   /api/auth/register`);
  console.log(`   ├── POST   /api/auth/login`);
  console.log(`   ├── GET    /api/auth/me`);
  console.log(`   ├── GET    /api/properties`);
  console.log(`   ├── GET    /api/properties/featured`);
  console.log(`   ├── GET    /api/properties/recommended`);
  console.log(`   ├── POST   /api/properties`);
  console.log(`   ├── GET    /api/favorites`);
  console.log(`   ├── POST   /api/enquiries`);
  console.log(`   ├── GET    /api/reviews/testimonials`);
  console.log(`   ├── POST   /api/visits`);
  console.log(`   ├── GET    /api/admin/stats`);
  console.log(`   └── GET    /api/health\n`);
});

module.exports = app;
