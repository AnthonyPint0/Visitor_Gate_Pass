const nodemailer = require("nodemailer");
const GuestModel = require("../models/guest"); // Adjust the path to your GuestModel
const { getEmailTemplate } = require("./emailTemplateService"); // Ensure correct path and import
const formatDateWithPadding = require("../library/helper");
const { validationResult } = require("express-validator"); // Ensure express-validator is set up

const sendEmailAndSaveGuest = async (guest, subject, replacements) => {
  try {
    const template = await getEmailTemplate(); // Call the function
    let emailTemplate = template.template;

    if (!emailTemplate) {
      throw new Error("Email template not found");
    }

    // Replace all placeholders in the template
    let emailHtml = emailTemplate.replace(
      /\${(.*?)}/g,
      (match) => replacements[match] || match
    );

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Define email options
    const mailOptions = {
      from: `"Kristu Jayanti College Invitation" <${process.env.SMTP_USER}>`,
      to: guest.email,
      subject,
      html: emailHtml,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

const updateGuest = async (guest, isNewInvitation) => {
  try {
    if (isNewInvitation) {
      guest.noOfemailSent = 1; // Initialize noOfemailSent to 1 for new invitation
    } else {
      guest.noOfemailSent = (guest.noOfemailSent || 0) + 1; // Increment noOfemailSent
    }

    await guest.save();
    return guest;
  } catch (error) {
    console.error("Error updating guest:", error);
    throw new Error("Failed to update guest");
  }
};

module.exports = {
  sendEmailAndSaveGuest,
  updateGuest,
};
