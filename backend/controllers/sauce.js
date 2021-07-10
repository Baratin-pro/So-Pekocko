"use strict";

const Sauce = require("../models/Sauce.js");
const sauceSchema = require("../middleware/sauceSchema.js");
const fs = require("fs");
const { number } = require("joi");

//--------------------------------------------------------------------

exports.createSauce = async (req, res, next) => {
  try {
    const sauceObject = JSON.parse(req.body.sauce);
    const isValidJoi = await sauceSchema.validateAsync(sauceObject);
    if (!isValidJoi) {
      return res.status(400).json("Données envoyées incorrecte ! ");
    } else {
      sauceObject.likes = 0;
      sauceObject.dislikes = 0;
      delete sauceObject._id;
      const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      });
      sauce
        .save()
        .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
        .catch((err) => res.status(400).json({ message: err.message }));
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//--------------------------------------------------------------------

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//--------------------------------------------------------------------

exports.getOneSauce = (req, res, next) => {
  const sauceId = String(req.params.id);
  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
