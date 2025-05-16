// src/routes/positionRoutes.ts
import express from "express";
import {
  getAllPositions,
  createPosition,
  getPosition,
  updatePosition,
  deletePosition,
  togglePositionStatus,
} from "../controllers/positionController";

const router = express.Router();

router.get("/", getAllPositions);

router.post("/", createPosition);

router.get("/:id", getPosition);

router.put("/:id", updatePosition);

router.delete("/:id", deletePosition);

router.patch("/:id/toggle", togglePositionStatus);

export default router;
