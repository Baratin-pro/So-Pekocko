"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const userSchema = require("../middleware/userSchema.js");

exports.signup = async (req, res, next) => {
  try {
    const requestData = {
      email: req.body.email,
      password: req.body.password,
    };
    const isValidJoi = await userSchema.validateAsync(requestData);
    if (!isValidJoi) {
      return res.status(400).json("Email ou mot de passe non valide ! ");
    } else {
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
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    let user;
    const requestData = {
      email: req.body.email,
      password: req.body.password,
    };
    const isValidJoi = await userSchema.validateAsync(requestData);
    if (!isValidJoi) {
      return res.status(400).json("Email ou mot de passe non valide ! ");
    } else {
      User.findOne({ email: requestData.email })
        .then((userFind) => {
          user = userFind;
          if (!user) {
            return res.status(401).json({ error: "Utilisateur non trouvé !" });
          } else {
            return bcrypt.compare(requestData.password, user.password);
          }
        })
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          } else {
            res.status(200).json({
              userId: user._id,
              token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                expiresIn: "24h",
              }),
            });
          }
        })
        .catch((err) => res.status(500).json({ message: err.message }));
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
