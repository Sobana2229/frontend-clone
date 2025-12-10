import { useState, useEffect } from "react";
import { CaretLeft, CaretRight, CaretDown, Info } from "@phosphor-icons/react";
import payScheduleStoreManagements from "../../../store/tdPayroll/setting/paySchedule";
import { monthNames, optionFiscal, weekDays } from "../../../../data/dummy";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CustomToast } from "../customToast";
import { useRef } from "react";
import Applicable from "../leaveAndAttendance/attendance/applicable";
import { getWorkDatesInMonth } from "../../../../helper/globalHelper";
dayjs.extend(customParseFormat);

function FormPaySchedule({ handleCancelForm, dataPaySchedule }) {
    const { createPaySchedule, updatePaySchedule, fetchPaySchedule, loading } = payScheduleStoreManagements();
    const [formData, setFormData] = useState({
        fiscalYear: dataPaySchedule?.fiscalYear || "january-december",
        applicableTo: dataPaySchedule?.applicableTo || "Prior Payrun",
        selectValue: dataPaySchedule?.selectValue || [],
        priorPayrunStatus: dataPaySchedule?.priorPayrunStatus || false,
    });
    const dropdownRef = useRef(null);
    const selectDropdownRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSelectDropdown, setShowSelectDropdown] = useState(false);
    const [workDays, setWorkDays] = useState([]);
    const [salaryCalculation, setSalaryCalculation] = useState("");
    const [orgWorkingDays, setOrgWorkingDays] = useState(null);
    const [payOn, setPayOn] = useState("");
    const [payDay, setPayDay] = useState(null);
    const [startMonth, setStartMonth] = useState("");
    const [payDate, setPayDate] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const dayNumbers = Array.from({ length: 28 }, (_, i) => i + 1);
    const [showFirstPayroll, setShowFirstPayroll] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [attendanceCycle, setAttendanceCycle] = useState("Start Date - End Date");
    const [payrollReportDay, setPayrollReportDay] = useState("");

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (selectDropdownRef.current && !selectDropdownRef.current.contains(event.target)) {
                setShowSelectDropdown(false);
            }
        };
        
        if (showDropdown || showSelectDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown, showSelectDropdown]);

    const handleDropdownSelect = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        if (field === 'applicableTo') {
            setShowDropdown(false);
        } else if (field === 'selectValue') {
            setShowSelectDropdown(false);
        }
    };

    const handleTogglePriorPayrun = () => {
        setFormData((prev) => ({
            ...prev,
            priorPayrunStatus: !prev.priorPayrunStatus
        }));
    };

    const parseMonthString = (monthStr) => {
        if (!monthStr) return { monthIndex: 0, year: new Date().getFullYear() };
        const [monthName, year] = monthStr.split('-');
        const monthIndex = monthNames.indexOf(monthName);
        return { monthIndex, year: parseInt(year) };
    };

    const getLastDayOfMonth = (monthStr) => {
        const { monthIndex, year } = parseMonthString(monthStr);
        return new Date(year, monthIndex + 1, 0).getDate();
    };

    // Generate months based on fiscal year
    const getFiscalYearMonths = (fiscalYearKey) => {
        if (!fiscalYearKey) return [];
        
        // Parse fiscal year key (e.g., 'january-december' or 'october-september')
        const [startMonthName, endMonthName] = fiscalYearKey.split('-');
        
        // Helper function to capitalize first letter (e.g., 'january' -> 'January')
        const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        const startMonthFormatted = capitalizeFirst(startMonthName);
        const endMonthFormatted = capitalizeFirst(endMonthName);
        
        const startMonthIndex = monthNames.findIndex(m => m === startMonthFormatted);
        const endMonthIndex = monthNames.findIndex(m => m === endMonthFormatted);
        
        if (startMonthIndex === -1 || endMonthIndex === -1) return [];
        
        const currentYear = new Date().getFullYear();
        const months = [];
        
        // If fiscal year crosses year boundary (e.g., october-september)
        if (startMonthIndex > endMonthIndex) {
            // First part: from start month to December of current year
            for (let i = startMonthIndex; i < monthNames.length; i++) {
                months.push({
                    monthName: monthNames[i],
                    monthIndex: i,
                    year: currentYear,
                    value: `${monthNames[i]}-${currentYear}`,
                    label: `${monthNames[i]}-${currentYear}`
                });
            }
            // Second part: from January to end month of next year
            for (let i = 0; i <= endMonthIndex; i++) {
                months.push({
                    monthName: monthNames[i],
                    monthIndex: i,
                    year: currentYear + 1,
                    value: `${monthNames[i]}-${currentYear + 1}`,
                    label: `${monthNames[i]}-${currentYear + 1}`
                });
            }
        } else {
            // Fiscal year within same year (e.g., january-december)
            for (let i = startMonthIndex; i <= endMonthIndex; i++) {
                months.push({
                    monthName: monthNames[i],
                    monthIndex: i,
                    year: currentYear,
                    value: `${monthNames[i]}-${currentYear}`,
                    label: `${monthNames[i]}-${currentYear}`
                });
            }
        }
        
        return months;
    };

    // ✅ Helper: Map work days to dayjs day index (SUN=0, MON=1, TUE=2, WED=3, THU=4, FRI=5, SAT=6)
    const getWorkDayIndices = (workDays) => {
        const weekDayMap = {
            'SUN': 0,
            'MON': 1,
            'TUE': 2,
            'WED': 3,
            'THU': 4,
            'FRI': 5,
            'SAT': 6
        };
        return workDays.map(day => weekDayMap[day]).filter(idx => idx !== undefined);
    };

    // ✅ Helper: Find last working day of month based on selected work days
    const getLastWorkingDayBasedOnWorkDays = (monthIndex, year, workDays) => {
        if (!workDays || workDays.length === 0) {
            // Fallback: use Mon-Fri if no work days selected
            workDays = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
        }
        
        const workDayIndices = getWorkDayIndices(workDays);
        if (workDayIndices.length === 0) {
            // Fallback: use Mon-Fri
            workDayIndices.push(1, 2, 3, 4, 5);
        }
        
        // Get last day of month
        const lastDay = getLastDayOfMonth(`${monthNames[monthIndex]}-${year}`);
        
        // Start from last day and go backwards until we find a working day
        for (let day = lastDay; day >= 1; day--) {
            const dateObj = dayjs(`${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
            const dayOfWeek = dateObj.day(); // 0 = Sunday, 1 = Monday, etc.
            
            if (workDayIndices.includes(dayOfWeek)) {
                return dateObj;
            }
        }
        
        // Fallback: if no working day found, return last day
        return dayjs(`${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`);
    };

    // ✅ Helper: Adjust pay date if it falls on non-working day (based on selected work days)
    const getAdjustedPayDate = (day, month, year) => {
        let payDateObj = dayjs(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
        
        // Get work day indices based on selected work days
        const workDayIndices = getWorkDayIndices(workDays);
        
        // If no work days selected, fallback to Mon-Fri
        const validWorkDays = workDayIndices.length > 0 ? workDayIndices : [1, 2, 3, 4, 5];
        
        // Backtrack if pay date falls on a non-working day
        let attempts = 0;
        const maxAttempts = 7; // Prevent infinite loop
        while (!validWorkDays.includes(payDateObj.day()) && attempts < maxAttempts) {
            payDateObj = payDateObj.subtract(1, 'day');
            attempts++;
        }
        
        return payDateObj;
    };

    useEffect(() => {
        if (payOn === "lastWorkingDay") {
            setPayrollReportDay("monthly");
        } else if (payOn === "day" && payDay) {
            setPayrollReportDay(payDay.toString());
        } else {
            setPayrollReportDay("");
        }
    }, [payOn, payDay]);

    useEffect(() => {
        if (salaryCalculation !== "organization") {
            setShowFirstPayroll(false);
            setStartMonth("");  // Hanya reset jika bukan organization
            setPayDate("");
        }
        if (payOn !== "day") {
            setPayDay(null);
        }
    }, [payOn, salaryCalculation]);  

    useEffect(() => {
        if (dataPaySchedule) {
            setStartMonth(dataPaySchedule.startMonth || "");
            setPayDate(dataPaySchedule.payDate);
        }
    }, [isEditMode]);

    useEffect(() => {
        if (dataPaySchedule) {
            setIsEditMode(true);
            setWorkDays(dataPaySchedule.workDays || []);
            setSalaryCalculation(dataPaySchedule.salaryCalculation || "actual");
            setOrgWorkingDays(dataPaySchedule.orgWorkingDays);
            setPayOn(dataPaySchedule.payOn || "lastWorkingDay");
            setPayDay(dataPaySchedule.payDay);
            setShowFirstPayroll(dataPaySchedule.startMonth ? true : false);
            if (dataPaySchedule.payDate) {
                const payDateParts = dataPaySchedule.payDate.split('/');
                if (payDateParts.length === 3) {
                    const month = parseInt(payDateParts[1], 10) - 1;
                    const year = parseInt(payDateParts[2], 10);
                    setCurrentMonth(new Date(year, month));
                }
            }
        }
    }, [dataPaySchedule]);

    useEffect(() => {
        if (!startMonth) {
            setPayDate("");
            return;
        }
        const { monthIndex, year } = parseMonthString(startMonth);
        let newPayDate = "";
        
        if (payOn === "lastWorkingDay") {
            // ✅ Find last working day of month based on selected work days
            const lastWorkingDayObj = getLastWorkingDayBasedOnWorkDays(monthIndex, year, workDays);
            newPayDate = lastWorkingDayObj.format('DD/MM/YYYY');
        } else if (payOn === "day" && payDay) {
            // ✅ payDate = startMonth + 1 bulan dengan day yang dipilih
            const day = parseInt(payDay);
            if (!isNaN(day) && day >= 1 && day <= 31) {
            // Hitung bulan berikutnya
            const nextMonth = monthIndex + 1; // startMonth sudah di index 0-11, jadi +1 untuk next month
            const nextYear = nextMonth > 11 ? year + 1 : year;
            const adjustedMonth = nextMonth > 11 ? 0 : nextMonth;
            
            const adjustedPayDateObj = getAdjustedPayDate(day, adjustedMonth + 1, nextYear);
            
            // Check if adjusted date still in same month
            if (adjustedPayDateObj.month() === adjustedMonth) {
                newPayDate = adjustedPayDateObj.format('DD/MM/YYYY');
            } else {
                // If backtracked to previous month, use last working day of that month based on work days
                const prevMonthIndex = adjustedPayDateObj.month();
                const prevYear = adjustedPayDateObj.year();
                const lastWorkingDayObj = getLastWorkingDayBasedOnWorkDays(prevMonthIndex, prevYear, workDays);
                newPayDate = lastWorkingDayObj.format('DD/MM/YYYY');
            }
            }
        }

        setPayDate(newPayDate);
        
        // Set calendar ke bulan payDate (bukan startMonth)
        if (newPayDate) {
            const [d, m, y] = newPayDate.split('/');
            setCurrentMonth(new Date(parseInt(y), parseInt(m) - 1));
        }
    }, [startMonth, payOn, payDay, workDays]);

    useEffect(() => {
        setShowFirstPayroll(!!startMonth); 
    }, [startMonth]);

    // Reset startMonth if it's not valid for the selected fiscal year
    useEffect(() => {
        if (formData.fiscalYear && startMonth) {
            const fiscalMonths = getFiscalYearMonths(formData.fiscalYear);
            const isValidMonth = fiscalMonths.some(month => month.value === startMonth);
            if (!isValidMonth) {
                setStartMonth("");
            }
        }
    }, [formData.fiscalYear, startMonth]);

    const toggleWorkDay = (day) => {
        setWorkDays(prev => 
            prev.includes(day) 
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const formatMonth = (date) => {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const getSelectedDay = () => {
        if (!payDate) return null;
        const parts = payDate.split('/');
        if (parts.length === 3) {
            return parseInt(parts[0], 10);
        }
        return null;
    };

    const isPayDateInCurrentCalendarMonth = () => {
        if (!payDate) return false;
        const parts = payDate.split('/');
        if (parts.length === 3) {
            const payDay = parseInt(parts[0], 10);
            const payMonth = parseInt(parts[1], 10) - 1;
            const payYear = parseInt(parts[2], 10);            
            return payMonth === currentMonth.getMonth() && 
                   payYear === currentMonth.getFullYear();
        }
        return false;
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days = [];
        const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
        const daysInPrevMonth = getDaysInMonth(prevMonth);
        
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: daysInPrevMonth - i,
                isCurrentMonth: false,
                isNextMonth: false
            });
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({
                day,
                isCurrentMonth: true,
                isNextMonth: false
            });
        }
        
        const totalCells = Math.ceil(days.length / 7) * 7;
        let nextMonthDay = 1;
        while (days.length < totalCells) {
            days.push({
                day: nextMonthDay++,
                isCurrentMonth: false,
                isNextMonth: true
            });
        }

        return days;
    };

    const navigateMonth = (direction) => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + direction);
            return newMonth;
        });
    };

    // DYNAMIC orgWorkingDaysOptions berdasarkan workDays dan startMonth
    const getDynamicOrgWorkingDaysOptions = () => {
        if (!startMonth || workDays.length === 0) {
            // Default fallback jika belum ada pilihan
            return Array.from({ length: 11 }, (_, i) => {
                const val = 20 + i;
                return { value: val, label: val.toString() };
            });
        }

        const { monthIndex, year } = parseMonthString(startMonth);
        const maxWorkDays = getWorkDatesInMonth(workDays, monthIndex, year).length;
        
        // Generate options dari 1 sampai maxWorkDays
        return Array.from({ length: maxWorkDays }, (_, i) => {
            const val = i + 1;
            return { value: val, label: val.toString() };
        });
    };

    const orgWorkingDaysOptions = getDynamicOrgWorkingDaysOptions();

    // DYNAMIC validWorkDates untuk payDay dropdown
    const getValidWorkDates = () => {
        if (!startMonth || workDays.length === 0) return [];
        const { monthIndex, year } = parseMonthString(startMonth);
        return getWorkDatesInMonth(workDays, monthIndex, year);
    };

    const validWorkDates = getValidWorkDates();

    const handleSubmit = async () => {
        const postgresDate = dayjs(payDate, "DD/MM/YYYY").format("YYYY-MM-DD");
        const payload = {
            workDays: workDays,
            salaryCalculation: salaryCalculation,
            orgWorkingDays: orgWorkingDays ? Number(orgWorkingDays) : null,
            payOn: payOn,
            payDay: payDay ? Number(payDay) : null,
            startMonth: startMonth,
            payDate: postgresDate,
            attendanceCycle: attendanceCycle,
            reportGenerationDay: payrollReportDay,
            priorPayrun: {
                applicableTo: formData?.applicableTo,
                selectValue: formData?.selectValue || [],
            },
            fiscalYear: formData?.fiscalYear,
            priorPayrunStatus: formData?.priorPayrunStatus
        };

        const access_token = localStorage.getItem("accessToken");
        const response = isEditMode 
            ? await updatePaySchedule(payload, access_token)
            : await createPaySchedule(payload, access_token);
        if(response){
            const message = isEditMode 
                ? response || "Pay schedule updated successfully!"
                : response || "Pay schedule created successfully!";
            toast(<CustomToast message={message} status={"success"} />, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                style: {
                    background: 'transparent',
                    boxShadow: 'none',
                    padding: 0
                }
            });
            handleCancel();
            await fetchPaySchedule(access_token);
        }
    };

    const handleCancel = () => {
        setWorkDays([]);
        setSalaryCalculation("actual");
        setOrgWorkingDays(null);
        setPayOn("lastWorkingDay");
        setPayDay(null);
        setStartMonth("");
        setPayDate(null);
        setCurrentMonth(new Date());
        setShowFirstPayroll(false);
        setIsEditMode(false);
        handleCancelForm();
    };

    const selectedDay = getSelectedDay();
    const isPayDateCurrentMonth = isPayDateInCurrentCalendarMonth();

    const getDayIndex = (day) => weekDays.indexOf(day);
    const sortedDayIndices = workDays.map(day => getDayIndex(day)).sort((a, b) => a - b);
    const isConsecutive =
        sortedDayIndices.length > 0 &&
        sortedDayIndices[sortedDayIndices.length - 1] - sortedDayIndices[0] === sortedDayIndices.length - 1;
        
    return (
        <div className="w-full h-full flex-col flex items-start justify-start p-10 bg-white rounded-md">
            <div className="space-y-8">
                {salaryCalculation !== "organization" && (
                    <>
                        {/* Fiscal Year */}
                        <div className="w-full flex items-center justify-start space-x-5">
                            <label className="block text-base font-medium text-gray-700">
                                Fiscal Year
                            </label>
                            <select
                                value={formData.fiscalYear}
                                onChange={(e) => setFormData(prev => ({ ...prev, fiscalYear: e.target.value }))}
                                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                                <option value="">Select Fiscal Year</option>
                                {Object.entries(optionFiscal).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                        </div>

                        {/* Work Week Selection */}
                        <div className="">
                            <label className="block text-lg font-medium text-gray-700 mb-2">
                                Select your work week <span className="text-red-500">*</span>
                            </label>
                            <p className="text-base text-gray-500 mb-4">The days worked in a calendar week</p>
                            
                            <div className="grid grid-cols-7 w-[70%] rounded-md overflow-hidden border mb-1">
                                {weekDays.map((day, idx) => (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => toggleWorkDay(day)}
                                        className={`py-2 text-base font-medium transition-colors ${idx > 0 ? 'border-l' : ''} ${
                                            workDays.includes(day)
                                                ? 'bg-blue-td-50 border-blue-td-50'
                                                : 'border-gray-td-300'
                                        }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                            {workDays?.length < 4 && (
                                <p className="text-red-td-400">Select at least 4 days</p>
                            )}

                            {workDays?.length >= 4 && !isConsecutive && (
                                <p className="text-red-td-400">Select continuous days</p>
                            )}
                        </div>
                    </>
                )}

                <>
                    {/* Salary Calculation */}
                    <div className="">
                        <div className="flex items-center gap-2 mb-4">
                            <label className="text-lg font-medium text-gray-700">
                                Calculate monthly salary based on <span className="text-red-500">*</span>
                            </label>
                            <Info className="w-4 h-4 text-gray-400" />
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="actual"
                                    name="salaryCalculation"
                                    value="actual"
                                    checked={salaryCalculation === "actual"}
                                    onChange={(e) => setSalaryCalculation(e.target.value)}
                                    className="mr-3 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="actual" className="text-base text-gray-700">
                                    Actual days in a month
                                </label>
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="organization"
                                    name="salaryCalculation"
                                    value="organization"
                                    checked={salaryCalculation === "organization"}
                                    onChange={(e) => setSalaryCalculation(e.target.value)}
                                    className="mr-3 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="organization" className="text-base text-gray-700 flex items-center gap-2">
                                    Organisation working days
                                </label>
                            </div>
                        </div>
                    </div>

                </>

                {salaryCalculation == "organization" && (
                    <>
                        {/* Work Week Selection */}
                        <div className="">
                            <label className="block text-lg font-medium text-gray-700 mb-2">
                                Select your work week <span className="text-red-500">*</span>
                            </label>
                            <p className="text-base text-gray-500 mb-4">The days worked in a calendar week</p>
                            
                            <div className="grid grid-cols-7 w-[70%] rounded-md overflow-hidden border mb-1">
                                {weekDays.map((day, idx) => (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => toggleWorkDay(day)}
                                        className={`py-2 text-base font-medium transition-colors ${idx > 0 ? 'border-l' : ''} ${
                                            workDays.includes(day)
                                                ? 'bg-blue-td-50 border-blue-td-50'
                                                : 'border-gray-td-300'
                                        }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                            {workDays?.length < 4 && (
                                <p className="text-red-td-400">Select at least 4 days</p>
                            )}

                            {workDays?.length >= 4 && !isConsecutive && (
                                <p className="text-red-td-400">Select continuous days</p>
                            )}
                        </div>

                        <div className="w-1/3">
                            <label className="block text-base font-medium text-gray-700 mb-2">
                                Start your first payroll from <span className="text-red-500">*</span>
                            </label>
                            
                            <div className="relative mb-6">
                                <select 
                                    value={startMonth}
                                    onChange={(e) => setStartMonth(e.target.value)}
                                    className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="" hidden>Select</option>
                                    {getFiscalYearMonths(formData.fiscalYear).map((month, idx) => (
                                        <option key={idx} value={month.value}>
                                            {month.label}
                                        </option>
                                    ))}
                                </select>
                                <CaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Calendar */}
                        {startMonth && (
                            <>
                                <div className="bg-white w-1/2">
                                    <div className="flex items-center justify-between mb-4">
                                        <button 
                                            type="button"
                                            onClick={() => navigateMonth(-1)}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <CaretLeft className="w-5 h-5 text-gray-600" />
                                        </button>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {formatMonth(currentMonth)}
                                        </h3>
                                        <button 
                                            type="button"
                                            onClick={() => navigateMonth(1)}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <CaretRight className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-7 gap-1 mb-2">
                                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                                            <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="grid grid-cols-7 gap-1">
                                        {generateCalendarDays().map((dayObj, index) => {
                                            const isSelectedDay = dayObj.day === selectedDay && 
                                                                dayObj.isCurrentMonth && 
                                                                isPayDateCurrentMonth;
                                            
                                            return (
                                                <div
                                                    key={index}
                                                    className={`h-8 text-base rounded flex items-center justify-center transition-colors ${
                                                            dayObj.isCurrentMonth
                                                            ? 'text-gray-700'
                                                            : 'text-gray-300'
                                                    }`}
                                                >
                                                    {dayObj.day}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                {/* Attendance Cycle */}
                                <div className="">
                                    <label className="block text-lg font-medium text-gray-700 mb-2">
                                        Attendance Cycle <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-base text-gray-500 mb-4">
                                        Define the start and end days of your organisation's attendance cycle.
                                    </p>

                                    <div className="w-full">
                                        <div className="flex items-center mb-2">
                                            <span className="text-base text-gray-700 mr-2">Every month</span>
                                            <div className="relative w-56">
                                                <select
                                                    className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    onChange={(e) => setAttendanceCycle(e.target.value)}
                                                    disabled
                                                >
                                                    <option value={`Start Date - End Date`}>
                                                    Start Date - End Date
                                                    </option>
                                                </select>
                                                <CaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <p className="text-base text-gray-500 mt-1">
                                            Note: Your chosen date range {attendanceCycle.startDate} - {attendanceCycle.endDate} {attendanceCycle.month} sets the attendance cycle, which will automatically repeat for future months unless edited.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-5">
                                    <span className="text-base text-gray-700">working days <span className="text-red-500">*</span></span>
                                    <div className="relative">
                                        <select 
                                            value={orgWorkingDays || ""}
                                            onChange={(e) => setOrgWorkingDays(e.target.value)}
                                            disabled={salaryCalculation !== "organization"}
                                            className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 text-base text-gray-700 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            {!isEditMode && (
                                                <option value="" hidden>Select</option>
                                            )}
                                            {orgWorkingDaysOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        <CaretDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    <span className="text-base text-gray-700">days per month</span>
                                </div>
                            </>
                        )}
                    </>
                )}

                {salaryCalculation !== "organization" && (
                    <>
                        {/* Attendance Cycle */}
                        <div className="">
                            <label className="block text-lg font-medium text-gray-700 mb-2">
                                Attendance Cycle <span className="text-red-500">*</span>
                            </label>
                            <p className="text-base text-gray-500 mb-4">
                                Define the start and end days of your organisation's attendance cycle.
                            </p>

                            <div className="w-full">
                                <div className="flex items-center mb-2">
                                    <span className="text-base text-gray-700 mr-2">Every month</span>
                                    <div className="relative w-56">
                                        <select
                                            className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            onChange={(e) => setAttendanceCycle(e.target.value)}
                                            disabled
                                        >
                                            <option value={`Start Date - End Date`}>
                                            Start Date - End Date
                                            </option>
                                        </select>
                                        <CaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <p className="text-base text-gray-500 mt-1">
                                    Note: Your chosen date range {attendanceCycle.startDate} - {attendanceCycle.endDate} {attendanceCycle.month} sets the attendance cycle, which will automatically repeat for future months unless edited.
                                </p>
                            </div>
                        </div>
                    </>                    
                )}

                <>
                    {/* Pay On */}
                    <div className="">
                        <label className="block text-LG font-medium text-gray-700 mb-4">
                            Pay on <span className="text-red-500">*</span>
                        </label>
                        
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="lastWorkingDay"
                                    name="payOn"
                                    value="lastWorkingDay"
                                    checked={payOn === "lastWorkingDay"}
                                    onChange={(e) => setPayOn(e.target.value)}
                                    className="mr-3 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="lastWorkingDay" className="text-base text-gray-700">
                                    the last working day of every month
                                </label>
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="specificDay"
                                    name="payOn"
                                    value="day"
                                    checked={payOn === "day"}
                                    onChange={(e) => setPayOn(e.target.value)}
                                    className="mr-3 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="specificDay" className="text-base text-gray-700 flex items-center gap-2">
                                    day
                                    <div className="relative">
                                        <select 
                                            value={payDay || ""}
                                            onChange={(e) => setPayDay(e.target.value)}
                                            disabled={payOn !== "day"}
                                            className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 text-base text-gray-700 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            <option value="" hidden>Select</option>
                                            {dayNumbers.map(num => (
                                                <option key={num} value={num.toString()}>{num}</option>
                                            ))}
                                        </select>
                                        <CaretDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    <span className="text-base text-gray-700">of every month</span>
                                </label>
                            </div>
                        </div>
                        
                        <p className="text-base text-gray-500 mt-3">
                            Note: When payday falls on a non-working day or a holiday, employees will get paid on the previous working day.
                        </p>
                    </div>
                </>

                {/* Payroll Report Generation Day */}
                <div className="w-full max-w-xs">
                    <label className="block text-[17px] font-medium text-gray-800 mb-1">
                        Payroll Report Generation Day
                    </label>
                    <p className="text-[15px] text-gray-600 mb-3">
                        Automatically set from Pay On
                    </p>
                    <input
                        type="text"
                        value={payrollReportDay}
                        readOnly
                        className="w-full border px-4 py-2 rounded bg-gray-100 text-gray-800"
                    />
                </div>

                {(payOn  && salaryCalculation !== "organization") && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Start Payroll */}
                        <div>
                            <label className="block text-base font-medium text-gray-700 mb-2">
                                Start your first payroll from <span className="text-red-500">*</span>
                            </label>
                            
                            <div className="relative mb-6">
                                <select 
                                    value={startMonth}
                                    onChange={(e) => setStartMonth(e.target.value)}
                                    className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="" hidden>Select</option>
                                    {getFiscalYearMonths(formData.fiscalYear).map((month, idx) => (
                                        <option key={idx} value={month.value}>
                                            {month.label}
                                        </option>
                                    ))}
                                </select>
                                <CaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            {showFirstPayroll && (
                                <>
                                    <label className="block text-base font-medium text-gray-700 mb-2">
                                    Select a pay date for your first payroll <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-base text-gray-500 mb-4">Pay Period: {startMonth}</p>

                                    {salaryCalculation === "actual" ? (
                                        <div className="relative">
                                            <select
                                                value={payDate}
                                                onChange={(e) => setPayDate(e.target.value)}
                                                className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                {payDate && <option value={payDate}>{payDate}</option>}
                                            </select>
                                            <CaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={payDate || ""}
                                                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="dd/mm/yyyy"
                                                readOnly
                                            />
                                            <CaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Calendar */}
                        {showFirstPayroll && (
                            <div className="bg-white">
                                <div className="flex items-center justify-between mb-4">
                                    <button 
                                        type="button"
                                        onClick={() => navigateMonth(-1)}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        <CaretLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {formatMonth(currentMonth)}
                                    </h3>
                                    <button 
                                        type="button"
                                        onClick={() => navigateMonth(1)}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        <CaretRight className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-7 gap-1 mb-2">
                                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                                        <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="grid grid-cols-7 gap-1">
                                    {generateCalendarDays().map((dayObj, index) => {
                                        const isSelectedDay = dayObj.day === selectedDay && 
                                                            dayObj.isCurrentMonth && 
                                                            isPayDateCurrentMonth;
                                        
                                        return (
                                            <div
                                                key={index}
                                                className={`h-8 text-base rounded flex items-center justify-center transition-colors ${
                                                        dayObj.isCurrentMonth
                                                        ? 'text-gray-700'
                                                        : 'text-gray-300'
                                                }`}
                                            >
                                                {dayObj.day}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {salaryCalculation == "organization" && (
                    <div className="w-1/3">
                        <label className="block text-base font-medium text-gray-700 mb-2">
                        Select a pay date for your first payroll <span className="text-red-500">*</span>
                        </label>
                        <p className="text-base text-gray-500 mb-4">Pay Period: {startMonth}</p>

                        {salaryCalculation === "actual" ? (
                            <div className="relative">
                                <select
                                    value={payDate}
                                    onChange={(e) => setPayDate(e.target.value)}
                                    className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {payDate && <option value={payDate}>{payDate}</option>}
                                </select>
                                <CaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        ) : (
                            <div className="relative">
                                <input
                                    type="text"
                                    value={payDate || ""}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-700 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="dd/mm/yyyy"
                                    readOnly
                                />
                                <CaretDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        )}
                    </div>
                )}

                {/* prior Payrun */}
                <div className="w-full flex items-center justify-between space-x-10 pe-20">
                    <div className="w-full">
                        <Applicable 
                            formData={formData}
                            setFormData={setFormData}
                            showDropdown={showDropdown}
                            setShowDropdown={setShowDropdown}
                            handleDropdownSelect={handleDropdownSelect}
                            showSelectDropdown={showSelectDropdown}
                            setShowSelectDropdown={setShowSelectDropdown}
                            selectDropdownRef={selectDropdownRef}
                            dropdownRef={dropdownRef}
                            isPriorPayrun={true}
                            isToggle={true}
                            handleToggle={handleTogglePriorPayrun}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                        <div className="flex gap-3">
                            {payDate && (
                                <button 
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isEditMode ? 'Update' : 'Save'}
                                </button>
                            )}
                            <button 
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 text-base font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-400"
                            >
                                Cancel
                            </button>
                    </div>
                    <p className="text-base text-red-500">* indicates mandatory fields</p>
                </div>
            </div>
        </div>
    );
}

export default FormPaySchedule;