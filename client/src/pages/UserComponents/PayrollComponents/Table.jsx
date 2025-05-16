import React, { JSX, useMemo, useState, useEffect } from "react";
import { Edit, Eye, Trash, X } from "lucide-react";
import PaginationComponent from "./Pagination";
import axios from "axios";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function PayrollTable({
  payrolls,
  setPayrolls,
  getStatusColor,
  getStatusIcon,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  selectedPayPeriod,
}) {
  const navigate = useNavigate();
  const [payrollToDelete, setPayrollToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewPayroll, setViewPayroll] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const filteredPayrolls = useMemo(() => {
    if (selectedPayPeriod === "All Pay Periods") {
      return payrolls;
    }
    return payrolls.filter(
      (payroll) => payroll.payPeriod === selectedPayPeriod
    );
  }, [payrolls, selectedPayPeriod]);

  const displayedPayrolls = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPayrolls.slice(startIndex, endIndex);
  }, [filteredPayrolls, currentPage, itemsPerPage]);

  const totals = useMemo(() => {
    return filteredPayrolls.reduce(
      (acc, payroll) => {
        acc.numberOfRegularHours += payroll.numberOfRegularHours;
        acc.totalRegularWage += payroll.totalRegularWage;
        acc.nightDifferential += payroll.regularNightDifferential * 8.06;
        acc.prorated13thMonthPay += payroll.prorated13thMonthPay;
        acc.specialHoliday += payroll.specialHoliday * 104.81;
        acc.regularHoliday += payroll.regularHoliday * 161.25;
        acc.serviceIncentiveLeave += payroll.serviceIncentiveLeave;
        acc.overtime += payroll.overtime * 100.78;
        acc.totalAmount += payroll.totalAmount;
        acc.hdmf += payroll.hdmf;
        acc.hdmfLoans += payroll.hdmfLoans;
        acc.sss += payroll.sss;
        acc.phic += payroll.phic;
        acc.netPay += payroll.netPay;
        return acc;
      },
      {
        numberOfRegularHours: 0,
        totalRegularWage: 0,
        nightDifferential: 0,
        prorated13thMonthPay: 0,
        specialHoliday: 0,
        regularHoliday: 0,
        serviceIncentiveLeave: 0,
        overtime: 0,
        totalAmount: 0,
        hdmf: 0,
        hdmfLoans: 0,
        sss: 0,
        phic: 0,
        netPay: 0,
      }
    );
  }, [filteredPayrolls]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPayPeriod, setCurrentPage]);

  const nightDifferentialAmount = (payroll) =>
    payroll.regularNightDifferential * 8.06;

  const regularHolidayAmount = (payroll) => payroll.regularHoliday * 161.25;

  const specialHolidayAmount = (payroll) => payroll.specialHoliday * 104.81;

  const overtimeAmount = (payroll) => payroll.overtime * 100.78;

  const handleDeleteClick = (payroll) => {
    setPayrollToDelete(payroll);
    setIsDeleteDialogOpen(true);
  };

  const handleViewClick = (payroll) => {
    setViewPayroll(payroll);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (payroll) => {
    navigate("/UpdatePayroll/" + payroll._id || payroll.id, {
      state: { payroll },
    });
  };

  async function handleDeletePayroll() {
    if (!payrollToDelete) return;

    try {
      await axios.delete(
        "http://localhost:5000/api/payrolls/" + payrollToDelete._id ||
          payrollToDelete.id
      );

      const updatedPayroll = payrolls.filter(
        (emp) =>
          (emp._id || emp.id) !== (payrollToDelete._id || payrollToDelete.id)
      );
      setPayrolls(updatedPayroll);

      toast.success("Payroll Deleted", {
        description:
          "Payroll for " +
          payrollToDelete.name +
          " has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting payroll:", error);
      toast.error("Delete Failed", {
        description: "An error occurred while deleting the payroll.",
      });
    } finally {
      setPayrollToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="rounded-lg overflow-hidden shadow animate-fadeIn bg-white border border-blue-100">
        <div className="overflow-x-auto">
          {filteredPayrolls.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No payroll records found for the selected pay period:{" "}
              {selectedPayPeriod}
            </div>
          ) : (
            <table className="w-full relative">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-blue-100 bg-blue-50">
                  <th className="p-3 text-left font-medium">Employee</th>
                  <th className="p-3 text-left font-medium">Pay Period</th>
                  <th className="p-3 text-left font-medium">Regular Hours</th>
                  <th className="p-3 text-left font-medium">Hourly Rate</th>
                  <th className="p-3 text-left font-medium">
                    Total Regular Wage
                  </th>
                  <th className="p-3 text-left font-medium">
                    Night Differential
                  </th>
                  <th className="p-3 text-left font-medium">13th Month Pay</th>
                  <th className="p-3 text-left font-medium">Special Holiday</th>
                  <th className="p-3 text-left font-medium">Regular Holiday</th>
                  <th className="p-3 text-left font-medium">
                    Service Incentive Leave
                  </th>
                  <th className="p-3 text-left font-medium">Overtime</th>
                  <th className="p-3 text-left font-medium">Total Amount</th>
                  <th className="p-3 text-left font-medium">HDMF</th>
                  <th className="p-3 text-left font-medium">HDMF Loans</th>
                  <th className="p-3 text-left font-medium">SSS</th>
                  <th className="p-3 text-left font-medium">PHIC</th>
                  <th className="p-3 text-left font-medium">Net Pay</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium sticky right-0 bg-blue-50 z-10">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedPayrolls.map((payroll) => (
                  <tr
                    key={payroll.id}
                    className="border-b border-blue-50 hover:bg-blue-50 transition-all duration-200 animate-fadeIn"
                  >
                    <td className="p-3">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-800 font-medium">
                          {payroll.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {payroll.payPeriod}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {payroll.numberOfRegularHours}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      ₱{payroll.hourlyRate.toLocaleString()}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      ₱{payroll.totalRegularWage.toLocaleString()}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      ₱{nightDifferentialAmount(payroll).toLocaleString()}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      ₱{payroll.prorated13thMonthPay.toLocaleString()}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      ₱{specialHolidayAmount(payroll).toLocaleString()}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      ₱{regularHolidayAmount(payroll).toLocaleString()}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      ₱{payroll.serviceIncentiveLeave.toLocaleString()}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      ₱{overtimeAmount(payroll).toLocaleString()}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      ₱{payroll.totalAmount.toLocaleString()}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      ₱{payroll.hdmf.toLocaleString()}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      ₱{payroll.hdmfLoans.toLocaleString()}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      ₱{payroll.sss.toLocaleString()}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      ₱{payroll.phic.toLocaleString()}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      ₱{payroll.netPay.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full flex items-center w-fit ${getStatusColor(
                          payroll.status
                        )}`}
                      >
                        {getStatusIcon(payroll.status)}
                        {payroll.status}
                      </span>
                    </td>
                    <td className="p-3 sticky right-0 bg-white z-10">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-md text-gray-600 hover:text-blue-700 transition-all duration-200 cursor-pointer"
                          onClick={() => handleViewClick(payroll)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-md text-gray-600 hover:text-blue-700 transition-all duration-200 cursor-pointer"
                          onClick={() => handleEditClick(payroll)}
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Totals Row */}
                <tr className="border-t-2 border-blue-200 bg-blue-50 font-medium text-blue-800">
                  <td className="p-3" colSpan={2}>
                    <div className="text-sm font-bold">TOTAL</div>
                  </td>
                  <td className="p-3 text-sm">
                    {totals.numberOfRegularHours.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm">-</td>
                  <td className="p-3 text-sm">
                    ₱{totals.totalRegularWage.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm">
                    ₱{totals.nightDifferential.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm">
                    ₱{totals.prorated13thMonthPay.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm">
                    ₱{totals.specialHoliday.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm">
                    ₱{totals.regularHoliday.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm">
                    ₱{totals.serviceIncentiveLeave.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm">
                    ₱{totals.overtime.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm font-bold">
                    ₱{totals.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm">
                    ₱{totals.hdmf.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm">
                    ₱{totals.hdmfLoans.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm">
                    ₱{totals.sss.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm">
                    ₱{totals.phic.toLocaleString()}
                  </td>
                  <td className="p-3 text-sm font-bold">
                    ₱{totals.netPay.toLocaleString()}
                  </td>
                  <td className="p-3">-</td>
                  <td className="p-3 sticky right-0 bg-blue-50 z-10">-</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <PaginationComponent
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={filteredPayrolls.length}
        />
      </div>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              payroll record for <strong>{payrollToDelete?.name}</strong> from
              the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeletePayroll}
              className="cursor-pointer"
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isViewModalOpen && viewPayroll && (
        <div className="p-5 fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 backdrop-blur-sm transition-opacity"
            onClick={() => setIsViewModalOpen(false)}
          ></div>

          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl relative z-10 animate-fadeIn overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Payroll Details - {viewPayroll.name}
              </h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-blue-700 mb-3">
                    Employee Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Name:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {viewPayroll.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pay Period:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {viewPayroll.payPeriod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusColor(
                          viewPayroll.status
                        )}`}
                      >
                        {getStatusIcon(viewPayroll.status)}
                        {viewPayroll.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-green-700 mb-3">
                    Payment Summary
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Gross Amount:
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        ₱{viewPayroll.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Total Deductions:
                      </span>
                      <span className="text-sm font-medium text-red-600">
                        ₱
                        {(
                          viewPayroll.hdmf +
                          viewPayroll.hdmfLoans +
                          viewPayroll.sss +
                          viewPayroll.phic
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Net Pay:</span>
                      <span className="text-sm font-bold text-green-700">
                        ₱{viewPayroll.netPay.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-700 mb-3">
                    Earning Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Regular Hours:
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {viewPayroll.numberOfRegularHours}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Hourly Rate:
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          ₱{viewPayroll.hourlyRate.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Total Regular Wage:
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          ₱{viewPayroll.totalRegularWage.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Night Differential:
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          ₱
                          {nightDifferentialAmount(
                            viewPayroll
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          13th Month Pay:
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          ₱{viewPayroll.prorated13thMonthPay.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Special Holiday:
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          ₱{specialHolidayAmount(viewPayroll).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Regular Holiday:
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          ₱{regularHolidayAmount(viewPayroll).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Service Incentive Leave:
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          ₱{viewPayroll.serviceIncentiveLeave.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Overtime:</span>
                        <span className="text-sm font-medium text-gray-800">
                          ₱{overtimeAmount(viewPayroll).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-red-700 mb-3">
                    Deductions
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">HDMF:</span>
                        <span className="text-sm font-medium text-red-600">
                          ₱{viewPayroll.hdmf.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          HDMF Loans:
                        </span>
                        <span className="text-sm font-medium text-red-600">
                          ₱{viewPayroll.hdmfLoans.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">SSS:</span>
                        <span className="text-sm font-medium text-red-600">
                          ₱{viewPayroll.sss.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">PHIC:</span>
                        <span className="text-sm font-medium text-red-600">
                          ₱{viewPayroll.phic.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PayrollTable;
