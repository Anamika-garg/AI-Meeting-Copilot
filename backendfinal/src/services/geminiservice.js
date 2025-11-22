const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// You can use: "gemini-1.5-flash" (fast) or "gemini-1.5-pro" (more accurate)
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

async function extractTasksFromTranscript(transcript) {
  const prompt = `
You will receive a meeting transcript.

Extract all action items as a JSON object with this structure:

{
  "tasks": [
    {
      "summary": "short title of action item",
      "description": "short description",
      "priority": "LOW | MEDIUM | HIGH | CRITICAL",
      "team": "team responsible if mentioned, else null",
      "managerEmail": "email of manager if mentioned, else null",
      "assigneeName": "person responsible if mentioned, else null",
      "assigneeEmail": "email if mentioned, else null",
      "dueDate": "ISO date string if clear deadline exists, else null"
    }
  ]
}

Rules:
- Return ONLY valid JSON.
- No explanation or text outside JSON.
- If deadline is vague ("next Monday", "EOD"), convert into ISO YYYY-MM-DD.
- If something is missing, return null.

Transcript:
"""${transcript}"""
`;

  try {
    // Call Gemini API
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Try parsing JSON
    const parsed = JSON.parse(text);
    return parsed.tasks || [];
  } catch (err) {
    console.error("❌ Gemini extraction error:", err.message);
    return [];
  }
}

module.exports = { extractTasksFromTranscript };
