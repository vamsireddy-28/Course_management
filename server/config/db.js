const mongoose = require('mongoose');

let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

// Connect to MongoDB Atlas with connection caching for serverless environments
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is missing from environment variables.');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000
    }).then((instance) => {
      console.log(`Connected to MongoDB Atlas: ${instance.connection.name}`);
      return instance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
};

module.exports = connectDB;
