const { client } = require('../db/connection');
const { ObjectId } = require('mongodb');

/*****************************
 Function to get all favorites
******************************/
const getAllFavorites = async (req, res) => {
  try {
    const favorites = await client.db('pizzaReviewDB').collection('favorites').find().toArray();
    res.json({ favorites });
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
};

/*****************************
 Function to get favorite by id
******************************/
const getFavoriteById = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const favorite = await client
    .db('pizzaReviewDB')
    .collection('favorites')
    .findOne({ _id: new ObjectId(id) });

  if (!favorite) {
    return res.status(404).json({ error: 'Favorite not found' });
  }
  res.json(favorite);
};

/*****************************
 Function to create favorite
******************************/
const createFavorite = async (req, res) => {
  const newFavorite = {
    pizzaId: req.body.pizzaId,
    reviewId: req.body.reviewId,
    createdDate: new Date(),
    updatedDate: new Date()
  };

  const result = await client.db('pizzaReviewDB').collection('favorites').insertOne(newFavorite);
  if (result.acknowledged) {
    res.status(201).json({ id: result.insertedId });
  } else {
    res.status(500).json({ error: 'Failed to create favorite' });
  }
};

/*****************************
 Function to delete favorite
******************************/
const deleteFavorite = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const result = await client
    .db('pizzaReviewDB')
    .collection('favorites')
    .deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount > 0) {
    res.status(200).send();
  } else {
    res.status(404).json({ error: 'Favorite not found' });
  }
};

module.exports = { getAllFavorites, getFavoriteById, createFavorite, deleteFavorite };