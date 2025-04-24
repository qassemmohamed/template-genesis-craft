
const User = require("../models/user.model.js");
const Profile = require("../models/profile.model.js");
const { createError } = require("../utils/error.util.js");
const { saveFile, deleteFile } = require("../utils/file.util.js");
const bcrypt = require("bcryptjs");

// Get user profile
const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Get or create profile
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = new Profile({ userId });
      await profile.save();
    }

    res.status(200).json({
      user,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { username, email, fullName, bio, phoneNumber, address } = req.body;

    // Check if username exists (if changing username)
    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        return next(createError(400, "Username already exists"));
      }
    }

    // Update user
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (username) user.username = username;
    if (email) user.email = email;
    await user.save();

    // Update or create profile
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = new Profile({ userId });
    }

    if (fullName) profile.fullName = fullName;
    if (bio) profile.bio = bio;
    if (phoneNumber) profile.phoneNumber = phoneNumber;
    if (address) profile.address = address;
    
    await profile.save();

    // Return updated information
    const updatedUser = await User.findById(userId).select("-password");
    
    res.status(200).json({
      user: updatedUser,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// Change password
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validate request
    if (!currentPassword || !newPassword) {
      return next(createError(400, "Current and new password are required"));
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return next(createError(400, "Current password is incorrect"));
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

// Upload avatar
const uploadAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return next(createError(400, "No file uploaded"));
    }

    // Save file
    const savedFile = await saveFile(req.file, "avatars");

    // Find profile
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = new Profile({ userId });
    }

    // Delete old avatar if exists
    if (profile.avatarUrl) {
      await deleteFile(profile.avatarUrl);
    }

    // Update avatar URL
    profile.avatarUrl = savedFile.url;
    await profile.save();

    res.status(200).json({ avatarUrl: savedFile.url });
  } catch (error) {
    next(error);
  }
};

// Request password reset
const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists for security reasons
      return res.status(200).json({ 
        message: "If your email is registered, you will receive a password reset link" 
      });
    }

    // Generate reset token (in a real app, we would send an email)
    const resetToken = Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // In a real app, send email with reset link
    console.log(`Reset token for ${email}: ${resetToken}`);

    res.status(200).json({ 
      message: "If your email is registered, you will receive a password reset link" 
    });
  } catch (error) {
    next(error);
  }
};

// Reset password with token
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Find user with valid token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(createError(400, "Invalid or expired token"));
    }

    // Set new password
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};

// Check if username exists
const checkUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const userId = req.user?.id;

    const query = userId 
      ? { username, _id: { $ne: userId } }
      : { username };

    const user = await User.findOne(query);
    
    res.status(200).json({ exists: !!user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadAvatar,
  requestPasswordReset,
  resetPassword,
  checkUsername,
};
