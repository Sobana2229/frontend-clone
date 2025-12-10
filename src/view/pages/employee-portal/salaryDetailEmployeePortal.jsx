import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PayslipEmployeePortal from "./salaryDetail/payslipEmployeePortal";
import SalaryStructureEmployeePortal from "./salaryDetail/salaryStructureEmployeePortal";
import AnnualEarningEmployeePortal from "./salaryDetail/annualEarningEmployeePortal";
import EpfContributionSumEmployeePortal from "./salaryDetail/EpfContributionSumEmployeePortal";
import InsuranceSumEmployeePortal from "./salaryDetail/insuranceSumEmployeePortal";
import LabourFundSumployeePortal from "./salaryDetail/labourFundSumployeePortal";
import SalaryDetailsSidebar from "../../component/employeePortal/SalaryDetailsSidebar";
import HeaderReusable from "../../component/setting/headerReusable";

function SalaryDetailEmployeePortal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState({});
  const [showPayslipDetail, setShowPayslipDetail] = useState(false);

  // Map route path to tab value
  const getTabFromPath = (pathname) => {
    if (pathname.includes("/salary-structure")) return "Salary Structure";
    if (pathname.includes("/payslips")) return "Payslips";
    if (pathname.includes("/annual-earnings")) return "Annual Earnings";
    if (pathname.includes("/epf-contribution-summary"))
      return "SPK Contribution Summary";
    if (pathname.includes("/employee-state-insurance-summary"))
      return "Employee State Insurance Summary";
    if (pathname.includes("/tn-labour-welfare-fund-summary"))
      return "TN Labour Welfare Fund Summary";
    // Default to salary structure if no specific tab in path
    return "Salary Structure";
  };

  // Map tab value to route path
  const getPathFromTab = (tabValue) => {
    const basePath = "/employee-portal/salary-detail";
    switch (tabValue) {
      case "Salary Structure":
        return `${basePath}/salary-structure`;
      case "Payslips":
        return `${basePath}/payslips`;
      case "Annual Earnings":
        return `${basePath}/annual-earnings`;
      case "SPK Contribution Summary":
        return `${basePath}/epf-contribution-summary`;
      case "Employee State Insurance Summary":
        return `${basePath}/employee-state-insurance-summary`;
      case "TN Labour Welfare Fund Summary":
        return `${basePath}/tn-labour-welfare-fund-summary`;
      default:
        return `${basePath}/salary-structure`;
    }
  };

  const activeTab = getTabFromPath(location.pathname);

  // Redirect to default tab if on base path
  useEffect(() => {
    if (location.pathname === "/employee-portal/salary-detail") {
      navigate("/employee-portal/salary-detail/salary-structure", {
        replace: true,
      });
    }
  }, [location.pathname, navigate]);

  const handleTabChange = (tabValue) => {
    const newPath = getPathFromTab(tabValue);
    navigate(newPath);
    // Close all dropdowns when selecting a tab
    setShowDropdown({});
  };

  const handleToggleDropdown = (tabId) => {
    setShowDropdown((prev) => ({
      ...prev,
      [tabId]: !prev[tabId],
    }));
  };

  return (
    <div className="w-full h-screen bg-[#F9FAFB] flex flex-col overflow-hidden">
      {/* Top Bar with Title */}
      <HeaderReusable title={activeTab} />

      <div className="w-full flex-1 flex overflow-hidden">
        {/* Sidebar - Hide when showing payslip detail */}
        {!showPayslipDetail && (
          <div className="w-64 flex-shrink-0 border-r border-[#E5E7EB] h-full overflow-y-auto">
            <SalaryDetailsSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              showDropdown={showDropdown}
              onToggleDropdown={handleToggleDropdown}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB] h-full">
          <div className={`w-full h-full ${showPayslipDetail ? "" : "p-6"}`}>
            <div
              className={`w-full h-full ${
                showPayslipDetail ? "bg-white" : "bg-white rounded-lg shadow-sm"
              } overflow-hidden`}
            >
              {activeTab === "Salary Structure" && (
                <SalaryStructureEmployeePortal />
              )}
              {activeTab === "Payslips" && (
                <PayslipEmployeePortal
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  onShowPayslipDetail={setShowPayslipDetail}
                />
              )}
              {activeTab === "Annual Earnings" && (
                <AnnualEarningEmployeePortal />
              )}
              {activeTab === "SPK Contribution Summary" && (
                <EpfContributionSumEmployeePortal />
              )}
              {activeTab === "Employee State Insurance Summary" && (
                <InsuranceSumEmployeePortal />
              )}
              {activeTab === "TN Labour Welfare Fund Summary" && (
                <LabourFundSumployeePortal />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalaryDetailEmployeePortal;
