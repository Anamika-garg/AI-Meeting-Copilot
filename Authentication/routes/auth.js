import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // 1. Check all fields
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields required" });
  }

  // 2. Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // 3. Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  // 4. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5. Save user
  await User.create({
    name,
    email,
    password: hashedPassword
  });

  res.status(201).json({ message: "Signup successful" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 1. Check fields
  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  // 2. Check user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // 3. Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  // 4. Generate token
  const token = jwt.sign({ id: user._id }, "SECRET_KEY_123", {
    expiresIn: "7d"
  });

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

export default router;
