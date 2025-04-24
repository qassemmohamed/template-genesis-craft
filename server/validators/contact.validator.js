
const Joi = require("joi");

// Validate contact creation
const validateContact = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().trim().min(2).max(100),
    email: Joi.string().required().email().trim(),
    subject: Joi.string().required().trim().min(2).max(200),
    message: Joi.string().required().trim().min(10).max(2000),
  });

  return schema.validate(data);
};

// Validate contact reply
const validateContactReply = (data) => {
  const schema = Joi.object({
    reply: Joi.string().required().trim().min(10).max(5000),
  });

  return schema.validate(data);
};

module.exports = {
  validateContact,
  validateContactReply,
};
