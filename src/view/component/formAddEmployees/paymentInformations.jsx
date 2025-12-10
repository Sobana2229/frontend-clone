import { useState } from "react";
import ButtonReusable from "../buttonReusable";
import employeeStoreManagements from "../../../store/tdPayroll/employee";
import { CustomToast } from "../customToast";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentInformations({cancel, isAdding, uuid, setStepComplated}) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { updateEmployee, fetchEmployeePersonalDetail, fetchEmployeeList, resetTempData } = employeeStoreManagements();
    const [paymentMethod, setPaymentMethod] = useState("bank");
    const [bankDetails, setBankDetails] = useState({
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      reEnterAccountNumber: "",
      accountType: "savings"
    });
  
    const handleBankDetailsChange = (e) => {
      const { name, value } = e.target;
      setBankDetails(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handlePaymentMethodChange = (method) => {
      setPaymentMethod(method);
    };

    const handleSubmit = async () => { 
        // Validation untuk Bank Transfer
        if (paymentMethod === "Bank Transfer") {
            if (!bankDetails.accountHolderName || bankDetails.accountHolderName.trim() === "") {
                toast(<CustomToast message="Account Holder Name is required" status={"error"} />, {
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

            if (!bankDetails.bankName || bankDetails.bankName.trim() === "") {
                toast(<CustomToast message="Bank Name is required" status={"error"} />, {
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

            if (!bankDetails.accountNumber || bankDetails.accountNumber.trim() === "") {
                toast(<CustomToast message="Account Number is required" status={"error"} />, {
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

            if (!bankDetails.reEnterAccountNumber || bankDetails.reEnterAccountNumber.trim() === "") {
                toast(<CustomToast message="Please re-enter Account Number" status={"error"} />, {
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

            // Validation: accountNumber harus sama dengan reEnterAccountNumber
            if (bankDetails.accountNumber !== bankDetails.reEnterAccountNumber) {
                toast(<CustomToast message="Account numbers do not match" status={"error"} />, {
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
        }

        const access_token = localStorage.getItem("accessToken");
        const params = {
            isPaymentInformation: true,
        };
        
        // Format sesuai backend - wrap dalam personalDetailPaymentInformation
        const formData = {
            personalDetailPaymentInformation: {
                paymentMethod: paymentMethod,
                bankName: bankDetails.bankName,
                accountHolderName: bankDetails.accountHolderName,
                accountNumber: bankDetails.accountNumber,
                accountType: bankDetails.accountType,
            }
        };
        
        const response = await updateEmployee(formData, access_token, uuid, params);
        if(response){
            await fetchEmployeePersonalDetail(access_token, uuid, "payment-information");
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
            if (pathname == "/add-employees") {
                setStepComplated(prev => {
                    if (!prev.includes(4)) {
                        return [...prev, 4];
                    }
                    return prev;
                });
                // ✅ Reset tempDataNewEmployee when all steps are completed
                resetTempData();
                // ✅ Refresh employee list before navigate to show updated stepComplated
                const access_token = localStorage.getItem("accessToken");
                await fetchEmployeeList(access_token, {
                    limit: 10,
                    page: 1
                });
                navigate("/employees");
            }
        }
    };
    return (
        <>
        <div className={`${isAdding ? "w-full px-20" : "w-[60%]"} h-fit flex flex-col items-center justify-center pt-10 space-y-10`}>
            <h1 className="font-semibold text-left w-full border-b pb-5">How would you like to pay this employee?<span className="text-blue-500">*</span></h1>
            {/* Payment Method Options */}
            <div className="w-full space-y-5">
            {/* Bank Transfer Option */}
            <div 
                className="flex items-center justify-between border-b pb-5 cursor-pointer"
                onClick={() => handlePaymentMethodChange("Bank Transfer")}
            >
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 8L12 4L21 8V20H3V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M12 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M7 12V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M17 12V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-medium">Bank Transfer (Manual Process)</h3>
                        <p className="text-gray-500 text-sm">Download Bank Advice and process the payment through your bank's website</p>
                    </div>
                </div>
                <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentMethod === "Bank Transfer" ? "bg-blue-500" : "bg-gray-200"}`}
                >
                {paymentMethod === "Bank Transfer" && (
                    <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                )}
                </div>
            </div>
            {/* Bank Form Fields - Only show if bank transfer is selected */}
            {paymentMethod === "Bank Transfer" && (
                <div className="w-full space-y-6 py-4">
                {/* Account Holder Name */}
                <div className="w-full">
                    <label className="block mb-2 font-medium">
                    Account Holder Name<span className="text-blue-500">*</span>
                    </label>
                    <input
                    type="text"
                    name="accountHolderName"
                    value={bankDetails.accountHolderName}
                    onChange={handleBankDetailsChange}
                    className="w-full p-3 border rounded-md"
                    placeholder="Enter account holder name"
                    />
                </div>

                {/* Bank Name */}
                <div className="w-full">
                    <label className="block mb-2 font-medium">
                    Bank Name<span className="text-blue-500">*</span>
                    </label>
                    <input
                    type="text"
                    name="bankName"
                    value={bankDetails.bankName}
                    onChange={handleBankDetailsChange}
                    className="w-full p-3 border rounded-md"
                    placeholder="Enter bank name"
                    />
                </div>

                {/* Account Number and Re-enter Account Number */}
                <div className="w-full grid grid-cols-2 gap-4">
                    <div>
                    <label className="block mb-2 font-medium">
                        Account Number<span className="text-blue-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="accountNumber"
                        value={bankDetails.accountNumber}
                        onChange={handleBankDetailsChange}
                        className="w-full p-3 border rounded-md"
                        placeholder="Enter account number"
                    />
                    </div>
                    <div>
                    <label className="block mb-2 font-medium">
                        Re-enter Account Number<span className="text-blue-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="reEnterAccountNumber"
                        value={bankDetails.reEnterAccountNumber}
                        onChange={handleBankDetailsChange}
                        className="w-full p-3 border rounded-md"
                        placeholder="Re-enter account number"
                    />
                    </div>
                </div>

                {/* IFSC and Account Type */}
                <div className="w-full grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 font-medium">
                            Account Type<span className="text-blue-500">*</span>
                        </label>
                        <div className="flex items-center space-x-6 mt-3">
                            <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="accountType"
                                value="current"
                                checked={bankDetails.accountType === "current"}
                                onChange={handleBankDetailsChange}
                                className="w-4 h-4"
                            />
                            <span>Current</span>
                            </label>
                            <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="accountType"
                                value="savings"
                                checked={bankDetails.accountType === "savings"}
                                onChange={handleBankDetailsChange}
                                className="w-4 h-4"
                            />
                            <span>Savings</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            )}

            {/* Cheque Option */}
            <div 
                className="flex items-center justify-between border-b pb-5 cursor-pointer"
                onClick={() => handlePaymentMethodChange("Cheque")}
            >
                <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                    <line x1="6" y1="14" x2="10" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="14" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-medium">Cheque</h3>
                </div>
                </div>
                <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentMethod === "Cheque" ? "bg-blue-500" : "bg-gray-200"}`}
                >
                {paymentMethod === "Cheque" && (
                    <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                )}
                </div>
            </div>

            {/* Cash Option */}
            <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => handlePaymentMethodChange("Cash")}
            >
                <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    <path d="M6 10H6.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M18 14H18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-medium">Cash</h3>
                </div>
                </div>
                <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentMethod === "Cash" ? "bg-blue-500" : "bg-gray-200"}`}
                >
                {paymentMethod === "Cash" && (
                    <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                )}
                </div>
            </div>
            </div>
            <div className="pt-5 border-t w-full flex items-center justify-start space-x-3 pb-10">
                <ButtonReusable title={"save"} action={handleSubmit} />
                <ButtonReusable title={"cancel"} action={cancel} isBLue={false} />
            </div>
        </div>
        </>
    );
}

export default PaymentInformations;