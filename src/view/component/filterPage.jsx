import { ArrowDown, CalendarBlankIcon, CaretDown, Plus, Info, CurrencyDollarIcon, DotsThree, Funnel, GitBranch, MapPin, Notification, User, UserCircle, Users, WarningCircle, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import organizationStoreManagements from "../../store/tdPayroll/setting/organization";
import Select from "react-select";
import CustomOption from "./customOption";
import leaveAndAttendanceStoreManagements from "../../store/tdPayroll/setting/leaveAndAttendance";
import { EmployeeHeadersoptionFilter, employeeLoanEarningOptions, employeePageOptions } from "../../../data/dummy";
import employeeStoreManagements from "../../store/tdPayroll/employee";
import dayjs from "dayjs";
import PeriodPicker from "./employeePortal/PeriodPicker";
import LoanList from "./loan/loanList";
import { useMemo } from "react";
import { 
  Users2, 
  FileText, 
  Activity, 
  Hash, 
  PlusCircle, 
  MoreVertical 
} from "lucide-react";

const formatPeriodDisplay = (period) => {
    if (!period) return "";
    const date = dayjs(period);
    const year = date.year();
    const month = date.format("MM");
    return `${year} - ${month}`;
};

function FilterPage({
    filterFor,
    addData,
    addLoans,
     dataTable = [],
    setFilter = undefined,
    filter = {},
    onlyAll = false,
    isAll = false,
    isHeader = true,
    showIncompleteOnly = false,
    setShowIncompleteOnly = undefined
}) {
    const { designationOptions, departementOptions, fetchOrganizationSetting } = organizationStoreManagements();
    const { fetchWorkLocationOptions, workLocationOptions } = leaveAndAttendanceStoreManagements();
    const { getEmployeeOverview, dataEmployeesOptions } = employeeStoreManagements();
    
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenOptions, setIsOpenOptions] = useState(false);
    const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
    const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
    const [isLoanNameOpen, setIsLoanNameOpen] = useState(false);
    const [isLoanStatusOpen, setIsLoanStatusOpen] = useState(false);
    const [isLoanNumberOpen, setIsLoanNumberOpen] = useState(false);
    
    const dropdownRef = useRef(null);
    const employeeDropdownRef = useRef(null);
    const periodDropdownRef = useRef(null);
    const statusDropdownRef = useRef(null);
    const loanEmployeeRef = useRef(null);
    const loanNameRef = useRef(null);
    const loanStatusRef = useRef(null);
    const loanNumberRef = useRef(null);

    const options =
        filterFor === "employee" ? 
            EmployeeHeadersoptionFilter : 
            filterFor === "claims" ? 
                EmployeeHeadersoptionFilter :
                filterFor === "leave-approval" ?
                    EmployeeHeadersoptionFilter :
                    [];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpenOptions(false);
            }
            if (employeeDropdownRef.current && !employeeDropdownRef.current.contains(event.target)) {
                setIsEmployeeDropdownOpen(false);
            }
            if (periodDropdownRef.current && !periodDropdownRef.current.contains(event.target)) {
                setIsPeriodDropdownOpen(false);
            }
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
                setIsStatusDropdownOpen(false);
            }
            if (loanEmployeeRef.current && !loanEmployeeRef.current.contains(event.target)) {
                setIsEmployeeOpen(false);
            }
            if (loanNameRef.current && !loanNameRef.current.contains(event.target)) {
                setIsLoanNameOpen(false);
            }
            if (loanStatusRef.current && !loanStatusRef.current.contains(event.target)) {
                setIsLoanStatusOpen(false);
            }
            if (loanNumberRef.current && !loanNumberRef.current.contains(event.target)) {
                setIsLoanNumberOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if(designationOptions?.length === 0) {
            const access_token = localStorage.getItem("accessToken");
            fetchOrganizationSetting("designation", access_token, false, null, true);
        }
    }, []);

    useEffect(() => {
        if (!dataEmployeesOptions) {
            const access_token = localStorage.getItem("accessToken");
            getEmployeeOverview(access_token, "employeeOptions");
        }
    }, []);

    useEffect(() => {
        if(departementOptions?.length === 0) {
            const access_token = localStorage.getItem("accessToken");
            fetchOrganizationSetting("departement", access_token, false, null, true);
        }
    }, []);
    
    useEffect(() => {
        if(!Array.isArray(workLocationOptions) || workLocationOptions?.length === 0) {
            const access_token = localStorage.getItem("accessToken");
            fetchWorkLocationOptions(access_token);
        }
    }, []);  

    const getSelectedValue = (options, valueKey) => {
        if (!filter[valueKey] || !Array.isArray(options)) return null;
        return options.find(option => option.value === filter[valueKey]) || null;
    };

    const handleEmployeeSelect = async (selectedOption) => {
        setFilter(prev => ({
            ...prev,
            employeeUuid: selectedOption?.value || null
        }))
        setIsEmployeeDropdownOpen(false);
    };

    const handleLoanEmployeeSelect = (selectedOption) => {
        setFilter(prev => ({
            ...prev,
            loanEmployeeUuid: selectedOption?.value || null
        }))
        setIsEmployeeOpen(false);
    };

    const handleLoanNameSelect = (loanName) => {
        setFilter(prev => ({
            ...prev,
            loanName: loanName
        }))
        setIsLoanNameOpen(false);
    };

    const handleLoanStatusSelect = (status) => {
        setFilter(prev => ({
            ...prev,
            loanStatus: status
        }))
        setIsLoanStatusOpen(false);
    };

    const handleLoanNumberChange = (e) => {
        setFilter(prev => ({
            ...prev,
            loanNumber: e.target.value
        }))
    };

    const handleIsSalaryAdvanceSelect = async (selectedOption) => {
        setFilter(prev => ({
            ...prev,
            isSalaryAdvance: selectedOption.value
        }))
    };

    const handleOptionSelect = (value) => {
        setFilter(prev => ({
            ...prev,
            status: value
        }))
        setIsOpen(false);
        setIsStatusDropdownOpen(false);
    };

    // Dummy loan names - replace with actual data from your store
    const loanNameOptions = [
        "Personal Loan",
        "Salary Advance",
        "Emergency Loan",
        "Education Loan",
        "Housing Loan"
    ];

    const loanStatusOptions = ["All", "Active", "Completed", "Pending", "Rejected"];
