import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PaginationComponent({
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  totalItems,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  function handlePageChange(page) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  const pagesToShow = [];
  const pageWindow = 2;

  for (
    let i = Math.max(1, currentPage - pageWindow);
    i <= Math.min(totalPages, currentPage + pageWindow);
    i++
  ) {
    pagesToShow.push(i);
  }

  return (
    <div
      className="flex flex-col sm:flex-row justify-between items-center py-4 px-6 bg-white border-t border-blue-100 transition-all duration-500 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(10px)",
      }}
    >
      <div className="mb-4 sm:mb-0 text-sm text-gray-500">
        Showing {startItem} to {endItem} of {totalItems} entries
      </div>
      <div className="flex items-center gap-2">
        <div
          className="flex items-center mr-4"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 500ms ease-out",
            transitionDelay: "100ms",
          }}
        >
          <span className="text-sm text-gray-500 mr-2">Display</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
            className="cursor-pointer border border-blue-100 rounded px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`cursor-pointer p-2 rounded ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400"
              : "bg-blue-50 text-gray-600 hover:bg-blue-100 hover:text-blue-700"
          } transition-all duration-200`}
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 500ms ease-out",
            transitionDelay: "200ms",
          }}
        >
          <ChevronLeft size={16} />
        </button>
        {pagesToShow.map((page, index) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`cursor-pointer h-8 w-8 rounded flex items-center justify-center text-sm transition-all duration-200 ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-gray-700 hover:bg-blue-100"
            }`}
            style={{
              opacity: isVisible ? 1 : 0,
              transition: "opacity 500ms ease-out",
              transitionDelay: `${300 + index * 50}ms`,
            }}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`cursor-pointer p-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400"
              : "bg-blue-50 text-gray-600 hover:bg-blue-100 hover:text-blue-700"
          } transition-all duration-200`}
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 500ms ease-out",
            transitionDelay: `${300 + pagesToShow.length * 50}ms`,
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default PaginationComponent;
