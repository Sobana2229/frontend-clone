import { useEffect, useState, useCallback } from "react";
import ViewSplitUpPopUp from "./viewSplitUpPopUp";
import HeaderReusable from "../headerReusable";
import { subComponentsEmployee, subComponentsEmployer } from "../../../../../data/dummy";
import { Eye, Info } from "@phosphor-icons/react";
import taxStoreManagements from "../../../../store/tdPayroll/setting/tax";
import statutoryComponentStoreManagements from "../../../../store/tdPayroll/setting/statutoryComponent";
import { toast } from "react-toastify";
import ToggleAction from "../../toggle";
import Modal from "react-modal";
import SpkStatutoryCalculation from "./spkStatutoryCalculation";

function FormSpkStatutoryComponents({setShowForm, isEdit}) {
    const { fetchTax, taxCompanyData, taxIndividualData } = taxStoreManagements();
    const { createStatutoryComponent, fetchStatutoryComponent, updateStatutoryComponent, statutoryComponentSpk } = statutoryComponentStoreManagements();
    const [formData, setFormData] = useState({
        tapNumber: '',
        deductionCycle: 'Monthly',
        scpNumber: '',
        employeeContributionRate: '8.5% of Actual PF Wage',
        employerContributionRate: '12% of Actual PF Wage',
        proRateRestrictedPF: false,
        considerAllComponents: true,
        isAdminCharges: false,
        adminFee: ''
    });
    const [showPreview, setShowPreview] = useState(isEdit ? true : false);
    const [showSplitupEmployee, setShowSplitupEmployee] = useState(false);
    const [showSplitupEmployer, setShowSplitupEmployer] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showDetailCalculation, setShowDetailCalculation] = useState(isEdit ? false : true);

    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        if (isEdit) {
            // Fetch both company and individual tax data if not available
            if (!taxCompanyData) {
                fetchTax(access_token, "company");
            }
            if (!taxIndividualData) {
                fetchTax(access_token, "individual");
            }
            if (!statutoryComponentSpk) {
                fetchStatutoryComponent(access_token, "spk");
            }
        } else {
            // Fetch both company and individual tax data if not available
            if (!taxCompanyData) {
                fetchTax(access_token, "company");
            }
            if (!taxIndividualData) {
                fetchTax(access_token, "individual");
            }
        }
    }, [isEdit]);

    // Helper function to get TAP and SCP from available tax data
    // Priority: company > individual (company always takes precedence)
    // TAP and SCP must ALWAYS be overridden from tax detail, never from stored SPK data
    const getTaxAccountNumbers = useCallback(() => {
        if (taxCompanyData) {
            return {
                tapAccountNo: taxCompanyData?.tapAccountNo || '',
                scpAccountNo: taxCompanyData?.scpAccountNo || ''
            };
        } else if (taxIndividualData) {
            return {
                tapAccountNo: taxIndividualData?.tapAccountNo || '',
                scpAccountNo: taxIndividualData?.scpAccountNo || ''
            };
        }
        return { tapAccountNo: '', scpAccountNo: '' };
    }, [taxCompanyData, taxIndividualData]);

    // Always override TAP and SCP from tax detail (company or individual)
    // This ensures TAP and SCP are always synced with tax configuration
    // This runs whenever tax data changes to keep TAP/SCP in sync
    useEffect(() => {
        const accountNumbers = getTaxAccountNumbers();
        // Always override TAP and SCP from tax detail, never use stored SPK values
        setFormData(prev => ({
            ...prev,
            tapNumber: accountNumbers.tapAccountNo,
            scpNumber: accountNumbers.scpAccountNo
        }));
    }, [getTaxAccountNumbers]);

    // Load SPK data for edit mode (excluding TAP and SCP which are overridden from tax)
    useEffect(() => {
        if (isEdit && statutoryComponentSpk) {
            const accountNumbers = getTaxAccountNumbers();
            setFormData(prev => ({
                ...prev,
                // TAP and SCP always from tax detail (overridden, never from stored SPK)
                tapNumber: accountNumbers.tapAccountNo,
                scpNumber: accountNumbers.scpAccountNo,
                // Other fields from stored SPK data
                deductionCycle: statutoryComponentSpk?.deductionCycle || "Monthly",
                employeeContributionRate: '8.5% of Actual PF Wage',
                employerContributionRate: '12% of Actual PF Wage',
                proRateRestrictedPF: statutoryComponentSpk?.proRateRestrictedPF || false,
                considerAllComponents: statutoryComponentSpk?.considerAllComponents || true,
                isAdminCharges: statutoryComponentSpk?.isAdminCharges || false,
                adminFee: statutoryComponentSpk?.adminFee || ''
            }));
        }
    }, [isEdit, statutoryComponentSpk, getTaxAccountNumbers]);

    useEffect(() => {
        setShowPreview(!showPreview)
    }, [showDetailCalculation]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const calculateSPK = () => {
        const pfWage = 600;
        const employeeContribution = Math.round(pfWage * 0.085);
        const employerContribution = Math.round(pfWage * 0.105);
        const adminFee = formData?.isAdminCharges 
            ? Number(formData?.adminFee || 0) 
            : 0;
        const total = employeeContribution + employerContribution + adminFee;

        return {
            pfWage,
            employeeContribution,
            employerContribution,
            adminFee,
            total
        };
    };

    const calculation = calculateSPK();

    const handleEnable = async () => {
        const body = {
            ...formData,
            isEnable: true,
            adminFee: formData.isAdminCharges ? Number(formData.adminFee) || 0 : null
        };
        const access_token = localStorage.getItem("accessToken");
        let response;
        
        if (isEdit && statutoryComponentSpk) {
            response = await updateStatutoryComponent(body, access_token, "spk", statutoryComponentSpk?.uuid);
        } else {
            response = await createStatutoryComponent(body, access_token, "spk");
        }
        if (response) {
            await fetchStatutoryComponent(access_token, "spk");
            toast.success(response, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            });
            setShowForm(false);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
    };

    return (
        <div className="w-full h-full flex-col flex items-start justify-start bg-white rounded-md">
            {/* Your existing JSX */}
            <div className="w-full px-10 py-5">
                <h2 className="text-blue-td-500 font-semibold text-2xl">
                    {isEdit ? 'Edit Skim Persaraan Kebangsaan' : 'Skim Persaraan Kebangsaan'}
                </h2>
            </div>
            
            {/* Rest of your existing JSX... */}
            <div className="w-full flex items-start justify-between space-x-20 px-10 pb-10">
                {/* Left Column - Form Fields */}
                <div className="lg:col-span-2 bg-white">
                    {/* Input Fields in 2 Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6 border-b pb-6">
                        {/* TAP Number */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                TAP Number
                            </label>
                            <div className="w-full border-l-8 border-gray-td-400 rounded-md overflow-hidden">
                                <input
                                    type="text"
                                    disabled
                                    value={formData.tapNumber}
                                    onChange={(e) => handleInputChange('tapNumber', e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-td-400 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* SCP Number */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                SCP Number
                            </label>
                            <div className="w-full border-l-8 border-gray-td-400 rounded-md overflow-hidden">
                                <input
                                    type="text"
                                    value={formData.scpNumber}
                                    disabled
                                    onChange={(e) => handleInputChange('scpNumber', e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-td-400 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Deduction Cycle */}
                        <div>
                            <div className="text-sm font-medium mb-2 flex items-center justify-start space-x-2">
                                <p>Deduction Cycle</p>
                                <div onClick={() => setShowInfo(!showInfo)} className="text-gray-400 relative cursor-pointer">
                                    <Info />
                                    {showInfo && (
                                        <div className="absolute w-[220px] text-[10px] bottom-full -left-[103px] bg-black p-0.5 rounded-md mb-2">
                                            <span className="text-white">Provident Fund (PF) contributions for each month should be deposited to the Employee Provident Fund Organization (EPFO) within the 15th of the following month.</span>
                                            <div className="h-2 w-2 bg-black absolute -bottom-1 right-1/2 translate-x-1/2 rotate-45"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-full border-l-8 border-gray-td-400 rounded-md overflow-hidden">
                                <input
                                    type="text"
                                    disabled
                                    value={formData.deductionCycle}
                                    onChange={(e) => handleInputChange('deductionCycle', e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-td-400 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Rest of your form fields... */}
                    <div className="w-full flex flex-col space-y-6">
                        {/* Employee Contribution Rate */}
                        <div>
                            <div className="w-full text-sm font-medium flex items-center justify-between mb-2">
                                <p>Employee Contribution Rate</p>
                            </div>
                            <div className="w-full flex items-center justify-start relative">
                                <input
                                    type="text"
                                    value={formData.employeeContributionRate}
                                    disabled
                                    onChange={(e) => handleInputChange('employeeContributionRate', e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-td-300 rounded-s-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button 
                                    onClick={() => setShowSplitupEmployee(true)}
                                    className="text-blue-600 text-sm w-32 rounded-r-md border border-gray-td-300 px-3 py-2.5">
                                    View Splitup
                                </button>
                                {showSplitupEmployee && (
                                    <ViewSplitUpPopUp 
                                        setShowSplitup={setShowSplitupEmployee} 
                                        subComponents={subComponentsEmployee} 
                                        isEmployee={true} 
                                    />
                                )}
                            </div>
                        </div>

                        {/* Employer Contribution Rate */}
                        <div>
                            <div className="w-full text-sm font-medium flex items-center justify-between mb-2">
                                <p>Employer Contribution Rate</p>
                            </div>
                            <div className="w-full flex items-center justify-start relative">
                                <input
                                    type="text"
                                    value={formData.employerContributionRate}
                                    disabled
                                    onChange={(e) => handleInputChange('employerContributionRate', e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-td-300 rounded-s-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button 
                                    onClick={() => setShowSplitupEmployer(true)}
                                    className="text-blue-600 text-sm w-32 rounded-r-md border border-gray-td-300 px-3 py-2.5">
                                    View Splitup
                                </button>
                                {showSplitupEmployer && (
                                    <ViewSplitUpPopUp 
                                        setShowSplitup={setShowSplitupEmployer} 
                                        subComponents={subComponentsEmployer}
                                        isEmployee={false}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SPK Configuration when LOP Applied */}
                    <div className="my-6">
                        <h3 className="text-sm font-medium mb-4">SPK Configuration when LOP Applied</h3>
                        
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    id="isAdminCharges"
                                    type="checkbox"
                                    checked={formData.isAdminCharges}
                                    onChange={(e) => handleInputChange('isAdminCharges', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-td-300 rounded"
                                />
                                <label htmlFor="isAdminCharges" className="ml-2 text-sm">
                                    Include admin charges in employee's salary structure. 
                                </label>

                                {formData?.isAdminCharges && (
                                    <div className="">
                                        <input 
                                            type="number" 
                                            name="adminFee"
                                            id="adminFee"
                                            value={formData.adminFee}
                                            onChange={(e) => handleInputChange('adminFee', e.target.value)}
                                            className="w-20 border px-2 border-gray-td-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                            placeholder="0"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="proRateRestrictedPF"
                                    type="checkbox"
                                    checked={formData.proRateRestrictedPF}
                                    onChange={(e) => handleInputChange('proRateRestrictedPF', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-td-300 rounded"
                                />
                                <label htmlFor="proRateRestrictedPF" className="ml-2 text-sm">
                                    Pro-rate Restricted SPK Wage
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 ml-6">
                                SPK contribution will be pro-rated based on the number of days worked by the employee.
                            </p>

                            <div className="flex items-center">
                                <input
                                    id="considerAllComponents"
                                    type="checkbox"
                                    checked={formData.considerAllComponents}
                                    onChange={(e) => handleInputChange('considerAllComponents', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-td-300 rounded"
                                />
                                <label htmlFor="considerAllComponents" className="ml-2 text-sm">
                                    Consider all applicable salary components if SPK wage is less than RM5,000 after Loss of Pay
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 ml-6">
                                SPK wage will be computed using the salary earned in that particular month (based on LOP) rather than the actual amount mentioned in the salary structure.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-6 border-t">
                        <button
                            onClick={handleEnable}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            {isEdit ? 'Save' : 'Enable'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 border border-gray-td-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                {/* Right Column - Sample Calculation */}
                <div className="bg-[#FFF3E0] rounded-lg shadow-sm p-6 h-fit mt-10">
                    <div className="w-full flex items-center justify-between">
                        <h3 className="text-lg font-medium mb-4">Sample SPK Calculation</h3>
                        <ToggleAction setAction={setShowDetailCalculation} Action={showDetailCalculation} color={"orange"} />
                    </div>
                    <p className="text-sm text-gray-600 mb-6">
                        Let's assume the wage is ${calculation.pfWage.toLocaleString()}. The breakup of contribution will be:
                    </p>

                    <div className="space-y-4 bg-[#FFB85C] p-3 rounded-md">
                        <div className="border-b border-[#FFD08F] pb-2 px-4">
                            <h4 className="text-base font-medium mb-2">Employee's Contribution</h4>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">SPK (8.5% of ${calculation.pfWage.toLocaleString()})</span>
                                <span className="font-medium">${calculation.employeeContribution.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="px-4">
                            <h4 className="text-base font-medium mb-2">Employer's Contribution</h4>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">SPK (10.5% of ${calculation.pfWage.toLocaleString()})</span>
                                    <span className="font-medium">${calculation.employerContribution.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {formData?.isAdminCharges && (
                            <div className="border-b border-[#FFD08F] pb-2 px-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">SPK Admin Charges</span>
                                        <span className="font-medium">
                                            ${calculation.adminFee.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-between text-sm font-medium pt-2 px-4">
                            <span>Total</span>
                            <span>${calculation.total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-6 flex items-start justify-start space-x-2">
                        <div className="">
                            💡
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                            Do you want to preview SPK calculation for multiple cases, based on the preferences you have configured?
                        </p>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showPreview}
                contentLabel="Full Screen Modal"
                ariaHideApp={false}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1000,
                    },
                    content: {
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        border: "none",
                        backgroundColor: "transparent",
                        padding: 0,
                        margin: 0,
                        overflow: "hidden",
                    },
                }}
            >
                <SpkStatutoryCalculation setShowForm={setShowPreview} />
            </Modal>
        </div>
    );
}

export default FormSpkStatutoryComponents;