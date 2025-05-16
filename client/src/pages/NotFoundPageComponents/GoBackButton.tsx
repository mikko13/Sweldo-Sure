import { ArrowLeft } from "lucide-react";

function GoBackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="flex-1 py-3 px-5 rounded-lg flex items-center justify-center text-white font-medium bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <ArrowLeft size={18} className="mr-2" />
      Go Back
    </button>
  );
}

export default GoBackButton;
