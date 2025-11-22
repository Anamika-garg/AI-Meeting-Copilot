import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import ticketRoutes from "./routes/ticket.js";


// IMPORT ROUTES (make sure these files exist)
import authRoutes from "./routes/auth.js";
import teamRoutes from "./routes/team.js";
import companyRoutes from "./routes/company.js";

// 1️⃣ Initialize app FIRST
const app = express();

// 2️⃣ Middlewares
app.use(express.json());
app.use(cors());
app.use("/api/ticket", ticketRoutes);


// 3️⃣ Add Routes AFTER app is created
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/company", companyRoutes);

// 4️⃣ Connect to MongoDB AFTER routes 
mongoose.connect(
  "mongodb+srv://Diya:7tSJxVTeuPjY0LYS@cluster0.mzqlhhx.mongodb.net/MyAppDB?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

// 5️⃣ Start the server at the END
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
