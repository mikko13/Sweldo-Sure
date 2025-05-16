import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "../SidebarComponents/Sidebar";
import Header from "../HeaderComponents/Header";
import EmployeeStats from "./Stats";
import EmployeeActions from "./Actions";
import EmployeeTable from "./Table";
import { Toaster } from "sonner";

function EmployeeDashboard() {
  const location = useLocation();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSidebarItem, setActiveSidebarItem] = useState("Employees");
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://sweldo-sure-server.onrender.com/#/api/employees"
        );
        const employeesWithId = response.data.map((employee) => ({
          ...employee,
          id: employee._id,
        }));
        setEmployees(employeesWithId);
        setFilteredEmployees(employeesWithId);
        setError(null);
        setDataLoaded(true);

        setTimeout(() => {
          setLoading(false);
          setTimeout(() => {
            setIsPageLoaded(true);
          }, 100);
        }, 500);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees. Please try again later.");
        setLoading(false);
      }
    }

    fetchEmployees();

    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .content-animated {
        animation: slideDown 0.5s ease forwards;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const displayedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (emp) => emp.remarks === "Active"
  ).length;
  const regularEmployees = employees.filter(
    (emp) => emp.status === "Regular"
  ).length;

  if (loading) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
        <div className="w-64 h-full bg-blue-100 opacity-70 animate-pulse" />
        <div className="flex-1 flex flex-col">
          <div className="h-16 bg-white shadow-sm opacity-70 animate-pulse" />

          <div className="flex-1 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm p-4 h-24 opacity-70 animate-pulse"
                >
                  <div className="h-4 w-24 mb-2 bg-gray-200 rounded" />
                  <div className="h-8 w-16 bg-gray-200 rounded" />
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row justify-between items-center opacity-70">
              <div className="h-10 w-64 bg-gray-200 rounded" />
              <div className="flex space-x-2 mt-2 md:mt-0">
                <div className="h-10 w-24 bg-gray-200 rounded" />
                <div className="h-10 w-24 bg-gray-200 rounded" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden opacity-70">
              <div className="h-12 bg-gray-100 flex items-center px-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 rounded mr-4 flex-1"
                  />
                ))}
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="border-t border-gray-100 h-14 flex items-center px-4"
                >
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div
                      key={j}
                      className="h-4 bg-gray-200 rounded mr-4 flex-1"
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
                <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <div className="text-blue-800 text-lg font-medium">Loading</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-red-50">
        <div className="text-red-800 text-lg">Error loading employees</div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen w-screen overflow-hidden transition-opacity duration-500"
      style={{ opacity: isPageLoaded ? 1 : 0 }}
    >
      <Sidebar
        sidebarOpen={sidebarOpen}
        activeSidebarItem={activeSidebarItem}
        setActiveSidebarItem={setActiveSidebarItem}
        setSidebarOpen={setSidebarOpen}
      />

      <div
        className="flex-1 flex flex-col h-screen overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f8fafc, #f0f4f8)" }}
      >
        <Header />

        <div className="flex-1 overflow-y-auto">
          <EmployeeStats
            totalEmployees={totalEmployees}
            activeEmployees={activeEmployees}
            regularEmployees={regularEmployees}
          />

          <EmployeeActions
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            displayedEmployees={displayedEmployees}
            employees={employees}
            setFilteredEmployees={setFilteredEmployees}
          />

          <EmployeeTable
            displayedEmployees={displayedEmployees}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            filteredEmployees={filteredEmployees}
            employees={employees}
            setEmployees={setEmployees}
          />
        </div>
      </div>
      <Toaster
        richColors
        position="bottom-left"
        expand={true}
        duration={3000}
      />
    </div>
  );
}

export default EmployeeDashboard;
