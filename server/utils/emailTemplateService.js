const EmailTemplateModel = require("../models/EmailTemplate");

async function getEmailTemplate() {
  // Fetch the email template from the database using the ID
  const templateId = 2; // Replace with the actual ID of the template you want to use
  const template = await EmailTemplateModel.findOne({
    templateId: templateId,
  });

  return template;
}

module.exports = { getEmailTemplate }; // Export as an object with a named property
