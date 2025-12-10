import { Briefcase, CalendarBlank, CaretDown, CaretLeft, CurrencyCircleDollar, DotsThree, ListChecks, PresentationChart, User, Wallet, X, Warning } from "@phosphor-icons/react";
import { tabOverviewEmployees } from "../../../../../data/dummy";
import { useEffect, useState } from "react";
import InvestmentEmployeeDetail from "./investmentEmployeeDetail";
import LoanEmployeeDetail from "./loanEmployeeDetail";
import SalaryEmployeeDetail from "./salaryEmployeeDetail";
import PayAndSlipEmployeeDetail from "./payAndSlipEmployeeDetail";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingIcon from "../../../component/loadingIcon";
import ShiftEmployeeDetail from "./shiftEmployeeDetail";
import employeeStoreManagements from "../../../../store/tdPayroll/employee";
import payrunStoreManagements from "../../../../store/tdPayroll/payrun";
import AttendanceEmployeeDetail from "./attendanceEmployeeDetail";
import PersonDetailPages from "./personDetailPages";
import OverviewEmployeePages from "./overviewEmployeePages";
import LeaveEmployeeDetail from "./LeaveEmployeeDetail";
import ShiftAttendanceEmployeeDetail from "./shiftAttendanceEmployeeDetail";
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASEURL;

