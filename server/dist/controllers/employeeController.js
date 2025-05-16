"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployee = exports.updateEmployee = exports.createEmployee = exports.getEmployeeById = exports.getAllEmployees = void 0;
const Employee_1 = __importDefault(require("../models/Employee"));
const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(employees);
    }
    catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Failed to fetch employees", error });
    }
};
exports.getAllEmployees = getAllEmployees;
const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee_1.default.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json(employee);
    }
    catch (error) {
        console.error("Error fetching employee:", error);
        res.status(500).json({ message: "Failed to fetch employee", error });
    }
};
exports.getEmployeeById = getEmployeeById;
const createEmployee = async (req, res) => {
    try {
        const newEmployee = new Employee_1.default(req.body);
        await newEmployee.save();
        res.status(201).json({
            message: "Employee created successfully",
            employee: newEmployee,
        });
    }
    catch (error) {
        console.error("Error creating employee:", error);
        res.status(400).json({ message: "Failed to create employee", error });
    }
};
exports.createEmployee = createEmployee;
const updateEmployee = async (req, res) => {
    try {
        const updatedEmployee = await Employee_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json({
            message: "Employee updated successfully",
            employee: updatedEmployee,
        });
    }
    catch (error) {
        console.error("Error updating employee:", error);
        res.status(400).json({ message: "Failed to update employee", error });
    }
};
exports.updateEmployee = updateEmployee;
const deleteEmployee = async (req, res) => {
    try {
        const deletedEmployee = await Employee_1.default.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json({
            message: "Employee deleted successfully",
            employee: deletedEmployee,
        });
    }
    catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: "Failed to delete employee", error });
    }
};
exports.deleteEmployee = deleteEmployee;
