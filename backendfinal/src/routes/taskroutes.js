const express = require("express");
const Task = require("../models/Task");
const { sendEmail } = require("../services/emailService");
// const { assignJiraIssue } = require("../services/jiraService"); // if you have accountId

const router = express.Router();

/**
 * GET /api/tasks?meetingId=<mongoId>
 */
router.get("/", async (req, res) => {
  try {
    const { meetingId } = req.query;
    const filter = {};
    if (meetingId) filter.meeting = meetingId;

    const tasks = await Task.find(filter).populate("meeting");
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * POST /api/tasks/:id/assign
 * Body: { assigneeName, assigneeEmail }
 */
router.post("/:id/assign", async (req, res) => {
  try {
    const { assigneeName, assigneeEmail } = req.body;
    const taskId = req.params.id;

    const task = await Task.findById(taskId).populate("meeting");
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.assignee = {
      name: assigneeName,
      email: assigneeEmail
    };
    task.status = "ASSIGNED";
    await task.save();

    // TODO: If you know Jira accountId, call assignJiraIssue(task.jiraIssueKey, accountId)

    // Email to team member
    if (assigneeEmail) {
      await sendEmail({
        to: assigneeEmail,
        subject: `[MinuteMate] You have a new task: ${task.summary}`,
        text: `You have been assigned a new task from meeting "${task.meeting.title || task.meeting.meetingId}".\n\n${JSON.stringify(
          task,
          null,
          2
        )}`,
        html: `<h3>You have a new task</h3><pre>${JSON.stringify(task, null, 2)}</pre>`
      });
    }

    res.json({ message: "Task assigned", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
