import { TimerIcon } from "@phosphor-icons/react";
import HeaderReusable from "../setting/headerReusable";
import { useState } from "react";
import { payRunEmployeedummyData, payRunEmployeeHeaders, payrunOptionDraft } from "../../../../data/dummy";
import TableReusable from "../setting/tableReusable";
import PaginationPages from "../paginations";
import FormPayRunEmployeeDetail from "./form/formPayRunEmployeeDetail";
import Modal from "react-modal";
import FormModal from "../formModal";
import payrunStoreManagements from "../../../store/tdPayroll/payrun";
import { useEffect } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CustomToast } from "../customToast";
import SimpleModalMessage from "../simpleModalMessage";
import FormInitiateExit from "./formInitiateExit";
import FormDetailDownload from "./form/formDetailDownload";

function FormPayRuns({ handleBack }) {
  const navigate = useNavigate();
  const { payrunThisMonth, getPayrunData, getDetailEmployeePayrun, payrunEmployee, createPayrun, deleteDetailEmployeePayrun, changeActiveTab, changeStatusEmployee, getPoiExitPayrun, payrunDataExitEmployeePoi } = payrunStoreManagements();
  const [activeTab, setActiveTab] = useState("Employee Summary");
  const [currentPageEmployeeSummary, setCurrentPageEmployeeSummary] = useState(1);
  const [showDetail, setShowDetail] = useState(false);
  const [showModalApproval, setShowModalApproval] = useState(false);
  const [showModalRecord, setShowModalRecord] = useState(false);
  const [earnings, setEarnings] = useState([]);
  const [localPayrunData, setLocalPayrunData] = useState(null);
  const [showDetailChangeStatus, setShowDetailChangeStatus] = useState(false);
  const [tempData, setTempData] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [tempConfirm, setTempConfirm] = useState("");
  const [showFormExit, setShowFormExit] = useState(false);
  const [showDetailDownload, setShowDetailDownload] = useState(false);

  useEffect(() => {
    if(!payrunThisMonth){
      const params = {
        limit: 10, 
        page: currentPageEmployeeSummary,
      };
      const access_token = localStorage.getItem("accessToken");
      getPayrunData(access_token, params);
    } else {
      setLocalPayrunData(payrunThisMonth);
    }
  }, [currentPageEmployeeSummary, payrunThisMonth]);

  const currentPayrunData = localPayrunData || payrunThisMonth;
  const handleView = async (uuid, name) => {
    const access_token = localStorage.getItem("accessToken");
    if(!showDetail){
      const response = await getDetailEmployeePayrun(access_token, uuid);
      if(response){
      }
    }
    setShowDetail(!showDetail);
  }

  const handleTakeOutEmployee = async (uuid) => {
    const access_token = localStorage.getItem("accessToken");
    const response = await deleteDetailEmployeePayrun(access_token, uuid);
    if(response){
      if (!localPayrunData) return;
      const updatedListEmployees = localPayrunData.listEmployees.filter(
        employee => employee.employeeUuid !== uuid
      );
      const updatedPayroll = localPayrunData.payroll.filter(
        payroll => payroll.employeeUuid !== uuid
      );
      const newTotals = {
        totalGrossMonthly: updatedPayroll.reduce((sum, emp) => sum + emp.grossMonthly, 0),
        totalNetMonthly: updatedPayroll.reduce((sum, emp) => sum + emp.netMonthly, 0),
        totalTaxesMonthly: updatedPayroll.reduce((sum, emp) => sum + emp.taxesMonthly, 0),
        totalDeductionsMonthly: updatedPayroll.reduce((sum, emp) => sum + emp.deductionsMonthly, 0),
        totalBenefitsMonthly: updatedListEmployees.reduce((sum, emp) => sum + emp.benefits, 0),
        totalReimbursementsMonthly: updatedListEmployees.reduce((sum, emp) => sum + emp.reimbursements, 0),
        countEmployees: updatedListEmployees.length,
        totalData: updatedListEmployees.length
      };
      setLocalPayrunData(prev => ({
        ...prev,
        listEmployees: updatedListEmployees,
        payroll: updatedPayroll,
        ...newTotals
      }));
    }
  }

  const handleShowModal = async () => {
    if(currentPayrunData?.checkPayrun?.status == "paymentDue"){
      setShowModalRecord(true);
    }else if(currentPayrunData?.checkPayrun?.status == "paid"){
      // console.log("send paylip");
    }else{
      setShowModalApproval(true);
    }
  }

  const handleSubmit = async (input) => {
    const access_token = localStorage.getItem("accessToken");
    const formData = {
        paymentDate: currentPayrunData?.dataPaySchedule?.payDate,
        numberEmployees: currentPayrunData?.countEmployees,
        taxes: currentPayrunData?.totalTaxesMonthly,
        benefit: currentPayrunData?.totalBenefitsMonthly,
        deduction: currentPayrunData?.totalDeductionsMonthly,
        totalNetPay: currentPayrunData?.totalNetMonthly,
        payrollCost: currentPayrunData?.totalGrossMonthly,
        postJournalEntries: input,
        data: currentPayrunData,
        earnings
      }
    
    try {
      const response = await createPayrun(formData, access_token, currentPayrunData?.checkPayrun?.uuid)
      if(response){
        const access_token = localStorage.getItem("accessToken");
        await getPayrunData(access_token);
        
        // ✅ Check jika status berubah dari paymentDue ke paid
        const wasPaymentDue = currentPayrunData?.checkPayrun?.status === "paymentDue";
        const isRecordPayment = typeof input === "object" && input !== null && input.paymentDate;
        
        if(wasPaymentDue && isRecordPayment){
          // ✅ Fetch history payrun setelah jadi paid
          const params = {
            limit: 10, 
            page: 1,
          };
          await getPayrunData(access_token, params, "history");
          
          // ✅ Redirect kembali ke Run Payroll setelah payrun di-mark as paid
          // Card tidak akan muncul karena status sudah paid
          handleBack(); // Kembali ke halaman Run Payroll
        } else if(formData?.data?.currentMonthStatus == "paymentDue"){
          const params = {
            limit: 10, 
            page: 1,
          };
          await getPayrunData(access_token, params, "history");
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
        setShowModalApproval(false);
        setShowModalRecord(false);
      }
    } catch (error) {
      // Error handling sudah di component ApprovalPayRun
      throw error; // Re-throw untuk ditangani di ApprovalPayRun
    }
  };

  const handleEdit = async (uuid, type, name) => {
    const access_token = localStorage.getItem("accessToken");
     if(type === "initiateExit"){
      setTempData(uuid)
      setShowFormExit(true);
    } else if(type === "salaryDetail"){
      changeActiveTab();
      navigate(`/employees/${uuid}`)
    } else if(type === "employeeDetail"){
      navigate(`/employees/${uuid}`)
    } else if (type == "delete"){
      const response = await changeStatusEmployee(access_token, uuid, {}, "delete");
      if(response){
        const params = {
          limit: 10, 
          page: 1,
        };
        await getPayrunData(access_token, params);
        setLocalPayrunData(null);
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
        handleBack();
      }
    } else {
      setTempData({uuid, type, name, date: currentPayrunData?.dataPaySchedule?.startMonth ? currentPayrunData.dataPaySchedule.startMonth.replace('-', ' ') : dayjs(currentPayrunData?.dataPaySchedule?.payDate).format("MMMM YYYY")});
      setShowDetailChangeStatus(true);
    }
  }

  const handleModalConfirm = async (option) => {
    if(option?.toLowerCase().includes("delete")){
      setShowModalConfirm(true);
      setTempConfirm(option)
    }else{
      setShowDetailDownload(true);
    }
  };

  const handleOption = async (tempUuid, isUpdate, input) => {
    if (tempConfirm?.toLowerCase().includes("delete")) {
      const access_token = localStorage.getItem("accessToken");
      const payload = {
        reason: input,
      }
      const response = await changeStatusEmployee(access_token, null, payload, "payrunStatus");
      if (response) {
        const params = {
          limit: 10,
          page: 1,
        };
        await getPayrunData(access_token, params);
        setLocalPayrunData(null);
        toast(<CustomToast message={response} status="success" />, {
          autoClose: 3000,
          closeButton: false,
          hideProgressBar: true,
          position: "top-center",
          style: {
            background: "transparent",
            boxShadow: "none",
            padding: 0,
          },
        });
        if(currentPayrunData?.checkPayrun?.status === "paid" || currentPayrunData?.checkPayrun?.status === "draft") {
          handleBack();
        }else{
          setShowModalConfirm(false);
        }
      }
    }
  }

  return (
    <div className="w-full h-full flex-col overflow-x-hidden flex items-start justify-start relative bg-white">
      {showFormExit ? (
        <FormInitiateExit
          setShowFormExit={setShowFormExit}
          employeeUuid={tempData}
          handleBack={handleBack}
        />
      ) : (
        <>
          <HeaderReusable 
            title="Regular Payroll" 
            handleBack={handleBack} 
            status={currentPayrunData?.checkPayrun?.status ?? "draft"} 
            isAddData={true} 
            addDataTitle={
              currentPayrunData?.checkPayrun?.status === "paymentDue" ? "Record Payment" : 
              currentPayrunData?.checkPayrun?.status === "paid" ? "Send Payslip" : 
              "Submit and Approve"
            } 
            handleShowModal={handleShowModal} 
            fileOptions={payrunOptionDraft}
            isOption={true}
            handleOption={handleModalConfirm}
            dateExecute={currentPayrunData?.dataPaySchedule?.payDate}
          />

          {/* Main Content Grid */}
          <div className="w-[80%] p-5 flex space-x-2">
            {/* Payroll Summary */}
            <div className="p-5 rounded-md bg-gray-300">
              <div className="space-y-5">
                <div className="text-sm flex space-x-3">
                  <p>Period: <span className="font-medium">{currentPayrunData?.dataPaySchedule?.startMonth ? currentPayrunData.dataPaySchedule.startMonth.replace('-', ' ') : dayjs(currentPayrunData?.dataPaySchedule?.payDate).format("MMMM YYYY")}</span></p>
                  <div className="border-s ps-3 border-gray-500">
                    <p>{currentPayrunData?.dataPaySchedule?.payDay} Base Days</p>
                  </div>
                </div>
                <div className="flex space-x-5">
                  <div className="space-y-2">
                    <div className="text-2xl font-semibold">${currentPayrunData?.totalGrossMonthly?.toLocaleString("en-US")}</div>
                    <div className="text-sm text-gray-600">PAYROLL COST</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-2xl font-semibold">${currentPayrunData?.totalNetMonthly?.toLocaleString("en-US")}</div>
                    <div className="text-sm text-gray-600">TOTAL NET PAY</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pay Day & Employee Count */}
            <div className="bg-white py-5 px-7 rounded-md border">
              <div className="text-center space-y-2">
                <div className="text-sm">PAY DAY</div>
                <div className="text-3xl font-light">
                  {currentPayrunData?.dataPaySchedule?.payDay}
                </div>
                <div className="text-sm">
                  {dayjs(currentPayrunData?.checkPayrun?.paymentDate).format("MMM, YYYY").toUpperCase()}
                </div>
                <div className="text-sm font-normal border-t pt-2">{currentPayrunData?.countEmployees} Employees</div>
              </div>
            </div>

            {/* Taxes & Deductions */}
            <div className="p-5 w-[23%] space-y-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Reimbursement</span>
                  <span className="font-normal">${currentPayrunData?.totalReimbursementsMonthly?.toLocaleString("en-US")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Benefits</span>
                  <span className="font-normal">${currentPayrunData?.totalBenefitsMonthly?.toLocaleString("en-US")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-normal">Total Deductions</span>
                  <span className="font-normal">${currentPayrunData?.totalDeductionsMonthly?.toLocaleString("en-US")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* tables */}
          <div className="w-full flex flex-col">
            {/* Tabs */}
            <div className="border-b ">
              <nav className="flex space-x-8 px-6">
                {/* {["Employee Summary", "Taxes & Deductions", "Overall Insights"].map((tab) => ( */}
                {["Employee Summary"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          {activeTab === "Employee Summary" && (
            <div className="flex-1 w-full relative">
              <TableReusable 
                dataHeaders={payRunEmployeeHeaders} 
                dataTable={currentPayrunData}
                tableFor={"employeeSummary"} 
                handleView={handleView} 
                handleDelete={handleTakeOutEmployee}
                handleEdit={handleEdit} 
              />
              <div className="w-full absolute bottom-5 flex items-center justify-end">
                <PaginationPages 
                  totalPages={currentPayrunData?.totalPage} 
                  currentPage={currentPageEmployeeSummary} 
                  setCurrentPage={setCurrentPageEmployeeSummary} 
                />
              </div>
            </div>
          )}

          <div className={`
              absolute top-0 right-0 h-full w-[500px] z-50 bg-white shadow-lg border-l
              transform transition-transform duration-300 ease-in-out
              ${showDetailDownload ? "translate-x-0" : "translate-x-full"}
            `}
          >
            <FormDetailDownload 
              handleView={() => setShowDetailDownload()} 
              data={payrunEmployee} 
              setEarnings={setEarnings} 
              earnings={earnings} 
              status={currentPayrunData?.checkPayrun?.status ?? "draft"}
            />
          </div>

          <div className={`
              absolute top-0 right-0 h-full w-[500px] z-50 bg-white shadow-lg border-l
              transform transition-transform duration-300 ease-in-out
              ${showDetail ? "translate-x-0" : "translate-x-full"}
            `}
          >
            <FormPayRunEmployeeDetail 
              handleView={handleView} 
              data={payrunEmployee} 
              setEarnings={setEarnings} 
              earnings={earnings} 
              status={currentPayrunData?.checkPayrun?.status ?? "draft"}
            />
          </div>
        </>
      )}

      <Modal
        isOpen={showModalApproval}
        contentLabel="Full Screen Modal"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: "none",
            backgroundColor: "transparent",
            padding: 0,
            margin: 0,
            overflow: "hidden",
          },
        }}>
        <FormModal
          setShowModal={setShowModalApproval} 
          formFor={"approvePayroll"}
          titleForm={"Approve Payroll"}
          submit={handleSubmit}
        />
      </Modal>

      <Modal
        isOpen={showModalRecord}
        contentLabel="Full Screen Modal"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: "none",
            backgroundColor: "transparent",
            padding: 0,
            margin: 0,
            overflow: "hidden",
          },
        }}>
        <FormModal
          setShowModal={setShowModalRecord} 
          formFor={"recordPayment"}
          titleForm={"Record Payment"}
          submit={handleSubmit}
        />
      </Modal>

      <Modal
        isOpen={showDetailChangeStatus}
        contentLabel="Full Screen Modal"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: "none",
            backgroundColor: "transparent",
            padding: 0,
            margin: 0,
            overflow: "hidden",
          },
        }}>
        <FormModal
          setShowModal={setShowDetailChangeStatus} 
          formFor={tempData?.type}
          data={tempData}
          setLocalPayrunData={setLocalPayrunData}
        />
      </Modal>

      <Modal
        isOpen={showModalConfirm}
        contentLabel="Full Screen Modal"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: "none",
            backgroundColor: "transparent",
            padding: 0,
            margin: 0,
            overflow: "hidden",
          },
        }}>
        <SimpleModalMessage
          setShowModal={setShowModalConfirm} 
          showModal={showModalConfirm}
          message={
            payrunThisMonth?.checkPayrun?.status == "draft" ?
            `You are about to delete a payroll. Are you sure you want to proceed?` :
            payrunThisMonth?.checkPayrun?.status == "reject" ? 
            `Editing this pay run will pull all the changes that you might've done for your employees. Are you sure you want to edit this pay run?` :
            payrunThisMonth?.checkPayrun?.status == "paymentDue" ?
            `You are about to reject the payroll for the period ${payrunThisMonth?.dataPaySchedule?.startMonth ? payrunThisMonth.dataPaySchedule.startMonth.replace('-', ' ') : dayjs(payrunThisMonth?.dataPaySchedule?.payDate).format("MMMM YYYY")}` :
            payrunThisMonth?.checkPayrun?.status == "paid" ?
            `You're about to delete the recorded payment for this pay run. Are you sure you want to proceed?`:
            ""
          }
          handleConfirm={handleOption}
          isInput={payrunThisMonth?.checkPayrun?.status == "paymentDue" ? true : false}
        />
      </Modal>
    </div>
  );
}

export default FormPayRuns;
