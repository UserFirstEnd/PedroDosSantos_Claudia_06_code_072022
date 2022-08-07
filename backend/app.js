/*app.js : file with code logic. 
With this file we will call the routers*/

//to create a server we need express : npm i express
const express = require('express');
const app = express();

//to protect the application by setting HTTP headers : npm i helmet
const helmet = require('helmet');
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

//module that provides utilities for working with file and directory paths : npm i path
const path = require('node:path');

/*middleware which adds a header to the url 
and allows the correct reading by an external url of the information of the called url : npm install cors*/
const cors = require('cors');
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//middleware function that parses JSON requests and puts data into req.body
app.use(express.json());

//module that allows to load environment variables from .env file into process.env : npm i dotenv
require('dotenv').config();

//Connect database with code : npm i mongoose
const mongoose = require('mongoose');
const passwordDB = process.env.PASSWORD_DB;
const userDB = process.env.USER_DB;
const uri = `mongodb+srv://${userDB}:${passwordDB}@cluster0.kxdo6im.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri)
    //promise with callback on success
    .then((() => console.log('Connexion à MongoDB!')))
    //error if not succeed
    .catch((err) => console.error('Erreur de connexion à MongoDB!', err));

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');

//routers
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/api/sauces", sauceRoutes);

//export app
module.exports = app;