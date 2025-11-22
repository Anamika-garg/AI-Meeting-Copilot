const express = require("express");
const Meeting = require("../models/meeting");
const Task = require("../models/task");
const { extractTasksFromTranscript } = require("../services/geminiservice");
const { sendEmail } = require("../services/emailservice");
const { createJiraIssue } = require("../services/jiraservice");

const router = express.Router();

/**
 * POST /api/meetings/transcript
 * Body: {
 *   platform: "google-meet" | "zoom" | "teams",
 *   meetingId: "123",
 *   title: "Sprint planning",
 *   transcript: "full text...",
 *   managerEmail: "manager@example.com"
 * }
 */
router.post("/transcript", async (req, res) => {
  try {
    const { platform, meetingId, title, transcript, managerEmail } = req.body;

    if (!meetingId || !transcript) {
      return res.status(400).json({ message: "meetingId and transcript are required" });
    }

    // 1. Save meeting
    const meeting = await Meeting.create({
      platform: platform || "google-meet",
      meetingId,
      title,
      transcript,
      managerEmail
    });

    // 2. Extract tasks via OpenAI
    const extractedTasks = await extractTasksFromTranscript(transcript);

    const savedTasks = [];

    for (const t of extractedTasks) {
      const manager = t.managerEmail || managerEmail;
      if (!manager) continue;

      // 3. Create Jira issue
      const jiraIssueKey = await createJiraIssue({
        summary: t.summary,
        description: t.description,
        priority:
          t.priority === "CRITICAL"
            ? "Highest"
            : t.priority === "HIGH"
            ? "High"
            : t.priority === "LOW"
            ? "Low"
            : "Medium"
      });

      // 4. Save task in DB
      const taskDoc = await Task.create({
        meeting: meeting._id,
        summary: t.summary,
        description: t.description,
        priority: t.priority || "MEDIUM",
        team: t.team || null,
        managerEmail: manager,
        assignee: {
          name: t.assigneeName || null,
          email: t.assigneeEmail || null
        },
        dueDate: t.dueDate ? new Date(t.dueDate) : null,
        jiraIssueKey
      });

      savedTasks.push(taskDoc);

      // 5. Send email to manager with task JSON
      await sendEmail({
        to: manager,
        subject: `[MinuteMate] New task from meeting "${title || meetingId}"`,
        text: `New task created from meeting.\n\n${JSON.stringify(taskDoc, null, 2)}`,
        html: `<h3>New task created from meeting</h3><pre>${JSON.stringify(
          taskDoc,
          null,
          2
        )}</pre>`
      });
    }

    return res.status(201).json({
      message: "Meeting processed",
      meeting,
      tasks: savedTasks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
