
const express = require("express");
const {
  getAllFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature,
  assignFeatureToUser,
  removeFeatureFromUser,
  getUserFeatures
} = require("../controllers/feature.controller.js");
const {
  verifyToken,
  verifyAdmin,
  verifyOwner
} = require("../middleware/auth.middleware.js");

const router = express.Router();

// Admin routes
router.post("/", verifyToken, verifyAdmin, createFeature);
router.put("/:id", verifyToken, verifyAdmin, updateFeature);
router.delete("/:id", verifyToken, verifyAdmin, deleteFeature);
router.post("/assign", verifyToken, verifyAdmin, assignFeatureToUser);
router.post("/remove", verifyToken, verifyAdmin, removeFeatureFromUser);

// Public routes (still protected by token)
router.get("/", verifyToken, getAllFeatures);
router.get("/:id", verifyToken, getFeatureById);
router.get("/user/:userId?", verifyToken, getUserFeatures);

module.exports = router;
