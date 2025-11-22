document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("recordBtn");
  const statusText = document.getElementById("status");
  const transcriptBox = document.getElementById("transcript");
  const tasksBox = document.getElementById("tasks");

  let recording = false;

  btn.addEventListener("click", () => {
    if (!recording) {
      startRecording();
    } else {
      stopRecording();
    }
  });

  function startRecording() {
    recording = true;
    statusText.innerText = "🎙 Recording…";
    btn.innerText = "Stop Recording";

    chrome.runtime.sendMessage({ command: "START_RECORDING" }, (res) => {
      if (res?.error) alert(res.error);
    });
  }

  function stopRecording() {
    recording = false;
    statusText.innerText = "⏳ Transcribing & extracting…";
    btn.innerText = "Start Recording";

    chrome.runtime.sendMessage({ command: "STOP_RECORDING" }, (res) => {
      if (res?.error) {
        alert(res.error);
        return;
      }

      // Show transcript
      transcriptBox.innerText = res.transcript || "No transcript";

      // Show extracted tasks
      if (res.extracted) {
        const summary = res.extracted.summary || "No summary available";
        const tasksList = res.extracted.tasks || [];

        tasksBox.innerHTML = `
          <h3>Summary</h3>
          <p>${summary}</p>

          <h3>Tasks</h3>
          ${tasksList
            .map(
              (t) => `
                <div class="task-item">
                  <strong>${t.task}</strong><br>
                  Assignee: ${t.assigned_to || "—"}<br>
                  Team: ${t.team || "—"}<br>
                  Priority: ${t.priority || "—"}<br>
                  Deadline: ${t.deadline || "—"}
                </div>
                <hr>
              `
            )
            .join("")}
        `;
      }

      statusText.innerText = "✔ Done";
    });
  }
});
