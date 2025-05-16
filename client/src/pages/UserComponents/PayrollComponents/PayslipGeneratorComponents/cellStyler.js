import * as XLSX from "xlsx-js-style";
import { applyCellStyle, cellStyles, formatCurrency } from "./excelUtils";

export function applyPayslipStyles(
  worksheet,
  currentRow,
  employee,
  formattedDate
) {
  applyHeaderStyles(worksheet, currentRow, formattedDate);

  applyNumericStyles(worksheet, currentRow, employee);

  applyBorderStyles(worksheet, currentRow);
}

function applyHeaderStyles(worksheet, currentRow, formattedDate) {
  applyCellStyle(
    worksheet,
    currentRow,
    0,
    "G.L.S. MANPOWER SERVICES",
    cellStyles.companyName
  );

  applyCellStyle(worksheet, currentRow, 7, formattedDate, cellStyles.date);
}

function applyNumericStyles(worksheet, currentRow, employee) {
  if (employee.hourlyRate) {
    applyCellStyle(
      worksheet,
      currentRow + 3,
      2,
      employee.hourlyRate,
      cellStyles.numeric
    );
  }
  const regWageCell = XLSX.utils.encode_cell({ r: currentRow + 3, c: 5 });
  if (worksheet[regWageCell] && worksheet[regWageCell].v) {
    worksheet[regWageCell].s = cellStyles.numeric;
  }

  if (employee.numberOfRegularHours) {
    applyCellStyle(
      worksheet,
      currentRow + 3,
      4,
      employee.numberOfRegularHours,
      cellStyles.numeric
    );
  }

  const regHolidayCell = XLSX.utils.encode_cell({ r: currentRow + 4, c: 2 });
  if (worksheet[regHolidayCell] && worksheet[regHolidayCell].v) {
    worksheet[regHolidayCell].s = cellStyles.numeric;
  }
  const specialHolidayCell = XLSX.utils.encode_cell({
    r: currentRow + 5,
    c: 2,
  });
  if (worksheet[specialHolidayCell] && worksheet[specialHolidayCell].v) {
    worksheet[specialHolidayCell].s = cellStyles.numeric;
  }
  const nightDiffRateCell = XLSX.utils.encode_cell({ r: currentRow + 6, c: 2 });
  if (worksheet[nightDiffRateCell] && worksheet[nightDiffRateCell].v) {
    worksheet[nightDiffRateCell].s = cellStyles.numeric;
  }
  const nightDiffAmtCell = XLSX.utils.encode_cell({ r: currentRow + 6, c: 5 });
  if (worksheet[nightDiffAmtCell] && worksheet[nightDiffAmtCell].v) {
    worksheet[nightDiffAmtCell].s = cellStyles.numeric;
  }
  const grossPayCell = XLSX.utils.encode_cell({ r: currentRow + 8, c: 5 });
  if (worksheet[grossPayCell] && worksheet[grossPayCell].v) {
    worksheet[grossPayCell].s = cellStyles.numeric;
  }
  applyCellStyle(
    worksheet,
    currentRow + 5,
    10,
    employee.sss,
    cellStyles.rightBorder
  );
  applyCellStyle(
    worksheet,
    currentRow + 6,
    10,
    employee.phic,
    cellStyles.rightBorder
  );
  applyCellStyle(
    worksheet,
    currentRow + 7,
    10,
    formatCurrency(employee.hdmfLoans),
    cellStyles.rightBorder
  );

  applyCellStyle(
    worksheet,
    currentRow + 8,
    10,
    employee.hdmf,
    cellStyles.rightBorder
  );

  if (employee.otherDeductions) {
    applyCellStyle(
      worksheet,
      currentRow + 9,
      10,
      formatCurrency(employee.otherDeductions),
      cellStyles.rightBorder
    );
  }

  const totalDeductionsCell = XLSX.utils.encode_cell({
    r: currentRow + 10,
    c: 10,
  });
  if (worksheet[totalDeductionsCell] && worksheet[totalDeductionsCell].v) {
    worksheet[totalDeductionsCell].s = cellStyles.totalDeductions;
  }

  const netPayCell = XLSX.utils.encode_cell({ r: currentRow + 12, c: 10 });
  if (worksheet[netPayCell] && worksheet[netPayCell].v) {
    worksheet[netPayCell].s = cellStyles.netPay;
  }
}

function applyBorderStyles(worksheet, currentRow) {
  const payslipRowCount = 15;
  const columnCount = 12;

  for (let i = 0; i < payslipRowCount; i++) {
    for (let j = 0; j < columnCount; j++) {
      const cellRef = XLSX.utils.encode_cell({ r: currentRow + i, c: j });

      if (!worksheet[cellRef]) {
        worksheet[cellRef] = { v: "", t: "s" };
      }

      if (!worksheet[cellRef].s) {
        worksheet[cellRef].s = {};
      }

      worksheet[cellRef].s = {
        ...worksheet[cellRef].s,
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }
  }

  applyHeaderBorder(worksheet, currentRow);
  applyEarningsSectionBorder(worksheet, currentRow);
  applyDeductionsSectionBorder(worksheet, currentRow);
  applyNetPayBorder(worksheet, currentRow);
}

function applyHeaderBorder(worksheet, currentRow) {
  for (let j = 0; j < 12; j++) {
    const cellRef = XLSX.utils.encode_cell({ r: currentRow + 1, c: j });
    if (worksheet[cellRef]) {
      if (!worksheet[cellRef].s) {
        worksheet[cellRef].s = {};
      }
      worksheet[cellRef].s.border = {
        ...worksheet[cellRef].s.border,
        bottom: { style: "medium", color: { rgb: "000000" } },
      };
    }
  }
}

function applyEarningsSectionBorder(worksheet, currentRow) {
  for (let j = 0; j < 6; j++) {
    const cellRef = XLSX.utils.encode_cell({ r: currentRow + 8, c: j });
    if (worksheet[cellRef]) {
      if (!worksheet[cellRef].s) {
        worksheet[cellRef].s = {};
      }
      worksheet[cellRef].s.border = {
        ...worksheet[cellRef].s.border,
        bottom: { style: "medium", color: { rgb: "000000" } },
      };
    }
  }
}

function applyDeductionsSectionBorder(worksheet, currentRow) {
  for (let j = 6; j < 12; j++) {
    const cellRef = XLSX.utils.encode_cell({ r: currentRow + 10, c: j });
    if (worksheet[cellRef]) {
      if (!worksheet[cellRef].s) {
        worksheet[cellRef].s = {};
      }
      worksheet[cellRef].s.border = {
        ...worksheet[cellRef].s.border,
        bottom: { style: "medium", color: { rgb: "000000" } },
      };
    }
  }
}

function applyNetPayBorder(worksheet, currentRow) {
  const netPayCell = XLSX.utils.encode_cell({ r: currentRow + 12, c: 10 });
  if (worksheet[netPayCell]) {
    if (!worksheet[netPayCell].s) {
      worksheet[netPayCell].s = {};
    }
    worksheet[netPayCell].s.border = {
      top: { style: "medium", color: { rgb: "000000" } },
      left: { style: "medium", color: { rgb: "000000" } },
      bottom: { style: "medium", color: { rgb: "000000" } },
      right: { style: "medium", color: { rgb: "000000" } },
    };
  }
}

export default applyPayslipStyles;
