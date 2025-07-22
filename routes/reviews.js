const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews');
const { reviewValidation } = require('../validators/reviewsValidator');
const { verifyToken } = require('../validators/usersValidator');

// Get reviews
router.get('/', reviewsController.getAllReviews);
router.get('/:id', reviewsController.getReviewById);

// CRUD routes with validation and authentication
router.post('/', verifyToken, reviewValidation, reviewsController.createReview);
router.put('/:id', verifyToken, reviewValidation, reviewsController.updateReview);
router.delete('/:id', verifyToken, reviewsController.deleteReview);

module.exports = router;