const filteredLoans = dataTable?.filter((loan) => {
    // 1️⃣ Employee filter
    if (filter.loanEmployeeUuid) {
        if (loan?.Employee?.uuid !== filter.loanEmployeeUuid) return false;
    }

    // 2️⃣ Loan Name filter
    if (filter.loanName) {
        const loanName = loan?.LoanName?.name || loan?.loanType;
        if (loanName !== filter.loanName) return false;
    }
});
    // ============================================================
    // RENDER FOR CLAIMS SECTION - SIMPLE COMPACT DESIGN
    // ============================================================
    if (filterFor === "claims") {
    const selectedEmployee = getSelectedValue(dataEmployeesOptions, "employeeUuid");

    return (
        <div className="w-[120%] bg-white px-1 py-9 border-gray-200">
            <div className="flex items-center gap-4 w-full">

                {/* FILTER BY */}
                <span className="text-sm text-gray-200">FILTER BY :</span>

                {/* Employee Dropdown */}
                <div className="relative" ref={employeeDropdownRef}>
                    <button
                        onClick={() => setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 min-w-[180px]"
                    >
                        <Users size={18} className="text-gray-500" />
                        <span className="text-sm text-gray-700 flex-1 text-left">
                            {filter.employeeUuid ? selectedEmployee?.label : "Employee"}
                        </span>
                        <CaretDown size={14} className="text-gray-500" />
                    </button>

                    {isEmployeeDropdownOpen && (
                        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                            {dataEmployeesOptions?.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleEmployeeSelect(opt)}
                                    className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Period Picker */}
                <div className="relative" ref={periodDropdownRef}>
                    <button
                        onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 min-w-[180px]"
                    >
                        <CalendarBlankIcon size={18} className="text-gray-500" />
                        <span className="text-sm text-gray-700 flex-1 text-left">
                            {filter.period ? formatPeriodDisplay(filter.period) : "Select Period"}
                        </span>
                        <CaretDown size={14} className="text-gray-500" />
                    </button>

                    {isPeriodDropdownOpen && (
                        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2">
                            <input
                                type="month"
                                value={filter.period || ""}
                                onChange={(e) =>
                                    setFilter((prev) => ({ ...prev, period: e.target.value }))
                                }
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Status Dropdown */}
                <div className="relative" ref={statusDropdownRef}>
                    <button
                        onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 min-w-[160px]"
                    >
                        <Activity size={18} className="text-gray-500" />
                        <span className="text-sm text-[rgba(28,28,28,0.5)] flex-1 text-left capitalize">
                            {filter.status ? filter.status : "Status"}
                        </span>
                        <CaretDown size={14} className="text-gray-500" />
                    </button>

                    {isStatusDropdownOpen && (
                        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50">
                            {["all", "pending", "approved", "rejected"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleOptionSelect(status)}
                                    className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 capitalize"
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT SIDE BUTTONS */}
                <div className="flex items-center gap-3 ml-auto">

                    {/* Add Claim Button */}
                    <button
                        onClick={() => addData()}
                        className="px-4 py-2 bg-[#0066FE] text-white rounded-md hover:bg-blue-700 flex items-center gap-2 drop-shadow-[0_5px_4px_rgba(0,102,221,0.15)]"
                    >
                        <span>Add Claim</span>

                        {/* Plus inside circle */}
                        <span className="w-5 h-5 flex items-center justify-center rounded-full border border-white">
                            <Plus size={12} weight="bold" />
                        </span>
                    </button>

                    {/* Three Dots */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsOpenOptions(!isOpenOptions)}
                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            <DotsThree size={24} weight="bold" />
                        </button>

                        {isOpenOptions && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                {employeePageOptions?.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setIsOpenOptions(false)}
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// COMPLETE FilterPage.jsx - LOANS SECTION ONLY
// ============================================

if (filterFor === "Loans") {
    const selectedLoanEmployee = getSelectedValue(dataEmployeesOptions, "loanEmployeeUuid");
    const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
    const [loanNameSearchTerm, setLoanNameSearchTerm] = useState("");

    // Filter employees based on search
    const filteredEmployees = dataEmployeesOptions?.filter(employee =>
        employee.label.toLowerCase().includes(employeeSearchTerm.toLowerCase())
    ) || [];

    // Get unique loan names from dataTable prop
    const loanNameOptions = useMemo(() => {
        if (!dataTable || !Array.isArray(dataTable)) return [];
        const uniqueNames = [...new Set(
            dataTable.map(loan => loan?.LoanName?.name || loan?.loanType || loan?.loanName)
                .filter(Boolean)
        )];
        return uniqueNames;
    }, [dataTable]);

    // Filter loan names based on search
    const filteredLoanNames = loanNameOptions.filter(name =>
        name.toLowerCase().includes(loanNameSearchTerm.toLowerCase())
    );

    return (
        <div className="w-full pt-12">
            <div className="w-[97%] mx-auto px-4 pt-10 pb-5 bg-white border-y border-gray-200">
                <div className="w-full h-[60px] border border-neutral-200 rounded-md bg-white flex items-center px-5 relative">
                    <span className="text-[14px] font-medium text-neutral-500">
                        FILTER BY :
                    </span>

                    {/* Employee Dropdown with Search */}
                    <div className="relative ml-8" ref={loanEmployeeRef}>
                        <div 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => {
                                setIsEmployeeOpen(!isEmployeeOpen);
                                setEmployeeSearchTerm("");
                            }}
                        >
                            <Users2 size={18} className="text-neutral-400" />
                            
                            {filter.loanEmployeeUuid ? (
                                <div className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1 rounded-full">
                                    <Users2 size={16} className="text-white" />
                                    <span className="text-[13px] font-medium">
                                        {selectedLoanEmployee?.label}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLoanEmployeeSelect({ value: null, label: "All Employees" });
                                        }}
                                        className="w-4 h-4 rounded-full border border-white flex items-center justify-center hover:bg-blue-700 ml-1"
                                    >
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 6L6 18M6 6l12 12"/>
                                        </svg>
                                    </button>
                                    <CaretDown 
                                        size={14} 
                                        className="text-white ml-0.5" 
                                    />
                                </div>
                            ) : (
                                <>
                                    <span className="text-[14px] font-medium text-neutral-400">
                                        Employee
                                    </span>
                                    <CaretDown 
                                        size={14} 
                                        className={`text-neutral-500 transition-transform ${isEmployeeOpen ? 'rotate-180' : ''}`} 
                                    />
                                </>
                            )}
                        </div>

                        {isEmployeeOpen && (
                            <div className="absolute top-full mt-2 left-0 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                <div className="p-2 border-b border-gray-200">
                                    <div className="relative">
                                        <svg 
                                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
                                            width="14" 
                                            height="14" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                        >
                                            <circle cx="11" cy="11" r="8"/>
                                            <path d="m21 21-4.35-4.35"/>
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Search employee..."
                                            value={employeeSearchTerm}
                                            onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                                            className="w-full pl-8 pr-3 py-1.5 text-sm border border-blue-500 rounded focus:outline-none focus:border-blue-600"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                </div>

                                <div className="max-h-52 overflow-y-auto">
                                    {filteredEmployees.length > 0 ? (
                                        filteredEmployees.map((employee) => (
                                            <button
                                                key={employee.value}
                                                onClick={() => {
                                                    handleLoanEmployeeSelect(employee);
                                                    setIsEmployeeOpen(false);
                                                }}
                                                className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 flex items-center relative ${
                                                    filter.loanEmployeeUuid === employee.value ? 'bg-gray-100' : ''
                                                }`}
                                            >
                                                {filter.loanEmployeeUuid === employee.value && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-black rounded-r-full" />
                                                )}
                                                <span className={filter.loanEmployeeUuid === employee.value ? 'ml-2' : ''}>
                                                    {employee.label}
                                                </span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-3 py-2.5 text-sm text-gray-500 text-center">
                                            No employees found
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mx-6 h-6 border-r border-dashed border-neutral-300" />

                    {/* Loan Name Dropdown with Search */}
                    <div className="relative" ref={loanNameRef}>
                        <div 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => {
                                setIsLoanNameOpen(!isLoanNameOpen);
                                setLoanNameSearchTerm("");
                            }}
                        >
                            <FileText size={18} className="text-neutral-400" />
                            
                            {filter.loanName ? (
                                <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full">
                                    <span className="text-[13px] font-medium">
                                        {filter.loanName}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLoanNameSelect(null);
                                        }}
                                        className="w-4 h-4 rounded-full border border-white flex items-center justify-center hover:bg-blue-700"
                                    >
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 6L6 18M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <span className="text-[14px] font-medium text-neutral-400">
                                        Loan Name
                                    </span>
                                    <CaretDown 
                                        size={14} 
                                        className={`text-neutral-500 transition-transform ${isLoanNameOpen ? 'rotate-180' : ''}`} 
                                    />
                                </>
                            )}
                        </div>

                        {isLoanNameOpen && (
                            <div className="absolute top-full mt-2 left-0 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                <div className="p-3 border-b border-gray-200">
                                    <div className="relative">
                                        <svg 
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                                            width="16" 
                                            height="16" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2"
                                        >
                                            <circle cx="11" cy="11" r="8"/>
                                            <path d="m21 21-4.35-4.35"/>
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Search loan type..."
                                            value={loanNameSearchTerm}
                                            onChange={(e) => setLoanNameSearchTerm(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                </div>

                                <div className="max-h-60 overflow-y-auto">
                                    <button
                                        onClick={() => {
                                            handleLoanNameSelect(null);
                                            setIsLoanNameOpen(false);
                                        }}
                                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-100 border-b"
                                    >
                                        All Loan Types
                                    </button>
                                    {filteredLoanNames.length > 0 ? (
                                        filteredLoanNames.map((name) => (
                                            <button
                                                key={name}
                                                onClick={() => {
                                                    handleLoanNameSelect(name);
                                                    setIsLoanNameOpen(false);
                                                }}
                                                className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-100 ${
                                                    filter.loanName === name ? 'bg-blue-50' : ''
                                                }`}
                                            >
                                                {name}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                            No loan types found
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mx-6 h-6 border-r border-dashed border-neutral-300" />

                    {/* Loan Status Dropdown */}
                    <div className="relative" ref={loanStatusRef}>
                        <div 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsLoanStatusOpen(!isLoanStatusOpen)}
                        >
                            <Activity size={18} className="text-neutral-400" />
                            <span className="text-[14px] font-medium text-neutral-400 capitalize">
                                {filter.loanStatus || "Loan Status"}
                            </span>
                            <CaretDown 
                                size={14} 
                                className={`text-neutral-500 transition-transform ${isLoanStatusOpen ? 'rotate-180' : ''}`} 
                            />
                        </div>

                        {isLoanStatusOpen && (
                            <div className="absolute top-full mt-2 left-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                {loanStatusOptions.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            handleLoanStatusSelect(status);
                                            setIsLoanStatusOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 capitalize"
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mx-6 h-6 border-r border-dashed border-neutral-300" />

                    {/* Loan Number Input */}
                    <div className="relative" ref={loanNumberRef}>
                        <div 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsLoanNumberOpen(!isLoanNumberOpen)}
                        >
                            <Hash size={18} className="text-neutral-400" />
                            <span className="text-[14px] font-medium text-neutral-400">
                                {filter.loanNumber || "Loan Number"}
                            </span>
                            <CaretDown size={14} className="text-neutral-500" />
                        </div>

                        {isLoanNumberOpen && (
                            <div className="absolute top-full mt-2 left-0 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-3">
                                <input
                                    type="text"
                                    placeholder="Enter loan number"
                                    value={filter.loanNumber || ""}
                                    onChange={handleLoanNumberChange}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>

                    {/* View Loan Repayment */}
                    <button
                        className="ml-auto w-[218px] h-[35px] border border-neutral-300 rounded-md flex items-center justify-center text-[14px] text-neutral-700 hover:bg-neutral-100"
                    >
                        View Loan Repayment
                    </button>

                    {/* Create Loan */}
                    <button
                        onClick={() => addData(null, false)}
                        className="ml-4 flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
                    >
                        <span className="text-[14px] font-medium">Create Loan</span>
                        <PlusCircle size={18} className="ml-2 text-white" />
                    </button>

                    {/* 3 dots menu */}
                    <div 
                        className="ml-4 w-[35px] h-[35px] border border-neutral-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors"
                        onClick={() => setIsOpenOptions(!isOpenOptions)}
                    >
                        <MoreVertical size={20} className="text-neutral-600" />
                    </div>

                    {/* Options Dropdown */}
                    {isOpenOptions && (
                        <div className="absolute right-4 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                            {employeePageOptions?.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => setIsOpenOptions(false)}
                                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}// ============================================================
    // DEFAULT RENDER FOR OTHER SECTIONS (employee, leave-approval, etc.)
    // ============================================================
       return (
        <div className="w-full">

            {/* ====================== HEADER SECTION ======================= */}
            {isHeader && (
                <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">

                    {/* LEFT — STATUS DROPDOWN */}
                    <div className="relative">
                        <div
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <h2 className="text-xl font-medium text-gray-800 capitalize">
                                {onlyAll ? "All" : filter?.status} {filterFor}
                            </h2>

                            {!onlyAll && (
                                <CaretDown
                                    weight="fill"
                                    className={`text-lg transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                />
                            )}
                        </div>

                        {/* STATUS DROPDOWN MENU */}
                        {(isOpen && !onlyAll) && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                {options?.map((option) => (
                                    <div
                                        key={option.value}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                                        onClick={() => handleOptionSelect(option.value)}
                                    >
                                        {option.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT SECTION — Incomplete Employee + Add Button + 3 Dots */}
                    <div className="flex items-center space-x-5">

                        {/* INCOMPLETE EMPLOYEE BUTTON */}
                        {filterFor === "employee" && (
                            <div
                                className={`flex items-center justify-center text-orange-500 relative rounded-md ${
                                    showIncompleteOnly ? "bg-orange-100" : "bg-white border border-orange-500"
                                }`}
                            >
                                <button
                                    className="text-lg flex items-center justify-between"
                                    onClick={() => setShowIncompleteOnly?.(!showIncompleteOnly)}
                                >
                                    <p className="px-4 py-2 capitalize">Incomplete Employee</p>
                                    <div className="flex items-center justify-center px-2 py-1 border-l-2 border-l-orange-200">
                                        <CaretDown
                                            size={20}
                                            className={`transition-transform ${showIncompleteOnly ? "rotate-180" : ""}`}
                                        />
                                    </div>
                                </button>
                            </div>
                        )}

                        {/* BLUE BUTTON (Leave Request / Add Claims etc.) */}
                        <button
                            onClick={() => addData()}
                            className="flex items-center gap-2 bg-blue-600 text-white rounded-md px-5 py-2 text-sm font-medium"
                        >
                            {filterFor === "leave-approval" ? "Leave Request" : `Add ${filterFor}`}
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-blue-600 font-bold text-sm">
                                +
                            </span>
                        </button>

                        {/* 3 DOT MENU */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsOpenOptions(!isOpenOptions)}
                                className="text-gray-500 rounded-md border-2 hover:bg-gray-50 p-1"
                            >
                                <DotsThree size={32} />
                            </button>

                            {isOpenOptions && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 z-50">
                                    {employeePageOptions?.map((el) => (
                                        <button
                                            key={el}
                                            onClick={() => setIsOpenOptions(false)}
                                            className="w-full px-4 py-3 text-left font-medium hover:bg-blue-td-50 flex items-center space-x-2 transition-colors duration-200 hover:border-l-4 border-blue-600"
                                        >
                                            <span>{el}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ====================== FILTER BAR SECTION ======================= */}
            <div className="w-full my-5 px-10">

                <div className="flex items-center w-full px-5 py-3 border border-gray-200 bg-white rounded-md">

                    <span className="text-sm text-gray-300 mr-4">FILTER BY :</span>

                    {/* LEAVE APPROVAL ADMIN — Your existing logic inserted into UI */}
                    {filterFor === "leave-approval" && (
                        <>

                            {/* PERIOD PICKER */}
                            <div className="relative text-gray-500 w-[22%] flex items-center gap-2">
                                <CalendarBlankIcon size={20} />
                                <PeriodPicker
                                    selectedPeriod={filter.period}
                                    onPeriodSelect={(period) =>
                                        setFilter((prev) => ({ ...prev, period }))
                                    }
                                    formatPeriodDisplay={formatPeriodDisplay}
                                />
                            </div>

                            {/* PIPE */}
                            <div className="flex items-center">
                                <div className="h-8 border-l border-gray-300 mx-4"></div>
                            </div>

                            {/* EMPLOYEE SELECT */}
                            <div className="relative text-gray-500 w-[30%] flex items-center gap-2">
                                <User size={20} />
                                <Select
                                    options={dataEmployeesOptions}
                                    onChange={handleEmployeeSelect}
                                    value={getSelectedValue(dataEmployeesOptions, "employeeUuid")}
                                    placeholder="Select an Employee"
                                    className="w-full"
                                    classNames={{
                                        control: () =>
                                            "!rounded-lg !border !border-gray-300 !shadow-none",
                                        valueContainer: () => "!px-2 !py-1",
                                        indicatorsContainer: () => "!px-1",
                                    }}
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    }}
                                    components={{
                                        Option: (props) => (
                                            <CustomOption
                                                props={props}
                                                onCreateNew={() => setModalDesignation(true)}
                                                createNewLabel="New Designation"
                                            />
                                        ),
                                    }}
                                    menuPortalTarget={document.body}
                                    filterOption={(option, rawInput) => {
                                        if (option.value === "create-new-data") return true;
                                        return option.label
                                            .toLowerCase()
                                            .includes(rawInput.toLowerCase());
                                    }}
                                />
                            </div>

                        </>
                    )}

                </div>

            </div>
        </div>
    );
}

export default FilterPage;