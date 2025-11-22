from groq import Groq
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

# Clients
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


def transcribe_original(audio_path):
    """Transcribe audio using Groq Whisper."""
    with open(audio_path, "rb") as audio_file:
        response = client.audio.transcriptions.create(
            model="whisper-large-v3",
            file=audio_file
        )
        return response.text


def detect_language(text):
    """Detect language using Gemini."""
    model = genai.GenerativeModel("gemini-2.5-flash")
    prompt = f"Detect language and return ONLY the language name: {text}"
    res = model.generate_content(prompt)
    return res.text.strip().lower()


def translate_with_gemini(text):
    """Translate any language to plain English."""
    model = genai.GenerativeModel("gemini-2.5-flash")
    res = model.generate_content(
        f"Translate to very simple, plain English. Return ONLY the translation:\n\n{text}"
    )
    return res.text.strip()


def simplify_english_with_groq(text):
    """Convert English to cleaner, simpler English."""
    res = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "Rewrite the text in clear, simple, plain English. "
                    "Return ONLY the final cleaned version."
                )
            },
            {"role": "user", "content": text}
        ]
    )
    return res.choices[0].message.content.strip()


def transcribe_audio_file(audio_path):
    """MAIN function used by Flask."""
    original = transcribe_original(audio_path)
    lang = detect_language(original)

    if lang == "english":
        english = simplify_english_with_groq(original)
    else:
        english = translate_with_gemini(original)

    return {
        "language": lang,
        "original": original,
        "english": english
    }
