const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, default: "" },
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Event", eventSchema);
