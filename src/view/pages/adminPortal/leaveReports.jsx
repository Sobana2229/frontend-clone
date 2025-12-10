import { Link } from "react-router-dom";
import { PersonSimpleWalk, ArrowRight } from "@phosphor-icons/react";
import HeaderReusable from "../../component/setting/headerReusable";

const leaveReportItems = [
  "Payroll LOP Report",
  "LOP Report",
  "Leave Encashment Report",
  "Leave type based summary Report",
  "Leave summary Report",
  "Leave Balance Report",
];

function LeaveReports() {
  const getReportPath = (item) => {
    // Map report items to their routes
    const reportRoutes = {
      "Payroll LOP Report": "/reports/leave-reports/payroll-lop-report",
      "LOP Report": "/reports/lop-report",
      // Add more routes as needed
    };
    return reportRoutes[item] || "#";
  };

  return (
    <div className="w-full h-full bg-[#F9FAFB] flex flex-col overflow-hidden">
      {/* Sticky Top Bar */}
      <div className="flex-shrink-0 sticky top-0 z-10 bg-[#F9FAFB]">
        <HeaderReusable title="Leave Reports" />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="w-full p-6 flex-1 flex min-h-full">
          <div className="w-full flex-1 flex flex-col items-start justify-start bg-white rounded-xl min-h-full">
            <div className="w-full p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <PersonSimpleWalk size={20} className="text-[#9CA3AF]" />
                <h3 className="text-lg font-regular text-[#111827]">
                  Leave Reports
                </h3>
              </div>
              <ul className="space-y-0">
                {leaveReportItems.map((item, itemIdx) => {
                  const reportPath = getReportPath(item);
                  const isLink = reportPath !== "#";
                  const isLastItem = itemIdx === leaveReportItems.length - 1;

                  return (
                    <li key={itemIdx}>
                      <div className="flex items-center gap-2 py-2">
                        <ArrowRight
                          size={13}
                          className="text-[#9CA3AF] flex-shrink-0"
                        />
                        {isLink ? (
                          <Link
                            to={reportPath}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex-1 px-4"
                          >
                            {item}
                          </Link>
                        ) : (
                          <a
                            href="#"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex-1 px-4"
                          >
                            {item}
                          </a>
                        )}
                      </div>
                      {!isLastItem && (
                        <div className="flex items-center">
                          <div className="flex-1 h-px border-t border-dashed border-[#D1D5DB]"></div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveReports;
