import { useState } from "react";
import AttendanceCalender from "../../../component/employee/attendanceCalender";
import LeaveAttendanceEmployeePortal from "../../employee-portal/leaveAttendanceEmployeePortal";
import AttendanceEmployeeDetail from "./attendanceEmployeeDetail";
import HeaderEmployeeDetail from "../../../component/employee/headerEmployeeDetail";
import ShiftEmployeeDetail from "./shiftEmployeeDetail";
import employeeStoreManagements from "../../../../store/tdPayroll/employee";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

function ShiftAttendanceEmployeeDetail({}) {
  const [activeTab, setActiveTab] = useState("Shift");
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
                activeTab === "Shift"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 bg-gray-100"
              }`}
              onClick={() => setActiveTab("Shift")}
            >
              Shift
            </button>
            <button
              className={`px-4 py-2 rounded-full font-medium focus:outline-none ${
                activeTab === "Attendance"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 bg-gray-100"
              }`}
              onClick={() => setActiveTab("Attendance")}
            >
              Attendance
            </button>
            <button
              className={`px-4 py-2 rounded-full font-medium focus:outline-none ${
                activeTab === "Regularization"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 bg-gray-100"
              }`}
              onClick={() => setActiveTab("Regularization")}
            >
              Regularization
            </button>
          </div>
        </div>

        {activeTab === "Shift" && (
          <ShiftEmployeeDetail />
        )}

        {activeTab === "Attendance" && (
          <AttendanceEmployeeDetail dataEmployeePersonalDetail={dataEmployeePersonalDetail} />
        )}

        {activeTab === "Regularization" && (
          <AttendanceEmployeeDetail dataEmployeePersonalDetail={dataEmployeePersonalDetail} />
        )}
      </div>
    </div>
  );
}

export default ShiftAttendanceEmployeeDetail;