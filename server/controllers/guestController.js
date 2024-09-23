const GuestModel = require("../models/guest");
const transporter = require("../config/mailer");
const generateUnique10DigitUUID = require("../utils/uniqueIdGenerator");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");
const formatDateWithPadding = require("../library/helper");
const { sendEmailAndSaveGuest, updateGuest } = require("../utils/sendEmail"); // Adjust the path to your utilities
const { validationResult } = require("express-validator");

const sendInvitation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    email,
    subject,
    mobile,
    event,
    invitedAs,
    eventDateTime,
    groupSize,
    guestCategory,
    entryGate,
    vehicleParkingInfo,
    userINFO,
  } = req.body;

  try {
    const existingIds = await GuestModel.find().distinct("passId");
    const passId = generateUnique10DigitUUID(existingIds);

    const newGuest = new GuestModel({
      passId,
      name,
      email,
      subject,
      mobile,
      event,
      invitedAs,
      groupSize,
      guestCategory,
      entryGate,
      vehicleParkingInfo,
      whoCreated: userINFO.email,
      eventDateTime,
      noOfemailSent: 1,
    });

    const replacements = {
      Gname: name,
      eventDateTime: formatDateWithPadding(eventDateTime),
      passId: passId,
      eventName: event,
      gateNumber: entryGate,
      numberOfPeople: groupSize,
      parkingInfo: vehicleParkingInfo,
      contactEmail: userINFO ? userINFO.email : "somethingWrong123@gmail.com",
      contactPhoneNumber: userINFO ? userINFO.phone_number : "0000000000",
      contactEmail: userINFO ? userINFO.email : "somethingWrong123@gmail.com",
    };

    await sendEmailAndSaveGuest(
      newGuest,
      subject || `Invitation to ${event}`,
      replacements
    );

    await newGuest.save();

    res.status(200).json({ message: "Invitation sent and history updated." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGuestHistory = async (req, res) => {
  try {
    const { HODEmail } = req.query; // Extract HODEmail from query params

    // Fetch guests created by the specific HOD (filtered by HODEmail)
    const guests = await GuestModel.find({ whoCreated: HODEmail });
    console.log("Guest history served");

    // Return the filtered guests in the response
    res.status(200).json(guests);
  } catch (error) {
    console.error("Error fetching guest history:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUpcomingEvents = async (req, res) => {
  try {
    const currentDate = new Date();
    console.log("Current date and time:", currentDate);
    const upcomingEvents = await GuestModel.find({
      eventDateTime: { $gte: currentDate },
    });
    console.log("Upcoming events served");
    res.status(200).json(upcomingEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const resendInvitation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { passId } = req.params;
  const { userInfo } = req.body;

  try {
    const guest = await GuestModel.findOne({ passId });
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    const replacements = {
      Gname: guest.name,
      eventDateTime: formatDateWithPadding(guest.eventDateTime),
      passId: guest.passId,
      eventName: guest.event || "Our Event",
      gateNumber: guest.entryGate,
      numberOfPeople: guest.groupSize,
      parkingInfo: guest.vehicleParkingInfo,
      contactEmail: userInfo ? userInfo.email : "somethingWrong123@gmail.com",
      contactPhoneNumber: userInfo ? userInfo.phone_number : "0000000000",
      contactemail: userInfo ? userInfo.email : "somethingWrong123@gmail.com",
    };

    await sendEmailAndSaveGuest(
      guest,
      guest.subject || `Invitation to ${guest.event || "Our Event"}`,
      replacements
    );
    const updatedGuest = await updateGuest(guest, false);

    res.status(200).json({
      message: "Invitation resent successfully",
      noOfemailSent: updatedGuest.noOfemailSent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInvitation = async (req, res) => {
  try {
    const { id } = req.params; // This should be the MongoDB _id
    const { rowToUpdate, userInfo } = req.body;

    console.log("Received ID:", id);
    console.log("Row to update:", rowToUpdate);
    console.log("User info:", userInfo);

    // Find the guest by MongoDB _id and update with the updated data from rowToUpdate
    const guest = await GuestModel.findByIdAndUpdate(id, rowToUpdate, {
      new: true, // Return the updated document
      runValidators: true, // Validate the data before saving
    });

    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    // Prepare email replacements, fallback to default contact details if userInfo is missing
    const replacements = {
      Gname: guest.name,
      eventDateTime: formatDateWithPadding(guest.eventDateTime),
      passId: guest.passId,
      eventName: guest.event || "Our Event",
      gateNumber: guest.entryGate,
      numberOfPeople: guest.groupSize,
      parkingInfo: guest.vehicleParkingInfo,
      contactEmail: userInfo ? userInfo.email : "somethingWrong123@gmail.com",
      contactPhoneNumber: userInfo ? userInfo.phone_number : "0000000000",
      contactemail: userInfo ? userInfo.email : "somethingWrong123@gmail.com",
    };

    // Send the email with updated guest information
    await sendEmailAndSaveGuest(
      guest,
      guest.subject || `Updated Invitation for ${guest.event || "Our Event"}`,
      replacements
    );

    // Send the updated guest as the response
    res.status(200).json(guest);
  } catch (error) {
    console.error("Error updating guest:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteInvitation = async (req, res) => {
  try {
    const guestId = req.params.id;

    // Find and delete the guest by ID
    const result = await GuestModel.findByIdAndDelete(guestId);

    if (!result) {
      return res.status(404).json({ error: "Guest not found" });
    }

    res.json({ message: "Guest deleted successfully" });
  } catch (error) {
    console.error("Error deleting guest:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  sendInvitation,
  getGuestHistory,
  getUpcomingEvents,
  resendInvitation,
  updateInvitation,
  deleteInvitation,
};
