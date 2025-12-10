import { useEffect, useState } from "react";
import loanStoreManagements from "../../../store/tdPayroll/loan";
import ButtonReusable from "../buttonReusable";
import { toast } from "react-toastify";
import { CustomToast } from "../customToast";
import ReuseableInput from "../reuseableInput";
import { loanPaymentModeList } from "../../../../data/dummy";

function FormRecordPaymentLoan({setShowModal, data, setData}) {
    const { createLoans, getLoanByUuid, loanPaymentHistory, loanDataByUuid} = loanStoreManagements();
    // **FormData**
    const [formData, setFormData] = useState({
        repaymentAmount: "",
        repaymentDate: "",
        paymentMode: "",
    });
    
    // ✅ Calculate initial remaining amount
    const initialRemainingAmount = (data?.loanAmount ?? 0) - (data?.amountRepaid ?? 0);
    
    // ✅ Calculate real-time remaining amount based on input
    const repaymentAmount = parseFloat(formData.repaymentAmount) || 0;
    const currentRemainingAmount = initialRemainingAmount - repaymentAmount;
    
    // ✅ Validation: Check if repayment amount exceeds remaining amount
    const isAmountExceeded = repaymentAmount > initialRemainingAmount;
    const isAmountInvalid = repaymentAmount < 0;

    // **OnChange Handler**
    const handleInputChange = (field, value) => {
        if (field && typeof field === 'object' && field.target) {
            const { name, value: targetValue } = field.target;
            // ✅ Validate repayment amount input
            if (name === 'repaymentAmount') {
                const numValue = parseFloat(targetValue) || 0;
                if (numValue > initialRemainingAmount) {
                    // Don't allow input exceeding remaining amount
                    return;
                }
            }
            setFormData(prev => ({
                ...prev,
                [name]: targetValue
            }));
        } else {
            // ✅ Validate repayment amount input
            if (field === 'repaymentAmount') {
                const numValue = parseFloat(value) || 0;
                if (numValue > initialRemainingAmount) {
                    // Don't allow input exceeding remaining amount
                    return;
                }
            }
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    // **Handle Submit - Log FormData**
    const handleSubmit = async () => {
        // ✅ Validate repayment amount before submit
        if (isAmountExceeded || isAmountInvalid || repaymentAmount <= 0) {
            toast(<CustomToast message="Repayment amount cannot exceed remaining amount or be negative" status={"error"} />, {
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
            return;
        }
        
        const payload = {
            ...formData,
            loanUuid: data.uuid,
            employeeUuid: data?.Employee?.uuid,
        }
        const access_token = localStorage.getItem("accessToken");
        const response = await createLoans(payload, access_token, "loan-payment");
        if (response) {
            // ✅ Auto fetch loan data after payment
            await getLoanByUuid(access_token, data?.uuid, "loan-payment");
            
            // ✅ Also fetch loan details (not just payment history) to get updated amountRepaid
            await getLoanByUuid(access_token, data?.uuid);
            
            // ✅ Update parent data if setData callback is provided
            if (setData) {
                // Get updated loan data from store
                const updatedLoanData = loanDataByUuid;
                if (updatedLoanData?.loanDetails) {
                    const updatedData = {
                        ...data,
                        amountRepaid: updatedLoanData.loanDetails.amountRepaid,
                        loanAmount: updatedLoanData.loanDetails.loanAmount
                    };
                    setData(updatedData);
                } else {
                    // Fallback: calculate new amountRepaid from current data + payment
                    const newAmountRepaid = (parseFloat(data?.amountRepaid) || 0) + repaymentAmount;
                    const updatedData = {
                        ...data,
                        amountRepaid: newAmountRepaid.toString()
                    };
                    setData(updatedData);
                }
            }
            
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
            setFormData({
                repaymentAmount: "",
                repaymentDate: "",
                paymentMode: "",
            });
            setShowModal(false);
        }
    };

    return (
        <div className="w-full h-full flex-col flex items-start justify-start relative space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between w-full p-4 border-b">
                <h2 className="text-lg text-gray-td-400 font-semibold">Record Repayment</h2>
                <button
                    onClick={() => setShowModal(false)}
                    className="h-5 w-5 -mt-1 text-gray-td-400 border-2 border-gray-td-400 rounded-full font-bold text-xs flex items-center justify-center"
                >
                    ✕
                </button>
            </div>
            <div className="w-full pb-5">
                <div className="w-full px-5">
                    <div className="grid grid-cols-2 items-center justify-center">
                        <h1>Repayment Amount</h1>
                        <div className="w-full">
                            <ReuseableInput
                                id="repaymentAmount"
                                name="repaymentAmount"
                                isDollar={true}
                                value={formData.repaymentAmount}
                                onChange={(e) => handleInputChange('repaymentAmount', e.target.value)}
                                placeholder="Enter repayment amount"
                                isFocusRing={false}
                                isBorderLeft={true}
                                type="number"
                                min="0"
                                max={initialRemainingAmount}
                                step="0.01"
                                borderColor={isAmountExceeded || isAmountInvalid ? "red-500" : "red-td-500"}
                            />
                            {/* ✅ Show validation error */}
                            {(isAmountExceeded || isAmountInvalid) && (
                                <p className="text-red-500 text-xs mt-1">
                                    {isAmountExceeded 
                                        ? `Amount cannot exceed remaining amount (${initialRemainingAmount.toFixed(2)})`
                                        : "Amount cannot be negative"}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full p-5">
                    <div className="grid grid-cols-2 items-center justify-center">
                        <h1>Repayment Date</h1>
                        <ReuseableInput
                            placeholder="Select date"
                            id="repaymentDate"
                            name="repaymentDate"
                            type="date"
                            value={formData.repaymentDate}
                            onChange={(e) => handleInputChange('repaymentDate', e.target.value)}
                            isFocusRing={false}
                            isBorderLeft={true}
                            borderColor={"red-td-500"}
                        />
                    </div>
                </div>
                <div className="w-full p-5">
                    <div className="grid grid-cols-2 items-center justify-center">
                        <h1>Payment Mode</h1>
                        <ReuseableInput
                            id="paymentMode"
                            name="paymentMode"
                            value={formData.paymentMode}
                            onChange={(e) => handleInputChange('paymentMode', e.target.value)}
                            as="select"
                            isFocusRing={false}
                            isBorderLeft={true}
                            borderColor={"red-td-500"}
                        >
                            <option value="">Select Payment Mode</option>
                            {loanPaymentModeList?.map((el, idx) => (
                                <option value={el} key={el}>{el}</option>
                            ))}
                        </ReuseableInput>
                    </div>
                </div>
                <div className="w-full p-5">
                    <div className="grid grid-cols-2 items-center justify-center">
                        <h1>Remaining Amount</h1>
                        <h1 className={currentRemainingAmount < 0 ? "text-red-500" : ""}>
                            {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                            }).format(Math.max(0, currentRemainingAmount))}
                        </h1>
                    </div>
                </div>
                <div className="w-full flex items-center justify-between space-x-2 pt-5 border-t px-5">
                    <div className="flex items-start justify-start space-x-2">
                        <ButtonReusable title={"save"} action={handleSubmit} />
                        <ButtonReusable title={"cancel"} action={() => setShowModal(false)} isBLue={false} />
                    </div>
                    <div className="flex items-center">
                        <span className="text-sm text-red-500">* indicates mandatory fields</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormRecordPaymentLoan;