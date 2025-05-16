import { useState, useEffect } from "react";
import { Users, Calendar, Calculator, DollarSign, Loader } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

function ThirteenthMonthCalculator({ onCalculate, employeeData }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [calculation, setCalculation] = useState(null);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await axios.get("http://localhost:5000/api/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Failed to load employees");
      }
    }

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employeeData) {
      setSelectedEmployee(employeeData._id);
    }
  }, [employeeData]);

  async function calculateThirteenthMonth() {
    if (!selectedEmployee) {
      toast.warning("Please select an employee");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/payrolls/thirteenth-month/" +
          selectedEmployee +
          "/" +
          selectedYear
      );

      const { totalBasicSalary, thirteenthMonthPay, payrollRecordsCount } =
        response.data.data;

      setCalculation({
        totalBasicSalary,
        thirteenthMonthPay,
        monthsWorked: payrollRecordsCount / 2,
      });

      toast.success("Calculation complete");
    } catch (error) {
      console.error("Error calculating 13th month pay:", error);
      toast.error("Calculation failed", {
        description: error.response?.data?.message || "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setSelectedEmployee("");
    setSelectedYear(new Date().getFullYear());
    setCalculation(null);
  }

  function useCalculatedAmount() {
    if (calculation?.thirteenthMonthPay) {
      onCalculate(calculation.thirteenthMonthPay);
    }
  }

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    const year = currentYear - 5 + i;
    return { value: year, label: year.toString() };
  });

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white p-4 rounded-lg">
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
          <div className="flex items-center mb-3">
            <Users className="text-blue-600 mr-2" size={18} />
            <h3 className="text-md font-semibold text-blue-800">
              Employee Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!employeeData ? (
              <div className="space-y-2">
                <label
                  htmlFor="employee"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Employee
                </label>
                <select
                  id="employee"
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  disabled={isLoading}
                >
                  <option value="">Select an employee</option>
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {`${employee.lastName}, ${employee.firstName}`} (
                      {employee.position})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Employee
                </label>
                <div className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm bg-blue-50">
                  {`${employeeData.lastName}, ${employeeData.firstName}`}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700"
              >
                Year
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                disabled={isLoading}
              >
                {yearOptions.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={resetForm}
            className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
            disabled={isLoading}
          >
            Reset
          </button>
          <button
            onClick={calculateThirteenthMonth}
            className="cursor-pointer px-6 py-2 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm flex items-center"
            disabled={isLoading || !selectedEmployee}
          >
            {isLoading ? (
              <Loader size={16} className="mr-2 animate-spin" />
            ) : (
              <Calculator size={16} className="mr-2" />
            )}
            {isLoading ? "Calculating..." : "Calculate 13th Month Pay"}
          </button>
        </div>

        {calculation && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200 animate-fade-in">
            <div className="flex items-center mb-3">
              <DollarSign className="text-blue-700 mr-2" size={18} />
              <h3 className="text-md font-semibold text-blue-800">
                Calculation Results
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Total Basic Salary (₱)
                </label>
                <div className="w-full rounded-md border border-blue-300 px-3 py-2 text-sm bg-white font-medium text-blue-700">
                  {calculation.totalBasicSalary.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-gray-500">
                  (Based on {calculation.monthsWorked} months worked)
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  13th Month Pay (₱)
                </label>
                <div className="w-full rounded-md border border-blue-300 px-3 py-3 text-base bg-white font-bold text-blue-800">
                  {calculation.thirteenthMonthPay.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-gray-500">
                  (Total Basic Salary ÷ 12)
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={useCalculatedAmount}
                className="cursor-pointer px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 shadow-sm"
              >
                Use This Amount
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-100 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> In the Philippines, 13th month pay must
                be paid on or before December 24th. This amount is tax-exempt up
                to ₱90,000.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ThirteenthMonthCalculator;
