import { useEffect, useRef, useState } from "react";
import authStoreManagements from "../../../store/tdPayroll/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HeaderReusable from "../../component/setting/headerReusable";
import { CaretDownIcon, CaretLeft, CaretRight, CaretRightIcon, CurrencyDollarSimpleIcon, Funnel } from "@phosphor-icons/react";
import dayjs from "dayjs";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

function HomeEmployeePortal() {
    const [isDropdownPeriodOpen, setIsDropdownPeriodOpen] = useState(false);
    const [isDropdownLoanOpen, setIsDropdownLoanOpen] = useState(false);
    const [isDropdownAdvanceSalaryOpen, setIsDropdownAdvanceSalaryOpen] = useState(false);

    const [filter, setFilter] = useState({
        selectedPeriod: dayjs().format("YYYY-MM"),
        loanFilter: "Car Loan",
        advanceSalaryFilter: "Festival",
    })

    const periodPickerRef = useRef(null);
    const filterLoanRef = useRef(null);
    const filterAdvanceSalaryRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownPeriodOpen && periodPickerRef.current && !periodPickerRef.current.contains(event.target)) {
                setIsDropdownPeriodOpen(false);
            }
            if (isDropdownLoanOpen && filterLoanRef.current && !filterLoanRef.current.contains(event.target)) {
                setIsDropdownLoanOpen(false);
            }
            if (isDropdownAdvanceSalaryOpen && filterAdvanceSalaryRef.current && !filterAdvanceSalaryRef.current.contains(event.target)) {
                setIsDropdownAdvanceSalaryOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownPeriodOpen, isDropdownLoanOpen, isDropdownAdvanceSalaryOpen]);

    // Period Picker
    const [currentView, setCurrentView] = useState("month"); // "month" or "year"
    const [viewYear, setViewYear] = useState(dayjs().year());
    const [months] = useState([
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ]);
    const yearsPeriodPicker = Array.from({ length: 11 }, (_, i) => viewYear - 5 + i);

    const handlePeriodSelect = (viewYear, monthIndex) => {
        setFilter((prev) => ({
            ...prev,
            selectedPeriod: `${viewYear}-${monthIndex.toString().padStart(2, '0')}`,
        }));
        setIsDropdownPeriodOpen(false);
    };

    const handleFilterLoan = (filterOption) => {
        setFilter((prev) => ({
            ...prev,
            loanFilter: filterOption,
        }));
        setIsDropdownLoanOpen(false);
    }

    const handleFilterAdvanceSalary = (filterOption) => {
        setFilter((prev) => ({
            ...prev,
            advanceSalaryFilter: filterOption,
        }));
        setIsDropdownAdvanceSalaryOpen(false);
    }

    const getMonthsYear = (dateString) => {
        console.log("dateString>>>", {dateString})
        const date = dayjs(dateString);
        return date.format("MMM, YYYY");
    }

    const formatCurrency = (amount) => {
        return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // DUMMIES
    const userData = {
        username: 'mubeenbus',
        totalEmployees: 50,
        citizenCount: 25,
        permanentCount: 40,
        foreignCount: 10,
        totalOutstanding: 50000.00,
        upcomingPaymentDate: 'Oct 22, 2025'
    };

    const pieChartPaySlipsData = [
        { name: 'Take Home', value: 4000, color: '#5fe6c2' },      
        { name: 'Deductions', value: 2000, color: '#f25a51' },     
    ];
    const totalPayslips = pieChartPaySlipsData.reduce((sum, item) => sum + item.value, 0);

    const pieChartLoanData = [
        { name: 'Car Loan', value: 4000, color: '#5fe6c2' },
        { name: 'Rest', value: 2000, color: '#ebfff5' },
    ];
    const totalLoan = pieChartLoanData.reduce((sum, item) => sum + item.value, 0);

    const pieChartDataAdvanceSalary = [
        { name: 'Festival', value: 6000, color: '#ffa900' },   
        { name: 'Rest', value: 4000, color: '#ffe7c3' },   
    ];
    const totalAdvanceSalary = pieChartDataAdvanceSalary.reduce((sum, item) => sum + item.value, 0);

    return (
        <div
            className="
                w-full h-full 
                flex flex-col items-start justify-start
                bg-white
            "
        >
            {/* Sub Header */}
            <div
                className="
                    w-full
                    flex flex-row flex-shrink-0
                    pt-16
                "
            >
                <HeaderReusable
                    title={"Home"}
                    isAddData={false}
                    isOption={false}
                    isShowX={true}
                    handleX={null}
                />
            </div>

          {/* Main Container - gray border w/ padding */}
            <div
                className="
                flex flex-col
                items-start justify-start
                w-full h-full
                p-6
                bg-gray-td-300
                overflow-auto
                "
            >


                {/* Sub Container - white bg rounded */}
                <div
                    className="
                    flex flex-col flex-grow items-start justify-start
                    p-10 gap-10
                    w-full
                    bg-white
                    rounded-lg
                    "
                >

                    {/* Welcome Section */}
                    <div
                        className="
                        w-full h-fit
                        rounded-lg shadow-sm 
                        px-6 py-4
                        border border-gray-200
                        bg-gradient-to-r from-white to-gray-100
                        "
                    >
                        <div
                            className="flex items-center gap-4"
                        >
                            <div
                                className="
                                w-16 h-16 
                                flex items-center justify-center
                                bg-[#eaf3ff] rounded-lg 
                                "
                            >
                                <span className="text-[#1f87ff] text-5xl font-semibold">M</span>
                            </div>

                            <div>
                                <h1 className="text-2xl font-semibold text-gray-800">
                                    Welcome back, {userData.username}
                                </h1>
                                <p className="text-sm font-semibold text-gray-500">Have a productive day!</p>
                            </div>
                        </div>
                    </div>

                    {/* Your Payslips Section */}
                    <div
                        className="
                        w-full h-fit
                        rounded-lg shadow-sm 
                        p-12 pb-0
                        border border-gray-200
                        "
                    >
                        {/* Header with Filterbar Section */}
                        <div
                            className="
                            flex flex-row items-center justify-start
                            w-full h-fit
                            gap-6
                            "
                        >   

                            <div className="flex-1 flex flex-row items-center gap-2">
                                <CurrencyDollarSimpleIcon size={20} className="text-black" />
                                <h1
                                    className="text-2xl font-semibold text-gray-900"
                                >
                                    Your Payslips
                                </h1>
                            </div>


                            <div
                                className="
                                    flex flex-row items-center justify-between
                                    gap-4
                                "
                            >

                                {/* Period Dropdown */}
                                <button
                                    onClick={() => setIsDropdownPeriodOpen(!isDropdownPeriodOpen)}
                                    className="
                                    flex items-center
                                    flex-shrink-0
                                    px-2 gap-2
                                    rounded-lg
                                    border border-gray-300"
                                >
                                    {/* Filter Icon */}
                                    <Funnel size={16} className="text-gray-600" />

                                    {/* Financial Year */}
                                    <span className="text-sm text-gray-600 whitespace-nowrap">Financial Year :</span>

                                    {/* Period Range */}
                                    <div className="relative">
                                        <div
                                            className="flex items-center space-x-2 text-sm font-medium text-black hover:text-blue-700"
                                        >
                                            <span>{filter.selectedPeriod}</span>
                                            <CaretDownIcon
                                                size={16}
                                                className={`transition-transform duration-200 ${isDropdownPeriodOpen ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </div>

                                        {isDropdownPeriodOpen && (
                                            <div
                                                className="absolute top-full -right-2 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-10 w-80"
                                                ref={periodPickerRef}
                                            >
                                                {/* Header */}
                                                <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
                                                    {currentView === "month" ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // ← ADD THIS
                                                                    setViewYear(viewYear - 1);
                                                                }}
                                                                className="p-1 hover:bg-[#F3F4F6] rounded"
                                                            >
                                                                <CaretLeft size={16} className="text-[#6B7280]" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // ← ADD THIS
                                                                    setCurrentView("year");
                                                                }}
                                                                className="text-sm font-medium text-[#111827] hover:text-[#1F87FF] px-3 py-1"
                                                            >
                                                                {viewYear}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // ← ADD THIS
                                                                    setViewYear(viewYear + 1);
                                                                }}
                                                                className="p-1 hover:bg-[#F3F4F6] rounded"
                                                            >
                                                                <CaretRight size={16} className="text-[#6B7280]" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // ← ADD THIS
                                                                    setViewYear(viewYear - 10);
                                                                }}
                                                                className="p-1 hover:bg-[#F3F4F6] rounded"
                                                            >
                                                                <CaretLeft size={16} className="text-[#6B7280]" />
                                                            </button>
                                                            <span className="text-sm font-medium text-[#111827]">
                                                                {viewYear - 5} - {viewYear + 5}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // ← ADD THIS
                                                                    setViewYear(viewYear + 10);
                                                                }}
                                                                className="p-1 hover:bg-[#F3F4F6] rounded"
                                                            >
                                                                <CaretRight size={16} className="text-[#6B7280]" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Content*/}
                                                <div className="p-4">
                                                    {currentView === "month" ? (
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {months.map((month, index) => {
                                                                const monthIndex = index + 1;
                                                                const isSelected =
                                                                    filter.selectedPeriod &&
                                                                    dayjs(filter.selectedPeriod).year() === viewYear &&
                                                                    dayjs(filter.selectedPeriod).month() === index;
                                                                const isCurrentMonth =
                                                                    dayjs().year() === viewYear && dayjs().month() === index;

                                                                return (
                                                                    <button
                                                                        key={month}
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            handlePeriodSelect(viewYear, monthIndex);
                                                                        }}
                                                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isSelected
                                                                            ? "bg-[#1F87FF] text-white"
                                                                            : isCurrentMonth
                                                                                ? "bg-[#F5FAFF] text-[#1F87FF] hover:bg-[#E0F2FE]"
                                                                                : "text-[#111827] hover:bg-[#F3F4F6]"
                                                                            }`}
                                                                    >
                                                                        {month}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                                                            {yearsPeriodPicker.map((year) => {
                                                                const isSelected =
                                                                    filter.selectedPeriod && dayjs(filter.selectedPeriod).year() === year;
                                                                const isCurrentYear = dayjs().year() === year;

                                                                return (
                                                                    <button
                                                                        key={year}
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation(); // ← ADD THIS
                                                                            setViewYear(year);
                                                                            setCurrentView("month");
                                                                        }}
                                                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isSelected
                                                                            ? "bg-[#1F87FF] text-white"
                                                                            : isCurrentYear
                                                                                ? "bg-[#F5FAFF] text-[#1F87FF] hover:bg-[#E0F2FE]"
                                                                                : "text-[#111827] hover:bg-[#F3F4F6]"
                                                                            }`}
                                                                    >
                                                                        {year}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Pie Chart with Legends */}
                        <div
                            className="
                                flex flex-col items-center justify-start
                                w-full h-fit
                                px-6 py-12
                                gap-4
                                border-b border-gray-200
                            "
                        >

                            {/* Pie and Legend */}
                            <div className="flex flex-row gap-64 items-center">
                                {/* Pie */}
                                <div
                                    className="
                                        relative 
                                        w-full
                                        h-full"
                                >
                                    <ResponsiveContainer width="100%" height="100%" minHeight={360} minWidth={360}>
                                        <PieChart>
                                            <Pie
                                                data={pieChartPaySlipsData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={90}
                                                outerRadius={150}
                                                paddingAngle={2}
                                                startAngle={90}
                                                endAngle={-270}
                                                dataKey="value"
                                            >
                                                {pieChartPaySlipsData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            {/* Center label */}
                                            <text
                                                x="50%"
                                                y="50%"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    className="text-lg text-gray-600"
                                                    x="50%" dy="0 em"
                                                >
                                                    {getMonthsYear(filter.selectedPeriod)}
                                                </tspan>
                                            </text>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Legend with dots */}
                                <div className="flex flex-col gap-8">
                                    {pieChartPaySlipsData.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3"
                                        >
                                            <div
                                                className="w-[2px] h-24" 
                                                style={{ backgroundColor: item.color }}
                                            />

                                            <div
                                                className="flex flex-col items-start justify-center w-40"
                                            >
                                                <span className="text-lg text-gray-600 min-w-[120px]">
                                                    {item.name}
                                                </span>
                                                <span className="text-lg text-black">
                                                    {/* item.value */} **********
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Gross Pay */}
                                    <div className="flex items-center gap-3" >
                                        <div
                                            className="w-[2px] h-24 bg-gray-400"
                                        />

                                        <div
                                            className="flex flex-col items-start justify-center w-40"
                                        >
                                            <span className="text-lg text-gray-600 min-w-[120px]">
                                                Gross Pay
                                            </span>
                                            <span className="text-lg text-black">
                                                {/* total */} **********
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                        {/* View Payslip */}
                        <div
                            className="
                                flex flex-row items-center justify-center
                                w-full h-fit
                                py-4 gap-1
                            "
                        >
                            <Link
                                to={"#"}
                                className="text-[#5881ff] text-lg"
                            >
                                View Payslip
                            </Link>
                            <CaretRightIcon size={20} weight="regular" className="text-[#5881ff] mt-1" />
                        </div>
                    </div>

                    {/* Duo Piechart Section */}
                    <div
                        className="
                        flex flex-row items-start justify-start
                        w-full h-fit
                        gap-6 mt-6
                        "
                    >
                        {/* Left Pie */}
                        <div
                            className="
                                flex flex-col items-start justify-start
                                w-full h-fit
                                border border-gray-200
                                rounded-lg 
                                px-6 py-4
                                gap-4
                                "

                        >   
                            {/* Header and Filter */}
                            <div
                                className="
                                    flex flex-row items-center justify-between
                                    w-full h-fit
                                "
                            >
                                <h1
                                    className="text-xl font-semibold text-gray-900"
                                >
                                    Loan
                                </h1>

                                {/* Filter Dropdown */}
                                <button
                                    onClick={() => setIsDropdownLoanOpen(!isDropdownLoanOpen)}
                                    className="flex items-center flex-shrink-0 px-2 gap-2 rounded-lg border border-gray-300"
                                >
                
                                    {/* Selected Filter Text */}
                                    <span className="text-sm text-gray-600 whitespace-nowrap">
                                    {filter.loanFilter}
                                    </span>
                
                                    {/* Filter Button */}
                                    <div className="relative">
                                    <div
                                        className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        <CaretDownIcon
                                        size={16}
                                        className={`transition-transform duration-200 ${isDropdownLoanOpen ? 'rotate-180' : ''}`}
                                        />
                                    </div>
                
                                    {isDropdownLoanOpen && (
                                        <div
                                        ref={filterLoanRef}
                                        className="absolute top-full -right-2 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                                        >
                                        {/* Option 1: Car Loan */}
                                        <button
                                            onClick={() => {
                                            handleFilterLoan("Car Loan");
                                            }}
                                            className={`
                                            w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 
                                            ${filter.loanFilter === "Car Loan" ? "border-l-4 border-blue-600" : "border-l-4 border-transparent"}
                                            `}
                                        >
                                            <span className="text-sm font-medium text-gray-900">
                                            Car Loan
                                            </span>
                                        </button>
                
                                        {/* Option 2: Bike Loan */}
                                        <button
                                            onClick={() => {
                                            handleFilterLoan("Bike Loan");
                                            }}
                                            className={`
                                            w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50
                                            ${filter.loanFilter === "Bike Loan" ? "border-l-4 border-blue-600" : "border-l-4 border-transparent"}
                                            `}
                                        >
                                            <span className="text-sm text-gray-700">Bike Loan</span>
                                        </button>
                
                                        {/* Personal Loan */}
                                        <button
                                            onClick={() => {
                                            handleFilterLoan("Personal Loan");
                                            }}
                                            className={`
                                            w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50
                                            ${filter.loanFilter === "Personal Loan" ? "border-l-4 border-blue-600" : "border-l-4 border-transparent"}
                                            `}
                                        >
                                            <span className="text-sm text-gray-700">Personal Loan</span>
                                        </button>
                                        </div>
                                    )}
                                    </div>
                                </button>

                            </div>

                            {/* Pie and Legend */}
                            <div
                                className="
                                    flex flex-row gap-8 items-center
                                    w-full
                                "
                            >
                                {/* Pie */}
                                <div
                                    className="
                                        relative 
                                        w-full
                                        h-full"
                                >
                                    <ResponsiveContainer width="100%" height="100%" minHeight={240} minWidth={240}>
                                        <PieChart>
                                            <Pie
                                                data={pieChartLoanData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={120}
                                                paddingAngle={2}
                                                startAngle={90}
                                                endAngle={-270}
                                                dataKey="value"
                                            >
                                                {pieChartLoanData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            {/* Center label */}
                                            <text
                                                x="50%"
                                                y="50%"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    className="text-base text-gray-600"
                                                    x="50%" dy="-0.8em"
                                                >
                                                    Total
                                                </tspan>
                                                <tspan
                                                    className="text-xl text-gray-600"
                                                    x="50%" dy="1.5em"
                                                >
                                                    {formatCurrency(totalLoan)}
                                                </tspan>
                                            </text>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                        </div>


                        {/* Right Pie */}
                        <div
                            className="
                            flex flex-col items-start justify-start
                            w-full h-fit
                            border border-gray-200
                            rounded-lg 
                            px-6 py-4
                            gap-4
                            "
                        >
                            {/* Header and Filter */}
                            <div
                                className="
                                    flex flex-row items-center justify-between
                                    w-full h-fit
                                "
                            >
                                <h1
                                    className="text-xl font-semibold text-gray-900"
                                >
                                    Advance Salary
                                </h1>

                                {/* Filter Dropdown */}
                                <button
                                    onClick={() => setIsDropdownAdvanceSalaryOpen(!isDropdownAdvanceSalaryOpen)}
                                    className="flex items-center flex-shrink-0 px-2 gap-2 rounded-lg border border-gray-300"
                                >
                
                                    {/* Selected Filter Text */}
                                    <span className="text-sm text-gray-600 whitespace-nowrap">
                                    {filter.advanceSalaryFilter}
                                    </span>
                
                                    {/* Filter Button */}
                                    <div className="relative">
                                    <div
                                        className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        <CaretDownIcon
                                        size={16}
                                        className={`transition-transform duration-200 ${isDropdownAdvanceSalaryOpen ? 'rotate-180' : ''}`}
                                        />
                                    </div>
                
                                    {isDropdownAdvanceSalaryOpen && (
                                        <div
                                        ref={filterAdvanceSalaryRef}
                                        className="absolute top-full -right-2 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                                        >
                                        {/* Option 1: Festival */}
                                        <button
                                            onClick={() => {
                                            handleFilterAdvanceSalary("Festival");
                                            }}
                                            className={`
                                            w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 
                                            ${filter.advanceSalaryFilter === "Festival" ? "border-l-4 border-blue-600" : "border-l-4 border-transparent"}
                                            `}
                                        >
                                            <span className="text-sm font-medium text-gray-900">
                                            Festival
                                            </span>
                                        </button>
                
                                        {/* Option 2: Personal */}
                                        <button
                                            onClick={() => {
                                            handleFilterAdvanceSalary("Personal");
                                            }}
                                            className={`
                                            w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50
                                            ${filter.advanceSalaryFilter === "Personal" ? "border-l-4 border-blue-600" : "border-l-4 border-transparent"}
                                            `}
                                        >
                                            <span className="text-sm text-gray-700">Personal</span>
                                        </button>
                
                                        {/* Travel */}
                                        <button
                                            onClick={() => {
                                            handleFilterAdvanceSalary("Travel");
                                            }}
                                            className={`
                                            w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50
                                            ${filter.advanceSalaryFilter === "Travel" ? "border-l-4 border-blue-600" : "border-l-4 border-transparent"}
                                            `}
                                        >
                                            <span className="text-sm text-gray-700">Travel</span>
                                        </button>
                                        </div>
                                    )}
                                    </div>
                                </button>

                            </div>

                            {/* Pie and Legend */}
                            <div
                                className="
                                    flex flex-row gap-8 items-center
                                    w-full
                                "
                            >
                                {/* Pie */}
                                <div
                                    className="
                                    relative 
                                    w-full
                                    h-full"
                                >
                                    <ResponsiveContainer width="100%" height="100%" minHeight={240} minWidth={240}>
                                        <PieChart>
                                            <Pie
                                                data={pieChartDataAdvanceSalary}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={120}
                                                paddingAngle={2}
                                                startAngle={90}
                                                endAngle={-270}
                                                dataKey="value"
                                            >
                                                {pieChartDataAdvanceSalary.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            {/* Center label */}
                                            <text
                                                x="50%"
                                                y="50%"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    className="text-base text-gray-600"
                                                    x="50%" dy="-0.8em"
                                                >
                                                    Total
                                                </tspan>
                                                <tspan
                                                    className="text-xl text-gray-600"
                                                    x="50%" dy="1.5em"
                                                >
                                                    {formatCurrency(totalAdvanceSalary)}
                                                </tspan>
                                            </text>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>


                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default HomeEmployeePortal;