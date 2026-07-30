const mongoose = require('mongoose');

async function connectToDb() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in the environment variables.');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // Timeout connection attempts after 5 seconds
    });

    console.log('connected to db');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

module.exports = connectToDb;
