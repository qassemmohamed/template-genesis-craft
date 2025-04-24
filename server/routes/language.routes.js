const express = require("express");
const {
  getAllLanguages,
  getLanguageByCode,
  createLanguage,
  updateLanguage,
  deleteLanguage,
} = require("../controllers/language.controller.js");
const {
  verifyToken,
  verifyAdmin,
} = require("../middleware/auth.middleware.js");

const router = express.Router();

// Public routes
router.get("/", getAllLanguages);
router.get("/:code", getLanguageByCode);

// Protected routes
router.post("/", verifyToken, verifyAdmin, createLanguage);
router.put("/:code", verifyToken, verifyAdmin, updateLanguage);
router.delete("/:code", verifyToken, verifyAdmin, deleteLanguage);

module.exports = router;
