const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");
const {
  getGuestDetailsToday,
  updateGuestDetails,
} = require("../controllers/securityController");

//route to get guest details
router.get(
  "/guest-details-today",
  // authenticateToken,
  // authorizeRole(["admin", "security"]),
  getGuestDetailsToday
);

router.put(
  "/checkin-guest/:passId",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  updateGuestDetails
);

module.exports = router;
