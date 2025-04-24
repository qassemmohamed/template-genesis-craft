const express = require("express");
const {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} = require("../controllers/client.controller.js");
const {
  verifyToken,
  verifyAdmin,
} = require("../middleware/auth.middleware.js");

const router = express.Router();

// Public routes
router.get("/", getAllClients);
router.get("/:id", getClientById);

// Protected routes
router.post("/", verifyToken, verifyAdmin, createClient); // Only admin can create clients
router.put("/:id", updateClient); // Only admin can update clients
router.delete("/:id", verifyToken, verifyAdmin, deleteClient); // Only admin can delete clients

module.exports = router;