function DetailEmployeePages() {
  const { id } = useParams(); // Route parameter is 'id', not 'uuid'
  const uuid = id; // Use id as uuid for consistency
  const { activeTab: activeTabPayrun, changeActiveTab, loading } = payrunStoreManagements();
  const { fetchEmployeePersonalDetail, dataEmployeePaymentInformation } = employeeStoreManagements();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState(tabOverviewEmployees[0]);
  const [employeeData, setEmployeeData] = useState(null);
  

  // Fetch employee data to get stepComplated
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!uuid) {
        return;
      }
      
      try {
        const access_token = localStorage.getItem("accessToken");
        const url = `${baseUrl}/td-payroll/employee/lastest-employee/${uuid}`;
        
        const { data: response } = await axios.get(url, {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        
        // Response structure: { code: 200, message: 'Success', data: Employee }
        const employee = response?.data || response || null;
        
        if (employee) {
          const stepComplated = parseInt(employee.stepComplated || 0, 10);
          setEmployeeData({ ...employee, stepComplated });
        }
      } catch (error) {
        // Silently fail or hook into a centralized logger if needed
      }
    };
    
    fetchEmployeeData();
  }, [uuid]);

  // Fetch payment information to check bank details
  useEffect(() => {
    if (uuid) {
      const access_token = localStorage.getItem("accessToken");
      fetchEmployeePersonalDetail(access_token, uuid, "payment-information");
    }
  }, [uuid]);

  useEffect(() => {
    if(activeTabPayrun){
      setActiveTab(tabOverviewEmployees[activeTabPayrun]);
      changeActiveTab(false);
    }
  }, [activeTabPayrun]);

  const tabOverviewEmployeesIcons = {
    "Overview": PresentationChart,
    "Personal Info": User,
    "Salary Details": CurrencyCircleDollar,
    "Payslips": Briefcase,
    "Leave": CalendarBlank,
    "Shift & Attendance": ListChecks,
    "Loans": Wallet
  };

  // Use completion status from backend (more specific)
  const completionStatus = employeeData?.completionStatus || {
    basicDetailsCompleted: false,
    salaryDetailCompleted: false,
    personalDetailCompleted: false,
    bankDetailCompleted: false
  };

  const isProfileComplete = 
    completionStatus.basicDetailsCompleted &&
    completionStatus.salaryDetailCompleted &&
    completionStatus.personalDetailCompleted &&
    completionStatus.bankDetailCompleted;

  const isTabIncomplete = (tabName) => {
    if (isProfileComplete) return false;
    
    // Map tab names to completion status fields
    if (tabName === "Salary Details" && !completionStatus.salaryDetailCompleted) return true;
    // Personal Info is incomplete if personal details OR bank details are incomplete
    if (tabName === "Personal Info" && (!completionStatus.personalDetailCompleted || !completionStatus.bankDetailCompleted)) return true;
    
    return false;
  };

  // Check which bank detail fields are missing
  const getMissingBankFields = () => {
    if (completionStatus.bankDetailCompleted) return [];
    
    const missingFields = [];
    const paymentInfo = dataEmployeePaymentInformation;
    
    // If no payment information exists at all
    if (!paymentInfo) {
      return ["Payment Method", "Bank Name", "Account Number", "Account Holder Name"];
    }
    
    // Check payment method
    if (!paymentInfo.paymentMethod) {
      missingFields.push("Payment Method");
    }
    
    // If payment method is Bank Transfer, check bank details
    if (paymentInfo.paymentMethod === "Bank Transfer" || !paymentInfo.paymentMethod) {
      if (!paymentInfo.bankName || paymentInfo.bankName.trim() === "") {
        missingFields.push("Bank Name");
      }
      if (!paymentInfo.accountNumber || paymentInfo.accountNumber.trim() === "") {
        missingFields.push("Account Number");
      }
      if (!paymentInfo.accountHolderName || paymentInfo.accountHolderName.trim() === "") {
        missingFields.push("Account Holder Name");
      }
    }
    
    return missingFields;
  };

  const getIncompleteSteps = () => {
    if (isProfileComplete) return [];
    
    const incompleteSteps = [];
    if (!completionStatus.salaryDetailCompleted) incompleteSteps.push("Salary Details");
    if (!completionStatus.personalDetailCompleted) incompleteSteps.push("Personal Info");
    
    // Add Bank Details with specific missing fields
    if (!completionStatus.bankDetailCompleted) {
      const missingBankFields = getMissingBankFields();
      if (missingBankFields.length > 0) {
        incompleteSteps.push(`Bank Details (${missingBankFields.join(", ")})`);
      } else {
        incompleteSteps.push("Bank Details");
      }
    }
    
    return incompleteSteps;
  };

  const incompleteSteps = getIncompleteSteps();
  
  return (
    <div className={`w-full h-screen flex flex-col items-start justify-start pt-12 bg-[#EAEAEA]`}>
      {/* Header */}
      <div className="w-full px-6 py-4 flex items-center justify-between border-b bg-white">
        <h1 className="text-2xl font-medium text-[#0F172A]">Personal Information</h1>
        <div className="flex items-center space-x-3">
          {/* Add Button with Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>Add</span>
              <CaretDown size={16} weight="bold" />
            </button>
            
            {/* Dropdown Menu - Optional */}
            {showDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Add Option 1
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Add Option 2
                </button>
              </div>
            )}
          </div>

          {/* Dots Menu Button */}
          <button 
            className="p-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border"
          >
            <DotsThree size={20} weight="bold" />
          </button>

          {/* Close Button */}
          <button 
            onClick={() => navigate(`/employees`)}
            className="p-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border"
          >
            <X size={20} weight="bold" />
          </button>
        </div>
      </div>

      {loading ? 
      (
        <div className="w-full h-full flex items-center justify-center">
          <div className="h-20 w-20">
            <LoadingIcon color="#3F8DFB" />
          </div>
        </div>
      ) : (
        <div className="flex w-full h-full overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-80 bg-white border-r flex flex-col py-6">
            <h1 className="text-3xl font-medium text-[#0F172A] ps-6 pb-6">Employees</h1>
            
            {/* Incomplete Profile Warning */}
            {!isProfileComplete && incompleteSteps.length > 0 && (
              <div className="mx-4 mb-4 p-4 bg-orange-50 border-2 border-orange-300 rounded-lg shadow-sm">
                <div className="flex items-start space-x-3">
                  <Warning size={24} className="text-orange-500 flex-shrink-0 mt-0.5" weight="fill" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-orange-900 mb-1">Profile Incomplete</p>
                    <p className="text-xs text-orange-700 mb-2">
                      Please complete the following sections:
                    </p>
                    <ul className="list-disc list-inside text-xs text-orange-700 space-y-1">
                      {incompleteSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <nav className="flex flex-col space-y-1 px-4">
              {tabOverviewEmployees.map((tab, index) => {
                const IconComponent = tabOverviewEmployeesIcons[tab];
                const isIncomplete = isTabIncomplete(tab);
                
                return (
                  <button
                    key={index}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors space-x-2 ${
                      activeTab === tab
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {IconComponent && <IconComponent size={20} />}
                      <p>{tab}</p>
                    </div>
                    {isIncomplete && (
                      <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-orange-500 text-white rounded-full" title="Incomplete">
                        !
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "Overview" && <OverviewEmployeePages />}
            {activeTab === "Personal Info" && <PersonDetailPages />}
            {activeTab === "Salary Details" && <SalaryEmployeeDetail />}
            {activeTab === "Investments" && <InvestmentEmployeeDetail />}
            {activeTab === "Payslips" && <PayAndSlipEmployeeDetail />}
            {activeTab === "Leave" && <LeaveEmployeeDetail />}
            {activeTab === "Loans" && <LoanEmployeeDetail />}
            {activeTab === "Shift & Attendance" && <ShiftAttendanceEmployeeDetail />}
          </div>
        </div>
      )}
    </div>
  );
}


export default DetailEmployeePages;
