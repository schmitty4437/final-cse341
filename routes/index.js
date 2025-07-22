const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/reviews', require('./reviews'));
router.use('/pizzas', require('./pizzas'));
router.use('/favorites', require('./favorites'));
router.use('/users', require('./users'));

module.exports = router;