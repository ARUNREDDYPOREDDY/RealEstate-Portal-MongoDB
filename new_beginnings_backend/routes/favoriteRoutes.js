// routes/favoriteRoutes.js
const express = require("express");
const router = express.Router();
const { getFavorites, getFavoriteIds, addFavorite, removeFavorite } = require("../controllers/favoriteController");
const { protect } = require("../middleware/auth");

router.get( "/",           protect, getFavorites);
router.get( "/ids",        protect, getFavoriteIds);
router.post("/:property_id",   protect, addFavorite);
router.delete("/:property_id", protect, removeFavorite);

module.exports = router;
