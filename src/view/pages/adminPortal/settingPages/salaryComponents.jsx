import { useEffect, useRef, useState } from "react";
import SalaryComponentsDisplayTable from "../../../component/setting/salaryComponents/salaryComponentsDisplayTable";
import FormEarningSalaryComponents from "../../../component/setting/salaryComponents/formEarningSalaryComponents";
import FormReimbursementSalaryComponents from "../../../component/setting/salaryComponents/formReimbursementSalaryComponents";
import HeaderReusable from "../../../component/setting/headerReusable";
import { tabsSalaryComponents } from "../../../../../data/dummy";
import { ArrowDown, CaretDownIcon, Users, CalendarBlank } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { checkPermission } from "../../../../../helper/globalHelper";
import authStoreManagements from "../../../../store/tdPayroll/auth";
import employeeStoreManagements from "../../../../store/tdPayroll/employee";
import salaryComponentStoreManagements from "../../../../store/tdPayroll/setting/salaryComponent";

function SalaryComponents({ activeTabIndex = 0 }) {
   
    const [showForm, setShowForm] = useState("");
    const [activeIdx, setActiveIdx] = useState(activeTabIndex);
    const [isOpen, setIsOpen] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
    const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
    const [filter, setFilter] = useState({
        employeeUuid: null,
        period: null
    });
    const [filteredData, setFilteredData] = useState([]);
    
    const dropdownRef = useRef(null);
    const employeeDropdownRef = useRef(null);
    const periodDropdownRef = useRef(null);
    
    const { user } = authStoreManagements();
    const { getEmployeeOverview, dataEmployeesOptions } = employeeStoreManagements();
    const { dataEarning, dataReimbursement } = salaryComponentStoreManagements();

    const filteredTabs = tabsSalaryComponents.filter(tab => {
        if (tab === "Reimbursements") {
            return checkPermission(user, "Reimbursement And FBP Settings", "Full Access");
        }
        return true;
    });

    useEffect(() => {
        setActiveIdx(activeTabIndex);
    }, [activeTabIndex]);

    useEffect(() => {
        if (!dataEmployeesOptions) {
            const access_token = localStorage.getItem("accessToken");
            getEmployeeOverview(access_token, "employeeOptions");
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
            if (employeeDropdownRef.current && !employeeDropdownRef.current.contains(event.target)) {
                setIsEmployeeDropdownOpen(false);
            }
            if (periodDropdownRef.current && !periodDropdownRef.current.contains(event.target)) {
                setIsPeriodDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Filter logic
    useEffect(() => {
        const applyFilters = () => {
            // Get data based on active tab
            let data = activeIdx === 0 ? (dataEarning || []) : (dataReimbursement || []);
            
            // Filter by employee
            if (filter.employeeUuid) {
                data = data.filter(item => item.employeeUuid === filter.employeeUuid);
            }
            
            // Filter by period
            if (filter.period) {
                data = data.filter(item => {
                    if (!item.date) return false;
                    const itemDate = new Date(item.date).toISOString().slice(0, 7);
                    return itemDate === filter.period;
                });
            }
            
            setFilteredData(data);
        };
        
        applyFilters();
    }, [filter.employeeUuid, filter.period, activeIdx, dataEarning, dataReimbursement]);

    const rightActions = !showForm ? (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="py-2 px-4 rounded-md transition-all bg-[#0066FE] text-white shadow-[0_5px_4px_rgba(0,102,221,0.15)] hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
            >
                <span className="font-medium whitespace-nowrap">Add components</span>
                <CaretDownIcon 
                    size={18} 
                    className={`transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="">
                        {filteredTabs?.map((component, idx) => (
                            <button
                                key={idx}
                                onClick={() =>  {
                                    setShowForm(component);
                                    setIsOpen(false);
                                    setIsCreate(true);
                                }}
                                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3 border-l-4 border-transparent hover:border-blue-500"
                            >
                                <div className={`w-2 h-2 rounded-full`} />
                                <span className="font-medium capitalize">{component}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    ) : null;

    const handleEmployeeSelect = (selectedOption) => {
        setFilter(prev => ({
            ...prev,
            employeeUuid: selectedOption?.value || null
        }));
        setIsEmployeeDropdownOpen(false);
    };

    const getSelectedEmployee = () => {
        if (!filter.employeeUuid || !dataEmployeesOptions) return null;
        return dataEmployeesOptions.find(opt => opt.value === filter.employeeUuid);
    };

    const selectedEmployee = getSelectedEmployee();

    return (
       <div className="w-full h-full flex flex-col items-start justify-start overflow-hidden pt-14">
            {!showForm ? (
                <div
                    className="w-full flex-1 flex flex-col items-start justify-start bg-white min-h-0"
                    style={{ height: "calc(100vh - 7.5rem)" }}
                >
                    {/* Filter Section */}
                    <div className="w-full bg-white border border-gray-200 rounded-md mx-2 mt-2">
                        <div className="flex items-center justify-between px-5 py-4">

                            {/* LEFT FILTERS */}
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-400">
                                    FILTER BY :
                                </span>

                                {/* Employee Dropdown */}
                                <div className="relative" ref={employeeDropdownRef}>
                                    <button
                                        onClick={() =>
                                            setIsEmployeeDropdownOpen(
                                                !isEmployeeDropdownOpen
                                            )
                                        }
                                        className="flex items-center gap-2 hover:bg-gray-50"
                                    >
                                        <Users size={20} className="text-gray-400" />
                                        <span className="text-sm font-medium text-gray-400">
                                            {filter.employeeUuid && selectedEmployee
                                                ? selectedEmployee.label
                                                : "Employee"}
                                        </span>
                                        <CaretDownIcon
                                            size={14}
                                            className={`text-gray-400 transition-transform ${
                                                isEmployeeDropdownOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </button>

                                    {isEmployeeDropdownOpen && (
                                        <div className="absolute top-full mt-1 left-0 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                                            {dataEmployeesOptions?.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() =>
                                                        handleEmployeeSelect(opt)
                                                    }
                                                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 text-gray-700"
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="h-6 w-px bg-gray-300"></div>

                                {/* Period Picker */}
                                <div className="relative" ref={periodDropdownRef}>
                                    <button
                                        onClick={() =>
                                            setIsPeriodDropdownOpen(
                                                !isPeriodDropdownOpen
                                            )
                                        }
                                        className="flex items-center gap-2 hover:bg-gray-50"
                                    >
                                        <CalendarBlank
                                            size={20}
                                            className="text-gray-400"
                                        />
                                        <span className="text-sm font-medium text-gray-400">
                                            {filter.period || "Select Period"}
                                        </span>
                                        <CaretDownIcon
                                            size={14}
                                            className={`text-gray-400 transition-transform ${
                                                isPeriodDropdownOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </button>

                                    {isPeriodDropdownOpen && (
                                        <div className="absolute top-full mt-1 left-0 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-3">
                                            <input
                                                type="month"
                                                value={filter.period || ""}
                                                onChange={e =>
                                                    setFilter(prev => ({
                                                        ...prev,
                                                        period: e.target.value
                                                    }))
                                                }
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT ADD COMPONENT BUTTON */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="py-2 px-4 rounded-md bg-[#0066FE] text-white shadow-[0_5px_4px_rgba(0,102,221,0.15)] flex items-center gap-2"
                                >
                                    <span className="font-medium">
                                        Add components
                                    </span>
                                    <CaretDownIcon
                                        size={18}
                                        className={`transition-transform ${
                                            isOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                                        {filteredTabs?.map((component, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setShowForm(component);
                                                    setIsOpen(false);
                                                    setIsCreate(true);
                                                }}
                                                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-800"
                                            >
                                                {component}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="flex-1 overflow-y-auto flex items-start justify-start px-2 py-2 min-h-0 h-full w-full">
                        <div className="w-full flex-1 rounded-md min-h-0">
                            <SalaryComponentsDisplayTable
                                indexTab={activeIdx}
                                setShowForm={setShowForm}
                                data={filteredData}
                            />
                        </div>
                    </div>
                </div>
            ) : showForm === "Earnings" ? (
                <FormEarningSalaryComponents
                    setShowForm={setShowForm}
                    showForm={showForm}
                    isCreate={isCreate}
                    setIsCreate={setIsCreate}
                />
            ) : showForm === "Reimbursements" ? (
                <FormReimbursementSalaryComponents
                    setShowForm={setShowForm}
                    showForm={showForm}
                    isCreate={isCreate}
                    setIsCreate={setIsCreate}
                />
            ) : null}
        </div>
    );
}

export default SalaryComponents;