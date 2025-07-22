const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews');
const { reviewValidation } = require('../validators/reviewsValidator');
const { verifyToken } = require('../validators/usersValidator');

// Get reviews based on ALL or by id
router.get('/', reviewsController.getAllReviews);
router.get('/:id', reviewsController.getReviewById);

// POST, PUT, DELETE routes
router.post('/', verifyToken, reviewValidation, reviewsController.createReview);
router.put('/:id', verifyToken, reviewValidation, reviewsController.updateReview);
router.delete('/:id', verifyToken, reviewsController.deleteReview);

module.exports = router;