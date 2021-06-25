"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const signupSchema = require("../middleware/signupSchema.js");

exports.signup = async (req, res, next) => {
  try {
    const requestData = {
      email: req.body.email,
      password: req.body.password,
    };
    const isValidJoi = await signupSchema.validateAsync(requestData);
    if (!isValidJoi) {
      return res.status(400).json("Email ou mot de passe non valide ! ");
    }
    bcrypt
      .hash(requestData.password, 10)
      .then((hash) => {
        const user = new User({
          email: requestData.email,
          password: hash,
        });
        user
          .save()
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
