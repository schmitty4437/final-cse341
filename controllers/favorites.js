const { client } = require('../db/connection');
const { ObjectId } = require('mongodb');

/***************************** 
Function to get all favorites
******************************/
const getAllFavorites = async (req, res) => {
  try {
    // Query the favorites collection in pizzaReadersDB and convert results to an array
    const favorite = await client.db('pizzaReviewDB').collection('favorites').find().toArray();
    res.json({ favorite });
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
};

/***************************** 
Function to get favorite by id
******************************/
const getFavoriteById = async (req, res) => {
  // Get id from url
  const id = req.params.id;
  // Checks if id is valid MongoDB ObjectId
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const favorite = await client
    .db('pizzaReadersDB')
    .collection('favorites')
    .findOne({ _id: new ObjectId(id) });

  if (!favorite) {
    return res.status(404).json({ error: 'Favorite not found' });
  }
  res.json(favorite);
};

/***************************** 
POST/create favorite function
******************************/
const createFavorite = async (req, res) => {
  // Creating newFavorite object
  const newFavorite = {
    pizzaId: req.body.pizzaId,
    reviewId: req.body.reviewId,
    createdDate: req.body.createdDate,
    updatedDate: req.body.updatedDate
  };

  // Inserting into database
  const result = await client.db('pizzaReviewDB').collection('favorites').insertOne(newFavorite);
  if (result.acknowledged) {
    res.status(201).json({ id: result.insertedId });
  } else {
    res.status(500).json(result.error || 'Failed to create favorite.');
  }
};

/***************************** 
PUT-update favorite function
******************************/
const updateFavorite = async (req, res) => {
  // Gets the id from URL
  const favoriteId = req.params.id;

  // Creating updatedFavorite object
  const updatedFavorite = {
    pizzaId: req.body.pizzaId,
    reviewId: req.body.reviewId,
    createdDate: req.body.createdDate,
    updatedDate: req.body.updatedDate
  };

  // Storing it into database
  const result = await client
    .db('pizzaReviewDB')
    .collection('favorites')
    .updateOne({ _id: new ObjectId(favoriteId) }, { $set: updatedFavorite });
  if (result.matchedCount > 0) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Favorite not found' });
  }
};

/***************************** 
DELETE Favorite function
******************************/
const deleteFavorite = async (req, res) => {
  // Getting favoriteId from URL
  const favoriteId = req.params.id;

  if (!ObjectId.isValid(favoriteId)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  // Delete favorite from database
  const result = await client
    .db('pizzaReviewDB')
    .collection('favorites')
    .deleteOne({ _id: new ObjectId(favoriteId) });
  if (result.deletedCount > 0) {
    res.status(200).send();
  } else {
    res.status(404).json({ error: 'Favorite not found' });
  }
};

module.exports = { getAllFavorites, getFavoriteById, createFavorite, updateFavorite, deleteFavorite };