//This file will interact with the file that contains the model sauce : ../models/sauces
const Sauce = require("../models/sauces");

//file system: Module to access and interact with the file system
const fs = require('fs');

//SAUCE CREATION
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
    });
    console.log(sauceObject)
    sauce.save()
        .then(() => { return res.status(201).json({ message: 'Sauce enregistré !' }) })
        .catch(error => { return res.status(400).json({ error: error }) })
};

//LIKE / DISLIKE SAUCE
exports.likeSauce = (req, res, next) => {
    /*switch: evaluates the expressions and, depending on the associated case, 
    executes the corresponding instructions*/
    switch (req.body.like) {
        case 0:
            //the user who liked has already liked, if so remove 1 like
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    if (sauce.usersLiked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            //$inc : operator increments
                            $inc: { likes: -1 },
                            //$pull : operator removes
                            $pull: { usersLiked: req.body.userId },
                            _id: req.params.id
                        })
                            .then(() => {
                                return res.status(201).json({ message: '- 1 Like !' });
                            })
                            .catch((error) => {
                                return res.status(400).json({ error: error });
                            });
                    }
                    //the user who disliked has already disliked, if so remove 1 dislike
                    if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.body.userId },
                            _id: req.params.id
                        })
                            .then(() => {
                                return res.status(201).json({ message: '- 1 Dislike !' });
                            })
                            .catch((error) => {
                                return res.status(400).json({ error: error });
                            });
                    }
                })
                .catch((error) => { return res.status(404).json({ error: error }); });
            break;

        case 1:
            //+ 1 like
            Sauce.updateOne({ _id: req.params.id }, {
                $inc: { likes: 1 },
                //$push : returns an array of all values
                $push: { usersLiked: req.body.userId },
                _id: req.params.id
            })
                .then(() => {
                    res.status(201).json({ message: '+ 1 Like !' });
                })
                .catch((error) => {
                    res.status(400).json({ error: error });
                });
            break;

        case -1:
            //+ 1 dislike
            Sauce.updateOne({ _id: req.params.id }, {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId },
                _id: req.params.id
            })
                .then(() => {
                    return res.status(201).json({ message: '+ 1 Dislike !' });
                })
                .catch((error) => {
                    return res.status(400).json({ error: error });
                });
            break;
        default:
            return console.error({ error: error });
    }
};

//GET ALL SAUCES
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => { return res.status(200).json(sauces) })
        .catch(error => { return res.status(400).json({ error: error }) });
};

//GET ONE SAUCE
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => { return res.status(200).json(sauce) })
        .catch(error => { return res.status(400).json({ error: error }) });
};

//MODIFY SAUCE
exports.modifySauce = (req, res, next) => {
    let sauceObject = {};
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
                    .then(() => {
                        return res.status(201).json({ message: 'Sauce modifiée !' })
                    })
                    .catch((error) => { return res.status(400).json({ error: error }) });
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
                    .then(() => { return res.status(201).json({ message: 'Sauce supprimée  !' }) })
                    .catch(error => { return res.status(400).json({ error: error }) });
            });
        })
        .catch(error => { return res.status(500).json({ error: error }) });
};