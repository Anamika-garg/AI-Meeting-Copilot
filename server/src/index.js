require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { extractMeetingData } = require("./services/aiService");
const { createJiraIssuesFromTasks } = require("./services/jiraService");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.post("/api/process-meeting", async (req, res) => {
  const { transcript, meetingTitle, managerJiraAccountId } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: "transcript is required" });
  }
  if (!managerJiraAccountId) {
    return res.status(400).json({ error: "managerJiraAccountId is required" });
  }

  try {
    const { summary, tasks } = await extractMeetingData(transcript);
    const jiraIssues = await createJiraIssuesFromTasks(tasks, managerJiraAccountId);

    res.json({
      meetingTitle: meetingTitle || "Untitled meeting",
      summary,
      tasks,
      jiraIssues
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed",
      details: err.message
    });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
