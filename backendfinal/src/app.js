const express = require("express");
const cors = require("cors");
const meetingRoutes = require("./routes/meetingRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("MinuteMate backend is running 🚀");
});

app.use("/api/meetings", meetingRoutes);
app.use("/api/tasks", taskRoutes);

module.exports = app;
