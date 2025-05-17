"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPayrolls = getAllPayrolls;
exports.getPayrollById = getPayrollById;
exports.createPayroll = createPayroll;
exports.calculateThirteenthMonthPay = calculateThirteenthMonthPay;
exports.updatePayroll = updatePayroll;
exports.deletePayroll = deletePayroll;
const Payroll_1 = __importDefault(require("../models/Payroll"));
const axios_1 = __importDefault(require("axios"));
async function getAllPayrolls(req, res) {
    try {
        const payrolls = await Payroll_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(payrolls);
    }
    catch (error) {
        console.error("Error fetching payrolls:", error);
        res.status(500).json({ message: "Failed to fetch payrolls", error });
    }
}
async function getPayrollById(req, res) {
    try {
        const payroll = await Payroll_1.default.findById(req.params.id);
        if (!payroll) {
            return res.status(404).json({ message: "Payroll not found" });
        }
        res.status(200).json(payroll);
    }
    catch (error) {
        console.error("Error fetching payroll:", error);
        res.status(500).json({ message: "Failed to fetch payroll", error });
    }
}
async function createPayroll(req, res) {
    try {
        const totalRegularWage = Number(((req.body.numberOfRegularHours || 0) * (req.body.hourlyRate || 0)).toFixed(2));
        const regularNightDifferential = (req.body.regularNightDifferential || 0) * 8.06;
        const specialHoliday = (req.body.specialHoliday || 0) * 104.81;
        const regularHoliday = (req.body.regularHoliday || 0) * 161.25;
        const overtime = (req.body.overtime || 0) * 100.78;
        const totalAmount = Number((totalRegularWage +
            regularNightDifferential +
            (req.body.prorated13thMonthPay || 0) +
            specialHoliday +
            regularHoliday +
            (req.body.serviceIncentiveLeave || 0) +
            overtime).toFixed(2));
        const netPay = Number((totalAmount -
            (req.body.hdmf || 0) -
            (req.body.hdmfLoans || 0) -
            (req.body.sss || 0) -
            (req.body.phic || 0)).toFixed(2));
        const payrollData = {
            ...req.body,
            totalRegularWage,
            totalAmount,
            netPay,
        };
        const newPayroll = new Payroll_1.default(payrollData);
        await newPayroll.save();
        res.status(201).json({
            message: "Payroll created successfully",
            payroll: newPayroll,
        });
    }
    catch (error) {
        console.error("Error creating payroll:", error);
        res.status(400).json({ message: "Failed to create payroll", error });
    }
}
async function calculateThirteenthMonthPay(req, res) {
    try {
        const { employeeId, year } = req.params;
        const employeeResponse = await axios_1.default.get(`https://sweldo-sure-server.onrender.com/api/employees/${employeeId}`);
        const employeeName = `${employeeResponse.data.lastName}, ${employeeResponse.data.firstName}`;
        const payrolls = await Payroll_1.default.find({
            name: employeeName,
            payPeriod: { $regex: year },
        }).sort({ payPeriod: 1 });
        if (payrolls.length === 0) {
            return res.status(404).json({
                message: "No payroll records found for this employee and year",
            });
        }
        const totalBasicSalary = payrolls.reduce((sum, payroll) => {
            return sum + (payroll.totalRegularWage || 0);
        }, 0);
        const thirteenthMonthPay = totalBasicSalary / 12;
        res.status(200).json({
            success: true,
            data: {
                employeeId,
                year,
                totalBasicSalary,
                thirteenthMonthPay,
                payrollRecordsCount: payrolls.length,
            },
        });
    }
    catch (error) {
        console.error("Error calculating 13th month pay:", error);
        res.status(500).json({
            message: "Failed to calculate 13th month pay",
        });
    }
}
async function updatePayroll(req, res) {
    try {
        const totalRegularWage = Number(((req.body.numberOfRegularHours || 0) * (req.body.hourlyRate || 0)).toFixed(2));
        const regularNightDifferential = (req.body.regularNightDifferential || 0) * 8.06;
        const specialHoliday = (req.body.specialHoliday || 0) * 104.81;
        const regularHoliday = (req.body.regularHoliday || 0) * 161.25;
        const overtime = (req.body.overtime || 0) * 100.78;
        const totalAmount = Number((totalRegularWage +
            regularNightDifferential +
            (req.body.prorated13thMonthPay || 0) +
            specialHoliday +
            regularHoliday +
            (req.body.serviceIncentiveLeave || 0) +
            overtime).toFixed(2));
        const netPay = Number((totalAmount -
            (req.body.hdmf || 0) -
            (req.body.hdmfLoans || 0) -
            (req.body.sss || 0) -
            (req.body.phic || 0)).toFixed(2));
        const payrollData = {
            ...req.body,
            totalRegularWage,
            totalAmount,
            netPay,
        };
        const updatedPayroll = await Payroll_1.default.findByIdAndUpdate(req.params.id, payrollData, { new: true, runValidators: true });
        if (!updatedPayroll) {
            return res.status(404).json({ message: "Payroll not found" });
        }
        res.status(200).json({
            message: "Payroll updated successfully",
            payroll: updatedPayroll,
        });
    }
    catch (error) {
        console.error("Error updating payroll:", error);
        res.status(400).json({ message: "Failed to update payroll", error });
    }
}
async function deletePayroll(req, res) {
    try {
        const deletedPayroll = await Payroll_1.default.findByIdAndDelete(req.params.id);
        if (!deletedPayroll) {
            return res.status(404).json({ message: "Payroll not found" });
        }
        res.status(200).json({
            message: "Payroll deleted successfully",
            payroll: deletedPayroll,
        });
    }
    catch (error) {
        console.error("Error deleting payroll:", error);
        res.status(500).json({ message: "Failed to delete payroll", error });
    }
}
