//This file will interact with the file that contains the model user : ../models/user
const User = require("../models/user");

//to be able to create and verify authentication tokens: npm i jsonwebtoken
const jwt = require('jsonwebtoken');
//to be able to hash passwords: npm i bcrypt
const bcrypt = require("bcrypt");

//USER SIGNUP
exports.signup = (req, res, next) => {
    //to hash passwords
    bcrypt.hash(req.body.password, 10/*salt rounds)*/)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => { return res.status(201).json({ message: 'Utilisateur créé !' })})
                .catch(error => { return res.status(400).json({ error: error })});
        })
        .catch(error => res.status(500).json({ error }));
};

//USER LOGIN
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            /*compare a string with a hash, 
            to check if the user's password matches a hash stored and verified in the database*/
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        //encrypt a new token
                        token: jwt.sign(
                            { userId: user._id },
                            //temporary development secret chain
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => { return res.status(500).json({ error: error })});
        })
        .catch(error => { return res.status(500).json({ error: error })});
};