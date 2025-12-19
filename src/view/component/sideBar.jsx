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
import DashboardIcon from "../../assets/Home.svg";
import EmployeeIcon from "../../assets/employee.svg";
import PayRunIcon from "../../assets/frame.svg";
import ApprovalIcon from "../../assets/approval.svg";
import Arrow from "../../assets/arrow.svg";
import BenefitIcon from "../../assets/benefit.svg";
import DocumentIcon from "../../assets/Frame 2.svg";
import ReportsIcon from "../../assets/Reports.svg";
import SettingsIcon from "../../assets/Settings.svg";
import HelpIcon from "../../assets/Help-circle.svg";

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
    { title: "Reimbursements", to: "/employee-portal/reimbursement", icon: <CurrencyDollar size={20} weight="regular" /> },
    { 
      title: "Benefits", 
      to: "/employee-portal/loan", 
      icon: <CurrencyDollar size={20} weight="regular" />,
      isDropdown: true,
      subMenu: [
        { title: "Loans", to: "/employee-portal/loan" },
        { title: "Advance Salary", to: "/employee-portal/advance-salary" }
      ]
    },
    { title: "Documents", to: "/employee-portal/document", icon: <File size={20} weight="regular" /> },
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
        className={`h-screen flex flex-col z-50 transition-all duration-300 ease-in-out overflow-hidden border-r ${
          isEmployeePortal ? 'bg-[#1C1C1C] border-[#1C1C1C]' : 'bg-white border-gray-200'
        } ${
          isMobile
            ? `${isSidebarOpen ? "fixed inset-y-0 left-0 w-72 translate-x-0" : "fixed inset-y-0 left-0 w-72 -translate-x-full"}`
            : isEmployeePortal
              ? `md:relative md:translate-x-0 ${isSidebarOpen ? "md:w-[278px]" : "md:w-fit"}`
              : `${isSidebarOpen ? "md:w-[278px]" : "md:w-fit"} md:relative`
        }`}
      >
        {isEmployeePortal && isSidebarOpen && (
          <div className="absolute top-4 right-4 md:hidden z-10">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-gray-700 text-gray-400"
            >
              <X size={24} />
            </button>
          </div>
        )}

        {/* Logo Section */}
        {!location.pathname.includes("/employee-portal") && !location.pathname.includes("/setting") && (
          <div className={`${isSidebarOpen ? "px-6" : "px-4"} pt-6 mb-8`}>
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

        {/* Employee Portal Header Section */}
        {location.pathname.includes("/employee-portal") && (
          <div className={`${isSidebarOpen ? "px-6" : "px-6"} pt-6 mb-6`}>
            {!isSidebarOpen ? (
              <div className="w-full flex items-center justify-center">
                
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <img src={Logo} alt="Logo" className="w-11 h-11 rounded-lg object-cover" />
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-medium tracking-[0.4px] text-[#EAEAEA] leading-[18px] uppercase">
                    TEKYDOCT
                  </span>
                  <span className="text-[20px] font-medium text-[#EAEAEA] leading-[30px] -mt-0.5">
                    PAYROLL
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className={`flex flex-col flex-grow overflow-y-auto overflow-x-hidden scrollbar-hide`}>
          {location.pathname.includes("/employee-portal") && isSidebarOpen && (
            <>
              {/* User Profile Section */}
              <div className="w-full flex flex-col items-center justify-center px-6 mb-6">
                <div className="w-[110px] h-[100px] rounded-[25px] border border-[#989898] flex items-center justify-center mb-3">
                  <span className="text-[#EAEAEA] text-[72px] font-medium leading-[90px] tracking-[-0.02em]">
                    {user?.firstName?.charAt(0).toUpperCase() || 'V'}
                  </span>
                </div>
                <Link 
                  to="/employee-portal/profile-detail" 
                  className="text-[#EAEAEA] hover:text-blue-400 text-[20px] font-medium leading-[30px] text-center"
                >
                  {user?.firstName || 'Vabik'} - {user?.employeeId || '5638'}
                </Link>
                <p className="text-[#C1C1C1] text-[16px] font-normal leading-6">{user?.Designation?.name || 'Project Manager'}</p>
              </div>

              {/* Check In/Out Section */}
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

            {/* MAIN Label for Employee Portal */}
            {isSidebarOpen && isEmployeePortal && (
              <div className="mb-2 px-3">
                <span className="text-[10px] font-medium tracking-[0.4px] text-[#989898] uppercase leading-3">
                  MAIN
                </span>
              </div>
            )}

            {/* Menu Items */}
            <div className="flex flex-col gap-2">
              {menuItems.map(({ title, to, icon, isDropdown, subMenu }) => {
const isActive = isDropdown 
  ? (location.pathname === to || location.pathname.startsWith(to + '/'))
  : location.pathname === to;
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
                          isEmployeePortal
                            ? (isActive || isOpen ? "bg-white" : "hover:bg-white/10")
                            : (isActive || isOpen ? "bg-[rgba(28,28,28,0.05)]" : "hover:bg-[rgba(28,28,28,0.03)]")
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
                            <span className={
                              isEmployeePortal 
                                ? (isActive || isOpen ? "text-[#1C1C1C]" : "text-[#ADADAD]")
                                : (isActive || isOpen ? "text-[#1C1C1C]" : "text-[rgba(28,28,28,0.6)]")
                            }>
                              {icon}
                            </span>
                          )}
                          {isSidebarOpen && (
                            <span className={`text-sm font-medium leading-5 ${
                              isEmployeePortal
                                ? (isActive || isOpen ? "text-[#1C1C1C]" : "text-[#ADADAD]")
                                : (isActive || isOpen ? "text-[#1C1C1C]" : "text-[rgba(28,28,28,0.6)]")
                            }`}>
                              {title}
                            </span>
                          )}
                        </div>
                        {isSidebarOpen && (
                          <CaretDown
                            size={24}
                            weight="regular"
                            className={`transition-transform duration-200 ${
                              isEmployeePortal
                                ? (isActive || isOpen ? "text-[#1C1C1C]" : "text-[#ADADAD]")
                                : (isActive || isOpen ? "text-[#1C1C1C]" : "text-[rgba(28,28,28,0.6)]")
                            }`}
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
                          isEmployeePortal
                            ? (isActive ? "bg-white" : "hover:bg-white/10")
                            : (isActive ? "bg-[rgba(28,28,28,0.05)]" : "hover:bg-[rgba(28,28,28,0.03)]")
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
                            <span className={
                              isEmployeePortal
                                ? (isActive ? "text-[#1C1C1C]" : "text-[#ADADAD]")
                                : (isActive ? "text-[#1C1C1C]" : "text-[rgba(28,28,28,0.6)]")
                            }>
                              {icon}
                            </span>
                          )}
                          {isSidebarOpen && (
                            <span className={`text-sm font-medium leading-5 ${
                              isEmployeePortal
                                ? (isActive ? "text-[#1C1C1C]" : "text-[#ADADAD]")
                                : (isActive ? "text-[#1C1C1C]" : "text-[rgba(28,28,28,0.6)]")
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
                          background: isEmployeePortal ? 'rgba(255,255,255,0.1)' : '#F2F2F2'
                        }} />
                        
                        {/* Active indicator line */}
                        {subMenu.find(item => location.pathname === item.to) && (
                          <div 
                            className="absolute left-0 w-1 rounded transition-all duration-250"
                            style={{ 
                              height: '40px',
                              background: isEmployeePortal ? '#FFFFFF' : '#1C1C1C',
                              top: `${subMenu.findIndex(item => location.pathname === item.to) * 50}px`
                            }}
                          />
                        )}
                        
                        <div className="flex flex-col" style={{ gap: '8px' }}>
                          {subMenu.map((subItem) => {
                            const isSubActive = location.pathname === subItem.to;
                            return (
                              <Link
                                key={subItem.title}
                                to={subItem.to}
                                onClick={handleMenuClick}
                                className={`relative pl-3 pr-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                                  isEmployeePortal
                                    ? (isSubActive ? "bg-white" : "hover:bg-white/10")
                                    : (isSubActive ? "bg-[rgba(28,28,28,0.05)]" : "hover:bg-[rgba(28,28,28,0.03)]")
                                }`}
                                style={{ 
                                  height: '40px',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <span className={`text-sm font-medium leading-5 ${
                                  isEmployeePortal
                                    ? (isSubActive ? "text-[#1C1C1C]" : "text-[#ADADAD]")
                                    : (isSubActive ? "text-[#1C1C1C]" : "text-[rgba(28,28,28,0.5)]")
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
            <div className={`my-6 h-0.5 rounded ${isEmployeePortal ? 'bg-[rgba(255,255,255,0.1)]' : 'bg-[rgba(28,28,28,0.05)]'}`} />

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
                  className="w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-[rgba(28,28,28,0.03)] mt-2"
                  style={{ height: '40px'}}
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

            {/* Employee Portal Settings */}
            {isEmployeePortal && isSidebarOpen && (
              <>
                <div className="mb-2 px-3">
                  <span className="text-[10px] font-medium tracking-[0.4px] text-[#989898] uppercase leading-3">
                    SETTINGS
                  </span>
                </div>
                <Link
                  to="/employee-portal/settings"
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    location.pathname === "/employee-portal/settings"
                      ? "bg-white"
                      : "hover:bg-white/10"
                  }`}
                  style={{ height: '40px' }}
                >
                  <div className="flex items-center gap-3">
                    <Gear 
                      size={20}
                      weight="regular"
                      className={location.pathname === "/employee-portal/settings" ? "text-[#1C1C1C]" : "text-[#D6D6D6]"}
                    />
                    <span className={`text-sm font-medium leading-5 ${
                      location.pathname === "/employee-portal/settings" ? "text-[#1C1C1C]" : "text-[#D6D6D6]"
                    }`}>
                      Settings
                    </span>
                  </div>
                </Link>

                {/* Help */}
                <button 
                  className="w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-white/10 mt-2"
                  style={{ height: '40px'}}
                >
                  <div className="flex items-center gap-3">
                    <Question size={20} weight="regular" className="text-[#D6D6D6]" />
                    <span className="text-sm font-medium leading-5 text-[#D6D6D6]">
                      Help
                    </span>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom Section - Admin Portal */}
        {!isEmployeePortal && (
          <>
            <div className="my-10 h-0.5 rounded" style={{ background: 'rgba(28,28,28,0.05)' }} />
            <div className="mt-auto border-t border-gray-200">
              {user?.isEnablePortalAccess && (
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
                    
                    {/* Person Icon */}
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
                  className="w-full h-12 flex items-center justify-center transition-colors border-t bg-gray-50 hover:bg-gray-100 border-gray-200"
                >
                  <CaretRight size={20} weight="bold" className="text-gray-600" />
                </button>
              )}
            </div>
          </>
        )}

        {/* Bottom Section - Employee Portal */}
        {isEmployeePortal && isSidebarOpen && (
          <div className="mt-auto">
            {/* Switch to Admin View Button */}
            <div className="px-6 mb-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-100 transition-colors rounded shadow-sm"
              >
                <span className="text-sm font-semibold text-[#414651]">Switch to Admin View</span>
              </button>
            </div>

            {/* User Footer Container */}
            <div className="flex flex-row justify-center items-center px-4 py-2.5 gap-3 bg-white shadow-sm rounded mx-6 mb-4" style={{ height: '50px' }}>
              {/* User Avatar */}
              <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0">
                <img 
                  src={user?.avatar || "https://via.placeholder.com/24"} 
                  alt="User" 
                  className="w-full h-full rounded object-cover"
                />
              </div>
              
              {/* User Info */}
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="text-sm font-semibold text-[#414651] truncate leading-6">
                  {user?.firstName || 'Vabik'}
                </span>
                <span className="text-xs text-gray-500 truncate leading-4">
                  {user?.Designation?.name || 'UI Designer'}
                </span>
              </div>
              
              {/* Dropdown Arrow */}
              <button 
                className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                title="Options"
              >
                <CaretDown size={16} weight="bold" className="text-gray-600" />
              </button>
              
              {/* Vertical Dashed Line */}
              <div className="h-6 w-px border-l border-dashed border-gray-300 flex-shrink-0"></div>
              
              {/* Person Icon */}
              <button className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0">
                <Users size={16} weight="regular" className="text-gray-500" />
              </button>
              
              {/* Collapse Arrow */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                title="Collapse"
              >
                <CaretLeft size={14} weight="bold" className="text-gray-500" />
              </button>
            </div>
          </div>
        )}

        {/* Collapsed state arrow for Employee Portal */}
      
          {/* Show only arrow icon when sidebar is collapsed */}
          {!isSidebarOpen && (!isEmployeePortal || !isMobile) && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`w-full h-12 flex items-center justify-center transition-colors border-t ${
                isEmployeePortal
                  ? 'bg-[#1C1C1C] hover:bg-white/10 border-white/10'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
              }`}
            >
              <CaretRight size={20} weight="bold" className={isEmployeePortal ? 'text-gray-400' : 'text-gray-600'} />
            </button>
          )}
        </div>
      
    
  </Fragment>
  
);    
}
export default SideBar;