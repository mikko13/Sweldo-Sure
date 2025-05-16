import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import employeeRoutes from "./routes/employeeRoutes";
import payrollRoutes from "./routes/payrollRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import positionRoutes from "./routes/positionRoutes";
import departmentRoutes from "./routes/departmentRoutes";

import config from "./config";

const app = express();

const PORT = config.PORT;

if (!PORT) {
  console.error("Error: PORT is not defined in .env file");
  process.exit(1);
}

const MONGODB_URI = config.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not defined in .env file");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.use("/api/employees", employeeRoutes);
app.use("/api/payrolls", payrollRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/system/positions", positionRoutes);
app.use("/api/system/departments", departmentRoutes);

app.get("/", (req, res) => {
  res.send("Employee Management API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
