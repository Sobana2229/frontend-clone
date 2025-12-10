import React from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { MagnifyingGlass } from "@phosphor-icons/react";
dayjs.extend(isoWeek);

const WeeklyNavigator = ({ startDate, endDate, onWeekChange, filter, setIsDays, isDays, isSearch=false, setSearch }) => {
  const changesFilterHourDays = (type) => {
    setIsDays(type === "day");
  };
  return (
    <div className="flex items-center justify-between px-10 py-4 rounded">
      <div className="">
        {isSearch && (
          <>
            <div className="w-[250px] flex items-center justify-center py-1.5 px-2 rounded-md space-x-3 bg-[#EDEDF7] border-[1px]">
              <MagnifyingGlass />
              <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder="search by employee id..." className="w-full bg-transparent focus:ring-0 outline-none text-sm" />
            </div>
          </>
        )}
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={() => onWeekChange(-1)}
          className="text-gray-600 px-3 text-2xl"
        >
          &lt;
        </button>

        <div className="mx-6 text-center">
          <div className="font-semibold text-lg">
            {startDate.format("DD-MMM-YYYY")} - {endDate.format("DD-MMM-YYYY")}
          </div>
        </div>

        <button
          onClick={() => onWeekChange(+1)}
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

export default WeeklyNavigator;