import { Bell, CalculatorIcon, Gear, MagnifyingGlass, PintGlass, User, Wallet, List } from "@phosphor-icons/react";
import { useLocation, useNavigate } from "react-router-dom";
import authStoreManagements from "../../store/tdPayroll/auth";
import { useState } from "react";
import ReuseableInput from "./reuseableInput";

function HeaderBar({ setIsSidebarOpen, isSidebarOpen, setShowCalculator, showCalculator }) {
    const location = useLocation();
    const { user, logout } = authStoreManagements();
    const navigate = useNavigate();
    const [showProfilePopup, setShowProfilePopup] = useState(false);

    const fetchNotification = async () => {
    };

    const readNotif = async (title) => {
    }

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
                w-full h-16 flex items-center justify-end absolute top-0 left-0 z-10
                bg-white border-b
                ${isEmployeePortal ? "md:pl-[14.5%] pl-0" : isSidebarOpen ? "pl-[14.5%]" : "pl-14"}
            `}
        >
            {/* {!location.pathname.includes("/setting") && (
                <div className={`${isSidebarOpen ? "w-[17.05%]" : "w-[3.7%] 3xl:w-[3.25%]"} h-full flex flex-col items-center justify-start bg-[#21263B]`}>
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
            )} */}

            {
                !location.pathname.includes("/employee-portal") && (
                    <div className={`${!location.pathname.includes("/setting") ? "w-full" : "w-[85%] border-b"} h-full flex items-center justify-between px-6 space-x-6`}>
                        <div className="h-full flex items-center justify-start space-x-4">
                            {/* Hamburger menu button for admin (mobile) */}
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                            >
                                <List className="text-2xl text-gray-700" />
                            </button>

                            <ReuseableInput
                                id="search"
                                name="search"
                                placeholder="Search..."
                                required
                                isIcon={true}
                                iconFor={"search"}
                            />
                        </div>
                        <div className="w-fit flex items-center justify-center h-full space-x-2">
                            <button
                                className="bg-blue-td-50 p-2 rounded-md"
                                onClick={() => setShowCalculator(!showCalculator)}
                            >
                                <CalculatorIcon className="text-2xl text-blue-td-600" />
                            </button>
                            <div className="py-2 px-3 flex items-center justify-center border rounded-md">
                                <h1>{user?.organization?.organizationDetail?.name}</h1>
                            </div>
                            <button
                                className="bg-blue-td-50 p-2 rounded-md"
                                onClick={() => setShowCalculator(!showCalculator)}
                            >
                                <Bell className="text-2xl text-blue-td-600" />
                            </button>
                            <div className="py-0.5 px-2 flex items-center justify-center border rounded-md space-x-3">
                                <button onClick={() => setShowProfilePopup(!showProfilePopup)} className="h-8 w-8 rounded-md bg-blue-500 flex items-center justify-center">
                                    <User className="text-white text-base" />
                                </button>
                                <div className="flex flex-col items-start justify-start text-xs">
                                    <h1 className="text-sm font-medium">{user?.name}</h1>
                                    <p className="text-xs">{user?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                location.pathname.includes("/employee-portal") && (
                    <div className={`${!location.pathname.includes("/setting") ? "w-full" : "w-[85%] border-b"} h-full flex items-center justify-between px-6 space-x-6`}>
                        <div className="h-full flex items-center justify-start space-x-4">
                            {/* Hamburger menu button for mobile */}
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                            >
                                <List className="text-2xl text-gray-700" />
                            </button>
                            <ReuseableInput
                                id="search"
                                name="search"
                                placeholder="Search..."
                                required
                                isIcon={true}
                                iconFor={"search"}
                            />
                        </div>
                        <div className="w-fit flex items-center justify-center h-full space-x-2">
                            <button
                                className="bg-blue-td-50 p-2 rounded-md"
                                onClick={() => setShowCalculator(!showCalculator)}
                            >
                                <Bell className="text-2xl text-blue-td-600" />
                            </button>

                            <div className="py-2 px-3 flex items-center justify-center border rounded-md">
                                <h1>{user?.organization?.organizationDetail?.name || "TEKYDOCT SDN BHD"}</h1>
                            </div>
                        </div>
                    </div>
                )
            }

            
            
            {showProfilePopup && (
                <div className="absolute top-full right-10 z-50 bg-white shadow-lg rounded-lg border border-gray-200 w-72">
                    <div className="px-4 py-3 border-b border-gray-100 space-y-2">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <User className="text-white text-lg" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{user?.name || 'User Name'}</p>
                                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                            </div>
                        </div>
                        <div className="w-full flex items-start justify-start flex-col space-y-2">
                            <div className="w-full flex flex-col justify-start items-start">
                                <p className="text-xs font-light capitalize">User ID:</p>
                                <span className="text-xs font-medium">{user?.employeeId ? user?.employeeId : user?.userId}</span>
                            </div>
                            <div className="w-full flex flex-col justify-start items-start">
                                <p className="text-xs font-light">Organisation ID:</p>
                                <span className="text-xs font-medium">{user?.organization?.organizationDetail?.organizationId ? user?.organization?.organizationDetail?.organizationId : user?.organizationDetail?.organizationId}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-2 flex items-center justify-between">
                        <button className="text-blue-500 font-light text-sm capitalize">My Profiles</button>
                        <button onClick={handleLogout} className="text-red-500 font-light text-sm capitalize">Sign Out</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HeaderBar;
