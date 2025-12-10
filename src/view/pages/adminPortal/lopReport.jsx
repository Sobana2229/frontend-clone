import { useState, useEffect, useRef } from "react";
import { CaretLeft, CaretRight, CaretDown } from "@phosphor-icons/react";
import dayjs from "dayjs";
import TablePagination from "../../component/reports/TablePagination";

function LOPReport() {
  // Initialize with October 2025 to match the example in the design
  const october2025 = dayjs("2025-10-03");
  const [selectedLeaveType, setSelectedLeaveType] = useState("sick leave");
  const [isLeaveTypeDropdownOpen, setIsLeaveTypeDropdownOpen] = useState(false);
  const leaveTypeDropdownRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const leaveTypes = [
    "sick leave",
    "casual leave",
    "annual leave",
    "maternity leave",
    "paternity leave",
  ];

  // Mock data - replace with actual API call
  const [reportData, setReportData] = useState({
    organizationName: "Emaar 4",
    startDate: october2025,
    endDate: dayjs("2025-11-02"),
    employees: [
      {
        id: 1,
        name: "Mubeen - TEK232",
        initials: "M",
        previousPayPeriodBalance: 0,
        bookedAbsentUnpaid: 15,
        totalPreviousTaken: 15,
        adjustment: 0,
        lossOfPay: 15,
      },
      {
        id: 2,
        name: "Vabik - 7564646",
        initials: "V",
        previousPayPeriodBalance: 0,
        bookedAbsentUnpaid: 14,
        totalPreviousTaken: 14,
        adjustment: 0,
        lossOfPay: 14,
      },
      {
        id: 3,
        name: "Vabik - 46575654",
        initials: "V",
        previousPayPeriodBalance: 0,
        bookedAbsentUnpaid: 15,
        totalPreviousTaken: 15,
        adjustment: 0,
        lossOfPay: 15,
      },
      {
        id: 4,
        name: "Ijlal - TEK234",
        initials: "I",
        previousPayPeriodBalance: 0,
        bookedAbsentUnpaid: 14,
        totalPreviousTaken: 14,
        adjustment: 0,
        lossOfPay: 14,
      },
      {
        id: 5,
        name: "fsfrfdf - ffa",
        initials: "F",
        previousPayPeriodBalance: 0,
        bookedAbsentUnpaid: 5,
        totalPreviousTaken: 5,
        adjustment: 0,
        lossOfPay: 5,
      },
    ],
  });

  useEffect(() => {
    // TODO: Fetch data from API
    // const fetchReportData = async () => {
    //   const access_token = localStorage.getItem("accessToken");
    //   // API call here
    // };
    // fetchReportData();
    // Reset to first page when filter changes
    setCurrentPage(1);
  }, [selectedLeaveType]);

  // Handle click outside for leave type dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        leaveTypeDropdownRef.current &&
        !leaveTypeDropdownRef.current.contains(event.target)
      ) {
        setIsLeaveTypeDropdownOpen(false);
      }
    };

    if (isLeaveTypeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLeaveTypeDropdownOpen]);

  const handlePreviousPeriod = () => {
    // Navigate to previous period (custom date range)
    const newStartDate = reportData.startDate.subtract(1, "month");
    const newEndDate = reportData.endDate.subtract(1, "month");
    setReportData((prev) => ({
      ...prev,
      startDate: newStartDate,
      endDate: newEndDate,
    }));
  };

  const handleNextPeriod = () => {
    // Navigate to next period (custom date range)
    const newStartDate = reportData.startDate.add(1, "month");
    const newEndDate = reportData.endDate.add(1, "month");
    setReportData((prev) => ({
      ...prev,
      startDate: newStartDate,
      endDate: newEndDate,
    }));
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

  // Pagination logic
  const totalPages = Math.ceil(reportData.employees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = reportData.employees.slice(startIndex, endIndex);

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

  return (
    <div className="w-full h-full bg-[#F9FAFB] flex flex-col overflow-hidden">
      {/* Sticky Top Bar */}
      <div className="flex-shrink-0 sticky top-0 z-10 bg-[#F9FAFB]">
        <div className="w-full flex items-center justify-between h-16 px-6 border-b border-[#E5E7EB] bg-white">
          <h1 className="text-xl font-medium text-[#111827]">Reports</h1>
          <div className="flex items-center gap-2">
            <div className="relative" ref={leaveTypeDropdownRef}>
              <button
                onClick={() =>
                  setIsLeaveTypeDropdownOpen(!isLeaveTypeDropdownOpen)
                }
                className="flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-md bg-white hover:bg-[#F9FAFB] transition-colors"
              >
                <span className="text-sm font-regular text-[#6B7280]">
                  Leave type:
                </span>
                <span className="text-sm font-regular text-[#374151]">
                  {selectedLeaveType}
                </span>
                <CaretDown
                  size={12}
                  className={`text-[#6B7280] transition-transform ${
                    isLeaveTypeDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isLeaveTypeDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50">
                  {leaveTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedLeaveType(type);
                        setIsLeaveTypeDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-[#F9FAFB] transition-colors ${
                        selectedLeaveType === type
                          ? "bg-[#F5FAFF] text-[#1F87FF]"
                          : "text-[#374151]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
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
                  LOP Report
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
            <div className="w-full overflow-x-auto flex-1 flex flex-col relative">
              {/* Navigation Arrow - Left */}
              {totalPages > 1 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 z-10">
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
                        currentPage === 1 ? "text-[#93C5FD]" : "text-white"
                      }
                    />
                  </button>
                </div>
              )}

              {/* Navigation Arrow - Right */}
              {totalPages > 1 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 z-10">
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
              )}

              <table className="w-full">
                <thead>
                  <tr className="bg-[#F5FAFF]">
                    <th className="pl-8 pr-2 py-4 text-left text-sm font-medium text-[#4A9EFF]">
                      EMPLOYEE
                    </th>
                    <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF]">
                      PREVIOUS PAY PERIOD BALANCE
                    </th>
                    <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF]">
                      <div className="flex flex-col items-end">
                        <span>BOOKED</span>
                        <span className="text-xs font-normal text-[#4A9EFF] opacity-75">
                          Absent+Unpaid
                        </span>
                      </div>
                    </th>
                    <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF]">
                      <div className="flex flex-col items-end">
                        <span>TOTAL</span>
                        <span className="text-xs font-normal text-[#4A9EFF] opacity-75">
                          Previous+Taken
                        </span>
                      </div>
                    </th>
                    <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF]">
                      ADJUSTMENT
                    </th>
                    <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF]">
                      LOSS OF PAY
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmployees.map((employee, index) => (
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
                        {employee.previousPayPeriodBalance}
                      </td>
                      <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                        {employee.bookedAbsentUnpaid}
                      </td>
                      <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                        {employee.totalPreviousTaken}
                      </td>
                      <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                        {employee.adjustment}
                      </td>
                      <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                        {employee.lossOfPay}
                      </td>
                    </tr>
                  ))}
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

export default LOPReport;
