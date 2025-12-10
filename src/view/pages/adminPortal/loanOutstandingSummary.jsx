import { useState, useEffect } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import TablePagination from "../../component/reports/TablePagination";

function LoanOutstandingSummary() {
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Example: 5 items per page

  // Mock data - replace with actual API call
  const [reportData, setReportData] = useState({
    organizationName: "Emaar 4",
    loans: [
      {
        id: 1,
        employeeId: "7564646",
        employeeName: "Vabik",
        loanNumber: "LOAN-00001",
        loanName: "Business",
        loanAmount: 20000.0,
        instalmentAmount: 1000.0,
        principalPaid: 11000.0,
      },
      {
        id: 2,
        employeeId: "TEK232",
        employeeName: "Mubeen",
        loanNumber: "LOAN-00002",
        loanName: "Business",
        loanAmount: 25000.0,
        instalmentAmount: 2500.0,
        principalPaid: 12500.0,
      },
      {
        id: 3,
        employeeId: "TEK234",
        employeeName: "Ijlal Alim",
        loanNumber: "LOAN-00003",
        loanName: "Business",
        loanAmount: 30000.0,
        instalmentAmount: 2000.0,
        principalPaid: 5000.0,
      },
      {
        id: 4,
        employeeId: "TEK232",
        employeeName: "Mubeen",
        loanNumber: "LOAN-00008",
        loanName: "Gold",
        loanAmount: 10000.0,
        instalmentAmount: 1000.0,
        principalPaid: 0.0,
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
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(reportData.loans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLoans = reportData.loans.slice(startIndex, endIndex);

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

  return (
    <div className="w-full h-full bg-[#F9FAFB] flex flex-col overflow-hidden">
      {/* Sticky Top Bar */}
      <div className="flex-shrink-0 sticky top-0 z-10 bg-[#F9FAFB]">
        <div className="w-full flex items-center justify-between h-16 px-6 border-b border-[#E5E7EB] bg-white">
          <h1 className="text-xl font-medium text-[#111827]">Reports</h1>
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
                  Loan Outstanding Summary
                </h3>
              </div>
            </div>

            {/* Table - Full Width */}
            <div className="w-full overflow-x-auto flex-1 flex flex-col">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F5FAFF]">
                    <th className="pl-8 pr-2 py-4 text-left text-sm font-medium text-[#4A9EFF]">
                      EMPLOYEE ID
                    </th>
                    <th className="pl-2 pr-8 py-4 text-left text-sm font-medium text-[#4A9EFF] border-r border-[#E5E7EB]">
                      EMPLOYEE NAME
                    </th>
                    {/* Navigation Column - Left */}
                    {totalPages > 1 && (
                      <th className="w-16 py-4"></th>
                    )}
                    <th className="pl-2 pr-8 py-4 text-left text-sm font-medium text-[#4A9EFF]">
                      LOAN NUMBER
                    </th>
                    <th className="pl-2 pr-8 py-4 text-left text-sm font-medium text-[#4A9EFF]">
                      LOAN NAME
                    </th>
                    <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF]">
                      LOAN AMOUNT
                    </th>
                    <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF]">
                      INSTALMENT AMOUNT
                    </th>
                    <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF]">
                      PRINCIPAL PAID
                    </th>
                    {/* Navigation Column - Right */}
                    {totalPages > 1 && (
                      <th className="w-16 py-4"></th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedLoans.map((loan, index) => {
                    const isMiddleRow = index === Math.floor(paginatedLoans.length / 2);
                    return (
                      <tr
                        key={loan.id || index}
                        className="bg-white transition-colors hover:bg-[#F9FAFB]"
                      >
                        <td className="pl-8 pr-2 py-3 text-[16px] text-left text-[#374151] border-b border-[#E5E7EB]">
                          {loan.employeeId}
                        </td>
                        <td className="pl-2 pr-8 py-3 text-[16px] text-left text-[#374151] border-b border-[#E5E7EB] border-r border-[#E5E7EB]">
                          {loan.employeeName}
                        </td>
                        {/* Navigation Button - Left */}
                        {totalPages > 1 && isMiddleRow ? (
                          <td 
                            className="py-3 border-b border-[#E5E7EB] relative align-middle" 
                            rowSpan={paginatedLoans.length}
                            style={{ verticalAlign: 'middle' }}
                          >
                            <div className="flex items-center justify-center" style={{ height: '100%' }}>
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
                          {loan.loanNumber}
                        </td>
                        <td className="pl-2 pr-8 py-3 text-[16px] text-left text-[#374151] border-b border-[#E5E7EB]">
                          {loan.loanName}
                        </td>
                        <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                          {formatCurrency(loan.loanAmount)}
                        </td>
                        <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                          {formatCurrency(loan.instalmentAmount)}
                        </td>
                        <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
                          {formatCurrency(loan.principalPaid)}
                        </td>
                        {/* Navigation Button - Right */}
                        {totalPages > 1 && isMiddleRow ? (
                          <td 
                            className="py-3 border-b border-[#E5E7EB] relative align-middle" 
                            rowSpan={paginatedLoans.length}
                            style={{ verticalAlign: 'middle' }}
                          >
                            <div className="flex items-center justify-center" style={{ height: '100%' }}>
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

export default LoanOutstandingSummary;

