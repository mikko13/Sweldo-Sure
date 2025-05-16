import React, { useState, useEffect } from "react";
import { PhilippinePeso, Users, CheckCircle } from "lucide-react";

function MetricsComponent({
  totalNetPay,
  totalRegularWage,
  totalProcessedPayroll,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayNetPay, setDisplayNetPay] = useState(0);
  const [displayRegularWage, setDisplayRegularWage] = useState(0);
  const [displayProcessedPayroll, setDisplayProcessedPayroll] = useState(0);

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
    const increment = totalNetPay / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= totalNetPay) {
        setDisplayNetPay(totalNetPay);
        clearInterval(timer);
      } else {
        setDisplayNetPay(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, totalNetPay]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const steps = 30;
    const stepTime = duration / steps;

    const current = 0;
    const increment = totalRegularWage / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= totalRegularWage) {
        setDisplayRegularWage(totalRegularWage);
        clearInterval(timer);
      } else {
        setDisplayRegularWage(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, totalRegularWage]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const steps = 30;
    const stepTime = duration / steps;

    let current = 0;
    const increment = totalProcessedPayroll / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= totalProcessedPayroll) {
        setDisplayProcessedPayroll(totalProcessedPayroll);
        clearInterval(timer);
      } else {
        setDisplayProcessedPayroll(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, totalProcessedPayroll]);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
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
          <div className="text-gray-500 text-sm">Total Pay</div>
          <PhilippinePeso size={18} className="text-blue-800" />
        </div>
        <div className="text-gray-800 text-xl md:text-2xl font-bold truncate">
          ₱{displayNetPay.toLocaleString()}
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
          <div className="text-gray-500 text-sm">Total Regular Wage</div>
          <Users size={18} className="text-blue-800" />
        </div>
        <div className="text-gray-800 text-xl md:text-2xl font-bold truncate">
          ₱{displayRegularWage.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default MetricsComponent;
