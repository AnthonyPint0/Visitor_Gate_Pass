const nodemailer = require("nodemailer");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // SMTP server host
  port: process.env.SMTP_PORT, // SMTP server port (typically 587 for secure connection)
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports (587, 25)
  auth: {
    user: process.env.SMTP_USER, // SMTP server username
    pass: process.env.SMTP_PASS, // SMTP server password
  },
  tls: {
    rejectUnauthorized: false, // Allows self-signed certificates (use with caution)
  },
});

module.exports = transporter;
