const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_CONNECTIONSTRING || "mongodb://127.0.0.1:27017/visitor_management"; // Replace with your MongoDB URI

async function connectDB() {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

module.exports = connectDB;
