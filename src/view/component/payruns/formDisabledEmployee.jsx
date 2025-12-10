import { useEffect, useState } from 'react';
import payrunStoreManagements from '../../../store/tdPayroll/payrun';
import { toast } from "react-toastify";
import { CustomToast } from '../customToast';

function FormDisabledEmployee({ setShowModal, data, formFor, setLocalPayrunData}) {
  const { changeStatusEmployee, getPayrunData, payrunEmployee } = payrunStoreManagements();
  const [formData, setFormData] = useState({
    employee: '',
    payrollPeriod: '',
    reason: '',
    status: "",
    payrunUuid: ""
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      employee: data?.name,
      payrollPeriod: data?.date,
      status: formFor,
      payrunUuid: payrunEmployee?.payrunUuid
    }));
  }, [data]);  

  const handleSubmit = async () => {
    const access_token = localStorage.getItem("accessToken");
    const response = await changeStatusEmployee(access_token, data?.uuid, formData, "status");
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
      setShowModal(false)
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="w-full h-full flex-col overflow-x-hidden flex items-start justify-start relative bg-white">
      {/* Header */}
      <div className="flex items-center justify-between w-full p-4 border-b">
        <h2 className="text-lg font-semibold">{formFor}?</h2>
        <button 
          onClick={() => setShowModal(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Warning Alert */}
      <div className="w-full p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>
          <p className="text-sm text-red-700">
            {formFor== "Withhold Salary" ? 
              "You can pay this cycle's earnings when you release withheld salary for this employee" : 
              'Once you skip an employee(s) from the pay run, you will not be able to pay them later for this pay cycle'
            }
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 w-full p-4">
        <div className="space-y-4">
          {/* Employee & Payroll Period Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee
              </label>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2">
                <span className="text-sm font-medium">{formData.employee}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payroll Period
              </label>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2">
                <span className="text-sm font-medium">{formData.payrollPeriod}</span>
              </div>
            </div>
          </div>

          {/* Reason Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Please enter a reason*
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter reason for skipping this employee..."
              required
            />
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="w-full p-4 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-red-500">
            * indicates mandatory fields
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              disabled={!formData.reason.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed
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

export default FormDisabledEmployee;