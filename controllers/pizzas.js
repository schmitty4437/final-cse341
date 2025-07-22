const { client } = require('../db/connection');
const { ObjectId } = require('mongodb');

/*****************************
 Function to get all pizzas
******************************/
const getAllPizzas = async (req, res) => {
  try {
    const pizzas = await client
      .db('pizzaReviewDB')
      .collection('pizzas')
      .find()
      .toArray();
    res.json({ pizzas });
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
};

/*****************************
 Function to get pizza by id
******************************/
const getPizzaById = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const pizza = await client
    .db('pizzaReviewDB')
    .collection('pizza')
    .findOne({ _id: new ObjectId(id) });

  if (!pizza) {
    return res.status(404).json({ error: 'Pizza not found' });
  }
  res.json(pizza);
};

/*****************************
 Function to create pizza
******************************/
const createPizza = async (req, res) => {
  const newPizza = {
    name: req.body.name,
    brand: req.body.brand,
    description: req.body.description,
    createdDate: new Date(),
    updatedDate: new Date(),
  };

  const result = await client
    .db('pizzaReviewDB')
    .collection('pizzas')
    .insertOne(newPizza);
  if (result.acknowledged) {
    res.status(201).json({ id: result.insertedId });
  } else {
    res.status(500).json({ error: 'Failed to create pizza' });
  }
};

/*****************************
 Function to update pizza
******************************/
const updatePizza = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const updatedPizza = {
    name: req.body.name,
    level: req.body.level,
    description: req.body.description,
    updatedDate: new Date(),
  };

  const result = await client
    .db('pizzaReviewDB')
    .collection('pizzas')
    .updateOne({ _id: new ObjectId(id) }, { $set: updatedPizza });

  if (result.matchedCount > 0) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Pizza not found' });
  }
};

/*****************************
 Function to delete pizza
******************************/
const deletePizza = async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  const result = await client
    .db('pizzaReviewDB')
    .collection('pizzas')
    .deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount > 0) {
    res.status(200).send();
  } else {
    res.status(404).json({ error: 'Pizza not found' });
  }
};

module.exports = {
  getAllPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
};
