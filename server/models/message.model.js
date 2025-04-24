
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    conversation: [{
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      isRead: {
        type: Boolean,
        default: false,
      },
      attachment: {
        name: String,
        url: String,
        size: Number,
        type: String
      }
    }],
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    lastUpdated: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
