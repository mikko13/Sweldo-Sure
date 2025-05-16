import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import {
  Activity,
  CalendarIcon,
  TrendingUp,
  DollarSign,
  Users,
} from "lucide-react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

function PayrollSummaryChart() {
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("6months");
  const [chartType, setChartType] = useState("bar");
  const [payPeriods, setPayPeriods] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("all");

  const COLORS = {
    regularWage: "#3b82f6",
    nightDifferential: "#8b5cf6",
    holiday: "#ec4899",
    overtime: "#f97316",
    deductions: "#ef4444",
    netPay: "#10b981",
  };

  const PIE_COLORS = [
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f97316",
    "#ef4444",
    "#10b981",
  ];

  useEffect(() => {
    async function fetchPayrollData() {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/payrolls");
        const data = response.data;

        const periods = [...new Set(data.map((item) => item.payPeriod))].sort(
          (a, b) => {
            const [aMonth, aDateRange, aYear] = a.split(" ");
            const [bMonth, bDateRange, bYear] = b.split(" ");

            if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);

            const months = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];
            const aMonthIndex = months.indexOf(aMonth);
            const bMonthIndex = months.indexOf(bMonth);
            if (aMonthIndex !== bMonthIndex) return aMonthIndex - bMonthIndex;

            return aDateRange.includes("1-15") ? -1 : 1;
          }
        );

        setPayPeriods(periods);

        const processedData = processPayrollData(data, timeframe, periods);
        setPayrollData(processedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching payroll data:", err);
        setError("Failed to load payroll data. Please try again later.");
        toast.error("Failed to load payroll data");
      } finally {
        setLoading(false);
      }
    }

    fetchPayrollData();
  }, [timeframe]);

  function processPayrollData(data, timeRange, periods) {
    if (!data || data.length === 0) {
      return [];
    }

    const periodCount = timeRange === "3months" ? 3 : 6;
    const relevantPeriods = periods.slice(-periodCount);

    const periodData = {};
    relevantPeriods.forEach((period) => {
      periodData[period] = {
        period,
        totalRegularWage: 0,
        totalNightDifferential: 0,
        totalHoliday: 0,
        totalOvertime: 0,
        total13thMonth: 0,
        totalDeductions: 0,
        totalNetPay: 0,
        employeeCount: 0,
        averageNetPay: 0,
      };
    });

    data.forEach((payroll) => {
      if (relevantPeriods.includes(payroll.payPeriod)) {
        const periodEntry = periodData[payroll.payPeriod];

        const nightDifferentialAmount = payroll.regularNightDifferential * 8.06;
        const regularHolidayAmount = payroll.regularHoliday * 161.25;
        const specialHolidayAmount = payroll.specialHoliday * 104.81;
        const overtimeAmount = payroll.overtime * 100.78;

        periodEntry.totalRegularWage += payroll.totalRegularWage || 0;
        periodEntry.totalNightDifferential += nightDifferentialAmount || 0;
        periodEntry.totalHoliday +=
          regularHolidayAmount + specialHolidayAmount || 0;
        periodEntry.totalOvertime += overtimeAmount || 0;
        periodEntry.total13thMonth += payroll.prorated13thMonthPay || 0;

        const deductions =
          (payroll.hdmf || 0) +
          (payroll.hdmfLoans || 0) +
          (payroll.sss || 0) +
          (payroll.phic || 0);

        periodEntry.totalDeductions += deductions;
        periodEntry.totalNetPay += payroll.netPay || 0;
        periodEntry.employeeCount += 1;
      }
    });

    return Object.values(periodData).map((item) => {
      item.averageNetPay = item.employeeCount
        ? Math.round(item.totalNetPay / item.employeeCount)
        : 0;

      return {
        ...item,
        totalRegularWage: Math.round(item.totalRegularWage),
        totalNightDifferential: Math.round(item.totalNightDifferential),
        totalHoliday: Math.round(item.totalHoliday),
        totalOvertime: Math.round(item.totalOvertime),
        total13thMonth: Math.round(item.total13thMonth),
        totalDeductions: Math.round(item.totalDeductions),
        totalNetPay: Math.round(item.totalNetPay),
      };
    });
  }

  const summaryData = {
    totalRegularWage: payrollData.reduce(
      (sum, item) => sum + item.totalRegularWage,
      0
    ),
    totalNightDifferential: payrollData.reduce(
      (sum, item) => sum + item.totalNightDifferential,
      0
    ),
    totalHoliday: payrollData.reduce((sum, item) => sum + item.totalHoliday, 0),
    totalOvertime: payrollData.reduce(
      (sum, item) => sum + item.totalOvertime,
      0
    ),
    total13thMonth: payrollData.reduce(
      (sum, item) => sum + item.total13thMonth,
      0
    ),
    totalDeductions: payrollData.reduce(
      (sum, item) => sum + item.totalDeductions,
      0
    ),
    totalNetPay: payrollData.reduce((sum, item) => sum + item.totalNetPay, 0),
    totalEmployees: payrollData.reduce(
      (max, item) => Math.max(max, item.employeeCount),
      0
    ),
  };

  const pieData = [
    { name: "Regular Wages", value: summaryData.totalRegularWage },
    { name: "Night Differential", value: summaryData.totalNightDifferential },
    { name: "Holiday Pay", value: summaryData.totalHoliday },
    { name: "Overtime", value: summaryData.totalOvertime },
    { name: "13th Month", value: summaryData.total13thMonth },
  ];

  function formatCurrency(value) {
    return "₱" + value.toLocaleString();
  }

  function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white shadow-md rounded-md border border-gray-200">
          <p className="font-medium text-gray-800">{label}</p>
          <div className="mt-2">
            {payload.map((entry, index) => (
              <p
                key={`item-${index}`}
                style={{ color: entry.color }}
                className="text-sm"
              >
                {entry.name}: {formatCurrency(entry.value)}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  }

  function formatPeriodLabel(period) {
    if (!period) return "";
    const [month, dateRange] = period.split(" ");
    return month.substring(0, 3) + " " + dateRange.split(",")[0];
  }

  function renderChart() {
    if (loading) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Activity
              size={32}
              className="mx-auto animate-pulse text-blue-300 mb-2"
            />
            <p>Loading payroll data...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <button
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              onClick={() => setTimeframe(timeframe)}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (payrollData.length === 0) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-gray-500">
            <CalendarIcon size={32} className="mx-auto text-blue-200 mb-2" />
            <p>No payroll data available for this period</p>
          </div>
        </div>
      );
    }

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={payrollData}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
            <XAxis
              dataKey="period"
              tickFormatter={formatPeriodLabel}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis
              tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 10 }} />

            {selectedMetric === "all" || selectedMetric === "regularWage" ? (
              <Bar
                dataKey="totalRegularWage"
                name="Regular Wages"
                fill={COLORS.regularWage}
                stackId={selectedMetric !== "all" ? "a" : undefined}
              />
            ) : null}

            {selectedMetric === "all" ||
            selectedMetric === "nightDifferential" ? (
              <Bar
                dataKey="totalNightDifferential"
                name="Night Differential"
                fill={COLORS.nightDifferential}
                stackId={selectedMetric !== "all" ? "a" : undefined}
              />
            ) : null}

            {selectedMetric === "all" || selectedMetric === "holiday" ? (
              <Bar
                dataKey="totalHoliday"
                name="Holiday Pay"
                fill={COLORS.holiday}
                stackId={selectedMetric !== "all" ? "a" : undefined}
              />
            ) : null}

            {selectedMetric === "all" || selectedMetric === "overtime" ? (
              <Bar
                dataKey="totalOvertime"
                name="Overtime"
                fill={COLORS.overtime}
                stackId={selectedMetric !== "all" ? "a" : undefined}
              />
            ) : null}

            {selectedMetric === "all" || selectedMetric === "deductions" ? (
              <Bar
                dataKey="totalDeductions"
                name="Deductions"
                fill={COLORS.deductions}
              />
            ) : null}

            {selectedMetric === "all" || selectedMetric === "netPay" ? (
              <Bar dataKey="totalNetPay" name="Net Pay" fill={COLORS.netPay} />
            ) : null}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={payrollData}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
            <XAxis
              dataKey="period"
              tickFormatter={formatPeriodLabel}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis
              tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 10 }} />

            {selectedMetric === "all" || selectedMetric === "regularWage" ? (
              <Line
                type="monotone"
                dataKey="totalRegularWage"
                name="Regular Wages"
                stroke={COLORS.regularWage}
                dot={{ stroke: COLORS.regularWage, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            ) : null}

            {selectedMetric === "all" ||
            selectedMetric === "nightDifferential" ? (
              <Line
                type="monotone"
                dataKey="totalNightDifferential"
                name="Night Differential"
                stroke={COLORS.nightDifferential}
                dot={{ stroke: COLORS.nightDifferential, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            ) : null}

            {selectedMetric === "all" || selectedMetric === "holiday" ? (
              <Line
                type="monotone"
                dataKey="totalHoliday"
                name="Holiday Pay"
                stroke={COLORS.holiday}
                dot={{ stroke: COLORS.holiday, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            ) : null}

            {selectedMetric === "all" || selectedMetric === "overtime" ? (
              <Line
                type="monotone"
                dataKey="totalOvertime"
                name="Overtime"
                stroke={COLORS.overtime}
                dot={{ stroke: COLORS.overtime, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            ) : null}

            {selectedMetric === "all" || selectedMetric === "deductions" ? (
              <Line
                type="monotone"
                dataKey="totalDeductions"
                name="Deductions"
                stroke={COLORS.deductions}
                dot={{ stroke: COLORS.deductions, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            ) : null}

            {selectedMetric === "all" || selectedMetric === "netPay" ? (
              <Line
                type="monotone"
                dataKey="totalNetPay"
                name="Net Pay"
                stroke={COLORS.netPay}
                dot={{ stroke: COLORS.netPay, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                strokeWidth={2.5}
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "pie") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
              labelLine={{ stroke: "#718096", strokeWidth: 0.5 }}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                />
              ))}
              <Label
                value="Payroll Breakdown"
                position="center"
                fill="#2D3748"
                fontSize={14}
              />
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return null;
  }

  function renderMetricsCards() {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-blue-50">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">Total Net Pay</p>
            <TrendingUp size={16} className="text-blue-600" />
          </div>
          <p className="font-medium text-blue-800 text-lg mt-1">
            ₱{summaryData.totalNetPay.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {timeframe === "3months" ? "Past 3 Months" : "Past 6 Months"}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">Avg. Net Pay per Employee</p>
            <DollarSign size={16} className="text-green-600" />
          </div>
          <p className="font-medium text-green-800 text-lg mt-1">
            ₱
            {Math.round(
              summaryData.totalNetPay / summaryData.totalEmployees
            ).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">Per Pay Period</p>
        </div>

        <div className="bg-indigo-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">Total Employees</p>
            <Users size={16} className="text-indigo-600" />
          </div>
          <p className="font-medium text-indigo-800 text-lg mt-1">
            {summaryData.totalEmployees.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">Latest Pay Period</p>
        </div>

        <div className="bg-red-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">Total Deductions</p>
            <TrendingUp size={16} className="text-red-600" />
          </div>
          <p className="font-medium text-red-800 text-lg mt-1">
            ₱{summaryData.totalDeductions.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {(
              (summaryData.totalDeductions /
                (summaryData.totalNetPay + summaryData.totalDeductions)) *
              100
            ).toFixed(1)}
            % of Gross Pay
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-white shadow-sm border border-blue-100 h-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-lg font-medium text-blue-800">
            Payroll Summary
          </CardTitle>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Select Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="regularWage">Regular Wages</SelectItem>
                <SelectItem value="nightDifferential">
                  Night Differential
                </SelectItem>
                <SelectItem value="holiday">Holiday Pay</SelectItem>
                <SelectItem value="overtime">Overtime</SelectItem>
                <SelectItem value="deductions">Deductions</SelectItem>
                <SelectItem value="netPay">Net Pay</SelectItem>
              </SelectContent>
            </Select>

            <Tabs
              value={chartType}
              onValueChange={setChartType}
              className="w-auto"
            >
              <TabsList className="grid w-full sm:w-[180px] grid-cols-3">
                <TabsTrigger value="bar">Bar</TabsTrigger>
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="pie">Pie</TabsTrigger>
              </TabsList>
            </Tabs>

            <Tabs
              value={timeframe}
              onValueChange={setTimeframe}
              className="w-auto"
            >
              <TabsList className="grid w-full sm:w-[140px] grid-cols-2">
                <TabsTrigger value="3months">3 Months</TabsTrigger>
                <TabsTrigger value="6months">6 Months</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-64 pt-2">{renderChart()}</div>

        {!loading && !error && payrollData.length > 0 && renderMetricsCards()}
      </CardContent>
    </Card>
  );
}

export default PayrollSummaryChart;
