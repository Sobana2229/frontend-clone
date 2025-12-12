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
    
    const dropdownRef = useRef(null);
    const employeeDropdownRef = useRef(null);
    const periodDropdownRef = useRef(null);
    const statusDropdownRef = useRef(null);

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

    // ============================================================
    // RENDER FOR CLAIMS SECTION - SIMPLE COMPACT DESIGN
    // ============================================================
    if (filterFor === "claims") {
    const selectedEmployee = getSelectedValue(dataEmployeesOptions, "employeeUuid");

    return (
        <div className="w-full bg-white px-5 py-4 border-b border-gray-200">
            <div className="flex items-center gap-4 w-full">

                {/* FILTER BY */}
                <span className="text-sm text-gray-500">FILTER BY :</span>

                {/* Employee Dropdown */}
                <div className="relative" ref={employeeDropdownRef}>
                    <button
                        onClick={() =>
                            setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen)
                        }
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 min-w-[180px]"
                    >
                        <Users size={18} className="text-gray-500" />
                        <span className="text-sm text-gray-700 flex-1 text-left">
                            {filter.employeeUuid
                                ? selectedEmployee?.label
                                : "Employee"}
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
                        onClick={() =>
                            setIsPeriodDropdownOpen(!isPeriodDropdownOpen)
                        }
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 min-w-[180px]"
                    >
                        <CalendarBlankIcon size={18} className="text-gray-500" />
                        <span className="text-sm text-gray-700 flex-1 text-left">
                            {filter.period
                                ? formatPeriodDisplay(filter.period)
                                : "Select Period"}
                        </span>
                        <CaretDown size={14} className="text-gray-500" />
                    </button>

                    {isPeriodDropdownOpen && (
                        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2">
                            <input
                                type="month"
                                value={filter.period || ""}
                                onChange={(e) =>
                                    setFilter((prev) => ({
                                        ...prev,
                                        period: e.target.value,
                                    }))
                                }
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                        </div>
                    )}
                </div>

                {/* Status Dropdown */}
                <div className="relative" ref={statusDropdownRef}>
                    <button
                        onClick={() =>
                            setIsStatusDropdownOpen(!isStatusDropdownOpen)
                        }
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 min-w-[160px]"
                    >
                        <Activity size={18} className="text-gray-500" />
                        <span className="text-sm text-gray-700 flex-1 capitalize text-left">
                            {filter.status ? filter.status : "All"}
                        </span>
                        <CaretDown size={14} className="text-gray-500" />
                    </button>

                    {isStatusDropdownOpen && (
                        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50">
                            {["all", "pending", "approved", "rejected"].map(
                                (status) => (
                                    <button
                                        key={status}
                                        onClick={() =>
                                            handleOptionSelect(status)
                                        }
                                        className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 capitalize"
                                    >
                                        {status}
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* ---- RIGHT SIDE BUTTONS ---- */}
                <div className="flex items-center gap-3 ml-auto">

                    {/* Add Claim Button */}
                     
                        <button
                            onClick={() => addData()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Plus size={16} weight="bold" />
                            Add Claim
                        </button>
                    

                    {/* THREE DOTS MENU */}
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

    
    // ============================================================
    // RENDER FOR LOAN SECTION - NEW FIGMA DESIGN
    // ============================================================
    if (filterFor === "Loans") {
        return (
            <div className="w-full">
                <div className="w-[97%] mx-auto px-4 py-3 bg-white border-y border-gray-200">
                    <div className="w-full h-[60px] border border-neutral-200 rounded-md bg-white flex items-center px-5 relative">
                        <span className="text-[14px] font-medium text-neutral-600">
                            FILTER BY :
                        </span>

                        {/* Employee */}
                        <div className="flex items-center gap-2 ml-8 cursor-pointer">
                            <Users2 size={18} className="text-neutral-500" />
                            <span className="text-[14px] font-medium text-neutral-500">Employee</span>
                            <CaretDown size={14} className="text-neutral-500" />
                        </div>

                        <div className="mx-6 h-6 border-r border-dashed border-neutral-300" />

                        {/* Loan Name */}
                        <div className="flex items-center gap-2 cursor-pointer">
                            <FileText size={18} className="text-neutral-400" />
                            <span className="text-[14px] font-medium text-neutral-500">Loan Name</span>
                            <CaretDown size={14} className="text-neutral-500" />
                        </div>

                        <div className="mx-6 h-6 border-r border-dashed border-neutral-300" />

                        {/* Loan Status */}
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Activity size={18} className="text-neutral-400" />
                            <span className="text-[14px] font-medium text-neutral-500">Loan Status</span>
                            <CaretDown size={14} className="text-neutral-500" />
                        </div>

                        <div className="mx-6 h-6 border-r border-dashed border-neutral-300" />

                        {/* Loan Number */}
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Hash size={18} className="text-neutral-400" />
                            <span className="text-[14px] font-medium text-neutral-500">Loan Number</span>
                            <CaretDown size={14} className="text-neutral-500" />
                        </div>

                        {/* View Loan Repayment */}
                        <button
                            className="ml-auto w-[218px] h-[35px] border border-neutral-300 rounded-md flex items-center justify-center text-[14px] text-neutral-700 hover:bg-neutral-100"
                        >
                            View Loan Repayment
                        </button>

                        {/* Create Loan */}
                        <button
                            onClick={() => addData()}
                            className="ml-4 flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
                        >
                            <span className="text-[14px] font-medium">Create Loan</span>
                            <PlusCircle size={18} className="ml-2 text-white" />
                        </button>

                        {/* 3 dots menu */}
                        <div className="ml-4 w-[35px] h-[35px] border border-neutral-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors">
                            <MoreVertical size={20} className="text-neutral-600" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================
    // DEFAULT RENDER FOR OTHER SECTIONS (employee, leave-approval, etc.)
    // ============================================================
    return (
        <div className="w-full">
            {isHeader && (
                <div className="flex items-center justify-between p-4 bg-white">
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
                                    className={`text-lg transition-transform duration-200 ${
                                        isOpen ? "rotate-180" : ""
                                    }`} 
                                />
                            )}
                        </div>
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
                    
                    <div className="flex items-center space-x-5">
                        <div className="flex items-center justify-center space-x-3">
                            {filterFor == "employee" && (
                                <div className={`flex items-center justify-center text-orange-500 relative rounded-md ${
                                showIncompleteOnly ? 'bg-orange-100' : 'bg-white border border-orange-500'
                                }`}>
                                <button 
                                    className="text-lg flex items-center justify-between"
                                    onClick={() => setShowIncompleteOnly?.(!showIncompleteOnly)}
                                >
                                    <p className="px-4 py-2 capitalize">Incomplete Employee</p>
                                    <div className="flex items-center justify-center px-2 py-1 border-l-2 border-l-orange-200">
                                    <CaretDown 
                                        size={20} 
                                        className={`transition-transform ${showIncompleteOnly ? 'rotate-180' : ''}`}
                                    />
                                    </div>
                                </button>
                                </div>
                            )}

                            <div className="flex items-center text-lg justify-center bg-blue-600 text-white relative rounded-md">
                                <button onClick={() => addData()} className="px-4 py-2">
                                    <p className="capitalize">
                                        Add {filterFor}
                                    </p>
                                </button>
                            </div>
                            
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setIsOpenOptions(!isOpenOptions)}
                                    className="text-gray-500 rounded-md border-2 hover:bg-gray-50"
                                >
                                    <DotsThree className="text-[40px]" />
                                </button>

                                {isOpenOptions && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 z-50">
                                        {employeePageOptions?.map(el => (
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
                </div>
            )}

            {/* Existing filter section for employee and leave-approval remains unchanged */}
            <div className="w-full my-5 px-10">
                <div className="flex items-center w-full px-5 py-2 border-t border-gray-200 bg-white rounded-md">
                    <span className="text-sm text-gray-500 mr-4">FILTER BY :</span>
                    {/* Rest of your existing filter code for employee, leave-approval etc. */}
                </div>
            </div>
        </div>
    );
}

export default FilterPage;