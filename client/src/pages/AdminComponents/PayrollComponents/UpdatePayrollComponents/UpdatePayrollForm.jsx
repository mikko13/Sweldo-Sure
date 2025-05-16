import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  CreditCard,
  Clock,
  DollarSign,
  PlusCircle,
  MinusCircle,
  Loader,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { getStatusColor, calculateDerivedValues } from "./Utils";
import PayPeriodComponent from "../PayPeriod";
import ThirteenthMonthCalculator from "./ThirteenthMonthCalculator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function UpdatePayrollForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    numberOfRegularHours: 8,
    hourlyRate: 80.625,
    regularNightDifferential: 0,
    prorated13thMonthPay: 0,
    specialHoliday: 0,
    regularHoliday: 0,
    serviceIncentiveLeave: 0,
    overtime: 0,
    hdmf: 0,
    hdmfLoans: 0,
    sss: 0,
    phic: 0,
    status: "Pending",
    payPeriod: "",
  });

  useEffect(() => {
    async function fetchPayrollData() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/payrolls/" + id
        );
        setFormData(response.data);
      } catch (err) {
        console.error("Error fetching payroll data:", err);
        setError("Failed to load payroll data");
        toast.error("Failed to load payroll data", {
          description: "Please try refreshing the page.",
        });
      }
    }

    async function fetchEmployees() {
      try {
        const response = await axios.get("http://localhost:5000/api/employees");
        setEmployees(response.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees");
        toast.error("Failed to load employees", {
          description: "Please try refreshing the page.",
        });
      }
    }

    fetchPayrollData();
    fetchEmployees();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    const parsedValue = value;

    if (name !== "name" && name !== "status" && name !== "employeeId") {
      parsedValue = value === "" ? null : parseFloat(value);
    }

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  }

  function handleEmployeeChange(e) {
    const selectedEmployeeId = e.target.value;
    const selectedEmployee = employees.find(
      (emp) => emp._id === selectedEmployeeId
    );

    if (selectedEmployee) {
      setFormData((prev) => ({
        ...prev,
        employeeId: selectedEmployeeId,
        name: selectedEmployee.lastName + ", " + selectedEmployee.firstName,
        hourlyRate: parseFloat(selectedEmployee.rate) || 80.625,
      }));
    }
  }

  const { totalRegularWage, totalAmount, netPay } =
    calculateDerivedValues(formData);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.put(
        "http://localhost:5000/api/payrolls/" + id,
        formData
      );

      toast.success("Payroll updated successfully!", {
        description: "Payroll for " + formData.name + " has been updated.",
        duration: 3000,
      });

      setTimeout(() => {
        navigate("/admin-payroll", {
          state: { message: "Payroll updated successfully!", type: "success" },
        });
      }, 3000);
    } catch (err) {
      console.error("Error updating payroll:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to update payroll");
        toast.error("Failed to update payroll", {
          description:
            err.response.data.message || "An unexpected error occurred.",
        });
      } else {
        setError("An unexpected error occurred. Please try again.");
        toast.error("Error", {
          description: "An unexpected error occurred. Please try again.",
        });
      }
      setIsSubmitting(false);
    }
  }

  function handleSet13thMonthPay(value) {
    setFormData((prev) => ({
      ...prev,
      prorated13thMonthPay: value,
    }));
    setShowCalculatorModal(false);
    toast.success("13th Month Pay calculated", {
      description:
        "Amount of ₱" + value.toFixed(2) + " has been added to the form.",
    });
  }

  function handleOpenCalculator() {
    const currentMonth = new Date().getMonth();

    if (currentMonth !== 11) {
      setShowAlertDialog(true);
    } else {
      setShowCalculatorModal(true);
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="h-full w-full p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/admin-payroll")}
              className="mr-3 p-2 rounded-full hover:bg-blue-100 transition-colors text-blue-600 cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-blue-800">
              Edit Payroll Record
            </h2>
          </div>
          <div className="flex items-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                formData.status
              )}`}
            >
              {formData.status}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <PayPeriodComponent
          payPeriod={formData.payPeriod}
          setPayPeriod={(period) =>
            setFormData((prev) => ({ ...prev, payPeriod: period }))
          }
        />

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="bg-white p-4 md:p-5 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center mb-4">
              <CreditCard className="text-blue-600 mr-2" size={18} />
              <h3 className="text-md font-semibold text-blue-800">
                Employee Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="employeeId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Employee
                </label>
                <select
                  id="employeeId"
                  name="employeeId"
                  required
                  value={formData.employeeId}
                  onChange={handleEmployeeChange}
                  className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="">Select an employee</option>
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {`${employee.lastName}, ${employee.firstName}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processed">Processed</option>
                </select>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 md:p-5 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center mb-4">
              <Clock className="text-blue-600 mr-2" size={18} />
              <h3 className="text-md font-semibold text-blue-800">
                Regular Work
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="numberOfRegularHours"
                  className="block text-sm font-medium text-gray-700"
                >
                  Regular Hours
                </label>
                <input
                  type="number"
                  id="numberOfRegularHours"
                  name="numberOfRegularHours"
                  min="0"
                  step="0.1"
                  value={formData.numberOfRegularHours}
                  onChange={handleChange}
                  className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="hourlyRate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Hourly Rate (₱)
                </label>
                <input
                  type="number"
                  id="hourlyRate"
                  name="hourlyRate"
                  min="0"
                  step="0.001"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="totalRegularWage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Total Regular Wage (₱)
                </label>
                <input
                  type="number"
                  id="totalRegularWage"
                  name="totalRegularWage"
                  value={totalRegularWage.toFixed(2)}
                  readOnly
                  className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm bg-blue-50 font-medium text-blue-700"
                />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 md:p-5 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center mb-4">
              <PlusCircle className="text-green-600 mr-2" size={18} />
              <h3 className="text-md font-semibold text-green-800">
                Additional Pay
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="regularNightDifferential"
                  className="block text-sm font-medium text-gray-700"
                >
                  Night Differential (₱) (8.06)
                </label>
                <input
                  type="number"
                  id="regularNightDifferential"
                  name="regularNightDifferential"
                  min="0"
                  step="0.01"
                  value={formData.regularNightDifferential}
                  onChange={handleChange}
                  className="w-full rounded-md border border-green-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="prorated13thMonthPay"
                  className="block text-sm font-medium text-gray-700"
                >
                  13th Month Pay (₱)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    id="prorated13thMonthPay"
                    name="prorated13thMonthPay"
                    min="0"
                    step="0.01"
                    value={formData.prorated13thMonthPay}
                    onChange={handleChange}
                    className="w-full rounded-md border border-green-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  />
                  <button
                    type="button"
                    className="cursor-pointer px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs rounded border border-green-300"
                    onClick={handleOpenCalculator}
                  >
                    Calculate
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="overtime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Overtime (₱) (100.78)
                </label>
                <input
                  type="number"
                  id="overtime"
                  name="overtime"
                  min="0"
                  step="0"
                  value={formData.overtime}
                  onChange={handleChange}
                  className="w-full rounded-md border border-green-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="specialHoliday"
                  className="block text-sm font-medium text-gray-700"
                >
                  Special Holiday (₱) (104.81)
                </label>
                <input
                  type="number"
                  id="specialHoliday"
                  name="specialHoliday"
                  min="0"
                  step="0.01"
                  value={formData.specialHoliday}
                  onChange={handleChange}
                  className="w-full rounded-md border border-green-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="regularHoliday"
                  className="block text-sm font-medium text-gray-700"
                >
                  Regular Holiday (₱) (161.25)
                </label>
                <input
                  type="number"
                  id="regularHoliday"
                  name="regularHoliday"
                  min="0"
                  step="0.5"
                  value={formData.regularHoliday}
                  onChange={handleChange}
                  className="w-full rounded-md border border-green-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="serviceIncentiveLeave"
                  className="block text-sm font-medium text-gray-700"
                >
                  Service Incentive Leave (₱)
                </label>
                <input
                  type="number"
                  id="serviceIncentiveLeave"
                  name="serviceIncentiveLeave"
                  min="0"
                  step="0.01"
                  value={formData.serviceIncentiveLeave}
                  onChange={handleChange}
                  className="w-full rounded-md border border-green-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 md:p-5 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center mb-4">
              <MinusCircle className="text-red-600 mr-2" size={18} />
              <h3 className="text-md font-semibold text-red-800">Deductions</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="hdmf"
                    className="block text-sm font-medium text-gray-700"
                  >
                    HDMF (₱)
                  </label>
                  <input
                    type="number"
                    id="hdmf"
                    name="hdmf"
                    min="0"
                    step="0.01"
                    value={formData.hdmf}
                    onChange={handleChange}
                    className="w-full rounded-md border border-red-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="hdmfLoans"
                    className="block text-sm font-medium text-gray-700"
                  >
                    HDMF Loans (₱)
                  </label>
                  <input
                    type="number"
                    id="hdmfLoans"
                    name="hdmfLoans"
                    min="0"
                    step="0.01"
                    value={formData.hdmfLoans}
                    onChange={handleChange}
                    className="w-full rounded-md border border-red-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="sss"
                    className="block text-sm font-medium text-gray-700"
                  >
                    SSS (₱)
                  </label>
                  <input
                    type="number"
                    id="sss"
                    name="sss"
                    min="0"
                    step="0.01"
                    value={formData.sss}
                    onChange={handleChange}
                    className="w-full rounded-md border border-red-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phic"
                    className="block text-sm font-medium text-gray-700"
                  >
                    PHIC (₱)
                  </label>
                  <input
                    type="number"
                    id="phic"
                    name="phic"
                    min="0"
                    step="0.01"
                    value={formData.phic}
                    onChange={handleChange}
                    className="w-full rounded-md border border-red-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 md:p-5 rounded-lg shadow-sm border border-blue-200">
            <div className="flex items-center mb-4">
              <DollarSign className="text-blue-700 mr-2" size={18} />
              <h3 className="text-md font-semibold text-blue-800">
                Payment Summary
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="totalAmount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Total Amount (₱)
                </label>
                <input
                  type="text"
                  id="totalAmount"
                  name="totalAmount"
                  value={totalAmount.toFixed(2)}
                  readOnly
                  className="w-full rounded-md border border-blue-300 px-3 py-2 text-sm bg-white font-medium text-blue-700"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="netPay"
                  className="block text-sm font-medium text-gray-700"
                >
                  Net Pay (₱)
                </label>
                <input
                  type="text"
                  id="netPay"
                  name="netPay"
                  value={netPay.toFixed(2)}
                  readOnly
                  className="w-full rounded-md border border-blue-300 px-3 py-3 text-base bg-white font-bold text-blue-800"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4 md:mt-6">
            <button
              type="button"
              onClick={() => navigate("/admin-payroll")}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm flex items-center cursor-pointer"
            >
              {isSubmitting ? (
                <Loader size={16} className="mr-2 animate-spin" />
              ) : (
                <Save size={16} className="mr-2" />
              )}
              {isSubmitting ? "Saving..." : "Save Payroll"}
            </button>
          </div>
        </form>
      </div>
      <Toaster position="bottom-left" richColors />

      {/* Alert Dialog for non-December 13th month calculation */}
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-amber-600">
              <AlertTriangle className="mr-2" size={20} />
              Early 13th Month Calculation
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are calculating 13th Month Pay outside of December. Note that
              this will be a prorated calculation based on current data and may
              not reflect the final amount that should be paid in December.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowAlertDialog(false);
                setShowCalculatorModal(true);
              }}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 13th Month Calculator Modal */}
      {showCalculatorModal && (
        <div className="fixed inset-0 z-50 flex backdrop-blur-sm transition-opacity items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-blue-800">
                13th Month Pay Calculator
              </h3>
              <button
                onClick={() => setShowCalculatorModal(false)}
                className="cursor-pointer text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                &times;
              </button>
            </div>

            <div className="p-4">
              <ThirteenthMonthCalculator
                onCalculate={handleSet13thMonthPay}
                employeeData={employees.find(
                  (emp) => emp._id === formData.employeeId
                )}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdatePayrollForm;
