"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payrollController_1 = require("../controllers/payrollController");
const router = express_1.default.Router();
router.get("/", payrollController_1.getAllPayrolls);
router.get("/thirteenth-month/:employeeId/:year", payrollController_1.calculateThirteenthMonthPay);
router.get("/:id", payrollController_1.getPayrollById);
router.post("/", payrollController_1.createPayroll);
router.put("/:id", payrollController_1.updatePayroll);
router.delete("/:id", payrollController_1.deletePayroll);
exports.default = router;
