const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/users');
const {
  logoutValidation,
  createUserValidation,
  loginValidation
} = require('../validators/usersValidator');

/***************************** 
Route to get all users or search by username
******************************/
router.get('/', usersController.searchUsers);

/***************************** 
Route to start GitHub login
******************************/
router.get('/github', passport.authenticate('github'));

/***************************** 
Route to handle GitHub callback
******************************/
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  usersController.githubCallback
);

/***************************** 
Route to logout
******************************/
router.get('/logout', logoutValidation, usersController.logout);

/***************************** 
Route to create a new user
******************************/
router.post('/', createUserValidation, usersController.createUser);

/***************************** 
Route to login user
******************************/
router.post('/login', loginValidation, usersController.login);

module.exports = router;