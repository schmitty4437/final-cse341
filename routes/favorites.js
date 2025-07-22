const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites');
const { favoriteValidation } = require('../validators/favoritesValidator');
const { verifyToken } = require('../validators/usersValidator');

// Get favorites based on ALL or by id
router.get('/', favoritesController.getAllFavorites);
router.get('/:id', favoritesController.getFavoriteById);

// POST, PUT, DELETE routes
router.post('/', verifyToken, favoriteValidation, favoritesController.createFavorite);
router.put('/:id', verifyToken, favoriteValidation, favoritesController.updateFavorite);
router.delete('/:id', verifyToken, favoritesController.deleteFavorite);

module.exports = router;