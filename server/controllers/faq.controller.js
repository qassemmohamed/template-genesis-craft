
const FAQ = require("../models/faq.model.js");
const { createError } = require("../utils/error.util.js");
const { validateFAQ } = require("../validators/faq.validator.js");

// Get all FAQs
const getAllFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1 });
    res.status(200).json(faqs);
  } catch (error) {
    next(error);
  }
};

// Get FAQ by ID
const getFAQById = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return next(createError(404, "FAQ not found"));
    }
    res.status(200).json(faq);
  } catch (error) {
    next(error);
  }
};

// Create new FAQ
const createFAQ = async (req, res, next) => {
  try {
    const { error } = validateFAQ(req.body);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    // Check if question already exists
    const existingFAQ = await FAQ.findOne({ question: req.body.question });
    if (existingFAQ) {
      return next(createError(400, "A FAQ with this question already exists"));
    }

    const { question, answer, active, order } = req.body;
    
    let newOrder = order;
    // If order is not provided, get the max order and add 1
    if (!newOrder) {
      const lastFaq = await FAQ.findOne({}, {}, { sort: { order: -1 } });
      newOrder = lastFaq ? lastFaq.order + 1 : 1;
    }

    const newFAQ = new FAQ({
      question,
      answer,
      active: active !== undefined ? active : true,
      order: newOrder,
    });

    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (error) {
    next(error);
  }
};

// Update FAQ
const updateFAQ = async (req, res, next) => {
  try {
    const { error } = validateFAQ(req.body, true);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    const { question, answer, active, order } = req.body;

    // Check if question is being updated and if it already exists
    if (question) {
      const existingFAQ = await FAQ.findOne({ 
        question, 
        _id: { $ne: req.params.id } 
      });
      
      if (existingFAQ) {
        return next(createError(400, "A FAQ with this question already exists"));
      }
    }

    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return next(createError(404, "FAQ not found"));
    }

    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (active !== undefined) faq.active = active;
    if (order !== undefined) faq.order = order;

    await faq.save();
    res.status(200).json(faq);
  } catch (error) {
    next(error);
  }
};

// Delete FAQ
const deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return next(createError(404, "FAQ not found"));
    }

    await faq.deleteOne();
    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
};
