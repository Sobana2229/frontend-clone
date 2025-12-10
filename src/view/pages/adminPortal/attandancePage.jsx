import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import zohoStore from "../../../store/zohoStoreManagement";
import LoadingIcon from "../../component/loadingIcon";
import WeeklyNavigator from "../../component/weeklyNavigator";
import TableReusable from "../../component/tableReusable";
import TableReusableStikcyRows from "../../component/tableReusableStickyRows";
import reportStoreManagements from "../../../store/tdPayroll/report";

dayjs.extend(isoWeek);

function AttandancePage() {
  const {pathname} = useLocation();
  const { } = zohoStore();
  const { dataAttandancePayroll, loading, fetchDataReport } = reportStoreManagements();
  const [weekOffset, setWeekOffset] = useState(0);
  const baseStart = dayjs().startOf("week");
  const startDate = baseStart.add(weekOffset * 7, "day");
  const endDate = startDate.add(6, "day");
  const [isDays, setIsDays] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if(dataAttandancePayroll?.length === 0){
      const token = localStorage.getItem("accessToken");
      fetchDataReport(token, {
        startDate: startDate.format("DD-MMM-YYYY"),
        endDate: endDate.format("DD-MMM-YYYY"),
      }, "attandance", search);
    }
  }, [pathname]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    fetchDataReport(token, {
      startDate: startDate.format("DD-MMM-YYYY"),
      endDate: endDate.format("DD-MMM-YYYY"),
    }, "attandance", search);
  }, [search]);

  const handleWeekChange = (delta) => {
    const newOffset = weekOffset + delta;
    setWeekOffset(newOffset);

    const newStart = baseStart.add(newOffset * 7, "day");
    const newEnd = newStart.add(6, "day");
    const token = localStorage.getItem("accessToken");

    fetchDataReport(token, {
      startDate: newStart.format("DD-MMM-YYYY"),
      endDate: newEnd.format("DD-MMM-YYYY"),
    }, "attandance", search);
  };

  return (
    <div
      className={`w-full h-screen flex flex-col pt-14 px-2`}
    >
      <div className="w-full">
        <WeeklyNavigator
          startDate={startDate}
          endDate={endDate}
          onWeekChange={handleWeekChange}
          filter="dayHour"
          setIsDays={setIsDays}
          isDays={isDays}
          isSearch={true}
          setSearch={setSearch}
        />
      </div>
      { (dataAttandancePayroll?.formatingDatahour?.length <= 0 || dataAttandancePayroll?.message) ? (
        <div className="flex h-full items-center justify-center space-x-5">
          {/* Empty state */}
          <div className="text-center">
            <p className="text-lg font-medium text-gray-600">No attendance data available</p>
            <p className="text-sm text-gray-500">Try selecting a different week</p>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="w-full bg-white">
            <div className="w-full bg-white rounded-lg shadow-sm">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="h-20 w-20">
                    <LoadingIcon color="#3F8DFB" />
                  </div>
                </div>
              ) : (
                !dataAttandancePayroll?.message && (
                  !isDays ? (
                    <div className="w-full flex relative">
                      <TableReusableStikcyRows data={dataAttandancePayroll} tableFor="attandanceHour" />
                      <TableReusable data={dataAttandancePayroll} tableFor="attandanceHour" />
                    </div>
                  ) : (
                    <div className="w-full flex relative">
                      <TableReusableStikcyRows data={dataAttandancePayroll?.formatingDataDay} tableFor="attandanceDay" />
                      <TableReusable data={dataAttandancePayroll?.formatingDataDay} tableFor="attandanceDay" />
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttandancePage;