require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);

const upload = multer({ dest: 'uploads/' });
const app = express();
app.use(express.json());

// POST /upload-audio
app.post('/upload-audio', upload.single('audio'), async (req, res) => {
  try {
    const file = req.file; // webm blob
    const final = req.body.final === '1';

    // convert to wav if needed
    const outPath = path.join('uploads', `${Date.now()}.wav`);
    await convertToWav(file.path, outPath);

    // call transcription + processing
    const transcript = await transcribeAndProcess(outPath, final);

    // response: id, processed JSON
    res.json({ ok: true, id: transcript.id, data: transcript.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  } finally {
    // optionally remove req.file.path
  }
});

async function convertToWav(inp, out) {
  return new Promise((resolve, reject) => {
    ffmpeg(inp)
      .toFormat('wav')
      .on('error', reject)
      .on('end', () => resolve(out))
      .save(out);
  });
}

// transcribeAndProcess: runs transcription -> language detection -> task extraction -> DB -> email -> Jira
async function transcribeAndProcess(wavPath, final) {
  // 1) send audio file to Groq Whisper (or your Groq code)
  // Example: using node-fetch to call your Groq wrapper (or direct SDK)
  // Suppose you have a function transcribeWithGroq(wavPath) returning { text }
  const transcriptionText = await transcribeWithGroq(wavPath);

  // 2) detect language OR if you prefer let Gemini do both
  const language = await detectLanguageWithGemini(transcriptionText);

  // 3) if not english -> translate with Gemini
  let englishText = transcriptionText;
  if (language !== 'english' && language !== 'en') {
    englishText = await translateWithGemini(transcriptionText);
  } else {
    // optionally clean English using your groq Llama endpoint
    englishText = await cleanEnglishWithGroq(englishText);
  }

  // 4) Extract tasks & metadata using Gemini (or your existing gemini code)
  const tasksJson = await extractTasksWithGemini(englishText);

  // 5) Save to DB, send emails, call Jira-backend:
  const id = await saveToDb(wavPath, transcriptionText, englishText, tasksJson);

  // 6) Immediately notify managers (email) for review + show on dashboard
  await notifyManagers(tasksJson);

  // If you want auto-create Jira only after manager confirmation, store tasks and wait for UI flow
  // Or create immediately and mark as pending.

  return { id, data: tasksJson };
}

/* ===== Implementation placeholders =====
   Replace these with your existing gemini/groq/jira modules that you already have.
   Example: transcribeWithGroq -> call Groq SDK or your service; detectLanguageWithGemini -> call Google API;
   extractTasksWithGemini -> run your prompt that extracts assignee & department & task text, etc.
*/

async function transcribeWithGroq(wavPath) {
  // example calling local script, or an SDK
  // return { text: '...' }
}

async function detectLanguageWithGemini(text) {
  // return 'english'|'hindi' etc.
}

async function translateWithGemini(text) {
  // return english text
}

async function cleanEnglishWithGroq(text) {
  // call your Groq Llama to rewrite
  return text;
}

async function extractTasksWithGemini(text) {
  // call Gemini and ask for structured JSON:
  // { tasks: [ { summary, assignee_name, department, priority, due_date } ], confidence: 0.92 }
  // return that parsed JSON
}

async function saveToDb(wavPath, originalText, englishText, tasksJson) {
  // Insert into Postgres and return row id
  return 1234;
}

async function notifyManagers(tasks) {
  // send emails using nodemailer / SES / Sendgrid
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server listening on', PORT));
