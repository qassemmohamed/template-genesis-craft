const Reminder = require("../models/reminder.model");

exports.getAllReminders = async (req, res) => {
  const reminders = await Reminder.find();
  res.json(reminders);
};

exports.createReminder = async (req, res) => {
  const reminder = new Reminder(req.body);
  await reminder.save();
  res.json(reminder);
};

exports.updateReminder = async (req, res) => {
  const updated = await Reminder.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

exports.deleteReminder = async (req, res) => {
  await Reminder.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
