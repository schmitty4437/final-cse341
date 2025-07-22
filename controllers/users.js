const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { client } = require('../db/connection');

/***************************** 
Function to handle GitHub login callback
******************************/
const githubCallback = (req, res) => {
  if (!req.user) {
    return res.status(400).json({ error: 'Login failed' });
  }

  // Create JWT token
  const token = jwt.sign(
    { userId: req.user._id, username: req.user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Set JWT in cookie
  res.cookie('jwt', token, { httpOnly: true });

  // Redirect to home or send success
  res.redirect('/');
};

/***************************** 
Function to logout user
******************************/
const logout = (req, res) => {
  // Clear JWT cookie
  res.clearCookie('jwt');
  res.json({ message: 'Logged out' });
};

/***************************** 
Function to create a new user
******************************/
const createUser = async (req, res) => {
  // Get user data from request body
  const { username, email, oAuth } = req.body;

  // Check if user already exists
  const existingUser = await client
    .db('pizzaReviewDB')
    .collection('users')
    .findOne({ email: email });

  if (existingUser) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  // Create new user
  const newUser = {
    username: username,
    email: email,
    oAuth: oAuth,
    createdDate: new Date(),
    updatedDate: new Date()
  };

  // Insert into database
  const result = await client.db('pizzaReviewDB').collection('users').insertOne(newUser);

  if (result.acknowledged) {
    res.status(201).json({ id: result.insertedId });
  } else {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

/***************************** 
Function to search users
******************************/
const searchUsers = async (req, res) => {
  // Get search query
  const query = req.query.username || '';

  // Find users matching username
  const users = await client
    .db('pizzaReviewDB')
    .collection('users')
    .find({ username: { $regex: query, $options: 'i' } })
    .project({ username: 1, email: 1, createdDate: 1, _id: 0 })
    .toArray();

  res.json({ users });
};

/***************************** 
Function to login user
******************************/
const login = async (req, res) => {
  // Get credentials from request body
  const { email, password } = req.body;

  // Find user by email
  const user = await client.db('pizzaReviewDB').collection('users').findOne({ email: email });

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Check password
  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Create JWT token
  const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  // Set JWT in cookie
  res.cookie('jwt', token, { httpOnly: true });

  res.json({ message: 'Logged in successfully' });
};

module.exports = { githubCallback, logout, createUser, searchUsers, login };