const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites');
const { favoriteValidation } = require('../validators/favoritesValidator');
const { verifyToken } = require('../validators/usersValidator');

// Get favorites
router.get('/', favoritesController.getAllFavorites);
router.get('/:id', favoritesController.getFavoriteById);

// CRUD routes with validation and authentication
router.post('/', verifyToken, favoriteValidation, favoritesController.createFavorite);
router.delete('/:id', verifyToken, favoritesController.deleteFavorite);

module.exports = router;