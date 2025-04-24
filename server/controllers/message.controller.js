const Message = require("../models/message.model.js");
const User = require("../models/user.model.js");
const { createError } = require("../utils/error.util.js");
const { saveFile } = require("../utils/file.util.js");
const mongoose = require("mongoose");

// Get messages based on user role
const getUserMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let messages = await Message.find({
      participants: userId,
    })
      .populate("participants", "username fullName role avatarUrl")
      .populate("conversation.sender", "username fullName role avatarUrl")
      .sort({ lastUpdated: -1 });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

const createMessage = async (req, res, next) => {
  try {
    const { subject, content, recipientId } = req.body;
    const senderId = req.user.id;

    // تأكد من أن الـ senderId و recipientId هما ObjectId صالحين
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return next(createError(400, "Invalid sender ID"));
    }

    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return next(createError(400, "Invalid recipient ID"));
    }

    const sender = await User.findById(senderId);
    if (!sender) {
      return next(createError(404, "Sender not found"));
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return next(createError(404, "Recipient not found"));
    }

    // تحقق من أدوار المستخدمين
    if (sender.role !== "client") {
      return next(
        createError(403, "Only clients can initiate new conversations")
      );
    }

    if (recipient.role !== "admin") {
      return next(createError(404, "Invalid recipient"));
    }

    let attachment = null;
    if (req.file) {
      const savedFile = await saveFile(req.file, "messages");
      attachment = {
        name: req.file.originalname,
        url: savedFile.url,
        size: req.file.size,
        type: req.file.mimetype,
      };
    }

    const newMessage = new Message({
      subject,
      conversation: [
        {
          content,
          sender: senderId,
          timestamp: Date.now(),
          isRead: false,
          attachment,
        },
      ],
      participants: [senderId, recipientId],
      lastUpdated: Date.now(),
    });

    const savedMessage = await newMessage.save();
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate("participants", "username fullName role avatarUrl")
      .populate("conversation.sender", "username fullName role avatarUrl");

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error creating message:", error);
    next(error);
  }
};

// Get a specific message
const getMessageById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const messageId = req.params.id;

    // Find the message and ensure the user is a participant
    const message = await Message.findOne({
      _id: messageId,
      participants: userId,
    })
      .populate("participants", "username fullName role avatarUrl")
      .populate("conversation.sender", "username fullName role avatarUrl");

    if (!message) {
      return next(createError(404, "Message not found"));
    }

    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

// Reply to a message
const replyToMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const messageId = req.params.id;
    const senderId = req.user.id;

    const message = await Message.findOne({
      _id: messageId,
      participants: senderId,
    });

    if (!message) {
      return next(createError(404, "Message not found"));
    }

    let attachment = null;
    if (req.file) {
      const savedFile = await saveFile(req.file, "messages");
      attachment = {
        name: req.file.originalname,
        url: savedFile.url,
        size: req.file.size,
        type: req.file.mimetype,
      };
    }

    message.conversation.push({
      content,
      sender: senderId,
      timestamp: Date.now(),
      isRead: false,
      attachment,
    });

    message.lastUpdated = Date.now();
    await message.save();

    const populatedMessage = await Message.findById(messageId)
      .populate("participants", "username fullName role avatarUrl")
      .populate("conversation.sender", "username fullName role avatarUrl");

    res.status(200).json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

// Mark a message as read
const markMessageAsRead = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;

    // Find message and ensure user is a participant
    const message = await Message.findOne({
      _id: messageId,
      participants: userId,
    });

    if (!message) {
      return next(createError(404, "Message not found"));
    }

    // Mark unread messages from other senders as read
    let updated = false;
    for (let i = 0; i < message.conversation.length; i++) {
      const msg = message.conversation[i];
      if (!msg.isRead && String(msg.sender) !== String(userId)) {
        message.conversation[i].isRead = true;
        updated = true;
      }
    }

    if (updated) {
      await message.save();
    }

    res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    next(error);
  }
};

// Delete a message
const deleteMessage = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;

    // Find message and ensure user is a participant
    const message = await Message.findOne({
      _id: messageId,
      participants: userId,
    });

    if (!message) {
      return next(createError(404, "Message not found"));
    }

    // Only allow admins or owners to actually delete the message
    if (req.user.role === "admin" || req.user.role === "owner") {
      await Message.findByIdAndDelete(messageId);
    } else {
      // For regular users, just remove them from participants
      message.participants = message.participants.filter(
        (id) => String(id) !== String(userId)
      );

      if (message.participants.length === 0) {
        // If no participants left, delete the message
        await Message.findByIdAndDelete(messageId);
      } else {
        await message.save();
      }
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get unread message count
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find all messages where user is participant
    const messages = await Message.find({ participants: userId });

    let unreadCount = 0;

    // Count unread messages from other senders
    for (const message of messages) {
      for (const msg of message.conversation) {
        if (!msg.isRead && String(msg.sender) !== String(userId)) {
          unreadCount++;
          break; // Only count one unread per conversation
        }
      }
    }

    res.status(200).json({ unreadCount });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserMessages,
  getMessageById,
  createMessage,
  replyToMessage,
  markMessageAsRead,
  deleteMessage,
  getUnreadCount,
};
