import { ArrowSquareLeft, CaretDown, DotsThree, Download, Plus, X} from "@phosphor-icons/react";
import TabNavigation from "./tabNavigation";
import React, { useEffect, useRef, useState } from "react";
import { dropDownSalaryComponents, EmployeeHeadersoptionFilter, statusShowGlobal } from "../../../../data/dummy";
import dayjs from "dayjs";
import { checkPermission } from "../../../../helper/globalHelper";
import authStoreManagements from "../../../store/tdPayroll/auth";

function HeaderReusable({title, isAddData=false, addDataTitle, isDonwload=false, needIconAddData=false, needTabs=false, tabs=[], activeTab, setActiveTab, isTabsNotTittle=false, handleShowModal, handleShowUploadForm, showUploadFile=false, setShowForm, handleBack, status, fileOptions, handleOption, isOption=false, dateExecute, handleCancel, isShowX=false, handleX=null, isHeaderDropDown=false, headerDropDownProps={}, rightActions=null}) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showOption, setShowOption] = useState(false);
    const dropdownRef = useRef(null);
    const { user } = authStoreManagements();

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <>
            {(!isTabsNotTittle && !showUploadFile) ? (
                <div className={
                        `w-full 
                        flex 
                        ${needTabs ? 
                            " flex-col h-fit pt-3 space-y-3" : 
                            "h-16 items-center justify-between"} px-6 border-b
                        bg-white
                        `
                    } 
                    style={{ minHeight: needTabs ? 64 : 64}}
                >
                    <div className="w-full flex items-center justify-between">
                        <div className={`w-full flex space-x-3 items-center ${handleCancel ? "justify-between" : "justify-start"}`}>
                            {handleBack && (
                                <button onClick={handleBack} className="text-2xl flex items-center justify-center">
                                    <ArrowSquareLeft  />
                                </button>
                            )}

                            {isHeaderDropDown ? (
                                <HeaderDropDown
                                    filterFor={headerDropDownProps.filterFor}
                                    filter={headerDropDownProps.filter}
                                    setFilter={headerDropDownProps.setFilter}
                                />
                            ) : (
                            <h1 className="capitalize text-xl font-medium">{title}</h1>
                            )}
                            {status && (
                                <div
                                    className={`
                                    py-0.5 px-3 rounded-sm capitalize
                                    ${status === "paymentDue"
                                        ? "bg-orange-200 text-orange-500"
                                        : status === "paid"
                                        ? "bg-green-200 text-green-500"
                                        : status === "reject"
                                        ? "bg-red-500 text-white"
                                        : "bg-gray-200 text-gray-500"}
                                    `}
                                >
                                    {statusShowGlobal[status] && (
                                    dayjs().isAfter(dayjs(dateExecute)) && statusShowGlobal[status] === "paymentDue"
                                        ? "Approved"
                                        : statusShowGlobal[status]
                                    )}
                                </div>
                            )}
                            {handleCancel && (
                                <button onClick={handleCancel} className="h-5 w-5 rounded-full border-2 border-gray-td-300 flex items-center justify-center text-sm text-gray-td-300">
                                    X
                                </button>
                            )}
                        </div>
                        <div className="h-full flex items-center justify-center space-x-4">
                            {isAddData && (
                                <>
                                    {title === "Users & Roles" ? (
                                        // Khusus Users & Roles header
                                        activeTab === "Users" ? (
                                            // Users tab: butuh permission
                                            checkPermission(user, "Manage Users", "Full Access") && (
                                                <div
                                                    ref={dropdownRef}
                                                    className={`relative capitalize py-2 px-4 min-w-32 w-fit 
                                                        ${ status != "paid" ? "bg-[#3F8DFB] text-white" : "bg-white border"} text-base rounded-md flex space-x-2 items-center justify-center`}
                                                >
                                                    <button
                                                        onClick={() => {
                                                            setShowDropdown((prev) => !prev);
                                                            handleShowModal ? handleShowModal() : "";
                                                        }}
                                                        className="flex items-center space-x-2 whitespace-nowrap"
                                                    >
                                                        {needIconAddData && <Plus />}
                                                        <span>{addDataTitle}</span>
                                                    </button>
                                                </div>
                                            )
                                        ) : (
                                            // Roles tab: selalu show
                                            <div
                                                ref={dropdownRef}
                                                className={`relative capitalize py-2 px-4 min-w-32 w-fit 
                                                    ${ status != "paid" ? "bg-[#3F8DFB] text-white" : "bg-white border"} text-base rounded-md flex space-x-2 items-center justify-center`}
                                            >
                                                <button
                                                    onClick={() => {
                                                        setShowDropdown((prev) => !prev);
                                                        handleShowModal ? handleShowModal() : "";
                                                    }}
                                                    className="flex items-center space-x-2 whitespace-nowrap"
                                                >
                                                    {needIconAddData && <Plus />}
                                                    <span>{addDataTitle}</span>
                                                </button>
                                            </div>
                                        )
                                    ) : (
                                        // Title lain (Salary Components, dll)
                                        <div
                                            ref={dropdownRef}
                                            className={`relative capitalize py-2 px-4 min-w-32 w-fit 
                                                ${ status != "paid" ? "bg-[#3F8DFB] text-white" : "bg-white border"} text-base rounded-md flex space-x-2 items-center justify-center`}
                                        >
                                            <button
                                                onClick={() => {
                                                    setShowDropdown((prev) => !prev);
                                                    handleShowModal ? handleShowModal() : "";
                                                }}
                                                className="flex items-center space-x-2 whitespace-nowrap"
                                            >
                                                {needIconAddData && <Plus />}
                                                <span>{addDataTitle}</span>
                                            </button>

                                            {title === "Salary Components" && showDropdown && (
                                                <div className="absolute top-full right-0 z-10 mt-2 bg-white border rounded-md w-48 shadow-md">
                                                    {dropDownSalaryComponents?.map((item, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => {
                                                                setShowForm(item);
                                                            }}
                                                            className="w-full p-2 text-black text-left hover:bg-gray-100"
                                                        >
                                                            {item}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            {isOption && (
                                <div onClick={() => setShowOption(!showOption)} className="text-gray-500 hover:bg-gray-100 p-1.5 py-2 rounded-md border relative" ref={dropdownRef}>
                                    <DotsThree className="text-xl" />
                                    {showOption && (
                                        <div className="w-[150px] mt-2 h-fit absolute right-0 top-full rounded-md border flex flex-col justify-start items-start bg-white p-1 z-50">
                                            {fileOptions?.map((option, index) => (
                                                <React.Fragment key={index}>
                                                    <button
                                                        onClick={() => handleOption(option)}
                                                        className="p-2 w-full text-sm font-light text-black hover:bg-gray-100 flex items-center justify-start"
                                                    >
                                                        {index === 0 ? 
                                                            status == "paymentDue" ? "reject approval" :
                                                            status == "paid" ? "delete record payment" :  
                                                            status == "reject" ? "edit pay un" :  
                                                            status == "draft" ? "delete pay run" :
                                                            ""
                                                        : option}
                                                    </button>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {isShowX && (
                                <div 
                                    onClick={handleX} 
                                    className="text-gray-500 hover:bg-gray-100 p-1.5 py-2 rounded-md border"
                                >
                                    <X size={20} />
                                    
                                </div>
                            )}

                            {(isDonwload && handleShowUploadForm) && (
                                <button onClick={() => {
                                    handleShowUploadForm()
                                }} className="h-10 w-10 capitalize flex items-center justify-center border-[1px] rounded-md"><Download className="text-xl" /></button>
                            )}

                            {rightActions && (
                                <div className="flex items-center justify-center space-x-4">
                                    {rightActions}
                                </div>
                            )}
                        </div>
                    </div>
                    {needTabs && (
                        <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                    )}
                </div>
            ) : showUploadFile ? (
                <div className="w-full bg-white border-b py-2 border-gray-200">
                    <div className="flex items-center justify-between p-1">
                        {/* filter old */}
                        <div className="flex items-center justify-center px-5">
                            <h2 className="text-lg font-medium text-gray-800 capitalize">{showUploadFile ? `${title} - Select File` : `add ${title}`} </h2>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`w-full flex h-12 items-center justify-between px-6 border-b`}>
                    <TabNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} isTabsNotTittle={isTabsNotTittle} />
                </div>
            )}
        </>
  );
}

const HeaderDropDown = ({
    filterFor = "",
    filter = {},
    setFilter = null,
}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const dummyOptions = 
            (
                filterFor === "claims" ||
                filterFor === "leave requests" ||
                filterFor === "regularization requests"
            ) ?
                EmployeeHeadersoptionFilter :
                [];
        setOptions(dummyOptions);

    }, [filterFor])

    const handleOptionSelect = (value) => {
        if (setFilter) {
            setFilter({ ...filter, status: value });
        }
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h2 className="text-xl font-medium text-gray-800 capitalize">
                    {filter?.status} {filterFor}
                </h2>
                <CaretDown
                    weight="fill"
                    className={`text-lg transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </div>
            {(isOpen) && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    {options?.map((option) => (
                        <div
                            key={option.value}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                            onClick={() => handleOptionSelect(option.value)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default HeaderReusable;
  