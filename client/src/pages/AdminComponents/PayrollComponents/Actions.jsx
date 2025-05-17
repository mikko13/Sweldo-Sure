import { useState, useEffect } from "react";
import { Table, Search, Filter, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "sonner";

function Actions({ payrolls = [], onSearch }) {
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  function handleSearchChange (e)  {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

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
              onClick={() => navigate("/admin-payroll/create-payroll")}
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
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-white text-gray-800 px-3 py-2 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-200 transition-all duration-200"
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
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-white text-gray-800 px-3 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-200 transition-all duration-200"
              />
              <Search
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="p-2 rounded-md bg-white hover:bg-blue-50 transition-all duration-200 border border-blue-200"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(5px)",
                  transition:
                    "opacity 500ms ease-out, transform 500ms ease-out",
                  transitionDelay: "400ms",
                }}
              >
                <Filter size={16} className="text-gray-400" />
              </button>
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
                  onClick={() => navigate("/admin-payroll/create-payroll")}
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
                <button className="bg-white hover:bg-blue-50 text-gray-800 px-3 py-2 rounded-md text-sm flex items-center transition-colors duration-200 border border-blue-200 w-full">
                  <Table size={16} className="mr-2" />
                  Generate Payroll
                </button>
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
