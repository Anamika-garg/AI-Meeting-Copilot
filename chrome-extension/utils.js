// utils.js

/**
 * Convert Blob → File so we can send in FormData.
 */
export function blobToFile(blob, filename) {
  return new File([blob], filename, { type: blob.type });
}

/**
 * Send audio file to backend transcription API
 */
export async function sendToPythonBackend(blob) {
  const file = blobToFile(blob, "audio.webm");

  const formData = new FormData();
  formData.append("audio", file);

  console.log("📤 Sending audio to Python backend…");

  const res = await fetch("http://localhost:7000/transcribe", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  console.log("📥 Received transcription:", data);

  return data; // { transcript: "..." }
}

/**
 * Send transcript → extraction backend (Node.js)
 */
export async function sendToExtractionBackend(transcriptText) {
  console.log("📤 Sending transcript to task extractor…");

  const res = await fetch("http://localhost:5000/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript: transcriptText })
  });

  const data = await res.json();
  console.log("📥 Extracted tasks:", data);

  return data; // { success: true, data: {...} }
}

/**
 * Save last output in chrome storage
 */
export function saveOutput(data) {
  chrome.storage.local.set({ lastResult: data });
}

/**
 * Format errors
 */
export function logError(err) {
  console.error("❌ ERROR:", err);
}
