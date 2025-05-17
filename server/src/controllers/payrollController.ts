import { Request, Response } from "express";
import PayrollModel from "../models/Payroll";
import axios from "axios";

export async function getAllPayrolls(req: Request, res: Response) {
  try {
    const payrolls = await PayrollModel.find().sort({ createdAt: -1 });
    res.status(200).json(payrolls);
  } catch (error) {
    console.error("Error fetching payrolls:", error);
    res.status(500).json({ message: "Failed to fetch payrolls", error });
  }
}

export async function getPayrollById(req: Request, res: Response) {
  try {
    const payroll = await PayrollModel.findById(req.params.id);

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    res.status(200).json(payroll);
  } catch (error) {
    console.error("Error fetching payroll:", error);
    res.status(500).json({ message: "Failed to fetch payroll", error });
  }
}

export async function createPayroll(req: Request, res: Response) {
  try {
    const totalRegularWage = Number(
      (
        (req.body.numberOfRegularHours || 0) * (req.body.hourlyRate || 0)
      ).toFixed(2)
    );

    const regularNightDifferential =
      (req.body.regularNightDifferential || 0) * 8.06;

    const specialHoliday = (req.body.specialHoliday || 0) * 104.81;

    const regularHoliday = (req.body.regularHoliday || 0) * 161.25;

    const overtime = (req.body.overtime || 0) * 100.78;

    const totalAmount = Number(
      (
        totalRegularWage +
        regularNightDifferential +
        (req.body.prorated13thMonthPay || 0) +
        specialHoliday +
        regularHoliday +
        (req.body.serviceIncentiveLeave || 0) +
        overtime
      ).toFixed(2)
    );

    const netPay = Number(
      (
        totalAmount -
        (req.body.hdmf || 0) -
        (req.body.hdmfLoans || 0) -
        (req.body.sss || 0) -
        (req.body.phic || 0)
      ).toFixed(2)
    );

    const payrollData = {
      ...req.body,
      totalRegularWage,
      totalAmount,
      netPay,
    };

    const newPayroll = new PayrollModel(payrollData);
    await newPayroll.save();

    res.status(201).json({
      message: "Payroll created successfully",
      payroll: newPayroll,
    });
  } catch (error) {
    console.error("Error creating payroll:", error);
    res.status(400).json({ message: "Failed to create payroll", error });
  }
}

export async function calculateThirteenthMonthPay(req: Request, res: Response) {
  try {
    const { employeeId, year } = req.params;

    const employeeResponse = await axios.get(
      `https://sweldo-sure-server.onrender.com/api/employees/${employeeId}`
    );
    const employeeName = `${employeeResponse.data.lastName}, ${employeeResponse.data.firstName}`;

    const payrolls = await PayrollModel.find({
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
  } catch (error) {
    console.error("Error calculating 13th month pay:", error);
    res.status(500).json({
      message: "Failed to calculate 13th month pay",
    });
  }
}

export async function updatePayroll(req: Request, res: Response) {
  try {
    const totalRegularWage = Number(
      (
        (req.body.numberOfRegularHours || 0) * (req.body.hourlyRate || 0)
      ).toFixed(2)
    );

    const regularNightDifferential =
      (req.body.regularNightDifferential || 0) * 8.06;

    const specialHoliday = (req.body.specialHoliday || 0) * 104.81;

    const regularHoliday = (req.body.regularHoliday || 0) * 161.25;

    const overtime = (req.body.overtime || 0) * 100.78;

    const totalAmount = Number(
      (
        totalRegularWage +
        regularNightDifferential +
        (req.body.prorated13thMonthPay || 0) +
        specialHoliday +
        regularHoliday +
        (req.body.serviceIncentiveLeave || 0) +
        overtime
      ).toFixed(2)
    );

    const netPay = Number(
      (
        totalAmount -
        (req.body.hdmf || 0) -
        (req.body.hdmfLoans || 0) -
        (req.body.sss || 0) -
        (req.body.phic || 0)
      ).toFixed(2)
    );

    const payrollData = {
      ...req.body,
      totalRegularWage,
      totalAmount,
      netPay,
    };

    const updatedPayroll = await PayrollModel.findByIdAndUpdate(
      req.params.id,
      payrollData,
      { new: true, runValidators: true }
    );

    if (!updatedPayroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    res.status(200).json({
      message: "Payroll updated successfully",
      payroll: updatedPayroll,
    });
  } catch (error) {
    console.error("Error updating payroll:", error);
    res.status(400).json({ message: "Failed to update payroll", error });
  }
}

export async function deletePayroll(req: Request, res: Response) {
  try {
    const deletedPayroll = await PayrollModel.findByIdAndDelete(req.params.id);

    if (!deletedPayroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    res.status(200).json({
      message: "Payroll deleted successfully",
      payroll: deletedPayroll,
    });
  } catch (error) {
    console.error("Error deleting payroll:", error);
    res.status(500).json({ message: "Failed to delete payroll", error });
  }
}
