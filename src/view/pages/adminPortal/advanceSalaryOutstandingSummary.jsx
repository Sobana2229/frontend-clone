import { useState, useEffect, useRef } from "react";
import { CaretLeft, CaretLeftIcon, CaretRight, CaretRightIcon } from "@phosphor-icons/react";
import TablePagination from "../../component/reports/TablePagination";

function AdvanceSalaryOutstandingSummary() {
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
    const paginatedLoans = reportData.loans || reportData.loans.slice(startIndex, endIndex);

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

    const dataHeaders = [
        "EMPLOYEE ID",
        "EMPLOYEE NAME",
        "LOAN NUMBER",
        "LOAN NAME",
        "LOAN AMOUNT",
        "INSTALMENT AMOUNT",
        "PRINCIPAL PAID",
    ]
    /* for movable table */
    const [scrollLeft, setScrollLeft] = useState(0);
    const rightTableRef = useRef(null);
    const [buttonPosition, setButtonPosition] = useState({ top: '50%' });

    const scrollLeftAction = () => {
        if (rightTableRef.current) {
            const scrollAmount = rightTableRef.current.clientWidth * 0.12;
            rightTableRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    };

    const scrollRightAction = () => {
        if (rightTableRef.current) {
            const scrollAmount = rightTableRef.current.clientWidth * 0.12;
            rightTableRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleScroll = () => {
        if (rightTableRef.current) {
            setScrollLeft(rightTableRef.current.scrollLeft);
        }
    };

    const handleRowMouseEnter = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const containerRect = rightTableRef.current.getBoundingClientRect();
        const relativeTop = rect.top - containerRect.top + rect.height / 2;
        setButtonPosition({ top: `${relativeTop}px` });
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
                                    Advance Salary Outstanding Summary
                                </h3>
                            </div>
                        </div>
                        
                        {/* Moveable Table => from annual earnings */}
                        <div
                            className="max-h-full h-full w-full flex-grow"
                        >
                            <div className="flex min-h-full">
                                {/* Left Table - Fixed */}
                                <div
                                    className="border-r border-gray-300 flex-shrink-0 w-[600px]"
                                >
                                    <table className="border-collapse w-full">

                                        {/* Employee ID and Employee Name Headers */}
                                        <thead className="bg-blue-50">
                                            <tr className="border-b border-gray-200">
                                                <th className="px-6 text-left text-md font-semibold text-[#4A9EFF] min-w-[100px]" style={{ height: '72px' }}>
                                                    {dataHeaders[0]}
                                                </th>
                                                <th className="px-6 text-left text-md font-semibold text-[#4A9EFF] min-w-[100px]" style={{ height: '72px' }}>
                                                    {dataHeaders[1]}
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="bg-white">
                                            {/* Earnings Rows */}
                                            {paginatedLoans.map((row, index) => (
                                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors" style={{ height: '60px' }}>
                                                    <td className="px-6 text-md text-gray-700 align-middle">{row.employeeId}</td>
                                                    <td className="px-6 text-md text-gray-700 align-middle">{row.employeeName}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Right Table - Scrollable Horizontally */}
                                <div
                                    ref={rightTableRef}
                                    onScroll={handleScroll}
                                    className="flex-1 overflow-x-auto relative"
                                >

                                    {/* Left Scroll Button */}
                                    <button
                                        onClick={scrollLeftAction}
                                        className="absolute z-20 bg-white hover:bg-[#f7faff] shadow-lg rounded-lg p-2 transition-all hover:scale-110"
                                        aria-label="Scroll left"
                                        style={{
                                            left: `${scrollLeft + 8}px`,
                                            top: buttonPosition.top,
                                            transform: 'translateY(-50%)',
                                            pointerEvents: 'auto',
                                            transition: 'top 0.2s ease-out'
                                        }}
                                    >
                                        <CaretLeftIcon size={20} weight="bold" className="text-[#4A9EFF]" />
                                    </button>

                                    {/* Right Scroll Button */}
                                    <button
                                        onClick={scrollRightAction}
                                        className="absolute z-20 bg-white hover:bg-[#f7faff] shadow-lg rounded-lg p-2 transition-all hover:scale-110"
                                        aria-label="Scroll right"
                                        style={{
                                            right: `${-scrollLeft + 8}px`,
                                            top: buttonPosition.top,
                                            transform: 'translateY(-50%)',
                                            pointerEvents: 'auto',
                                            transition: 'top 0.2s ease-out'
                                        }}
                                    >
                                        <CaretRightIcon size={20} weight="bold" className="text-[#4A9EFF]" />
                                    </button>


                                    <table className="border-collapse min-w-full">
                                        {/* Other Headers */}
                                        <thead className="bg-blue-50">
                                            <tr className="border-b border-gray-200">
                                                {dataHeaders.slice(2).map((header, index) => (
                                                    <th key={index}
                                                        className="
                                                            border-r border-gray-200 
                                                            px-6 
                                                            text-right text-md font-semibold text-[#4A9EFF] 
                                                            min-w-[300px]"
                                                        style={{ height: '72px' }}
                                                    >
                                                        <div className="flex flex-row gap-2 items-center justify-center h-full">
                                                            {header}
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <tbody className="bg-white">
                                            {paginatedLoans.map((row, index) => (
                                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors" style={{ height: '60px' }}
                                                    onMouseEnter={handleRowMouseEnter}
                                                >
                                                    <td className="border-r border-gray-200 pl-[6.2%] text-md text-gray-900 text-left align-middle">
                                                        {row.loanNumber}
                                                    </td>
                                                    <td className="border-r border-gray-200 px-6 text-md text-gray-900 text-center align-middle">
                                                        {row.loanName}
                                                    </td>
                                                    <td className="border-r border-gray-200 pr-[6.2%] text-md text-gray-900 text-right align-middle">
                                                        {formatCurrency(row.loanAmount)}
                                                    </td>
                                                    <td className="border-r border-gray-200 pr-[4.5%] text-md text-gray-900 text-right align-middle">
                                                        {formatCurrency(row.instalmentAmount)}
                                                    </td>
                                                    <td className="pr-[6.2%] text-md text-gray-900 text-right align-middle">
                                                        {formatCurrency(row.principalPaid)}
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
            </div>
        </div>
    );
}

export default AdvanceSalaryOutstandingSummary;

