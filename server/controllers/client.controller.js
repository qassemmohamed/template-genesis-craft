const User = require("../models/user.model.js");
const { createError } = require("../utils/error.util.js");

// Get all clients
const getAllClients = async (req, res, next) => {
  try {
    const clients = await User.find({ role: "client" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

// Get client by ID
const getClientById = async (req, res, next) => {
  try {
    const client = await User.findOne({
      _id: req.params.id,
      role: "client",
    }).select("-password");

    if (!client) {
      return next(createError(404, "Client not found"));
    }

    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

// Create new client
const createClient = async (req, res, next) => {
  try {
    const { username, email, password, fullName } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return next(createError(400, "Username or email already exists"));
    }

    const newClient = new User({
      username,
      email,
      password,
      fullName,
      role: "client",
    });

    await newClient.save();
    const { password: _, ...clientData } = newClient._doc;
    res.status(201).json(clientData);
  } catch (error) {
    next(error);
  }
};

// Update client
const updateClient = async (req, res, next) => {
  try {
    const { username, email, fullName, isActive } = req.body;

    const client = await User.findOne({
      _id: req.params.id,
      role: "client",
    });

    if (!client) {
      return next(createError(404, "Client not found"));
    }

    // Update fields if provided
    if (username) client.username = username;
    if (email) client.email = email;
    if (fullName) client.fullName = fullName;
    if (typeof isActive === "boolean") client.isActive = isActive;

    await client.save();
    const { password: _, ...clientData } = client._doc;
    res.status(200).json(clientData);
  } catch (error) {
    next(error);
  }
};

// Delete client
const deleteClient = async (req, res, next) => {
  try {
    const client = await User.findOneAndDelete({
      _id: req.params.id,
      role: "client",
    });

    if (!client) {
      return next(createError(404, "Client not found"));
    }

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
