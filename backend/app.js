const express = require('express');
const mongoose = require('mongoose');
const path = require('node:path');//Module qui fournit des utilitaires pour travailler avec les chemins de fichiers et de répertoires : npm i path
const app = express();
const cors = require('cors'); //npm install cors
require('dotenv').config(); //npm i dotenv

//Middleware
app.use(cors());

app.use(express.json());

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

const passwordDB = process.env.PASSWORD_DB;
const userDB = process.env.USER_DB;
const uri = `mongodb+srv://${userDB}:${passwordDB}@cluster0.kxdo6im.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri)
    .then((() => console.log('Connexion à MongoDB!')))
    .catch((err) => console.error('Erreur de connexion à MongoDB!', err));

app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/api/sauces", sauceRoutes);

module.exports = app;