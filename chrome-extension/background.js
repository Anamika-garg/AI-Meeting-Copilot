let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;

console.log("🔥 Background script loaded");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === "START_RECORDING") {
    startRecording(sendResponse);
    return true;
  }

  if (msg.command === "STOP_RECORDING") {
    stopRecording(sendResponse);
    return true;
  }
});

// ---------------------- RECORDING ----------------------

async function startRecording(sendResponse) {
  try {
    console.log("🎙 Starting recording...");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    mediaRecorder.start();
    isRecording = true;

    sendResponse({ status: "recording_started" });
  } catch (err) {
    console.error("❌ Could not start recording:", err);
    sendResponse({ error: err.message });
  }
}

async function stopRecording(sendResponse) {
  if (!mediaRecorder || !isRecording) {
    sendResponse({ error: "Recorder not active" });
    return;
  }

  console.log("🛑 Stopping recording...");

  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
    console.log("🎧 Audio recorded:", audioBlob);

    const transcript = await sendToTranscriptionAPI(audioBlob);
    console.log("📝 Transcript:", transcript);

    const extracted = await sendToTextExtractionAPI(transcript);
    console.log("📦 Extracted Tasks:", extracted);

    sendResponse({
      transcript,
      extracted,
    });
  };

  mediaRecorder.stop();
  isRecording = false;
}

// ---------------------- PYTHON TRANSCRIPTION API ----------------------

async function sendToTranscriptionAPI(audioBlob) {
  const formData = new FormData();
  formData.append("audio", audioBlob, "audio.webm");

  try {
    const res = await fetch("http://localhost:8000/api/transcribe", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.text || "";
  } catch (error) {
    console.error("❌ Transcription API error:", error);
    return "";
  }
}

// ---------------------- NODE TEXT EXTRACTION API ----------------------

async function sendToTextExtractionAPI(transcript) {
  try {
    const res = await fetch("http://localhost:5000/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    });

    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("❌ Text extraction API error:", err);
    return null;
  }
}
