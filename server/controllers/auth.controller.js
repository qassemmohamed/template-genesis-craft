const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const { createError } = require("../utils/error.util.js");

// Register a new client
const register = async (req, res, next) => {
  try {
    const { username, email, password, fullName } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return next(createError(400, "Username or email already exists"));
    }

    const newUser = new User({
      username,
      email,
      password,
      fullName,
      role: "client", // Default role for client registration
    });

    await newUser.save();

    const { password: _, ...userWithoutPassword } = newUser._doc;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (!user.isActive) {
      return next(createError(403, "User account is disabled"));
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return next(createError(400, "Invalid credentials"));
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: _, ...userWithoutPassword } = user._doc;
    res.status(200).json({
      ...userWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return next(createError(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Update user
const updateUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();

    const { password: _, ...userWithoutPassword } = user._doc;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateUser,
};
