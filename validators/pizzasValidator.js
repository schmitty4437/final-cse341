const validator = require('../helpers/validate');

const pizzaValidation = (req, res, next) => {
  const validationRules = {
    name: 'required|string',
    brand: 'required|string',
    description: 'required|string'
  };
  validator(req.body, validationRules, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

module.exports = { pizzaValidation };