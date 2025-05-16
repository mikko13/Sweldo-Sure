import React from "react";

function BrandSection() {
  return (
    <div className="flex flex-col items-center mb-8 md:mb-12">
      <div className="text-3xl md:text-4xl font-bold flex items-center mb-2">
        <span className="tracking-widest mr-1">G.</span>
        <span className="tracking-widest mr-1">L.</span>
        <span className="tracking-widest">S.</span>
      </div>
      <div className="text-base md:text-lg font-semibold tracking-wider text-center">
        MANPOWER SERVICES
      </div>
      <div className="text-base md:text-lg font-semibold tracking-wider text-center">
        Payroll Management System
      </div>
    </div>
  );
}

export default BrandSection;
