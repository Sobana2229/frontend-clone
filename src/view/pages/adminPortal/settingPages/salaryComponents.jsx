import { useEffect, useRef, useState } from "react";
import SalaryComponentsDisplayTable from "../../../component/setting/salaryComponents/salaryComponentsDisplayTable";
import FormEarningSalaryComponents from "../../../component/setting/salaryComponents/formEarningSalaryComponents";
import FormReimbursementSalaryComponents from "../../../component/setting/salaryComponents/formReimbursementSalaryComponents";
import HeaderReusable from "../../../component/setting/headerReusable";
import { tabsSalaryComponents } from "../../../../../data/dummy";
import { ArrowDown, CaretDownIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { checkPermission } from "../../../../../helper/globalHelper";
import authStoreManagements from "../../../../store/tdPayroll/auth";

function SalaryComponents() {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState("");
    const [activeIdx, setActiveIdx] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const dropdownRef = useRef(null);
    const { user } = authStoreManagements();

    const filteredTabs = tabsSalaryComponents.filter(tab => {
        if (tab === "Reimbursements") {
            return checkPermission(user, "Reimbursement And FBP Settings", "Full Access");
        }
        return true;
    });

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const rightActions = !showForm ? (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="py-2 px-4 rounded-md transition-all bg-blue-td-500 text-white shadow-md shadow-blue-td-300 hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
            >
                <span className="font-medium whitespace-nowrap">Add Component</span>
                <CaretDownIcon 
                    size={18} 
                    className={`transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown content */}
            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-td-200 z-50 overflow-hidden">
                    <div className="">
                        {filteredTabs?.map((component, idx) => (
                            <button
                                key={idx}
                                onClick={() =>  {
                                    setShowForm(component);
                                    setIsOpen(false);
                                    setIsCreate(true);
                                }}
                                className="w-full px-4 py-3 text-left text-gray-td-700 hover:bg-gray-td-50 transition-colors duration-150 flex items-center space-x-3 border-l-4 border-transparent hover:border-blue-td-500"
                            >
                                <div className={`w-2 h-2 rounded-full`} />
                                <span className="font-medium capitalize">{component}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    ) : null;

    return (
        <div className="w-full h-full flex flex-col items-start justify-start overflow-hidden pt-14">
            <HeaderReusable 
                title={"Salary Components"}  
                handleBack={() => navigate(-1)} 
                rightActions={rightActions}
            />
            {!showForm ? (
                <div className="w-full flex-1 flex items-start justify-start bg-gray-td-200 min-h-0" style={{ height: 'calc(100vh - 7.5rem)' }}>
                    {/* Sidebar */}
                    <div className="w-64 flex-shrink-0 bg-white rounded-md m-2 p-3 flex flex-col space-y-2 h-full overflow-y-auto">
                        {filteredTabs?.map((el, idx) => {
                            const isActive = idx === activeIdx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setActiveIdx(idx);
                                        setShowForm("");
                                    }}
                                    className={`w-full py-2 px-4 rounded-md transition-all text-left ${
                                        isActive
                                            ? "bg-blue-td-500 text-white shadow-md shadow-blue-td-300"
                                            : "bg-white hover:bg-gray-50"
                                    }`}
                                >
                                    {el}
                                </button>
                            );
                        })}
                    </div>
                    {/* Content area */}
                    <div className="flex-1 overflow-y-auto flex items-start justify-start px-2 py-2 min-h-0 h-full">
                        <div className="w-full flex-1 rounded-md min-h-0">
                            <SalaryComponentsDisplayTable indexTab={activeIdx} setShowForm={setShowForm} />
                        </div>
                    </div>
                </div>
            ) : showForm === "Earnings" ? (
                <FormEarningSalaryComponents setShowForm={setShowForm} showForm={showForm} isCreate={isCreate} setIsCreate={setIsCreate} />
            ) : showForm === "Reimbursements" ? (
                <FormReimbursementSalaryComponents setShowForm={setShowForm} showForm={showForm} isCreate={isCreate} setIsCreate={setIsCreate} />
            ) : null}
        </div>
    );
}

export default SalaryComponents;
