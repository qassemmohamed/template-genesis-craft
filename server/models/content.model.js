const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    type: {
      type: String,
      enum: ["page", "section", "component"], 
      default: "section",
    },
    languages: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: new Map(),
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Create indexes for faster queries
contentSchema.index({ key: 1 });
contentSchema.index({ type: 1 });

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;
