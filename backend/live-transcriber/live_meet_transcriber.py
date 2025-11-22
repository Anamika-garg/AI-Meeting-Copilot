from groq import Groq
import sounddevice as sd
from scipy.io.wavfile import write
import keyboard
import time
from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()

# API clients
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


def record_audio():
    print("Press Enter to start recording...")
    keyboard.wait("enter")
    print("Recording... Press Enter again to stop.")

    start_time = time.time()
    fs = 44100
    channels = 1

    recording = sd.rec(int(fs * 300), samplerate=fs, channels=channels)
    keyboard.wait("enter")

    print("Stopping...\n")
    sd.stop()

    duration = time.time() - start_time
    write("output.wav", fs, recording[:int(duration * fs)])


def transcribe_original():
    """Transcribe audio using Groq Whisper"""
    with open("output.wav", "rb") as audio_file:
        response = client.audio.transcriptions.create(
            model="whisper-large-v3",
            file=audio_file
        )
        return response.text


def detect_language_gemini(text):
    """Detect language using Gemini"""
    model = genai.GenerativeModel("gemini-2.5-flash")
    prompt = f"Detect the language of this text and ONLY return the language name: {text}"
    response = model.generate_content(prompt)
    return response.text.strip().lower()


def translate_with_gemini(text):
    """Translate any language -> plain English"""
    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(
        f"Translate the following text into simple, plain English. "
        f"Return only the translation, nothing else:\n\n{text}"
    )
    return response.text.strip()


def translate_to_english_groq(text):
    """Clean English -> simpler plain English"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "Rewrite the text into clear, simple, plain English. "
                    "Return only the rewritten text. No explanations."
                )
            },
            {"role": "user", "content": text}
        ]
    )
    return response.choices[0].message.content.strip()


def transcribe():
    while True:
        record_audio()

        original = transcribe_original()
        lang = detect_language_gemini(original)

        print(f"\nDetected Language: {lang}")

        if lang == "english":
            english = translate_to_english_groq(original)
        else:
            english = translate_with_gemini(original)

        print("\nOriginal:", original)
        print("English:", english)
        print("\n---------------------------------------\n")


if __name__ == "__main__":
    transcribe()
