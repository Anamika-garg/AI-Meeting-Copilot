// recorder.js
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;

/**
 * Start microphone recording
 */
export async function startMicRecording() {
  if (isRecording) return;

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream, {
    mimeType: "audio/webm"  // Chrome-friendly
  });

  audioChunks = [];

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.push(event.data);
    }
  };

  mediaRecorder.start();
  isRecording = true;
  console.log("🎙 Recording started");
}

/**
 * Stop recording and return audio Blob
 */
export function stopMicRecording() {
  return new Promise((resolve) => {
    if (!isRecording) resolve(null);

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      console.log("🎙 Recording stopped, blob ready");

      resolve(audioBlob);
      resetRecorder();
    };

    mediaRecorder.stop();
  });
}

function resetRecorder() {
  isRecording = false;
  mediaRecorder = null;
  audioChunks = [];
}
