// PriorPayrunPayInformation.jsx
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import UploadFormFileMapping from '../../../uploadFormFileMapping';
import salaryComponentStoreManagements from '../../../../../store/tdPayroll/setting/salaryComponent';
import payScheduleStoreManagements from '../../../../../store/tdPayroll/setting/paySchedule';
import payrunStoreManagements from '../../../../../store/tdPayroll/payrun';
import { toast } from "react-toastify";
import { CustomToast } from '../../../customToast';

function PriorPayrunPayInformation({ setShowPrior, setActiveTab }) {
  const { fetchSalaryComponent, salaryComponentAll } = salaryComponentStoreManagements();
  const { fetchPaySchedule, payScheduleData } = payScheduleStoreManagements();
  const {
    createPriorPayrunDetail,
    getPayrunData,
    priorPayrunPeriod,
    priorPayrunGetOne
  } = payrunStoreManagements();

  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [formDataArray, setFormDataArray] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  useEffect(() => {
    if (!salaryComponentAll) {
      const token = localStorage.getItem('accessToken');
      fetchSalaryComponent(token, 'all');
    }
  }, [salaryComponentAll, fetchSalaryComponent]);

  // ✅ FETCH PAY SCHEDULE DATA
  useEffect(() => {
    if (!payScheduleData) {
      const token = localStorage.getItem('accessToken');
      fetchPaySchedule(token);
    }
  }, [payScheduleData, fetchPaySchedule]);

  // ✅ EXTRACT PERIODS DARI PAYSCHEDULEANDPRIORPAYRUN
  useEffect(() => {
    if (!payScheduleData?.PayScheduleAndPriorPayruns) return;

    const priorPayrunValues = payScheduleData.PayScheduleAndPriorPayruns.map(
      item => item.value
    );
    setPeriods(priorPayrunValues);
  }, [payScheduleData]);

  const handleUploadNow = period => {
    setIsUpdateMode(false);
    setSelectedPeriod(period);
  };

  const handleUpdate = async period => {
    const token = localStorage.getItem('accessToken');
    await getPayrunData(token, { period }, 'prior-payrun');
    setIsUpdateMode(true);
    setSelectedPeriod(period);
  };

  const handleCancel = () => {
    setShowPrior(false);
    setSelectedPeriod(null)
  };

  const handleMappingChange = newArray => setFormDataArray(newArray);

  const handleNext = async ({ file, savePrefs, data }) => {
    const empComp = salaryComponentAll.find(
      item => item.label.toLowerCase().includes('employee number')
    );
    const empUuid = empComp?.value;

    const hasEmpNo = data?.some(m => m.uuid === empUuid);

    if (!hasEmpNo) {
      toast(
        <CustomToast
          message="Please map the employee number (mandatory) field."
          status="error"
        />,
        {
          autoClose: 3000,
          position: 'top-center',
          hideProgressBar: true,
          closeButton: false
        }
      );
      return;
    }

    const payload = { 
      data: data,
      savePrefs, 
      period: selectedPeriod 
    };

    const token = localStorage.getItem('accessToken');
    const res = await createPriorPayrunDetail(payload, token, selectedPeriod);
    if (res) {
      await getPayrunData(token, {}, 'prior-payrun-period');
      toast(<CustomToast message={res} status="success" />, {
        autoClose: 3000,
        position: 'top-center',
        hideProgressBar: true,
        closeButton: false
      });
      setSelectedPeriod(null);
      setActiveTab('summary');
    }
  };

  return (
    <div className="pb-10">
      {selectedPeriod == null ? (
        <>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 flex items-center gap-2">
            <span className="text-yellow-500">&#9888;</span>
            Investment details … before uploading Pay Information.
          </div>
          <p className="mb-6">Upload salary details for these periods:</p>
          <div className="flex flex-col gap-4 mb-8">
            {/* ✅ UPDATED MAPPING */}
            {periods && periods.length > 0 ? (
              periods.map(period => {
                const isDone = priorPayrunPeriod?.includes(period);
                return (
                  <div 
                    key={period} 
                    className="flex justify-between items-center bg-white border rounded px-6 py-4"
                  >
                    <span>{period}</span>
                    <button
                      className={`flex items-center border rounded px-4 py-2 ${
                        isDone ? 'text-green-600' : 'text-blue-600 hover:bg-blue-50'
                      }`}
                      onClick={() => isDone ? handleUpdate(period) : handleUploadNow(period)}
                    >
                      {isDone ? 'Update' : 'Upload Now'}
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400">No periods configured</p>
            )}
          </div>
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setActiveTab('summary')}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Next
            </button>
            <button onClick={handleCancel} className="border px-4 py-2 rounded">
              Set up Later
            </button>
          </div>
        </>
      ) : (
        <UploadFormFileMapping
          onCancel={handleCancel}
          handleBack={() => setSelectedPeriod(null)}
          onNext={handleNext}
          dataSelecttion={salaryComponentAll}
          onMappingChange={handleMappingChange}
          isUpdateMode={isUpdateMode}
          selectedPeriod={selectedPeriod}
          data={priorPayrunGetOne}
        />
      )}
    </div>
  );
}

export default PriorPayrunPayInformation;
