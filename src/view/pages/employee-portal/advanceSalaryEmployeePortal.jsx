import { useEffect } from "react";
import loanStoreManagements from "../../../store/tdPayroll/loan";
import authStoreManagements from "../../../store/tdPayroll/auth";
import { checkPermission } from "../../../../helper/globalHelper";
import LoanListEmployeePortal from "../../component/loan/loanListEmployeePortal";

function AdvanceSalaryEmployeePortal({ employeeUuid = null }) {
    const { loanDataByUuid, getLoanByUuid } = loanStoreManagements();
    const { user } = authStoreManagements();

    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        getLoanByUuid(access_token, employeeUuid, employeeUuid ? "admin-portal" : "employee-portal-advance-salary", employeeUuid ? true : null);
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
                                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500">No loans found</p>
                                    <p className="text-gray-400 text-sm">You don't have any active loans</p>
                                </div>
                            </div>
                        ) : (

                            <LoanListEmployeePortal
                                isAdvance={true}
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

export default AdvanceSalaryEmployeePortal;