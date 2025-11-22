const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const status = document.getElementById("status");
const rawJson = document.getElementById("rawJson");
const tasksTableBody = document.querySelector("#tasksTable tbody");
const downloadJsonBtn = document.getElementById("downloadJson");
const downloadCsvBtn = document.getElementById("downloadCsv");

let lastResult = null;

uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Choose a .txt file first");
    return;
  }

  status.textContent = "Reading file...";
  const text = await file.text();

  status.textContent = "Sending to backend...";
  try {
    const resp = await fetch("http://localhost:5000/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: text })
    });

    const body = await resp.json();
    if (!body.success) {
      status.textContent = "Error: " + (body.error || "unknown");
      rawJson.textContent = JSON.stringify(body, null, 2);
      return;
    }
    lastResult = body.data;
    rawJson.textContent = JSON.stringify(lastResult, null, 2);
    status.textContent = "Done. Parsed tasks shown below.";
    renderTasks(lastResult.tasks || []);
  } catch (err) {
    console.error(err);
    status.textContent = "Network or server error: " + err.message;
  }
});

function renderTasks(tasks) {
  tasksTableBody.innerHTML = "";
  tasks.forEach(t => {
    const tr = document.createElement("tr");
    ["task","assigned_to","team","priority","deadline"].forEach(k=>{
      const td = document.createElement("td");
      td.textContent = t[k] || "";
      tr.appendChild(td);
    });
    tasksTableBody.appendChild(tr);
  });
}

downloadJsonBtn.addEventListener("click", () => {
  if (!lastResult) return alert("No data");
  const blob = new Blob([JSON.stringify(lastResult, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "meeting_tasks.json"; a.click();
  URL.revokeObjectURL(url);
});

downloadCsvBtn.addEventListener("click", () => {
  if (!lastResult) return alert("No data");
  const rows = lastResult.tasks || [];
  const header = ["task","assigned_to","team","priority","deadline"];
  const csv = [header.join(",")].concat(rows.map(r => header.map(h => `"${(r[h]||"").replace(/"/g,'""')}"`).join(","))).join("\n");
  const blob = new Blob([csv], {type: "text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "meeting_tasks.csv"; a.click();
  URL.revokeObjectURL(url);
});
