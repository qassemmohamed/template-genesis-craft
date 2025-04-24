const express = require("express");
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/service.controller.js");
const {
  verifyToken,
  verifyAdmin,
} = require("../middleware/auth.middleware.js");
const {
  upload,
  handleUploadErrors,
} = require("../middleware/upload.middleware.js");

const router = express.Router();

// Public routes
router.get("/", getAllServices);
router.get("/:id", getServiceById);

// Protected routes
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  handleUploadErrors,
  createService
); 
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  upload.single("image"),
  handleUploadErrors,
  updateService
);
router.delete("/:id", verifyToken, verifyAdmin, deleteService);

module.exports = router;
