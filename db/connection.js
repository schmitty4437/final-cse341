const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let dbConnection;

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