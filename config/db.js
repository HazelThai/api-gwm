const mongoose = require("mongoose");
const dotenv = require("dotenv");
const config = require("./config/config");
dotenv.config();
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(config.mongoose);
    console.log("Connected to MongoDB");
    return connect.connection;
  } catch (error) {
    console.error("Could not connect to MongoDB");
  }
};
module.exports = { connectDB, config };
