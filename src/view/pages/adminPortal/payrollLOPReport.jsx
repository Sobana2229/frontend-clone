import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, CaretLeft, CaretRight } from "@phosphor-icons/react";
import dayjs from "dayjs";
import PeriodPickerWithQuickOptions from "../../component/reports/PeriodPickerWithQuickOptions";
import reportStoreManagements from "../../../store/tdPayroll/report";
import authStoreManagements from "../../../store/tdPayroll/auth";

function PayrollLOPReport() {
  const navigate = useNavigate();
  const { fetchDataReport, dataPayrollLopReport, loading, error } = reportStoreManagements();
  const { user } = authStoreManagements();
  const today = dayjs();
  const [selectedPeriod, setSelectedPeriod] = useState(
    today.format("YYYY-MM")
  );

  const [searchQuery, setSearchQuery] = useState("");

  // Report data from API
  const [reportData, setReportData] = useState({
    organizationName: "",
    startDate: today.startOf("month"),
    endDate: today.endOf("month"),
    employees: [],
  });

  useEffect(() => {
    const fetchReportData = async () => {
      const access_token = localStorage.getItem("accessToken");
      if (!access_token) return;
      
      const periodDate = dayjs(selectedPeriod);
      const dateRange = {
        startDate: periodDate.startOf("month").format("YYYY-MM-DD"),
        endDate: periodDate.endOf("month").format("YYYY-MM-DD")
      };
      
      try {
        await fetchDataReport(access_token, dateRange, "payroll-lop-report", searchQuery);
      } catch (error) {
        // console.error("Failed to fetch payroll LOP report:", error);
      }
    };
    
    fetchReportData();
  }, [selectedPeriod, searchQuery]);

  // Update report data when API data changes
  useEffect(() => {
    if (dataPayrollLopReport) {
      const periodDate = dayjs(selectedPeriod);
      setReportData({
        organizationName: user?.organization?.organizationDetail?.name, // You might want to get this from API or context
        startDate: periodDate.startOf("month"),
        endDate: periodDate.endOf("month"),
        employees: dataPayrollLopReport?.map((employee, index) => ({
          id: employee.employeeUuid || index,
          name: `${employee.employeeName} - ${employee.employeeId}`,
          initials: getInitials(employee.employeeName),
          totalDays: employee.totalDays,
          lossOfPay: employee.lopDays,
          encashedDays: employee.absent, // Using absent as encashed days based on table structure
          paidDays: employee.paidDay,
        })),
      });
    }
  }, [dataPayrollLopReport, selectedPeriod]);

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    const periodDate = dayjs(period);
    const startDate = periodDate.startOf("month");
    const endDate = periodDate.endOf("month");
    setReportData((prev) => ({
      ...prev,
      startDate,
      endDate,
    }));
  };

  const formatPeriodDisplay = (period) => {
    if (!period) return "Select Month";
    const periodDate = dayjs(period);
    const currentMonth = dayjs();
    const prevMonth = currentMonth.subtract(1, "month");

    if (periodDate.isSame(prevMonth, "month")) {
      return "Previous Month";
    }
    if (periodDate.isSame(currentMonth, "month")) {
      return "Current Month";
    }
    return periodDate.format("MMMM YYYY");
  };

  const handlePreviousPeriod = () => {
    const newPeriod = dayjs(selectedPeriod)
      .subtract(1, "month")
      .format("YYYY-MM");
    handlePeriodSelect(newPeriod);
  };

  const handleNextPeriod = () => {
    const newPeriod = dayjs(selectedPeriod).add(1, "month").format("YYYY-MM");
    handlePeriodSelect(newPeriod);
  };

  const formatDateRange = (startDate, endDate) => {
    return `${startDate.format("DD-MMM-YYYY")} - ${endDate.format(
      "DD-MMM-YYYY"
    )}`;
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="w-full h-full bg-[#F9FAFB] flex flex-col overflow-hidden">
      {/* Sticky Top Bar */}
      <div className="flex-shrink-0 sticky top-0 z-10 bg-[#F9FAFB]">
        <div className="w-full flex items-center justify-between h-16 px-6 border-b border-[#E5E7EB] bg-white">
          <h1 className="text-xl font-medium text-[#111827]">Reports</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-md bg-white">
              <Calendar size={16} className="text-[#6B7280]" />
              <PeriodPickerWithQuickOptions
                selectedPeriod={selectedPeriod}
                onPeriodSelect={handlePeriodSelect}
                formatPeriodDisplay={formatPeriodDisplay}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="w-full p-6 flex-1 flex">
          <div className="w-full flex-1 flex flex-col items-start justify-start bg-white rounded-xl overflow-hidden min-h-[calc(100vh-10rem)]">
            {/* Title Section */}
            <div className="w-full p-6 pb-6 flex-shrink-0">
              <div className="text-center mb-6">
                <h2 className="text-lg font-regular text-[#374151] mb-2">
                  {reportData.organizationName}
                </h2>
                <h3 className="text-xl font-regular text-[#1F2937] mb-4">
                  Payroll LOP Report
                </h3>
                {/* Date Range with Navigation */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handlePreviousPeriod}
                    className="p-1 hover:bg-[#F3F4F6] rounded transition-colors"
                  >
                    <CaretLeft size={16} className="text-[#6B7280]" />
                  </button>
                  <button
                    onClick={handleNextPeriod}
                    className="p-1 hover:bg-[#F3F4F6] rounded transition-colors"
                  >
                    <CaretRight size={16} className="text-[#6B7280]" />
                  </button>
                  <p
                    onClick={() => navigate("/reports/lop-report")}
                    className="text-sm font-regular text-[#4B5563] cursor-pointer hover:text-[#1F87FF] transition-colors"
                  >
                    {formatDateRange(reportData.startDate, reportData.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Table - Full Width */}
            <div className="w-full overflow-x-auto flex-1 flex flex-col">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F5FAFF]">
                    <th className="pl-8 pr-2 py-4 text-left text-sm font-medium text-[#4A9EFF]">
                      EMPLOYEE
                    </th>
                    <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF]">
                      TOTAL DAYS
                    </th>
                    <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF]">
                      LOSS OF PAY
                    </th>
                    <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF]">
                      ABSENT DAYS
                    </th>
                    <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF]">
                      PAID DAYS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.employees.map((employee, index) => (
                    <tr
                      key={employee.id || index}
                      className="bg-white transition-colors hover:bg-[#F9FAFB]"
                    >
                      <td className="pl-8 pr-2 py-3 text-[16px] text-left text-[#374151] border-b border-[#E5E7EB]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#E0F2FE] flex items-center justify-center text-sm font-medium text-[#1F87FF]">
                            {employee.initials || getInitials(employee.name)}
                          </div>
                          <span>
                            {employee.name.includes(" - ") ? (
                              <>
                                {employee.name.split(" - ")[0]}
                                <span className="text-[#6B7280]">
                                  {" "}
                                  - {employee.name.split(" - ")[1]}
                                </span>
                              </>
                            ) : (
                              employee.name
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                        {employee.totalDays}
                      </td>
                      <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                        {employee.lossOfPay}
                      </td>
                      <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                        {employee.encashedDays}
                      </td>
                      <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                        {employee.paidDays}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayrollLOPReport;
