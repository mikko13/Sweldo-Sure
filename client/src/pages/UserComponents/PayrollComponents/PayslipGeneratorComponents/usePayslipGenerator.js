import * as XLSX from "xlsx-js-style";
import { toast } from "sonner";

function usePayslipGenerator(payrolls, setIsGenerating) {
  function generateAllPayslips() {
    if (!payrolls || payrolls.length === 0) {
      toast.error("No payrolls found to generate payslips.");
      return;
    }

    setIsGenerating(true);

    try {
      const { workbook, worksheet } = createWorkbookAndWorksheet();
      const today = getCurrentDate();
      const formattedDate = formatDate(today);

      let currentRow = 0;
      const merges = [];

      payrolls.forEach((payroll) => {
        const payslipData = createPayslipData(payroll, formattedDate);

        const payrollMerges = calculateMerges(currentRow);
        merges.push(...payrollMerges);

        XLSX.utils.sheet_add_aoa(worksheet, payslipData, {
          origin: `A${currentRow + 1}`,
        });

        applyStylesForPayroll(worksheet, currentRow, payroll, formattedDate);

        currentRow += payslipData.length;
      });

      worksheet["!merges"] = merges;

      XLSX.utils.book_append_sheet(workbook, worksheet, "Payslips");

      const dateStr = formatDateForFilename(today);
      XLSX.writeFile(workbook, "Payslips_" + dateStr + ".xlsx");

      toast.success("Payslips generated successfully!");
    } catch (error) {
      console.error("Error generating payslips:", error);
      toast.error(
        "An error occurred while generating payslips. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return { generateAllPayslips };
}

function createWorkbookAndWorksheet() {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([]);

  const columnWidths = [
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
  worksheet["!cols"] = columnWidths;

  return { workbook, worksheet };
}

function getCurrentDate() {
  return new Date();
}

function formatDate(date) {
  return `${(date.getMonth() + 1).toString().padStart(2, "0")} ${date
    .getDate()
    .toString()
    .padStart(2, "0")}-${(date.getDate() + 13)
    .toString()
    .padStart(2, "0")}, ${date.getFullYear()}`;
}

function formatDateForFilename(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

function formatCurrency(value) {
  return value
    ? `${value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "";
}

function createPayslipData(payroll) {
  const calculatedRegularHoliday = payroll.regularHoliday * 161.25;
  const calculatedSpecialHoliday = payroll.specialHoliday * 104.81;
  const calculatedRegularNightDifferential =
    payroll.regularNightDifferential * 8.06;
  const calculatedOvertime = payroll.overtime * 100.78;
  return [
    [
      "G.L.S. MANPOWER SERVICES",
      "",
      "",
      "",
      "",
      "",
      "",
      payroll.payPeriod,
      "",
      "",
      "",
    ],
    [
      `PAYROLL NAME:${payroll.lastName?.toUpperCase() || ""} ${
        payroll.firstName?.toUpperCase() || payroll.name?.toUpperCase() || ""
      }`,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    ["", "", "RATE/HR", "", "#OF HRS", "", "", "DEDUCTIONS", "", "", ""],
    [
      "REGULAR HOUR",
      "",
      payroll.hourlyRate,
      "",
      payroll.numberOfRegularHours,
      formatCurrency(payroll.totalRegularWage),
      "",
      "BREAKAGES",
      "",
      "",
      "",
    ],
    [
      "REGULAR HOLIDAY",
      "",
      "161.25",
      "",
      "",
      formatCurrency(calculatedRegularHoliday),
      "",
      "HDMF LOAN",
      "",
      "",
      formatCurrency(payroll.hdmfLoans),
    ],
    [
      "SPECIAL HOLIDAY",
      "",
      "104.81",
      "",
      "",
      formatCurrency(calculatedSpecialHoliday),
      "",
      "SSS ",
      "",
      "",
      formatCurrency(payroll.sss),
    ],
    [
      "NIGHT DIFF",
      "",
      "8.06",
      "",
      "",
      formatCurrency(calculatedRegularNightDifferential),
      "",
      "PHIC",
      "",
      "",
      formatCurrency(payroll.phic),
    ],
    [
      "OT",
      "",
      "100.78",
      "",
      "",
      formatCurrency(calculatedOvertime),
      "",
      "HDMF",
      "",
      "",
      formatCurrency(payroll.hdmf),
    ],
    [
      "GROSS PAY",
      "",
      "",
      "",
      "",
      formatCurrency(payroll.totalAmount),
      "",
      "NET PAY",
      "",
      "",
      formatCurrency(payroll.netPay),
    ],
    ["", "", "", "", "", "", "", "", "", "", ""],
  ];
}

function calculateMerges(currentRow) {
  return [
    { s: { r: currentRow, c: 0 }, e: { r: currentRow, c: 5 } },
    { s: { r: currentRow + 1, c: 0 }, e: { r: currentRow + 1, c: 5 } },
    { s: { r: currentRow + 2, c: 4 }, e: { r: currentRow + 2, c: 5 } },
    { s: { r: currentRow + 3, c: 0 }, e: { r: currentRow + 3, c: 1 } },
    { s: { r: currentRow + 4, c: 0 }, e: { r: currentRow + 4, c: 1 } },
    { s: { r: currentRow + 5, c: 0 }, e: { r: currentRow + 5, c: 1 } },
    { s: { r: currentRow + 2, c: 7 }, e: { r: currentRow + 2, c: 8 } },
    { s: { r: currentRow + 3, c: 7 }, e: { r: currentRow + 3, c: 8 } },
    { s: { r: currentRow + 4, c: 7 }, e: { r: currentRow + 4, c: 8 } },
    { s: { r: currentRow, c: 7 }, e: { r: currentRow + 1, c: 10 } },
  ];
}

function applyStylesForPayroll(worksheet, currentRow, payroll, formattedDate) {
  applyCellStyle(worksheet, currentRow, 0, "G.L.S. MANPOWER SERVICES", {
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
  });

  applyCellStyle(worksheet, currentRow, 7, formattedDate, {
    font: { name: "Abadi", sz: 9 },
    alignment: { vertical: "center", horizontal: "center" },
    border: {
      top: { style: "medium", color: { rgb: "000000" } },
    },
  });

  applyNumericStyles(worksheet, currentRow, payroll);

  applyBorderStyles(worksheet, currentRow);
}

function applyCellStyle(worksheet, row, col, value, style) {
  const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
  if (!worksheet[cellAddress]) worksheet[cellAddress] = { v: value };
  worksheet[cellAddress].s = style;
}

function applyNumericStyles(worksheet, currentRow, payroll) {
  if (payroll.hourlyRate) {
    applyCellStyle(worksheet, currentRow + 3, 2, payroll.hourlyRate, {
      font: { name: "Abadi", sz: 9 },
      alignment: { vertical: "center", horizontal: "right" },
    });
  }

  const regWageCell = XLSX.utils.encode_cell({ r: currentRow + 3, c: 5 });
  if (worksheet[regWageCell] && worksheet[regWageCell].v) {
    worksheet[regWageCell].s = {
      font: { name: "Abadi", sz: 9 },
      alignment: { vertical: "center", horizontal: "right" },
    };
  }

  if (payroll.numberOfRegularHours) {
    applyCellStyle(worksheet, currentRow + 3, 4, payroll.numberOfRegularHours, {
      font: { name: "Abadi", sz: 9 },
      alignment: { vertical: "center", horizontal: "right" },
    });
  }

  const regHolidayCell = XLSX.utils.encode_cell({ r: currentRow + 4, c: 2 });
  if (worksheet[regHolidayCell] && worksheet[regHolidayCell].v) {
    worksheet[regHolidayCell].s = {
      font: { name: "Abadi", sz: 9 },
      alignment: { vertical: "center", horizontal: "right" },
    };
  }

  const specialHolidayCell = XLSX.utils.encode_cell({
    r: currentRow + 5,
    c: 2,
  });
  if (worksheet[specialHolidayCell] && worksheet[specialHolidayCell].v) {
    worksheet[specialHolidayCell].s = {
      font: { name: "Abadi", sz: 9 },
      alignment: { vertical: "center", horizontal: "right" },
    };
  }

  const nightDiffRateCell = XLSX.utils.encode_cell({ r: currentRow + 6, c: 2 });
  if (worksheet[nightDiffRateCell] && worksheet[nightDiffRateCell].v) {
    worksheet[nightDiffRateCell].s = {
      font: { name: "Abadi", sz: 9 },
      alignment: { vertical: "center", horizontal: "right" },
    };
  }

  const nightDiffAmtCell = XLSX.utils.encode_cell({ r: currentRow + 6, c: 5 });
  if (worksheet[nightDiffAmtCell] && worksheet[nightDiffAmtCell].v) {
    worksheet[nightDiffAmtCell].s = {
      font: { name: "Abadi", sz: 9 },
      alignment: { vertical: "center", horizontal: "right" },
    };
  }

  const specialHolidayAmtCell = XLSX.utils.encode_cell({
    r: currentRow + 5,
    c: 5,
  });
  if (worksheet[specialHolidayAmtCell] && worksheet[specialHolidayAmtCell].v) {
    worksheet[specialHolidayAmtCell].s = {
      font: { name: "Abadi", sz: 9 },
      alignment: { vertical: "center", horizontal: "right" },
    };
  }

  const overtimeAmtCell = XLSX.utils.encode_cell({ r: currentRow + 7, c: 5 });
  if (worksheet[overtimeAmtCell] && worksheet[overtimeAmtCell].v) {
    worksheet[overtimeAmtCell].s = {
      font: { name: "Abadi", sz: 9 },
      alignment: { vertical: "center", horizontal: "right" },
    };
  }

  const overtimeCell = XLSX.utils.encode_cell({ r: currentRow + 7, c: 2 });
  if (worksheet[overtimeCell] && worksheet[overtimeCell].v) {
    worksheet[overtimeCell].s = {
      font: { name: "Abadi", sz: 9 },
      alignment: { vertical: "center", horizontal: "right" },
    };
  }

  const grossPayCell = XLSX.utils.encode_cell({ r: currentRow + 8, c: 5 });
  if (worksheet[grossPayCell] && worksheet[grossPayCell].v) {
    worksheet[grossPayCell].s = {
      font: { name: "Abadi", sz: 9 },
      alignment: { vertical: "center", horizontal: "right" },
    };
  }

  applyCellStyle(worksheet, currentRow + 5, 10, payroll.sss, {
    font: { name: "Abadi", sz: 9 },
    alignment: { vertical: "center", horizontal: "right" },
    border: {
      right: { style: "medium", color: { rgb: "000000" } },
    },
  });

  applyCellStyle(worksheet, currentRow + 4, 10, payroll.hdmfLoans, {
    font: { name: "Abadi", sz: 9 },
    alignment: { vertical: "center", horizontal: "right" },
    border: {
      right: { style: "medium", color: { rgb: "000000" } },
    },
  });

  applyCellStyle(worksheet, currentRow + 6, 10, payroll.phic, {
    font: { name: "Abadi", sz: 9 },
    alignment: { vertical: "center", horizontal: "right" },
    border: {
      right: { style: "medium", color: { rgb: "000000" } },
    },
  });

  applyCellStyle(worksheet, currentRow + 7, 10, formatCurrency(payroll.hdmf), {
    font: { name: "Abadi", sz: 9 },
    alignment: { vertical: "center", horizontal: "right" },
    border: {
      right: { style: "medium", color: { rgb: "000000" } },
    },
  });

  applyCellStyle(
    worksheet,
    currentRow + 8,
    10,
    formatCurrency(payroll.netPay),
    {
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
    }
  );
}

function applyBorderStyles(worksheet, currentRow) {
  const payslipRowCount = 9;
  const payslipColCount = 11;

  for (let rowIndex = 0; rowIndex < payslipRowCount; rowIndex++) {
    for (let colIndex = 0; colIndex < payslipColCount; colIndex++) {
      const cellAddress = XLSX.utils.encode_cell({
        r: currentRow + rowIndex,
        c: colIndex,
      });

      if (!worksheet[cellAddress]) worksheet[cellAddress] = { v: "" };
      if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};

      if (!worksheet[cellAddress].s.font) {
        worksheet[cellAddress].s.font = { name: "Abadi", sz: 9 };
      }

      if (!worksheet[cellAddress].s.alignment) {
        worksheet[cellAddress].s.alignment = {
          vertical: "center",
          horizontal: "left",
        };
      }

      const cellStyle = worksheet[cellAddress].s;

      if (rowIndex === 0) {
        cellStyle.border = {
          ...(cellStyle.border || {}),
          top: { style: "medium", color: { rgb: "000000" } },
        };
      }

      if (rowIndex === payslipRowCount - 1) {
        cellStyle.border = {
          ...(cellStyle.border || {}),
          bottom: { style: "medium", color: { rgb: "000000" } },
        };
      }

      if (colIndex === 0) {
        cellStyle.border = {
          ...(cellStyle.border || {}),
          left: { style: "medium", color: { rgb: "000000" } },
        };
      }

      if (colIndex === payslipColCount - 1) {
        cellStyle.border = {
          ...(cellStyle.border || {}),
          right: { style: "medium", color: { rgb: "000000" } },
        };
      }
    }
  }
}

export default usePayslipGenerator;
