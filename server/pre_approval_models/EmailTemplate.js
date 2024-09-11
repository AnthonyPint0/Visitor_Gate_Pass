const mongoose = require("mongoose");

const emailTemplateSchema = new mongoose.Schema({
  templateId: { type: Number, required: true, unique: true }, // ID field, unique for each template
  template: { type: String, required: true }, // Template field, containing the email template
});

const EmailTemplateModel = mongoose.model(
  "emailTemplates",
  emailTemplateSchema,
  "emailTemplate"
);

module.exports = EmailTemplateModel;
