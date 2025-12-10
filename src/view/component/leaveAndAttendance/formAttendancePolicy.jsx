import React, { useEffect, useState } from 'react';
import Lenientmode from './attendance/lenientmode';
import StrictmodeAttendance from './attendance/strictmodeAttendance';
import leaveAndAttendanceStoreManagements from '../../../store/tdPayroll/setting/leaveAndAttendance';
import { toast } from "react-toastify";

function FormAttendancePolicy() {
  const { createLeaveAndAttendance, fetchLeaveAndAttendance, attendancePolicyData } = leaveAndAttendanceStoreManagements();
  const [formData, setFormData] = useState({
    workingHoursCalculation: 'every-valid-check',
    expectedHoursMode: 'strict',
    hoursSettingMode: 'shift-hours',
    fullDayHours: null,
    halfDayHours: null,
    expectedHoursPerDay: null,
    allowOvertimeAndDeviation: false,
    imposeMaximumHoursPerDay: false,
    maxFullDayHours: null,
    maxHalfDayHours: null,

    // not yet be
    roundOff: false,
    updateOlderEntries: false,
    includeWeekends: false,
    includeHolidays: false,
    includeLeave: false,
    effectiveDate: null
  });

  useEffect(() => {
    if(attendancePolicyData?.length === 0){
      const access_token = localStorage.getItem("accessToken");
      fetchLeaveAndAttendance(access_token, "attendance-policy", 1);
    }else{
      setFormData(prev => ({
        ...prev,
        ...attendancePolicyData
      }));
    }
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const access_token = localStorage.getItem("accessToken");
    const response = await createLeaveAndAttendance(formData, access_token, "attendance-policy");
    if(response){
      await fetchLeaveAndAttendance(access_token, "attendance-policy", 1);
      toast.success(response, {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
        theme: "colored"
      })
    }
  };

  const handleUpdateOlderEntries = () => {
    console.log('Updating older attendance entries with current settings:', formData);
  };

  return (
    <div className="w-full h-screen overflow-y-auto flex items-start justify-normal pb-32">
      <div className="w-1/2 p-6 bg-white">
        <h2 className="text-xl font-semibold mb-4">Working hours</h2>
        <p className="text-gray-600 mb-6">Define how you want working hours to be calculated in your organization</p>
        
        <div className="space-y-6">
          {/* Calculate total working hours from */}
          <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="workingHoursCalculation"
                  value="first-last-check"
                  checked={formData.workingHoursCalculation === "first-last-check"}
                  onChange={(e) => handleRadioChange("workingHoursCalculation", e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">First check-in and last check-out</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="workingHoursCalculation"
                  value="every-valid-check"
                  checked={formData.workingHoursCalculation === "every-valid-check"}
                  onChange={(e) => handleRadioChange("workingHoursCalculation", e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Every valid check-in and check-out</span>
              </label>
            </div>

          {/* Expected hours per day */}
          <div className="space-y-4">
            <h4 className="text-base font-medium text-gray-800">Expected hours per day</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="expectedHoursMode"
                  value="strict"
                  checked={formData.expectedHoursMode === "strict"}
                  onChange={(e) => handleRadioChange("expectedHoursMode", e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Strict mode</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="expectedHoursMode"
                  value="lenient"
                  checked={formData.expectedHoursMode === "lenient"}
                  onChange={(e) => handleRadioChange("expectedHoursMode", e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Lenient mode</span>
              </label>
            </div>

            {/* Conditional Content for Strict Mode */}
            {formData.expectedHoursMode === "strict" && (
              <StrictmodeAttendance formData={formData} setFormData={setFormData} handleRadioChange={handleRadioChange} handleChange={handleChange} />
            )}

            {/* Conditional Content for Lenient Mode */}
            {formData.expectedHoursMode === "lenient" && (
              <Lenientmode formData={formData} setFormData={setFormData} handleRadioChange={handleRadioChange} handleChange={handleChange} />
            )}
          </div>

          {/* Allow overtime and deviation */}
          <div>
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                name="allowOvertimeAndDeviation"
                checked={formData.allowOvertimeAndDeviation}
                onChange={handleChange}
                className="mt-1 text-blue-600"
              />
              <div>
                <span className="font-medium">Allow overtime and deviation</span>
                <p className="text-gray-500 text-sm">
                  If allowed, the system will calculate the extra and deficit time based on logged hours
                </p>
              </div>
            </label>
          </div>

          {/* Impose maximum hours per day */}
          <div>
            <label className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                name="imposeMaximumHoursPerDay"
                checked={formData.imposeMaximumHoursPerDay}
                onChange={handleChange}
                className="text-blue-600"
              />
              <span className="font-medium">Impose maximum hours per day</span>
            </label>

            {/* Show max hours input when checkbox is checked */}
            {formData.imposeMaximumHoursPerDay && (
               <div className="w-fit bg-gray-50 px-5 rounded-md border">
                <table className="">
                  <tbody>
                    <tr>
                      <td className="font-light text-sm py-2 pr-4 w-20">
                        Full day <span className="text-red-500">*</span>
                      </td>
                      <td className="py-2 flex items-center justify-start space-x-2">
                        <input
                          type="time"
                          name="maxFullDayHours"
                          value={formData.maxFullDayHours}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-24"
                        />
                        <p className='text-sm'>hours</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="font-light text-sm py-2 pr-4 w-20">
                        Half day <span className="text-red-500">*</span>
                      </td>
                      <td className="py-2 flex items-center justify-start space-x-2">
                        <input
                          type="time"
                          name="maxHalfDayHours"
                          value={formData.maxHalfDayHours}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-24"
                        />
                        <p className='text-sm'>hours</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Round-off */}
          <div>
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                name="roundOff"
                checked={formData.roundOff}
                onChange={handleChange}
                className="mt-1 text-blue-600"
              />
              <div>
                <span className="font-medium">Round-off</span>
                <p className="text-gray-500 text-sm">
                  Round-off lets you adjust the first check-in, last check-out and working hours based on the minutes you configure for each
                </p>
              </div>
            </label>
          </div>

          {/* Update older attendance entries */}
          <div className="border-t pt-6">
            <h3 className="font-medium mb-3">Update older attendance entries</h3>
            <button
              type="button"
              onClick={handleUpdateOlderEntries}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Update
            </button>
          </div>

          {/* Pay days / hours calculation */}
          <div className="border-t pt-6">
            <h3 className="font-medium mb-2">Pay days / hours calculation</h3>
            <p className="text-gray-600 text-sm mb-4">Define how pay days / hours are to be calculated in your organization</p>
            
            <div className="mb-4">
              <h4 className="font-medium mb-3">Select the options to be included in payroll</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="includeWeekends"
                    checked={formData.includeWeekends}
                    onChange={handleChange}
                    className="mr-2 text-blue-600"
                  />
                  <span>Weekends</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="includeHolidays"
                    checked={formData.includeHolidays}
                    onChange={handleChange}
                    className="mr-2 text-blue-600"
                  />
                  <span>Holidays</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="includeLeave"
                    checked={formData.includeLeave}
                    onChange={handleChange}
                    className="mr-2 text-blue-600"
                  />
                  <span>Leave</span>
                </label>
              </div>
            </div>
          </div>

          {/* Effective date of policy for absent records */}
          <div className="border-t pt-6">
            <h3 className="font-medium mb-2">Effective date of policy for absent records</h3>
            <p className="text-gray-600 text-sm mb-4">
              Select the date from which the absent records of your employees should be updated based on the policy defined above
            </p>
            
            <div className="flex items-center space-x-2">
              <input
                type="date"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-40"
              />
            </div>
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => handleShowForm(false)}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Save Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormAttendancePolicy;