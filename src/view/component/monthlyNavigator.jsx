import React from "react";

const MonthlyNavigator = ({ startDate, endDate, onMonthChange, filter, setIsDays, isDays }) => {
  const changesFilterHourDays = (type) => {
    setIsDays?.(type === "day");
  };

  return (
    <div className="flex items-center justify-between px-10 py-4 rounded">
      <div className=""></div>
      <div className="flex items-center justify-center">
        <button
          onClick={() => onMonthChange(-1)}
          className="text-gray-600 px-3 text-2xl"
        >
          &lt;
        </button>

        <div className="mx-6 text-center">
          <div className="font-semibold text-lg">
            {startDate.format("MMMM YYYY")}
          </div>
        </div>

        <button
          onClick={() => onMonthChange(1)}
          className="text-gray-600 px-3 text-2xl"
        >
          &gt;
        </button>
      </div>
      <div className="space-x-2">
        {filter === "dayHour" && (
          <>
            <button
              onClick={() => changesFilterHourDays("day")}
              className={`px-3 py-1 rounded ${isDays ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"}`}
            >
              Day
            </button>
            <button
              onClick={() => changesFilterHourDays("hour")}
              className={`px-3 py-1 rounded ${!isDays ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"}`}
            >
              Hour
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MonthlyNavigator;