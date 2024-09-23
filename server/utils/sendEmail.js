const nodemailer = require("nodemailer");
const { getEmailTemplate } = require("./emailTemplateService"); // Ensure correct path
require("dotenv").config();

const sendEmailAndSaveGuest = async (guest, subject, replacements) => {
  try {
    // Retrieve email template
    const template = await getEmailTemplate();
    if (!template || !template.template) {
      throw new Error("Email template not found");
    }

    console.log(replacements);
    // Replace placeholders in the template
    let emailHtml = template.template.replace(
      /{{(.*?)}}/g, // Regex to match {{placeholder}}
      (match, key) => {
        const trimmedKey = key.trim();
        return replacements[trimmedKey] || match; // Replace placeholder with value or leave as-is
      }
    );

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", // Ensure this is a boolean
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
      from: `"Kristu Jayanti College" <${process.env.SMTP_USER}>`,
      to: guest.email,
      subject: subject,
      html: emailHtml,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log(`Invitation email sent to ${guest.email}`);

    return true;
  } catch (error) {
    console.error("Error sending email:", error.message);
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

    // Save the updated guest record
    await guest.save();
    return guest;
  } catch (error) {
    console.error("Error updating guest:", error.message);
    throw new Error("Failed to update guest");
  }
};

module.exports = {
  sendEmailAndSaveGuest,
  updateGuest,
};
