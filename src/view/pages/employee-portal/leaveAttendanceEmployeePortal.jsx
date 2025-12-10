import { useState } from "react";
import AttendanceCalender from "../../component/employee/attendanceCalender";
import RegulationEmployee from "../../component/employee/regulationEmployee";
import LeaveEmployee from "../../component/employee/leaveEmployee";

function LeaveAttendanceEmployeePortal({employeeUuid, type}) {
  const [activeTab, setActiveTab] = useState("Attendance Summary");
  const [activeSubTab, setActiveSubTab] = useState("Tracking"); // default

  const tabs = [
    { id: "leave", label: "Leave Summary" },
    { id: "attendance", label: "Attendance Summary" },
  ];

  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="w-full h-full overflow-y-auto">
        <div className="w-full h-full bg-white shadow-sm">
          {/* Tab Navigation */}
          {!employeeUuid && (
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.label)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                      ${
                        activeTab === tab.label
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          ) }

          {/* Tab Content */}
          <div 
            className="
            flex flex-grow flex-col
            h-full p-6
            bg-gray-100 
            "
          >
            {activeTab === "Attendance Summary" && (
              <div
                className="w-full h-full 
                flex flex-grow flex-col items-start justify-start 
                overflow-hidden
                "
              >
                {/* Toggle Tracking / Regularization */}
                <div 
                  className="
                    flex items-center 
                    bg-gray-100 rounded-full 
                    w-fit p-1
                  "
                >
                  <button
                    onClick={() => setActiveSubTab("Tracking")}
                    className={`px-4 py-2 text-sm rounded-full transition
                      ${
                        activeSubTab === "Tracking"
                          ? "bg-white shadow text-black"
                          : "text-gray-500"
                      }`}
                  >
                    Tracking
                  </button>
                  <button
                    onClick={() => setActiveSubTab("Regularization")}
                    className={`px-4 py-2 text-sm rounded-full transition
                      ${
                        activeSubTab === "Regularization"
                          ? "bg-white shadow text-black"
                          : "text-gray-500"
                      }`}
                  >
                    Regularization
                  </button>
                </div>

                {/* Subtab Content */}
                {activeSubTab === "Tracking" && (
                  <AttendanceCalender isEmployeePortal={employeeUuid ? false : true} employeeUuid={employeeUuid} />
                )}
                {activeSubTab === "Regularization" && <RegulationEmployee employeeUuid={employeeUuid} type={type} />}
              </div>
            )}

            {activeTab === "Leave Summary" && <LeaveEmployee employeeUuid={employeeUuid} type={type} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveAttendanceEmployeePortal;