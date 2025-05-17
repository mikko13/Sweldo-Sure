"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPositions = getAllPositions;
exports.createPosition = createPosition;
exports.getPosition = getPosition;
exports.updatePosition = updatePosition;
exports.deletePosition = deletePosition;
exports.togglePositionStatus = togglePositionStatus;
const Position_1 = __importDefault(require("../models/Position"));
async function getAllPositions(req, res) {
    try {
        const positions = await Position_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: positions.length,
            data: positions,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
}
async function createPosition(req, res) {
    try {
        const { title } = req.body;
        if (!title) {
            res.status(400).json({
                success: false,
                error: "Please provide a title",
            });
            return;
        }
        const position = await Position_1.default.create({ title });
        res.status(201).json({
            success: true,
            data: position,
        });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                error: "Position with this title already exists",
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
}
async function getPosition(req, res) {
    try {
        const position = await Position_1.default.findById(req.params.id);
        if (!position) {
            res.status(404).json({
                success: false,
                error: "Position not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: position,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
}
async function updatePosition(req, res) {
    try {
        const { title, isActive } = req.body;
        const position = await Position_1.default.findByIdAndUpdate(req.params.id, { title, isActive }, { new: true, runValidators: true });
        if (!position) {
            res.status(404).json({
                success: false,
                error: "Position not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: position,
        });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                error: "Position with this title already exists",
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
}
async function deletePosition(req, res) {
    try {
        const position = await Position_1.default.findByIdAndDelete(req.params.id);
        if (!position) {
            res.status(404).json({
                success: false,
                error: "Position not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: {},
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
}
async function togglePositionStatus(req, res) {
    try {
        const position = await Position_1.default.findById(req.params.id);
        if (!position) {
            res.status(404).json({
                success: false,
                error: "Position not found",
            });
            return;
        }
        position.isActive = !position.isActive;
        await position.save();
        res.status(200).json({
            success: true,
            data: position,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
}
