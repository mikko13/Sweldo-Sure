import { useState } from "react";
import { Download, Edit, Trash } from "lucide-react";
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
    navigate("/admin-employees/update-employees/" + employee.id, {
      state: { employee },
    });
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-md text-gray-600 hover:text-red-600 transition-all duration-200 cursor-pointer"
                              onClick={() => setEmployeeToDelete(employee)}
                            >
                              <Trash size={16} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the employee record for{" "}
                                <strong>
                                  {employeeToDelete?.firstName}{" "}
                                  {employeeToDelete?.lastName}
                                </strong>{" "}
                                from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">
                                Cancel
                              </AlertDialogCancel>
                              <Button
                                variant="destructive"
                                onClick={handleDeleteEmployee}
                                className="cursor-pointer"
                              >
                                Delete
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
    </>
  );
}

export default EmployeeTable;
