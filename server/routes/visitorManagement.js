const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const VisitorSession = require("../models/visitor_sessions.js");
const VisitorGroup = require("../models/visitor_groups.js");
const VisitorCard = require("../models/visitor_cards.js");
const VisitorModel = require("../models/visitors.js");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

// Check if phone number exists
router.get(
  "/phoneNumber",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  async (req, res) => {
    const { phone_number } = req.query;

    try {
      const visitor = await VisitorModel.findOne({
        phone_number: phone_number,
      });
      res.json(visitor ? visitor.name : "");
    } catch (err) {
      console.error("Visitor lookup error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Purpose filtering route
router.get(
  "/purpose",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  async (req, res) => {
    try {
      const query = req.query.query || "";
      const regex = new RegExp(query, "i");
      const sessions = await VisitorSession.find({
        purpose_of_visit: regex,
      }).distinct("purpose_of_visit");
      res.json(sessions);
    } catch (err) {
      console.error("Error fetching purposes:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Check if ID cards are available
router.get(
  "/available_id_cards",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  async (req, res) => {
    try {
      const query = req.query.query || "";
      const regex = new RegExp(query, "i");
      const cards = await VisitorCard.find({
        card_id: { $regex: regex },
        status: "available",
      }).distinct("card_id");

      res.json(cards);
    } catch (err) {
      console.error("Error fetching card IDs:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Register and check in a visitor
router.post(
  "/register_Checkin_Visitor",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  async (req, res) => {
    try {
      const { VisitorSessionInfo } = req.body.params;

      const {
        PhoneNumber,
        Name,
        PurposeOfVisit,
        EntryGate,
        GroupSize,
        Checkin_time,
        IdCards,
        Photo,
      } = VisitorSessionInfo;

      if (
        !PhoneNumber ||
        !Name ||
        !PurposeOfVisit ||
        !EntryGate ||
        !GroupSize ||
        !Checkin_time ||
        !IdCards
      ) {
        return res
          .status(400)
          .json({ checking: false, msg: "Missing required fields" });
      }

      const checkInDate = new Date(Checkin_time);
      if (isNaN(checkInDate.getTime())) {
        return res
          .status(400)
          .json({ checking: false, msg: "Invalid Checkin_time format" });
      }

      let ExistingVisitor = true;
      let visitorId = null;

      const visitor = await VisitorModel.findOne({ phone_number: PhoneNumber });
      // If visitor does not exist, create a new one
      if (!visitor) {
        ExistingVisitor = false;
        const newVisitor = new VisitorModel({
          phone_number: PhoneNumber,
          name: Name,
        });
        const savedVisitor = await newVisitor.save();
        visitorId = savedVisitor._id;
      } else {
        visitorId = visitor._id;
      }

      // Create a new VisitorGroup if GroupSize > 1
      let groupId = null;
      if (GroupSize > 1) {
        const newVisitorGroup = new VisitorGroup({
          group_members: IdCards.map((card) => ({
            card_id: card,
            check_in_time: checkInDate,
            check_out_time: null,
          })),
        });
        const savedGroup = await newVisitorGroup.save();
        groupId = savedGroup._id;
      }

      // Create a new VisitorSession
      const newVisitorSession = new VisitorSession({
        visitor_id: visitorId,
        purpose_of_visit: PurposeOfVisit,
        entry_gate: EntryGate,
        check_in_time: checkInDate,
        group_size: GroupSize,
        group_id: groupId,
        photos: Photo,
      });
      const savedSession = await newVisitorSession.save();

      // Update VisitorCards status
      await VisitorCard.updateMany(
        { card_id: { $in: IdCards } },
        { $set: { status: "checked_in" } }
      );

      res.status(200).json({
        checking: true,
        msg: "Visitor checked in successfully",
        sessionId: savedSession._id,
      });
    } catch (err) {
      console.error("Error in /register_Checkin_Visitor:", err);
      res.status(500).json({ checking: false, msg: "Internal server error" });
    }
  }
);

// Check-out a visitor
router.post(
  "/checkout_visitor",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  async (req, res) => {
    try {
      const { sessionId, checkout_time } = req.body;

      const checkOutDate = new Date(checkout_time);
      if (isNaN(checkOutDate.getTime())) {
        return res
          .status(400)
          .json({ success: false, msg: "Invalid checkout_time format" });
      }

      const session = await VisitorSession.findById(sessionId);
      if (!session) {
        return res
          .status(404)
          .json({ success: false, msg: "Session not found" });
      }

      // Check out all the group members if group size > 1
      if (session.group_size > 1) {
        const group = await VisitorGroup.findById(session.group_id);
        if (group) {
          group.group_members.forEach((member) => {
            member.check_out_time = checkOutDate;
          });
          await group.save();

          const cardIds = group.group_members.map((member) => member.card_id);
          await VisitorCard.updateMany(
            { card_id: { $in: cardIds } },
            { $set: { status: "checked_out" } }
          );
        }
      }

      session.check_out_time = checkOutDate;
      await session.save();

      res
        .status(200)
        .json({ success: true, msg: "Visitor checked out successfully" });
    } catch (err) {
      console.error("Error in /checkout_visitor:", err);
      res.status(500).json({ success: false, msg: "Internal server error" });
    }
  }
);

module.exports = router;
