import { Dot, Info } from "@phosphor-icons/react";
import DocumentPayslipEmployeePortal from "../../../component/employeePortal/document/documentPayslipEmployeePortal";
import HeaderEmployeeDetail from "../../../component/employee/headerEmployeeDetail";
import employeeStoreManagements from "../../../../store/tdPayroll/employee";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function PayAndSlipEmployeeDetail({}) {
  const { fetchEmployeePersonalDetail, dataEmployeePersonalDetail } = employeeStoreManagements();
  const { id } = useParams();
  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");
    fetchEmployeePersonalDetail(access_token, id);
  }, [id]);

  return (
    <div className={`w-full h-screen flex flex-col items-start justify-start p-5`}>
      <div className="w-full bg-white p-5 px-10 rounded-xl space-y-10">
        {dataEmployeePersonalDetail && (
          <HeaderEmployeeDetail dataEmployeePersonalDetail={dataEmployeePersonalDetail} />
        )}
        <div className="w-full flex flex-col px-10 py-5 bg-[#FFF3E0] space-y-4">
          <div className="flex items-center justify-start space-x-2">
            <Info weight="fill" size={20} className="text-[#FF8800]" />
            <p className="text-xl font-medium">Need Your Attention</p>
          </div>
          <div className="w-[90%] flex items-start justify-start space-x-4">
            <div className="mt-2.5 ms-1">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="5" cy="5" r="5" fill="#0F172A"/>
              </svg>
            </div>
            <p className="text-lg font-normal text-[#374151]">An invite has been sent to this employee to access the Employee Self Service Portal. However, the employee is yet to accept it. <span className="text-[#1F87FF]">Reinvite</span> <span className="text-[#1F87FF]">|</span> <span className="text-[#1F87FF]">Disable Portal</span></p>
          </div>
        </div>
        <div className="w-full flex">
          <DocumentPayslipEmployeePortal isAdminPortal={true} uuid={dataEmployeePersonalDetail?.Employee?.uuid} />
        </div>
      </div>
    </div>
  );
}

export default PayAndSlipEmployeeDetail;