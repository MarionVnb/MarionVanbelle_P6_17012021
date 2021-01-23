const express = require('express');
const router = express.Router(); // création d'un routeur Express
const auth = require('../middleware/auth'); 
const multer = require ('../middleware/multer-config'); 
const sauceCtrl = require('../controllers/sauce');

// Importer la fonction avec ('URI', nomDuController.nomDeLaRoute)
router.get('/', auth, sauceCtrl.getAllSauce); // url complète: /api/sauces
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.post('/:id/like', auth, multer, sauceCtrl.likeSauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;