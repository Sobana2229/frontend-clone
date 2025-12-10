import { CaretLeft, CaretRight } from "@phosphor-icons/react";

function TablePagination({
  currentPage = 1,
  totalPages = 1,
  onPrevious,
  onNext,
  disabled = false,
}) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;

  return (
    <div className="flex items-center gap-2">
      {/* Previous Button - Left */}
      <button
        onClick={onPrevious}
        disabled={isFirstPage || disabled}
        className={`
          flex items-center justify-center
          w-10 h-10
          rounded-lg
          transition-colors
          ${
            isFirstPage || disabled
              ? "bg-[#E0F2FE] cursor-not-allowed opacity-50"
              : "bg-[#E0F2FE] hover:bg-[#BAE6FD] cursor-pointer"
          }
        `}
      >
        <CaretLeft
          size={20}
          className={
            isFirstPage || disabled ? "text-[#93C5FD]" : "text-[#1F87FF]"
          }
        />
      </button>

      {/* Center Area - Light blue background */}
      <div className="flex-1 h-10 bg-[#E0F2FE] rounded-lg flex items-center justify-center min-w-[120px]">
        <span className="text-[#1F87FF] text-sm font-medium">
          {currentPage} / {totalPages}
        </span>
      </div>

      {/* Next Button - Right */}
      <button
        onClick={onNext}
        disabled={isLastPage || disabled}
        className={`
          flex items-center justify-center
          w-10 h-10
          rounded-lg
          transition-colors
          ${
            isLastPage || disabled
              ? "bg-[#E0F2FE] cursor-not-allowed opacity-50"
              : "bg-[#E0F2FE] hover:bg-[#BAE6FD] cursor-pointer"
          }
        `}
      >
        <CaretRight
          size={20}
          className={
            isLastPage || disabled ? "text-[#93C5FD]" : "text-[#1F87FF]"
          }
        />
      </button>
    </div>
  );
}

export default TablePagination;
