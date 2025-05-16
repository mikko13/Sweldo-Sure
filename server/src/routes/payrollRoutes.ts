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

router.get("/thirteenth-month/:employeeId/:year", calculateThirteenthMonthPay);

router.get("/:id", getPayrollById);

router.post("/", createPayroll);
router.put("/:id", updatePayroll);
router.delete("/:id", deletePayroll);

export default router;
