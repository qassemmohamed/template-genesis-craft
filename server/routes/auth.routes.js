
const express = require("express");
const {
  login,
  register,
  getCurrentUser,
  updateUser,
} = require("../controllers/auth.controller.js");
const {
  verifyToken,
  verifyAdmin,
} = require("../middleware/auth.middleware.js");

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/register", register); // Now public for client registration

// Protected routes
router.get("/me", verifyToken, getCurrentUser);
router.put("/me", verifyToken, updateUser);

module.exports = router;
