const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://antoniocruze17:antoniocruze20@cluster0.lgjx5.mongodb.net/visitor_management?retryWrites=true&w=majority&appName=Cluster0" ||
  "mongodb://127.0.0.1:27017/visitor_management"; // Replace with your MongoDB URI

async function connectDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

module.exports = connectDB;
