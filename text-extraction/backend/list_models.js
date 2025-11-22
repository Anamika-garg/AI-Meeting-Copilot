// backend/list_models.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ Set GEMINI_API_KEY in .env first!");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    const resp = await genAI.listModels();
    console.log("Available Models:");
    resp.models.forEach(m => console.log("👉", m.name));
  } catch (error) {
    console.error("❌ Error listing models:", error.message);
  }
}

listModels();
