import React from "react";

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center mb-3 md:mb-4">
        {icon}
        <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-blue-100 text-sm md:text-base">{description}</p>
    </div>
  );
}

export default FeatureCard;
