const express = require("express");
const router = express.Router();
const {
  sendInvitation,
  getGuestHistory,
  getUpcomingEvents,
  resendInvitation,
  updateInvitation,
} = require("../controllers/guestController");
const { validateSendInvitation } = require("../utils/validator");

router.post("/send-invitation", validateSendInvitation, sendInvitation);

router.get("/guest-history", getGuestHistory);

router.get("/upcoming-events", getUpcomingEvents);

router.post("/resend-invitation/:passId", resendInvitation);

router.put("/update/:id", updateInvitation);

module.exports = router;
