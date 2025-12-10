import { useState, useEffect, useRef } from "react";
import {
  CaretLeft,
  CaretRight,
  CaretDown,
} from "@phosphor-icons/react";
import dayjs from "dayjs";

function YearPicker({ selectedYear, onYearSelect, formatYearDisplay }) {
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [viewYear, setViewYear] = useState(dayjs().year());
  const yearPickerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    right: null,
  });

  const years = Array.from({ length: 11 }, (_, i) => viewYear - 5 + i);

  const getQuickOptions = () => {
    const currentYear = dayjs().year();
    const prevYear = currentYear - 1;
    return [
      {
        label: "Previous Year",
        value: prevYear,
      },
      {
        label: "This Year",
        value: currentYear,
      },
    ];
  };

  useEffect(() => {
    if (showYearPicker && yearPickerRef.current) {
      const updatePosition = () => {
        if (yearPickerRef.current) {
          const rect = yearPickerRef.current.getBoundingClientRect();
          const dropdownWidth = 320; // w-80 = 320px
          const viewportWidth = window.innerWidth;
          const spaceOnRight = viewportWidth - rect.right;
          const spaceOnLeft = rect.left;

          // Check if dropdown will be cut off on the right
          if (spaceOnRight < dropdownWidth && spaceOnLeft >= dropdownWidth) {
            // Open to the left (using right positioning)
            setDropdownPosition({
              top: rect.bottom + 8, // fixed positioning is relative to viewport
              left: null,
              right: viewportWidth - rect.right,
            });
          } else {
            // Open to the right (default, using left positioning)
            setDropdownPosition({
              top: rect.bottom + 8, // fixed positioning is relative to viewport
              left: rect.left,
              right: null,
            });
          }
        }
      };

      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [showYearPicker]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showYearPicker &&
        yearPickerRef.current &&
        dropdownRef.current &&
        !yearPickerRef.current.contains(event.target) &&
        !dropdownRef.current.contains(event.target)
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

  const handleYearSelect = (year) => {
    onYearSelect(year);
    setShowYearPicker(false);
  };

  const handleQuickSelect = (value) => {
    onYearSelect(value);
    setShowYearPicker(false);
  };

  const quickOptions = getQuickOptions();

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
        className="appearance-none cursor-pointer rounded-lg border border-transparent bg-transparent px-0 py-0 pr-0 text-sm font-semibold text-[#6B7280] focus:outline-none flex items-center gap-2"
      >
        <span className="font-semibold text-[#6B7280]">
          {formatYearDisplay(selectedYear)}
        </span>
        <CaretDown
          size={10}
          className={`transition-transform text-[#9CA3AF] ${
            showYearPicker ? "rotate-180" : ""
          }`}
        />
      </button>

      {showYearPicker && (
        <div
          ref={dropdownRef}
          className="fixed bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-[9999] w-80"
          style={{
            top: `${dropdownPosition.top}px`,
            ...(dropdownPosition.right !== null
              ? { right: `${dropdownPosition.right}px`, left: "auto" }
              : { left: `${dropdownPosition.left}px`, right: "auto" }),
          }}
        >
          {/* Quick Options: Previous Year & This Year */}
          <div className="p-2 border-b border-[#E5E7EB] grid grid-cols-2 gap-2">
            {quickOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleQuickSelect(option.value)}
                className={`text-center px-3 py-2 text-sm rounded-md hover:bg-[#F3F4F6] transition-colors ${
                  selectedYear === option.value
                    ? "bg-[#F5FAFF] text-[#1F87FF]"
                    : "text-[#111827]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

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
                    {year}
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

export default YearPicker;

