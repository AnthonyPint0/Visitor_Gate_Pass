const GuestModel = require("../models/guest");
const { validationResult } = require("express-validator");
// Controller to get guest details
const getGuestDetails = async (req, res) => {
  const { passId } = req.params;

  try {
    const guest = await GuestModel.findOne({ passId });
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }
    res.status(200).json({
      message: "Guest details fetched successfully",
      data: guest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//
const updateGuestDetails = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { passId } = req.params;
  const { noOfGuest } = req.body;

  try {
    // Update guest details
    const guest = await GuestModel.findOneAndUpdate(
      { passId },
      { noOfGuest, checkedInTime: new Date(), isVisited: true },
      { new: true }
    );

    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    res.status(200).json({
      message: "Guest details updated successfully",
      data: guest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getGuestDetails,
  updateGuestDetails,
};
