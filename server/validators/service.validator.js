const Joi = require("joi");

// Validate service creation and update
const validateService = (data, isUpdate = false) => {
  // Base schema
  const schemaObj = {
    title: isUpdate ? Joi.string().trim() : Joi.string().required().trim(),
    description: isUpdate
      ? Joi.string().trim()
      : Joi.string().required().trim(),
    active: Joi.boolean().optional(),
  };

  const schema = Joi.object(schemaObj);
  return schema.validate(data);
};

module.exports = {
  validateService,
};
