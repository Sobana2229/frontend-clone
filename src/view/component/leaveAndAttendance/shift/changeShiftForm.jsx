import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import employeeStoreManagements from "../../../../store/tdPayroll/employee";
import { useParams } from "react-router-dom";
import { Dot } from "@phosphor-icons/react";
import dayjs from "dayjs";

function ChangeShiftForm({ setShowModal, data, setIsUpdate, isUpdate, tempUuid, setTempUuid }) {
  const { getEmployeeOverview, employeeShiftData, assignEmployeeShift, fetchEmployeeWorkShift } = employeeStoreManagements();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    shiftUuid: '',
    fromDate: '',
    toDate: '',
    reason: ''
  });

  useEffect(() => {
    if (employeeShiftData?.length == 0) {
      const access_token = localStorage.getItem("accessToken");
      getEmployeeOverview(access_token, "shift", id);
    }
  }, [id]);
  
  useEffect(() => {
    if (data) {
      setFormData({
        shiftUuid: data?.shiftUuid || '',
        fromDate: data?.date?.format('YYYY-MM-DD'),
        toDate: data?.date?.format('YYYY-MM-DD'),
        reason: data?.reason || ''
      });
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    const access_token = localStorage.getItem("accessToken");
    let response;
    if(isUpdate){
      response = await assignEmployeeShift(formData, access_token, "shift-update", data?.id);
    }else{
      response = await assignEmployeeShift(formData, access_token, "shift", id);
    }
    if(response){
      await fetchEmployeeWorkShift(access_token, id);
      toast.success(response, {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
        theme: "colored"
      });
      setShowModal(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="w-full bg-white px-5 pb-5 space-y-6 rounded-lg">
      {/* Form - changed to div */}
      <div className="space-y-5">
        {/* Shift Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Shift name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.shiftUuid}
              onChange={(e) => handleInputChange('shiftUuid', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              required
            >
              <option value={''}>Select Shift</option>
              {employeeShiftData?.map((el, index) => (
                <option key={el?.uuid} value={el?.uuid}>
                  {`${el?.shiftName} ● ${dayjs(el?.fromTime, "HH:mm:ss").format("hh:mm A")} - ${dayjs(el?.toTime, "HH:mm:ss").format("hh:mm A")}`}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* From Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            From <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.fromDate}
              onChange={(e) => handleInputChange('fromDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* To Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">To</label>
          <div className="relative">
            <input
              type="date"
              value={formData.toDate}
              onChange={(e) => handleInputChange('toDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Reason</label>
          <textarea
            value={formData.reason}
            onChange={(e) => handleInputChange('reason', e.target.value)}
            placeholder="Reason"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Current Shift Info */}
      {isUpdate && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-700 font-medium mb-1">Current Shift</div>
          <div className="text-sm text-blue-600">
            {data.shiftName} • {data.time}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChangeShiftForm;