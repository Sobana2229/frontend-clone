import { CaretLeft, DotsThree } from "@phosphor-icons/react";
import { tabOverviewEmployees } from "../../../../../data/dummy";
import { useEffect, useState } from "react";
import TabNavigation from "../../../component/setting/tabNavigation";
import OverviewEmployeePages from "./overviewEmployeePages";
import InvestmentEmployeeDetail from "./investmentEmployeeDetail";
import LoanEmployeeDetail from "./loanEmployeeDetail";
import SalaryEmployeeDetail from "./salaryEmployeeDetail";
import PayAndSlipEmployeeDetail from "./payAndSlipEmployeeDetail";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import zohoStore from "../../../../store/zohoStoreManagement";
import LoadingIcon from "../../../component/loadingIcon";

function DetailEmployeePages() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tabOverviewEmployees[0]);
  const { fetchZohoEmployeeById, loading, error, dataEmployeeById } = zohoStore();
  const {pathname} = useLocation();
  const { id } = useParams();
  
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("zoho_access_token");
      await fetchZohoEmployeeById(token, id);
    };
  
    fetchData();
  }, [pathname, id]);

  return (
    <div className={`w-full h-screen flex flex-col items-start justify-start pt-12`}>
      <div className="w-full px-10 py-5 flex items-center justify-between">
        <div className="w-full flex items-center justify-between">
          <button onClick={() => navigate(`/employees`)} className="flex items-center justify-start space-x-3">
            <div className="w-7 h-7 rounded-full bg-[#EBF1FB] flex items-center justify-center text-[#2C75D1] font-extrabold text-xl">
              <CaretLeft />
            </div>
            <h1 className="text-xl">{dataEmployeeById?.["First Name"]}</h1>
          </button>
          <button><DotsThree /></button>
        </div>
      </div>
      <div className="w-full px-10 border-b-[1px]">
        <TabNavigation tabs={tabOverviewEmployees} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
        {loading ? 
        (
          <div className="w-full h-full flex items-center justify-center">
            <div className="h-20 w-20">
              <LoadingIcon color="#3F8DFB" />
            </div>
          </div>
        ):(
          <>
            {activeTab === "Overview" && <OverviewEmployeePages data={dataEmployeeById} />}
            {activeTab === "Salary Details" && <SalaryEmployeeDetail />}
            {activeTab === "Investments" && <InvestmentEmployeeDetail />}
            {activeTab === "Payslips & Forms" && <PayAndSlipEmployeeDetail />}
            {activeTab === "Loans" && <LoanEmployeeDetail />}
          </>
        )}
    </div>
  );
}

export default DetailEmployeePages;