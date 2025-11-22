import express from "express";
import Company from "../models/Company.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.json({ message: "Company structure saved", company });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  const companies = await Company.find();
  res.json(companies);
});

export default router;
