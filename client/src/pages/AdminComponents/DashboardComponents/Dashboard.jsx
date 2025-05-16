import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../SidebarComponents/Sidebar";
import Header from "../HeaderComponents/Header";
import StatCards from "./StatCards";
import PayrollSummaryChart from "./PayrollSummaryChart";
import DepartmentDistributionChart from "./DepartmentDistributionChart";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSidebarItem, setActiveSidebarItem] = useState("Dashboard");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await axios.get(
          "https://sweldo-sure-server.onrender.com/#/api/employees"
        );
        setEmployees(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed h-screen z-10">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeSidebarItem={activeSidebarItem}
          setActiveSidebarItem={setActiveSidebarItem}
        />
      </div>

      <div
        className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header />
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            <StatCards employees={employees} loading={loading} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <PayrollSummaryChart />
            </div>

            <div>
              {loading ? (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100 h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p>Loading department data...</p>
                  </div>
                </div>
              ) : (
                <DepartmentDistributionChart employees={employees} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
