import express from "express";
import {
  getAllPayrolls,
  getPayrollById,
  createPayroll,
  updatePayroll,
  deletePayroll,
  calculateThirteenthMonthPay,
} from "../controllers/payrollController";
const router = express.Router();

router.get("/", getAllPayrolls);

router.get("/:id", getPayrollById);

router.post("/", createPayroll);

router.put("/:id", updatePayroll);

router.delete("/:id", deletePayroll);

router.get("/thirteenth-month/:employeeId/:year", calculateThirteenthMonthPay);


export default router;
