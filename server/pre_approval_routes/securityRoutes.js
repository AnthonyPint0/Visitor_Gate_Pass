const express = require("express");
const router = express.Router();
const {
  getGuestDetails,
  updateGuestDetails,
} = require("../controllers/securityController");
const{validateUpdateGuestDetails} = require("../utils/validator");
//route to get guest details
router.get("/guest-details/:passId", getGuestDetails);
// localhost:3000/api/security/guest   // nhi security wali dono hi nhi

//route to update guest details
router.put("/guest-approveEntry/:passId",validateUpdateGuestDetails, updateGuestDetails);
// localhost:3000/api/security/guest
module.exports = router;