
const express = require("express");
const multer = require("multer");
const {
  getUserMessages,
  getMessageById,
  createMessage,
  replyToMessage,
  markMessageAsRead,
  deleteMessage,
  getUnreadCount
} = require("../controllers/message.controller.js");
const { verifyToken } = require("../middleware/auth.middleware.js");

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// All routes require authentication
router.get("/", verifyToken, getUserMessages);
router.get("/unread", verifyToken, getUnreadCount);
router.get("/:id", verifyToken, getMessageById);
router.post("/", verifyToken, upload.single('attachment'), createMessage);
router.post("/:id/reply", verifyToken, upload.single('attachment'), replyToMessage);
router.put("/:id/read", verifyToken, markMessageAsRead);
router.delete("/:id", verifyToken, deleteMessage);

module.exports = router;
