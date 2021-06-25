const Joi = require("joi");

const userInValidationSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "fr"] } })
    .required()
    .max(128),
  password: Joi.string().required(),
});

module.exports = userInValidationSchema;
