const Joi = require("joi-oid");
const schema = {
  registerSchema: Joi.object({
    role: Joi.string().required()
  }),
};

module.exports = schema;