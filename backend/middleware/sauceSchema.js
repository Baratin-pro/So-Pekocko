"use strict";

const Joi = require("joi");

const saucerInValidationSchema = Joi.object({
  userId: Joi.string().required(),
  name: Joi.string().required(),
  manufacturer: Joi.string().required(),
  description: Joi.string().required(),
  mainPepper: Joi.string().required(),
  heat: Joi.number().min(1).max(10).required(),
});

module.exports = saucerInValidationSchema;
