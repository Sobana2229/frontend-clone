import { useState, useEffect } from "react";
import { Calendar, CaretLeft, CaretRight } from "@phosphor-icons/react";
import dayjs from "dayjs";
import PeriodPickerWithQuickOptions from "../../component/reports/PeriodPickerWithQuickOptions";

function LeaveSummaryReport() {
    // Initialize with October 2025 to match the example in the design
    const october2025 = dayjs("2025-10-01");
    const [selectedPeriod, setSelectedPeriod] = useState(
        october2025.format("YYYY-MM")
    );

    // Mock data - updated to match Figma design
    const [reportData, setReportData] = useState({
        organizationName: "Emaar 4",
        startDate: october2025.startOf("month"),
        endDate: october2025.endOf("month"),
        employees: [
            {
                id: 1,
                name: "Mubeen - TEK2234",
                initials: "M",
                paid: {
                    sickLeave: {
                        booked: 0,
                        balance: 0,
                    },
                },
                unpaid: {
                    absent: {
                        booked: 16,
                        balance: 0,
                    },
                },
            },
            {
                id: 2,
                name: "Vabik - 7564646",
                initials: "V",
                paid: {
                    sickLeave: {
                        booked: 0,
                        balance: 15,
                    },
                },
                unpaid: {
                    absent: {
                        booked: 15,
                        balance: 0,
                    },
                },
            },
            {
                id: 3,
                name: "Vabik - 46575654",
                initials: "V",
                paid: {
                    sickLeave: {
                        booked: 0,
                        balance: 0,
                    },
                },
                unpaid: {
                    absent: {
                        booked: 16,
                        balance: 0,
                    },
                },
            },
            {
                id: 4,
                name: "Ijlal - TEK234",
                initials: "I",
                paid: {
                    sickLeave: {
                        booked: 0,
                        balance: 0,
                    },
                },
                unpaid: {
                    absent: {
                        booked: 13,
                        balance: 0,
                    },
                },
            },
            {
                id: 5,
                name: "fsfrfdf - ffa",
                initials: "F",
                paid: {
                    sickLeave: {
                        booked: 0,
                        balance: 0,
                    },
                },
                unpaid: {
                    absent: {
                        booked: 10,
                        balance: 0,
                    },
                },
            },
        ],
    });

    useEffect(() => {
        // TODO: Fetch data from API based on selectedPeriod
        // const fetchReportData = async () => {
        //   const access_token = localStorage.getItem("accessToken");
        //   // API call here
        // };
        // fetchReportData();
    }, [selectedPeriod]);

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
                <div className="w-full flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
                    <h1 className="text-xl font-medium text-gray-900">Reports</h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md bg-white">
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
                                    Leave Summary Report
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
                        {/* <div className="w-full overflow-x-auto flex-1 flex flex-col">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#F5FAFF]">
                                        <th className="pl-8 pr-2 py-4 text-left text-sm font-medium text-gray-900">
                                            EMPLOYEE
                                        </th>
                                        <th 
                                            colSpan="2" 
                                            className="px-2 py-4 text-center text-sm font-medium text-gray-900 border-l border-gray-200"
                                        >
                                            PAID
                                        </th>
                                        <th 
                                            colSpan="2" 
                                            className="px-2 py-4 text-center text-sm font-medium text-gray-900 border-l border-gray-200"
                                        >
                                            UNPAID
                                        </th>
                                    </tr>
                                    <tr className="bg-[#F5FAFF]">
                                        <th className="pl-8 pr-2 py-4 text-left text-sm font-medium text-gray-900">
                                        </th>
                                        <th 
                                            colSpan="2" 
                                            className="px-2 py-4 text-center text-sm font-medium text-gray-900 border-l border-gray-200"
                                        >
                                            Sick Leave
                                        </th>
                                        <th 
                                            colSpan="2" 
                                            className="px-2 py-4 text-center text-sm font-medium text-gray-900 border-l border-gray-200"
                                        >
                                            Absent
                                        </th>
                                    </tr>
                                    <tr className="bg-[#F5FAFF]">
                                        <th className="pl-8 pr-2 py-4 text-left text-sm font-medium text-gray-900">
                                        </th>
                                        <th className="pl-2 pr-8 py-4 text-center text-sm font-medium text-gray-900">
                                            Booked
                                        </th>
                                        <th className="pl-2 pr-8 py-4 text-center text-sm font-medium text-gray-900">
                                            Balance
                                        </th>
                                        <th className="pl-2 pr-8 py-4 text-center text-sm font-medium text-gray-900 border-l border-gray-200">
                                            Booked
                                        </th>
                                        <th className="pl-2 pr-8 py-4 text-center text-sm font-medium text-gray-900">
                                            Balance
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.employees.map((employee, index) => (
                                        <tr
                                            key={employee.id || index}
                                            className="bg-white transition-colors hover:bg-[#F9FAFB]"
                                        >
                                            <td className="pl-8 pr-2 py-3 text-[16px] text-left text-[#374151] border-b border-gray-200">
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
                                            <td className="pl-2 pr-8 py-3 text-[16px] text-center text-[#374151] border-b border-gray-200">
                                                {employee.paid.sickLeave.booked}
                                            </td>
                                            <td className="pl-2 pr-8 py-3 text-[16px] text-center text-[#374151] border-b border-gray-200">
                                                {employee.paid.sickLeave.balance}
                                            </td>
                                            <td className="pl-2 pr-8 py-3 text-[16px] text-center text-[#374151] border-b border-gray-200 border-l">
                                                {employee.unpaid.absent.booked}
                                            </td>
                                            <td className="pl-2 pr-8 py-3 text-[16px] text-center text-[#374151] border-b border-gray-200">
                                                {employee.unpaid.absent.balance}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div> */}
                        {/* Table - Full Width */}
                        <div 
                            className="w-full overflow-x-auto flex-1 flex flex-col"
                        >
                            <table className="w-full border-collapse">
                                <thead>
                                    {/* First Header Row - Main Categories */}
                                    <tr>
                                        <th
                                            rowSpan="3"
                                            className="pl-8 pr-2 py-3 text-left text-sm font-normal text-gray-900 bg-white border-b border-t border-r border-gray-200 align-center"
                                        >
                                            EMPLOYEE
                                        </th>
                                        <th
                                            colSpan="2"
                                            className="px-2 py-3 text-center text-sm font-normal text-gray-900 bg-white border-b border-t border-r border-gray-200"
                                        >
                                            PAID
                                        </th>
                                        <th
                                            colSpan="2"
                                            className="px-2 py-3 text-center text-sm font-normal text-gray-900 bg-white border-b border-t border-gray-200"
                                        >
                                            UNPAID
                                        </th>
                                    </tr>
                                    {/* Second Header Row - Leave Types */}
                                    <tr>
                                        <th
                                            colSpan="2"
                                            className="px-2 py-3 text-center text-sm font-normal text-gray-900 bg-white border-b border-r border-gray-200"
                                        >
                                            Sick Leave
                                        </th>
                                        <th
                                            colSpan="2"
                                            className="px-2 py-3 text-center text-sm font-normal text-gray-900 bg-white border-b border-gray-200"
                                        >
                                            Absent
                                        </th>
                                    </tr>
                                    {/* Third Header Row - Booked/Balance */}
                                    <tr>
                                        <th className="px-2 py-3 text-center text-sm font-normal text-gray-900 bg-white border-b border-r border-gray-200">
                                            Booked
                                        </th>
                                        <th className="px-2 py-3 text-center text-sm font-normal text-gray-900 bg-white border-b border-r border-gray-200">
                                            Balance
                                        </th>
                                        <th className="px-2 py-3 text-center text-sm font-normal text-gray-900 bg-white border-b border-r border-gray-200">
                                            Booked
                                        </th>
                                        <th className="px-2 py-3 text-center text-sm font-normal text-gray-900 bg-white border-b border-gray-200">
                                            Balance
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.employees.map((employee, index) => (
                                        <tr
                                            key={employee.id || index}
                                            className="bg-white transition-colors hover:bg-[#F9FAFB]"
                                        >
                                            <td className="pl-8 pr-2 py-4 text-sm text-left text-[#374151] border-b border-r border-gray-200">
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
                                            <td className="px-2 py-4 text-sm text-center text-[#374151] border-b border-r border-gray-200">
                                                {employee.paid.sickLeave.booked}
                                            </td>
                                            <td className="px-2 py-4 text-sm text-center text-[#374151] border-b border-r border-gray-200">
                                                {employee.paid.sickLeave.balance}
                                            </td>
                                            <td className="px-2 py-4 text-sm text-center text-[#374151] border-b border-r border-gray-200">
                                                {employee.unpaid.absent.booked}
                                            </td>
                                            <td className="px-2 py-4 text-sm text-center text-[#374151] border-b border-gray-200">
                                                {employee.unpaid.absent.balance}
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

export default LeaveSummaryReport;