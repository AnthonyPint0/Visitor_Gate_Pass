const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://anthony21:anthony21@cluster0.ezgcwet.mongodb.net/visitor_management?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB URI

async function connectDB() {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

module.exports = connectDB;