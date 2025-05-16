import { Receipt, Loader } from "lucide-react";

function GenerateButton({ onClick, isGenerating }) {
  return (
    <button
      onClick={onClick}
      disabled={isGenerating}
      className={`cursor-pointer bg-white hover:bg-blue-50 text-gray-800 px-3 py-2 rounded-md text-sm flex items-center 
        transition-all duration-200 border border-blue-200 w-full md:w-auto justify-center
        ${isGenerating ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {isGenerating ? (
        <Loader size={16} className="mr-2 animate-spin" />
      ) : (
        <Receipt size={16} className="mr-2" />
      )}
      Generate Payslips
    </button>
  );
}

export default GenerateButton;
