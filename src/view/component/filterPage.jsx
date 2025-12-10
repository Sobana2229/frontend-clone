import { ArrowDown, CalendarBlankIcon, CaretDown, CurrencyDollarIcon, DotsThree, Funnel, GitBranch, MapPin, Notification, User, UserCircle, Users, WarningCircle, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import organizationStoreManagements from "../../store/tdPayroll/setting/organization";
import Select from "react-select";
import CustomOption from "./customOption";
import leaveAndAttendanceStoreManagements from "../../store/tdPayroll/setting/leaveAndAttendance";
import { EmployeeHeadersoptionFilter, employeeLoanEarningOptions, employeePageOptions } from "../../../data/dummy";
import employeeStoreManagements from "../../store/tdPayroll/employee";
import dayjs from "dayjs";
import PeriodPicker from "./employeePortal/PeriodPicker";

// ini ngambil dari page reimbursement employee
const formatPeriodDisplay = (period) => {
    if (!period) return "";
    const date = dayjs(period);
    const year = date.year();
    const month = date.format("MM"); // 01, 02, 03, etc.
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
    const { designationOptions, departementOptions, fetchOrganizationSetting, } = organizationStoreManagements();
    const { fetchWorkLocationOptions, workLocationOptions } = leaveAndAttendanceStoreManagements();
    const { getEmployeeOverview, dataEmployeesOptions } = employeeStoreManagements();
    const [isOpen, setIsOpen] = useState(false);
    const options =
        filterFor === "employee" ? 
            EmployeeHeadersoptionFilter : 
            filterFor === "claims" ? 
                EmployeeHeadersoptionFilter :
                filterFor === "leave-approval" ?
                    EmployeeHeadersoptionFilter :
                    [];

    const [isOpenOptions, setIsOpenOptions] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpenOptions(false);
            }
        };
        if (isOpenOptions) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpenOptions]);

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

    const toggleDropdown = () => {
        setIsOpenOptions(!isOpenOptions);
    };

    const handleMenuClick = (action) => {
        setIsOpenOptions(false);
    };

    const handleWorkLocationSelect = async (selectedOption) => {
        setFilter(prev => ({
            ...prev,
            workLocationUuid: selectedOption.value
        }))
    };

    // FIXED: Handle employee selection - untuk employeeUuid
    const handleEmployeeSelect = async (selectedOption) => {
        setFilter(prev => ({
            ...prev,
            employeeUuid: selectedOption.value
        }))
    };

    // FIXED: Handle salary advance selection - untuk isSalaryAdvance
    const handleIsSalaryAdvanceSelect = async (selectedOption) => {
        setFilter(prev => ({
            ...prev,
            isSalaryAdvance: selectedOption.value
        }))
    };

    const handleDesignationSelect = async (selectedOption) => {
        setFilter(prev => ({
            ...prev,
            designationUuid: selectedOption.value
        }))
    };

    const handleDepartementSelect = async (selectedOption) => {
        setFilter(prev => ({
            ...prev,
            departementUuid: selectedOption.value
        }))
    };

    const handleOptionSelect = (value) => {
        setFilter(prev => ({
            ...prev,
            status: value
        }))
        setIsOpen(false);
    };

    return (
    <div className="w-full">
    {/* Filter Bar - Matching Image 1 Design */}
    <div className="w-full px-4 py-3 bg-gray-50 border-y border-gray-200">
        <div className="flex items-center justify-between">
            {/* Left Side - Filters */}
            <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    FILTER BY :
                </span>
                
                {/* Employee Filter Button */}
                {filterFor === "Loans" && (
                    <>
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsOpenOptions(!isOpenOptions)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                <User size={16} className="text-gray-500" />
                                <span className="text-sm text-gray-700">
                                    {filter.employeeUuid 
                                        ? dataEmployeesOptions?.find(opt => opt.value === filter.employeeUuid)?.label 
                                        : 'Employee'}
                                </span>
                                <CaretDown size={14} className="text-gray-400" />
                            </button>
                            
                            {/* Dropdown Menu */}
                            {isOpenOptions && (
                                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto">
                                    {dataEmployeesOptions?.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                handleEmployeeSelect(option);
                                                setIsOpenOptions(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors"
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Loan Name Filter (if isAll is true) */}
                        {isAll && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                <span className="text-sm text-gray-700">Loan Name</span>
                                <CaretDown size={14} className="text-gray-400" />
                            </button>
                        )}

                        {/* Loan Status Filter */}
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            <span className="text-sm text-gray-700">Loan Status</span>
                            <CaretDown size={14} className="text-gray-400" />
                        </button>

                        {/* Loan Number Filter */}
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            <span className="text-sm text-gray-700">Loan Number</span>
                            <CaretDown size={14} className="text-gray-400" />
                        </button>
                    </>
                )}

                {/* Filters for Claims */}
                {filterFor === "claims" && (
                    <>
                        {/* Period */}
                        <div className="relative text-gray-500 flex items-center">
                            <CalendarBlankIcon size={20} />
                            <input
                                placeholder="Select Period"
                                type="date"
                                value={filter.period}
                                name="dateFrom"
                                onChange={(e) => {
                                    setFilter(prev => ({
                                        ...prev,
                                        period: e.target.value
                                    }))
                                }}
                                onClick={(e) => e.target.showPicker?.()}
                                className="w-full px-2 py-2 [&::-webkit-calendar-picker-indicator]:hidden"
                            />
                        </div>
                        
                        <div className="flex items-center">
                            <div className="h-8 border-l border-gray-300"></div>
                        </div>
                        
                        {/* Employee */}
                        <div className="relative text-gray-500 flex items-center">
                            <User size={20} />
                            <Select
                                options={dataEmployeesOptions}
                                onChange={handleEmployeeSelect}
                                value={getSelectedValue(dataEmployeesOptions, 'employeeUuid')}
                                className='w-full bg-transparent'
                                placeholder="Select an Employee"
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex items-center gap-3">
                {filterFor === "Loans" && (
                    <>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            View Loan Repayment
                        </button>
                        <button 
                            onClick={() => addData()}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <span>Create Loan</span>
                        </button>
                    </>
                )}
                
                {filterFor !== "Loans" && (
                    <button 
                        onClick={() => addData()}
                        className="px-4 py-2 text-white bg-blue-600 rounded-md"
                    >
                        Add {filterFor}
                    </button>
                )}
            </div>
        </div>
    </div>
</div>
    );
}

export default FilterPage;