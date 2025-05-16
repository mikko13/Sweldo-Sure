import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronFirst,
  ChevronLast,
} from "lucide-react";

function PaginationComponent({
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  totalItems,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  function getPageNumbers() {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center py-4 px-6 bg-white border-t border-blue-100">
      <div className="mb-4 sm:mb-0 text-sm text-gray-500">
        {totalItems > 0 ? (
          <>
            Showing {startItem} to {endItem} of {totalItems} entries
          </>
        ) : (
          "No entries found"
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center mr-4">
          <span className="text-sm text-gray-500 mr-2">Rows per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-blue-100 rounded px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1 || totalItems === 0}
            className={`p-2 rounded ${
              currentPage === 1 || totalItems === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-50 text-gray-600 hover:bg-blue-100 hover:text-blue-700"
            } transition-all duration-200`}
            aria-label="First page"
          >
            <ChevronFirst size={16} />
          </button>

          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || totalItems === 0}
            className={`p-2 rounded ${
              currentPage === 1 || totalItems === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-50 text-gray-600 hover:bg-blue-100 hover:text-blue-700"
            } transition-all duration-200`}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1 mx-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof page === "number" ? setCurrentPage(page) : null
                }
                disabled={page === "..." || currentPage === page}
                className={`min-w-8 h-8 rounded flex items-center justify-center text-sm transition-all duration-200 ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : page === "..."
                    ? "bg-transparent text-gray-500 cursor-default"
                    : "bg-blue-50 text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                }`}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages || totalItems === 0}
            className={`p-2 rounded ${
              currentPage === totalPages || totalItems === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-50 text-gray-600 hover:bg-blue-100 hover:text-blue-700"
            } transition-all duration-200`}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalItems === 0}
            className={`p-2 rounded ${
              currentPage === totalPages || totalItems === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-50 text-gray-600 hover:bg-blue-100 hover:text-blue-700"
            } transition-all duration-200`}
            aria-label="Last page"
          >
            <ChevronLast size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaginationComponent;
