const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

let cachedConnection = null;
let cachedConnectionPromise = null;

async function connectToDb() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in the environment variables.');
  }

  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  if (cachedConnectionPromise) {
    return cachedConnectionPromise;
  }

  try {
    cachedConnectionPromise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    cachedConnection = await cachedConnectionPromise;
    console.log('connected to db');
    return cachedConnection;
  } catch (error) {
    cachedConnectionPromise = null;
    console.error('Database connection failed:', error);
    throw error;
  }
}

module.exports = connectToDb;
