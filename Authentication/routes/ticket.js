import express from "express";
import Ticket from "../models/Ticket.js";
import TeamMember from "../models/TeamMember.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { rawText, extractedInfo } = req.body;

    // Step 1: Find manager from DB
    const manager = await TeamMember.findOne({
      department: extractedInfo.team
    });

    // Step 2: Create ticket
    const ticket = await Ticket.create({
      rawText,
      extractedInfo,
      assignedTo: manager
        ? {
            managerId: manager._id,
            managerName: manager.name,
            managerEmail: manager.email
          }
        : null
    });

    res.json({
      message: "Ticket created successfully",
      ticket
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
