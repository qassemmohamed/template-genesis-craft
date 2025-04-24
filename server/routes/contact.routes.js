const express = require("express");
const {
  getAllContacts,
  getContactById,
  createContact,
  replyToContact,
  updateContactStatus,
  deleteContact,
} = require("../controllers/contact.controller.js");
const {
  verifyToken,
  verifyAdmin,
} = require("../middleware/auth.middleware.js");

const router = express.Router();

// Public routes
router.post("/", createContact);

// Protected routes
router.get("/", verifyToken, verifyAdmin, getAllContacts);
router.get("/:id", verifyToken, verifyAdmin, getContactById);
router.post("/:id/reply", verifyToken, verifyAdmin, replyToContact);
router.put("/:id/status", verifyToken, verifyAdmin, updateContactStatus);
router.delete("/:id", verifyToken, verifyAdmin, deleteContact);

module.exports = router;

