const jwt = require('jsonwebtoken'); //Pour pouvoir créer et vérifier les tokens d'authentification : npm install jsonwebtoken
const bcrypt = require("bcrypt"); //Pour pouvoir : npm i brcypt
const User = require("../models/user");

//Middleware pour l'enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
    //pour hacher les mots de passe
    bcrypt.hash(req.body.password, 10/*salt rounds)*/)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error: error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//Middleware pour connecter les utilisateurs exitants
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            // La méthode compare de bcrypt compare un string avec un hash pour, par exemple, vérifier si un mot de passe entré par l'utilisateur correspond à un hash sécurisé enregistré en base de données. Cela montre que même bcrypt ne peut pas décrypter ses propres hashs.
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        // tokens d'authentification
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error: error }));
        })
        .catch(error => res.status(500).json({ error: error }));
};