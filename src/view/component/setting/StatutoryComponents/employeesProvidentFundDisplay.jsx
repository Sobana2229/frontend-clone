import { useState, useEffect, useCallback } from 'react';
import { Pencil, Check, X, TrashIcon, Eye, NotePencil } from '@phosphor-icons/react';
import ViewSplitUpPopUp from './viewSplitUpPopUp';
import { subComponentsEmployee, subComponentsEmployer } from '../../../../../data/dummy';
import statutoryComponentStoreManagements from '../../../../store/tdPayroll/setting/statutoryComponent';
import taxStoreManagements from '../../../../store/tdPayroll/setting/tax';
import { toast } from "react-toastify";

function EmployeesProvidentFundDisplay({data, setShowForm, setIsEdit}) {
    const { fetchStatutoryComponent, updateStatutoryComponent } = statutoryComponentStoreManagements();
    const { fetchTax, taxCompanyData, taxIndividualData } = taxStoreManagements();
    const [showSplitupEmployee, setShowSplitupEmployee] = useState(false);
    const [showSplitupEmployer, setShowSplitupEmployer] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showSpkCalculation, setShowSpkCalculation] = useState(false);
    const [tapNumber, setTapNumber] = useState('');
    const [scpNumber, setScpNumber] = useState('');

    // Fetch tax data on mount to ensure we have latest data
    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        fetchTax(access_token, "company");
        fetchTax(access_token, "individual");
    }, []);

    // Re-fetch tax data when component data changes
    // This ensures display always shows the latest tax configuration after updates
    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        // Re-fetch to ensure we have the latest tax data after any updates
        // Store reactivity will also handle updates, but re-fetch ensures data is fresh
        fetchTax(access_token, "company");
        fetchTax(access_token, "individual");
    }, [data]); // Re-fetch when SPK data changes (which might indicate tax was updated)

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

    // Always override TAP and SCP from tax detail
    useEffect(() => {
        const accountNumbers = getTaxAccountNumbers();
        setTapNumber(accountNumbers.tapAccountNo);
        setScpNumber(accountNumbers.scpAccountNo);
    }, [getTaxAccountNumbers]);
    
    const epfData = [
        {
            label: "TAP Number",
            value: tapNumber || ""
        },
        {
            label: "SCP Number",
            value: scpNumber || ""
        },
        {
            label: "Deduction Cycle",
            value: data?.deductionCycle || "Monthly"
        },
        {
            label: "Employee Contribution Rate",
            value: "8.5% of Actual Basic Wage",
            hasPopUp: true,
            popUpType: 'employee'
        },
        {
            label: "Employer Contribution Rate",
            value: "10.5% of Actual Basic Wage",
            hasPopUp: true,
            popUpType: 'employer'
        },
        // New fields added based on the image
        {
            label: "Admin Charges",
            value: "✓",
            isCheckmark: data?.isAdminCharges ? true : false
        },
        {
            label: "Pro-rate Restricted Basic Wage",
            value: "✓",
            isCheckmark: data?.proRateRestrictedPF ? true : false
        },
        {
            label: "Salary Component",
            value: "✓",
            isCheckmark: data?.considerAllComponents ? true : false
        }
    ];
    const calculateSPK = () => {
        const pfWage = 600;
        const employeeContribution = Math.round(pfWage * 0.085);
        const employerContribution = Math.round(pfWage * 0.105);
        const adminCharges = data?.adminFee; // Added admin charges
        const total = employeeContribution + employerContribution + adminCharges;

        return {
            pfWage,
            employeeContribution,
            employerContribution,
            adminCharges,
            total
        };
    };
    const calculation = calculateSPK();

    const handlePopUpClick = (popUpType) => {
        if (popUpType === 'employee') {
            setShowSplitupEmployee(true);
        } else if (popUpType === 'employer') {
            setShowSplitupEmployer(true);
        }
    };

    const handleUpadate = async () => {
        const body = {
            tapNumber: data?.tapNumber,
            scpNumber: data?.scpNumber,
            deductionCycle: data?.deductionCycle,
            isEnable: false
        }
        const access_token = localStorage.getItem("accessToken");
        const response = await updateStatutoryComponent(body, access_token, "spk", data?.uuid);
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

    return (
        <>
            <div className="w-full flex items-start justify-between px-5">
                <div className="w-[55%] bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-start space-x-5 pt-5 px-5">
                        <h2 className="text-3xl font-semibold text-blue-td-600">Skim Persaraan Kebangsaan</h2>
                        <button onClick={() => {
                            setShowForm(true)
                            setIsEdit(true);
                        }} className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                            <NotePencil size={30} />
                        </button>
                    </div>

                    {/* Data Table */}
                    <div className="p-5 border-r border-[#FFE2B8]">
                        <div className="space-y-4">
                            {epfData.map((item, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                                    {/* Label Column */}
                                    <div className="text-sm text-gray-600">
                                        <div className="font-medium">{item.label}</div>
                                        {item.subLabel && (
                                            <div className="text-xs text-gray-500 mt-1">{item.subLabel}</div>
                                        )}
                                    </div>

                                    {/* Value Column */}
                                    <div className="text-sm text-gray-900">
                                        <div className="font-medium flex items-center justify-start space-x-5 relative">
                                            {item.isCheckmark ? (
                                                <span className="text-green-600 text-lg">✓</span>
                                            ) : (
                                                <span>{item.value}</span>
                                            )}
                                            {item.hasPopUp && (
                                                <>
                                                    <button 
                                                        onClick={() => handlePopUpClick(item.popUpType)}
                                                        className="text-blue-600 text-xs hover:underline ml-2">
                                                        (View Splitup)
                                                    </button>
                                                    {((item.popUpType === 'employee' && showSplitupEmployee) || 
                                                      (item.popUpType === 'employer' && showSplitupEmployer)) && (
                                                        <div className="relative">
                                                            <ViewSplitUpPopUp 
                                                                setShowSplitup={item.popUpType === 'employee' ? setShowSplitupEmployee : setShowSplitupEmployer} 
                                                                subComponents={item.popUpType === 'employee' ? subComponentsEmployee : subComponentsEmployer}
                                                                isEmployee={item.popUpType === 'employee'}
                                                                isDisplay={true}
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Disable TAP Button */}
                        {/* <div className="pt-6 border-t border-gray-200 mt-6">
                            <button onClick={handleUpadate} className="text-blue-600 text-sm font-medium hover:underline flex items-center justify-start space-x-2">
                                <TrashIcon size={16}/> <span>Disable TAP</span>
                            </button>
                        </div> */}
                    </div>
                </div>
                
                {/* Right Column - Sample Calculation */}
                <div className="w-[40%]">
                    <div className="bg-[#FFF3E0] rounded-lg shadow-sm p-6 h-fit mt-10">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Sample SPK Calculation</h3>
                        <p className="text-base text-gray-600 mb-6">
                            Let's assume the wage is ${calculation.pfWage.toLocaleString()}. The breakup of contribution will be:
                        </p>

                        <div className="space-y-4 bg-[#FFB85C] p-3 rounded-md">
                            <div className="border-b border-[#FFD08F] pb-2 px-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Employee's Contribution</h4>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">SPK (8.5% of ${calculation.pfWage.toLocaleString()})</span>
                                    <span className="font-medium">${calculation.employeeContribution.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="px-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Employer's Contribution</h4>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">SPK (10.5% of ${calculation.pfWage.toLocaleString()})</span>
                                        <span className="font-medium">${calculation.employerContribution.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {data?.adminFee && (
                                <div className="border-b border-[#FFD08F] pb-2">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm px-4">
                                            <span className="text-gray-600">SPK Admin Charges</span>
                                            <span className="font-medium">
                                                ${data?.adminFee.toLocaleString()}
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
                            {/* <button
                                onClick={() => setShowSpkCalculation(true)}
                                className="text-xs text-blue-600 hover:underline flex items-center space-x-2"
                            >
                                <Eye size={14} />
                                <span>Preview SPK Calculation</span>
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* SPK Calculation Modal */}
            {showSpkCalculation && (
                <SpkStatutoryCalculation setShowForm={setShowSpkCalculation} />
            )}
        </>
    );
}

export default EmployeesProvidentFundDisplay;