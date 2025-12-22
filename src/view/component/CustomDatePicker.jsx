import React, { forwardRef } from "react";
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
          borderRadius: "6px"
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

/* ---------------- Date Picker ---------------- */

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
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat={dateFormat}
      placeholderText={placeholder}
      customInput={
        <CustomInput
          isBorderLeft={isBorderLeft}
          borderColor={borderColor}
        />
      }
      minDate={minDate}
      maxDate={maxDate}
      showPopperArrow={false}
      calendarClassName="custom-calendar"
      popperPlacement="bottom-start"
    />
  );
};

export default CustomDatePicker;
