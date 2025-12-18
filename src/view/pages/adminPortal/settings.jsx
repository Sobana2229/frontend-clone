import { useEffect, useState } from "react";
import { SideBarSettings } from "../../../../data/subSidebar";
import OrganisationProfile from "./settingPages/organisationProfile";
import WorkLocations from "./settingPages/workLocations";
import Departments from "./settingPages/departments";
import Designations from "./settingPages/designations";
import StatutoryComponents from "./settingPages/statutoryComponents";
import SalaryComponents from "./settingPages/salaryComponents";
import Taxes from "./settingPages/taxes";
import PaySchedule from "./settingPages/paySchedule";
import LeaveAndAttendance from "./settingPages/leaveAndAttendance";
import Preferences from "./settingPages/preferences";
import Approvals from "./settingPages/approvals";
import Automation from "./settingPages/automation";
import DeveloperSpace from "./settingPages/developerSpace";
import UsersAndRoles from "./settingPages/usersAndRoles";
import ReportingTags from "./settingPages/reportingTags";
import EmailTemplates from "./settingPages/emailTemplates";
import Templates from "./settingPages/templates";
import ZohoIntegrations from "./settingPages/zohoIntegrations";
import DirectDeposit from "./settingPages/directDeposit";
import BackupData from "./settingPages/backupData";
import { useLocation } from "react-router-dom";
import BrandingPages from "./settingPages/branding";
import EmployeePortalComponents from "./settingPages/employeePortal";
import OrganisationSetting from "./settingPages/organisationSetting";
import SetupConfigurationSetting from "./settingPages/setupConfigurationSetting";
import { CaretLeft, CaretDown } from "@phosphor-icons/react";

