import express from "express";
import {
  login,
  getCurrentUser,
} from "../controllers/authController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/login", login);
router.get("/me", authenticateUser, getCurrentUser);
router.post("/logout", authenticateUser, (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
