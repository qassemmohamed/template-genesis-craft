
const express = require("express");
const { 
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadAvatar,
  requestPasswordReset,
  resetPassword,
  checkUsername,
} = require("../controllers/profile.controller.js");
const { verifyToken } = require("../middleware/auth.middleware.js");
const { upload } = require("../middleware/upload.middleware.js");

const router = express.Router();

// Protected routes
router.get("/me", verifyToken, getUserProfile);
router.put("/me", verifyToken, updateUserProfile);
router.post("/change-password", verifyToken, changePassword);
router.post("/avatar", verifyToken, upload.single("avatar"), uploadAvatar);
router.get("/check-username/:username", verifyToken, checkUsername);

// Public routes
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;
