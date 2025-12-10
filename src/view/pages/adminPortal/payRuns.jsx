import { useState } from "react";
import { payRundummyData, payRunHeaders, tabsPayRuns } from "../../../../data/dummy";
import HeaderReusable from "../../component/setting/headerReusable";
import RunPayroll from "../../component/payruns/runPayroll";
import TableReusable from "../../component/setting/tableReusable";
import PaginationPages from "../../component/paginations";
import FormPayRuns from "../../component/payruns/formPayRuns";
import payrunStoreManagements from "../../../store/tdPayroll/payrun";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { CustomToast } from "../../component/customToast";
import { useNavigate } from "react-router-dom";
import PriorPayrunPages from "../../component/payruns/priorPayrunPage";
import authStoreManagements from "../../../store/tdPayroll/auth";
import { checkPermission } from "../../../../helper/globalHelper";
import payScheduleStoreManagements from "../../../store/tdPayroll/setting/paySchedule";

function PayRuns() {
  const { getPayrunData, payrunDataHistory, payrunThisMonth, createPayrun, deletePayrunHistory } = payrunStoreManagements();
  const { fetchPaySchedule, payScheduleData } = payScheduleStoreManagements();
  const [activeTab, setActiveTab] = useState(tabsPayRuns[0]);
  const { user } = authStoreManagements();
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showPrior, setShowPrior] = useState(false);
  const [isCreatingPayrun, setIsCreatingPayrun] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!payScheduleData) {
      const params = {
        type: "prior-payroll"
      }
      fetchPaySchedule(token, params);
    }
  }, [payScheduleData]);

  useEffect(() => {
    if(!payrunThisMonth){
      const access_token = localStorage.getItem("accessToken");
      getPayrunData(access_token);
    }
  }, [payrunThisMonth])

  useEffect(() => {
    if(!payrunDataHistory){
      const params = {
        limit: 10, 
        page: currentPage,
      };
      const access_token = localStorage.getItem("accessToken");
      getPayrunData(access_token, params, "history");
    }
  }, [currentPage])

  const handleBack = () => {
    setShowForm(false);
  }

  const handleCreate = async () => {
    if(payrunThisMonth?.checkPayrun?.status){
      setShowForm(true);
    }else{
      setIsCreatingPayrun(true);
      try {
        const access_token = localStorage.getItem("accessToken");
        const formData = {
          paymentDate: payrunThisMonth?.dataPaySchedule?.payDate,
          numberEmployees: 0,
          taxes: 0,
          benefit: 0,
          deduction: 0,
          totalNetPay: 0,
          payrollCost: 0,
          postJournalEntries: false,
          data: payrunThisMonth
        }
        const response = await createPayrun(formData, access_token)
        if(response){
          const access_token = localStorage.getItem("accessToken");
          await getPayrunData(access_token);
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
          setShowForm(true);
        }
      } catch (error) {
        // Error handling sudah di store
      } finally {
        setIsCreatingPayrun(false);
      }
    }
  };
  const handleDelete = async (uuid) => {
      const access_token = localStorage.getItem("accessToken");
      const response = await deletePayrunHistory(access_token, uuid);
      if(response){ 
          const params = {
            limit: 10, 
            page: currentPage,
          };
          await getPayrunData(access_token, params, "history");
          await getPayrunData(access_token);
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
      }
    }
  return (
    <div className="w-full h-full pt-4 flex-col flex items-start justify-start relative">
      {!showPrior ? (   
        <div className="w-full h-full pt-12">
          {checkPermission(user, "Payroll Run", "View") ? (
            !showForm ? (
              <>
                <HeaderReusable title="Pay Runs" tabs={tabsPayRuns} activeTab={activeTab} setActiveTab={setActiveTab} needTabs={true} isAddData={(activeTab == "Payroll History" && payScheduleData)} addDataTitle="Prior Payroll" handleShowModal={() => setShowPrior(true)} />
                {activeTab === "Run Payroll" && (
                  <RunPayroll setShowForm={setShowForm} handleCreate={handleCreate} isCreatingPayrun={isCreatingPayrun} />
                )}
                {activeTab === "Payroll History" && (
                  <>
                    <TableReusable dataHeaders={payRunHeaders} dataTable={payrunDataHistory?.list} tableFor={"payrollHistory"} handleDelete={handleDelete} />
                    <div className="w-full absolute bottom-5 flex items-center justify-end">
                      <PaginationPages totalPages={payrunDataHistory?.totalPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    </div>
                  </>
                )}
              </>
            ) :(
              <FormPayRuns handleBack={handleBack} />
            )
          ) : (
            <p>No data available</p>
          )}
        </div>
      ) : (
        <PriorPayrunPages setShowPrior={setShowPrior} />
      )}
    </div>
  );
}

export default PayRuns;