import { useState, useEffect, useRef } from "react";
import { CaretLeft, CaretRight, CaretDown } from "@phosphor-icons/react";
import dayjs from "dayjs";

function FinancialYearPicker({ selectedYear, onYearSelect, formatFinancialYear }) {
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [viewYear, setViewYear] = useState(selectedYear || dayjs().year());
  const yearPickerRef = useRef(null);

  // Generate years array (viewYear ± 5 years)
  const years = Array.from({ length: 11 }, (_, i) => viewYear - 5 + i);

  // Handle click outside year picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        yearPickerRef.current &&
        !yearPickerRef.current.contains(event.target)
      ) {
        setShowYearPicker(false);
      }
    };

    if (showYearPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showYearPicker]);

  // Update viewYear when selectedYear changes
  useEffect(() => {
    if (selectedYear) {
      setViewYear(selectedYear);
    }
  }, [selectedYear]);

  // Handle year selection
  const handleYearSelect = (year) => {
    onYearSelect(year);
    setShowYearPicker(false);
  };

  return (
    <div className="relative" ref={yearPickerRef}>
      <button
        type="button"
        onClick={() => {
          setShowYearPicker(!showYearPicker);
          if (selectedYear) {
            setViewYear(selectedYear);
          }
        }}
        className="appearance-none cursor-pointer rounded-lg border border-transparent bg-transparent px-4 py-1.5 pr-9 text-sm font-medium text-[#111827] focus:outline-none flex items-center gap-2"
      >
        <span>{formatFinancialYear(selectedYear)}</span>
        <CaretDown
          size={10}
          className={`transition-transform ${
            showYearPicker ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Year Picker Dropdown */}
      {showYearPicker && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50 w-80">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setViewYear(viewYear - 10)}
              className="p-1 hover:bg-[#F3F4F6] rounded"
            >
              <CaretLeft size={16} className="text-[#6B7280]" />
            </button>
            <span className="text-sm font-medium text-[#111827]">
              {viewYear - 5} - {viewYear + 5}
            </span>
            <button
              type="button"
              onClick={() => setViewYear(viewYear + 10)}
              className="p-1 hover:bg-[#F3F4F6] rounded"
            >
              <CaretRight size={16} className="text-[#6B7280]" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {years.map((year) => {
                const isSelected = selectedYear === year;
                const isCurrentYear = dayjs().year() === year;

                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearSelect(year)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isSelected
                        ? "bg-[#1F87FF] text-white"
                        : isCurrentYear
                        ? "bg-[#F5FAFF] text-[#1F87FF] hover:bg-[#E0F2FE]"
                        : "text-[#111827] hover:bg-[#F3F4F6]"
                    }`}
                  >
                    {formatFinancialYear(year)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinancialYearPicker;

