import { useState, useEffect } from "react";
import { Search, Filter, Plus, X, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PayslipGenerator from "./PayslipGeneratorComponents/PayslipGenerator";
import PayrollExcelGenerator from "./PayrollExcelGeneratorComponents/PayrollExcelGenerator";
import { Toaster } from "sonner";

function Actions({
  payrolls = [],
  selectedPayPeriod = "All Pay Periods",
  searchQuery = "",
  setSearchQuery = () => {},
}) {
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, setSearchQuery]);

  function handleClearSearch() {
    setInputValue("");
    setSearchQuery("");
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        className="p-4 transition-all duration-500 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(10px)",
        }}
      >
        <div className="hidden md:flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white px-3 py-2 rounded-md text-sm flex items-center transition-all duration-200 shadow-md cursor-pointer"
              onClick={() => navigate("/Payroll/CreatePayroll")}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(5px)",
                transition: "opacity 500ms ease-out, transform 500ms ease-out",
                transitionDelay: "300ms",
              }}
            >
              <Plus size={16} className="mr-2" />
              Create Payroll Record
            </button>

            <div
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(5px)",
                transition: "opacity 500ms ease-out, transform 500ms ease-out",
                transitionDelay: "400ms",
              }}
            >
              <PayrollExcelGenerator
                payrolls={payrolls}
                selectedPayPeriod={selectedPayPeriod}
              />
            </div>

            <div
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(5px)",
                transition: "opacity 500ms ease-out, transform 500ms ease-out",
                transitionDelay: "500ms",
              }}
            >
              <PayslipGenerator payrolls={payrolls} />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="relative"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(10px)",
                transition: "opacity 500ms ease-out, transform 500ms ease-out",
                transitionDelay: "300ms",
              }}
            >
              <input
                type="text"
                placeholder="Search records..."
                className="bg-white text-gray-800 px-3 py-2 pl-3 pr-8 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-200 transition-all duration-200"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />

              <Search
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <div className="flex justify-between items-center">
            <div
              className="relative flex-1 mr-2"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(5px)",
                transition: "opacity 500ms ease-out, transform 500ms ease-out",
                transitionDelay: "300ms",
              }}
            >
              <input
                type="text"
                placeholder="Search..."
                className="bg-white text-gray-800 px-3 py-2 pl-3 pr-8 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-200 transition-all duration-200"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              {inputValue ? (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle size={14} />
                </button>
              ) : null}
              <Search
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMobileActionsOpen(!mobileActionsOpen)}
                className="p-2 rounded-md bg-gradient-to-r from-blue-700 to-blue-800 text-white transition-all duration-200"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(5px)",
                  transition:
                    "opacity 500ms ease-out, transform 500ms ease-out",
                  transitionDelay: "500ms",
                }}
              >
                {mobileActionsOpen ? <X size={16} /> : <Plus size={16} />}
              </button>
            </div>
          </div>

          {mobileActionsOpen && (
            <div className="mt-2 space-y-2 overflow-hidden">
              <div
                style={{
                  animation: "slideDown 300ms ease forwards",
                  opacity: 0,
                  transform: "translateY(-20px)",
                }}
              >
                <button
                  className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white px-3 py-2 rounded-md text-sm flex items-center transition-all duration-200 shadow-md w-full"
                  onClick={() => navigate("/Payroll/CreatePayroll")}
                >
                  <Plus size={16} className="mr-2" />
                  Create Payroll Record
                </button>
              </div>
              <div
                style={{
                  animation: "slideDown 300ms ease forwards",
                  animationDelay: "100ms",
                  opacity: 0,
                  transform: "translateY(-20px)",
                }}
              >
                <PayrollExcelGenerator
                  payrolls={payrolls}
                  selectedPayPeriod={selectedPayPeriod}
                />
              </div>
              <div
                style={{
                  animation: "slideDown 300ms ease forwards",
                  animationDelay: "200ms",
                  opacity: 0,
                  transform: "translateY(-20px)",
                }}
              >
                <PayslipGenerator payrolls={payrolls} />
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
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

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>

      <Toaster position="bottom-left" />
    </>
  );
}

export default Actions;
