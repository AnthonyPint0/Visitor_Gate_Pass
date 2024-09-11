const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  passId: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  mobile: { type: String, required: true },
  event: { type: String, required: true },
  invitedAs: { type: String, required: true },
  eventDateTime: { type: Date, required: true },
  isVisited: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  noOfemailSent: { type: Number, default: 0 }, // Optional field, default is 0
  noOfGuest: { type: Number, default: null }, // Initially null
  checkedInTime: { type: Date, default: null }, // Corrected type
});
const GuestModel = mongoose.model("guests", GuestSchema, "guests");

module.exports = GuestModel;
