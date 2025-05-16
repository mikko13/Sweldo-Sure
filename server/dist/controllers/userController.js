"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfilePicture = exports.updateUserPassword = exports.deleteUser = exports.createUser = exports.getUserById = exports.getAllUsers = exports.toggleUserActiveStatus = exports.updateUser = exports.updateCurrentUser = exports.getCurrentUser = exports.resetPassword = exports.checkEmailExists = exports.getUserByEmail = void 0;
const User_1 = __importDefault(require("../models/User"));
const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email parameter is required",
            });
        }
        const user = await User_1.default.findOne({
            email: email.toString().toLowerCase(),
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User found",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isActive: user.isActive,
            },
        });
    }
    catch (error) {
        console.error("Error fetching user by email:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching user",
            error: error instanceof Error ? error.message : error,
        });
    }
};
exports.getUserByEmail = getUserByEmail;
const checkEmailExists = async (req, res) => {
    try {
        const { email } = req.query;
        // Check if email is provided
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }
        const user = await User_1.default.findOne({
            email: email.toString().toLowerCase(),
        });
        if (!user) {
            return res.status(200).json({
                success: true,
                exists: false,
                message: "User not found with this email",
            });
        }
        // User exists - include firstName and lastName in response
        return res.status(200).json({
            success: true,
            exists: true,
            message: "User exists",
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isActive: user.isActive,
            },
        });
    }
    catch (error) {
        console.error("Error checking user existence:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while checking user existence",
            error: error instanceof Error ? error.message : error,
        });
    }
};
exports.checkEmailExists = checkEmailExists;
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res
                .status(400)
                .json({ message: "Email and new password are required" });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.password = newPassword;
        await user.save();
        return res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ message: "Failed to reset password", error });
    }
};
exports.resetPassword = resetPassword;
const userToResponse = (user) => {
    const userObj = user.toObject();
    const response = {
        _id: userObj._id.toString(),
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        email: userObj.email,
        role: userObj.role,
        isActive: userObj.isActive,
        createdAt: userObj.createdAt,
        updatedAt: userObj.updatedAt,
    };
    if (userObj.profilePicture) {
        response.profilePicture = {
            contentType: userObj.profilePicture.contentType,
            hasImage: true,
        };
    }
    return response;
};
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const userId = req.user.id;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(userToResponse(user));
    }
    catch (error) {
        console.error("Error fetching current user:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getCurrentUser = getCurrentUser;
const updateCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (req.body.firstName)
            user.firstName = req.body.firstName;
        if (req.body.lastName)
            user.lastName = req.body.lastName;
        if (req.body.email)
            user.email = req.body.email;
        if (req.body.password)
            user.password = req.body.password;
        if (req.file) {
            user.profilePicture = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }
        else if (req.body.removeProfilePicture === "true") {
            user.profilePicture = undefined;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            message: "Profile updated successfully",
            user: userToResponse(updatedUser),
        });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        res.status(400).json({ message: "Failed to update profile", error });
    }
};
exports.updateCurrentUser = updateCurrentUser;
const updateUser = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (req.body.firstName)
            user.firstName = req.body.firstName;
        if (req.body.lastName)
            user.lastName = req.body.lastName;
        if (req.body.email)
            user.email = req.body.email;
        if (req.body.password)
            user.password = req.body.password;
        if (req.file) {
            user.profilePicture = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }
        else if (req.body.removeProfilePicture === "true") {
            user.profilePicture = undefined;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            message: "User updated successfully",
            user: userToResponse(updatedUser),
        });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(400).json({ message: "Failed to update user", error });
    }
};
exports.updateUser = updateUser;
const toggleUserActiveStatus = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isActive = !user.isActive;
        await user.save();
        res.status(200).json({
            message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
            user: userToResponse(user),
        });
    }
    catch (error) {
        console.error("Error toggling user status:", error);
        res.status(500).json({ message: "Failed to update user status", error });
    }
};
exports.toggleUserActiveStatus = toggleUserActiveStatus;
const getAllUsers = async (req, res) => {
    try {
        const users = await User_1.default.find().sort({ createdAt: -1 });
        const safeUsers = users.map((user) => userToResponse(user));
        res.status(200).json(safeUsers);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users", error });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const userResponse = userToResponse(user);
        if (user.profilePicture && user.profilePicture.data) {
            userResponse.profilePicture = {
                contentType: user.profilePicture.contentType,
                hasImage: true,
                dataUrl: `data:${user.profilePicture.contentType};base64,${user.profilePicture.data.toString("base64")}`,
            };
        }
        res.status(200).json(userResponse);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user", error });
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    try {
        const userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
        };
        if (req.file) {
            userData.profilePicture = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }
        const newUser = new User_1.default(userData);
        await newUser.save();
        res.status(201).json({
            message: "User created successfully",
            user: userToResponse(newUser),
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(400).json({ message: "Failed to create user", error });
    }
};
exports.createUser = createUser;
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User_1.default.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User deleted successfully",
            user: userToResponse(deletedUser),
        });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Failed to delete user", error });
    }
};
exports.deleteUser = deleteUser;
const updateUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.params.id;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    }
    catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Failed to update password", error });
    }
};
exports.updateUserPassword = updateUserPassword;
const getUserProfilePicture = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user || !user.profilePicture || !user.profilePicture.data) {
            return res.status(404).json({ message: "Profile picture not found" });
        }
        res.set("Content-Type", user.profilePicture.contentType);
        res.set("Cache-Control", "public, max-age=86400");
        res.set("Access-Control-Allow-Origin", "*");
        return res.send(user.profilePicture.data);
    }
    catch (error) {
        console.error("Error fetching profile picture:", error);
        res.status(500).json({ message: "Failed to fetch profile picture", error });
    }
};
exports.getUserProfilePicture = getUserProfilePicture;
