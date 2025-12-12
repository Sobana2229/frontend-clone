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
        <div className="w-[97%] bg-white px-8 py-4 border-b border-gray-200">
            <div className="flex items-center gap-4 w-full">

                {/* FILTER BY */}
                <span className="text-sm text-gray-500">FILTER BY :</span>

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
  onClick={() => addData(null,false)}
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

                    <span className="text-sm text-gray-500 mr-4">FILTER BY :</span>

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