import { Link } from "react-router-dom";
import { 
  CurrencyDollar, 
  Scales, 
  Coins, 
  Eye, 
  User, 
  Calendar, 
  PersonSimpleWalk, 
  File,
  ArrowRight
} from "@phosphor-icons/react";
import { reportSections } from "../../../../data/dummy";
import HeaderReusable from "../../component/setting/headerReusable";
import AttandancePage from "./attandancePage";

function ReportPages() {
  const getReportPath = (item) => {
    // Map report items to their routes
    const reportRoutes = {
      "Payroll Journal Summary": "/reports/payroll-journal-summary",
      "Payroll Summary": "/reports/payroll-summary",
      "Pay Summary": "/reports/pay-summary",
      "Payroll LOP Report": "/reports/leave-reports/payroll-lop-report",
      "LOP Report": "/reports/lop-report",
      "Loan Outstanding Summary": "/reports/loan-outstanding-summary",
      "Loan Overall Summary": "/reports/loan-overall-summary",
      "Leave Encashment Report": "/reports/leave-reports",
      "Leave type based summary Report":
        "/reports/leave-reports/type-based-summary",
      "Leave summary Report": "/reports/leave-reports/leave-summary-report",
      "Leave Balance Report": "/reports/leave-reports",
      "Advance Salary Outstanding Summary":
        "/reports/advance-salary-outstanding-summary",
      "Advance Salary Overall Summary":
        "/reports/advance-salary-overall-summary",
      // Add more routes as needed
    };
    return reportRoutes[item] || "#";
  };

  const getCategoryIcon = (title) => {
    const iconMap = {
      "Payroll Overview": CurrencyDollar,
      "Statutory Reports": Scales,
      "Loan Reports": Coins,
      "Advance Salary Reports": Eye,
      "Employee Reports": User,
      "Attendance Reports": Calendar,
      "Leave Reports": PersonSimpleWalk,
      "Files": File,
    };
    const IconComponent = iconMap[title] || File;
    return <IconComponent size={20} className="text-[#9CA3AF]" />;
  };

  return (
    <div className="w-full h-full bg-[#F9FAFB] flex flex-col overflow-hidden">
      {/* Sticky Top Bar */}
      <div className="flex-shrink-0 sticky top-0 z-10 bg-[#F9FAFB]">
        <HeaderReusable title="Reports" />
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full h-full p-6">
          <div className="w-full h-full flex-col flex items-start justify-start bg-white rounded-xl">
            <div className="w-full p-5">
              <div className="grid grid-cols-4 gap-8">
                {reportSections.map((section, idx) => (
                  <div key={idx}>
                    <div className="flex items-center gap-2 mb-4">
                      {getCategoryIcon(section.title)}
                      <h3 className="text-lg font-regular text-[#111827]">{section.title}</h3>
                    </div>
                    <ul className="space-y-0">
                      {section.items.map((item, itemIdx) => {
                        const reportPath = getReportPath(item);
                        const isLink = reportPath !== "#";
                        const isLastItem = itemIdx === section.items.length - 1;
                        
                        return (
                          <li key={itemIdx}>
                            <div className="flex items-center gap-2 py-2">
                              <ArrowRight size={13} className="text-[#9CA3AF] flex-shrink-0" />
                              {isLink ? (
                                <Link
                                  to={reportPath}
                                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex-1 px-4"
                                >
                                  {item}
                                </Link>
                              ) : (
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex-1 px-4">
                                  {item}
                                </a>
                              )}
                            </div>
                            {!isLastItem && (
                              <div className="flex items-center">
                                <div className="flex-1 h-px">
                                  <svg 
                                    width="100%" 
                                    height="1" 
                                    viewBox="0 0 235 1" 
                                    fill="none" 
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="none"
                                  >
                                    <line x1="0" y1="0.5" x2="235" y2="0.5" stroke="#D1D5DB" strokeDasharray="4 4"/>
                                  </svg>
                                </div>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportPages;
