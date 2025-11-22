import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const PORT = 6000;
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

if (!API_KEY) {
  console.error("❌ Set GEMINI_API_KEY in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL });

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ---------- Prompt ----------
const formatPrompt = (text) => `
You are an AI assistant that extracts structured tasks from meeting transcripts.

RULES:
- Reply ONLY with valid JSON.
- NO markdown.
- NO explanation.
- If something is unknown, leave it "".
- Return exactly this schema:

{
  "summary": "",
  "tasks": [
    {
      "task": "",
      "assigned_to": "",
      "team": "",
      "priority": "",
      "deadline": ""
    }
  ]
}

Transcript:
"${text}"
`;

const inferTeam = (task) => {
  const text = task.toLowerCase();

  if (text.includes("bug") || text.includes("api") || text.includes("backend") || text.includes("database"))
    return "Backend";

  if (text.includes("ui") || text.includes("frontend") || text.includes("design") || text.includes("layout"))
    return "Frontend";

  if (text.includes("deploy") || text.includes("server") || text.includes("cloud") || text.includes("infra"))
    return "DevOps";

  return "General";
};

// Auto-fill priority if missing
const inferPriority = (priority) => {
  return (!priority || priority.trim() === "") ? "Medium" : priority;
};


// ---------- Endpoint ----------
app.post("/extract", async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript?.trim()) {
      return res.status(400).json({ error: "Transcript required" });
    }

    const prompt = formatPrompt(transcript);

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    }

    // 🛠 APPLY AUTO-FILL LOGIC
    if (parsed.tasks && Array.isArray(parsed.tasks)) {
      parsed.tasks = parsed.tasks.map(task => ({
        ...task,
        team: task.team?.trim() ? task.team : inferTeam(task.task),
        priority: inferPriority(task.priority)
      }));
    }

    return res.json({ success: true, data: parsed });

  } catch (err) {
    console.error("\n ❌ SERVER ERROR:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});


app.listen(PORT, () =>
  console.log(`🚀 Backend running at http://localhost:${PORT} using model: ${MODEL}`)
);
