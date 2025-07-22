const jwt = require('jsonwebtoken');
const validator = require('../helpers/validate');

/***************************** 
Checking JWT
******************************/
const verifyToken = (req, res, next) => {
  // Get JWT from cookie
  const token = req.cookies.jwt;

  // Check if token exists
  if (!token) {
    return res.status(401).json({ error: 'You need to log in to do that' });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid log in' });
    }
    // Store user info in req
    req.user = decoded;
    next();
  });
};

/***************************** 
Validation for logout
******************************/
const logoutValidation = (req, res, next) => {
  // Just checking if token exists
  const validationRules = {};
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

/***************************** 
Validation for creating a user
******************************/
const createUserValidation = (req, res, next) => {
  // Set rules for the username, email, and oAuth
  const validationRules = {
    username: 'required|string|min:4|max:70',
    email: 'required|email',
    oAuth: 'required|string'
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

/***************************** 
Validation for user login
******************************/
const loginValidation = (req, res, next) => {
  // Set rules for the email and password
  const validationRules = {
    email: 'required|email',
    password: 'required|string|min:4'
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

module.exports = { verifyToken, logoutValidation, createUserValidation, loginValidation };