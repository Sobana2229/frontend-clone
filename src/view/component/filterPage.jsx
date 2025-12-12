import { ArrowDown, CalendarBlankIcon,CaretDown,Plus,Info ,CurrencyDollarIcon, DotsThree, Funnel, GitBranch, MapPin, Notification, User, UserCircle, Users, WarningCircle, X } from "@phosphor-icons/react";
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
    const handleViewLoanRepayment = () => {
  console.log("View Loan Repayment clicked");
};

const handleCreateLoan = () => {
  console.log("Create Loan clicked");
};

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
  <div className="w-full px-4 py-3 bg-white border-y border-gray-200">
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
        onClick={handleViewLoanRepayment}
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

      {/* 3 dots */}
      <MoreVertical size={26} className="ml-4 text-neutral-600 cursor-pointer" />
 
 

            {/* Right Side - Action Buttons */}
           

        </div>
    </div>
</div>
    );
}

export default FilterPage;