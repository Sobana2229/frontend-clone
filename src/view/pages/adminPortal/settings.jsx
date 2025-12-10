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

function SettingPages() {
  const [activeIndex, setActiveIndex] = useState("Organisation");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && SideBarSettings.some(el => el.title === tab)) {
      setActiveIndex(tab);
    }
  }, [location.search]);


  return (
    <div className="w-full h-full flex items-center justify-start">
      <div className="w-[15%] h-full overflow-y-auto flex items-center justify-center border-r">
        <div className="w-full h-full flex flex-col items-start justify-start py-5 space-y-2 bg-blue-td-50">
          <div className="w-full flex items-center justify-center py-4 border-b-2">
            <div className="flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="TEKYDOCT Logo" 
                className="w-[200px]"
              />
            </div>
          </div>
          <div className="w-full flex flex-col pb-10 space-y-1 px-3 ">
            {SideBarSettings?.map((el, idx) => {
              const isActive = activeIndex === el?.title;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(el?.title)}
                  className={`w-full py-2 px-4 text-left transition-all duration-300 ${
                    isActive
                      ? "border-l-2 border-blue-td-500 bg-blue-td-100 text-blue-td-500"
                      : "text-black hover:bg-blue-td-100 hover:text-blue-td-500"
                  }`}
                >
                  {el?.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex-1 h-full overflow-y-hidden">
        {activeIndex === "Organisation" && <OrganisationSetting />}
        {activeIndex === "Setup & Configuration" && <SetupConfigurationSetting />}
        {activeIndex === "Salary Components" && <SalaryComponents />}
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
    </div>
  );
}

export default SettingPages;