const { client } = require('../db/connection');
const { ObjectId } = require('mongodb');

/*****************************
 Function to get all reviews
******************************/
const getAllReviews = async (req, res) => {
  try {
    const reviews = await client.db('pizzaReviewDB').collection('reviews').find().toArray();
    res.json({ reviews });
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
};

/*****************************
 Function to get review by id
******************************/
const getReviewById = async (req, res) => {
  const id = req.params.id;
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
 Function to create review
******************************/
const createReview = async (req, res) => {
  const newReview = {
    userId: req.body.userId,
    pizzaId: req.body.pizzaId,
    rating: req.body.rating,
    commentReview: req.body.commentReview,
    createdDate: new Date(),
    updatedDate: new Date(),
    priceRating: req.body.priceRating
  };

  const result = await client.db('pizzaReviewDB').collection('reviews').insertOne(newReview);
  if (result.acknowledged) {
    res.status(201).json({ id: result.insertedId });
  } else {
    res.status(500).json({ error: 'Failed to create review' });
  }
};

/*****************************
 Function to update review
******************************/
const updateReview = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const updatedReview = {
    userId: req.body.userId,
    pizzaId: req.body.pizzaId,
    rating: req.body.rating,
    commentReview: req.body.commentReview,
    updatedDate: new Date(),
    priceRating: req.body.priceRating
  };

  const result = await client
    .db('pizzaReviewDB')
    .collection('reviews')
    .updateOne({ _id: new ObjectId(id) }, { $set: updatedReview });

  if (result.matchedCount > 0) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Review not found' });
  }
};

/*****************************
 Function to delete review
******************************/
const deleteReview = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  const result = await client
    .db('pizzaReviewDB')
    .collection('reviews')
    .deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount > 0) {
    res.status(200).send();
  } else {
    res.status(404).json({ error: 'Review not found' });
  }
};

module.exports = { getAllReviews, getReviewById, createReview, updateReview, deleteReview };