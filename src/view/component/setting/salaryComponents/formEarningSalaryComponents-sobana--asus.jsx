import { useEffect, useState } from "react";
import HeaderReusable from "../headerReusable";
import { Info, Plus } from "@phosphor-icons/react";
import salaryComponentStoreManagements from "../../../../store/tdPayroll/setting/salaryComponent";
import { toast } from "react-toastify";
import FormCustomAllowance from "./earning/formCustomAllowance";
import FormCustomBonus from "./earning/formBonus";
import { salaryComponentEarningType } from "../../../../../data/dummy";
import FormEarningDefault from "./earning/formEarningDefault";
import { CustomToast } from "../../customToast";

function FormEarningSalaryComponents({setShowForm, showForm, isCreate, setIsCreate}) {
    const { createSalaryComponent, fetchSalaryComponent, loading, dataEarning, updateSalaryComponent, clearData } = salaryComponentStoreManagements();
    const [formData, setFormData] = useState({
        earningType: '',
        earningName: '',
        nameInPayslip: '',
        payType: '',
        calculationType: '',
        amount: 0,
        customFormula: '',
        isActive: false,
        isSchedule: false,
        isSalaryStructure: false,
        isTaxable: false,
        taxDeductionPreference: '',
        isProRataBasis: false,
        considerSpk: false,
        spkContribution: '',
        showInPayslip: true,
        maxAmount: 0,
        isFBPComponent: false,
        restrictFBPOverride: false,
    });

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isCreate) {
            clearData();
            setFormData({
                earningType: '',
                earningName: '',
                nameInPayslip: '',
                payType: '',
                calculationType: '',
                amount: 0,
                customFormula: '',
                isActive: false,
                isSchedule: false,
                isSalaryStructure: false,
                isTaxable: false,
                taxDeductionPreference: '',
                isProRataBasis: false,
                considerSpk: false,
                spkContribution: '',
                showInPayslip: true,
                maxAmount: 0,
                isFBPComponent: false,
                restrictFBPOverride: false,
            });
        } else {
            const isBonusType = dataEarning?.earningType === "Bonus" || 
                               dataEarning?.earningType === "Commission" || 
                               dataEarning?.earningType === "Gift Coupon";
            const defaultIsSchedule = isBonusType ? true : false;
            
            setFormData({
                earningType: dataEarning?.earningType || '',
                earningName: dataEarning?.earningName || '',
                nameInPayslip: dataEarning?.nameInPayslip || '',
                payType: dataEarning?.payType || '',
                calculationType: dataEarning?.calculationType || '',
                amount: dataEarning?.amount ?? 0,
                customFormula: dataEarning?.customFormula || '',
                isActive: dataEarning?.isActive ?? false,
                isSchedule: dataEarning?.isSchedule ?? defaultIsSchedule,
                isSalaryStructure: dataEarning?.isSalaryStructure ?? false,
                isTaxable: dataEarning?.isTaxable ?? false,
                taxDeductionPreference: dataEarning?.taxDeductionPreference || '',
                isProRataBasis: dataEarning?.isProRataBasis ?? false,
                considerSpk: dataEarning?.considerSpk ?? false,
                spkContribution: dataEarning?.spkContribution || '',
                showInPayslip: dataEarning?.showInPayslip ?? true,
                maxAmount: dataEarning?.maxAmount ?? 0,
                isFBPComponent: dataEarning?.isFBPComponent ?? false,
                restrictFBPOverride: dataEarning?.restrictFBPOverride ?? false,
            });
        }
    }, [isCreate, dataEarning]);

    useEffect(() => {
        if (formData?.calculationType && !dataEarning) {
            setFormData(prev => ({
                ...prev,
                amount: 0,
            }));
        }
    }, [formData?.calculationType, dataEarning]);

    useEffect(() => {
        if(!formData?.considerSpk){
            setFormData(prev => ({
                ...prev,
                spkContribution: '',
            }));
        }
    }, [formData?.considerSpk]);

    useEffect(() => {
        if(!formData?.isTaxable){
            setFormData(prev => ({
                ...prev,
                taxDeductionPreference: '',
            }));
        }
    }, [formData?.isTaxable]);

    useEffect(() => {
        if (!formData?.earningType) return;
        
        if (dataEarning) {
            return;
        }

        if (formData?.earningType === "Custom Allowance" && formData?.payType) {
            return;
        }

        let updates = {
            isFBPComponent: false,
            restrictFBPOverride: false,
        };

        if (!dataEarning) {
            if (formData?.earningType === "Basic" || formData?.earningType === "Dearness Allowance" || 
                formData?.earningType === "Shift Allowance" || formData?.earningType === "Children Education Allowance" ||
                formData?.earningType === "Bonus" || formData?.earningType === "Commission" ||
                formData?.earningType === "House Rent Allowance" || formData?.earningType === "Conveyance Allowance" || 
                formData?.earningType === "Hostel Expenditure Allowance" || formData?.earningType === "Transport Allowance" || 
                formData?.earningType === "Helper Allowance" || formData?.earningType === "Travelling Allowance" || 
                formData?.earningType === "Uniform Allowance" || formData?.earningType === "Daily Allowance" || 
                formData?.earningType === "City Compensatory Allowance" || formData?.earningType === "Overtime Allowance" || 
                formData?.earningType === "Telephone Allowance" || formData?.earningType === "Fixed Medical Allowance" ||
                formData?.earningType === "Gift Coupon") {
                updates.calculationType = "Flat Amount";
            } else if (formData?.earningType === "Project Allowance" || 
                    formData?.earningType === "Food Allowance" || 
                    formData?.earningType === "Holiday Allowance" || 
                    formData?.earningType === "Entertainment Allowance" || 
                    formData?.earningType === "Food Coupon" || 
                    formData?.earningType === "Research Allowance" || 
                    formData?.earningType === "Books And Periodicals Allowance" ||
                    formData?.earningType === "Fuel Allowance" ||
                    formData?.earningType === "Driver Allowance" ||
                    formData?.earningType === "Leave Travel Allowance" || 
                    formData?.earningType === "Vehicle Maintenance Allowance" ||
                    formData?.earningType === "Telephone And Internet Allowance") {
                updates.calculationType = "Flat Amount";
                updates.payType = "Fixed Pay";
            } else if (formData?.earningType === "Custom Allowance") {
                updates.calculationType = "Flat Amount";
            }
        }

        if (formData?.earningType === "Basic" || 
            formData?.earningType === "Dearness Allowance" || 
            formData?.earningType === "City Compensatory Allowance" || 
            formData?.earningType === "Shift Allowance") {
            updates = {
                ...updates,
                isSalaryStructure: true,
                isTaxable: true,
                isProRataBasis: true,
                considerSpk: true,
                spkContribution: "Always",
                showInPayslip: true,
            };
        } else if (formData?.earningType === "House Rent Allowance") {
            updates = {
                ...updates,
                isSalaryStructure: true,
                isTaxable: true,
                showInPayslip: true,
                isProRataBasis: true,
            };
        } else if (formData?.earningType === "Conveyance Allowance" ||
                formData?.earningType === "Hostel Expenditure Allowance" || formData?.earningType === "Transport Allowance" || 
                formData?.earningType === "Helper Allowance" || formData?.earningType === "Travelling Allowance" || 
                formData?.earningType === "Uniform Allowance" || formData?.earningType === "Daily Allowance" || 
                formData?.earningType === "City Compensatory Allowance" || formData?.earningType === "Overtime Allowance" || 
                formData?.earningType === "Telephone Allowance" || formData?.earningType === "Fixed Medical Allowance") {
            updates = {
                ...updates,
                isSalaryStructure: true,
                isTaxable: true,
                isProRataBasis: true,
                showInPayslip: true,
            };
        } else if (formData?.earningType === "Bonus" || 
                formData?.earningType === "Commission" || 
                formData?.earningType === "Gift Coupon") {
            updates = {
                ...updates,
                isTaxable: true,
                isSchedule: true,
            };
        } else if (formData?.earningType === "Custom Allowance" && formData?.payType === "One Time Pay") {
            updates = {
                ...updates,
                isSchedule: true,
            };
        } else if ((formData?.payType === "Fixed Pay" || formData?.payType === "One Time Pay") &&
                formData?.earningType !== "Bonus" && 
                formData?.earningType !== "Commission" && 
                formData?.earningType !== "Custom Allowance" && 
                formData?.earningType !== "Gift Coupon") {
            updates = {
                ...updates,
                isSalaryStructure: true,
                isTaxable: true,
                showInPayslip: true,
            };
        } else {
            updates = {
                ...updates,
                isSalaryStructure: false,
                isTaxable: false,
                isProRataBasis: false,
                considerSpk: false,
                spkContribution: "",
                showInPayslip: true,
            };
            if (!dataEarning) {
                updates.amount = 0;
                updates.maxAmount = 0;
            }
        }

        setFormData(prev => ({
            ...prev,
            ...updates
        }));
    }, [formData?.earningType, dataEarning]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if(name == "isFBPComponent" && checked){
            setFormData(prev => ({
                ...prev,
                restrictFBPOverride: false
            }));
        }
        if(name == "amount"){
            setFormData(prev => ({
                ...prev,
                maxAmount: 0
            }));
        }
        if(name == "maxAmount"){
            setFormData(prev => ({
                ...prev,
                amount: 0
            }));
        }
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEarningTypeSelect = (type) => {
        setFormData((prev) => ({
            ...prev,
            earningType: type
        }));
        setDropdownOpen(false);
        setSearchQuery('');
    };

    const handleNewCustomAllowance = () => {
        const newAllowanceName = prompt('Enter new custom allowance name:');
        if (newAllowanceName && newAllowanceName.trim()) {
            setFormData((prev) => ({
                ...prev,
                earningType: newAllowanceName.trim()
            }));
        }
        setDropdownOpen(false);
        setSearchQuery('');
    };

    const filteredEarningTypes = salaryComponentEarningType.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = async () => {
        const access_token = localStorage.getItem("accessToken");
        let response;
        try {
            if(!isCreate && dataEarning?.uuid){
                response = await updateSalaryComponent(formData, access_token, "earning", dataEarning?.uuid);
            }else{
                response = await createSalaryComponent(formData, access_token, "earning");
            }
            if(response){
                await fetchSalaryComponent(access_token, "earning");
                toast(<CustomToast message={response} status={"success"} />, {
                    autoClose: 3000,
                    closeButton: false,
                    hideProgressBar: true,
                    position: "top-center",
                    style: {
                        background: 'transparent',
                        boxShadow: 'none',
                        padding: 0
                    }
                });
                handleCancel();
            }
        } catch (error) {
            toast(<CustomToast message={error.message || "Failed to save salary component"} status={"error"} />, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                style: {
                    background: 'transparent',
                    boxShadow: 'none',
                    padding: 0
                }
            });
        }
    };

    const handleCancel = () => {
        setFormData({
            earningType: '',
            earningName: '',
            nameInPayslip: '',
            payType: '',
            calculationType: '',
            amount: 0,
            customFormula: '',
            isActive: false,
            isSchedule: false,
            isSalaryStructure: false,
            isTaxable: false,
            taxDeductionPreference: '',
            isProRataBasis: false,
            considerSpk: false,
            spkContribution: '',
            showInPayslip: true
        });
        setShowForm("");
        setIsCreate(false);
    };

    return (
        <div className="w-full h-full flex flex-col bg-white rounded-lg overflow-y-auto">
            <HeaderReusable title={`${!isCreate ? "Update" : "New"} ${showForm}`} />
            
            <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="space-y-6">
                    {/* Earning Type Section */}
                    <div className="flex items-start gap-6 border-b pb-6">
                        <div className="w-[420px]">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Earning Type
                            </label>
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-full border-l-[5px] border-l-red-600 bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 flex items-center justify-between"
                                >
                                    <span>{formData.earningType || 'Select'}</span>
                                    <span>▼</span>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-blue-400 rounded mt-1 shadow-lg z-10">
                                    
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        
                                        <div className="max-h-48 overflow-y-auto">
                                            {filteredEarningTypes.map((item, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleEarningTypeSelect(item)}
                                                    className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                            <button
                                                onClick={handleNewCustomAllowance}
                                                className="w-full px-3 py-2 text-sm text-left text-blue-600 hover:bg-gray-100 flex items-center gap-2 border-t border-gray-200"
                                            >
                                                <Plus size={16} />
                                                New Custom Allowance
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {formData.earningType && (formData?.earningType !== "Bonus" 
                        && formData?.earningType !== "Commission" 
                        && formData?.earningType !== "Custom Allowance" 
                        && formData?.earningType !== "Gift Coupon") && (
                            <div className="mt-6 flex items-center gap-2 bg-blue-50 text-sm text-gray-600 px-4 py-2 rounded-md">
                                <Info size={16} />
                                <span>Fixed amount paid at the end of every month.</span>
                            </div>
                        )}
                    </div>
                    
                    {formData?.earningType && (
                        (formData?.earningType !== "Bonus" 
                        && formData?.earningType !== "Commission" 
                        && formData?.earningType !== "Custom Allowance" 
                        && formData?.earningType !== "Gift Coupon") ? (
                            <FormEarningDefault 
                                formData={formData} 
                                setFormData={setFormData} 
                                handleInputChange={handleInputChange} 
                                earningType={formData?.earningType} 
                            />
                        ) : formData?.earningType === "Custom Allowance" ? (
                            <FormCustomAllowance 
                                formData={formData} 
                                setFormData={setFormData} 
                                handleInputChange={handleInputChange} 
                            />
                        ) : (formData?.earningType === "Bonus" 
                        || formData?.earningType === "Commission" 
                        || formData?.earningType === "Gift Coupon") ? (
                            <FormCustomBonus 
                                formData={formData} 
                                setFormData={setFormData} 
                                handleInputChange={handleInputChange} 
                                earningType={formData?.earningType} 
                            />
                        ) : (
                            <></>
                        )
                    )}

                    {formData?.earningType && (
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md text-sm text-gray-700">
                            <strong>Note:</strong> As you've already associated this component with one or more employees, you can only edit the Name and Amount/Percentage. The changes made to Amount/Percentage will apply only to new employees.
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t flex items-center gap-4">
                <button
                    disabled={loading || !formData?.earningName}
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm font-medium"
                >
                    Save
                </button>

                <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
                >
                    Cancel
                </button>

                <span className="ml-auto text-sm text-red-600 align-middle">
                    | Indicates Mandatory Fields.
                </span>
            </div>
        </div>
    );
}

export default FormEarningSalaryComponents;