import { CaretLeft, CaretRight } from "@phosphor-icons/react";

function PaginationPages({ totalPages = 0, currentPage = 1, setCurrentPage }) {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPages = 7;
    const range = 1;
    let startPage = Math.max(1, currentPage - range);
    let endPage = Math.min(totalPages, currentPage + range);

    if (totalPages <= maxPages) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    }

    if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
            pageNumbers.push("...");
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div 
        className="h-7 w-fit flex rounded-lg overflow-hidden space-x-2"
    >
        {/* Previous button */}
        <button
            className={`w-7 h-full shadow-sm flex items-center justify-center rounded-md`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
        >
            <CaretLeft size={15} weight="fill" className={`${currentPage === 1 ? "text-white" : "text-gray-300"}`} />
        </button>

        {/* Page numbers */}
        {renderPageNumbers().map((page, index) => (
            <button
                key={index}
                className={`w-7 h-full shadow-sm flex items-center justify-center rounded-md ${currentPage == page ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => typeof page === "number" && handlePageChange(page)}
            >
                {page}
            </button>
        ))}

        {/* Next button */}
        <button
            className="w-7 h-full shadow-sm flex items-center justify-center rounded-md"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
        >
            <CaretRight size={15} weight="fill" className={`${currentPage !== totalPages ? "text-white" : "text-gray-300"}`} />
        </button>
    </div>
  );
}

export default PaginationPages;
