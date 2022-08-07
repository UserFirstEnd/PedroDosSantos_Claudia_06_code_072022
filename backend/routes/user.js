//With this file we will call the controller for user signup and login

const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user');

//CRUD
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;