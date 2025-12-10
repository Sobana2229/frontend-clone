import LoanEmployeePortal from "../../employee-portal/loanEmployeePortal";
import { useParams } from "react-router-dom";

function LoanEmployeeDetail({}) {
  const { id } = useParams();
  return (
    <LoanEmployeePortal employeeUuid={id} />
  );
}

export default LoanEmployeeDetail;