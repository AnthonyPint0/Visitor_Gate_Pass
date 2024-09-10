// ../models/users.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the schema for the user document
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["security", "admin", "user", "HOD"], // Example of possible roles
  },
  name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
});

// Encrypt password before saving using pre hook
userSchema.pre("save", async function (next) {
  try {
    // Check if password is modified
    if (!this.isModified("password")) {
      return next();
    }
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(this.password, salt);
    // Replace plain text password with hashed password
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

// Create a model based on the schema
const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
