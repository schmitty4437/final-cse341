require('dotenv').config();
require('./config/passport');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { connectDb } = require('./db/connection');
const nameRouter = require('./routes/index');
const reviewsRouter = require('./routes/reviews');
const pizzasRouter = require('./routes/pizzas');
const favoritesRouter = require('./routes/favorites');
const passport = require('passport');
const cookieParser = require('cookie-parser');

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Parse JSON request bodies
app.use(express.json());

// Passport for GitHub OAuth
app.use(passport.initialize());

// Use cookies for JWT
app.use(cookieParser());

app.use('/', nameRouter);
app.use('/reviews', reviewsRouter);
app.use('/pizzas', pizzasRouter);
app.use('/favorites', favoritesRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server after DB connection
connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Web Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });
