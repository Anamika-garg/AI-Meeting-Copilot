const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema(
  {
    platform: { type: String, enum: ["google-meet", "zoom", "teams"], default: "google-meet" },
    meetingId: { type: String, required: true },
    title: String,
    transcript: { type: String, required: true },
    managerEmail: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", MeetingSchema);
