const mongoose = require("mongoose");
const { seed } = require("../scripts/seeds/index");

const NODE_ENV = process.env.NODE_ENV;
const MONGO_DB_URL =
  NODE_ENV === "development"
    ? process.env.MONGO_DB_DEV
    : process.env.MONGO_DB_PROD;
const options = {
  autoIndex: true, // Build Indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
};

const DBConnection = async () => {
  try {
    const db = await mongoose.connect(MONGO_DB_URL, options);
    console.log(`MongoDB Connection Established On host ${db.connection.host}`);
    seed();
  } catch (error) {
    console.log(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
DBConnection();

exports.mongoose = mongoose;
