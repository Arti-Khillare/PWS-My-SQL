// const Joi = require('@hapi/joi');
// Joi.objectId = require('joi-oid').Joi
const Joi = require("joi-oid");
const schema = {
  registerSchema: Joi.object({
    role: Joi.string(),
    fname: Joi.string().min(3).required(),
    lname: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    role_id: Joi.objectId().required(),
  }),
};

module.exports = schema;
