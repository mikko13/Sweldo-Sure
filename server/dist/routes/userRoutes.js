"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const upload_1 = __importDefault(require("../middleware/upload"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get("/current", authMiddleware_1.authenticateUser, userController_1.getCurrentUser);
router.put("/current", authMiddleware_1.authenticateUser, upload_1.default.single("profilePicture"), userController_1.updateCurrentUser);
router.get("/check-email", userController_1.checkEmailExists);
router.get("/", userController_1.getAllUsers);
router.get("/:id", userController_1.getUserById);
router.post("/", upload_1.default.single("profilePicture"), userController_1.createUser);
router.put("/:id", upload_1.default.single("profilePicture"), userController_1.updateUser);
router.delete("/:id", userController_1.deleteUser);
router.get("/:id/profile-picture", userController_1.getUserProfilePicture);
router.patch("/:id/toggle-status", userController_1.toggleUserActiveStatus);
router.get("/get-user-by-email", userController_1.getUserByEmail);
router.post("/reset-password", userController_1.resetPassword);
exports.default = router;
