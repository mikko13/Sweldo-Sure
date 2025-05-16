import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserAvatar from "./UserAvatar";

function Header() {
  const location = useLocation();

  const pageTitles = {
    "/payroll": "Payroll",
    "/employees": "Employees",
    "/settings": "Settings",
    "/dashboard": "Home",
  };

  const title = pageTitles[location.pathname] || "Dashboard";

  useEffect(() => {
    const titleElement = document.getElementById("page-title");
    if (titleElement) {
      titleElement.style.opacity = "0";
      titleElement.style.transform = "translateY(10px)";

      setTimeout(() => {
        titleElement.style.transition = "all 0.4s ease";
        titleElement.style.opacity = "1";
        titleElement.style.transform = "translateY(0)";
      }, 50);
    }
  }, [location.pathname]);

  return (
    <div className="border-b border-blue-100 p-4 bg-white relative">
      <div className="flex items-center justify-between">
        <div id="page-title" className="text-blue-800 ml-4 font-bold">
          {title}
        </div>

        <UserAvatar />
      </div>
    </div>
  );
}

const styleTag = document.createElement("style");
styleTag.innerHTML = `
  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out forwards;
  }
  
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
`;
document.head.appendChild(styleTag);

export default Header;
