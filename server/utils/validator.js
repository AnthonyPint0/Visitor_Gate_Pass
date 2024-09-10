const { body, validationResult } = require('express-validator');

const validateSendInvitation = [
  body('name')
    .isString()
    .notEmpty()
    .withMessage('Name is required and must be a non-empty string.'),
  body('email')
    .isEmail()
    .withMessage('A valid email is required.'),
  body('subject')
    .isString()
    .optional()
    .withMessage('Subject must be a string if provided.'),
  body('mobile')
    .isMobilePhone()
    .notEmpty()
    .withMessage('A valid mobile phone number is required.'),
  body('event')
    .isString()
    .notEmpty()
    .withMessage('Event is required and must be a non-empty string.'),
  body('invitedAs')
    .isString()
    .notEmpty()
    .withMessage('Invited As is required and must be a non-empty string.'),
  body('eventDateTime')
    .isISO8601()
    .toDate()
    .withMessage('A valid date and time is required in ISO 8601 format.'),
];


  const validateUpdateGuestDetails = [
    body("noOfGuest")
      .isInt({ min: 1 })
      .withMessage("Number of guests must be a positive integer"),
  ];

module.exports = { validateSendInvitation , validateUpdateGuestDetails};
