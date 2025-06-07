import React, { useState } from "react";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

function PayrollExcelGenerator({
  payrolls,
  selectedPayPeriod = "All Pay Periods",
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const nightDifferentialAmount = (payroll) =>
    payroll.regularNightDifferential * 8.06;

  const regularHolidayAmount = (payroll) => payroll.regularHoliday * 161.25;

  const specialHolidayAmount = (payroll) => payroll.specialHoliday * 104.81;

  const overtimeAmount = (payroll) => payroll.overtime * 100.78;

  async function generatePayrollExcel() {
    try {
      setIsGenerating(true);

      const filteredPayrolls =
        selectedPayPeriod === "All Pay Periods"
          ? payrolls
          : payrolls.filter(
              (payroll) => payroll.payPeriod === selectedPayPeriod
            );

      if (filteredPayrolls.length === 0) {
        toast.error("No payroll records found", {
          description:
            "There are no payroll records available for the selected pay period.",
        });
        return;
      }

      const wb = XLSX.utils.book_new();

      // Sheet1 - Main Payroll Sheet
      const payrollData = [];

      // Add empty row
      payrollData.push(Array(19).fill(null));

      // Add title row
      const titleRow = Array(19).fill(null);
      titleRow[0] = "PAYROLL FOR THE PERIOD " + selectedPayPeriod;
      payrollData.push(titleRow);

      // Add header rows
      const headerRow1 = Array(19).fill(null);
      headerRow1[5] = 8.06;
      headerRow1[6] = "PRO RATED";
      headerRow1[7] = "SPCL";
      headerRow1[8] = "REGULAR";
      headerRow1[9] = "service";
      headerRow1[10] = "OVERTIME";
      headerRow1[11] = "TOTAL";
      headerRow1[16] = "NET PAY";
      headerRow1[17] = "SIGNATURE";
      payrollData.push(headerRow1);

      const headerRow2 = [
        "Name of Employee",
        "No. of",
        "HOURLY",
        "Total",
        "SPCL",
        "REG. NIGHT",
        "13TH MONTH",
        "HOLIDAY",
        "HOLIDAY",
        "incentive",
        "DEC 1-15",
        "AMOUNT",
        "",
        "SSS",
        "PHIC",
        "HDMF",
        "",
        "",
        "",
      ];
      payrollData.push(headerRow2);

      const headerRow3 = [
        "",
        "REG. HOURS",
        "Rate",
        "Regular Wage",
        "HOLIDAY",
        "DIFF",
        "PAY",
        "104.81",
        "161.25",
        "leave",
        "",
        "",
        "hdmf",
        "",
        "",
        "",
        "",
        "",
        "",
      ];
      payrollData.push(headerRow3);

      const headerRow4 = Array(19).fill(null);
      headerRow4[12] = "loan";
      payrollData.push(headerRow4);

      // Add employee data
      filteredPayrolls.forEach((payroll) => {
        const row = Array(19).fill(null);
        row[0] = payroll.name;
        row[1] = payroll.numberOfRegularHours;
        row[2] = payroll.hourlyRate;
        row[3] = payroll.totalRegularWage;
        row[5] = nightDifferentialAmount(payroll);
        row[6] = payroll.prorated13thMonthPay;
        row[7] = specialHolidayAmount(payroll);
        row[8] = regularHolidayAmount(payroll);
        row[9] = payroll.serviceIncentiveLeave;
        row[10] = overtimeAmount(payroll);
        row[11] = payroll.totalAmount;
        row[13] = payroll.sss;
        row[14] = payroll.phic;
        row[15] = payroll.hdmf;
        row[16] = payroll.netPay;
        payrollData.push(row);
      });

      // Add total row
      const totalRow = Array(19).fill(null);
      totalRow[18] = { f: `=SUM(Q7:Q${6 + filteredPayrolls.length})` };
      payrollData.push(totalRow);

      const ws = XLSX.utils.aoa_to_sheet(payrollData);

      // Apply styling and formatting
      ws["!merges"] = [
        { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } }, // Title merge
      ];

      ws["!cols"] = [
        { wch: 20 }, // A - Name
        { wch: 10 }, // B - No. of Reg Hours
        { wch: 10 }, // C - Hourly Rate
        { wch: 15 }, // D - Total Regular Wage
        { wch: 10 }, // E - SPCL HOLIDAY
        { wch: 10 }, // F - REG. NIGHT DIFF
        { wch: 12 }, // G - 13TH MONTH PAY
        { wch: 12 }, // H - HOLIDAY 104.81
        { wch: 12 }, // I - HOLIDAY 161.25
        { wch: 12 }, // J - service incentive leave
        { wch: 12 }, // K - OVERTIME DEC 1-15
        { wch: 12 }, // L - TOTAL AMOUNT
        { wch: 10 }, // M - hdmf loan
        { wch: 10 }, // N - SSS
        { wch: 10 }, // O - PHIC
        { wch: 10 }, // P - HDMF
        { wch: 12 }, // Q - NET PAY
        { wch: 15 }, // R - SIGNATURE
        { wch: 10 }, // S - (total)
      ];

      // Format numeric columns
      const numericCols = [
        "B",
        "C",
        "D",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "N",
        "O",
        "P",
        "Q",
      ];
      const currencyFormat = "₱#,##0.00";
      const lastRow = payrollData.length;

      numericCols.forEach((col) => {
        for (let i = 5; i <= lastRow; i++) {
          const cellRef = col + i;
          if (!ws[cellRef]) continue;

          if (col === "B" || col === "C") {
            ws[cellRef].z = "#,##0.00";
          } else {
            ws[cellRef].z = currencyFormat;
          }
        }
      });

      // Format title
      const titleCell = "A2";
      if (ws[titleCell]) {
        ws[titleCell].s = { font: { bold: true, sz: 14 } };
      }

      // Format headers
      for (let r = 2; r <= 4; r++) {
        for (let c = 0; c < 19; c++) {
          const cellRef = XLSX.utils.encode_cell({ r, c });
          if (ws[cellRef]) {
            ws[cellRef].s = { font: { bold: true } };
          }
        }
      }

      // Sheet2 - Summary Sheet (matching the example format)
      const summaryData = [];

      // Add empty rows
      summaryData.push(Array(4).fill(null));
      summaryData.push(Array(4).fill(null));
      summaryData.push(Array(4).fill(null));
      summaryData.push(Array(4).fill(null));

      // Add employee summary data
      filteredPayrolls.forEach((payroll) => {
        const row = Array(4).fill(null);
        row[0] = payroll.name.toLowerCase();
        row[2] = payroll.hourlyRate;
        row[3] = {
          f: `+C${summaryData.length + 1}*B${summaryData.length + 1}`,
        };
        summaryData.push(row);
      });

      // Add total row
      const summaryTotalRow = Array(4).fill(null);
      summaryTotalRow[3] = { f: `=SUM(D5:D${4 + filteredPayrolls.length})` };
      summaryData.push(summaryTotalRow);

      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);

      // Sheet3 - Empty sheet
      const emptyWs = XLSX.utils.aoa_to_sheet([[]]);

      // Add sheets to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.utils.book_append_sheet(wb, summaryWs, "Sheet2");
      XLSX.utils.book_append_sheet(wb, emptyWs, "Sheet3");

      const periodFormatted =
        selectedPayPeriod === "All Pay Periods"
          ? "All_Periods"
          : selectedPayPeriod.replace(/\s+/g, "_").replace(/,/g, "");

      const fileName = "PAYROLL_" + periodFormatted + ".xlsx";

      XLSX.writeFile(wb, fileName);

      toast.success("Payroll Excel Generated", {
        description:
          "Successfully generated payroll Excel for " +
          filteredPayrolls.length +
          " employees.",
      });
    } catch (error) {
      console.error("Error generating payroll Excel:", error);
      toast.error("Failed to Generate Payroll Excel", {
        description:
          "An error occurred while generating the payroll Excel file.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <button
      onClick={generatePayrollExcel}
      disabled={isGenerating}
      className={`cursor-pointer bg-white hover:bg-blue-50 text-gray-800 px-3 py-2 rounded-md text-sm flex items-center 
      transition-all duration-200 border border-blue-200 w-full md:w-auto justify-center
      ${isGenerating ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {isGenerating ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2" />
          Generating...
        </>
      ) : (
        <>
          <Download size={16} className="mr-2" />
          Export Payroll Excel
        </>
      )}
    </button>
  );
}

export default PayrollExcelGenerator;
