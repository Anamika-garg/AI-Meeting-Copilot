from flask import Flask, request, jsonify
import requests
from live_meet_transcriber import transcribe_audio_file

NODE_EXTRACTION_URL = "http://localhost:6000/extract"  # your Node.js API

app = Flask(__name__)

@app.route("/transcribe", methods=["POST"])
def transcribe():
    if "audio" not in request.files:
        return jsonify({"error": "Audio file required"}), 400

    audio_file = request.files["audio"]
    audio_path = "uploaded_audio.wav"
    audio_file.save(audio_path)

    # 1️⃣ Get transcript + English version using your logic
    result = transcribe_audio_file(audio_path)

    english_text = result.get("english")

    # 2️⃣ Forward to Node.js text-extraction
    try:
        node_response = requests.post(
            NODE_EXTRACTION_URL,
            json={"transcript": english_text}
        )
        node_data = node_response.json()
    except Exception as e:
        node_data = {"error": "Failed to reach Node.js server", "details": str(e)}

    # 3️⃣ Return EVERYTHING: transcript + extracted tasks
    return jsonify({
        "transcript": result,
        "extracted": node_data
    })


if __name__ == "__main__":
    app.run(port=7000, debug=True)
