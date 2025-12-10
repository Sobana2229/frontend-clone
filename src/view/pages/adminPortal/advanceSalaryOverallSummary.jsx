import { useState, useEffect } from "react";
import { CaretLeft, CaretRight, Calendar } from "@phosphor-icons/react";
import dayjs from "dayjs";
import TablePagination from "../../component/reports/TablePagination";
import YearPicker from "../../component/reports/YearPicker";

function AdvanceSalaryOverallSummary() {
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Example: 5 items per page

  // Year picker state
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  // Mock data - replace with actual API call
  const [reportData, setReportData] = useState({
    organizationName: "Emaar 4",
    advanceSalaries: [
      {
        id: 1,
        employeeId: "7564646",
        employeeName: "Vabik",
        advanceSalaryNumber: "ADV-00001",
        advanceSalaryName: "Business",
        advanceSalaryAmount: 20000.0,
        advanceSalaryReason: "For Business",
        advanceSalaryStatus: "Open",
      },
      {
        id: 2,
        employeeId: "TEK232",
        employeeName: "Mubeen",
        advanceSalaryNumber: "ADV-00002",
        advanceSalaryName: "Business",
        advanceSalaryAmount: 25000.0,
        advanceSalaryReason: "For Business",
        advanceSalaryStatus: "Open",
      },
      {
        id: 3,
        employeeId: "TEK234",
        employeeName: "Ijlal Alim",
        advanceSalaryNumber: "ADV-00003",
        advanceSalaryName: "Business",
        advanceSalaryAmount: 30000.0,
        advanceSalaryReason: "For Business",
        advanceSalaryStatus: "Open",
      },
      {
        id: 4,
        employeeId: "7564646",
        employeeName: "Vabik",
        advanceSalaryNumber: "ADV-00004",
        advanceSalaryName: "Gold",
        advanceSalaryAmount: 35000.0,
        advanceSalaryReason: "For Family",
        advanceSalaryStatus: "Closed",
      },
      {
        id: 5,
        employeeId: "TEK232",
        employeeName: "Mubeen",
        advanceSalaryNumber: "ADV-00008",
        advanceSalaryName: "Gold",
        advanceSalaryAmount: 10000.0,
        advanceSalaryReason: "For Family",
        advanceSalaryStatus: "Open",
      },
    ],
  });

  useEffect(() => {
    // TODO: Fetch data from API based on selectedYear
    // const fetchReportData = async () => {
    //   const access_token = localStorage.getItem("accessToken");
    //   // API call here with selectedYear
    // };
    // fetchReportData();
  }, [selectedYear]);

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setCurrentPage(1); // Reset to first page when year changes
  };

  const formatYearDisplay = (year) => {
    if (!year) return "Select Year";
    const currentYear = dayjs().year();
    const prevYear = currentYear - 1;

    if (year === prevYear) {
      return "Previous Year";
    }
    if (year === currentYear) {
      return "This Year";
    }
    return year.toString();
  };

  // Pagination logic
  const totalPages = Math.ceil(reportData.advanceSalaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAdvanceSalaries = reportData.advanceSalaries.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "$0.00";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return `$${numValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusBadgeClass = (status) => {
    if (status === "Open") {
      return "bg-[#D5FAF2] text-[#016558]";
    } else if (status === "Closed") {
      return "bg-[#FEE2E2] text-[#991B1B]";
    }
    return "bg-gray-500 text-white";
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
              <YearPicker
                selectedYear={selectedYear}
                onYearSelect={handleYearSelect}
                formatYearDisplay={formatYearDisplay}
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
                <h3 className="text-xl font-regular text-[#1F2937]">
                  Advance Salary Overall Summary
                </h3>
              </div>
            </div>

            {/* Table - Full Width */}
            <div className="w-full overflow-x-auto flex-1 flex flex-col">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F5FAFF]">
                    <th className="pl-8 pr-2 py-4 text-left text-sm font-medium text-[#4A9EFF] whitespace-nowrap">
                      EMPLOYEE ID
                    </th>
                    <th className="pl-2 pr-8 py-4 text-left text-sm font-medium text-[#4A9EFF] border-r border-[#E5E7EB] whitespace-nowrap">
                      EMPLOYEE NAME
                    </th>
                    {/* Navigation Column - Left */}
                    {totalPages > 1 && <th className="w-16 py-4"></th>}
                    <th className="pl-2 pr-8 py-4 text-left text-sm font-medium text-[#4A9EFF] whitespace-nowrap">
                      ADVANCE SALARY NUMBER
                    </th>
                    <th className="pl-2 pr-8 py-4 text-left text-sm font-medium text-[#4A9EFF] whitespace-nowrap">
                      ADVANCE SALARY NAME
                    </th>
                    <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF] whitespace-nowrap">
                      ADVANCE SALARY AMOUNT
                    </th>
                    <th className="pl-2 pr-8 py-4 text-left text-sm font-medium text-[#4A9EFF] whitespace-nowrap">
                      ADVANCE SALARY REASON
                    </th>
                    <th className="pl-2 pr-8 py-4 text-left text-sm font-medium text-[#4A9EFF] whitespace-nowrap">
                      ADVANCE SALARY STATUS
                    </th>
                    {/* Navigation Column - Right */}
                    {totalPages > 1 && <th className="w-16 py-4"></th>}
                  </tr>
                </thead>
                <tbody>
                  {paginatedAdvanceSalaries.map((advanceSalary, index) => {
                    const isMiddleRow =
                      index === Math.floor(paginatedAdvanceSalaries.length / 2);
                    return (
                      <tr
                        key={advanceSalary.id || index}
                        className="bg-white transition-colors hover:bg-[#F9FAFB]"
                      >
                        <td className="pl-8 pr-2 py-3 text-[16px] text-left text-[#374151] border-b border-[#E5E7EB]">
                          {advanceSalary.employeeId}
                        </td>
                        <td className="pl-2 pr-8 py-3 text-[16px] text-left text-[#374151] border-b border-[#E5E7EB] border-r border-[#E5E7EB]">
                          {advanceSalary.employeeName}
                        </td>
                        {/* Navigation Button - Left */}
                        {totalPages > 1 && isMiddleRow ? (
                          <td
                            className="py-3 border-b border-[#E5E7EB] relative align-middle"
                            rowSpan={paginatedAdvanceSalaries.length}
                            style={{ verticalAlign: "middle" }}
                          >
                            <div
                              className="flex items-center justify-center"
                              style={{ height: "100%" }}
                            >
                              <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className={`
                                  w-10 h-10 rounded-full
                                  flex items-center justify-center
                                  transition-colors
                                  ${
                                    currentPage === 1
                                      ? "bg-[#E0F2FE] cursor-not-allowed opacity-50"
                                      : "bg-[#E0F2FE] hover:bg-[#BAE6FD] cursor-pointer"
                                  }
                                `}
                              >
                                <CaretLeft
                                  size={20}
                                  className={
                                    currentPage === 1
                                      ? "text-[#93C5FD]"
                                      : "text-white"
                                  }
                                />
                              </button>
                            </div>
                          </td>
                        ) : totalPages > 1 ? null : null}
                        <td className="pl-2 pr-8 py-3 text-[16px] text-left text-[#374151] border-b border-[#E5E7EB]">
                          {advanceSalary.advanceSalaryNumber}
                        </td>
                        <td className="pl-2 pr-8 py-3 text-[16px] text-left text-[#374151] border-b border-[#E5E7EB]">
                          {advanceSalary.advanceSalaryName}
                        </td>
                        <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                          {formatCurrency(advanceSalary.advanceSalaryAmount)}
                        </td>
                        <td className="pl-2 pr-8 py-3 text-[16px] text-left text-[#374151] border-b border-[#E5E7EB]">
                          {advanceSalary.advanceSalaryReason}
                        </td>
                        <td className="pl-2 pr-8 py-3 text-[16px] text-left text-[#374151] border-b border-[#E5E7EB]">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                              advanceSalary.advanceSalaryStatus
                            )}`}
                          >
                            {advanceSalary.advanceSalaryStatus}
                          </span>
                        </td>
                        {/* Navigation Button - Right */}
                        {totalPages > 1 && isMiddleRow ? (
                          <td
                            className="py-3 border-b border-[#E5E7EB] relative align-middle"
                            rowSpan={paginatedAdvanceSalaries.length}
                            style={{ verticalAlign: "middle" }}
                          >
                            <div
                              className="flex items-center justify-center"
                              style={{ height: "100%" }}
                            >
                              <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className={`
                                  w-10 h-10 rounded-full
                                  flex items-center justify-center
                                  transition-colors
                                  ${
                                    currentPage === totalPages
                                      ? "bg-[#E0F2FE] cursor-not-allowed opacity-50"
                                      : "bg-[#E0F2FE] hover:bg-[#BAE6FD] cursor-pointer"
                                  }
                                `}
                              >
                                <CaretRight
                                  size={20}
                                  className={
                                    currentPage === totalPages
                                      ? "text-[#93C5FD]"
                                      : "text-white"
                                  }
                                />
                              </button>
                            </div>
                          </td>
                        ) : totalPages > 1 ? null : null}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 0 && (
              <div className="w-full px-6 py-4 flex-shrink-0">
                <div className="flex justify-center">
                  <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPrevious={handlePreviousPage}
                    onNext={handleNextPage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvanceSalaryOverallSummary;

