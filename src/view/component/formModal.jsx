import { NotePencil, PencilLine, X } from "@phosphor-icons/react"
import LoadingIcon from "./loadingIcon"
import { useState, useRef, useEffect } from "react";
import FormWorkLocation from "./setting/Organisation/formWorkLocation";
import FormDepartment from "./setting/Organisation/formDepartment";
import FormExportFileLeaveAndAttendance from "./leaveAndAttendance/formExportFileLeaveAndAttendance";
import FormLoanName from "./loan/formLoanName";
import ChangeShiftForm from "./leaveAndAttendance/shift/changeShiftForm";
import FormSenderEmailPreference from "./senderEmailPreference/formSenderEmailPreference";
import ApprovalPayRun from "./payruns/form/approvalPayRun";
import FillingaddressForm from "./organisationProfiles/fillingaddressForm";
import FormDisabledEmployee from "./payruns/formDisabledEmployee";
import FormExportDetailPayrun from "./payruns/form/formExportDetailPayrun";
import FormPauseLoan from "./loan/formPauseLoan";
import FormPayScheduleDelete from "./setting/paySchedule/formPayScheduleDelete";
import FormRecordPaymentLoan from "./loan/formRecordPaymentLoan";

function FormModal({
  setShowModal, 
  message, 
  submit,
  isLoading=false,
  subMessage,
  isResendOtp,
  resendOtp,
  formFor,
  isSingle=false,
  label,
  titleForm,
  setIsUpdate,
  submitEdit,
  isUpdate=false,
  isSetting=false,
  data=null,
  setData,
  setTempUuid,
  tempUuid,
  isExportFile,
  setLocalPayrunData,
  setShowForm=false
}) {
  const [inputUser, setInputUser] = useState(['', '', '', '', '', '']); 
  const inputRefs = useRef([]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [inputUserSingle, setInputUserSingle] = useState(""); 

  useEffect(() => {
    if (isResendOtp && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, isResendOtp]);
  
  const handleInputChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newInputUser = [...inputUser];
    newInputUser[index] = value.slice(-1);
    setInputUser(newInputUser);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !inputUser[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newInputUser = [...inputUser];
    
    for (let i = 0; i < 6; i++) {
      newInputUser[i] = pastedData[i] || '';
    }
    setInputUser(newInputUser);
    
    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <>
      <div className="w-full h-full flex items-center justify-center">
        <div className={`${formFor == "fillingaddress" ? "w-[700px]" : "w-[600px]"} bg-white rounded-lg shadow-lg ${
          formFor?.toLowerCase() !== 'worklocations' && "space-y-5"
        }`}>
          <>
            {/* close btn */}
            {!isLoading && (
              formFor?.toLowerCase() !== 'withhold salary' && formFor?.toLowerCase() !== 'skip payroll' && formFor?.toLowerCase() !== 'pauseloans'  && formFor?.toLowerCase() !== 'recordpaymentloan' && formFor?.toLowerCase() !== 'payscheduledelete' && (
                <div className="w-full h-16 flex items-center justify-start border-b px-5 space-x-5">
                  {!isExportFile && (
                    <div className="w-full flex items-center justify-between">
                      <div className="">
                        {(formFor !== "otp" && formFor !== "fillingaddress" && formFor !== "exportPayrunDetail" && formFor !== "loanName") && (
                          <div className="flex items-center justify-center space-x-2">
                            <NotePencil size={24} />
                            <h1 className="text-lg font-normal text-gray-td-500">
                              {(formFor === "shiftemployee" || formFor === "approvePayroll" || formFor === "recordPayment")
                                ? titleForm
                                : `${isUpdate ? "Update" : "New"} ${titleForm}`}
                            </h1>
                          </div>
                        )}
                        {formFor == "fillingaddress" && (
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <h2 className="text-lg font-medium text-gray-800">Edit Filing Location</h2>
                          </div>
                        )}
                        {formFor == "exportPayrunDetail" && (
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <h2 className="text-lg font-medium text-gray-800">Export Payroll Data</h2>
                          </div>
                        )}
                        {formFor == "loanName" && (
                          <div className="flex items-center space-x-2">
                            <h2 className="text-xl font-normal text-gray-800">Manage Loans</h2>
                          </div>
                        )}
                      </div>

                      {formFor !== "fillingaddress" && formFor !== "exportPayrunDetail" && (
                        <button onClick={() => setShowModal(false)} className="h-5 w-5 rounded-full border-2 border-gray-td-300 flex items-center justify-center text-sm text-gray-td-300 font-bold">
                          X
                        </button>
                      )}
                    </div>
                  )}
                  {isExportFile && (
                    <div className="">
                      {formFor !== "otp" && (
                        <h1 className="text-lg font-medium">Export Report as {titleForm}</h1>
                      )}
                    </div>
                  )}
                </div>
              )
            )}

            {/* message */}
            {message && (
              <div className="w-full flex flex-col items-center justify-center px-10">
                {!isLoading && (
                  <h1 className="text-xl font-medium w-full break-words text-center">{message}</h1>
                )}

                {isLoading && (
                  <div className="h-[200px] w-[200px] my-10">
                    <LoadingIcon color="blue" />
                  </div>
                )}

                {(subMessage && !isLoading) && (
                  <h1 className="text-sm font-medium w-full break-words text-center mt-5">{subMessage}</h1>
                )}
              </div>
            )}
          </>
          
          {/* form */}
          {!isLoading && (
            formFor?.toLowerCase() === 'otp' ? (
              <div className="w-full flex items-center justify-center gap-3 px-10">
                {[...Array(6)].map((_, index) => (
                  <input 
                    key={index}
                    ref={(el) => inputRefs.current[index] = el}
                    type="text" 
                    className="w-12 h-12 text-center text-lg font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-[#E00038]" 
                    value={inputUser[index]} 
                    onChange={(e) => handleInputChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    maxLength={1}
                  /> 
                ))}
              </div>
            ) : formFor?.toLowerCase() === 'worklocations' ?(
              <FormWorkLocation setClose={setShowModal} isSetting={isSetting} />
            ) : formFor?.toLowerCase() === 'departement' ? (
              <FormDepartment setShowModal={setShowModal} isSetting={isSetting} data={data} setIsUpdate={setIsUpdate} isUpdate={isUpdate} tempUuid={tempUuid} setTempUuid={setTempUuid} />
            ) : formFor?.toLowerCase() === 'loanname' ? (
              <FormLoanName setShowModal={setShowModal} isSetting={isSetting} data={data} setIsUpdate={setIsUpdate} isUpdate={isUpdate} tempUuid={tempUuid} setTempUuid={setTempUuid} />
            ) : formFor?.toLowerCase() === 'shiftemployee' ? (
              <ChangeShiftForm setShowModal={setShowModal} data={data} setIsUpdate={setIsUpdate} isUpdate={isUpdate} tempUuid={tempUuid} setTempUuid={setTempUuid} />
            ) : isExportFile ? (
              <FormExportFileLeaveAndAttendance setShowModal={setShowModal} />
            ) : formFor?.toLowerCase() === 'senderemailpreference' ? (
              <FormSenderEmailPreference setShowModal={setShowModal} data={data} setIsUpdate={setIsUpdate} isUpdate={isUpdate} tempUuid={tempUuid} setTempUuid={setTempUuid} />
            ) : formFor?.toLowerCase() === 'approvepayroll' ? (
              <ApprovalPayRun setShowModal={setShowModal} submit={submit} />
            ) : formFor?.toLowerCase() === 'recordpayment' ? (
              <ApprovalPayRun setShowModal={setShowModal} submit={submit} isRecordPayment={true} />
            ) : formFor?.toLowerCase() === 'fillingaddress' ? (
              <FillingaddressForm setShowModal={setShowModal} />
            ) : (formFor?.toLowerCase() === 'withhold salary' || formFor?.toLowerCase() === 'skip payroll') ? (
              <FormDisabledEmployee setShowModal={setShowModal} formFor={formFor} data={data} setLocalPayrunData={setLocalPayrunData} />
            ) : (formFor?.toLowerCase() === 'pauseloans') ? (
              <FormPauseLoan setShowModal={setShowModal} data={data} />
            ) : (formFor?.toLowerCase() === 'recordpaymentloan') ? (
              <FormRecordPaymentLoan setShowModal={setShowModal} data={data} setData={setData} />
            ) : (formFor?.toLowerCase() === 'payscheduledelete') ? (
              <FormPayScheduleDelete setShowModal={setShowModal} data={data} setShowForm={setShowForm} />
            ) : (formFor?.toLowerCase() === 'exportpayrundetail') ? (
              <FormExportDetailPayrun setShowModal={setShowModal} formFor={formFor} />
            ) : (
              <div className="w-full px-10">
                <label className="block mb-1 text-sm font-medium capitalize">
                  {label}
                </label>
                <input
                  type="text"
                  className="w-full h-12 px-3 text-base font-medium border border-gray-td-300 rounded-md focus:outline-none border-l-8 border-l-red-td-500"
                  value={isUpdate ? data?.name : inputUserSingle}
                  placeholder={`Enter ${label}`}
                  onChange={(e) => {
                    isUpdate ? setData({
                      name: e.target.value
                    }) :
                    setInputUserSingle(e.target.value)
                  }}
                />
              </div>
            )
          )}
          {/* btn */}
          {(submit && !isLoading && formFor != "loanName" && formFor != "approvePayroll" && formFor != "recordPayment") && 
            <div className={`w-full flex flex-col justify-center items-center pb-5 px-10 pt-4 border-t`}>
              <div className={`w-full flex ${formFor == "otp" ? "justify-center" : "justify-between"} space-x-5`}>
                <div className="flex items-center justify-start space-x-4">
                  <>
                    <button 
                      className="px-5 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center"
                      onClick={() => {
                        if (formFor?.toLowerCase() === 'otp') {
                          submit(inputUser.join(''));
                        } else if (isUpdate) {
                          submitEdit();
                        } else {
                          submit(inputUserSingle);
                        }
                      }}
                    >
                      Submit
                    </button>
                    
                    {(isSingle && label) && (
                      <button 
                        className="px-5 py-2 bg-white text-gray-700 border duration-300 ease-in-out transition-all border-gray-300 rounded-md hover:bg-gray-50"
                        onClick={() => {
                          setShowModal(false)
                        }} 
                      >
                        Cancel
                      </button>
                    )}
                  </>
                </div>
                {(isSingle && label) && (
                  <span className="text-red-td-300 font-normal">indicates mandatory fields</span>
                )}
              </div>
              {isResendOtp &&
                <div className="w-full flex flex-col items-center justify-center mt-5 space-y-3">
                  {!canResend ? (
                    <p className="text-sm text-gray-600">
                      Resend OTP in {countdown} seconds
                    </p>
                  ) : (
                    <button  
                      className="text-blue-500" 
                      onClick={() => {
                        resendOtp();
                        setCountdown(60);
                        setCanResend(false);
                        setInputUser(['', '', '', '', '', '']);
                      }} 
                    > 
                      Resend OTP 
                    </button>
                  )}
                </div>
              } 
            </div>
          }
        </div>
      </div>
    </>
  )
}
  
export default FormModal