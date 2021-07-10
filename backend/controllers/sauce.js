"use strict";

const Sauce = require("../models/Sauce.js");
const sauceSchema = require("../middleware/sauceSchema.js");
const fs = require("fs");

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

//--------------------------------------------------------------------

exports.modifySauce = async (req, res, next) => {
  try {
    let isValidJoi = NaN;

    if (req.body.sauce) {
      isValidJoi = await sauceSchema.validateAsync(JSON.parse(req.body.sauce));
    } else {
      isValidJoi = await sauceSchema.validateAsync(req.body);
    }

    if (!isValidJoi) {
      return res.status(400).json("Données envoyées incorrecte ! ");
    } else {
      const sauceId = String(req.params.id);
      Sauce.findOne({ _id: sauceId }).then((sauceFind) => {
        if (req.file) {
          const filename = sauceFind.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) {
              return console.log(err);
            } else {
              console.log("image supprimée !");
            }
          });
        }

        const sauceObject = req.file
          ? {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`,
            }
          : { ...req.body };

        Sauce.updateOne({ _id: sauceId }, { ...sauceObject, _id: sauceId })
          .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//--------------------------------------------------------------------

exports.deleteSauce = (req, res, next) => {
  const sauceId = String(req.params.id);
  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: sauceId })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//--------------------------------------------------------------------

exports.sauceLikeAndDislike = (req, res, next) => {
  let like = Number(req.body.like);
  const userId = String(req.body.userId);
  const sauceId = String(req.params.id);
  if (like === 1) {
    Sauce.updateOne(
      { _id: sauceId },
      {
        $inc: { likes: like++ },
        $push: { usersLiked: userId },
      }
    )
      .then(() => res.status(200).json({ message: "+1 like" }))
      .catch((error) => res.status(400).json({ error }));
  } else if (like === -1) {
    Sauce.updateOne(
      { _id: sauceId },
      {
        $inc: { dislikes: like++ * -1 },
        $push: { usersDisliked: userId },
      }
    )
      .then(() => res.status(200).json({ message: "+1 dislike" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          )
            .then(() => res.status(200).json({ message: "-1 like" }))
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersDisliked: userId },
              $inc: { dislikes: -1 },
            }
          )
            .then(() => res.status(200).json({ message: "-1 dislike" }))
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};
