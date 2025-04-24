const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      enum: ["en", "fr", "ar"],
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Language = mongoose.model("Language", languageSchema);

module.exports = Language;

