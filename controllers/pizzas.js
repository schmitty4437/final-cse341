const { client } = require('../db/connection');
const { ObjectId } = require('mongodb');

/***************************** 
Function to get all pizzas
******************************/
const getAllPizzas = async (req, res) => {
  try {
    // Query the pizzas collection in pizzaReadersDB and convert results to an array
    const pizza = await client.db('pizzaReviewDB').collection('pizzas').find().toArray();
    res.json({ pizza });
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
};

/***************************** 
Function to get pizza by id
******************************/
const getPizzaById = async (req, res) => {
  // Get id from url
  const id = req.params.id;
  // Checks if id is valid MongoDB ObjectId
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const pizza = await client
    .db('pizzaReviewDB')
    .collection('pizzas')
    .findOne({ _id: new ObjectId(id) });

  if (!pizza) {
    return res.status(404).json({ error: 'Pizza not found' });
  }
  res.json(pizza);
};

/***************************** 
POST/create pizza function
******************************/
const createPizza = async (req, res) => {
  // Creating newPizza object
  const newPizza = {
    name: req.body.name,
    brand: req.body.brand,
    description: req.body.description,
    createdDate: req.body.createdDate,
    updatedDate: req.body.updatedDate
  };

  // Inserting into database
  const result = await client.db('pizzaReviewDB').collection('pizzas').insertOne(newPizza);
  if (result.acknowledged) {
    res.status(201).json({ id: result.insertedId });
  } else {
    res.status(500).json(result.error || 'Failed to create pizza.');
  }
};

/***************************** 
PUT-update pizza function
******************************/
const updatePizza = async (req, res) => {
  // Gets the id from URL
  const pizzaId = req.params.id;

  // Creating updatedPizza object
  const updatedPizza = {
    name: req.body.name,
    brand: req.body.brand,
    description: req.body.description,
    createdDate: req.body.createdDate,
    updatedDate: req.body.updatedDate
  };

  // Storing it into database
  const result = await client
    .db('pizzaReviewDB')
    .collection('pizzas')
    .updateOne({ _id: new ObjectId(pizzaId) }, { $set: updatedPizza });
  if (result.matchedCount > 0) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Pizza not found' });
  }
};

/***************************** 
DELETE Pizza function
******************************/
const deletePizza = async (req, res) => {
  // Getting pizzaId from URL
  const pizzaId = req.params.id;

  if (!ObjectId.isValid(pizzaId)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  // Delete pizza from database
  const result = await client
    .db('pizzaReviewDB')
    .collection('pizzas')
    .deleteOne({ _id: new ObjectId(pizzaId) });
  if (result.deletedCount > 0) {
    res.status(200).send();
  } else {
    res.status(404).json({ error: 'Pizza not found' });
  }
};

module.exports = { getAllPizzas, getPizzaById, createPizza, updatePizza, deletePizza };