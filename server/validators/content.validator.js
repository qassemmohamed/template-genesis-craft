const Joi = require("joi");

// Validate content creation and update
const validateContent = (data, isUpdate = false) => {
  // Base schema
  const schemaObj = {
    key: isUpdate ? Joi.string().trim() : Joi.string().required().trim(),
    title: isUpdate ? Joi.string().trim() : Joi.string().required().trim(),
    content: isUpdate ? Joi.object() : Joi.object().required(),
    type: Joi.string().valid("page", "section", "component"),
    languages: Joi.object(),
    lastUpdatedBy: Joi.string().optional(),
  };

  const schema = Joi.object(schemaObj);
  return schema.validate(data);
};
 
module.exports = {
  validateContent,
};
