const express = require("express");
const {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} = require("../controllers/faq.controller.js");
const {
  verifyToken,
  verifyAdmin,
} = require("../middleware/auth.middleware.js");

const router = express.Router();

// Public routes
router.get("/", getAllFAQs);
router.get("/:id", getFAQById);

// Protected routes
router.post("/", verifyToken, verifyAdmin, createFAQ);
router.put("/:id", verifyToken, verifyAdmin, updateFAQ);
router.delete("/:id", verifyToken, verifyAdmin, deleteFAQ);

module.exports = router;
