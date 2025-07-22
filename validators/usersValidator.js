const jwt = require('jsonwebtoken');
const validator = require('../helpers/validate');

/*****************************
 Checking JWT
******************************/
const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: 'You need to log in to do that' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid log in' });
    }
    req.user = decoded;
    next();
  });
};

/*****************************
 Validation for logout
******************************/
const logoutValidation = (req, res, next) => {
  const validationRules = {};
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

/*****************************
 Validation for creating a user
******************************/
const createUserValidation = (req, res, next) => {
  const validationRules = {
    username: 'required|string|min:4|max:70',
    email: 'required|email',
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

module.exports = { verifyToken, logoutValidation, createUserValidation };
