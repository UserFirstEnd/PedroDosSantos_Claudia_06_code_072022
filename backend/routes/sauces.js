/*With this file we'll call the controller so that the user can see all the sauces 
(his own and those of other users) and he can create, 
view, like / dislike, modify, delete a sauce*/

const express = require('express');

//reuse authentication part code of REST server
const router = express.Router();

const sauceCtrl = require('../controllers/sauces');

//middleware aut to secure routes
const auth = require('../middleware/auth');
//multer middleware to manage images
const multer = require('../middleware/multer-config');

//CRUD
router.post('/', auth, multer, sauceCtrl.createSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;
