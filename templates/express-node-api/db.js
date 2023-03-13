const mongoose = require('mongoose');

// Replace the connection string with the URI for your own local MongoDB instance
const uri = 'mongodb://mongo:27017/mydatabase';

async function connect() {
  try {
    // Connect to the MongoDB instance using Mongoose
    await mongoose.connect(uri);

    // Log a message indicating that the connection was successful
    console.log('Connected to MongoDB');

    // Return the Mongoose connection object for use in other parts of the application
    return mongoose.connection;
  } catch (err) {
    // If an error occurs while connecting, log the error message and throw the error
    console.error('Error connecting to MongoDB', err);
    throw err;
  }
}

module.exports = { connect };