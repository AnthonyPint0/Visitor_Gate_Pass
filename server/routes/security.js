const express = require("express");
const router = express.Router();
const {
  getGuestDetailsToday,
  updateGuestDetails,
} = require("../controllers/securityController");

//route to get guest details
router.get("/guest-details-today", getGuestDetailsToday);

router.put("/checkin-guest/:passId", updateGuestDetails);

module.exports = router;