function SettingPages() {
  const [activeIndex, setActiveIndex] = useState("Organisation");
  const [expandedItems, setExpandedItems] = useState({});
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [salaryComponentsTab, setSalaryComponentsTab] = useState(0); // Track active tab within Salary Components
  const location = useLocation();

  // Define which items have sub-menus
  const itemsWithSubMenus = {
    "Salary Components": ["Earnings", "Deductions", "Benefits", "Reimbursements"]
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && SideBarSettings.some(el => el.title === tab)) {
      setActiveIndex(tab);
    }
  }, [location.search]);

  const toggleExpanded = (title) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const handleItemClick = (title) => {
    if (itemsWithSubMenus[title]) {
      toggleExpanded(title);
      setActiveIndex(title);
    } else {
      setActiveIndex(title);
    }
  };

  const handleSubItemClick = (parentTitle, subItem, subIdx) => {
    if (parentTitle === "Salary Components") {
      setSalaryComponentsTab(subIdx);
      setActiveIndex("Salary Components");
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-start bg-[#1C1C1C]">
      {/* Sidebar */}
      <div 
        className={`h-full overflow-y-auto flex flex-col border-r border-[#1C1C1C] bg-[#1C1C1C] transition-all duration-300 ${
          isSidebarCollapsed ? 'w-[60px]' : 'w-[278px]'
        }`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#989898 transparent'
        }}
      >
        {/* Logo Section */}
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-2' : 'px-[35px]'} pt-[25px] pb-[50px] flex-shrink-0`}>
          {isSidebarCollapsed ? (
            <div className="w-[45px] h-[45px] rounded-lg flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-full h-full rounded-lg object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center gap-[10px]">
              <img 
                src="/logo.png" 
                alt="TEKYDOCT Logo" 
                className="w-[45px] h-[45px] rounded-lg object-cover"
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-medium tracking-[0.4px] text-[#EAEAEA] leading-[18px] uppercase">
                  TEKYDOCT
                </span>
                <span className="text-[20px] font-medium text-[#EAEAEA] leading-[30px] -mt-[2px]">
                  PAYROLL
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1 px-[35px] pb-5 space-y-2 overflow-y-auto" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#989898 transparent'
        }}>
          {/* MAIN Label */}
          {!isSidebarCollapsed && (
            <div className="px-3 mb-2">
              <span className="text-[10px] font-medium tracking-[0.4px] text-[#989898] uppercase leading-3">
                MAIN
              </span>
            </div>
          )}

          {SideBarSettings?.map((el, idx) => {
            const isActive = activeIndex === el?.title;
            const hasSubMenu = itemsWithSubMenus[el?.title];
            const isExpanded = expandedItems[el?.title];
            
            return (
              <div key={idx} className="w-full">
                <button
                  onClick={() => handleItemClick(el?.title)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isSidebarCollapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? "bg-white"
                      : "hover:bg-white/10"
                  }`}
                  style={{ height: '40px' }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {!isSidebarCollapsed && (
                      <span className={`text-sm font-medium leading-5 ${
                        isActive ? "text-[#1C1C1C]" : "text-[#ADADAD]"
                      }`}>
                        {el?.title}
                      </span>
                    )}
                  </div>
                  {!isSidebarCollapsed && hasSubMenu && (
                    <CaretDown
                      size={20}
                      weight="regular"
                      className={`transition-transform duration-200 flex-shrink-0 ${
                        isActive ? "text-[#1C1C1C]" : "text-[#ADADAD]"
                      }`}
                      style={{
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)"
                      }}
                    />
                  )}
                </button>

                {/* Sub-menu Items */}
                {!isSidebarCollapsed && hasSubMenu && isExpanded && (
                  <div className="ml-4 mt-2 relative pl-4">
                    {/* Vertical line container */}
                    <div className="absolute left-0 top-0 w-1 h-full">
                      {/* Background line */}
                      <div 
                        className="absolute left-0 top-0 w-full rounded" 
                        style={{ 
                          height: '100%',
                          background: '#EAEAEA'
                        }} 
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {itemsWithSubMenus[el?.title].map((subItem, subIdx) => {
                        const isSubActive = activeIndex === el?.title && salaryComponentsTab === subIdx;
                        return (
                          <button
                            key={subIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubItemClick(el?.title, subItem, subIdx);
                            }}
                            className={`relative pl-3 pr-3 py-2.5 text-sm rounded-lg transition-all duration-200 text-left ${
                              isSubActive ? "bg-white/10" : "hover:bg-white/10"
                            }`}
                            style={{ 
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <span className={`text-sm font-medium leading-5 ${
                              isSubActive ? "text-[#EAEAEA]" : "text-[#ADADAD]"
                            }`}>
                              {subItem}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Collapse Button */}
        <div className="flex-shrink-0 border-t border-white/10">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full h-12 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <CaretLeft 
              size={20} 
              weight="bold" 
              className="text-gray-400"
              style={{
                transform: isSidebarCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }}
            />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-y-auto bg-white">
        {activeIndex === "Organisation" && <OrganisationSetting />}
        {activeIndex === "Setup & Configuration" && <SetupConfigurationSetting />}
        {activeIndex === "Salary Components" && <SalaryComponents activeTabIndex={salaryComponentsTab} />}
        {activeIndex === "Employee Portal" && <EmployeePortalComponents />}
        {activeIndex === "Leave And Attendance" && <LeaveAndAttendance />}
        {activeIndex === "Preferences" && <Preferences />}
        {activeIndex === "Approvals" && <Approvals />}
        {activeIndex === "Automation" && <Automation />}
        {activeIndex === "Developer Space" && <DeveloperSpace />}
        {activeIndex === "Users And Roles" && <UsersAndRoles />}
        {activeIndex === "Reporting Tags" && <ReportingTags />}
        {activeIndex === "Email Templates" && <EmailTemplates />}
        {activeIndex === "Templates" && <Templates />}
        {activeIndex === "Zoho Integrations" && <ZohoIntegrations />}
        {activeIndex === "Direct Deposit" && <DirectDeposit />}
        {activeIndex === "Backup Data" && <BackupData />}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        /* Thin scrollbar styling */
        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #989898;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #7a7a7a;
        }
      `}</style>
    </div>
  );
}

export default SettingPages;