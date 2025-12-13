import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, Fragment, useMemo, useCallback } from "react";
import { 
  AddressBook, ArrowLeft, CaretDown, CaretLeft, CaretRight,
  ChartDonut, CheckCircle, CurrencyDollar, DoorOpen, 
  File, Folder, Gear, HouseIcon, Question,
  Money, MoneyIcon, PresentationChart, Users, X 
} from "@phosphor-icons/react";
import { SideBarApprovals, SideBarBenefits } from "../../../data/subSidebar.js";
import authStoreManagements from "../../store/tdPayroll/auth.js";
import CheckInCheckOut from "./employeePortal/checkInCheckOut.jsx";

// Import SVG icons from assets
import Logo from "../../assets/Logo.svg";
import DashboardIcon from "../../assets/home.svg";
import EmployeeIcon from "../../assets/employee.svg";
import PayRunIcon from "../../assets/Frame.svg";
import ApprovalIcon from "../../assets/approval.svg";
import Arrow from "../../assets/arrow.svg";
import BenefitIcon from "../../assets/benefit.svg";
import DocumentIcon from "../../assets/Frame 2.svg";
import ReportsIcon from "../../assets/Reports.svg";
import SettingsIcon from "../../assets/Settings.svg";
import HelpIcon from "../../assets/help-circle.svg";

