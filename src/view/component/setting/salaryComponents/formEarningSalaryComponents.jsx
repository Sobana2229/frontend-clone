import { useEffect, useState } from "react";
import HeaderReusable from "../headerReusable";
import { Info } from "@phosphor-icons/react";
import salaryComponentStoreManagements from "../../../../store/tdPayroll/setting/salaryComponent";
import { toast } from "react-toastify";
import FormCustomAllowance from "./earning/formCustomAllowance";
import FormCustomBonus from "./earning/formBonus";
import { salaryComponentEarningType } from "../../../../../data/dummy";
import FormEarningDefault from "./earning/formEarningDefault";
import { CustomToast } from "../../customToast";
import ReuseableInput from "../../reuseableInput";

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

    useEffect(() => {
        if (isCreate) {
            // Clear dataEarning from store when creating new
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
            // When editing, merge dataEarning with default values to ensure all fields are assigned
            // For Bonus/Commission/Gift Coupon, default isSchedule to true if not set
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
        
        // Skip auto-configuration when editing (dataEarning exists)
        // Only apply minimal updates to prevent overwriting existing data
        if (dataEarning) {
            // Only update isFBPComponent and restrictFBPOverride if needed
            // Don't overwrite other fields that already exist in dataEarning
            return;
        }

        // For Custom Allowance, skip auto-configuration when payType is already set by user
        // This prevents useEffect from overriding user's payType selection
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
                // Don't force payType for Custom Allowance - let user choose
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
                isSchedule: true, // Default checked and disabled for Bonus/Commission/Gift Coupon
            };
        } else if (formData?.earningType === "Custom Allowance" && formData?.payType === "One Time Pay") {
            // ✅ Custom Allowance with One Time Pay should have isSchedule: true
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
            // Only reset amount/maxAmount if not in edit mode (dataEarning doesn't exist)
            // This prevents losing existing amount values when editing
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

    const handleSubmit = async () => {
        const access_token = localStorage.getItem("accessToken");
        let response;
        try {
            // Use isCreate flag instead of dataEarning to determine create vs update
            // This is more reliable because dataEarning might still exist from previous edit
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
        <div className="w-full h-full flex-col flex items-start justify-start bg-white rounded-lg overflow-y-auto">
            <HeaderReusable title={`${!isCreate ? "Update" : "New"} ${showForm}`} />
            
            <div className="w-full p-6 bg-white">
                <div className="space-y-6">
                    {/* Earning Type */}
                    <div className="flex items-center justify-start space-x-3 border-b pb-5">
                        <div className="w-[48%]">
                            <ReuseableInput
                                label="Earning Type"
                                id="earningType"
                                name="earningType"
                                value={formData?.earningType}
                                onChange={handleInputChange}
                                as="select"
                                isBorderLeft={true}
                            >
                                <option value="" hidden>Select</option>
                                 {salaryComponentEarningType?.map((el, idx) => (
                                    <option key={idx} value={el}>{el}</option>
                                ))}
                            </ReuseableInput>
                        </div>
                        {(formData?.earningType !== "Bonus" || formData?.earningType !== "Commission" || formData?.earningType !== "Custom Allowance" || formData?.earningType !== "Gift Coupon") ? (
                            <div className="h-full px-3 py-2 mt-7 flex text-sm text-gray-td-500 space-x-1 items-center justify-center bg-blue-50 rounded-md">
                                <Info />
                                <p className="">Fixed amount paid at the end of every month.</p>
                            </div>
                        ) : (
                            <></>
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
                        <>
                            {/* Note */}
                            <div className="bg-orange-200 rounded-md p-2">
                                <p className="text-sm text-gray-td-400">
                                    <strong className="text-black">Note:</strong> As you've already associated this component with one or more employees, you can only edit the Name and Amount/Percentage. The changes made to Amount/Percentage will apply only to new employees.
                                </p>
                            </div>
                        </>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between space-x-3 pt-4 border-t">
                        <div className="flex items-center justify-start space-x-3">
                            <button
                                type="button"
                                disabled={loading || !formData?.earningName}
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormEarningSalaryComponents;