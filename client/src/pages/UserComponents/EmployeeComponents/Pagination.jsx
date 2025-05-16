import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PaginationComponent({
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  totalItems,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center py-4 px-6 bg-white border-t border-blue-100">
      <div className="mb-4 sm:mb-0 text-sm text-gray-500">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
        entries
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center mr-4">
          <span className="text-sm text-gray-500 mr-2">Display</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
            className="cursor-pointer border border-blue-100 rounded px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`cursor-pointer p-2 rounded ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400"
              : "bg-blue-50 text-gray-600 hover:bg-blue-100 hover:text-blue-700"
          } transition-all duration-200`}
        >
          <ChevronLeft size={16} />
        </button>
        <button className="h-8 w-8 rounded flex items-center justify-center text-sm transition-all duration-200 bg-blue-600 text-white">
          {currentPage}
        </button>
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalItems === 0}
          className={`cursor-pointer p-2 rounded ${
            currentPage === totalPages || totalItems === 0
              ? "bg-gray-100 text-gray-400"
              : "bg-blue-50 text-gray-600 hover:bg-blue-100 hover:text-blue-700"
          } transition-all duration-200`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default PaginationComponent;
