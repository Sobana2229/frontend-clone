import FilterPage from "../filterPage";
import LoanForm from "./loanForm";
import { useEffect, useState } from "react";
import loanStoreManagements from "../../../store/tdPayroll/loan";
import TableReusable from "../setting/tableReusable";
import { advanceSalaryEmployeePortalHeaders, loanEmployeePortalHeaders, loanHeaders } from "../../../../data/dummy";
import PaginationPages from "../paginations";
import LoanDetail from "./loanDetail";
import { useNavigate } from "react-router-dom";

function LoanListEmployeePortal({ 
    isAdvance,
    processedLoans 
}) {
    const [currentPage, setCurrentPage] = useState(1);
    // const [showDetail, setShowDetail] = useState(false);
    // const [tempUuid, setTempUuid] = useState("");
    // const { getLoanByUuid, loanDataByUuid } = loanStoreManagements();

    const navigate = useNavigate();

    const handleView = async (uuid, item, type) => {
        // setTempUuid(uuid);
        // const access_token = localStorage.getItem("accessToken");
        // await getLoanByUuid(access_token, uuid)
        // setShowDetail(true);
        const target = isAdvance ? 'advance-salary' : 'loan';
        navigate(`/employee-portal/${target}/${uuid}`);
    }

    const formatCurrency = (amount) => {
        return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div 
            className={`
                w-full h-full
                flex flex-col items-start justify-start 
                bg-gray-td-100`}
            >
            {/* {showDetail ? (
                <LoanDetail
                    setShowDetail={setShowDetail}
                    setShowFormLoans={null}
                    data={loanDataByUuid?.[0]}
                    tempUuid={tempUuid}
                    handleView={handleView}
                    setIsUpdate={null}
                    setSelectedLoanData={null}
                    isAdvance={false}
                    loanNameUuid={null}
                    isLoanEmployeePortal={true}
                />
            ) : ( */}
                    <div
                        className="
                            flex-grow
                            w-full 
                            bg-gray-td-100 
                            relative overflow-y-auto overflow-hidden"
                    >
                        <TableReusable
                            dataHeaders={
                                isAdvance ? 
                                    advanceSalaryEmployeePortalHeaders:
                                    loanEmployeePortalHeaders
                            }
                            dataTable={processedLoans}
                            tableFor="loanEmployeePortal"
                            handleView={handleView}
                            formatFunction={formatCurrency}
                        />
                        <div className="w-full absolute bottom-5 flex items-center justify-end">
                            <PaginationPages
                                totalPages={processedLoans?.totalPage}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    </div>
            {/* )} */}
        </div>
    );
}

export default LoanListEmployeePortal;