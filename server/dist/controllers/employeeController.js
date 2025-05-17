"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEmployees = getAllEmployees;
exports.getEmployeeById = getEmployeeById;
exports.createEmployee = createEmployee;
exports.updateEmployee = updateEmployee;
exports.deleteEmployee = deleteEmployee;
const Employee_1 = __importDefault(require("../models/Employee"));
async function getAllEmployees(req, res) {
    try {
        const employees = await Employee_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(employees);
    }
    catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Failed to fetch employees", error });
    }
}
async function getEmployeeById(req, res) {
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
}
async function createEmployee(req, res) {
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
}
async function updateEmployee(req, res) {
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
}
async function deleteEmployee(req, res) {
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
}
