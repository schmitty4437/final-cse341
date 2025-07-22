const validator = require('../helpers/validate');

const favoriteValidation = (req, res, next) => {
  const validationRules = {
    pizzaId: 'required|string|regex:/^[0-9a-fA-F]{24}$/',
    reviewId: 'required|string|regex:/^[0-9a-fA-F]{24}$/'
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

module.exports = { favoriteValidation };