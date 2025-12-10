import React, { useEffect, useState } from 'react';
import employeeStoreManagements from '../../../store/tdPayroll/employee';
import { exitReasonPayruns } from '../../../../data/dummy';
import payrunStoreManagements from '../../../store/tdPayroll/payrun';
import { toast } from "react-toastify";
import { CustomToast } from '../customToast';
import Modal from "react-modal";
import SimpleModalMessage from '../simpleModalMessage';
import FormExitEmployeePoi from './form/formPoi';

function FormInitiateExit({ setShowFormExit, employeeUuid, handleBack }) {
  const { fetchEmployeePersonalDetail, dataEmployeePersonalDetail} = employeeStoreManagements();
  const { getInitiateExitPayrun, payrunDataExitEmployee, poiExitPayrun, getPoiExitPayrun, payrunDataExitEmployeePoi } = payrunStoreManagements();
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [tempData, setTempData] = useState(false);
  const { initiateExitPayrun } = payrunStoreManagements();
  const [formData, setFormData] = useState({
    lastWorkingDay: '',
    reasonForExit: '',
    finalPaySchedule: 'regular',
    finalSettlementDate: '',
    personalEmail: '',
    notes: ''
  });
  const [formDataPOI, setFormDataPOI] = useState({
    bonus: 0,
    commission: 0,
    augustBasic: 0,
    houseRACorrection: 0,
    transportCarAllowance: 0,
    lunchAllowance: 0,
    leaveEncashment: 0,
    gratuity: 16347,
    deductions: [],
    noticePayHold: false,
    noticePayType: '',
    payableAmount: 0,
    receivableAmount: 0,
    finalSettlementNotes: ''
  });

  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");
    fetchEmployeePersonalDetail(access_token, employeeUuid);
  }, [employeeUuid]);

  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");
    getInitiateExitPayrun(access_token, employeeUuid);
  }, [employeeUuid]);

  useEffect(() => {
    if (dataEmployeePersonalDetail) {
      setFormData(prev => ({
        ...prev,
        personalEmail: dataEmployeePersonalDetail.personalEmail
      }));
    }
  }, [employeeUuid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (value) => {
    setFormData(prev => ({
      ...prev,
      finalPaySchedule: value,
      finalSettlementDate: value === 'regular' ? '' : prev.finalSettlementDate
    }));
  };

  const handleShowModal = async (type) => {
    setShowModalConfirm(true);
    setTempData(type)
  }

  const handleSubmitExitEmployee = async () => {
    const access_token = localStorage.getItem("accessToken");
    const response = await initiateExitPayrun(formData, access_token, employeeUuid);
    if (response) {
      const access_token = localStorage.getItem("accessToken");
      await getInitiateExitPayrun(access_token, employeeUuid);
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
      setShowModalConfirm(false);
    }
  };

  const handleSubmitPOI = async () => {
    const access_token = localStorage.getItem("accessToken");
    const response = await poiExitPayrun(formDataPOI, access_token, employeeUuid);
    if (response) {
      await getPoiExitPayrun(access_token);
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
      setShowModalConfirm(false);
      handleBack();
    }
  };

  const handleCancel = () => {
    setShowFormExit(false);
  };

  return (
    <div className="w-full h-full flex-col overflow-x-hidden flex items-start justify-start relative bg-white">
      {payrunDataExitEmployee ? (
        <FormExitEmployeePoi handleSubmit={handleShowModal} setFormDataPOI={setFormDataPOI} formDataPOI={formDataPOI} uuid={payrunDataExitEmployee?.uuid} />
      ) : (
        <div className="w-1/2 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">{dataEmployeePersonalDetail?.Employee?.firstName} {dataEmployeePersonalDetail?.Employee?.middleName} {dataEmployeePersonalDetail?.Employee?.lastName} Exit Details</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-black rounded-full relative">
                    <div className="absolute top-1 left-2 w-4 h-2 bg-yellow-400 rounded-sm"></div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-lg">{dataEmployeePersonalDetail?.nickname}</div>
                  <div className="text-sm text-gray-600">ID: {dataEmployeePersonalDetail?.Employee?.uuid}</div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Last Working Day */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Working Day<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="lastWorkingDay"
                    value={formData.lastWorkingDay}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="dd/MM/yyyy"
                  />
                </div>
  
                {/* Reason for Exit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Exit<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="reasonForExit"
                    value={formData.reasonForExit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select</option>
                    {exitReasonPayruns.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>
  
                {/* Final Pay Settlement */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    When do you want to settle the final pay?
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="finalPaySchedule"
                        value="regular"
                        checked={formData.finalPaySchedule === 'regular'}
                        onChange={() => handleRadioChange('regular')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Pay as per the regular pay schedule
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="finalPaySchedule"
                        value="given_date"
                        checked={formData.finalPaySchedule === 'given_date'}
                        onChange={() => handleRadioChange('given_date')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Pay on a given date
                      </span>
                    </label>
                  </div>
                </div>
  
                {/* Final Settlement Date - Conditional Field */}
                {formData.finalPaySchedule === 'given_date' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Final Settlement Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="finalSettlementDate"
                      value={formData.finalSettlementDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="dd/MM/yyyy"
                    />
                  </div>
                )}
  
                {/* Personal Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personal Email Address
                    <span className="ml-1 text-gray-400 cursor-help" title="This email will be used for further communication">
                      ℹ
                    </span>
                  </label>
                  <input
                    type="email"
                    name="personalEmail"
                    value={formData.personalEmail}
                    onChange={handleInputChange}
                    disabled={true}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="example@mail.com"
                  />
                </div>
  
                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Add any additional notes..."
                  />
                </div>
              </div>
            </div>
  
            {/* Employee Details Section */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Designation</span>
                  <div className="text-sm text-gray-800">{dataEmployeePersonalDetail?.Employee?.Designation?.name}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Department</span>
                  <div className="text-sm text-gray-800">{dataEmployeePersonalDetail?.Employee?.Departement?.name}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Date of Joining</span>
                  <div className="text-sm text-gray-800">{dataEmployeePersonalDetail?.Employee?.joinDate}</div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Note Section */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-600 font-semibold">Note:</span>
              </div>
              <div className="ml-2">
                <p className="text-sm text-yellow-800">
                  Only the employee's Proof of Investment will be considered for calculation in the final settlement payroll and not the IT Declaration.
                </p>
              </div>
            </div>
          </div>
  
          {/* Action Buttons */}
          <div className="mt-8 flex justify-start space-x-4">
            <button
              onClick={()=> handleShowModal("exitEmployee")}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Proceed
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
            tempData == "exitEmployee" ?
            'Are you sure you want to proceed?' :
            'You are about to reset a payroll draft. All the values you have entered will be removed. Are you sure you want to proceed?'
          }
          handleConfirm={
            tempData == "exitEmployee" ?
            handleSubmitExitEmployee : handleSubmitPOI
          }
        />
      </Modal>
    </div>
  );
}

export default FormInitiateExit;
