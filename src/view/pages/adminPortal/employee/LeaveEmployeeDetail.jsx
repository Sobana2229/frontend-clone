import { useState } from "react";
import HeaderEmployeeDetail from "../../../component/employee/headerEmployeeDetail";
import LeaveEmployee from "../../../component/employee/leaveEmployee";
import LeaveHistorySection from "../../../component/employee/leaveEmployeeDetail/LeaveHistorySection";
import HolidayEmployee from "../../../component/employee/holidayEmployee";
import employeeStoreManagements from "../../../../store/tdPayroll/employee";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import authStoreManagements from "../../../../store/tdPayroll/auth";
import { checkPermission } from "../../../../../helper/globalHelper";

const leaveSummaryData = [
  {
    type: "Casual Leave",
    icon: "🌅",
    available: 12,
    booked: 0,
    total: 12,
    bg: "bg-blue-50",
  },
  {
    type: "Compensatory Off",
    icon: "CO",
    available: 0,
    booked: 0,
    total: 0,
    bg: "bg-green-50",
  },
  {
    type: "Earned Leave",
    icon: "⏰",
    available: 12,
    booked: 0,
    total: 12,
    bg: "bg-cyan-50",
  },
  {
    type: "Leave Without Pay",
    icon: "🌅",
    available: 0,
    booked: 0,
    total: 0,
    bg: "bg-red-50",
  },
  {
    type: "Sick Leave",
    icon: "🩺",
    available: 12,
    booked: 0,
    total: 12,
    bg: "bg-blue-50",
  },
  {
    type: "Paid Leave 1",
    icon: "🌅",
    available: 11.5,
    booked: 0,
    total: 11.5,
    bg: "bg-yellow-50",
  }
];

function LeaveEmployeeDetail({}) {
  const [activeTab, setActiveTab] = useState("Leave Summary");
  const { user } = authStoreManagements();
  const { fetchEmployeePersonalDetail, dataEmployeePersonalDetail } = employeeStoreManagements();
  const { id } = useParams();
  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");
    fetchEmployeePersonalDetail(access_token, id);
  }, [id]);

  return (
    <div className="w-full h-full flex flex-col items-start justify-start p-5">
      <div className="w-full bg-white p-5 px-10 rounded-xl space-y-10">
        {dataEmployeePersonalDetail && (
          <HeaderEmployeeDetail dataEmployeePersonalDetail={dataEmployeePersonalDetail} />
        )}

        {/* Menu Tabs */}
        <div className="flex items-center justify-between space-x-5 mt-4">
          <div className="flex items-center justify-start space-x-5">
            <button
              className={`px-4 py-2 rounded-full font-medium focus:outline-none ${
                activeTab === "Leave Summary"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 bg-gray-100"
              }`}
              onClick={() => setActiveTab("Leave Summary")}
            >
              Leave Summary
            </button>
            <button
              className={`px-4 py-2 rounded-full font-medium focus:outline-none ${
                activeTab === "t"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 bg-gray-100"
              }`}
              onClick={() => setActiveTab("t")}
            >
              t
            </button>
            <button
              className={`px-4 py-2 rounded-full font-medium focus:outline-none ${
                activeTab === "Holiday"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 bg-gray-100"
              }`}
              onClick={() => setActiveTab("Holiday")}
            >
              Holiday
            </button>
          </div>

          {activeTab === "Leave Summary" && (
            <button className="ml-auto px-6 py-2 rounded-md bg-blue-500 text-white font-medium">
              Apply Leave
            </button>
          )}
        </div>

        {activeTab === "Leave Summary" && (
          <>
            {/* Leave Cards */}
            {checkPermission(user, "Leave", "View") ? (
              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  {leaveSummaryData.map((leave, idx) => (
                    <div key={idx} className={`rounded-xl shadow-sm p-6 flex flex-col ${leave.bg}`}>
                      <div className="text-3xl mb-3">{leave.icon}</div>
                      <div className="font-semibold mb-2">{leave.type}</div>
                      <div className="text-sm space-y-1">
                        <div><span className="text-gray-500">Available</span>: {leave.available}</div>
                        <div><span className="text-gray-500">Booked</span>: {leave.booked}</div>
                        <div><span className="text-gray-500">Total</span>: {leave.total}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <LeaveHistorySection />
              </div>
            ) : (
              <p>No data available</p>
            )}
          </>
        )}

        {activeTab === "Leave Request" && (
          <LeaveEmployee fetchType={"all"} />
        )}

        {activeTab === "Holiday" && (
          <HolidayEmployee />
        )}
      </div>
    </div>
  );
}

export default LeaveEmployeeDetail;
