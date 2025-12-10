import { useState, useEffect, useRef } from "react";
import { CaretLeft, CaretRight, CaretDown } from "@phosphor-icons/react";
import dayjs from "dayjs";

function PeriodPicker({ selectedPeriod, onPeriodSelect, formatPeriodDisplay }) {
  const [showPeriodPicker, setShowPeriodPicker] = useState(false);
  const [currentView, setCurrentView] = useState("month"); // "month" or "year"
  const [viewYear, setViewYear] = useState(dayjs().year());
  const periodPickerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Generate months array
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Generate years array (viewYear ± 5 years)
  const years = Array.from({ length: 11 }, (_, i) => viewYear - 5 + i);

  // Calculate dropdown position when opened and update on scroll/resize
  useEffect(() => {
    if (showPeriodPicker && periodPickerRef.current) {
      const updatePosition = () => {
        if (periodPickerRef.current) {
          const rect = periodPickerRef.current.getBoundingClientRect();
          setDropdownPosition({
            top: rect.bottom + window.scrollY + 8, // 8px for mt-2
            left: rect.left + window.scrollX,
          });
        }
      };

      // Initial position
      updatePosition();

      // Update on scroll or resize
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [showPeriodPicker]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showPeriodPicker &&
        periodPickerRef.current &&
        dropdownRef.current &&
        !periodPickerRef.current.contains(event.target) &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowPeriodPicker(false);
        setCurrentView("month");
      }
    };

    if (showPeriodPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPeriodPicker]);

  // Handle period selection
  const handlePeriodSelect = (year, month) => {
    const selectedDate = dayjs(`${year}-${String(month).padStart(2, "0")}-01`);
    onPeriodSelect(selectedDate.format("YYYY-MM"));
    // Close dropdown after selection
    setShowPeriodPicker(false);
    setCurrentView("month");
  };

  return (
    <div className="relative" ref={periodPickerRef}>
      <button
        type="button"
        onClick={() => {
          setShowPeriodPicker(!showPeriodPicker);
          if (selectedPeriod) {
            setViewYear(dayjs(selectedPeriod).year());
          }
        }}
        className="appearance-none cursor-pointer rounded-lg border border-transparent bg-transparent px-0 py-0 pr-0 text-sm font-semibold text-[#111827] focus:outline-none flex items-center gap-2"
      >
        <span className="font-semibold">
          {formatPeriodDisplay(selectedPeriod)}
        </span>
        <CaretDown
          size={10}
          className={`transition-transform text-[#9CA3AF] ${
            showPeriodPicker ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Period Picker Dropdown */}
      {showPeriodPicker && (
        <div
          ref={dropdownRef}
          className="fixed bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-[9999] w-80"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
            {currentView === "month" ? (
              <>
                <button
                  type="button"
                  onClick={() => setViewYear(viewYear - 1)}
                  className="p-1 hover:bg-[#F3F4F6] rounded"
                >
                  <CaretLeft size={16} className="text-[#6B7280]" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView("year")}
                  className="text-sm font-medium text-[#111827] hover:text-[#1F87FF] px-3 py-1"
                >
                  {viewYear}
                </button>
                <button
                  type="button"
                  onClick={() => setViewYear(viewYear + 1)}
                  className="p-1 hover:bg-[#F3F4F6] rounded"
                >
                  <CaretRight size={16} className="text-[#6B7280]" />
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {currentView === "month" ? (
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => {
                  const monthIndex = index + 1;
                  const isSelected =
                    selectedPeriod &&
                    dayjs(selectedPeriod).year() === viewYear &&
                    dayjs(selectedPeriod).month() === index;
                  const isCurrentMonth =
                    dayjs().year() === viewYear && dayjs().month() === index;

                  return (
                    <button
                      key={month}
                      type="button"
                      onClick={() => handlePeriodSelect(viewYear, monthIndex)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isSelected
                          ? "bg-[#1F87FF] text-white"
                          : isCurrentMonth
                          ? "bg-[#F5FAFF] text-[#1F87FF] hover:bg-[#E0F2FE]"
                          : "text-[#111827] hover:bg-[#F3F4F6]"
                      }`}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {years.map((year) => {
                  const isSelected =
                    selectedPeriod && dayjs(selectedPeriod).year() === year;
                  const isCurrentYear = dayjs().year() === year;

                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        setViewYear(year);
                        setCurrentView("month");
                      }}
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PeriodPicker;
