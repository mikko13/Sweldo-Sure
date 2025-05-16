import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Sidebar from "../SidebarComponents/Sidebar";
import Header from "../HeaderComponents/Header";
import PayPeriod from "./PayPeriod";
import Metrics from "./Metrics";
import ActionsComponent from "./Actions";
import PayrollTable from "./Table";
import { CheckCircle, Clock } from "lucide-react";
import { Toaster } from "sonner";

function PayrollDashboard() {
  const [payrolls, setPayrolls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [payPeriod, setPayPeriod] = useState("All Pay Periods");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSidebarItem, setActiveSidebarItem] = useState("Payroll");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((payroll) => payroll.payPeriod === payPeriod);
  }, [payrolls, payPeriod]);

  useEffect(() => {
    async function fetchPayrolls() {
      try {
        const response = await axios.get(
          "https://sweldo-sure-server.onrender.com/#/api/payrolls"
        );
        setPayrolls(response.data);
        setLoading(false);

        setTimeout(() => {
          setIsPageLoaded(true);
        }, 100);
      } catch (err) {
        console.error("Error fetching payrolls:", err);
        setError(err);
        setLoading(false);
      }
    }

    fetchPayrolls();

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
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [payPeriod]);

  function handleCheckboxChange(id) {
    setPayrolls(
      payrolls.map((payroll) =>
        payroll._id === id ? { ...payroll, checked: !payroll.checked } : payroll
      )
    );
  }

  function getStatusColor(status) {
    switch (status) {
      case "Processed":
        return "bg-emerald-100 text-emerald-600";
      case "Pending":
        return "bg-amber-100 text-amber-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case "Processed":
        return <CheckCircle size={14} className="mr-1" />;
      case "Pending":
        return <Clock size={14} className="mr-1" />;
      default:
        return <span />;
    }
  }

  const totalNetPay = filteredPayrolls.reduce(
    (sum, emp) => sum + (emp.netPay || 0),
    0
  );
  const totalRegularWage = filteredPayrolls.reduce(
    (sum, emp) => sum + (emp.totalRegularWage || 0),
    0
  );
  const totalProcessedPayroll = filteredPayrolls
    .filter((emp) => emp.status === "Processed")
    .reduce((sum, emp) => sum + (emp.netPay || 0), 0);

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

  if (error)
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-red-50">
        <div className="text-red-800 text-lg">Error loading payrolls</div>
      </div>
    );

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
          <PayPeriod payPeriod={payPeriod} setPayPeriod={setPayPeriod} />
          <Metrics
            totalNetPay={totalNetPay}
            totalRegularWage={totalRegularWage}
            totalProcessedPayroll={totalProcessedPayroll}
            payPeriod={payPeriod}
          />
          <ActionsComponent
            payrolls={filteredPayrolls}
            selectedPayPeriod={payPeriod}
            displayedPayrolls={filteredPayrolls.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )}
          />
          <PayrollTable
            payrolls={payrolls}
            setPayrolls={setPayrolls}
            handleCheckboxChange={handleCheckboxChange}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            selectedPayPeriod={payPeriod}
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

export default PayrollDashboard;
