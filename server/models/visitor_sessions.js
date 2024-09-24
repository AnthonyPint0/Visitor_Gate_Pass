// ../models/visitor_sessions.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema for visitor_sessions collection
const VisitorSessionSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  visitor_id: {
    type: Schema.Types.ObjectId,
    ref: "visitors", // Assuming 'visitors' is the collection for visitors
    required: true,
  },
  purpose_of_visit: {
    type: String,
    required: true,
  },
  entry_gate: {
    type: String,
    required: true,
  },
  check_in_time: {
    type: Date,
    required: true,
  },
  exit_gate: {
    type: String,
    required: false,
  },
  check_out_time: {
    type: Date,
    required: false,
  },
  group_size: {
    type: Number,
    required: true,
  },
  time_limit: {
    type: Number,
    required: true,
  },
  vehicle_number: {
    type: String,
    required: false,
  },
  group_id: {
    type: Schema.Types.ObjectId,
    ref: "visitor_groups",
    required: true,
  },
  photos: {
    type: String,
    required: true,
  },
});

// Create and export the model based on the schema
const VisitorSession = mongoose.model("visitor_sessions", VisitorSessionSchema);

module.exports = VisitorSession;
