const express = require("express");
const {
  getWebsiteStats,
  recordVisitor,
  getVisitorStats,
} = require("../controllers/stats.controller.js");
const {
  verifyToken,
  verifyAdmin,
} = require("../middleware/auth.middleware.js");

const router = express.Router();

// Public routes
router.post("/visitor", recordVisitor);

// Protected routes
router.get("/", verifyToken, verifyAdmin, getWebsiteStats);
router.get("/visitors", verifyToken, verifyAdmin, getVisitorStats);

module.exports = router;
