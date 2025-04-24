const Appointment = require("../models/appointment.model");

exports.getAllAppointments = async (req, res) => {
  const appointments = await Appointment.find();
  res.json(appointments);
};

exports.createAppointment = async (req, res) => {
  const appointment = new Appointment(req.body);
  await appointment.save();
  res.json(appointment);
};

exports.updateAppointment = async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

exports.deleteAppointment = async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
