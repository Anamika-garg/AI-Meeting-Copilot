import express from "express";
import TeamMember from "../models/TeamMember.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const member = await TeamMember.create(req.body);
    res.json({ message: "Team member added", member });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  const members = await TeamMember.find();
  res.json(members);
});

export default router;
