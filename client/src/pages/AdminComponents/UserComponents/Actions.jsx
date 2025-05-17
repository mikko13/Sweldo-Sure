import { useState, useEffect, useCallback } from "react";
import { Users, Search, Filter, Plus, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

function UserActions({
  searchQuery,
  setSearchQuery,
  displayedUsers,
  users,
  setFilteredUsers,
}) {
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState(null);
  const [filters, setFilters] = useState({
    department: "",
    role: "",
    status: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const uniqueDepartments = [
    ...new Set(users.map((user) => user.department).filter(Boolean)),
  ];
  const uniqueRoles = [
    ...new Set(users.map((user) => user.role).filter(Boolean)),
  ];
  const uniqueStatuses = [
    ...new Set(users.map((user) => user.status).filter(Boolean)),
  ];

  const applyFilters = useCallback(() => {
    const filteredData = users.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesDepartment =
        !filters.department || user.department === filters.department;

      const matchesRole = !filters.role || user.role === filters.role;

      const matchesStatus = !filters.status || user.status === filters.status;

      return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
    });

    setFilteredUsers(filteredData);
  }, [users, searchQuery, filters, setFilteredUsers]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const filterSections = [
    {
      label: "Department",
      key: "department",
      options: uniqueDepartments,
    },
    {
      label: "Role",
      key: "role",
      options: uniqueRoles,
    },
    {
      label: "Status",
      key: "status",
      options: uniqueStatuses,
    },
  ];

  function resetFilters() {
    setFilters({
      department: "",
      role: "",
      status: "",
    });
    setSearchQuery("");
    setFilteredUsers(users);
    setFilterDropdownOpen(false);
  }

  return (
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
            className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white px-3 py-2 rounded-md text-sm flex items-center shadow-md cursor-pointer transition-all duration-200"
            onClick={() =>
              navigate("/admin-user-accounts/admin-create-user-accounts")
            }
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(5px)",
              transition: "opacity 500ms ease-out, transform 500ms ease-out",
              transitionDelay: "300ms",
            }}
          >
            <Users size={16} className="mr-2" />
            Create User
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
              placeholder="Search users..."
              className="bg-white text-gray-800 px-3 py-2 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-200 transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={16}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          <div
            className="relative"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(10px)",
              transition: "opacity 500ms ease-out, transform 500ms ease-out",
              transitionDelay: "400ms",
            }}
          >
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
              placeholder="Search users..."
              className="bg-white text-gray-800 px-3 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-200 transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={16}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div
              className="relative"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(5px)",
                transition: "opacity 500ms ease-out, transform 500ms ease-out",
                transitionDelay: "400ms",
              }}
            >
            </div>
            <button
              onClick={() => setMobileActionsOpen(!mobileActionsOpen)}
              className="p-2 rounded-md bg-gradient-to-r from-blue-700 to-blue-800 text-white transition-all duration-200"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(5px)",
                transition: "opacity 500ms ease-out, transform 500ms ease-out",
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
                className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white px-3 py-2 rounded-md text-sm flex items-center shadow-md w-full transition-all duration-200"
                onClick={() =>
                  navigate("/admin-user-accounts/admin-create-user-accounts")
                }
              >
                <Users size={16} className="mr-2" />
                Create User
              </button>
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

        .animate-fadeIn {
          animation: fadeIn 300ms ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 300ms ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 300ms ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default UserActions;
