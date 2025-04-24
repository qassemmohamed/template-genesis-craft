
const Feature = require("../models/feature.model.js");
const User = require("../models/user.model.js");
const { createError } = require("../utils/error.util.js");

// Get all features
const getAllFeatures = async (req, res, next) => {
  try {
    const features = await Feature.find();
    res.status(200).json(features);
  } catch (error) {
    next(error);
  }
};

// Get feature by ID
const getFeatureById = async (req, res, next) => {
  try {
    const feature = await Feature.findById(req.params.id);
    if (!feature) {
      return next(createError(404, "Feature not found"));
    }
    res.status(200).json(feature);
  } catch (error) {
    next(error);
  }
};

// Create a new feature
const createFeature = async (req, res, next) => {
  try {
    const newFeature = new Feature(req.body);
    const savedFeature = await newFeature.save();
    res.status(201).json(savedFeature);
  } catch (error) {
    next(error);
  }
};

// Update a feature
const updateFeature = async (req, res, next) => {
  try {
    const updatedFeature = await Feature.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedFeature) {
      return next(createError(404, "Feature not found"));
    }
    res.status(200).json(updatedFeature);
  } catch (error) {
    next(error);
  }
};

// Delete a feature
const deleteFeature = async (req, res, next) => {
  try {
    const feature = await Feature.findByIdAndDelete(req.params.id);
    if (!feature) {
      return next(createError(404, "Feature not found"));
    }
    res.status(200).json({ message: "Feature deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Assign feature to user
const assignFeatureToUser = async (req, res, next) => {
  try {
    const { userId, featureCode } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    
    // Check if feature exists
    const feature = await Feature.findOne({ code: featureCode });
    if (!feature) {
      return next(createError(404, "Feature not found"));
    }
    
    // Add feature to user if not already assigned
    if (!user.enabledFeatures.includes(featureCode)) {
      user.enabledFeatures.push(featureCode);
      await user.save();
    }
    
    res.status(200).json({ message: "Feature assigned to user successfully" });
  } catch (error) {
    next(error);
  }
};

// Remove feature from user
const removeFeatureFromUser = async (req, res, next) => {
  try {
    const { userId, featureCode } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    
    // Remove feature from user
    user.enabledFeatures = user.enabledFeatures.filter(code => code !== featureCode);
    await user.save();
    
    res.status(200).json({ message: "Feature removed from user successfully" });
  } catch (error) {
    next(error);
  }
};

// Get user features
const getUserFeatures = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    
    // Get all features that match the user's enabledFeatures codes
    const features = await Feature.find({ 
      code: { $in: user.enabledFeatures },
      isActive: true
    });
    
    res.status(200).json(features);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature,
  assignFeatureToUser,
  removeFeatureFromUser,
  getUserFeatures
};
