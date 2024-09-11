// routes/auth.js
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");
const router = express.Router();
const UsersModel = require("../models/users.js");
const { sendOtpEmail } = require("../models/emailService.js");
const bcrypt = require("bcrypt");
const otpStorage = {};

// Function to generate a random 4-character OTP
const generateOtp = () => {
  return Math.floor(10000 + Math.random() * 90000).toString(); // 4-digit numeric OTP
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let userRole;

  try {
    // Find user by email
    const user = await UsersModel.findOne({ email });

    if (!user) {
      return res.json({ message: "No record found for this email." });
    }

    userRole = user.role;

    // Compare provided password with hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      // Create payload for JWT
      const payload = {
        id: user._id, // Ensure correct field name for user ID
        name: user.name,
        email: user.email,
        role: user.role, // Assuming you have a role field in the user model
        phone_number: user.phone_number,
      };

      // Sign token
      try {
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "12h",
        });
        res.json({ token });
      } catch (err) {
        console.error("Token creation error:", err);
        return res
          .status(500)
          .json({ message: "Internal server error while creating token." });
      }
    } else {
      return res.json({ message: "Incorrect password." });
    }
  } catch (err) {
    console.error("Error during user lookup:", err);
    return res
      .status(500)
      .json({ message: "Internal server error during login." });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone_number, access_code } = req.body;

    if (access_code === "QAZ-PLM") {
      // Check if all required fields are provided
      if (!name || !email || !password || !role || !phone_number) {
        return res.status(400).json({ message: "All fields are required." });
      }

      // Check if the user already exists
      const existingUser = await UsersModel.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already exists with this email." });
      }

      // Create a new user instance
      const newUser = new UsersModel({
        name,
        email,
        password, // Password will be hashed in the schema pre-save hook
        role,
        phone_number,
      });

      // Save the user to the database
      await newUser.save();

      // Respond with a success message
      res.status(201).json({ message: "User registered successfully!" });
    } else {
      res.status(401).json({ message: "Access Denied" });
      console.error("Access Denied");
    }
  } catch (err) {
    console.error("Error during user registration:", err);
    res
      .status(500)
      .json({ message: "Internal server error during registration." });
  }
});

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the database
    const user = await UsersModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate a 4-character OTP
    const otp = generateOtp();

    // Set OTP expiration time (e.g., 5 minutes from now)
    const expiresAt = Date.now() + 5 * 60 * 1000;

    // Store the OTP and its expiration time in otpStorage
    otpStorage[email] = { otp, expiresAt };

    // Send the OTP to the user's email
    await sendOtpEmail(email, otp);
    console.log(`Generated OTP for ${email}: ${otp}`); // Log the OTP (for debugging)

    return res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (err) {
    console.error("Error in /send-otp:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if the email exists in the database
    const user = await UsersModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Check if an OTP was generated for this email
    const storedOtpDetails = otpStorage[email];

    if (!storedOtpDetails) {
      return res.status(400).json({ message: "OTP not found for this email" });
    }

    const { otp: storedOtp, expiresAt } = storedOtpDetails;

    // Check if the OTP has expired
    if (Date.now() > expiresAt) {
      delete otpStorage[email]; // Clean up expired OTP
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Check if the provided OTP matches the stored OTP
    if (otp !== storedOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid, proceed with the desired action (e.g., password reset)
    delete otpStorage[email]; // Remove the OTP after successful verification

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Error in /verify-otp:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/change-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await UsersModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password in the database
    await UsersModel.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true } // This option returns the modified document
    );

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error in /change-password:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
