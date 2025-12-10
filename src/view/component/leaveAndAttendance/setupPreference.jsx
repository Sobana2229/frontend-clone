import { useState, useEffect } from "react";
import { CaretDown } from "@phosphor-icons/react";
import payScheduleStoreManagements from "../../../store/tdPayroll/setting/paySchedule";

function SetupPreference() {
    const { fetchPaySchedule, payScheduleData, loading } = payScheduleStoreManagements();
    const [attendanceCycle, setAttendanceCycle] = useState("Start Date - End Date");
    const [reportGenerationDay, setReportGenerationDay] = useState("");

    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        fetchPaySchedule(access_token);
    }, []);

    // Assign data dari API ke state
    useEffect(() => {
        if (payScheduleData) {
            // Set attendance cycle
            if (payScheduleData.attendanceCycle) {
                setAttendanceCycle(payScheduleData.attendanceCycle);
            }

            // Set report generation day
            if (payScheduleData.reportGenerationDay) {
                // Jika "monthly", set ke "monthly", jika angka, convert ke ordinal
                if (payScheduleData.reportGenerationDay === "monthly") {
                    setReportGenerationDay("monthly");
                } else {
                    const day = parseInt(payScheduleData.reportGenerationDay);
                    if (!isNaN(day)) {
                        const getOrdinal = (n) => {
                            const s = ["th", "st", "nd", "rd"];
                            const v = n % 100;
                            return n + (s[(v - 20) % 10] || s[v] || s[0]);
                        };
                        setReportGenerationDay(getOrdinal(day));
                    }
                }
            }
        }
    }, [payScheduleData]);

    // Generate options untuk attendance cycle (1-28 range combinations)
    const generateAttendanceCycleOptions = () => {
        const options = [];
        
        // Tambahkan option default
        options.push({
            value: "Start Date - End Date",
            label: "Start Date - End Date"
        });

        for (let start = 1; start <= 28; start++) {
            let end = start - 1;
            if (end === 0) end = 28;
            
            const getOrdinal = (n) => {
                const s = ["th", "st", "nd", "rd"];
                const v = n % 100;
                return n + (s[(v - 20) % 10] || s[v] || s[0]);
            };
            
            options.push({
                value: `${getOrdinal(start)} - ${getOrdinal(end)}`,
                label: `${getOrdinal(start)} - ${getOrdinal(end)}`
            });
        }
        return options;
    };

    // Generate options untuk report generation day (1-31 + monthly)
    const generateReportDayOptions = () => {
        const options = [];
        
        // Tambahkan option monthly di awal
        options.push({
            value: "monthly",
            label: "monthly"
        });

        for (let day = 1; day <= 31; day++) {
            const getOrdinal = (n) => {
                const s = ["th", "st", "nd", "rd"];
                const v = n % 100;
                return n + (s[(v - 20) % 10] || s[v] || s[0]);
            };
            options.push({
                value: getOrdinal(day),
                label: getOrdinal(day)
            });
        }
        return options;
    };

    const attendanceCycleOptions = generateAttendanceCycleOptions();
    const reportDayOptions = generateReportDayOptions();

    if (loading) {
        return (
            <div className="w-full p-5">
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-5">
            <div className="w-full space-y-8">
                {/* Attendance Cycle Section */}
                <div className="w-full max-w-5xl">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Attendance Cycle
                    </h2>
                    <p className="text-base text-gray-600 mb-6">
                        Define the start and end days of your organisation's attendance cycle.
                    </p>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="grid grid-cols-2 gap-8 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    PAY SCHEDULE
                                </label>
                                <p className="text-base text-gray-900">Every month</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ATTENDANCE CYCLE
                                </label>
                                <div className="relative">
                                    <select
                                        value={attendanceCycle}
                                        onChange={(e) => setAttendanceCycle(e.target.value)}
                                        disabled
                                        className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-base text-gray-900 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {attendanceCycleOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <CaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Note:</span> Your chosen date range {attendanceCycle} sets the attendance cycle, which will automatically repeat for future months unless edited.
                        </p>
                    </div>
                </div>

                {/* Payroll Report Generation Day Section */}
                {payScheduleData?.reportGenerationDay && (
                    <div className="w-full">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Payroll Report Generation Day
                        </h2>
                        <p className="text-base text-gray-600 mb-6">
                            Choose when to generate payroll reports from leave and attendance data.
                        </p>

                        <div className="w-64">
                            <div className="relative">
                                <select
                                    value={reportGenerationDay}
                                    onChange={(e) => setReportGenerationDay(e.target.value)}
                                    disabled
                                    className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-base text-gray-900 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {reportDayOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <CaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SetupPreference;
