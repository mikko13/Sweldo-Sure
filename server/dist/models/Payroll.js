"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PayrollSchema = new mongoose_1.default.Schema({
    employeeId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Processed"],
        default: "Pending",
    },
    payPeriod: {
        type: String,
        required: true,
    },
    numberOfRegularHours: {
        type: Number,
        min: 0,
        default: null,
    },
    hourlyRate: {
        type: Number,
        min: 0,
        default: null,
    },
    totalRegularWage: {
        type: Number,
        min: 0,
        default: 0,
    },
    regularNightDifferential: {
        type: Number,
        min: 0,
        default: null,
    },
    prorated13thMonthPay: {
        type: Number,
        min: 0,
        default: null,
    },
    specialHoliday: {
        type: Number,
        min: 0,
        default: null,
    },
    regularHoliday: {
        type: Number,
        min: 0,
        default: null,
    },
    serviceIncentiveLeave: {
        type: Number,
        min: 0,
        default: null,
    },
    overtime: {
        type: Number,
        min: 0,
        default: null,
    },
    hdmf: {
        type: Number,
        min: 0,
        default: null,
    },
    hdmfLoans: {
        type: Number,
        min: 0,
        default: null,
    },
    sss: {
        type: Number,
        min: 0,
        default: null,
    },
    phic: {
        type: Number,
        min: 0,
        default: null,
    },
    totalAmount: {
        type: Number,
        min: 0,
        default: 0,
    },
    netPay: {
        type: Number,
        min: 0,
        default: 0,
    },
}, {
    timestamps: true,
});
const PayrollModel = mongoose_1.default.model("Payroll", PayrollSchema);
exports.default = PayrollModel;
