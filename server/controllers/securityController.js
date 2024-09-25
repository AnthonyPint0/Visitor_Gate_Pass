const GuestModel = require("../models/guest");
const { validationResult } = require("express-validator");
// Controller to get guest details
const getGuestDetailsToday = async (req, res) => {
  try {
    // Get today's date in UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set to beginning of the UTC day

    // Get tomorrow's date in UTC
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    // Find guests for today who haven't checked in
    const guests = await GuestModel.find({
      eventDateTime: {
        $gte: today.toISOString(),
        $lt: tomorrow.toISOString(),
      },
      checkedInTime: null, // Only fetch guests who haven't checked in yet
    }).select(
      "name passId email mobile event invitedAs eventDateTime entryGate guestCategory vehicleParkingInfo groupSize"
    );

    if (guests.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(guests);
    console.log(guests);
  } catch (error) {
    console.error("Error in getGuestDetailsToday:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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

  try {
    // Update guest details
    const guest = await GuestModel.findOneAndUpdate(
      { passId },
      { checkedInTime: new Date(), isVisited: true },
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
  getGuestDetailsToday,
  updateGuestDetails,
};
