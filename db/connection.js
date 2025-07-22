const { MongoClient } = require('mongodb');

// Get variable from .env file
const uri = process.env.MONGODB_URI;
// Include debug log to verify URI
console.log('MONGODB_URI:', process.env.MONGODB_URI);
const client = new MongoClient(uri);

// Store db connection
let dbConnection;

// Function to connect to db
const connectDb = async () => {
  if (dbConnection) {
    console.log('Using existing MongoDB connection');
    return dbConnection;
  }

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    dbConnection = client.db('pizzaReviewDB');
    return dbConnection;
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  }
};

module.exports = { connectDb, client };