import { Eye, Pencil, TrashIcon } from "@phosphor-icons/react";
import { payrunEarningOptions, salaryComponentMonthlyMap } from "../../../../../data/dummy";
import { useState, useEffect } from "react";
import payrunStoreManagements from "../../../../store/tdPayroll/payrun";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { CustomToast } from "../../customToast";
import ReuseableInput from "../../reuseableInput";

function FormPayRunEmployeeDetail({handleView, data, setEarnings, earnings, status}) {
    const { createDetailEmployeePayrun, getPayrunData, getVariablePayEarnings } = payrunStoreManagements();
    const [variablePayOptions, setVariablePayOptions] = useState([]);
    const [showAttendanceDetails, setShowAttendanceDetails] = useState(false);
    const monthlyFields = data ? Object.keys(data).filter(key => key.endsWith('Monthly')) : [];
    const [lopDays, setLopDays] = useState(0);
    const [lopDaysInput, setLopDaysInput] = useState("0");
    const [showLopInput, setShowLopInput] = useState(false);
    const [absentDays, setAbsentDays] = useState(0);
    const [effectSpk, setEffectSpk] = useState(true);

    // **DEBUG: Replace useMemo with useState to force updates**
    const [netPayCalculation, setNetPayCalculation] = useState({
        netPay: 0,
        hasChanged: false
    });

    // ✅ Fetch Variable Pay options on mount
    useEffect(() => {
        const fetchVariablePayOptions = async () => {
            const accesstoken = localStorage.getItem('accessToken');
            if (accesstoken) {
                try {
                    const options = await getVariablePayEarnings(accesstoken);
                    setVariablePayOptions(options || []);
                } catch (error) {
                    setVariablePayOptions([]);
                }
            }
        };
        fetchVariablePayOptions();
    }, []);

    // ✅ SIMPLER: Use nullish coalescing
    useEffect(() => {
        if (data) {
            const lopDaysValue = data?.lopDays || 0;
            setLopDays(lopDaysValue);
            setLopDaysInput(lopDaysValue.toString());
            setAbsentDays(data?.payrollCalculation?.absentDays || data?.attendanceDetails?.attendanceMetrics?.absentDays || 0);
            
            // ✅ Default to true if effectSpk is undefined/null
            setEffectSpk(data?.effectSpk ?? true);
        }
    }, [data]);

    // **FORCE RECALCULATION on data or earnings change**
    useEffect(() => {
        if (!data?.payrollCalculation) {
            setNetPayCalculation({ netPay: 0, hasChanged: false });
            return;
        }

        // Set LOP Days
        if(data?.payrollCalculation?.lopDays > 0){
            const lopDaysValue = data?.payrollCalculation?.lopDays || 0;
            setLopDays(lopDaysValue);
            setLopDaysInput(lopDaysValue.toString());
            setShowLopInput(true);
        }

        // Set Absent Days
        if(data?.payrollCalculation?.absentDays > 0){
            setAbsentDays(data?.payrollCalculation?.absentDays || 0);
        } else if(data?.attendanceDetails?.attendanceMetrics?.absentDays > 0) {
            setAbsentDays(data?.attendanceDetails?.attendanceMetrics?.absentDays || 0);
        }

        // **STEP 1: Start with base net pay**
        // Note: Backend already includes bonus from SalaryDetailComponents in netPay
        let baseNetPay = data.payrollCalculation.netPay;

        // **STEP 2: Calculate bonus from SalaryDetailComponents (already included in netPay)**
        let bonusFromSalaryDetail = 0;
        let commissionFromSalaryDetail = 0;
        if (data.oneTimeEarningsFromSalaryDetail && Array.isArray(data.oneTimeEarningsFromSalaryDetail)) {
            data.oneTimeEarningsFromSalaryDetail.forEach(component => {
                const amount = parseFloat(component.amount) || 0;
                if (component.type === "Bonus") {
                    bonusFromSalaryDetail += amount;
                } else if (component.type === "Commission") {
                    commissionFromSalaryDetail += amount;
                }
            });
        }

        // **STEP 3: Subtract original earnings (from PayrunEmployeeSummary + SalaryDetailComponents)**
        // ✅ Backward compatibility: Still support hardcode earnings for old data
        const originalBonus = parseFloat(data.bonus || 0);
        const originalCommission = parseFloat(data.commission || 0);
        const originalLeaveEncashment = parseFloat(data.leaveEncashment || 0);
        const totalOriginalBonus = originalBonus + bonusFromSalaryDetail;
        const totalOriginalCommission = originalCommission + commissionFromSalaryDetail;
        
        // ✅ NEW: Calculate existing Variable Pay earnings from data
        const existingVariablePayEarnings = (data?.variablePayEarnings || [])
            .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
        
        baseNetPay -= (totalOriginalBonus + totalOriginalCommission + originalLeaveEncashment + existingVariablePayEarnings);

        // **STEP 4: Add current form earnings (user can modify PayrunEmployeeSummary values)**
        // ✅ Backward compatibility: Still support hardcode earnings for old data
        const formBonus = parseFloat(earnings.find(e => e.type === 'bonus')?.amount || 0);
        const formCommission = parseFloat(earnings.find(e => e.type === 'commission')?.amount || 0);
        const formLeaveEncashment = parseFloat(earnings.find(e => e.type === 'leaveEncashment')?.amount || 0);
        
        // ✅ NEW: Calculate Variable Pay earnings from form (primary method)
        const formVariablePayEarnings = earnings
            .filter(e => e.componentUuid && e.amount)
            .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

        // **STEP 5: Add back bonus from SalaryDetailComponents (read-only, always included)**
        // ✅ Include Variable Pay earnings in calculation (primary)
        // ✅ Still include hardcode earnings for backward compatibility
        const newNetPay = baseNetPay + formBonus + formCommission + formLeaveEncashment + 
                         formVariablePayEarnings + 
                         bonusFromSalaryDetail + commissionFromSalaryDetail;
        const hasChanged = Math.abs(newNetPay - data.payrollCalculation.netPay) > 0.01;
        
        setNetPayCalculation({
            netPay: newNetPay,
            hasChanged
        });

    }, [data, earnings]); // Dependencies: data and earnings

    useEffect(() => {
        if (data) {
            const existingEarnings = [];
            
            // ✅ NEW: Only add Variable Pay earnings from data (primary method)
            // ✅ Backward compatibility: Hardcode earnings (bonus/commission/leaveEncashment) 
            //    are still supported in calculation but not shown in dropdown
            if (data.variablePayEarnings && Array.isArray(data.variablePayEarnings)) {
                data.variablePayEarnings.forEach(vpEarning => {
                    existingEarnings.push({
                        componentUuid: vpEarning.componentUuid,
                        componentName: vpEarning.earningName,
                        amount: vpEarning.amount?.toString() || "0"
                    });
                });
            }
            
            setEarnings(existingEarnings);
        } else {
            setEarnings([]);
        }
    }, [data]);

    const handleAddRow = () => {
        // ✅ Allow unlimited Variable Pay earnings (no limit of 3)
        setEarnings(prev => [...prev, { componentUuid: "", amount: "" }]);
    };

    const handleChange = (idx, field, value) => {
        setEarnings(prev =>
            prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
        );
    };

    const handleRemoveRow = (idx) => {
        setEarnings(prev => prev.filter((_, i) => i !== idx));
    };

    const getAvailableOptions = (currentIdx) => {
        // ✅ Only show Variable Pay Custom Allowance options (dynamic, not hardcode)
        const selectedComponentUuids = earnings
            .map((row, idx) => idx !== currentIdx ? row.componentUuid : null)
            .filter(uuid => uuid && uuid !== "");
        
        // ✅ Filter out already selected Variable Pay options
        return variablePayOptions.filter(option => !selectedComponentUuids.includes(option.value));
    };

    // ✅ Check if there are any available options left (for hiding "Add Earning" button)
    const hasAvailableOptions = () => {
        const selectedComponentUuids = earnings
            .map(row => row.componentUuid)
            .filter(uuid => uuid && uuid !== "");
        
        // Check if there are any options that haven't been selected
        return variablePayOptions.some(option => !selectedComponentUuids.includes(option.value));
    };

    const handleSubmit = async () => {
        const originalAbsentDays = data?.payrollCalculation?.originalAbsentDays || 
                                data?.attendanceDetails?.attendanceMetrics?.originalAbsentDays || 
                                0;

        if (absentDays > originalAbsentDays) {
            toast(<CustomToast 
                message={`Absent days (${absentDays}) cannot exceed original absent days (${originalAbsentDays})`} 
                status="error" 
            />, {
                autoClose: 3000,
                position: 'top-center',
                hideProgressBar: true,
                closeButton: false
            });
            return;
        }

        const formData = {
            data,
            earnings,
            lopDays,
            absentDays: (absentDays < originalAbsentDays) ? absentDays : null,
            effectSpk: effectSpk // ✅ Include effectSpk
        };

        const accesstoken = localStorage.getItem('accessToken');
        const response = await createDetailEmployeePayrun(formData, accesstoken, data?.Employee?.uuid);
        
        if (response) {
            toast(<CustomToast message={response} status="success" />, {
                autoClose: 3000,
                position: 'top-center',
                hideProgressBar: true,
                closeButton: false
            });
            
            await getPayrunData(accesstoken);
            handleView();
        }
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Header with Close Button */}
            <div className="w-full flex justify-between items-center relative p-6 pe-10 bg-[#f9faff]">
                {/* Employee Info */}
                <div className="flex flex-col items-start justify-start space-y-1">
                    <h3 className="text-lg font-medium text-blue-600">
                        {data?.Employee?.firstName} {data?.Employee?.middleName} {data?.Employee?.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">Emp. ID: {data?.Employee?.employeeId}</p>
                </div>
                
                {/* **ENHANCED: Real-time Net Pay with change indicator** */}
                <div className="flex flex-col items-end justify-center space-y-1">
                    <span className="text-sm text-gray-600">Net Pay</span>
                    <div className="flex items-center space-x-2">
                        <span className={`text-2xl font-normal ${netPayCalculation.hasChanged ? 'text-blue-600' : ''}`}>
                            ${netPayCalculation.netPay.toLocaleString("en-US")}
                        </span>
                        {netPayCalculation.hasChanged && (
                            <div className="flex flex-col items-end text-xs">
                                <span className="text-gray-500">Original:</span>
                                <span className="text-gray-400 line-through">
                                    ${data?.payrollCalculation?.netPay?.toLocaleString("en-US")}
                                </span>
                            </div>
                        )}
                    </div>
                    {netPayCalculation.hasChanged && (
                        <span className="text-xs text-blue-600 animate-pulse">
                            • Unsaved changes
                        </span>
                    )}
                </div>
                
                <button 
                    onClick={handleView} 
                    className="absolute top-3 right-3 font-bold text-gray-400 hover:text-gray-600"
                >
                    X
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto space-y-5 py-6">
                {/* Payable Days */}
                <div className="w-full h-fit px-6">
                    <div className="space-y-5">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Payable Days</span>
                            <span className="font-medium">{data?.payrollCalculation?.paidDays}</span>
                        </div>
                        
                        {/* Attendance Summary */}
                        {data?.attendanceDetails && (
                            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                                <h5 className="font-medium text-blue-800 text-sm">Attendance Summary</h5>
                                
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Days:</span>
                                        <span className="font-medium">{data.attendanceDetails.totalDaysInMonth}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Daily Rate:</span>
                                        <span className="font-medium">${data.attendanceDetails.dailyRate?.toFixed(2)}</span>
                                    </div>
                                </div>
                                
                                {data.attendanceDetails.attendanceMetrics && (
                                    <div className="grid grid-cols-2 gap-2 text-xs border-t pt-2">
                                        <div className="flex justify-between">
                                            <span className="text-green-600">Present:</span>
                                            <span className="font-medium">{data.attendanceDetails.attendanceMetrics.presentDays} days</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-blue-600">Weekend:</span>
                                            <span className="font-medium">{data.attendanceDetails.attendanceMetrics.weekendDays} days</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-yellow-600">Half-day:</span>
                                            <span className="font-medium">{data.attendanceDetails.attendanceMetrics.halfDays} days</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-red-600">Absent:</span>
                                            <span className="font-medium">{data.attendanceDetails.attendanceMetrics.absentDays} days</span>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="border-t pt-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">Paid Days Equivalent:</span>
                                        <span className="font-bold text-blue-700">
                                            {data.attendanceDetails.attendanceMetrics?.paidDaysEquivalent?.toFixed(1)} days
                                        </span>
                                    </div>
                                </div>

                                {data?.attendanceDetails?.attendanceData && (
                                    <button 
                                        onClick={() => setShowAttendanceDetails(true)}
                                        className="text-blue-500 text-xs underline hover:text-blue-700"
                                    >
                                        View Daily Attendance Details
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Absent Days Input Row - Always Visible */}
                        <div className="w-full flex justify-between items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Absent Days</label>
                            <div className="flex items-center justify-end space-x-2">
                                {/* Eye icon with tooltip */}
                                <div className="relative group">
                                    <Eye 
                                        size={20} 
                                        className="text-gray-500 cursor-pointer hover:text-gray-700" 
                                    />
                                    <div className="invisible group-hover:visible absolute right-full top-1/2 -translate-y-1/2 mr-2 px-3 py-1.5 text-xs text-black bg-gray-50 rounded whitespace-nowrap z-50 shadow-md border border-gray-200">
                                        <p>{`original absent days: ${data?.payrollCalculation?.originalAbsentDays}`}</p>
                                        <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-gray-50"></div>
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <ReuseableInput
                                        type="number"
                                        disabled={status !== "draft"}
                                        value={absentDays}
                                        onChange={(e) => setAbsentDays(Math.max(0, parseFloat(e.target.value) || 0))}
                                        isDays={true}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {status === "draft" && !showLopInput && (
                            <button 
                                onClick={() => setShowLopInput(true)}
                                className="text-blue-500 text-sm mb-6 flex items-center gap-1"
                            >
                                <span>+</span>
                                <span>Add LOP</span>
                            </button>
                        )}

                        {/* LOP Input Row */}
                        {showLopInput && (
                            <div className="w-full flex justify-between items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">LOP Days</label>
                                <div className="flex items-center justify-end space-x-2">
                                    <div className="w-1/2">
                                        <ReuseableInput
                                            type="number"
                                            value={lopDaysInput}
                                            disabled={status !== "draft"}
                                            min="0"
                                            max="30"
                                            onChange={(e) => {
                                                const inputValue = e.target.value;
                                                setLopDaysInput(inputValue);
                                                // Convert to number only if input is not empty
                                                if (inputValue === "" || inputValue === null || inputValue === undefined) {
                                                    setLopDays(0);
                                                } else {
                                                    const numValue = parseFloat(inputValue);
                                                    if (!isNaN(numValue) && numValue >= 0 && numValue <= 30) {
                                                        setLopDays(numValue);
                                                    } else if (numValue > 30) {
                                                        // If value exceeds 30, cap it at 30
                                                        setLopDaysInput("30");
                                                        setLopDays(30);
                                                    }
                                                }
                                            }}
                                            onBlur={(e) => {
                                                // On blur, ensure we have a valid number between 0 and 30
                                                const inputValue = e.target.value;
                                                if (inputValue === "" || inputValue === null || inputValue === undefined) {
                                                    setLopDaysInput("0");
                                                    setLopDays(0);
                                                } else {
                                                    const numValue = parseFloat(inputValue);
                                                    if (isNaN(numValue) || numValue < 0) {
                                                        setLopDaysInput("0");
                                                        setLopDays(0);
                                                    } else if (numValue > 30) {
                                                        // Cap at 30 if exceeds maximum
                                                        setLopDaysInput("30");
                                                        setLopDays(30);
                                                    } else {
                                                        setLopDaysInput(numValue.toString());
                                                        setLopDays(numValue);
                                                    }
                                                }
                                            }}
                                            isDays={true}
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            setLopDays(0);
                                            setLopDaysInput("0");
                                            setShowLopInput(false);
                                        }}
                                        className="text-red-500 hover:text-red-700 text-lg font-bold"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* {showLopInput && ( */}
                            <>
                               {/* Effect SPK Toggle */}
                                <div className="w-full flex justify-between items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700">Effect SPK</label>
                                    <div className="flex items-center gap-2">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={effectSpk}
                                                onChange={(e) => setEffectSpk(e.target.checked)}
                                                className="sr-only peer"
                                                disabled={status !== "draft"}
                                            />
                                            <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-disabled:opacity-50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </>
                        {/* )} */}
                    </div>
                </div>

                {/* Earnings Section */}
                <div className="w-full h-fit px-6 space-y-2">
                    <div className="flex justify-between items-center border-y p-2 bg-[#FAFAFF]">
                        <h4 className="text-green-600 font-medium text-xs">(+) EARNINGS</h4>
                        <span className="text-xs text-gray-500">AMOUNT</span>
                    </div>
                    
                    <div className="space-y-3">
                        {/* Attendance-adjusted basic salary */}
                        {data?.payrollCalculation?.attendanceAdjustedBasicSalary !== undefined && (
                            <div className="bg-yellow-50 p-3 rounded-lg space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">Basic Salary (Attendance Adjusted)</span>
                                        <span className="text-xs text-gray-600">
                                            Original: ${data.payrollCalculation.originalBasicSalary?.toLocaleString("en-US")}
                                        </span>
                                    </div>
                                    <span className="font-bold text-green-600">
                                        ${data.payrollCalculation.attendanceAdjustedBasicSalary?.toLocaleString("en-US")}
                                    </span>
                                </div>
                                
                                {data.payrollCalculation.attendanceDeduction > 0 && (
                                    <div className="flex justify-between text-xs">
                                        <span className="text-red-600">Attendance Deduction:</span>
                                        <span className="text-red-600 font-medium">
                                            -${data.payrollCalculation.attendanceDeduction?.toLocaleString("en-US")}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                        
                       {monthlyFields?.map((el, idx) => {
                            // ✅ Skip basicMonthly dan fixedAllowanceMonthly (akan ditampilkan terpisah dari earnings)
                            if (!salaryComponentMonthlyMap[el] || el === 'basicMonthly' || el === 'fixedAllowanceMonthly') return null;
                            
                            const value = Number(data[el] || 0);
                            
                            // ✅ Filter: hanya tampil jika > 0
                            if (value <= 0) return null;
                            
                            // ✅ Priority: Use earningName from backend if available, fallback to mapping
                            const displayName = data?.monthlyAllowanceEarningNames?.[el] || salaryComponentMonthlyMap[el];
                            
                            return (
                                <div key={idx} className="flex justify-between">
                                    <span className="text-sm">{displayName}</span>
                                    <span className="font-medium">
                                        ${value.toLocaleString("en-US")}
                                    </span>
                                </div>
                            );
                        })}
                        
                        {/* ✅ Display Fixed Allowance from payrollCalculation.earnings (prioritas dari earnings) */}
                        {data?.payrollCalculation?.earnings?.fixedAllowance && parseFloat(data.payrollCalculation.earnings.fixedAllowance) > 0 && (
                            <div className="flex justify-between">
                                <span className="text-sm">Fixed Allowance</span>
                                <span className="font-medium">
                                    ${parseFloat(data.payrollCalculation.earnings.fixedAllowance).toLocaleString("en-US")}
                                </span>
                            </div>
                        )}
                        
                        {/* ✅ Display Custom Allowance from payrollCalculation.earnings (bukan basic) */}
                        {data?.payrollCalculation?.earnings?.customAllowance && parseFloat(data.payrollCalculation.earnings.customAllowance) > 0 && (
                            <div className="flex justify-between">
                                <span className="text-sm">Custom Allowance</span>
                                <span className="font-medium">
                                    ${parseFloat(data.payrollCalculation.earnings.customAllowance).toLocaleString("en-US")}
                                </span>
                            </div>
                        )}
                        
                        {/* ✅ Display one-time earnings from SalaryDetailComponents */}
                        {data?.oneTimeEarningsFromSalaryDetail && Array.isArray(data.oneTimeEarningsFromSalaryDetail) && data.oneTimeEarningsFromSalaryDetail.length > 0 && (
                            <>
                                {data.oneTimeEarningsFromSalaryDetail.map((component, idx) => {
                                    const amount = parseFloat(component.amount) || 0;
                                    if (amount <= 0) return null;
                                    
                                    // Use earningName if available, fallback to type
                                    const displayName = component.earningName || component.type;
                                    
                                    return (
                                        <div key={component.uuid || idx} className="flex justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{displayName}</span>
                                                {component.payoutDate && (
                                                    <span className="text-xs text-gray-500">
                                                        Scheduled: {new Date(component.payoutDate).toLocaleDateString("en-US")}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="font-medium text-green-600">
                                                ${amount.toLocaleString("en-US")}
                                            </span>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                        
                        {/* ✅ Display Variable Pay Earnings */}
                        {data?.variablePayEarnings && Array.isArray(data.variablePayEarnings) && data.variablePayEarnings.length > 0 && (
                            <>
                                {data.variablePayEarnings.map((earning, idx) => {
                                    const amount = parseFloat(earning.amount) || 0;
                                    if (amount <= 0) return null;
                                    // ✅ Only show if earningName exists (real data from backend, no hardcode)
                                    if (!earning.earningName) return null;
                                    
                                    return (
                                        <div key={earning.componentUuid || idx} className="flex justify-between">
                                            <span className="text-sm font-medium">{earning.earningName}</span>
                                            <span className="font-medium text-green-600">
                                                ${amount.toLocaleString("en-US")}
                                            </span>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>

                    {/* Dynamic earnings input rows */}
                    {earnings.map((row, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2">
                            <select
                                className="border px-2 py-1 rounded"
                                value={row.type || row.componentUuid || ""}
                                disabled={status !== "draft"}
                                onChange={e => {
                                    const selectedValue = e.target.value;
                                    // ✅ Only handle Variable Pay components (dynamic)
                                    if (selectedValue) {
                                        handleChange(idx, "componentUuid", selectedValue);
                                        handleChange(idx, "type", ""); // Clear type (no hardcode)
                                        // Set componentName for display
                                        const selectedOption = variablePayOptions.find(opt => opt.value === selectedValue);
                                        if (selectedOption) {
                                            handleChange(idx, "componentName", selectedOption.label);
                                        }
                                    } else {
                                        handleChange(idx, "componentUuid", "");
                                        handleChange(idx, "componentName", "");
                                    }
                                }}
                            >
                                <option value="">select</option>
                                {getAvailableOptions(idx).map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {row.componentUuid && (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="flex items-center justify-center space-x-1">
                                        <p>$</p>
                                        <input
                                            type="number"
                                            className="border px-2 py-1 rounded w-28 text-right"
                                            placeholder="Amount"
                                            value={row.amount}
                                            disabled={status !== "draft"}
                                            onChange={e => handleChange(idx, "amount", e.target.value)}
                                            min="0"
                                        />
                                    </div>
                                    
                                    {status === "draft" && (
                                        <button 
                                            onClick={() => handleRemoveRow(idx)}
                                            className="text-red-500 hover:text-red-700 px-2 py-1 border border-red-300 rounded"
                                        >
                                            <TrashIcon />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Show dynamic earnings total */}
                    {earnings.some(row => row.componentUuid && row.amount) && (
                        <div className="bg-green-50 p-2 rounded-lg">
                            <div className="flex justify-between text-sm">
                                <span className="text-green-700 font-medium">Additional Earnings Total:</span>
                                <span className="text-green-800 font-bold">
                                    +${earnings.reduce((sum, row) => {
                                        return row.componentUuid && row.amount ? sum + (parseFloat(row.amount) || 0) : sum;
                                    }, 0).toLocaleString("en-US")}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* ✅ Hide "Add Earning" button if all options are already used */}
                    {status === "draft" && hasAvailableOptions() && (
                        <button
                            onClick={handleAddRow}
                            className="text-blue-500 text-sm mt-3 flex items-center gap-1"
                        >
                            <span>+</span>
                            <span>Add Earning</span>
                        </button>
                    )}

                    {/* Reimbursement section */}
                    <div className="w-full h-fit space-y-2 mt-4">
                        <div className="flex justify-between items-center border-y p-2 bg-[#FAFAFF]">
                            <h4 className="text-green-600 font-medium text-xs">(+) REIMBURSEMENTS</h4>
                            <span className="text-xs text-gray-500">AMOUNT</span>
                        </div>
                        
                        <div className="space-y-2">
                            {data?.reimbursementDetails && data.reimbursementDetails.length > 0 ? (
                                data.reimbursementDetails.map((reimbursement, index) => (
                                    <div key={reimbursement.reimbursementUuid || index} className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-xs text-gray-500 ml-4 capitalize">
                                                {reimbursement?.bills?.[0]?.componentData?.nameIn || 'Component'} ({reimbursement?.claimNumber})
                                            </span>
                                            <span className="font-medium text-green-600">
                                                +${reimbursement.approvedAmount.toLocaleString("en-US")}
                                            </span>
                                        </div>

                                        {/* <div className="flex justify-between">
                                            <span className="text-sm">
                                                {reimbursement.claimNumber} - Approved Reimbursement
                                            </span>
                                            <span className="font-medium text-green-600">
                                                +${reimbursement.approvedAmount.toLocaleString("en-US")}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs text-gray-500 ml-4">
                                                Claim Date: {new Date(reimbursement.claimDate).toLocaleDateString("en-US")} 
                                                ({reimbursement.billsCount} bill{reimbursement.billsCount !== 1 ? 's' : ''})
                                            </span>
                                        </div>
                                        {reimbursement.bills && reimbursement.bills.length > 0 && (
                                            <div className="ml-6 space-y-1 border-l-2 border-gray-200 pl-2">
                                                {reimbursement.bills.map((bill, billIndex) => (
                                                    <div key={bill.billUuid || billIndex} className="text-xs text-gray-400">
                                                        <div className="flex justify-between">
                                                            <span>
                                                                Bill #{bill.billNo} - {bill.componentData?.nameIn || 'Component'}
                                                            </span>
                                                            <span>${bill.billAmount.toLocaleString("en-US")}</span>
                                                        </div>
                                                        {bill.remarks && (
                                                            <div className="text-xs text-gray-400 ml-2">
                                                                {bill.remarks}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )} */}
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500">No approved reimbursements this month</div>
                            )}
                            
                            {data?.reimbursementDetails && data.reimbursementDetails.length > 1 && (
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Total Reimbursements</span>
                                        <span className="font-bold text-green-600">
                                            +${data.totalReimbursementAmount.toLocaleString("en-US")}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Deductions Section */}
                <div className="w-full h-fit px-6 space-y-2">
                    <div className="flex justify-between items-center border-y p-2 bg-[#FAFAFF]">
                        <h4 className="text-red-600 font-medium text-xs">(-) DEDUCTIONS</h4>
                        <span className="text-xs text-gray-500">AMOUNT</span>
                    </div>
                    
                    {/* Benefits Subsection */}
                    <div className="space-y-3">
                        <h5 className="font-medium text-gray-800">Benefits</h5>
                        
                        <div className="space-y-2 ml-4">
                        {/* SPK Employee Contribution - Hide for Foreigner */}
                        {data?.Employee?.citizenCategory !== "Foreigner" && data?.benefitDetails?.employee && (
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                <span className="text-sm">{data?.benefitDetails?.employee?.name}</span>
                                <span className="font-medium">${data?.benefitDetails?.employee?.monthly?.toLocaleString("en-US")}</span>
                                </div>
                                <div className="flex justify-between">
                                <span className="text-xs text-gray-500 ml-4">{data?.benefitDetails?.employee?.description}</span>
                                </div>
                                {data?.benefitDetails?.employee?.percentage && (
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-400 ml-4">{data?.benefitDetails?.employee?.percentage} Basic of Wages</span>
                                </div>
                                )}
                            </div>
                        )}
                        
                        {/* SPK Employer Contribution - Hide for Foreigner */}
                        {data?.Employee?.citizenCategory !== "Foreigner" && (
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                <span className="text-sm">{data?.benefitDetails?.employer?.name}</span>
                                <span className="font-medium">${data?.benefitDetails?.employer?.monthly?.toLocaleString("en-US")}</span>
                                </div>
                                <div className="flex justify-between">
                                <span className="text-xs text-gray-500 ml-4">{data?.benefitDetails?.employer?.description}</span>
                                </div>
                                {data?.benefitDetails?.employer?.percentage && (
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-400 ml-4">{data?.benefitDetails?.employer?.percentage} Basic of Wages</span>
                                </div>
                                )}
                            </div>
                        )}

                        {/* Admin Charges - Show for all (including Foreigner) */}
                        {data?.benefitDetails?.admin?.monthly > 0 && (
                            <div className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-sm">{data?.benefitDetails?.admin?.name}</span>
                                    <span className="font-medium">${data?.benefitDetails?.admin?.monthly?.toLocaleString("en-US")}</span>
                                </div>
                                {data?.benefitDetails?.admin?.description && (
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500 ml-4">{data?.benefitDetails?.admin?.description}</span>
                                    </div>
                                )}
                            </div>
                        )}
                        </div>
                    </div>

                    {/* Loan */}
                    <div className="space-y-3">
                        <h5 className="font-medium text-gray-800 capitalize">deductions</h5>
                        
                        <div className="space-y-2 ml-4">
                            {data?.loanDetails && data.loanDetails.length > 0 ? (
                            data.loanDetails.map((loan, index) => (
                                <div key={index} className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-sm capitalize">{loan.loanName} {`(${loan.loanNumber})`}</span>
                                    <span className="font-medium">${loan.instalmentAmount.toLocaleString("en-US")}</span>
                                </div>
                                {/* {loan?.isPaused ? (
                                    <div className="text-sm text-gray-500">Loan Pause for this month</div>
                                ) : (
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-500 ml-4">
                                            Monthly instalment ({loan.remainingInstalments} instalments remaining)
                                        </span>
                                    </div>
                                )} */}
                                </div>
                            ))
                            ) : (
                            <div className="text-sm text-gray-500">No active loans</div>
                            )}
                        </div>
                    </div>

                    {/* Taxes Subsection */}
                    {/* <div className="space-y-3 pt-4">
                        <h5 className="font-medium text-gray-800">Taxes</h5>
                        
                        <div className="space-y-2 ml-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Income Tax</span>
                                <div className="flex space-x-2">
                                    <span className="font-medium">$0.00</span>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <Pencil />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-sm">TN Professional Tax</span>
                                <span className="font-medium pe-[6%]">$0.00</span>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Net Pay Section */}
                <div className="w-full h-fit space-y-2">
                    <div className={`px-6 py-3 ${netPayCalculation.hasChanged ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-100'}`}>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-sm">NET PAY</span>
                            <div className="flex items-center space-x-2">
                                <span className={`text-sm font-semibold ${netPayCalculation.hasChanged ? 'text-blue-600' : ''}`}>
                                    ${netPayCalculation.netPay.toLocaleString("en-US")}
                                </span>
                                {netPayCalculation.hasChanged && (
                                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                        Updated
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex space-x-5 p-5 border-t bg-white">
                {status === "draft" && (
                    <>
                        <button 
                            onClick={handleSubmit} 
                            className={`px-6 py-2 rounded-md font-medium ${
                                netPayCalculation.hasChanged 
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white animate-pulse' 
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                        >
                            {netPayCalculation.hasChanged ? 'Save Changes' : 'Save'}
                        </button>
                    </>
                )}
                <button onClick={handleView} className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-md font-medium">
                    Cancel
                </button>
            </div>

            {/* Attendance Details Modal */}
            {showAttendanceDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Daily Attendance Details</h3>
                            <button 
                                onClick={() => setShowAttendanceDetails(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-2 text-xs">
                            {Object.entries(data.attendanceDetails.attendanceData || {}).map(([date, status]) => (
                                <div 
                                    key={date} 
                                    className={`p-2 rounded text-center ${
                                        status.status === 'present' ? 'bg-green-100 text-green-800' :
                                        status.status === 'weekend' ? 'bg-blue-100 text-blue-800' :
                                        status.status === 'half-day' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}
                                >
                                    <div className="font-medium">{dayjs(date).format('DD')}</div>
                                    <div className="text-xs mt-1">
                                        {status.status === 'present' ? 'P' :
                                         status.status === 'weekend' ? 'W' :
                                         status.status === 'half-day' ? 'H' : 'A'}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">
                                        {status.isRegulated ? 'R' : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-4 text-xs text-gray-600">
                            <span className="mr-4">P = Present</span>
                            <span className="mr-4">W = Weekend</span>
                            <span className="mr-4">H = Half Day</span>
                            <span className="mr-4">A = Absent</span>
                            <span>R = Regulated</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FormPayRunEmployeeDetail;