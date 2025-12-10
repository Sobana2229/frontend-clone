import React, { useEffect, useState } from 'react';
import ButtonReusable from '../buttonReusable';
import leaveAndAttendanceStoreManagements from '../../../store/tdPayroll/setting/leaveAndAttendance';
import organizationStoreManagements from '../../../store/tdPayroll/setting/organization';
import { toast } from "react-toastify";
import { CustomToast } from '../customToast';

function FillingaddressForm({ setShowModal }) {
  const { 
    fetchWorkLocationOptions,
    workLocationOptions 
  } = leaveAndAttendanceStoreManagements();
  const { loading, fetchoOganizationDetail, updateOganizationDetail, organizationDetail, fetchOrganizationSetting } = organizationStoreManagements();
  const [selectedLocation, setSelectedLocation] = useState(organizationDetail?.workLocationUuid ?? '');

  useEffect(() => {
    if(!Array.isArray(workLocationOptions) || workLocationOptions?.length === 0) {
      const access_token = localStorage.getItem("accessToken");
      fetchWorkLocationOptions(access_token);
    }
  }, []);
  
  const handleSubmit = async () => {
    const access_token = localStorage.getItem("accessToken");
    const response = await updateOganizationDetail({workLocationUuid: selectedLocation}, access_token, "filling-address");
    if(response){
      await fetchOrganizationSetting("work-location", access_token, true);
      await fetchoOganizationDetail(access_token);
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
      handleCancel();
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="w-full h-full flex-col flex items-start justify-start relative px-5 pb-5 space-y-6">
      {/* Main Content */}
      <div className="flex w-full space-x-6">
        {/* Left Side - Form */}
        <div className="flex-1">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecting Filing Location*
              </label>
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  {workLocationOptions?.map((el) => (
                    <option value={el?.value}>{el?.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="text-xs text-gray-500">
              <p><strong>Note:</strong> Your filing address should be one of your work locations.</p>
              <p>To use a new address, simply add it in <span className="text-blue-500">Settings &gt; Work Locations</span>.</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 mt-6">
            <ButtonReusable title={"save"} action={handleSubmit} />
            <ButtonReusable title={"cancel"} action={handleCancel} isBLue={false} />
          </div>
        </div>

        {/* Right Side - Preview */}
        <div className="w-64">
          <div className="bg-blue-td-50 border rounded-md">
            <h3 className="text-sm font-medium text-blue-td-600 border-b-2 border-blue-td-600 p-2">Preview</h3>
            <div className="space-y-1 p-3">
              {workLocationOptions.map(el => (
                <div
                  key={el.uuid}
                  className={`text-sm text-blue-td-800 border-b-2 border-blue-td-600 py-1`}
                >
                  {el.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FillingaddressForm;