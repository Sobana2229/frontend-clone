import { ArrowRightIcon, Calendar, CaretDownIcon, CaretLeft, CaretRight, ChartBar, CurrencyDollarIcon, FileText, Funnel, Wallet } from "@phosphor-icons/react";
import HeaderReusable from "../../component/setting/headerReusable";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import DashboardAreaChart from "../../component/adminPortal/dashboardAreaChart";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import reportStoreManagements from "../../../store/tdPayroll/report";
import authStoreManagements from "../../../store/tdPayroll/auth";

function Dashboard() {
  const { fetchDataReport, dataDashboard, loading } = reportStoreManagements();
  const { user } = authStoreManagements();
  const [isDropdownPeriodOpen, setIsDropdownPeriodOpen] = useState(false);
  const [isDropdownFilterOpen, setIsDropdownFilterOpen] = useState(false);
  const [filter, setFilter] = useState({
    selectedPeriod: dayjs().format("YYYY-MM"),
    component: "All Components + Taxes",
  })
  
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

  const handleFilterChange = (filterOption) => {
    setFilter((prev) => ({
      ...prev,
      component: filterOption,
    }));
    setIsDropdownFilterOpen(false);
  }

  // handleClickOutside for both dropdowns
  const periodPickerRef = useRef(null);
  const filterPickerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownPeriodOpen && periodPickerRef.current && !periodPickerRef.current.contains(event.target)) {
        setIsDropdownPeriodOpen(false);
      }
      if (isDropdownFilterOpen && filterPickerRef.current && !filterPickerRef.current.contains(event.target)) {
        setIsDropdownFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownPeriodOpen, isDropdownFilterOpen]);

  // Fetch dashboard data on mount and when period changes
  useEffect(() => {
    const fetchDashboardData = async () => {
      const access_token = localStorage.getItem("accessToken");
      if (!access_token) return;
      
      const periodDate = dayjs(filter.selectedPeriod);
      const dateRange = {
        startDate: periodDate.startOf("month").format("YYYY-MM-DD"),
        endDate: periodDate.endOf("month").format("YYYY-MM-DD")
      };
      
      await fetchDataReport(access_token, dateRange, "dashboard");
    };
    
    fetchDashboardData();
  }, [filter.selectedPeriod]);

  // Get data from API or use defaults
  const employeeData = dataDashboard?.employees || { total: 0, citizen: 0, permanent: 0, foreign: 0 };
  const advanceData = dataDashboard?.advance || { salary: 0, spk: 0 };
  const deductionData = dataDashboard?.deduction || { loan: 0, advanceSalary: 0 };
  const pieChartData = dataDashboard?.loanPieData?.length > 0 
    ? dataDashboard.loanPieData 
    : [{ name: 'No Data', value: 1, color: '#e5e7eb' }];
  const pieChartDataAdvanceSalary = dataDashboard?.advanceSalaryPieData?.length > 0 
    ? dataDashboard.advanceSalaryPieData 
    : [{ name: 'No Data', value: 1, color: '#e5e7eb' }];

  const total = dataDashboard?.totalLoan || 0;
  const totalAdvanceSalary = dataDashboard?.totalAdvanceSalary || 0;

  // Calculate percentages for employee bar
  const citizenPercentage = employeeData.total > 0 ? (employeeData.citizen / employeeData.total) * 100 : 0;
  const permanentPercentage = employeeData.total > 0 ? (employeeData.permanent / employeeData.total) * 100 : 0;
  const foreignPercentage = employeeData.total > 0 ? (employeeData.foreign / employeeData.total) * 100 : 0;

  const claims = [
    { id: 1, type: 'Reimbursements', label: 'Reimbursements claim(s) pending approval.' },
    { id: 2, type: 'Salary', label: 'Salary claim(s) pending approval.' },
    { id: 3, type: 'Regularization', label: 'Regularization claim(s) pending approval.' },
    { id: 4, type: 'Leave', label: 'Leave claim(s) pending approval.', hasArrow: true },
    { id: 5, type: 'Attendance', label: 'Attendance claim(s) pending approval.' },
  ];

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleClaimClick = (claim) => {
    if (onClaimClick) {
      onClaimClick(claim);
    }
  };

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
          title={"Dashboard"}
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
            flex flex-row flex-grow items-start justify-start
            w-full
          "        
        >
          {/* Left Section - Main Area */}
          <div
            className="
              flex flex-col
              w-full h-full
              p-6 px-10
              bg-white
              rounded-tl-lg rounded-bl-lg
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
                  <span className="text-[#1f87ff] text-5xl font-semibold">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                </div>

                <div
                >
                  <h1 className="text-2xl font-semibold text-gray-800">
                    Welcome , {user?.name || 'User'}
                  </h1>
                  <p className="text-sm font-semibold text-gray-500">Have a productive day!</p>
                </div>
              </div>
            </div>

            {/* Total Employees Section */}
            <div
              className="
              flex flex-col items-start justify-start
              w-full h-fit
              gap-6 mt-6
            "
            >

              {/* First Part */}
              <div
                className="
                flex flex-col items-start justify-start
                w-full h-fit
                gap-4
              "
              >
                {/* Total Employees */}
                <h2 className="text-lg font-normal text-gray-700">Total Employees</h2>

                {/* Progress Section */}
                <div
                  className="
                  flex flex-col items-start justify-start
                  w-full h-fit
                  border border-gray-200
                  rounded-lg 
                  px-6 py-4
                "
                >

                  <div className="text-5xl font-normal text-gray-800 mb-4">
                    {employeeData.total}
                  </div>

                  {/* Progress Bar */}
                  <div
                    className="w-full h-2 rounded-full gap-[2px] mb-4 flex overflow-hidden"
                  >
                    <div
                      className="h-full bg-[#fbbf24]"
                      style={{ width: `${citizenPercentage}%` }}
                    ></div>
                    <div
                      className="h-full bg-[#5fe6c2]"
                      style={{ width: `${permanentPercentage}%` }}
                    ></div>
                    <div
                      className="h-full bg-[#75b6ff]"
                      style={{ width: `${foreignPercentage}%` }}
                    ></div>
                  </div>

                  {/* Legend */}
                  <div
                    className="
                    min-w-full
                    flex items-center justify-end gap-8 text-sm text-gray-600
                  "
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-[2px] h-6 bg-[#fbbf24]"></div>
                      <span>{employeeData.citizen} Citizen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-[2px] h-6 bg-[#5fe6c2]"></div>
                      <span>{employeeData.permanent} Permanent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-[2px] h-6 bg-[#75b6ff]"></div>
                      <span>{employeeData.foreign} Foreign</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Part */}
              <div
                className="
                  flex flex-row items-start justify-start
                  w-full h-fit
                  border border-gray-200
                  rounded-lg 
                  px-6 py-4
                  gap-64
                "
              >

                {/* Total Outstanding */}
                <div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <ChartBar size={24} className="text-blue-500" weight="regular" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Outstanding</p>
                      <p className="text-2xl font-normal text-gray-800">
                        {formatCurrency(deductionData.loan + deductionData.advanceSalary)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Upcoming Payment */}
                <div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar size={24} className="text-blue-500" weight="regular" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Upcoming Payment</p>
                      <p className="text-2xl font-normal text-gray-800">
                        {dayjs(filter.selectedPeriod).add(1, 'month').startOf('month').add(3, 'day').format('MMM DD, YYYY')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Advance - Deduction Section */}
            <div
              className="
              flex flex-row items-start justify-start
              w-full h-fit
              gap-6 mt-6
            "
            >

              {/* Advance Section */}
              <div
                className="
                    flex flex-col flex-1
                    gap-4
                  "
              >
                <h2 className="text-lg font-normal text-gray-700">Advance</h2>

                {/* Content */}
                <div
                  className="
                  flex flex-row items-center justify-center
                  w-full h-fit
                  border border-gray-200
                  rounded-lg 
                  px-6 py-4
                  gap-32
                "

                >
                  {/* Salary Card */}
                  <div
                    className="
                    flex flex-col items-start justify-start
                  "
                  >
                    <div className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center mb-3">
                      <Wallet size={16} className="text-teal-500" weight="regular" />
                    </div>
                    <p className="text-base text-gray-600">Salary</p>
                    <p className="text-base text-gray-600">{formatCurrency(advanceData.salary)}</p>
                  </div>

                  {/* Pipe Dashed Separator */}
                  <div
                    className="
                    h-[100px] mx-6
                    border-l 
                    border-dashed 
                    border-gray-300
                  "
                  ></div>

                  {/* SPK Card */}
                  <div
                    className="
                    flex flex-col items-start justify-start
                  "
                  >
                    <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center mb-3">
                      <FileText size={16} className="text-orange-500" weight="regular" />
                    </div>
                    <p className="text-base text-gray-600">SPK</p>
                    <p className="text-base text-gray-600">{formatCurrency(advanceData.spk)}</p>
                  </div>
                </div>
              </div>

              {/* Deduction Section */}
              <div
                className="
                    flex flex-col flex-1
                    gap-4
                  "
              >
                <h2 className="text-lg font-normal text-gray-700">Deduction</h2>

                {/* Content */}
                <div
                  className="
                  flex flex-row items-center justify-center
                  w-full h-fit
                  border border-gray-200
                  rounded-lg 
                  px-6 py-4
                  gap-32
                "
                >
                  {/* Loan Card */}
                  <div
                    className="
                    flex flex-col items-start justify-start
                  "
                  >
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                      <CurrencyDollarIcon size={16} className="text-blue-500" weight="regular" />
                    </div>
                    <p className="text-base text-gray-600">Loan</p>
                    <p className="text-base text-gray-600">{formatCurrency(deductionData.loan)}</p>
                  </div>

                  {/* Pipe Dashed Separator */}
                  <div
                    className="
                    h-[100px] mx-6
                    border-l 
                    border-dashed 
                    border-gray-300
                  "
                  ></div>

                  {/* Advance Salary Card */}
                  <div
                    className="
                    flex flex-col items-start justify-start
                  "
                  >
                    <div className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center mb-3">
                      <Wallet size={16} className="text-teal-500" weight="regular" />
                    </div>
                    <p className="text-base text-gray-600">Advance Salary</p>
                    <p className="text-base text-gray-600">{formatCurrency(deductionData.advanceSalary)}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Header Filterbar Section */}
            <div
              className="
              flex flex-row items-start justify-start
              w-full h-fit
              gap-6 mt-6
            "
            >

              <h1
                className="flex-1 text-xl font-semibold text-gray-900"
              >
                For the financial year: {filter.selectedPeriod}
              </h1>

              <div
                className="
                flex flex-row items-center justify-between
                gap-4
              "
              >
                {/* Filter Dropdown */}
                {/* <button
                  onClick={() => setIsDropdownFilterOpen(!isDropdownFilterOpen)}
                  className="flex items-center flex-shrink-0 px-2 gap-2 rounded-lg border border-gray-300"
                >
                  <div className={`w-2 h-2 ${filter.component === "All Components + Taxes" ? "bg-[#5de4c2]" :
                      filter.component === "All Components" ? "bg-blue-500" :
                        "bg-orange-500"
                    } rounded-full`}></div>

                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {filter.component}
                  </span>

                  <div className="relative">
                    <div
                      className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      <CaretDownIcon
                        size={16}
                        className={`transition-transform duration-200 ${isDropdownFilterOpen ? 'rotate-180' : ''}`}
                      />
                    </div>

                    {isDropdownFilterOpen && (
                      <div
                        ref={filterPickerRef}
                        className="absolute top-full -right-2 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                      >
                        <button
                          onClick={() => {
                            handleFilterChange("All Components + Taxes");
                          }}
                          className={`
                            w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 
                            ${filter.component === "All Components + Taxes" ? "border-l-4 border-blue-600" : "border-l-4 border-transparent"}
                          `}
                        >
                          <div className="w-2 h-2 bg-[#5de4c2] rounded-full"></div>
                          <span className="text-sm font-medium text-gray-900">
                            All Components + Taxes
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            handleFilterChange("All Components");
                          }}
                          className={`
                          w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50
                          ${filter.component === "All Components" ? "border-l-4 border-blue-600" : "border-l-4 border-transparent"}
                          `}
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">All Components</span>
                        </button>

                        <button
                          onClick={() => {
                            handleFilterChange("Taxes");
                          }}
                          className={`
                          w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50
                          ${filter.component === "Taxes" ? "border-l-4 border-blue-600" : "border-l-4 border-transparent"}
                          `}
                        >
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Taxes</span>
                        </button>
                      </div>
                    )}
                  </div>
                </button> */}

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

            {/* Area Chart Section */}
            <div
              className="
              w-full h-fit
              py-4
            "
            >
              <DashboardAreaChart />
            </div>

            {/* Pie Chart Section */}
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
                    flex flex-col flex-1
                    gap-4
                  "
              >
                {/* Content */}
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
                  <h1
                    className="text-xl font-semibold text-gray-900"
                  >
                    Loan
                  </h1>

                  {/* Pie and Legend */}
                  <div
                    className="flex flex-row gap-8 items-center"
                  >
                    {/* Pie */}
                    <div
                      className="
                        relative 
                        w-full
                        h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%" minHeight={180} minWidth={180}>
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
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
                              {formatCurrency(total)}
                            </tspan>
                          </text>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Legend with dots */}
                    <div
                      className="flex flex-col gap-3"
                    >
                      {pieChartData.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-base text-gray-600 min-w-[120px]">
                            {item.name}
                          </span>
                          <span className="text-base text-black">
                            {Math.round((item.value / total) * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>


                </div>
              </div>

              {/* Right Pie */}
              <div
                className="
                    flex flex-col flex-1
                    gap-4
                  "
              >
                {/* Content */}
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
                  <h1
                    className="text-xl font-semibold text-gray-900"
                  >
                    Advance Salary
                  </h1>

                  {/* Pie and Legend */}
                  <div
                    className="flex flex-row gap-8 items-center"
                  >
                    {/* Pie */}
                    <div
                      className="
                        relative 
                        w-full
                        h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%" minHeight={180} minWidth={180}>
                        <PieChart>
                          <Pie
                            data={pieChartDataAdvanceSalary}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
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

                    {/* Legend with dots */}
                    <div
                      className="flex flex-col gap-3"
                    >
                      {pieChartDataAdvanceSalary.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-base text-gray-600 min-w-[120px]">
                            {item.name}
                          </span>
                          <span className="text-base text-black">
                            {Math.round((item.value / totalAdvanceSalary) * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>


                </div>
              </div>
            </div>
            
          </div>

          {/* Right Section - Sidebar To do Tasks */}
          <div
            className="
            flex flex-col items-start justify-start
            w-1/4 h-full
            bg-white
            border-l-2 border-l-gray-200
            rounded-tr-lg rounded-br-lg
          "
          >
            {/* Header */}
            <div
              className="
                w-full h-fit
                p-6 border-b border-gray-200
              "
            >
              <h1
                className="text-lg font-normal text-gray-700"
              >
                To Do Tasks
              </h1>
            </div>

            {/* Points */}

            <div
              className="
                w-full h-full
                flex flex-col items-start justify-start p-6 gap-4 overflow-y-auto
              "
            >
              <div
                className="
                flex flex-col items-start justify-start
                flex-shrink-0
                w-full p-2
                border border-gray-200
                rounded-lg
              "
              >
                {claims.map((claim, index) => (
                  <div
                    key={claim.id}
                    className="
                      flex items-center 
                      py-4 px-2 
                      cursor-pointer 
                      hover:bg-gray-50 transition-colors
                      gap-4
                    "
                    onClick={() => handleClaimClick(claim)}
                  >
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                      <span className="text-blue-500 font-normal text-sm">
                        {claim.id}
                      </span>
                    </div>
                    <span className="text-gray-700 text-sm flex-1">
                      {claim.label}
                    </span>
                    {claim.hasArrow && (
                      <ArrowRightIcon size={16} className="text-black -rotate-45" />
                    )}
                  </div>
                ))}
              </div>
            </div>


          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;