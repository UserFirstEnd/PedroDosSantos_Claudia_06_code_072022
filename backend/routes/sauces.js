const express = require('express'); //npm i express
const router = express.Router();

const auth = require('../middleware/auth'); // Middleware auth pour sécuriser les routes
const multer = require('../middleware/multer-config'); // Middleware multer pour gérer les images
const sauceCtrl = require('../controllers/sauces');

router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;
