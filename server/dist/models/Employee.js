"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/models/Employee.ts - Fixed Mongoose model for Employee
const mongoose_1 = __importStar(require("mongoose"));
// Employee Schema
const EmployeeSchema = new mongoose_1.Schema({
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"],
    },
    position: { type: String, required: true },
    department: { type: String, required: true },
    dateStarted: { type: String, required: true },
    rate: { type: String, required: true },
    civilStatus: {
        type: String,
        required: true,
        enum: ["single", "married", "widowed", "divorced", "separated"],
    },
    birthDate: { type: String, required: true },
    sss: { type: String },
    hdmf: { type: String },
    philhealth: { type: String },
    tin: { type: String },
    emailAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    contactNumber: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ["active", "on leave", "inactive"],
        default: "active",
    },
    remarks: { type: String },
}, { timestamps: true });
// Create and export the model
const EmployeeModel = mongoose_1.default.model("Employee", EmployeeSchema);
exports.default = EmployeeModel;
