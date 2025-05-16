"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const payrollRoutes_1 = __importDefault(require("./routes/payrollRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const positionRoutes_1 = __importDefault(require("./routes/positionRoutes"));
const departmentRoutes_1 = __importDefault(require("./routes/departmentRoutes"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
const PORT = config_1.default.PORT;
if (!PORT) {
    console.error("Error: PORT is not defined in .env file");
    process.exit(1);
}
const MONGODB_URI = config_1.default.MONGODB_URI;
if (!MONGODB_URI) {
    console.error("Error: MONGODB_URI is not defined in .env file");
    process.exit(1);
}
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});
app.use("/api/employees", employeeRoutes_1.default);
app.use("/api/payrolls", payrollRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/system/positions", positionRoutes_1.default);
app.use("/api/system/departments", departmentRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Employee Management API is running");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
