"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.togglePositionStatus = exports.deletePosition = exports.updatePosition = exports.getPosition = exports.createPosition = exports.getAllPositions = void 0;
const Position_1 = __importDefault(require("../models/Position"));
// Get all positions
const getAllPositions = async (req, res) => {
    try {
        const positions = await Position_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: positions.length,
            data: positions
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
exports.getAllPositions = getAllPositions;
// Create new position
const createPosition = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            res.status(400).json({
                success: false,
                error: 'Please provide a title'
            });
            return;
        }
        const position = await Position_1.default.create({ title });
        res.status(201).json({
            success: true,
            data: position
        });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                error: 'Position with this title already exists'
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
exports.createPosition = createPosition;
// Get single position
const getPosition = async (req, res) => {
    try {
        const position = await Position_1.default.findById(req.params.id);
        if (!position) {
            res.status(404).json({
                success: false,
                error: 'Position not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: position
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
exports.getPosition = getPosition;
// Update position
const updatePosition = async (req, res) => {
    try {
        const { title, isActive } = req.body;
        const position = await Position_1.default.findByIdAndUpdate(req.params.id, { title, isActive }, { new: true, runValidators: true });
        if (!position) {
            res.status(404).json({
                success: false,
                error: 'Position not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: position
        });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                error: 'Position with this title already exists'
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
exports.updatePosition = updatePosition;
// Delete position
const deletePosition = async (req, res) => {
    try {
        const position = await Position_1.default.findByIdAndDelete(req.params.id);
        if (!position) {
            res.status(404).json({
                success: false,
                error: 'Position not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
exports.deletePosition = deletePosition;
// Toggle position status
const togglePositionStatus = async (req, res) => {
    try {
        const position = await Position_1.default.findById(req.params.id);
        if (!position) {
            res.status(404).json({
                success: false,
                error: 'Position not found'
            });
            return;
        }
        position.isActive = !position.isActive;
        await position.save();
        res.status(200).json({
            success: true,
            data: position
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
exports.togglePositionStatus = togglePositionStatus;
