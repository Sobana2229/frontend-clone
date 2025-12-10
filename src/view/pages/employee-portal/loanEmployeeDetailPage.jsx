import { useParams } from "react-router-dom";
import loanStoreManagements from "../../../store/tdPayroll/loan";
import LoanDetail from "../../component/loan/loanDetail";
import { useEffect, useState } from "react";

function LoanEmployeePortalDetail() {
    const { getLoanByUuid, loanDataByUuid } = loanStoreManagements();
    const [tempUuid, setTempUuid] = useState("");
    const { id: uuid } = useParams();

    useEffect(() => {
        setTempUuid(uuid);
        const fetchLoanDetail = async () => {
            const access_token = localStorage.getItem("accessToken");
            await getLoanByUuid(access_token, uuid)
        }
        fetchLoanDetail();
    }, [uuid]);

    return (
        <LoanDetail
            data={loanDataByUuid?.[0]}
            tempUuid={tempUuid}
            handleView={null}
            setIsUpdate={null}
            setSelectedLoanData={null}
            isAdvance={false}
            loanNameUuid={null}
            isLoanEmployeePortal={true}
        />
    );
}

export default LoanEmployeePortalDetail;