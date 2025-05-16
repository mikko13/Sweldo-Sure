import React, { useState, useEffect } from "react";
import { Users, UserCheck, UserX } from "lucide-react";

function UserStats({ users }) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayTotalUsers, setDisplayTotalUsers] = useState(0);
  const [displayActiveUsers, setDisplayActiveUsers] = useState(0);
  const [displayInactiveUsers, setDisplayInactiveUsers] = useState(0);

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const steps = 30;
    const stepTime = duration / steps;

    let current = 0;
    const increment = totalUsers / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= totalUsers) {
        setDisplayTotalUsers(totalUsers);
        clearInterval(timer);
      } else {
        setDisplayTotalUsers(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, totalUsers]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const steps = 30;
    const stepTime = duration / steps;

    let current = 0;
    const increment = activeUsers / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= activeUsers) {
        setDisplayActiveUsers(activeUsers);
        clearInterval(timer);
      } else {
        setDisplayActiveUsers(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, activeUsers]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const steps = 30;
    const stepTime = duration / steps;

    let current = 0;
    const increment = inactiveUsers / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= inactiveUsers) {
        setDisplayInactiveUsers(inactiveUsers);
        clearInterval(timer);
      } else {
        setDisplayInactiveUsers(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, inactiveUsers]);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
      <div
        className="bg-white rounded-lg p-4 border border-blue-100 shadow transition-all duration-500 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? "translateY(0) scale(1)"
            : "translateY(20px) scale(0.95)",
          transitionDelay: "100ms",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-500 text-sm">Total Users</div>
          <Users size={18} className="text-blue-800" />
        </div>
        <div className="text-gray-800 text-xl md:text-2xl font-bold">
          {displayTotalUsers.toLocaleString()}
        </div>
      </div>
      <div
        className="bg-white rounded-lg p-4 border border-blue-100 shadow transition-all duration-500 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? "translateY(0) scale(1)"
            : "translateY(20px) scale(0.95)",
          transitionDelay: "200ms",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-500 text-sm">Active Users</div>
          <UserCheck size={18} className="text-green-600" />
        </div>
        <div className="text-green-700 text-xl md:text-2xl font-bold">
          {displayActiveUsers.toLocaleString()}
        </div>
        <div className="text-gray-500 text-xs mt-2">
          {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%
          of total
        </div>
      </div>
      <div
        className="bg-white rounded-lg p-4 border border-blue-100 shadow transition-all duration-500 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? "translateY(0) scale(1)"
            : "translateY(20px) scale(0.95)",
          transitionDelay: "300ms",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-500 text-sm">Inactive Users</div>
          <UserX size={18} className="text-red-600" />
        </div>
        <div className="text-red-700 text-xl md:text-2xl font-bold">
          {displayInactiveUsers.toLocaleString()}
        </div>
        <div className="text-gray-500 text-xs mt-2">
          {totalUsers > 0 ? Math.round((inactiveUsers / totalUsers) * 100) : 0}%
          of total
        </div>
      </div>
    </div>
  );
}

export default UserStats;
