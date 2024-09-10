const express = require("express");
const router = express.Router();
const {
  sendInvitation,
  getGuestHistory,
  getUpcomingEvents,
  resendInvitation,
} = require("../controllers/guestController");
const{validateSendInvitation} = require("../utils/validator");

// Route to send an invitation

router.post('/send-invitation', validateSendInvitation, sendInvitation);
// localhost:3000/api/send-invitation

// Route to get guest history
router.get("/guest-history", getGuestHistory);
// localhost:3000/api/guest-history

// Route to get upcoming events
router.get("/upcoming-events", getUpcomingEvents);
// localhost:3000/api/upcoming-events

// Route to resend invitation
router.post("/resend-invitation/:passId", resendInvitation);
// localhost:3000/api/resend-invitation


module.exports = router;
