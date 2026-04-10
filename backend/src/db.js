const mongoose = require("mongoose");

const connectDb = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.log("MONGO_URI not set. Using in-memory user store.");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed. Continuing with in-memory mode.");
  }
};

module.exports = { connectDb };
