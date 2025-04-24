const Event = require("../models/event.model");

exports.getAllEvents = async (req, res) => {
  const events = await Event.find();
  res.json(events);
};

exports.createEvent = async (req, res) => {
  const event = new Event(req.body);
  await event.save();
  res.json(event);
};

exports.updateEvent = async (req, res) => {
  const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
};

exports.deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
