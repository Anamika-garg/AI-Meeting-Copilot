const axios = require("axios");

async function extractMeetingData(transcript) {
  const prompt = `
You are an assistant that turns meeting transcripts into structured tasks.

Return JSON only:
{
  "summary": ["..."],
  "tasks": [
    {
      "description": "",
      "owner_name": "",
      "deadline": "",
      "priority": ""
    }
  ]
}

Transcript:
${transcript}
`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a helpful meeting assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const raw = response.data.choices[0].message.content;

  return JSON.parse(raw);
}

module.exports = { extractMeetingData };
