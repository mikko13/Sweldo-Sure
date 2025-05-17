import { Request, Response } from "express";
import Department, { IDepartment } from "../models/Department";

export async function getAllDepartments(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
}

export async function createDepartment(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        error: "Please provide a name",
      });
      return;
    }

    const department = await Department.create({ name });

    res.status(201).json({
      success: true,
      data: department,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        error: "Department with this name already exists",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
}

export async function getDepartment(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      res.status(404).json({
        success: false,
        error: "Department not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
}

export async function updateDepartment(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, isActive } = req.body;

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name, isActive },
      { new: true, runValidators: true }
    );

    if (!department) {
      res.status(404).json({
        success: false,
        error: "Department not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        error: "Department with this name already exists",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
}

export async function deleteDepartment(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      res.status(404).json({
        success: false,
        error: "Department not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
}

export async function toggleDepartmentStatus(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      res.status(404).json({
        success: false,
        error: "Department not found",
      });
      return;
    }

    department.isActive = !department.isActive;
    await department.save();

    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
}
