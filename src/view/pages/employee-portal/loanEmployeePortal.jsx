import { useEffect } from "react";
import loanStoreManagements from "../../../store/tdPayroll/loan";
import authStoreManagements from "../../../store/tdPayroll/auth";
import { checkPermission } from "../../../../helper/globalHelper";
import LoanListEmployeePortal from "../../component/loan/loanListEmployeePortal";

function LoanEmployeePortal({employeeUuid=null}) {
    const { loanDataByUuid, getLoanByUuid } = loanStoreManagements();
    const { user } = authStoreManagements(); 

    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        getLoanByUuid(access_token, employeeUuid, employeeUuid ? "admin-portal" : "employee-portal-loan");
    }, [employeeUuid]);

    // Process loan data from API or use dummy data
    const processLoanData = (apiData) => {
        if (!apiData) {
            // Dummy data jika belum ada data dari API
            return {
                uuid: null, // Dummy data doesn't have UUID
                totalAmount: 50000,
                amountRepaid: 10000,
                installmentAmount: 5000,
                nextInstallmentDate: "03/10/2025",
                remainingInstallments: 8000,
                closingDate: "03/06/2692",
                loanId: "LOAN-00001",
                loanType: "Employee Loan",
                employeeName: "Demo User"
            };
        }

        // Calculate next instalment date (deduction start date + number of paid instalments * 30 days)
        const deductionStart = new Date(apiData.deductionStartDate);
        const nextInstalmentDate = new Date(deductionStart);
        nextInstalmentDate.setMonth(nextInstalmentDate.getMonth() + apiData.paidOffInstalment + 1);

        // Calculate closing date (assuming monthly instalments)
        const totalInstalments = Math.ceil(parseFloat(apiData.loanAmount) / parseFloat(apiData.instalmentAmount));
        const closingDate = new Date(deductionStart);
        closingDate.setMonth(closingDate.getMonth() + totalInstalments);

        return {
            uuid: apiData.uuid, // Add UUID for navigation
            totalAmount: parseFloat(apiData.loanAmount),
            amountRepaid: parseFloat(apiData.amountRepaid),
            installmentAmount: parseFloat(apiData.instalmentAmount),
            nextInstallmentDate: nextInstalmentDate.toLocaleDateString('en-GB'),
            remainingInstallments: totalInstalments - apiData.paidOffInstalment,
            closingDate: closingDate.toLocaleDateString('en-GB'),
            loanId: apiData.loanNumber,
            loanType: apiData.LoanName?.name || "Employee Loan",
            employeeName: `${apiData.Employee?.firstName || ''} ${apiData.Employee?.middleName || ''} ${apiData.Employee?.lastName || ''}`.trim(),
            employeeId: apiData.Employee?.employeeId,
            paidInstalments: apiData.paidOffInstalment,
            disbursementDate: new Date(apiData.disbursementDate).toLocaleDateString('en-GB'),
            reason: apiData.reason
        };
    };

    // Process array of loans
    const processedLoans = Array.isArray(loanDataByUuid) ? loanDataByUuid.map(loan => {
        const processed = processLoanData(loan);
        const remainingAmount = processed.totalAmount - processed.amountRepaid;
        const completionPercentage = processed.totalAmount > 0 
            ? Math.round((processed.amountRepaid / processed.totalAmount) * 100) 
            : 0;
        
        return {
            ...processed,
            remainingAmount,
            completionPercentage
        };
    }) : [];

    return (
        <div 
            className="w-full h-full flex-col flex items-start justify-start"
        >
            {checkPermission(user, "Loan Summary", "View") ? (
                <>
                    <div 
                        className="h-full w-full bg-gray-td-100"
                    >
                        {/* Loading State */}
                        {!loanDataByUuid ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                    <p className="text-gray-500">Loading loan information...</p>
                                </div>
                            </div>
                        ) : !Array.isArray(loanDataByUuid) || loanDataByUuid.length === 0 ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                        </svg>
                                    </div>
                                    <p className="text-gray-500">No loans found</p>
                                    <p className="text-gray-400 text-sm">You don't have any active loans</p>
                                </div>
                            </div>
                        ) : (
                            // <div className="space-y-6">
                            //     {/* Loan Cards */}
                            //     {processedLoans.map((loanData, index) => (
                            //         <div key={loanData.uuid || index} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                            //         {/* Header Section */}
                            //         <div className="flex justify-between items-start mb-6">
                            //             <div>
                            //                 <div className="flex items-center gap-3 mb-2">
                            //                     <h2 className="text-2xl font-bold text-gray-900">
                            //                         ₹{loanData.totalAmount.toLocaleString()}.00
                            //                     </h2>
                            //                     <span className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium">
                            //                         OPEN
                            //                     </span>
                            //                 </div>
                            //                 <div className="flex items-center gap-2 text-gray-600">
                            //                     <span className="font-medium">{loanData.loanType}</span>
                            //                     <span>•</span>
                            //                     <span className="text-gray-500">{loanData.loanId}</span>
                            //                 </div>
                            //             </div>
                            //             <div className="text-right">
                            //                 <div className="text-gray-500 text-sm mb-1">
                            //                     {loanData.completionPercentage}% Completed
                            //                 </div>
                            //                 <div className="w-32 bg-gray-200 rounded-full h-2">
                            //                     <div 
                            //                         className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            //                         style={{ width: `${loanData.completionPercentage}%` }}
                            //                     ></div>
                            //                 </div>
                            //             </div>
                            //         </div>

                            //         {/* Stats Section */}
                            //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            //             <div>
                            //                 <h3 className="text-gray-500 text-sm font-medium mb-2">
                            //                     Instalment Amount
                            //                 </h3>
                            //                 <p className="text-2xl font-bold text-gray-900">
                            //                     ₹{loanData.installmentAmount.toLocaleString()}.00
                            //                 </p>
                            //             </div>
                            //             <div>
                            //                 <h3 className="text-gray-500 text-sm font-medium mb-2">
                            //                     Amount Repaid
                            //                 </h3>
                            //                 <p className="text-2xl font-bold text-green-500">
                            //                     ₹{loanData.amountRepaid.toLocaleString()}.00
                            //                 </p>
                            //             </div>
                            //             <div>
                            //                 <h3 className="text-gray-500 text-sm font-medium mb-2">
                            //                     Remaining Amount
                            //                 </h3>
                            //                 <p className="text-2xl font-bold text-red-500">
                            //                     ₹{loanData.remainingAmount.toLocaleString()}.00
                            //                 </p>
                            //             </div>
                            //         </div>

                            //         {/* Timeline Section */}
                            //         <div className="flex items-center gap-6 text-gray-600 bg-gray-50 p-4 rounded-lg">
                            //             <div className="flex items-center gap-2">
                            //                 <div className="w-4 h-4 bg-gray-400 rounded-sm flex items-center justify-center">
                            //                     <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                            //                         <path d="M3 0l1.5 1.5L8 0v8L6.5 6.5 8 5H0l1.5 1.5L0 8V0z"/>
                            //                     </svg>
                            //                 </div>
                            //                 <span className="text-sm">
                            //                     <strong>Next Instalment:</strong> {loanData.nextInstallmentDate}
                            //                 </span>
                            //                 <span className="text-gray-400">
                            //                     ({loanData.remainingInstallments} Remaining)
                            //                 </span>
                            //             </div>
                            //             <div className="flex items-center gap-2">
                            //                 <span>•</span>
                            //                 <span className="text-sm">
                            //                     <strong>Closing Date:</strong> {loanData.closingDate}
                            //                 </span>
                            //             </div>
                            //         </div>

                            //         {/* Additional Info */}
                            //         <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            //             <div className="flex items-center gap-2 text-blue-700 mb-2">
                            //                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            //                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                            //                 </svg>
                            //                 <span className="text-sm font-medium">
                            //                     Loan Progress: {loanData.completionPercentage}% completed
                            //                 </span>
                            //             </div>
                            //             <p className="text-blue-600 text-sm mb-1">
                            //                 You have paid ₹{loanData.amountRepaid.toLocaleString()}.00 out of ₹{loanData.totalAmount.toLocaleString()}.00
                            //             </p>
                            //             <div className="text-xs text-blue-500 mt-2 space-y-1">
                            //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            //                     <p><strong>Employee:</strong> {loanData.employeeName} ({loanData.employeeId})</p>
                            //                     <p><strong>Disbursement Date:</strong> {loanData.disbursementDate}</p>
                            //                     <p><strong>Paid Instalments:</strong> {loanData.paidInstalments}</p>
                            //                     {loanData.reason && <p><strong>Reason:</strong> {loanData.reason}</p>}
                            //                 </div>
                            //             </div>
                            //         </div>
                            //     </div>
                            //     ))}
                            // </div>

                            <LoanListEmployeePortal
                                isAdvance={false}
                                processedLoans={[
                                    ...processedLoans,
                                ]}
                            />
                                    
                        )}
                    </div>
                    
                </>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
}

export default LoanEmployeePortal;