import { useState } from "react";
import authStoreManagements from "../../../store/tdPayroll/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HeaderReusable from "../../component/setting/headerReusable";
import { ArrowLeft } from "@phosphor-icons/react";
import DocumentPayslipEmployeePortal from "../../component/employeePortal/document/documentPayslipEmployeePortal";

function DocumentEmployeePortal() {
    const [sectionActive, setSectionActive] = useState("Payslips");
    const [showTableList, setshowTableList] = useState(false); // ✅ Start with list view
    // const docsFile = ["Payslips", "Form 16"];
    const docsFile = ["Payslips"];
    
    return (
        <div className="w-full flex-col h-screen bg-white flex items-start justify-start">
            <HeaderReusable title={`Documents`} />
            <div className="w-full p-10 grid grid-cols-7 gap-5">
                {!showTableList ? (
                    // ✅ Document List View
                    docsFile.map((item, index) => (
                        <button 
                            key={index}
                            onClick={() => {
                                setSectionActive(item);
                                setshowTableList(true); // ✅ Show detail
                            }} 
                            className="w-[200px] h-[200px] bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-gray-700"
                        >
                            {item}
                        </button>
                    ))
                ) : (
                    // ✅ Document Detail View
                    <div className="col-span-7">
                        {/* ✅ Back Button */}
                        <button 
                            onClick={() => setshowTableList(false)}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
                        >
                            <ArrowLeft size={20} weight="bold" />
                            <span>Back to Documents</span>
                        </button>

                        {/* Content */}
                        {sectionActive === "Payslips" && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Payslips</h2>
                                <DocumentPayslipEmployeePortal />
                            </div>
                        )}
                        
                        {sectionActive === "Form 16" && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Form 16</h2>
                                <p className="text-gray-600">Form 16 content here...</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DocumentEmployeePortal;
