import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarBlank } from "@phosphor-icons/react";
import "./CustomDatePicker.css";

/* ---------------- Custom Input ---------------- */
const CustomInput = forwardRef(
  ({ value, onClick, placeholder, isBorderLeft, borderColor }, ref) => {
    const getBorderColor = () => {
      if (borderColor === "red-td-500") return "#dc2626";
      return borderColor || "#d1d5db";
    };

    return (
      <div
        ref={ref}
        onClick={onClick}
        className="relative w-full"
        style={{
          borderLeft: isBorderLeft ? `6px solid ${getBorderColor()}` : "none",
          borderTop: "1px solid #d1d5db",
          borderRight: "1px solid #d1d5db",
          borderBottom: "1px solid #d1d5db",
          borderRadius: "6px",
        }}
      >
        <input
          type="text"
          value={value || ""}
          placeholder={placeholder}
          readOnly
          className="w-full h-[42px] px-3 pr-10 bg-white text-sm text-gray-900 cursor-pointer focus:outline-none"
          style={{ border: "none", borderRadius: "6px" }}
        />

        <CalendarBlank
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
    );
  }
);

/* ---------------- Custom Date Picker ---------------- */
const CustomDatePicker = ({
  selected,
  onChange,
  placeholder = "Select Date",
  isBorderLeft = false,
  borderColor = "border-red-500",
  minDate = null,
  maxDate = null,
  dateFormat = "dd/MM/yyyy",
}) => {
  const [showMonthGrid, setShowMonthGrid] = useState(false);
  const [showYearGrid, setShowYearGrid] = useState(false);
  const [yearRangeStart] = useState(new Date().getFullYear() - 10);

  const months = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun",
    "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec",
  ];

  const getYears = () => {
    let years = [];
    for (let i = yearRangeStart; i < yearRangeStart + 20; i++) {
      years.push(i);
    }
    return years;
  };

  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat={dateFormat}
      placeholderText={placeholder}
      customInput={
        <CustomInput isBorderLeft={isBorderLeft} borderColor={borderColor} />
      }
      minDate={minDate}
      maxDate={maxDate}
      showPopperArrow={false}
      calendarClassName="custom-calendar"
      popperPlacement="bottom-start"
      renderCustomHeader={({
        date,
        changeMonth,
        changeYear,
        decreaseMonth,
        increaseMonth,
      }) => (
        <div className="custom-header">
          {/* Left Arrow */}
          <button onClick={decreaseMonth} className="nav-btn">
            &lt;
          </button>

          {/* Center Month + Year */}
          <div className="header-center-combined">
            <span
              className="month-part"
              onClick={() => {
                setShowMonthGrid(!showMonthGrid);
                setShowYearGrid(false);
              }}
            >
              {months[date.getMonth()]}
            </span>
            <span
              className="year-part"
              onClick={() => {
                setShowYearGrid(!showYearGrid);
                setShowMonthGrid(false);
              }}
            >
              {date.getFullYear()}
            </span>
          </div>

          {/* Right Arrow */}
          <button onClick={increaseMonth} className="nav-btn">
            &gt;
          </button>

          {/* Month Grid */}
          {showMonthGrid && (
            <div className="month-grid">
              {months.map((m, idx) => (
                <div
                  key={m}
                  className={`month-grid-item ${
                    idx === date.getMonth() ? "selected" : ""
                  }`}
                  onClick={() => {
                    changeMonth(idx);
                    setShowMonthGrid(false);
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          )}

          {/* Year Grid */}
          {showYearGrid && (
            <div className="year-grid">
              {getYears().map((y) => (
                <div
                  key={y}
                  className={`year-grid-item ${
                    y === date.getFullYear() ? "selected" : ""
                  }`}
                  onClick={() => {
                    changeYear(y);
                    setShowYearGrid(false);
                  }}
                >
                  {y}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    />
  );
};

export default CustomDatePicker;
