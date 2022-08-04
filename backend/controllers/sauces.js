// Utilisation du modèle Moongose dans l'app, pour les sauces, importé du fichier app.js
const Sauce = require("../models/sauces");

const fs = require('fs'); //file system : Module pour accéder et interagir avec le système de fichiers

//SAUCE CREATION
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
    });
    console.log(sauceObject)
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce enregistré !' }) })
        .catch(error => { res.status(400).json({ error: error }) })
};

//GET ALL SAUCES
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => {
            res.status(200).json(sauces)
        })
        .catch(error => res.status(400).json({ error: error }));
};

//MODIFY SAUCE
exports.modifySauce = (req, res, next) => {
    let sauceObject = {};
    console.log(sauceObject)
    if (req.file) {
        sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        };
    } else { sauceObject = { ...req.body } }
    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id, })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                return res.status(401).json({ message: 'User non-autorisé', });
            } else {
                Sauce.updateOne({ _id: req.params.id, },
                    { ...sauceObject, _id: req.params.id, })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                    .catch((error) => res.status(400).json({ error: error }));
            }
        })
        .catch((error) => {
            return res.status(400).json({ error: error });
        });
};

/// DELETE ONE SAUCE //
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => { res.status(201).json({ message: 'Sauce supprimée  !' }) })
                    .catch(error => res.status(400).json({ error: error }));
            });
        })
        .catch(error => res.status(500).json({ error: error }));
};

//GET ONE SAUCE
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error: error }));
};

//LIKE / DISLIKE SAUCE
exports.likeSauce = (req, res, next) => {
    switch (req.body.like) {
        case 0:
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    if (sauce.usersLiked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $inc: { likes: -1 }, //operator increments
                            $pull: { usersLiked: req.body.userId }, //operator removes
                            _id: req.params.id
                        })
                            .then((message) => { res.status(201).json({ message: '- 1 Like !' }); })
                            .catch((error) => { res.status(400).json({ error: error }); });

                    } if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $inc: { dislikes: -1 }, //operator increments
                            $pull: { usersDisliked: req.body.userId }, //operator removes
                            _id: req.params.id
                        })
                            .then(() => { res.status(201).json({ message: '- 1 Dislike !' }); })
                            .catch((error) => { res.status(400).json({ error: error }); });
                    }
                })
                .catch((error) => { res.status(404).json({ error: error }); });
            break;

        case 1:
            Sauce.updateOne({ _id: req.params.id }, {
                $inc: { likes: 1 },
                $push: { usersLiked: req.body.userId }, //returns an array of all values
                _id: req.params.id
            })
                .then(() => { res.status(201).json({ message: '+ 1 Like !' }); })
                .catch((error) => { res.status(400).json({ error: error }); });
            break;
        
        case -1:
            Sauce.updateOne({ _id: req.params.id }, {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId }, //returns an array of all values
                _id: req.params.id
            })
                .then(() => { res.status(201).json({ message: '+ 1 Dislike !' }); })
                .catch((error) => { res.status(400).json({ error: error }); });
            break;
        default:
            return console.error({ error: error });
    }
};