function SideBar({ isSidebarOpen, setIsSidebarOpen }) {
  const { logout, user } = authStoreManagements();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const isEmployeePortal = location.pathname.includes("/employee-portal");
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const sidebarAdminPortal = useMemo(() => [
    { title: "Dashboard", to: "/dashboard", icon: DashboardIcon },
    { title: "Employees", to: "/employees", icon: EmployeeIcon },
    { title: "Pay Runs", to: "/pay-runs", icon: PayRunIcon },
    { 
      title: "Approvals", 
      to: "/reimbursement", 
      icon: ApprovalIcon, 
      isDropdown: true, 
      subMenu: SideBarApprovals 
    },
    { 
      title: "Benefits", 
      to: "/loan", 
      icon: BenefitIcon, 
      isDropdown: true,
      subMenu: SideBarBenefits
    },
    { title: "Documents", to: "/documents", icon: DocumentIcon },
    { title: "Reports", to: "/reports", icon: ReportsIcon },
  ], []);

  const sidebarEmployeePortal = useMemo(() => [
    { title: "Home", to: "/employee-portal", icon: <HouseIcon size={20} weight="regular" /> },
    { title: "Salary Details", to: "/employee-portal/salary-detail", icon: <MoneyIcon size={20} weight="regular" /> },
    { title: "Leave & Attendance", to: "/employee-portal/leave-attendance", icon: <AddressBook size={20} weight="regular" /> },
    { title: "Reimbursement", to: "/employee-portal/reimbursement", icon: <MoneyIcon size={20} weight="regular" /> },
    { title: "Documents", to: "/employee-portal/document", icon: <File size={20} weight="regular" /> },
    { title: "Benefits", to: "/employee-portal/loan", icon: <CurrencyDollar size={20} weight="regular" /> },
  ], []);

  const menuItems = useMemo(() => {
    return isEmployeePortal ? sidebarEmployeePortal : sidebarAdminPortal;
  }, [isEmployeePortal, sidebarEmployeePortal, sidebarAdminPortal]);

  useEffect(() => {
    if (location.pathname === "/setting") {
      setIsSidebarOpen(false);
    } else {
      if (isEmployeePortal && typeof window !== 'undefined' && window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    }
  }, [location.pathname, isEmployeePortal, setIsSidebarOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    const handleResize = () => {
      checkMobile();
      if (window.innerWidth >= 768 && !isEmployeePortal) {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isEmployeePortal, setIsSidebarOpen]);

  const handleLogout = async () => {
    const access_token = localStorage.getItem("accessToken");
    const response = await logout(access_token);
    if (response === "success logout") {
      navigate("/login");
    }
  };

  const handleMenuClick = useCallback(() => {
    if (isEmployeePortal && isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isEmployeePortal, isMobile, setIsSidebarOpen]);

  return (
    <Fragment>
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div
        className={`h-screen bg-white flex flex-col pt-6 z-50 transition-all duration-300 ease-in-out overflow-hidden border-r border-gray-200 ${
          isMobile
            ? `${isSidebarOpen ? "fixed inset-y-0 left-0 w-72 translate-x-0" : "fixed inset-y-0 left-0 w-72 -translate-x-full"}`
            : isEmployeePortal
              ? `md:relative md:translate-x-0 ${isSidebarOpen ? "md:w-[278px]" : "md:w-fit"}`
              : `${isSidebarOpen ? "md:w-[278px]" : "md:w-fit"} md:relative`
        }`}
      >
        {isEmployeePortal && isSidebarOpen && (
          <div className="absolute top-4 right-4 md:hidden">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        )}

        {/* Logo Section - Updated to match reference */}
        {!location.pathname.includes("/employee-portal") && !location.pathname.includes("/setting") && (
          <div className={`${isSidebarOpen ? "px-6" : "px-4"} mb-8`}>
            {!isSidebarOpen ? (
              <div className="w-full flex items-center justify-center">
                <img src={Logo} alt="Logo" className="w-11 h-11 rounded-lg object-cover" />
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <img src={Logo} alt="Logo" className="w-11 h-11 rounded-lg object-cover" />
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-medium tracking-[0.4px] text-[#1C1C1C] leading-[18px] uppercase">
                    TEKYDOCT
                  </span>
                  <span className="text-[20px] font-medium text-[#1C1C1C] leading-[30px] -mt-0.5">
                    PAYROLL
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col flex-grow overflow-y-auto overflow-x-hidden">
          {location.pathname.includes("/employee-portal") && (
            <>
              <div className="w-full flex flex-col items-center justify-center px-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                  <span className="text-gray-600 text-3xl font-semibold">
                    {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <Link 
                  to="/employee-portal/profile-detail" 
                  className="text-gray-900 hover:text-blue-600 text-base font-medium text-center"
                >
                  {user?.firstName?.charAt(0).toUpperCase() + user?.firstName?.slice(1)}{" "}
                  {user?.middleName?.charAt(0).toUpperCase() + user?.middleName?.slice(1)}{" "}
                  {user?.lastName?.charAt(0).toUpperCase() + user?.lastName?.slice(1)}
                </Link>
                <p className="text-gray-500 text-sm">{user?.Designation?.name || 'Employee'}</p>
              </div>
              <div className="flex items-center justify-center px-6 mb-6">
                <CheckInCheckOut isEmployeePortal={location.pathname.includes("/employee-portal")} />
              </div>
            </>
          )}

          <div className="px-6">
            {/* MAIN Label */}
            {isSidebarOpen && !isEmployeePortal && (
              <div className="mb-2 px-3">
                <span className="text-[10px] font-medium tracking-[0.4px] text-[rgba(28,28,28,0.5)] uppercase leading-3">
                  MAIN
                </span>
              </div>
            )}

            {/* Menu Items */}
            <div className="flex flex-col gap-2">
              {menuItems.map(({ title, to, icon, isDropdown, subMenu }) => {
                const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
                const isOpen = activeDropdown === title;
                const isIconSvg = typeof icon === 'string';
                
                return (
                  <div key={title} className="w-full">
                    {isDropdown ? (
                      <button
                        onClick={() => {
                          if (!isSidebarOpen) {
                            setIsSidebarOpen(true);
                          } else {
                            setActiveDropdown(isOpen ? null : title);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive || isOpen
                            ? "bg-[rgba(28,28,28,0.05)]"
                            : "hover:bg-[rgba(28,28,28,0.03)]"
                        }`}
                        style={{ height: '40px' }}
                      >
                        <div className="flex items-center gap-3">
                          {isIconSvg ? (
                            <img 
                              src={icon} 
                              alt={title}
                              className="w-5 h-5"
                              style={{
                                filter: isActive || isOpen ? "brightness(0) saturate(100%) contrast(140%)" : "none",
                                opacity: isActive || isOpen ? 1 : 0.6
                              }}
                            />
                          ) : (
                            <span className={isActive || isOpen ? "text-[#1C1C1C]" : "text-[rgba(28,28,28,0.6)]"}>
                              {icon}
                            </span>
                          )}
                          {isSidebarOpen && (
                            <span className={`text-sm font-medium leading-5 ${
                              isActive || isOpen ? "text-[#1C1C1C]" : "text-[rgba(28,28,28,0.6)]"
                            }`}>
                              {title}
                            </span>
                          )}
                        </div>
                        {isSidebarOpen && (
                          <img
                            src={Arrow}
                            alt="Arrow"
                            className="w-6 h-6 transition-transform duration-200"
                            style={{
                              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
                            }}
                          />
                        )}
                      </button>
                    ) : (
                      <Link
                        to={to}
                        onClick={() => { 
                          setActiveDropdown(null);
                          handleMenuClick();
                        }}
                        className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-[rgba(28,28,28,0.05)]"
                            : "hover:bg-[rgba(28,28,28,0.03)]"
                        }`}
                        style={{ height: '40px' }}
                      >
                        <div className="flex items-center gap-3">
                          {isIconSvg ? (
                            <img 
                              src={icon} 
                              alt={title}
                              className="w-5 h-5"
                              style={{
                                filter: isActive ? "brightness(0) saturate(100%) contrast(140%)" : "none",
                                opacity: isActive ? 1 : 0.6
                              }}
                            />
                          ) : (
                            <span className={isActive ? "text-[#1C1C1C]" : "text-[rgba(28,28,28,0.6)]"}>
                              {icon}
                            </span>
                          )}
                          {isSidebarOpen && (
                            <span className={`text-sm font-medium leading-5 ${
                              isActive ? "text-[#1C1C1C]" : "text-[rgba(28,28,28,0.6)]"
                            }`}>
                              {title}
                            </span>
                          )}
                        </div>
                      </Link>
                    )}
                    
                   {/* Dropdown Submenu */}
{isDropdown && isOpen && isSidebarOpen && (
  <div className="ml-4 mt-2 relative pl-4" style={{ minHeight: subMenu.length * 50 + 'px' }}>
    {/* Background line */}
    <div className="absolute left-0 top-0 w-1 rounded" style={{ 
      height: '100%', 
      background: '#F2F2F2' 
    }} />
    
    {/* Active indicator line */}
    {subMenu.find(item => location.pathname === item.to) && (
      <div 
        className="absolute left-0 w-1 rounded transition-all duration-250"
        style={{ 
          height: '40px',
          background: '#1C1C1C',
          top: `${subMenu.findIndex(item => location.pathname === item.to) * 50}px`
        }}
      />
    )}
    
    <div className="flex flex-col" style={{ gap: '8px' }}>
      {subMenu.map((subItem, index) => {
        const isSubActive = location.pathname === subItem.to;
        return (
          <Link
            key={subItem.title}
            to={subItem.to}
            onClick={handleMenuClick}
            className={`relative pl-3 pr-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
              isSubActive
                ? "bg-[rgba(28,28,28,0.05)]"
                : "hover:bg-[rgba(28,28,28,0.03)]"
            }`}
            style={{ 
              height: '40px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {isSubActive && (
              <div 
                className="absolute rounded"
                style={{ 
                  left: '-16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '2px',
                  height: '24px',
                  background: '#1C1C1C'
                }}
              />
            )}
            <span className={`text-sm font-medium leading-5 ${
              isSubActive ? "text-[#1C1C1C]" : "text-[rgba(28,28,28,0.5)]"
            }`}>
              {subItem.title}
            </span>
          </Link>
        );
      })}
    </div>
  </div>
)}
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-6 h-0.5 rounded" style={{ background: 'rgba(28,28,28,0.05)' }} />

            {/* SETTINGS Section */}
            {!isEmployeePortal && (
              <>
                {isSidebarOpen && (
                  <div className="mb-2 px-3">
                    <span className="text-[10px] font-medium tracking-[0.4px] text-[rgba(28,28,28,0.5)] uppercase leading-3">
                      SETTINGS
                    </span>
                  </div>
                )}
                <Link
                  to="/setting"
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    location.pathname === "/setting"
                      ? "bg-[rgba(28,28,28,0.05)]"
                      : "hover:bg-[rgba(28,28,28,0.03)]"
                  }`}
                  style={{ height: '40px' }}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={SettingsIcon} 
                      alt="Settings"
                      className="w-5 h-5"
                      style={{
                        opacity: location.pathname === "/setting" ? 1 : 0.6
                      }}
                    />
                    {isSidebarOpen && (
                      <span className={`text-sm font-medium leading-5 ${
                        location.pathname === "/setting" ? "text-[#1C1C1C]" : "text-[rgba(28,28,28,0.6)]"
                      }`}>
                        Settings
                      </span>
                    )}
                  </div>
                </Link>

                {/* Help */}
                <button 
                  className="w-[10%] flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-[rgba(28,28,28,0.03)] mt-2"
                  style={{ height: '250px'}}
                >
                  <div className="flex items-center gap-3">
                    <img src={HelpIcon} alt="Help" className="w-5 h-5" style={{ opacity: 0.6 }} />
                    {isSidebarOpen && (
                      <span className="text-sm font-medium leading-5 text-[rgba(28,28,28,0.6)]">
                        Help
                      </span>
                    )}
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
        <div className="my-10 h-0.5 rounded" style={{ background: 'rgba(28,28,28,0.05)' }} />
      <div className="mt-auto border-t border-gray-800">
          {!location.pathname.includes("/employee-portal") && user?.isEnablePortalAccess && (
            <button
              onClick={() => navigate("/employee-portal")}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Users size={20} weight="regular" />
              {isSidebarOpen && (
                <span className="text-sm font-medium">Employee Portal</span>
              )}
            </button>
          )}
          
          {location.pathname.includes("/employee-portal") && (
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {isSidebarOpen && (
                <span className="text-sm font-medium">Switch to Admin View</span>
              )}
            </button>
          )}

          {isSidebarOpen && (
            <div className="px-4 py-3 mx-2 mb-2">
              <div className="flex items-center gap-3">
                {/* User Avatar */}
                <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 font-medium text-sm">
                    {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstName || 'User'}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {user?.Designation?.name || 'Employee'}
                  </div>
                </div>
                
                {/* Two Arrows Icon */}
                <button
                  onClick={handleLogout}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Logout"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8L1 10L3 12" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 10H8" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M8 4V2C8 1.44772 8.44772 1 9 1H14C14.5523 1 15 1.44772 15 2V14C15 14.5523 14.5523 15 14 15H9C8.44772 15 8 14.5523 8 14V12" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                
                {/* Vertical Dashed Line */}
                <div className="h-8 w-px border-l border-dashed border-gray-300"></div>
                
                {/* Person Icon (Users SVG) */}
                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <Users size={16} weight="regular" className="text-gray-500" />
                </button>
                
                {/* Small Collapse Arrow */}
                {(!isEmployeePortal || !isMobile) && (
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Collapse"
                  >
                    <CaretLeft size={14} weight="bold" className="text-gray-500" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Show only arrow icon when sidebar is collapsed */}
          {!isSidebarOpen && (!isEmployeePortal || !isMobile) && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors border-t border-gray-200"
            >
              <CaretRight size={20} weight="bold" className="text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default SideBar;