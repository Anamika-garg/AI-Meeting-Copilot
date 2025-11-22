import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  issueKey: { type: String }, // optional if you connect with Jira later

  rawText: {
    type: String,
    required: true
  },

  extractedInfo: {
    team: { type: String },  // extracted team
    manager: { type: String }, // manager assigned
    priority: { type: String },
    email: { type: String },
    otherDetails: { type: Object } // store any extra JSON from backend
  },

  assignedTo: {
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "TeamMember" },
    managerName: { type: String },
    managerEmail: { type: String }
  },

  status: {
    type: String,
    enum: ["pending", "assigned", "completed"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Ticket", TicketSchema);
