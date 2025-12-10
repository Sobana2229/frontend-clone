import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import zohoStore from "../../../store/zohoStoreManagement";
import LoadingIcon from "../../component/loadingIcon";
import WeeklyNavigator from "../../component/weeklyNavigator";

dayjs.extend(isoWeek);

function TimesheetPage() {
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const { dataTimesheetPayroll, loading, fetchZohoTimesheetPayroll } = zohoStore();
  const [weekOffset, setWeekOffset] = useState(0);
  const baseStart = dayjs().startOf("week").add(2, "day");
  const startDate = baseStart.add(weekOffset * 7, "day");
  const endDate = startDate.add(6, "day");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if(dataTimesheetPayroll?.length === 0){
      const token = localStorage.getItem("zoho_access_token");
      fetchZohoTimesheetPayroll(token, {
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
      }, search);
    }
  }, [pathname]);

  useEffect(() => {
    const token = localStorage.getItem("zoho_access_token");
    fetchZohoTimesheetPayroll(token, {
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
    }, search);
  }, [search]);

  const handleWeekChange = (delta) => {
    const newOffset = weekOffset + delta;
    setWeekOffset(newOffset);

    const newStart = baseStart.add(newOffset * 7, "day");
    const newEnd = newStart.add(6, "day");
    const token = localStorage.getItem("zoho_access_token");

    fetchZohoTimesheetPayroll(token, {
      startDate: newStart.format("YYYY-MM-DD"),
      endDate:   newEnd.format("YYYY-MM-DD"),
    }, search);
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
          isSearch={true}
          setSearch={setSearch}
        />
      </div>
      { (dataTimesheetPayroll?.length <= 0  || dataTimesheetPayroll?.message)? (
        <div className="flex h-full items-center justify-center space-x-5">
          {/* kosong state */}
          <div className="text-center">
            <p className="text-lg font-medium text-gray-600">No Timesheet Payroll data available</p>
            <p className="text-sm text-gray-500">Try selecting a different week</p>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="w-full bg-white">
            {/* header */}
          </div>
          <div className="w-full bg-white">
            <div className="w-full bg-white rounded-lg shadow-sm">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="h-20 w-20">
                      <LoadingIcon color="#3F8DFB" />
                    </div>
                  </div>
                ) : (
                  !dataTimesheetPayroll?.message && (
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th
                            rowSpan={2}
                            className="px-6 py-3 text-left text-sm font-medium text-gray-600 border-[1px] w-1/3"
                          >
                            Employee
                          </th>
                          <th
                            colSpan={3}
                            className="px-6 py-3 text-center text-sm font-medium text-gray-600 border-[1px]"
                          >
                            Regular Time
                          </th>
                        </tr>
                        <tr className="bg-gray-100">
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 border-[1px]">
                            Hours
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 border-[1px]">
                            Rate Per Hour
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 border-[1px]">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataTimesheetPayroll.map((data, idx) => (
                          <tr
                            key={data.employeeId}
                            className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-start space-x-3">
                                <div className="font-medium text-gray-900">
                                  {data.employeeId}
                                </div>
                                <div className="text-gray-600">
                                  {data.employeeDisplayName}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-left text-gray-800 border-[1px]">
                              {data.regularHours}
                            </td>
                            <td className="px-6 py-4 text-left text-gray-800 border-[1px]">
                              {data.ratePerHour}
                            </td>
                            <td className="px-6 py-4 text-left text-gray-800 border-[1px]">
                              {data.totalAmount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimesheetPage;