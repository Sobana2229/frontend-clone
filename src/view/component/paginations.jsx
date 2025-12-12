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

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 6) {
      // Show all pages if total is 6 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-10 py-5 bg-white w-full" style={{ height: '86px' }}>
      {/* Left side: Rows per page */}
      <div className="flex items-center gap-5">
        <span className="text-sm leading-[22px] font-normal" style={{ 
          fontFamily: 'Inter',
          color: 'rgba(28, 28, 28, 0.4)'
        }}>
          Showing
        </span>
        <div className="relative">
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="appearance-none bg-white text-sm leading-[22px] font-light px-3 py-3 pr-9 rounded-[10px] cursor-pointer"
            style={{
              fontFamily: 'Lexend',
              color: '#1C1C1C',
              border: '1px solid rgba(162, 161, 168, 0.2)',
              width: '76px',
              height: '46px'
            }}
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Center: Showing X to Y of Z records */}
      <div className="text-sm leading-[22px] font-normal text-center" style={{ 
        fontFamily: 'Inter',
        color: 'rgba(28, 28, 28, 0.4)'
      }}>
        Showing {startRecord} to {endRecord} out of {totalRecords} records
      </div>

      {/* Right side: Pagination buttons */}
      <div className="flex items-center gap-[10px]">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-6 h-6 flex items-center justify-center disabled:opacity-40"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-[25px]">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <div key={`ellipsis-${index}`} className="flex items-center justify-center text-sm leading-[22px] font-light" style={{
                fontFamily: 'Lexend',
                color: 'rgba(28, 28, 28, 0.6)',
                width: '30px',
                height: '36px',
                letterSpacing: '6px'
              }}>
                . . 
              </div>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className="flex items-center justify-center text-sm leading-[22px]"
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: currentPage === page ? 600 : 300,
                  color: currentPage === page ? '#1C1C1C' : 'rgba(28, 28, 28, 0.6)',
                  backgroundColor: currentPage === page ? 'rgba(28, 28, 28, 0.05)' : '#FFFFFF',
                  width: currentPage === page ? '35px' : '32px',
                  height: '36px',
                  padding: '7px 12px',
                  borderRadius: '8px'
                }}
              >
                {page}
              </button>
            )
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-6 h-6 flex items-center justify-center disabled:opacity-40"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TablePagination;