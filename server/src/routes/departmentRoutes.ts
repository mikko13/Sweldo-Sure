import express from "express";
import {
  getAllDepartments,
  createDepartment,
  getDepartment,
  updateDepartment,
  deleteDepartment,
  toggleDepartmentStatus,
} from "../controllers/departmentController";

const router = express.Router();

router.get("/", getAllDepartments);

router.post("/", createDepartment);

router.get("/:id", getDepartment);

router.put("/:id", updateDepartment);

router.delete("/:id", deleteDepartment);

router.patch("/:id/toggle", toggleDepartmentStatus);

export default router;