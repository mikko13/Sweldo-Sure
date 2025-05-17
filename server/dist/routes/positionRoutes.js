"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const positionController_1 = require("../controllers/positionController");
const router = express_1.default.Router();
router.get("/", positionController_1.getAllPositions);
router.post("/", positionController_1.createPosition);
router.get("/:id", positionController_1.getPosition);
router.put("/:id", positionController_1.updatePosition);
router.delete("/:id", positionController_1.deletePosition);
router.patch("/:id/toggle", positionController_1.togglePositionStatus);
exports.default = router;
