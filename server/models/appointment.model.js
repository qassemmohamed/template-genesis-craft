const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, default: "" },
  description: { type: String, default: "" },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
