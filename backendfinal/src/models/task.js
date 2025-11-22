const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    meeting: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting", required: true },

    summary: { type: String, required: true },
    description: String,

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM"
    },

    team: String,

    managerEmail: { type: String, required: true },
    assignee: {
      name: String,
      email: String
    },

    dueDate: Date,

    jiraIssueKey: String,

    status: {
      type: String,
      enum: ["NEW", "APPROVED", "ASSIGNED", "COMPLETED"],
      default: "NEW"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
