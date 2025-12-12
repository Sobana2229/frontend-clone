import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import { AddressBook, ArrowLeft, Article, CaretDown, CaretUp, ChartDonut, CheckCircle, CurrencyDollar, DoorOpen, File, Folder, Gear, Heart, HouseIcon, InvoiceIcon, Money, MoneyIcon, PresentationChart, SignOut, Timer, Users, Wallet, X } from "@phosphor-icons/react";
import SideBarSubList from "./subButtonSideBar/sideBarSubList.jsx";
import { SideBarApprovals } from "../../../data/subSidebar.js";
import authStoreManagements from "../../store/tdPayroll/auth.js";
import CheckInCheckOut from "./employeePortal/checkInCheckOut.jsx";

function SideBar({ isSidebarOpen, setIsSidebarOpen }) {
  const { logout, user } = authStoreManagements();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [menuActive, setMenuActive] = useState("");
  const {pathname} = useLocation();
  const isEmployeePortal = location.pathname.includes("/employee-portal");
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const sidebarAdminPortal = [
    { title: "Dashboard", to: "/dashboard", icon: <ChartDonut size={20} />},
    { title: "Employees", to: "/employees", icon: <Users size={20} />},
    // { title: "Timesheet Payroll", to: "/timesheet", icon: <Timer size={20} />},
    // { title: "Attandance Payroll", to: "/attandance", icon: <AddressBook size={20} />},
    // { title: "Leaves Payroll", to: "/leaves", icon: <SignOut size={20} />},
    // { title: "Loss of Pay details", to: "/los-leaves", icon: <DoorOpen size={20} />},
    { title: "Pay Runs", to: "/pay-runs", icon: <Money size={20} />},
    { title: "Approvals", 
      to: "/reimbursement", 
      icon: <CheckCircle size={20} />, 
      isDropdown: true, 
      subMenu: SideBarApprovals 
    },
    // { title: "Form 16", to: "/form-six-teen", icon: <Article size={20} />},
    { title: "Benefits", to: "/loan", icon: <CurrencyDollar size={20} />},
    // { title: "Giving", to: "/giving", icon: <Heart size={20} />},
    { title: "Documents", to: "/documents", icon: <Folder size={20} />},
    { title: "Reports", to: "/reports", icon: <PresentationChart size={20} />},
    { title: "Settings", to: "/setting", icon: <Gear size={20} />},
  ];
  const sidebarEmployeePortal = [
    { title: "Home", to: "/employee-portal", icon: <HouseIcon size={20} />},
    { title: "Salary Details", to: "/employee-portal/salary-detail", icon: <MoneyIcon size={20} />},
    { title: "Leave & Attendance", to: "/employee-portal/leave-attendance", icon: <AddressBook size={20} />},
    { title: "Reimbursement", to: "/employee-portal/reimbursement", icon: <MoneyIcon size={20} />},
    // { title: "Investments", to: "/employee-portal/investment", icon: <InvoiceIcon size={20} />},
    { title: "Documents", to: "/employee-portal/document", icon: <File size={20} />},
    { title: "Benefits", to: "/employee-portal/loan", icon: <CurrencyDollar size={20} />},
  ];

  useEffect(() => {
    if(location.pathname.includes("/employee-portal")) {
      setMenuItems(sidebarEmployeePortal);
    }else{
      setMenuItems(sidebarAdminPortal);
    }
  }, [location.pathname]);

  useEffect(() => {
    if(location.pathname === "/setting"){
      setIsSidebarOpen(false)
    }else{
      // For mobile, keep sidebar closed by default for employee portal
      if (isEmployeePortal && typeof window !== 'undefined' && window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    }
  }, [location.pathname, isEmployeePortal]);

  // Handle window resize and detect mobile
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
      } else if (window.innerWidth < 768 && isEmployeePortal && isSidebarOpen) {
        // Keep sidebar state on resize, don't auto-close
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isEmployeePortal, isSidebarOpen]);

  const handleLogout = async () => {
    const access_token = localStorage.getItem("accessToken");
    const response = await logout(access_token);
    if(response === "success logout"){
      navigate("/login") 
    }
  };

  // Close sidebar on mobile when menu item is clicked
  const handleMenuClick = () => {
    if (isEmployeePortal && isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <Fragment>
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`h-screen bg-[#21263B] flex flex-col items-center justify-between pt-2 z-50 transition-transform duration-300 ease-in-out overflow-hidden ${
          isMobile
            ? `${isSidebarOpen ? "fixed inset-y-0 left-0 w-72 translate-x-0" : "fixed inset-y-0 left-0 w-72 -translate-x-full"}`
            : isEmployeePortal
              ? `md:relative md:translate-x-0 ${isSidebarOpen ? "md:w-[16.9%]" : "md:w-fit"}`
              : `${isSidebarOpen ? "md:w-[16.9%]" : "md:w-fit"} md:relative`
        }`}
      >
        {/* Close button for mobile employee portal */}
        {isEmployeePortal && isSidebarOpen && (
          <div className="absolute top-4 right-4 md:hidden">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-gray-700 text-white"
            >
              <X size={24} />
            </button>
          </div>
        )}
        {!location.pathname.includes("/employee-portal") && !location.pathname.includes("/setting") && (
          <div 
            className={`
              ${isSidebarOpen ? "w-full" : "w-fit"} 
              flex flex-col items-center justify-start bg-[#21263B]
              mb-2
            `}
            >
            {!isSidebarOpen && (
              <div className="w-full h-full flex items-center justify-center">
                <Wallet className="text-white text-2xl" />
              </div>
            )}
            {isSidebarOpen && (
              <div className="w-full flex items-center justify-start">
                <div className="w-32 h-10 flex items-center justify-center">
                  <img className="object-cover mt-1" src="/logoTekydoct.png" alt="logo-tekydoct" />
                </div>
                <h1 className="text-white text-2xl">Payroll</h1>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col flex-grow w-full space-y-5 overflow-y-auto overflow-x-hidden">
        {location.pathname.includes("/employee-portal") && (
          <>
            <div 
              className="w-full flex flex-col items-center justify-center space-y-4"
            >
              {/* Avatar with Initial */}
              <div className="w-28 h-28 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
                <span className="text-blue-400 text-5xl font-semibold">
                  {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>

              {/* User Info */}
              <div className="w-full flex flex-col items-center justify-center">
                <Link 
                  to="/employee-portal/profile-detail" 
                  className="
                  text-white 
                    hover:underline hover:text-blue-400
                    text-lg font-medium 
                    "
                >
                  {user?.firstName?.charAt(0).toUpperCase() + user?.firstName?.slice(1)}{" "} 
                  {user?.middleName?.charAt(0).toUpperCase() + user?.middleName?.slice(1)}{" "} 
                  {user?.lastName?.charAt(0).toUpperCase() + user?.lastName?.slice(1)}{" "}
                   - {user?.employeeId || '2432'}
                </Link>

                <p className="text-gray-400 text-sm">
                  {user?.Designation.name || 'Employee'}
                </p>
              </div>
            </div>

            {/* Clock */}
            <div className="flex items-center justify-center"
            >
              <CheckInCheckOut isEmployeePortal={pathname.includes("/employee-portal")} />
            </div>
          </>
        )}
        <div className="w-full flex flex-col px-3 space-y-3"
        >
          {menuItems.map(({ title, to, icon, isDropdown, subMenu }) => {
            const isActive = menuActive === title;
            const isOpen = activeDropdown === title;
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
                    className={`w-full flex items-center justify-between p-2 duration-300 ease-in-out group rounded-md text-white ${
                      isActive || isOpen ? "bg-[#3F8DFB]" : "hover:bg-[#3F8DFB]"
                    }`}
                  >
                    <div className="flex items-center space-x-3 text-white">
                      {icon}
                      {isSidebarOpen && (
                        <h1 className="text-sm font-medium">{title}</h1>
                      )}
                    </div>
                    {isSidebarOpen &&
                      (isOpen ? (
                        <CaretUp
                          size={16}
                          weight="fill"
                          className="text-white"
                        />
                      ) : (
                        <CaretDown
                          size={16}
                          weight="fill"
                          className="text-white"
                        />
                      ))}
                  </button>
                ) : (
                  <Link
                    to={to}
                    onClick={() => { 
                      setActiveDropdown(null); 
                      setMenuActive(title);
                      handleMenuClick();
                    }}
                    className={`w-full flex items-center text-white p-2 duration-300 ease-in-out rounded-md ${
                      isActive ? "bg-[#3F8DFB]" : "hover:bg-[#3F8DFB]"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {icon}
                      {isSidebarOpen && (
                        <h1 className="text-sm font-medium">{title}</h1>
                      )}
                    </div>
                  </Link>
                )}
                {isDropdown && isOpen && (
                  <SideBarSubList
                    subNavbarTitle={subMenu}
                    isSidebarOpen={isSidebarOpen}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className={`w-full flex flex-col items-center justify-center`}>
        {!location.pathname.includes("/employee-portal") &&
          user?.isEnablePortalAccess && (
            <button
              onClick={() => navigate("/employee-portal")}
              className="flex items-center justify-center space-x-3 text-white py-4 w-full duration-300 ease-in-out rounded-md hover:bg-[#3F8DFB]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.75 24C20.1424 24 21.4777 23.4469 22.4623 22.4623C23.4469 21.4777 24 20.1424 24 18.75C24 17.3576 23.4469 16.0223 22.4623 15.0377C21.4777 14.0531 20.1424 13.5 18.75 13.5C17.3576 13.5 16.0223 14.0531 15.0377 15.0377C14.0531 16.0223 13.5 17.3576 13.5 18.75C13.5 20.1424 14.0531 21.4777 15.0377 22.4623C16.0223 23.4469 17.3576 24 18.75 24ZM19.281 15.219L21.531 17.469C21.6718 17.6098 21.7509 17.8008 21.7509 18C21.7509 18.1992 21.6718 18.3902 21.531 18.531C21.3902 18.6718 21.1992 18.7509 21 18.7509C20.8008 18.7509 20.6098 18.6718 20.469 18.531L19.5 17.5605V21.75C19.5 21.9489 19.421 22.1397 19.2803 22.2803C19.1397 22.421 18.9489 22.5 18.75 22.5C18.5511 22.5 18.3603 22.421 18.2197 22.2803C18.079 22.1397 18 21.9489 18 21.75V17.5605L17.031 18.531C16.8902 18.6718 16.6992 18.7509 16.5 18.7509C16.3008 18.7509 16.1098 18.6718 15.969 18.531C15.8282 18.3902 15.7491 18.1992 15.7491 18C15.7491 17.8008 15.8282 17.6098 15.969 17.469L18.219 15.219C18.2887 15.1492 18.3714 15.0937 18.4626 15.0559C18.5537 15.0181 18.6513 14.9987 18.75 14.9987C18.8487 14.9987 18.9463 15.0181 19.0374 15.0559C19.1286 15.0937 19.2113 15.1492 19.281 15.219ZM16.5 7.5C16.5 8.69347 16.0259 9.83807 15.182 10.682C14.3381 11.5259 13.1935 12 12 12C10.8065 12 9.66193 11.5259 8.81802 10.682C7.97411 9.83807 7.5 8.69347 7.5 7.5C7.5 6.30653 7.97411 5.16193 8.81802 4.31802C9.66193 3.47411 10.8065 3 12 3C13.1935 3 14.3381 3.47411 15.182 4.31802C16.0259 5.16193 16.5 6.30653 16.5 7.5ZM12 10.5C12.7956 10.5 13.5587 10.1839 14.1213 9.62132C14.6839 9.05871 15 8.29565 15 7.5C15 6.70435 14.6839 5.94129 14.1213 5.37868C13.5587 4.81607 12.7956 4.5 12 4.5C11.2044 4.5 10.4413 4.81607 9.87868 5.37868C9.31607 5.94129 9 6.70435 9 7.5C9 8.29565 9.31607 9.05871 9.87868 9.62132C10.4413 10.1839 11.2044 10.5 12 10.5Z"
                  fill="#9CA3AF"
                />
                <path
                  d="M12.384 21C12.2122 20.5128 12.097 20.0075 12.0405 19.494H4.5C4.5015 19.125 4.731 18.015 5.748 16.998C6.726 16.02 8.5665 15 12 15C12.39 15 12.76 15.0125 13.11 15.0375C13.449 14.526 13.854 14.0625 14.316 13.6605C13.616 13.5555 12.844 13.502 12 13.5C4.5 13.5 3 18 3 19.5C3 21 4.5 21 4.5 21H12.384Z"
                  fill="#9CA3AF"
                />
              </svg>

              {isSidebarOpen && (
                <h1 className="text-xl font-medium text-[#9CA3AF]">
                  Employee Portal
                </h1>
              )}
            </button>
          )}
        {location.pathname.includes("/employee-portal") && (
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center space-x-3 text-white py-4 w-full duration-300 ease-in-out rounded-md hover:bg-[#3F8DFB]"
          >
            {isSidebarOpen && (
              <h1 className="text-xl font-regular text-[#9CA3AF]">
                Switch to Admin View
              </h1>
            )}
          </button>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center space-x-3 text-white py-4 w-full duration-300 ease-in-out rounded-md bg-gray-900 hover:bg-gray-950"
        >
          <DoorOpen size={25} />
          {isSidebarOpen && <h1 className="text-lg font-medium">Logout</h1>}
        </button>
        {/* Toggle button - hide on mobile for employee portal */}
        {(!isEmployeePortal || !isMobile) && (
          <div
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full h-14 flex items-center justify-center bg-[#181C2E] cursor-pointer"
          >
            <ArrowLeft className={`text-white text-xl transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`} />
          </div>
        )}
      </div>
      </div>
    </Fragment>
  );
}

export default SideBar;
