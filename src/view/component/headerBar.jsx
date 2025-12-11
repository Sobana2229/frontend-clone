import { Bell, CalendarBlank, CaretDown, CaretLeft, List, MagnifyingGlass } from "@phosphor-icons/react";
import { useLocation, useNavigate } from "react-router-dom";
import authStoreManagements from "../../store/tdPayroll/auth";
import { useState, useEffect } from "react";

function HeaderBar({ setIsSidebarOpen, isSidebarOpen }) {
    const location = useLocation();
    const { user, logout } = authStoreManagements();
    const navigate = useNavigate();
    const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showCompanyDropdown && !e.target.closest('.company-dropdown')) {
                setShowCompanyDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showCompanyDropdown]);

    // Generate breadcrumb based on current path
    const getBreadcrumb = () => {
        const path = location.pathname;
        console.log("=== BREADCRUMB DEBUG ===");
        console.log("Current path:", path);
        
        // Remove leading slash and split by /
        const segments = path.split('/').filter(Boolean);
        console.log("Path segments:", segments);
        
        // Build breadcrumb
        const breadcrumbParts = ['Main'];
        
        // Route name mappings for better display
        const routeNameMap = {
            // Employee Portal
            'employee-portal': 'Employee Portal',
            'employeeportal': 'Employee Portal',
            
            // Advance Salary variations
            'advance-salary': 'Advance Salary',
            'advancesalary': 'Advance Salary',
            'advance_salary': 'Advance Salary',
            'advancesalaries': 'Advance Salary',
            'advance-salaries': 'Advance Salary',
            
            // Pay Runs
            'pay-runs': 'Pay Runs',
            'payruns': 'Pay Runs',
            'pay_runs': 'Pay Runs',
            
            // Other routes
            'dashboard': 'Dashboard',
            'employee': 'Employee',
            'employees': 'Employees',
            'approval': 'Approval',
            'approvals': 'Approval',
            
            // Benefits
            'benefit': 'Benefits',
            'benefits': 'Benefits',
            
            // Loans
            'loan': 'Loans',
            'loans': 'Loans',
            
            // Documents
            'document': 'Documents',
            'documents': 'Documents',
            
            // Reports
            'report': 'Reports',
            'reports': 'Reports',
            
            // Settings
            'setting': 'Settings',
            'settings': 'Settings',
            
            // Approval sub-pages
            'attendance': 'Attendance',
            'leave': 'Leave',
            'leaves': 'Leave',
            'reimburse': 'Reimbursements',
            'reimbursement': 'Reimbursements',
            'reimbursements': 'Reimbursements',
            'salary': 'Salary Revision',
            'salary-revision': 'Salary Revision',
            'salaryrevision': 'Salary Revision'
        };
        
        segments.forEach((segment) => {
            const lowerSegment = segment.toLowerCase().trim();
            console.log("Processing segment:", segment, "->", lowerSegment);
            
            // Check if we have a custom mapping first
            if (routeNameMap[lowerSegment]) {
                const mappedName = routeNameMap[lowerSegment];
                console.log("Mapped to:", mappedName);
                breadcrumbParts.push(mappedName);
            } else {
                // Convert kebab-case to Title Case
                const formattedSegment = segment
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                
                console.log("Formatted to:", formattedSegment);
                breadcrumbParts.push(formattedSegment);
            }
        });
        
        console.log("Final breadcrumb parts:", breadcrumbParts);
        console.log("======================");
        return breadcrumbParts;
    };

    const breadcrumbParts = getBreadcrumb();

    const handleLogout = async () => {
        const access_token = localStorage.getItem("accessToken");
        const response = await logout(access_token);
        if(response === "success logout"){
            navigate("/login") 
        }
    };

    const isEmployeePortal = location.pathname.includes("/employee-portal");
    
    return (
        <div className={`
                w-full h-16 flex items-center justify-between fixed top-0 right-0 z-10
                bg-white border-b border-gray-200
                ${isEmployeePortal ? "md:left-[14.5%] left-0" : isSidebarOpen ? "left-[14.5%]" : "left-14"}
                px-3 sm:px-4 md:px-6
            `}
        >
            {/* LEFT SECTION - Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                {/* Hamburger menu for mobile */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden p-2 rounded-md hover:bg-gray-100 flex-shrink-0"
                >
                    <List className="text-lg sm:text-xl text-gray-700" />
                </button>

                {/* Back button - hidden on mobile */}
                <button 
                    onClick={() => navigate(-1)}
                    className="hidden lg:flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
                >
                    <CaretLeft className="text-xl text-gray-600" />
                </button>

                {/* Breadcrumb - responsive */}
                <div className="hidden sm:flex items-center text-xs sm:text-sm">
                    {breadcrumbParts.map((part, index) => (
                        <div key={index} className="flex items-center flex-shrink-0">
                            <span className={`
                                whitespace-nowrap
                                ${index === breadcrumbParts.length - 1 
                                    ? 'text-gray-900 font-medium' 
                                    : 'text-gray-500'}
                            `}>
                                {part}
                            </span>
                            {index < breadcrumbParts.length - 1 && (
                                <span className="mx-1 sm:mx-1.5 text-gray-400">/</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Mobile: Show only last breadcrumb */}
                <div className="sm:hidden flex items-center text-sm font-medium text-gray-900">
                    {breadcrumbParts[breadcrumbParts.length - 1]}
                </div>
            </div>

            {/* CENTER SECTION - Search Bar (hidden on small screens) */}
            <div className="hidden lg:flex flex-1 max-w-[260px] xl:max-w-[300px] 2xl:max-w-[350px] mx-1">
                <div className="w-full h-9 bg-gray-50 border border-gray-200 rounded-lg flex items-center px-3 gap-2">
                    <MagnifyingGlass className="text-gray-400 text-base flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="Search employees, documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-sm text-gray-600 placeholder-gray-400"
                    />
                </div>
            </div>

            {/* RIGHT SECTION - Icons and Company */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Search icon for mobile/tablet (shows when search bar is hidden) */}
                <button className="lg:hidden flex items-center justify-center w-5 h-9 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <MagnifyingGlass className="text-gray-600 text-lg" />
                </button>

                {/* Calendar Icon - hidden on smallest screens */}
                <button className="hidden sm:flex items-center justify-center w-9 h-9 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <CalendarBlank className="text-gray-600 text-lg" />
                </button>

                {/* Notification Bell */}
                <button className="flex items-center justify-center w-9 h-9 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors relative">
                    <Bell className="text-gray-600 text-lg" />
                </button>

                {/* Company Selector - OPTIMIZED FOR VISIBILITY */}
                <div className="relative company-dropdown">
                    <button 
                        onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                        className="hidden md:flex items-center justify-between h-9 px-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white w-[145px] lg:w-[160px] xl:w-[180px] 2xl:w-[200px]"
                    >
                        <span className="text-[13px] font-medium text-gray-900 truncate flex-1 text-left leading-tight">
                            {user?.organization?.organizationDetail?.name || "TEKYDOCT SDN BHD"}
                        </span>
                        <CaretDown className="text-gray-500 text-xs ml-1 flex-shrink-0" />
                    </button>

                    {/* Dropdown Menu */}
                    {showCompanyDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-white shadow-lg rounded-lg border border-gray-200 py-2 z-50">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Current Organization</p>
                                <p className="text-sm font-medium text-gray-900 break-words">
                                    {user?.organization?.organizationDetail?.name || "TEKYDOCT SDN BHD"}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">Org ID: {user?.organization?.organizationDetail?.organizationId || user?.organizationDetail?.organizationId || "N/A"}</p>
                            </div>
                            <div className="px-2 py-1">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile: User/Menu button - shows when company dropdown is hidden */}
                <button 
                    onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                    className="md:hidden flex items-center justify-center w-9 h-9 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white relative"
                >
                    <span className="text-xs font-semibold text-gray-700">
                        {(user?.organization?.organizationDetail?.name || "TEKYDOCT SDN BHD").substring(0, 2).toUpperCase()}
                    </span>
                </button>
            </div>
        </div>
    );
}

export default HeaderBar;