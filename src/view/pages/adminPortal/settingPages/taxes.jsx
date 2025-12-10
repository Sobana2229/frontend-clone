import { useEffect, useState } from "react";
import { RadioButton } from "@phosphor-icons/react";
import HeaderReusable from "../../../component/setting/headerReusable";
import CompanyForm from "../../../component/setting/tax/companyForm";
import IndividualForm from "../../../component/setting/tax/individualForm";
import taxStoreManagements from "../../../../store/tdPayroll/setting/tax";
import ShowTaxeDetail from "../../../component/setting/tax/showTaxeDetail";

function Taxes() {
    const { fetchTax, taxCompanyData, taxIndividualData, taxData } = taxStoreManagements()
    const [activeTax, setActiveTax] = useState("company");
    const [showEdit, setShowEdit] = useState(true);
    const [tempData, setTempData] = useState('');
    
    useEffect(() => {
        if (taxIndividualData && taxCompanyData) {
            setActiveTax("company");
        } else if (taxIndividualData && !taxCompanyData){
                setActiveTax("individual");
        } else if (!taxIndividualData && taxCompanyData){
                setActiveTax("company");
        } else {
            const access_token = localStorage.getItem("accessToken");
            fetchTax(access_token, "individual");
        }
    }, [taxIndividualData]);

    useEffect(() => {
        if(!taxData){
            const access_token = localStorage.getItem("accessToken");
            fetchTax(access_token, "tax");
        }else{
            setShowEdit(false);
            setTempData(taxData); // Always update tempData when taxData changes (for real-time update)
        }
    }, [taxData]);
    
    return (
        <div className={`w-full h-[700px] overflow-y-auto flex-col flex items-start justify-start ${showEdit && "bg-white"}  rounded-md`}>
            {!showEdit ? (
                <ShowTaxeDetail data={tempData} setShowForm={setShowEdit} />
            ) : (
                <div className="w-[700px] flex items-start justify-start">
                    <div className="w-full px-6 py-5 space-y-6">
                        <div className="space-y-6">
                            <h2 className="text-lg font-medium text-gray-900">
                                Organisation Tax details
                            </h2>

                            {/* Organization Type Radio Buttons */}
                            <div className="flex items-center space-x-8">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="radio"
                                            name="organizationType"
                                            value="company"
                                            checked={activeTax === "company"}
                                            onChange={(e) => setActiveTax(e.target.value)}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                            activeTax === "company" 
                                                ? "border-blue-600 bg-blue-600" 
                                                : "border-gray-300 bg-white hover:border-gray-400"
                                        }`}>
                                            {activeTax === "company" && (
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium">Company</span>
                                </label>
                                
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="radio"
                                            name="organizationType"
                                            value="individual"
                                            checked={activeTax === "individual"}
                                            onChange={(e) => setActiveTax(e.target.value)}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                            activeTax === "individual" 
                                                ? "border-blue-600 bg-blue-600" 
                                                : "border-gray-300 bg-white hover:border-gray-400"
                                        }`}>
                                            {activeTax === "individual" && (
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium">Individual Employee</span>
                                </label>
                            </div>
                        </div>

                        {activeTax === "company" ? <CompanyForm setShowForm={setShowEdit} /> : <IndividualForm setShowForm={setShowEdit} />}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Taxes;
