import { useEffect, useRef, useState } from "react";
import HeaderReusable from "./setting/headerReusable";
import { useNavigate } from "react-router-dom";
import subSidebarStoreManagements from "../../store/tdPayroll/setting/subSidebarStoreManagements";
import { useGetSubSidebarDetails } from "../hooks/useGetSubSideBarDetails";
import { useLocation } from "react-router-dom";

// this sub sidebar is copy from detail employee page
function SubSideBar({children}) {
    const navigate = useNavigate();
    const pathname = useLocation().pathname;
    const {
        menuItems,
        headers,
    } = useGetSubSidebarDetails();
    
    const [activeTab, setActiveTab] = useState({});

    const { 
        activeTab: savedActiveTab, 
        showSubSidebar,
        showX,
        showAddButton,
        showThreeDots,
        showHeaderDropDown,
        setSubSidebarState,
        forceHeaderLabel,
        addButtonFunction,
        cancelButtonFunction,
        headerDropDownProps,
    } = subSidebarStoreManagements();

    useEffect(() => {
        if (!menuItems?.length) return;

        const initialActive = 
            menuItems.find(item => item.title === savedActiveTab) ||
            menuItems[0];

        setActiveTab(initialActive)
        navigate(initialActive?.to);
    }, [menuItems])

    // save last active tab to zustand after unmount
    useEffect(() => {
        return () => {
            setSubSidebarState({ activeTab: activeTab?.title });
        };
    }, [activeTab]);

    const onTabChange = (menuItem) => {
        setActiveTab(menuItem);
        navigate(menuItem.to);
    }

    return (
        <div
            className="
                w-full h-full 
                bg-[#F9FAFB] 
                flex flex-col overflow-hidden
                pt-16
            "
        >

            {/* Top Bar with Title - STICKY HEADER */}
          

            {/* Side Bar and Main Content Wrapper */}
            <div
                className="w-full flex-1 flex overflow-hidden"
            >
                {/* Side Bar - STICKY */}
                {
                    (pathname !== "/reimbursement" &&
                    pathname !== "/salary-revision" &&
                    pathname !== "/leave-approval" &&
                    pathname !== "/regularization-attendance") && (
                        <div className={`
                                ${showSubSidebar ? "w-64" : "w-0"} 
                                flex-shrink-0 
                                border-r border-[#E5E7EB] 
                                overflow-y-auto`}
                        >
                            <div className="w-full h-full bg-[#E5E7EB] flex flex-col">
                                {/* Header - Title inside sidebar */}
                                <div className="px-6 py-6">
                                    <h1 className="text-xl font-semibold text-[#111827]">{headers}</h1>
                                </div>

                                {/* Menu Items */}
                                <nav className="flex-1 px-4 py-4 space-y-2">
                                    {menuItems.map((item) => {
                                        const IconComponent = item?.icon;
                                        const isActive = activeTab?.title === item?.title;

                                        return (
                                            <div key={item?.id} className="relative">
                                                <button
                                                    onClick={() => onTabChange(item)}
                                                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${isActive
                                                        ? "bg-white text-[#1F87FF] shadow-sm"
                                                        : "text-[#6B7280] hover:bg-white/50 hover:text-[#374151]"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {/* Icon */}
                                                        {IconComponent}

                                                        <span
                                                            className={`text-sm font-medium ${isActive ? "text-[#1F87FF]" : "text-[#6B7280]"}`}
                                                        >
                                                            {item.title}
                                                        </span>
                                                    </div>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>
                    )
                }

                {/* Main Content - DONT SCROLLABLE => let each page do the scroll logic */}
                <div className="w-full flex-grow flex-1"
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

export default SubSideBar;
