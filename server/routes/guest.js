const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");
const {
  sendInvitation,
  getGuestHistory,
  getUpcomingEvents,
  resendInvitation,
  updateInvitation,
} = require("../controllers/guestController");
const { validateSendInvitation } = require("../utils/validator");

router.post(
  "/send-invitation",
  authenticateToken,
  authorizeRole(["admin", "HOD"]),
  validateSendInvitation,
  sendInvitation
);

router.get(
  "/guest-history",
  // authenticateToken,
  // authorizeRole(["admin", "HOD"]),
  getGuestHistory
);

router.get(
  "/upcoming-events",
  authenticateToken,
  authorizeRole(["admin", "HOD"]),
  getUpcomingEvents
);

router.post(
  "/resend-invitation/:passId",
  authenticateToken,
  authorizeRole(["admin", "HOD"]),
  resendInvitation
);

router.put(
  "/update/:id",
  authenticateToken,
  authorizeRole(["admin", "HOD"]),
  updateInvitation
);

module.exports = router;
