// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));      // Accept large transcript payloads
app.use(express.urlencoded({ extended: true }));

// -------------------------------
// Health Check
// -------------------------------
app.get("/", (req, res) => {
  res.json({ status: "Backend running successfully 👌" });
});

// -------------------------------
// POST: Receive transcript from Chrome Extension
// -------------------------------
app.post("/api/transcript", async (req, res) => {
  try {
    const { text, timestamp } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Transcript text missing" });
    }

    console.log("📥 Received transcript:", text);

    // TODO (Next Step):
    // 1. Send to Gemini summarizer
    // 2. Extract tasks, owners, dept etc.
    // 3. Save to DB
    // 4. Forward to Email/Manager / Jira subsystem

    res.json({ success: true, message: "Transcript received" });

  } catch (err) {
    console.error("Error in /api/transcript:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -------------------------------
// Start Server
// -------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
