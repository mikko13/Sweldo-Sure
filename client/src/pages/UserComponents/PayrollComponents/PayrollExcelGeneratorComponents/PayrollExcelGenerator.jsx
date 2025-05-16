import React, { useState } from "react";
import { Table, Download } from "lucide-react";
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

      const detailedPayrollData = [];

      detailedPayrollData.push(Array(17).fill(null));
      detailedPayrollData[0][7] = "PAYROLL FOR THE PERIOD " + selectedPayPeriod;

      const headers = [
        "Name of Employee",
        "No. of REG. HOURS",
        "HOURLY Rate",
        "Total Regular Wage",
        "REG. NIGHT DIFF",
        "PRO RATED 13TH MONTH PAY",
        "SPCL HOLIDAY 104.81",
        "REGULAR HOLIDAY 161.25",
        "service incentive leave",
        "OVERTIME DEC 1-15",
        "TOTAL AMOUNT",
        "hdmf loan",
        "SSS",
        "PHIC",
        "HDMF",
        "NET PAY",
      ];

      detailedPayrollData.push(Array(17).fill(null));
      headers.forEach((header, index) => {
        detailedPayrollData[1][index] = header;
      });

      filteredPayrolls.forEach((payroll) => {
        const row = [
          payroll.name,
          payroll.numberOfRegularHours,
          payroll.hourlyRate,
          payroll.totalRegularWage,
          nightDifferentialAmount(payroll),
          payroll.prorated13thMonthPay,
          specialHolidayAmount(payroll),
          regularHolidayAmount(payroll),
          payroll.serviceIncentiveLeave,
          overtimeAmount(payroll),
          payroll.totalAmount,
          payroll.hdmfLoans,
          payroll.sss,
          payroll.phic,
          payroll.hdmf,
          payroll.netPay,
        ];

        detailedPayrollData.push(row);
      });

      const ws = XLSX.utils.aoa_to_sheet(detailedPayrollData);

      ws["!merges"] = [{ s: { r: 0, c: 7 }, e: { r: 0, c: 9 } }];

      ws["!cols"] = [
        { wch: 20 },
        { wch: 12 },
        { wch: 12 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 15 },
      ];

      const numericCols = [
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
      ];
      const currencyFormat = "₱#,##0.00";
      const lastRow = detailedPayrollData.length;

      numericCols.forEach((col) => {
        for (let i = 3; i <= lastRow; i++) {
          const cellRef = col + i;
          if (!ws[cellRef]) continue;

          if (col === "B" || col === "C") {
            ws[cellRef].z = "#,##0.00";
          } else {
            ws[cellRef].z = currencyFormat;
          }
        }
      });

      for (let i = 0; i < headers.length; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: 1, c: i });
        if (!ws[cellRef]) continue;
        ws[cellRef].s = { font: { bold: true } };
      }

      const titleCell = XLSX.utils.encode_cell({ r: 0, c: 7 });
      if (ws[titleCell]) {
        ws[titleCell].s = { font: { bold: true, sz: 14 } };
      }

      const summaryData = [];

      summaryData.push(["COMPANY PAYROLL SUMMARY"]);
      summaryData.push(["Pay Period:", selectedPayPeriod]);
      summaryData.push(["Generated on:", new Date().toLocaleDateString()]);
      summaryData.push([]);

      const totalRegularWage = filteredPayrolls.reduce(
        (sum, p) => sum + p.totalRegularWage,
        0
      );
      const totalNightDiff = filteredPayrolls.reduce(
        (sum, p) => sum + nightDifferentialAmount(p),
        0
      );
      const total13thMonth = filteredPayrolls.reduce(
        (sum, p) => sum + p.prorated13thMonthPay,
        0
      );
      const totalSpecialHoliday = filteredPayrolls.reduce(
        (sum, p) => sum + specialHolidayAmount(p),
        0
      );
      const totalRegularHoliday = filteredPayrolls.reduce(
        (sum, p) => sum + regularHolidayAmount(p),
        0
      );
      const totalSIL = filteredPayrolls.reduce(
        (sum, p) => sum + p.serviceIncentiveLeave,
        0
      );
      const totalOvertime = filteredPayrolls.reduce(
        (sum, p) => sum + overtimeAmount(p),
        0
      );
      const totalGross = filteredPayrolls.reduce(
        (sum, p) => sum + p.totalAmount,
        0
      );
      const totalHDMF = filteredPayrolls.reduce((sum, p) => sum + p.hdmf, 0);
      const totalHDMFLoans = filteredPayrolls.reduce(
        (sum, p) => sum + p.hdmfLoans,
        0
      );
      const totalSSS = filteredPayrolls.reduce((sum, p) => sum + p.sss, 0);
      const totalPHIC = filteredPayrolls.reduce((sum, p) => sum + p.phic, 0);
      const totalDeductions = totalHDMF + totalHDMFLoans + totalSSS + totalPHIC;
      const totalNetPay = filteredPayrolls.reduce(
        (sum, p) => sum + p.netPay,
        0
      );

      summaryData.push(["SUMMARY OF EARNINGS"]);
      summaryData.push(["Regular Wages:", totalRegularWage]);
      summaryData.push(["Night Differential:", totalNightDiff]);
      summaryData.push(["13th Month Pay:", total13thMonth]);
      summaryData.push(["Special Holiday Pay:", totalSpecialHoliday]);
      summaryData.push(["Regular Holiday Pay:", totalRegularHoliday]);
      summaryData.push(["Service Incentive Leave:", totalSIL]);
      summaryData.push(["Overtime Pay:", totalOvertime]);
      summaryData.push(["GROSS PAY:", totalGross]);
      summaryData.push([]);

      summaryData.push(["SUMMARY OF DEDUCTIONS"]);
      summaryData.push(["HDMF:", totalHDMF]);
      summaryData.push(["HDMF Loans:", totalHDMFLoans]);
      summaryData.push(["SSS:", totalSSS]);
      summaryData.push(["PHIC:", totalPHIC]);
      summaryData.push(["TOTAL DEDUCTIONS:", totalDeductions]);
      summaryData.push([]);

      summaryData.push(["NET PAY TOTAL:", totalNetPay]);
      summaryData.push(["Number of Employees:", filteredPayrolls.length]);

      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);

      summaryWs["!cols"] = [{ wch: 25 }, { wch: 15 }];

      for (let i = 6; i <= 13; i++) {
        const cellRef = `B${i}`;
        if (summaryWs[cellRef]) {
          summaryWs[cellRef].z = currencyFormat;
        }
      }

      for (let i = 16; i <= 20; i++) {
        const cellRef = `B${i}`;
        if (summaryWs[cellRef]) {
          summaryWs[cellRef].z = currencyFormat;
        }
      }

      if (summaryWs["B22"]) {
        summaryWs["B22"].z = currencyFormat;
      }

      XLSX.utils.book_append_sheet(wb, ws, "Payroll Details");
      XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");

      const periodFormatted =
        selectedPayPeriod === "All Pay Periods"
          ? "All_Periods"
          : selectedPayPeriod.replace(/\s+/g, "_").replace(/,/g, "");

      const fileName = "Payroll_" + periodFormatted + ".xlsx";

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
