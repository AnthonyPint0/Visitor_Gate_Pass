const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");
const Visitor = require("../models/visitors.js");
const VisitorSession = require("../models/visitor_sessions.js");
const VisitorGroup = require("../models/visitor_groups.js");
const VisitorCard = require("../models/visitor_cards.js");
const UsersModel = require("../models/users.js");
const EmailTemplateModel = require("../models/EmailTemplate.js");

// Middleware for password verification
const verifyPassword = (req, res, next) => {
  const { password } = req.body;
  const correctPassword = "Gaet_Pa$$"; // Replace this with your actual password or use environment variables
  if (password === correctPassword) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Incorrect password" });
  }
};

// Route to initialize the database
router.post("/initialize-database", verifyPassword, async (req, res) => {
  try {
    // Clear existing documents in VisitorCard collection
    await VisitorCard.deleteMany({});

    // Insert 500 documents into VisitorCard collection
    const cardDocuments = Array.from({ length: 500 }, (_, i) => ({
      _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for each document
      card_id: String(i + 1).padStart(3, "0"),
      status: "available",
      assigned_to: null,
      last_assigned: [],
    }));
    await VisitorCard.insertMany(cardDocuments);

    const eventName = "${eventName}"; // Set actual values
    const eventDateTime = "${eventDateTime}";
    const name = "${name}";
    const passId = "${passId}";
    const contactEmail = "${contactEmail}";
    const contactPhoneNumber = "${contactPhoneNumber}";

    // Insert predefined email template into EmailTemplate collection
    const emailTemplate = {
      template: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invitation to {{eventName}}</title>
    <!-- Fixed here -->
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #34495e;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-color: #f3f3f3;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #ffffff;
        border: 1px solid #dddddd;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
      }
      .header h1 {
        margin: 0;
        color: #0b3574;
      }
      .content {
        padding: 20px 0;
      }
      .content p {
        margin: 10px 0;
      }
      .gate-pass {
        background-color: #0b3574;
        color: #ffffff;
        font-size: 18px;
        text-align: center;
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
      }
      .footer {
        text-align: center;
        padding-top: 20px;
        color: #777777;
        font-size: 14px;
      }
      .footer a {
        color: #0b3574;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>You're Invited!</h1>
      </div>
      <div class="content">
        <p>Dear {{Gname}},</p>
        <p>We are excited to invite you to our upcoming event:</p>
        <p><strong>Event Name: </strong>{{eventName}}</p>
        <p><strong>Date: </strong>{{eventDateTime}}</p>
        <p><strong>Location: </strong>Kristu Jayanti College</p>
        <p>Please present this Gate Pass ID at the security gate for entry:</p>
        <div class="gate-pass">Gate Pass ID: <strong>{{passId}}</strong></div>
        <p>We look forward to your presence!</p>
        <p>Best regards,</p>
        <p>Kristu Jayanti College</p>
      </div>
      <div class="footer">
        <p>
          If you have any questions, please contact us at
          <a href="mailto:{{contactEmail}}">{{contactEmail}}</a> or call us at
          {{contactPhoneNumber}}.
        </p>
      </div>
    </div>
  </body>
</html>`,
      templateId: 1,
    };
    await EmailTemplateModel.create(emailTemplate);

    const emailTemplate2 = {
      template: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invitation to {{eventName}}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #34495e;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-color: #f3f3f3;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #ffffff;
        border: 1px solid #dddddd;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
      }
      .header h1 {
        margin: 0;
        color: #0b3574;
      }
      .content {
        padding: 20px 0;
      }
      .content p {
        margin: 10px 0;
      }
      .gate-pass {
        background-color: #0b3574;
        color: #ffffff;
        font-size: 18px;
        text-align: center;
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
      }
      .footer {
        text-align: center;
        padding-top: 20px;
        color: #777777;
        font-size: 14px;
      }
      .footer a {
        color: #0b3574;
        text-decoration: none;
      }
      .highlight {
        color: #e74c3c;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>You're Invited!</h1>
      </div>
      <div class="content">
        <p>Dear {{Gname}},</p>
        <p>We are thrilled to invite you to our upcoming event:</p>
        <p><strong>Event Name:</strong> {{eventName}}</p>
        <p><strong>Date:</strong> {{eventDateTime}}</p>
        <p><strong>Location:</strong> Kristu Jayanti College</p>
        <p><strong>Gate Number:</strong> {{gateNumber}}</p>
        <p><strong>Number of People Allowed:</strong> {{numberOfPeople}}</p>
        <p><strong>Vehicle Parking Info:</strong> {{parkingInfo}}</p>
        <p>Please present this Gate Pass ID at the security gate for entry:</p>
        <div class="gate-pass">Gate Pass ID: <strong>{{passId}}</strong></div>
        <p>We look forward to your presence!</p>
        <p>Best regards,</p>
        <p>Kristu Jayanti College</p>
      </div>
      <div class="footer">
        <p>
          If you have any questions, please contact us at
          <a href="mailto:{{contactEmail}}">{{contactEmail}}</a> or call us at
          {{contactPhoneNumber}}.
        </p>
      </div>
    </div>
  </body>
</html>
`,
      templateId: 2,
    };
    await EmailTemplateModel.create(emailTemplate2);

    res.status(200).json({ message: "Database initialized successfully" });
    console.log("Initialized Database!");
  } catch (error) {
    console.error("Error initializing database:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    console.log("From Initialize Database");
  }
});

module.exports = router;
