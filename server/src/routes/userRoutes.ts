// routes/userRoutes.ts
import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserProfilePicture,
  toggleUserActiveStatus,
  getCurrentUser,
  updateCurrentUser,
  checkEmailExists,
  resetPassword,
  getUserByEmail,
} from "../controllers/userController";
import upload from "../middleware/upload";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/current", authenticateUser, getCurrentUser);
router.put(
  "/current",
  authenticateUser,
  upload.single("profilePicture"),
  updateCurrentUser
);

router.get("/check-email", checkEmailExists);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", upload.single("profilePicture"), createUser);
router.put("/:id", upload.single("profilePicture"), updateUser);
router.delete("/:id", deleteUser);
router.get("/:id/profile-picture", getUserProfilePicture);
router.patch("/:id/toggle-status", toggleUserActiveStatus);
router.get("/get-user-by-email", getUserByEmail);
router.post("/reset-password", resetPassword);

export default router;
