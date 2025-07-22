const jwt = require('jsonwebtoken');
const { client } = require('../db/connection');

/*****************************
 Function to handle GitHub login callback
******************************/
const githubCallback = (req, res) => {
  if (!req.user) {
    return res.status(400).json({ error: 'Login failed' });
  }

  const token = jwt.sign(
    { userId: req.user._id, username: req.user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.cookie('jwt', token, { httpOnly: true });
  res.redirect('/');
};

/*****************************
 Function to logout user
******************************/
const logout = (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Logged out' });
};

/*****************************
 Function to create a new user (optional, for non-OAuth)
******************************/
const createUser = async (req, res) => {
  const { username, email } = req.body;

  const existingUser = await client
    .db('pizzaReviewDB')
    .collection('users')
    .findOne({ email: email });

  if (existingUser) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  const newUser = {
    username: username,
    email: email,
    createdDate: new Date(),
    updatedDate: new Date(),
    role: 'user'
  };

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
  const query = req.query.username || '';

  const users = await client
    .db('pizzaReviewDB')
    .collection('users')
    .find({ username: { $regex: query, $options: 'i' } })
    .project({ username: 1, email: 1, createdDate: 1, _id: 0 })
    .toArray();

  res.json({ users });
};

module.exports = { githubCallback, logout, createUser, searchUsers };