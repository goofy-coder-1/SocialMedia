const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log('Connecting to MongoDB with URI:', uri);

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🚀 MongoDB connected successfully');
  } catch (err) {
    console.error('☠️ MongoDB connection failed:', err.message);
  }
};

module.exports = dbConnect;
