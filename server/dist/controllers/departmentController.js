"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDepartments = getAllDepartments;
exports.createDepartment = createDepartment;
exports.getDepartment = getDepartment;
exports.updateDepartment = updateDepartment;
exports.deleteDepartment = deleteDepartment;
exports.toggleDepartmentStatus = toggleDepartmentStatus;
const Department_1 = __importDefault(require("../models/Department"));
async function getAllDepartments(req, res) {
    try {
        const departments = await Department_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: departments.length,
            data: departments,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
}
async function createDepartment(req, res) {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({
                success: false,
                error: "Please provide a name",
            });
            return;
        }
        const department = await Department_1.default.create({ name });
        res.status(201).json({
            success: true,
            data: department,
        });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                error: "Department with this name already exists",
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
}
async function getDepartment(req, res) {
    try {
        const department = await Department_1.default.findById(req.params.id);
        if (!department) {
            res.status(404).json({
                success: false,
                error: "Department not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: department,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
}
async function updateDepartment(req, res) {
    try {
        const { name, isActive } = req.body;
        const department = await Department_1.default.findByIdAndUpdate(req.params.id, { name, isActive }, { new: true, runValidators: true });
        if (!department) {
            res.status(404).json({
                success: false,
                error: "Department not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: department,
        });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                error: "Department with this name already exists",
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
}
async function deleteDepartment(req, res) {
    try {
        const department = await Department_1.default.findByIdAndDelete(req.params.id);
        if (!department) {
            res.status(404).json({
                success: false,
                error: "Department not found",
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
async function toggleDepartmentStatus(req, res) {
    try {
        const department = await Department_1.default.findById(req.params.id);
        if (!department) {
            res.status(404).json({
                success: false,
                error: "Department not found",
            });
            return;
        }
        department.isActive = !department.isActive;
        await department.save();
        res.status(200).json({
            success: true,
            data: department,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
}
