import { useState } from "react";
import { Download, Edit, Eye, Trash, X } from "lucide-react";
import { generateEmployeePDF } from "./pdfGenerator";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  getStatusColor,
  getRemarksColor,
  getRemarksIcon,
} from "./employeeUtils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PaginationComponent from "./Pagination";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";

function EmployeeTable({
  displayedEmployees,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  filteredEmployees,
  employees,
  setEmployees,
}) {
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  async function handleDownloadPDF(employee) {
    try {
      await generateEmployeePDF(employee);
      toast.success("Employee PDF downloaded successfully", {
        description:
          "PDF for " +
          employee.firstName +
          " " +
          employee.lastName +
          " has been generated.",
      });
    } catch (error) {
      toast.error("Failed to download PDF", {
        description: "An error occurred while generating the PDF.",
      });
    }
  }

  const navigate = useNavigate();

  function handleEditEmployee(employee) {
    navigate("/Employees/UpdateEmployee/" + employee.id, {
      state: { employee },
    });
  }

  function handleViewEmployee(employee) {
    setViewEmployee(employee);
    setIsViewModalOpen(true);
  }

  async function handleDeleteEmployee() {
    if (!employeeToDelete) return;

    try {
      await axios.delete(
        "http://localhost:5000/api/employees/" + employeeToDelete.id
      );

      const updatedEmployees = employees.filter(
        (emp) => emp.id !== employeeToDelete.id
      );
      setEmployees(updatedEmployees);

      toast.success("Employee Deleted", {
        description:
          employeeToDelete.firstName +
          " " +
          employeeToDelete.lastName +
          " has been removed from the system.",
      });

      setEmployeeToDelete(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Delete Failed", {
        description: "An error occurred while deleting the employee.",
      });
    }
  }

  return (
    <>
      <div className="relative flex-1 overflow-auto p-4">
        <div className="rounded-lg overflow-hidden shadow animate-fadeIn bg-white border border-blue-100">
          <div className="overflow-x-auto">
            <table className="w-full relative">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-blue-100 bg-blue-50">
                  <th className="p-3 text-left font-medium">Last Name</th>
                  <th className="p-3 text-left font-medium">First Name</th>
                  <th className="p-3 text-left font-medium">Middle Name</th>
                  <th className="p-3 text-left font-medium">Gender</th>
                  <th className="p-3 text-left font-medium">Position</th>
                  <th className="p-3 text-left font-medium">Department</th>
                  <th className="p-3 text-left font-medium">Date Started</th>
                  <th className="p-3 text-left font-medium">Rate</th>
                  <th className="p-3 text-left font-medium">Civil Status</th>
                  <th className="p-3 text-left font-medium">Birthday</th>
                  <th className="p-3 text-left font-medium">SSS Number</th>
                  <th className="p-3 text-left font-medium">HDMF/PAGIBIG</th>
                  <th className="p-3 text-left font-medium">Philhealth</th>
                  <th className="p-3 text-left font-medium">Tin Number</th>
                  <th className="p-3 text-left font-medium">Email Address</th>
                  <th className="p-3 text-left font-medium">
                    Permanent Address
                  </th>
                  <th className="p-3 text-left font-medium">Contact Number</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Remarks</th>
                  <th className="p-3 text-left font-medium sticky right-0 bg-blue-50 z-10">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-blue-50 hover:bg-blue-50 transition-all duration-200 animate-fadeIn"
                  >
                    <td className="p-3 text-sm text-gray-800">
                      {employee.lastName}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {employee.firstName}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {employee.middleName}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {employee.gender}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {employee.position}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {employee.department}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {employee.dateStarted}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {employee.rate}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {employee.civilStatus}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {employee.birthDate}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {employee.sss}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {employee.hdmf}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {employee.philhealth}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {employee.tin}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {employee.emailAddress}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {employee.permanentAddress}
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {employee.contactNumber}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full flex items-center w-fit ${getStatusColor(
                          employee.status
                        )}`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {employee.remarks && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full flex items-center w-fit ${getRemarksColor(
                            employee.remarks
                          )}`}
                        >
                          {getRemarksIcon(employee.remarks)}
                          {employee.remarks.length > 15
                            ? `${employee.remarks.substring(0, 15)}...`
                            : employee.remarks}
                        </span>
                      )}
                    </td>
                    <td className="p-3 sticky right-0 bg-white z-10">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-md text-gray-600 hover:text-blue-700 transition-all duration-200 cursor-pointer"
                          onClick={() => handleViewEmployee(employee)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-md text-gray-600 hover:text-blue-700 transition-all duration-200 cursor-pointer"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-md text-gray-600 hover:text-blue-700 transition-all duration-200 cursor-pointer"
                          onClick={() => handleDownloadPDF(employee)}
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationComponent
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={filteredEmployees.length}
          />
        </div>
      </div>

      {isViewModalOpen && viewEmployee && (
        <div className="p-5 fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 backdrop-blur-sm transition-opacity"
            onClick={() => setIsViewModalOpen(false)}
          ></div>

          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative z-10 animate-fadeIn overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Employee Details - {viewEmployee.firstName}{" "}
                {viewEmployee.lastName}
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
                {/* Basic Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-blue-700 mb-3">
                    Personal Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Name:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {viewEmployee.lastName}, {viewEmployee.firstName}{" "}
                        {viewEmployee.middleName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Gender:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {viewEmployee.gender}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Birthday:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {viewEmployee.birthDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Civil Status:
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {viewEmployee.civilStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Email Address:
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {viewEmployee.emailAddress}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Contact Number:
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {viewEmployee.contactNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Permanent Address:
                      </span>
                      <span className="text-sm font-medium text-gray-800 text-right">
                        {viewEmployee.permanentAddress}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Employment Info */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-green-700 mb-3">
                    Employment Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Position:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {viewEmployee.position}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Department:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {viewEmployee.department}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Date Started:
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {viewEmployee.dateStarted}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rate:</span>
                      <span className="text-sm font-medium text-gray-800">
                        ₱{parseFloat(viewEmployee.rate).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusColor(
                          viewEmployee.status
                        )}`}
                      >
                        {viewEmployee.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Remarks:</span>
                      {viewEmployee.remarks ? (
                        <span
                          className={`text-xs px-2 py-1 rounded-full flex items-center ${getRemarksColor(
                            viewEmployee.remarks
                          )}`}
                        >
                          {getRemarksIcon(viewEmployee.remarks)}
                          {viewEmployee.remarks}
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-gray-500">
                          None
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Government IDs */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-700 mb-3">
                  Government IDs
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">SSS Number:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {viewEmployee.sss}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        HDMF/PAGIBIG:
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {viewEmployee.hdmf}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Philhealth:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {viewEmployee.philhealth}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">TIN Number:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {viewEmployee.tin}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EmployeeTable;
