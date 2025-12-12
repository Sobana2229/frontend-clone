import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useState } from "react";

function TablePagination({ totalRecords = 100, rowsPerPageOptions = [10, 20, 50, 100] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const totalPages = Math.ceil(totalRecords / rowsPerPage);
  const startRecord = (currentPage - 1) * rowsPerPage + 1;
  const endRecord = Math.min(currentPage * rowsPerPage, totalRecords);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 w-full">
      {/* Left side: Rows per page */}
      <div className="flex items-center space-x-2">
        <span className="text-gray-600 text-sm">Showing</span>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Center: Showing X to Y of Z records */}
      <div className="text-gray-600 text-sm text-center">
        Showing {startRecord} to {endRecord} of {totalRecords} records
      </div>

      {/* Right side: Pagination buttons */}
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-8 h-8 flex items-center justify-center rounded border ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <CaretLeft size={15} weight="bold" />
        </button>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded border text-sm ${
              currentPage === page
                ? "bg-grey-300 text-grey-500 border-grey-500"
                : "bg-white text-gray-600 hover:bg-gray-50 border-gray-300"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`w-8 h-8 flex items-center justify-center rounded border ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <CaretRight size={15} weight="bold" />
        </button>
      </div>
    </div>
  );
}

export default TablePagination;
