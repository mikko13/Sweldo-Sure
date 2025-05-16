"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/routes/employeeRoutes.ts - Fixed routes for employee API
const express_1 = __importDefault(require("express"));
const employeeController_1 = require("../controllers/employeeController");
const router = express_1.default.Router();
// GET /api/employees - Get all employees
router.get("/", employeeController_1.getAllEmployees);
// GET /api/employees/:id - Get employee by ID
router.get("/:id", employeeController_1.getEmployeeById);
// POST /api/employees - Create new employee
router.post("/", employeeController_1.createEmployee);
// PUT /api/employees/:id - Update employee
router.put("/:id", employeeController_1.updateEmployee);
// DELETE /api/employees/:id - Delete employee
router.delete("/:id", employeeController_1.deleteEmployee);
exports.default = router;
