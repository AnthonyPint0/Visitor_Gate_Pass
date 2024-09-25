// routes/report.js
const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");
const generateExcel = require("../models/Excel_generator.js");
const VisitorSession = require("../models/visitor_sessions.js");
const fs = require("fs");

router.get(
  "/export-visitor-report",
  authenticateToken,
  authorizeRole(["admin", "security"]),
  async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
      const result = await VisitorSession.aggregate([
        {
          $match: {
            check_in_time: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $lookup: {
            from: "visitors",
            localField: "visitor_id",
            foreignField: "_id",
            as: "visitor_info",
          },
        },
        {
          $unwind: "$visitor_info",
        },
        {
          $lookup: {
            from: "visitor_groups",
            localField: "group_id",
            foreignField: "_id",
            as: "group_info",
          },
        },
        {
          $unwind: "$group_info",
        },
        {
          $project: {
            name: "$visitor_info.name",
            phone_number: "$visitor_info.phone_number",
            purpose_of_visit: 1,
            entry_gate: 1,
            vehicle_number: 1,
            check_in_time: 1,
            exit_gate: 1,
            check_out_time: 1,
            time_limit: 1,
            group_size: 1,
            "group_info.group_members.card_id": 1,
          },
        },
      ]);

      // Generate the Excel file
      const filePath = await generateExcel(result);

      // Send the generated Excel file to the client
      res.download(filePath, "Visitor_Report.xlsx", (err) => {
        if (err) {
          res
            .status(500)
            .json({ message: "Error during file download", error: err });
        } else {
          // Optionally delete the file after download
          fs.unlinkSync(filePath);
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error during download", error });
    }
  }
);

module.exports = router;
