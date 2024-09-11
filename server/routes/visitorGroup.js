// routes/visitor.js
const express = require("express");
const router = express.Router();
const VisitorGroup = require("../models/visitor_groups.js");
const VisitorCard = require("../models/visitor_cards.js");
const VisitorModel = require("../models/visitors.js");
const VisitorSession = require("../models/visitor_sessions.js");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

router.get(
  "/search-purpose",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  async (req, res) => {
    try {
      const query = req.query.query || "";
      const regex = new RegExp(query, "i"); // Case-insensitive regex for matching purposes
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

router.get(
  "/search-available-cards",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  async (req, res) => {
    try {
      const query = req.query.query || "";
      const regex = new RegExp(query, "i"); // Case-insensitive regex for matching purposes

      // Find visitor cards where card_id matches the regex and status is 'available'
      const cards = await VisitorCard.find({
        card_id: { $regex: regex },
        status: "available",
      }).distinct("card_id");

      res.json(cards); // Return the array of matching card_id values
    } catch (err) {
      console.error("Error fetching card IDs:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/verify-id-availability",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  async (req, res) => {
    try {
      const { ID_Array } = req.query;
      const ids = Array.isArray(ID_Array) ? ID_Array : [ID_Array];

      const cards = await VisitorCard.find({ card_id: { $in: ids } });

      const unavailableIds = [];
      cards.forEach((card) => {
        if (card.status !== "available") {
          unavailableIds.push(card.card_id);
        }
      });

      if (unavailableIds.length > 0) {
        res.json({
          checking: false,
          msg: `IDs ${unavailableIds.join(", ")} are not available`,
        });
      } else {
        res.json({ checking: true });
      }
    } catch (err) {
      console.log("Error in checking selected IDs", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/verify-visitor-accessibility",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  async (req, res) => {
    try {
      const { phone_number } = req.query;

      // Find the visitor by phone number
      const visitor = await VisitorModel.findOne({ phone_number });
      if (!visitor) {
        return res.json({ checking: false, msg: "Visitor not found" });
      }

      // Check if the visitor has an ongoing session
      const ongoingSession = await VisitorSession.findOne({
        visitor_id: visitor._id,
        check_out_time: null,
      });

      if (ongoingSession) {
        return res.json({
          checking: false,
          msg: "Visitor has an ongoing session",
        });
      } else {
        return res.json({ checking: true });
      }
    } catch (err) {
      console.log("Error in checking visitor accessible", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/process-visitor-checkout",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  async (req, res) => {
    const { selectedValues, selectedExit } = req.body;
    const currentTime = new Date();

    // Ensure selectedValues is an array
    const cardIds = Array.isArray(selectedValues)
      ? selectedValues
      : [selectedValues];

    try {
      // Step 1: Update VisitorGroup collection for specific card_ids
      await VisitorGroup.updateMany(
        { "group_members.card_id": { $in: cardIds } },
        {
          $set: {
            "group_members.$[elem].check_out_time": currentTime,
            "group_members.$[elem].status": "checked_out",
            "group_members.$[elem].exit_gate": selectedExit,
          },
        },
        {
          arrayFilters: [{ "elem.card_id": { $in: cardIds } }],
        }
      );

      // Step 2: Retrieve the _id of group_members based on card_ids
      const groupMembers = await VisitorGroup.aggregate([
        { $unwind: "$group_members" },
        { $match: { "group_members.card_id": { $in: cardIds } } },
        {
          $project: {
            _id: 0,
            "group_members._id": 1,
            "group_members.card_id": 1,
          },
        },
      ]);

      // Map card_id to group_member _id for easier access
      const cardIdToMemberIdMap = groupMembers.reduce((map, member) => {
        map[member.group_members.card_id] = member.group_members._id;
        return map;
      }, {});

      // Step 3: Update VisitorCard collection using group_member IDs
      for (const cardId of cardIds) {
        const memberId = cardIdToMemberIdMap[cardId];

        if (memberId) {
          const updateResult = await VisitorCard.updateOne(
            { card_id: cardId },
            {
              $set: {
                status: "available",
                assigned_to: null,
              },
              $push: {
                last_assigned: memberId,
              },
            }
          );

          console.log(`Update result for card_id ${cardId}:`, updateResult);
        } else {
          console.warn(`No member ID found for card_id ${cardId}`);
        }
      }

      // Step 4: Check if all group members of each session are checked_out
      const sessionsToUpdate = await VisitorGroup.aggregate([
        { $unwind: "$group_members" },
        {
          $group: {
            _id: "$session_id",
            totalCount: { $sum: 1 },
            checkedOutCount: {
              $sum: {
                $cond: [
                  { $eq: ["$group_members.status", "checked_out"] },
                  1,
                  0,
                ],
              },
            },
            checkedInCount: {
              $sum: {
                $cond: [{ $eq: ["$group_members.status", "checked_in"] }, 1, 0],
              },
            },
          },
        },
        {
          $match: {
            checkedInCount: 0, // Ensure no "checked_in" members
          },
        },
        { $project: { _id: 1 } },
      ]);

      // Step 5: Update VisitorSession collection if all group members are "checked_out"
      for (const sessionId of sessionsToUpdate.map((session) => session._id)) {
        const groupMembersStatus = await VisitorGroup.aggregate([
          { $match: { session_id: sessionId } },
          { $unwind: "$group_members" },
          {
            $group: {
              _id: "$session_id",
              allCheckedOut: {
                $min: { $eq: ["$group_members.status", "checked_out"] },
              },
            },
          },
        ]);

        const isAllCheckedOut = groupMembersStatus[0]?.allCheckedOut;

        await VisitorSession.updateOne(
          { _id: sessionId },
          {
            $set: {
              exit_gate: isAllCheckedOut ? selectedExit : null,
              check_out_time: isAllCheckedOut ? currentTime : null,
            },
          }
        );
      }

      res.status(200).json({ message: "Checkout successful" });
    } catch (error) {
      console.error("Error during checkout process:", error);
      res.status(500).json({ message: "Error during checkout process", error });
    }
  }
);

module.exports = router;
