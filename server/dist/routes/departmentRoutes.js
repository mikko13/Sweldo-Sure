"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/departmentRoutes.ts
const express_1 = __importDefault(require("express"));
const departmentController_1 = require("../controllers/departmentController");
const router = express_1.default.Router();
router.get("/", departmentController_1.getAllDepartments);
router.post("/", departmentController_1.createDepartment);
router.get("/:id", departmentController_1.getDepartment);
router.put("/:id", departmentController_1.updateDepartment);
router.delete("/:id", departmentController_1.deleteDepartment);
router.patch("/:id/toggle", departmentController_1.toggleDepartmentStatus);
exports.default = router;
