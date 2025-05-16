import React from "react";
import {
  Home,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  PhilippinePeso,
  ChevronRight,
  UserCog,
  ServerCog,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "@/pages/services/authService";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeSidebarItem,
  setActiveSidebarItem,
}) {
  const navigate = useNavigate();

  function handleMenuClick(menuItem, path) {
    setActiveSidebarItem(menuItem);
    navigate(path);
  }

  function handleLogout() {
    authService.logout();
    navigate("/");
  }

  const menuItems = [
    {
      name: "Dashboard",
      icon: <Home size={18} />,
      path: "/admin-dashboard",
    },
    {
      name: "User Accounts",
      icon: <UserCog size={18} />,
      path: "/admin-user-accounts",
    },
    {
      name: "Employees",
      icon: <Users size={18} />,
      path: "/admin-employees",
    },
    {
      name: "Payroll",
      icon: <PhilippinePeso size={18} />,
      path: "/admin-payroll",
    },
    {
      name: "System Settings",
      icon: <ServerCog size={18} />,
      path: "/admin-system-settings",
    },
    {
      name: "Account Settings",
      icon: <Settings size={18} />,
      path: "/admin-settings",
    },
  ];

  return (
    <div className="flex relative h-screen">
      {!sidebarOpen && (
        <button
          className="absolute -right-7 top-4 bg-blue-700 text-white p-2 rounded-md hover:bg-blue-600 transition-all duration-200 shadow-md z-10 cursor-pointer"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open Sidebar"
        >
          <ChevronRight size={18} />
        </button>
      )}

      <div
        className={`border-r border-blue-900/20 flex flex-col h-full transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
        style={{ background: "linear-gradient(to bottom, #fff, #f8fafc)" }}
      >
        <div className="p-6 flex justify-between items-center border-b border-blue-100">
          <div className="flex flex-col">
            <div className="text-xl font-bold flex items-center">
              <span className="text-blue-800 mr-1 tracking-widest">ADMIN</span>
            </div>
            <div className="text-xs font-semibold tracking-wider text-blue-800">
              MANAGEMENT CONSOLE
            </div>
          </div>
          <button
            className="text-gray-500 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Sidebar"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4">
            {menuItems.map((item) => (
              <div key={item.name} className="mb-2">
                <div
                  className={`flex items-center py-3 px-4 rounded-lg cursor-pointer 
                  hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 ${
                    activeSidebarItem === item.name
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-gray-600"
                  }`}
                  onClick={() => handleMenuClick(item.name, item.path)}
                >
                  <div className="mr-3">{item.icon}</div>
                  <span className="flex-1">{item.name}</span>
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-blue-100">
          <button
            onClick={handleLogout}
            className="cursor-pointer flex w-full items-center py-2 px-3 text-gray-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          >
            <LogOut size={18} className="mr-3" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
