const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://DevTinder:UZXyq1QxS21wBAvB@forfun.pauklh9.mongodb.net/TechBond",
  );
};

module.exports = connectDB;
