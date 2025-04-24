const Joi = require("joi");

// Validate FAQ creation
const validateFAQ = (data, isUpdate = false) => {
  const schema = Joi.object({
    key: isUpdate ? Joi.string().trim() : Joi.string().required().trim(),
    active: Joi.boolean(),
    order: Joi.number().integer().min(0),
  });

  return schema.validate(data);
};

module.exports = {
  validateFAQ,
};
