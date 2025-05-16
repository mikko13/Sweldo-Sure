import * as XLSX from "xlsx-js-style";

export function formatCurrency(value) {
  return value
    ? value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "";
}

export function formatPayslipDate(date) {
  return `${(date.getMonth() + 1).toString().padStart(2, "0")} ${date
    .getDate()
    .toString()
    .padStart(2, "0")}-${(date.getDate() + 13)
    .toString()
    .padStart(2, "0")}, ${date.getFullYear()}`;
}

export function formatFilenameDate(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

export function createWorkbook() {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([]);

  worksheet["!cols"] = [
    { wch: 8.33 },
    { wch: 8.11 },
    { wch: 8.33 },
    { wch: 1.22 },
    { wch: 5.11 },
    { wch: 11.11 },
    { wch: 0.88 },
    { wch: 8.33 },
    { wch: 7.22 },
    { wch: 1.78 },
    { wch: 11.33 },
  ];

  return { workbook, worksheet };
}

export function applyCellStyle(worksheet, row, col, value, style) {
  const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
  if (!worksheet[cellAddress]) worksheet[cellAddress] = { v: value };
  worksheet[cellAddress].s = style;
}

export const cellStyles = {
  companyName: {
    font: {
      name: "Abadi",
      bold: true,
      sz: 10,
    },
    alignment: { vertical: "center", horizontal: "left" },
    border: {
      top: { style: "medium", color: { rgb: "000000" } },
      left: { style: "medium", color: { rgb: "000000" } },
    },
  },
  date: {
    font: { name: "Abadi", sz: 9 },
    alignment: { vertical: "center", horizontal: "center" },
    border: {
      top: { style: "medium", color: { rgb: "000000" } },
    },
  },
  numeric: {
    font: { name: "Abadi", sz: 9 },
    alignment: { vertical: "center", horizontal: "right" },
  },
  rightBorder: {
    font: { name: "Abadi", sz: 9 },
    alignment: { vertical: "center", horizontal: "right" },
    border: {
      right: { style: "medium", color: { rgb: "000000" } },
    },
  },
  netPay: {
    font: {
      name: "Abadi",
      sz: 9,
      underline: true,
    },
    alignment: { vertical: "center", horizontal: "right" },
    border: {
      right: { style: "medium", color: { rgb: "000000" } },
      bottom: { style: "medium", color: { rgb: "000000" } },
    },
  },
  default: {
    font: { name: "Abadi", sz: 9 },
    alignment: { vertical: "center", horizontal: "left" },
  },
};
