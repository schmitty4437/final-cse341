const { client } = require('../db/connection');
const { ObjectId } = require('mongodb');

/***************************** 
Function to get all reviews
******************************/
const getAllReviews = async (req, res) => {
  try {
    // Query the reviews collection in pizzaReadersDB and convert results to an array
    const review = await client.db('pizzaReviewDB').collection('reviews').find().toArray();
    res.json({ review });
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
};

/***************************** 
Function to get review by id
******************************/
const getReviewById = async (req, res) => {
  // Get id from url
  const id = req.params.id;
  // Checks if id is valid MongoDB ObjectId
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const review = await client
    .db('pizzaReviewDB')
    .collection('reviews')
    .findOne({ _id: new ObjectId(id) });

  if (!review) {
    return res.status(404).json({ error: 'Review not found' });
  }
  res.json(review);
};

/***************************** 
POST/create review function
******************************/
const createReview = async (req, res) => {
  // Creating newReview object
  const newReview = {
    userId: req.body.userId,
    pizzaId: req.body.pizzaId,
    rating: req.body.rating,
    commentReview: req.body.commentReview,
    createdDate: req.body.createdDate,
    updatedDate: req.body.updatedDate,
    priceRating: req.body.priceRating
  };

  // Inserting into database
  const result = await client.db('pizzaReviewDB').collection('reviews').insertOne(newReview);
  if (result.acknowledged) {
    res.status(201).json({ id: result.insertedId });
  } else {
    res.status(500).json(result.error || 'Failed to create review.');
  }
};

/***************************** 
PUT-update review function
******************************/
const updateReview = async (req, res) => {
  // Gets the id from URL
  const reviewId = req.params.id;

  // Creating updatedReview object
  const updatedReview = {
    userId: req.body.userId,
    pizzaId: req.body.pizzaId,
    rating: req.body.rating,
    commentReview: req.body.commentReview,
    createdDate: req.body.createdDate,
    updatedDate: req.body.updatedDate,
    priceRating: req.body.priceRating
  };

  // Storing it into database
  const result = await client
    .db('pizzaReviewDB')
    .collection('reviews')
    .updateOne({ _id: new ObjectId(reviewId) }, { $set: updatedReview });
  if (result.matchedCount > 0) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Review not found' });
  }
};

/***************************** 
DELETE Review function
******************************/
const deleteReview = async (req, res) => {
  // Getting reviewId from URL
  const reviewId = req.params.id;

  if (!ObjectId.isValid(reviewId)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  // Delete review from database
  const result = await client
    .db('pizzaReviewDB')
    .collection('reviews')
    .deleteOne({ _id: new ObjectId(reviewId) });
  if (result.deletedCount > 0) {
    res.status(200).send();
  } else {
    res.status(404).json({ error: 'Review not found' });
  }
};

module.exports = { getAllReviews, getReviewById, createReview, updateReview, deleteReview };