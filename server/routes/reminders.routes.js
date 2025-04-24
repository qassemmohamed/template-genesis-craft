const express = require("express");
const {
  deleteReminder,
  getAllReminders,
  createReminder,
  updateReminder,
} = require("../controllers/reminder.controller");
const router = express.Router();

router.get("/", getAllReminders);
router.post("/", createReminder);
router.put("/:id", updateReminder);
router.delete("/:id", deleteReminder);

module.exports = router;
