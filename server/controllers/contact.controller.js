
const Contact = require("../models/contact.model.js");
const { createError } = require("../utils/error.util.js");
const {
  validateContact,
  validateContactReply,
} = require("../validators/contact.validator.js");

// Get all contacts
const getAllContacts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, sort = "-createdAt", search } = req.query;

    const query = {};
    
    // Filter by status if provided
    if (status) query.status = status;
    
    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex }
      ];
    }

    const total = await Contact.countDocuments(query);

    const contacts = await Contact.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// Get contact by ID
const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return next(createError(404, "Contact not found"));
    }

    // If status is new, mark as read
    if (contact.status === "new") {
      contact.status = "read";
      contact.isRead = true;
      await contact.save();
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

// Create new contact
const createContact = async (req, res, next) => {
  try {
    const { error } = validateContact(req.body);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    const { name, email, subject, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Reply to contact
const replyToContact = async (req, res, next) => {
  try {
    const { error } = validateContactReply(req.body);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    const { reply } = req.body;

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return next(createError(404, "Contact not found"));
    }

    contact.reply = {
      text: reply,
      date: new Date(),
    };
    contact.status = "replied";
    contact.isRead = true;

    await contact.save();

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

// Update contact status
const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["new", "read", "replied", "archived"].includes(status)) {
      return next(createError(400, "Invalid status"));
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return next(createError(404, "Contact not found"));
    }

    contact.status = status;
    
    // Mark as read if status is being changed from new
    if (contact.status !== "new") {
      contact.isRead = true;
    }
    
    await contact.save();

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

// Delete contact
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return next(createError(404, "Contact not found"));
    }

    await contact.deleteOne();
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  replyToContact,
  updateContactStatus,
  deleteContact,
};
