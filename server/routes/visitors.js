const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Visitor = require("../models/visitors.js");
const VisitorSession = require("../models/visitor_sessions.js");
const VisitorGroup = require("../models/visitor_groups.js");
const VisitorCard = require("../models/visitor_cards.js");
const VisitorModel = require("../models/visitors.js");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

// Get all visitors and related information
router.get(
  "/visitors",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  async (req, res) => {
    try {
      const visitors = await Visitor.find({});
      const sessions = await VisitorSession.find({});
      const groups = await VisitorGroup.find({});
      const cards = await VisitorCard.find({});

      const result = sessions.map((session) => {
        const visitor = visitors.find((v) => v._id.equals(session.visitor_id));
        const group = groups.find((g) => g._id.equals(session.group_id));
        const groupMembers = group ? group.group_members : ["102", 130];
        const checkOutTimes = groupMembers.map(
          (member) => member.check_out_time
        );
        let latestCheckOutTime = null;
        if (
          checkOutTimes.length > 0 &&
          checkOutTimes.every((time) => time !== null)
        ) {
          latestCheckOutTime = new Date(
            Math.max(...checkOutTimes.map((time) => new Date(time)))
          );
        }

        return {
          _id: session._id,
          name: visitor ? visitor.name : "Nah",
          phone_number: visitor ? visitor.phone_number : "Nah",
          purpose_of_visit: session.purpose_of_visit,
          entry_gate: session.entry_gate,
          check_in_time: session.check_in_time,
          exit_gate: session.exit_gate,
          check_out_time: latestCheckOutTime,
          group_size: session.group_size,
          photos: session.photos,
          visitor_cards: groupMembers
            ? groupMembers
            : [
                { card_id: "404", status: "checked_out" },
                { card_id: "500", status: "checked_in" },
              ],
        };
      });

      res.json(result);
    } catch (err) {
      console.error("Error fetching visitors:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Other visitor-related routes...

module.exports = router;
