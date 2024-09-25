// routes/visitor.js
const express = require("express");
const moment = require("moment"); // Assuming you're using moment.js for date handling
const mongoose = require("mongoose");
const router = express.Router();
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");
const Visitor = require("../models/visitors.js");
const VisitorSession = require("../models/visitor_sessions.js");
const VisitorGroup = require("../models/visitor_groups.js");
const VisitorCard = require("../models/visitor_cards.js");
const VisitorModel = require("../models/visitors.js");

router.get(
  "/visitor-sessions",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  async (req, res) => {
    try {
      // Fetch all necessary data from MongoDB collections
      const visitors = await Visitor.find({});
      const sessions = await VisitorSession.find({});
      const groups = await VisitorGroup.find({});
      const cards = await VisitorCard.find({});

      // Map through sessions to construct the desired response format
      const result = sessions.map((session) => {
        // Find corresponding visitor and group information
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
        // console.log(checkOutTimes);

        // Construct the response object
        return {
          _id: session._id,
          name: visitor ? visitor.name : "Nah", // Ensure visitor.name is properly fetched
          phone_number: visitor ? visitor.phone_number : "Nah", // Ensure visitor.phone_number is properly fetched
          purpose_of_visit: session.purpose_of_visit,
          entry_gate: session.entry_gate,
          check_in_time: session.check_in_time,
          exit_gate: session.exit_gate,
          check_out_time: latestCheckOutTime,
          vehicle_number: session.vehicle_number,
          group_size: session.group_size,
          photos: session.photos, // session.photos,
          visitor_cards: groupMembers
            ? groupMembers
            : [
                { card_id: "404", status: "checked_out" },
                { card_id: "500", status: "checked_in" },
              ],
        };
      });

      // Send the constructed response as JSON
      res.json(result);
    } catch (err) {
      // Handle any errors and send an error response
      console.error("Error fetching visitors:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/visitor-sessions-today",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  async (req, res) => {
    try {
      // Get today's start and end timestamps
      const startOfToday = moment().startOf("day").toDate();
      const endOfToday = moment().endOf("day").toDate();

      // Fetch all necessary data from MongoDB collections
      const visitors = await Visitor.find({});
      const sessions = await VisitorSession.find({
        $or: [{ check_in_time: { $gte: startOfToday, $lte: endOfToday } }],
      });
      const groups = await VisitorGroup.find({});
      const cards = await VisitorCard.find({});

      // Map through sessions to construct the desired response format
      const result = sessions.map((session) => {
        // Find corresponding visitor and group information
        const visitor = visitors.find((v) => v._id.equals(session.visitor_id));
        const group = groups.find((g) => g._id.equals(session.group_id));
        const groupMembers = group ? group.group_members : [];
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

        // Construct the response object
        return {
          _id: session._id,
          name: visitor ? visitor.name : "Unknown", // Ensure visitor.name is properly fetched
          phone_number: visitor ? visitor.phone_number : "Unknown", // Ensure visitor.phone_number is properly fetched
          purpose_of_visit: session.purpose_of_visit,
          entry_gate: session.entry_gate,
          check_in_time: session.check_in_time,
          exit_gate: session.exit_gate,

          check_out_time: latestCheckOutTime,
          group_size: session.group_size,
          time_limit: session.time_limit,
          vehicle_number: session.vehicle_number,
          photos: session.photos || [], // Ensure photos is an array
          visitor_cards:
            groupMembers.length > 0
              ? groupMembers
              : [
                  { card_id: "404", status: "checked_out" },
                  { card_id: "500", status: "checked_in" },
                ],
        };
      });

      // Send the constructed response as JSON
      res.json(result);
    } catch (err) {
      // Handle any errors and send an error response
      console.error("Error fetching visitor sessions:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/lookup-by-phone",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  async (req, res) => {
    const { phone_number } = req.query; // Use req.query for GET parameters

    try {
      const visitor = await VisitorModel.findOne({
        phone_number: phone_number,
      });

      if (visitor) {
        // visitor found
        const { name } = visitor; // Assuming you want to return the name
        res.json(name || ""); // Return the name or an empty string if name is falsy
      } else {
        // visitor not found
        res.json(""); // Return an empty string if no visitor found
      }
    } catch (err) {
      console.error("Visitor lookup error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/checkin-visitor",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  async (req, res) => {
    try {
      // Extract VisitorSessionInfo from req.body.params
      const { VisitorSessionInfo } = req.body;

      // Log the extracted object
      console.log("Extracted VisitorSessionInfo:", VisitorSessionInfo);

      const {
        PhoneNumber,
        Name,
        PurposeOfVisit,
        EntryGate,
        VehicleNo,
        GroupSize,
        TimeLimit,
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
        !TimeLimit ||
        !Checkin_time ||
        !IdCards
      ) {
        console.log("Missing required fields:", VisitorSessionInfo);
        return res
          .status(400)
          .json({ checking: false, msg: "Missing required fields" });
      }

      const checkInDate = new Date(Checkin_time);
      if (isNaN(checkInDate.getTime())) {
        console.log("Invalid Checkin_time format:", Checkin_time);
        return res
          .status(400)
          .json({ checking: false, msg: "Invalid Checkin_time format" });
      }

      let ExistingVisitor = true;
      let visitorId = null;

      // Find the visitor by phone number
      const visitor = await VisitorModel.findOne({ phone_number: PhoneNumber });
      if (!visitor) {
        ExistingVisitor = false; // msg: 'Visitor not found'
      } else {
        visitorId = visitor._id;
      }

      // Check if the visitor has an ongoing session
      const ongoingSession = await VisitorSession.findOne({
        visitor_id: visitorId,
        check_out_time: null,
      });

      const ids = Array.isArray(IdCards) ? IdCards : [IdCards];
      const cards = await VisitorCard.find({ card_id: { $in: ids } });

      const unavailableIds = [];
      cards.forEach((card) => {
        if (card.status !== "available") {
          unavailableIds.push(card.card_id);
        }
      });

      cards.forEach((card) => {
        if (card.status === null) {
          unavailableIds.push(card.card_id);
        }
      });

      ids.forEach((card) => {
        if (card === null) {
          unavailableIds.push(card);
        }
      });

      if (unavailableIds.length > 0) {
        return res.json({
          checking: false,
          msg: `IDs ${unavailableIds.join(", ")} are not available`,
        });
      }

      if (ongoingSession) {
        return res.json({
          checking: false,
          msg: "Visitor has an ongoing session",
        });
      }

      if (ExistingVisitor) {
        visitorId = visitor._id;
      } else {
        // Create a new visitor
        const newVisitor = new VisitorModel({
          name: Name,
          phone_number: PhoneNumber,
        });

        const savedVisitor = await newVisitor.save();
        visitorId = savedVisitor._id;
      }

      // Create a new document in visitor_sessions
      const newSession = new VisitorSession({
        _id: new mongoose.Types.ObjectId(),
        visitor_id: visitorId,
        purpose_of_visit: PurposeOfVisit,
        entry_gate: EntryGate,
        vehicle_number: VehicleNo,
        check_in_time: checkInDate,
        exit_gate: null,
        check_out_time: null,
        group_size: GroupSize,
        time_limit: TimeLimit,
        group_id: new mongoose.Types.ObjectId(), // Placeholder for group_id
        photos: Photo,
      });

      await newSession.save();

      // Create a new document in visitor_groups
      const groupMembers = ids.map((id) => ({
        card_id: id,
        check_in_time: checkInDate,
        exit_gate: null,
        check_out_time: null,
        status: "checked_in",
      }));

      const newGroup = new VisitorGroup({
        _id: new mongoose.Types.ObjectId(),
        session_id: newSession._id,
        group_members: groupMembers,
      });

      await newGroup.save();

      // Update the group_id in the session document
      newSession.group_id = newGroup._id;
      await newSession.save();

      // Update visitor_cards with appropriate status and assignments
      await Promise.all(
        groupMembers.map(async (member, index) => {
          await VisitorCard.updateOne(
            { card_id: member.card_id },
            {
              $set: {
                status: "assigned",
                assigned_to: newGroup.group_members[index]._id,
              },
            }
          );
        })
      );

      return res.json({
        checking: true,
        msg: "Visitor check-in processed successfully",
      });
    } catch (err) {
      console.error("Error in Register/Checkin Visitor:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/get-checked-in-ids",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  async (req, res) => {
    try {
      const query = req.query.query || "";
      const regex = new RegExp(query, "i"); // Case-insensitive regex for matching purposes
      // Find visitor cards where card_id matches the regex and status is 'available'
      const cards = await VisitorCard.find({
        card_id: { $regex: regex },
        status: "assigned",
      }).distinct("card_id");
      res.json(cards); // Return the array of matching card_id values
    } catch (err) {
      console.error("Error in checkout availabe card IDs:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/retrieve-visitor-details",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  async (req, res) => {
    const { id } = req.query;
    try {
      const result = await VisitorGroup.aggregate([
        {
          $match: {
            group_members: {
              $elemMatch: {
                card_id: id,
                status: "checked_in",
              },
            },
          },
        },
        {
          $lookup: {
            from: "visitor_sessions",
            localField: "session_id",
            foreignField: "_id",
            as: "sessionDetails",
          },
        },
        {
          $unwind: "$sessionDetails",
        },
        {
          $lookup: {
            from: "visitors",
            localField: "sessionDetails.visitor_id",
            foreignField: "_id",
            as: "visitorDetails",
          },
        },
        {
          $unwind: "$visitorDetails",
        },
        {
          $project: {
            name: "$visitorDetails.name",
            phone_number: "$visitorDetails.phone_number",
            purpose_of_visit: "$sessionDetails.purpose_of_visit",
            entry_gate: "$sessionDetails.entry_gate",
            check_in_time: "$sessionDetails.check_in_time",
            vehicle_number: "$sessionDetails.vehicle_number",
            group_size: "$sessionDetails.group_size",
            photos: {
              $cond: {
                if: { $gt: [{ $strLenCP: "$sessionDetails.photos" }, 0] },
                then: "$sessionDetails.photos",
                else: "",
              },
            },
            member_details: {
              $map: {
                input: "$group_members",
                as: "member",
                in: {
                  card_id: "$$member.card_id",
                  status: "$$member.status",
                },
              },
            },
          },
        },
      ]).exec();
      if (result.length === 0) {
        return res.status(404).json({ message: "No matching visitor found." });
      }
      res.json(result[0]);
    } catch (error) {
      console.error("Error retrieving visitor details:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
