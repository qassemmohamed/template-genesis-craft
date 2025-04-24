const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  notes: { type: String, default: "" },
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Reminder", reminderSchema);
