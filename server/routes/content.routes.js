const express = require("express");
const {
  getAllContent,
  getContentByKey,
  createContent,
  updateContent,
  deleteContent,
  getAboutContent,
  updateAboutContent,
} = require("../controllers/content.controller.js");
const {
  verifyToken,
  verifyAdmin,
} = require("../middleware/auth.middleware.js");

const router = express.Router();

// Public routes
router.get("/", getAllContent);
router.get("/key/:key", getContentByKey);
router.get("/about", getAboutContent);

// Protected routes
router.post("/", verifyToken, verifyAdmin, createContent);
router.put("/key/:key", verifyToken, verifyAdmin, updateContent);
router.delete("/key/:key", verifyToken, verifyAdmin, deleteContent);
router.put("/about", verifyToken, verifyAdmin, updateAboutContent);

module.exports = router;
 