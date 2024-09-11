const nodemailer = require("nodemailer");

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "Gmail", // Use any email service provider like Gmail, Outlook, etc.
  auth: {
    user: "22bcae42@kristujayanti.com", // Replace with your email
    pass: "ofgb dkwq wtbe bmys", // Replace with your email password or app-specific password
  },
});

// Function to send OTP email
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: "22bcae42@kristujayanti.com", // Sender's email address
    to: email, // Recipient's email address
    subject: "Your OTP Code", // Subject line
    text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`, // Email body (plain text)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send OTP email");
  }
};

// Export the sendOtpEmail function
module.exports = { sendOtpEmail };
