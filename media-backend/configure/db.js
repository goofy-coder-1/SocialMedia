const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    const uri = process.env.MONGO_URI; // Declare and assign here
    console.log('Connecting to MongoDB with URI:', uri);

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🚀 MongoDB connected successfully');
  } catch (err) {
    // Don't use uri here since it might be undefined or out of scope
    console.error('☠️ MongoDB connection failed:', err.message);
  }
};

module.exports = dbConnect;
