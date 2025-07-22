const express = require('express');
const router = express.Router();
const pizzasController = require('../controllers/pizzas');
const { pizzaValidation } = require('../validators/pizzasValidator');
const { verifyToken } = require('../validators/usersValidator');

// Get pizzas based on ALL or by id
router.get('/', pizzasController.getAllPizzas);
router.get('/:id', pizzasController.getPizzaById);

// POST, PUT, DELETE routes
router.post('/', verifyToken, pizzaValidation, pizzasController.createPizza);
router.put('/:id', verifyToken, pizzaValidation, pizzasController.updatePizza);
router.delete('/:id', verifyToken, pizzasController.deletePizza);

module.exports = router;