import { useEffect, useState } from 'react';
import payrunStoreManagements from '../../../../store/tdPayroll/payrun';
import { toast } from "react-toastify";
import { exportFormatOptionPayrun, exportTypeOptionPayrun } from '../../../../../data/dummy';
import { CustomToast } from '../../customToast';
import dayjs from "dayjs";

function FormExportDetailPayrun({ setShowModal, formFor }) {
  const { payrunThisMonth, downloadDetailPayrun, getDownloadhistoryDetailPayrun } = payrunStoreManagements();
  const [formData, setFormData] = useState({
    exportType: '',
    exportFormat: 'XLS (Microsoft Excel 1997-2004 Compatible)',
    protectWithPassword: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = async () => {
    try {
        const params = {
            date: payrunThisMonth?.dataPaySchedule?.payDate
        };
        const access_token = localStorage.getItem("accessToken");
        const blob = await downloadDetailPayrun(access_token, params);
        if (!blob || blob.size === 0) {
            throw new Error('No data received');
        }
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const currentDate = dayjs().format('YYYY_MM');
        link.download = `Payrun_${currentDate}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        await getDownloadhistoryDetailPayrun(access_token);
        toast(<CustomToast message={'Payrun exported successfully!'} status={"success"} />, {
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
        setShowModal(false);
        
    } catch (error) {
        toast(<CustomToast message={error.message || 'Export failed'} status={"error"} />, {
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
  };

  return (
    <div className="w-full h-full flex-col overflow-x-hidden flex items-start justify-start relative bg-white">
      <div className="w-full flex-1 px-5 space-y-6">
        {/* Export Type Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Select the type of pay run details for export
          </label>
          {/* Dropdown */}
          <div className="relative">
            <select
              value={formData.exportType}
              onChange={(e) => handleInputChange('exportType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">Select</option>
              {exportTypeOptionPayrun.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Export Format */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Export as
          </label>
          
          <select
            value={formData.exportFormat}
            onChange={(e) => handleInputChange('exportFormat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {exportFormatOptionPayrun.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Password Protection */}
        <div className="flex items-center space-x-2 pb-5">
          <input
            type="checkbox"
            id="protectWithPassword"
            checked={formData.protectWithPassword}
            onChange={(e) => handleInputChange('protectWithPassword', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="protectWithPassword" className="text-sm text-gray-700">
            Protect this file with a password
          </label>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="w-full p-4 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormExportDetailPayrun;