"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.logout = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const emailjs = require("@emailjs/nodejs");
const config_1 = __importDefault(require("../config"));
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Check if user is active
        if (!user.isActive) {
            return res
                .status(403)
                .json({
                message: "Account is deactivated. Please contact administrator.",
            });
        }
        // Compare passwords
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
            role: user.role, // Include role in the token
        }, config_1.default.JWT_SECRET, { expiresIn: "24h" });
        // Return token and user info (including role)
        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isActive: user.isActive,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};
exports.login = login;
const logout = (req, res) => {
    // JWT is stateless, so we don't need to do anything server-side
    // The client will remove the token
    res.status(200).json({ message: "Logged out successfully" });
};
exports.logout = logout;
const getCurrentUser = async (req, res) => {
    try {
        // @ts-ignore - We'll add user property through middleware
        const userId = req.user.id;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        });
    }
    catch (error) {
        console.error("Error fetching current user:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getCurrentUser = getCurrentUser;
