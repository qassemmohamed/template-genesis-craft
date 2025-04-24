
const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      default: "Settings",
    },
    requiredRole: {
      type: String,
      enum: ["admin", "owner", "user", "client"],
      default: "client",
    },
  },
  { timestamps: true }
);

const Feature = mongoose.model("Feature", featureSchema);

module.exports = Feature;
