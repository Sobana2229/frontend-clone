import { useState, useEffect } from "react";
import { Calendar, CaretLeft, CaretRight } from "@phosphor-icons/react";
import dayjs from "dayjs";
import PeriodPickerWithQuickOptions from "../../component/reports/PeriodPickerWithQuickOptions";
import reportStoreManagements from "../../../store/tdPayroll/report";
import authStoreManagements from "../../../store/tdPayroll/auth";

function PaySummary() {
  const { fetchDataReport, dataPaySummaryReport, loading, error } = reportStoreManagements();
  const { user } = authStoreManagements();
  const today = dayjs();
  const [selectedPeriod, setSelectedPeriod] = useState(
    today.format("YYYY-MM")
  );

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
        await fetchDataReport(access_token, dateRange, "pay-summary");
      } catch (error) {
        // console.error("Failed to fetch pay summary report:", error);
      }
    };
    
    fetchReportData();
  }, [selectedPeriod]);

  // Update report data when API data changes
  useEffect(() => {
    if (dataPaySummaryReport) {
      const periodDate = dayjs(selectedPeriod);
      setReportData({
        organizationName: user?.organization?.organizationDetail?.name,
        startDate: periodDate.startOf("month"),
        endDate: periodDate.endOf("month"),
        employees: dataPaySummaryReport?.map((employee, index) => ({
          id: employee.employeeId,
          name: employee.employeeName,
          grossPay: employee.grossPay || 0,
          benefits: employee.benefits || 0,
          deductions: employee.deductions || 0,
          reimbursements: employee.reimbursements || 0,
          netPay: employee.netPay || 0,
        })),
      });
    }
  }, [dataPaySummaryReport, selectedPeriod, user]);

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
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

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "$0.00";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return `$${numValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Calculate totals
  const totals = reportData.employees.reduce(
    (acc, employee) => ({
      grossPay: acc.grossPay + employee.grossPay,
      benefits: acc.benefits + employee.benefits,
      deductions: acc.deductions + employee.deductions,
      reimbursements: acc.reimbursements + employee.reimbursements,
      netPay: acc.netPay + employee.netPay,
    }),
    {
      grossPay: 0,
      benefits: 0,
      deductions: 0,
      reimbursements: 0,
      netPay: 0,
    }
  );

  return (
    <div className="w-full h-full bg-[#F9FAFB] flex flex-col overflow-hidden">
      {/* Sticky Top Bar */}
      <div className="flex-shrink-0 sticky top-0 z-20 bg-[#F9FAFB]">
        <div className="w-full flex items-center justify-between h-16 px-6 border-b border-[#E5E7EB] bg-white">
          <h1 className="text-xl font-medium text-[#111827]">Reports</h1>
          <div className="flex items-center gap-2 relative z-30">
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
                  Pay Summary
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
                  <p className="text-sm font-regular text-[#4B5563]">
                    {formatDateRange(reportData.startDate, reportData.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Table - Full Width */}
            <div className="w-full overflow-x-auto overflow-y-auto flex-1 flex flex-col">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#F5FAFF] border-t border-[#E5E7EB]">
                    <th className="pl-8 pr-2 py-4 text-left text-sm font-medium text-[#4A9EFF] whitespace-nowrap">
                      ID
                    </th>
                    <th className="pl-2 pr-8 py-4 text-left text-sm font-medium text-[#4A9EFF] whitespace-nowrap">
                      NAME
                    </th>
                    <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF] whitespace-nowrap">
                      GROSS PAY
                    </th>
                    <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF] whitespace-nowrap">
                      BENEFITS
                    </th>
                    <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF] whitespace-nowrap">
                      DEDUCTIONS
                    </th>
                    <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF] whitespace-nowrap">
                      REIMBURSEMENTS
                    </th>
                    <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF] whitespace-nowrap">
                      NET PAY
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
                        {employee.id}
                      </td>
                      <td className="pl-2 pr-8 py-3 text-[16px] text-left text-[#374151] border-b border-[#E5E7EB]">
                        {employee.name}
                      </td>
                      <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#4A9EFF] font-medium border-b border-[#E5E7EB]">
                        {formatCurrency(employee.grossPay)}
                      </td>
                      <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                        {formatCurrency(employee.benefits)}
                      </td>
                      <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                        {formatCurrency(employee.deductions)}
                      </td>
                      <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                        {formatCurrency(employee.reimbursements)}
                      </td>
                      <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                        {formatCurrency(employee.netPay)}
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-white">
                    <td className="pl-8 pr-2 py-3 text-[16px] text-left text-[#374151] font-medium border-b border-[#E5E7EB]">
                      Total
                    </td>
                    <td className="pl-2 pr-8 py-3 text-[16px] text-left text-[#374151] border-b border-[#E5E7EB]"></td>
                    <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#4A9EFF] font-medium border-b border-[#E5E7EB]">
                      {formatCurrency(totals.grossPay)}
                    </td>
                    <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                      {formatCurrency(totals.benefits)}
                    </td>
                    <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                      {formatCurrency(totals.deductions)}
                    </td>
                    <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                      {formatCurrency(totals.reimbursements)}
                    </td>
                    <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] font-medium border-b border-[#E5E7EB]">
                      {formatCurrency(totals.netPay)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaySummary;
