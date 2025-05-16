import React, { useState, useEffect } from "react";
import { UserRoundCheck, Users, Zap } from "lucide-react";

function EmployeeStats({ totalEmployees, activeEmployees, regularEmployees }) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayTotalEmployees, setDisplayTotalEmployees] = useState(0);
  const [displayActiveEmployees, setDisplayActiveEmployees] = useState(0);
  const [displayRegularEmployees, setDisplayRegularEmployees] = useState(0);

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
    const increment = totalEmployees / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= totalEmployees) {
        setDisplayTotalEmployees(totalEmployees);
        clearInterval(timer);
      } else {
        setDisplayTotalEmployees(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, totalEmployees]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const steps = 30;
    const stepTime = duration / steps;

    let current = 0;
    const increment = activeEmployees / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= activeEmployees) {
        setDisplayActiveEmployees(activeEmployees);
        clearInterval(timer);
      } else {
        setDisplayActiveEmployees(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, activeEmployees]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const steps = 30;
    const stepTime = duration / steps;

    let current = 0;
    const increment = regularEmployees / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= regularEmployees) {
        setDisplayRegularEmployees(regularEmployees);
        clearInterval(timer);
      } else {
        setDisplayRegularEmployees(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, regularEmployees]);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="text-gray-500 text-sm">Total Employees</div>
          <Users size={18} className="text-blue-800" />
        </div>
        <div className="text-gray-800 text-xl md:text-2xl font-bold">
          {displayTotalEmployees.toLocaleString()}
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
          <div className="text-gray-500 text-sm">Active Employees</div>
          <Zap size={18} className="text-blue-800" />
        </div>
        <div className="text-gray-800 text-xl md:text-2xl font-bold">
          {displayActiveEmployees.toLocaleString()}
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
          <div className="text-gray-500 text-sm">Regular Employees</div>
          <UserRoundCheck size={18} className="text-blue-800" />
        </div>
        <div className="text-gray-800 text-xl md:text-2xl font-bold">
          {displayRegularEmployees.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default EmployeeStats;
