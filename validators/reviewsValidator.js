const validator = require('../helpers/validate');

const reviewValidation = (req, res, next) => {
  const validationRules = {
    userId: 'required|string|regex:/^[0-9a-fA-F]{24}$/',
    pizzaId: 'required|string|regex:/^[0-9a-fA-F]{24}$/',
    rating: 'required|numeric|min:1|max:5',
    commentReview: 'required|string',
    priceRating: 'required|numeric|min:1|max:5',
  };
  validator(req.body, validationRules, {}, (err, status) => {
    if (!status) {
      res.status(400).send({
        success: false,
        message: 'Validation failed',
        data: err,
      });
    } else {
      next();
    }
  });
};

module.exports = { reviewValidation };
