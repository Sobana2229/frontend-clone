import { useEffect, useRef, useState } from "react";
import HeaderReusable from "./setting/headerReusable";
import { useNavigate } from "react-router-dom";
import subSidebarStoreManagements from "../../store/tdPayroll/setting/subSidebarStoreManagements";
import { useGetSubSidebarDetails } from "../hooks/useGetSubSideBarDetails";
// this sub sidebar is copy from detail employee page
function SubSideBar({children}) {
    const navigate = useNavigate();
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
            <div
                className="
                    w-full
                    flex flex-row flex-shrink-0
                    pr-6
                    items-center justify-between 
                    sticky top-0 z-10 
                    bg-white
                "
            >
                
                <HeaderReusable
                    title={forceHeaderLabel || activeTab.headerLabel ||activeTab.title}
                    isAddData={showAddButton}
                    isOption={showThreeDots}
                    isShowX={showX}
                    isHeaderDropDown={showHeaderDropDown}
                    addDataTitle={activeTab?.addButtonLabel}
                    handleShowModal={addButtonFunction}
                    fileOptions={["", "Import Data", "Export Data"]}
                    handleOption={null}
                    handleX={cancelButtonFunction}
                    headerDropDownProps={headerDropDownProps}
                />

                {/* Action Buttons - deprecated, just use header reusable*/}
                {/* <div
                    className="flex items-center gap-3"
                >
                    {showAddButton && addButtonFunction && activeTab?.addButtonLabel && (
                        <button
                            onClick={addButtonFunction}
                            className="
                            h-[46px]
                            flex items-center
                            px-4
                            bg-blue-600 text-white text-lg
                            rounded-md 
                            whitespace-nowrap
                            hover:bg-blue-700 transition-colors
                        "
                        >
                            {activeTab?.addButtonLabel}
                        </button>
                    )}

                    {showThreeDots && (
                        <div 
                            className="relative" 
                            ref={dropdownRef}
                        >
                            <button
                                onClick={toggleDropdown}
                                className="
                                    h-[46px]
                                    flex items-center
                                    px-1
                                    text-gray-500 text-lg
                                    bg-white hover:bg-gray-50 transition-colors
                                    rounded-md border-2
                                "
                            >
                                <DotsThree className="text-[40px]" />
                            </button>

                            {isOpenOptions && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 z-50">
                                    {["Import data", "Export data"].map(el => {
                                        return (
                                            <button
                                                key={el}
                                                onClick={() => handleMenuClick(el)}
                                                className="w-full px-4 py-3 text-left font-medium hover:bg-blue-td-50 flex items-center space-x-2 transition-colors duration-200 hover:border-l-4 border-blue-600"
                                            >
                                                <span>{el}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div> */}
            </div>

            {/* Side Bar and Main Content Wrapper */}
            <div
                className="w-full flex-1 flex overflow-hidden"
            >
                {/* Side Bar - STICKY */}
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
