import { useState, useEffect, useRef } from "react";
import { X } from "@phosphor-icons/react";
import CoreWorkingHours from "./shift/coreWorkingHours";
import Shift from "./shift/shift";
import ShiftMargin from "./shift/shiftMargin";
import ButtonReusable from "../buttonReusable";
import EligibilityCriteria from "./shift/eligibilityCriteria";
import leaveAndAttendanceStoreManagements from "../../../store/tdPayroll/setting/leaveAndAttendance";
import { toast } from "react-toastify";
import { colorOptions } from "../../../../data/dummy";

function FormShift({handleShowForm, section, data = {}, tempUuid, isUpdate=false}) {
  const { loading, createLeaveAndAttendance, fetchLeaveAndAttendance, updateLeaveAndAttendance } = leaveAndAttendanceStoreManagements();
  const [formData, setFormData] = useState({
    shiftName: '',
    color: '#3B82F6',
    fromTime: '00:00',
    toTime: '00:00',
    shiftMargin: false,
    shiftMarginBefore: '',
    shiftMarginAfter: '',
    coreWorkingHours: false,
    coreHoursSlots: [{ from: '', to: '' }],
    restrictBreaksDuringCore: false,
    weekendBasedOn: 'location',
    defineWeekendDays: false,
    halfWorkingDay: false,
    weekendSchedule: {
      Sunday: { All: false, '1st': 'false', '2nd': false, '3rd': false, '4th': false, '5th': false },
      Monday: { All: false, '1st': false, '2nd': false, '3rd': false, '4th': false, '5th': false },
      Tuesday: { All: false, '1st': false, '2nd': false, '3rd': false, '4th': false, '5th': false },
      Wednesday: { All: false, '1st': false, '2nd': false, '3rd': false, '4th': false, '5th': false },
      Thursday: { All: false, '1st': false, '2nd': false, '3rd': false, '4th': false, '5th': false },
      Friday: { All: false, '1st': false, '2nd': false, '3rd': false, '4th': false, '5th': false },
      Saturday: { All: false, '1st': false, '2nd': false, '3rd': false, '4th': false, '5th': false }
    },
    provideShiftAllowance: false,
    shiftAllowanceRate: '',
    eligibilityCriteria: [
      { field: 'Locations', value: [] }
    ]
  });
  const [showDropdown, setShowDropdown] = useState({});
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (data) {
      setFormData(prevFormData => ({
        ...prevFormData,
        ...data,
      }));
    }
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative') && !event.target.closest('.dropdown-content')) {
        setShowDropdown({});
      }
    };

    if (Object.keys(showDropdown).length > 0) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const toggleDropdown = (key) => {
    setShowDropdown(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    const access_token = localStorage.getItem("accessToken");
    let response;
    if(isUpdate){
      response = await updateLeaveAndAttendance(formData, access_token, section, tempUuid);
    }else{
      response = await createLeaveAndAttendance(formData, access_token, section);
    }
    if(response){
      await fetchLeaveAndAttendance(access_token, section, 1);
      toast.success(response, {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
        theme: "colored"
      })
      handleShowForm();
    }
  };

  return (
    <div className="w-full h-screen overflow-y-auto flex items-start justify-normal pb-32">
      <div className="w-full space-y-6 bg-white p-6">
        {/* Scrollable Content */}
        <div className="w-1/2 flex-1">
          <div className="p-6 space-y-6">
            {/* Shift Name and Color */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="shiftName"
                  value={formData.shiftName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter shift name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="relative">
                  <div 
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                    style={{ backgroundColor: formData.color }}
                    onClick={() => toggleDropdown('color')}
                  />
                  {showDropdown.color && (
                    <div className="absolute z-30 top-full mt-2 bg-white border rounded-lg shadow-lg p-2">
                      <div className="grid grid-cols-4 gap-2">
                        {colorOptions.map((color, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded cursor-pointer border-2 border-gray-300 hover:border-gray-400 transition-colors"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, color }));
                              setShowDropdown(prev => ({ ...prev, color: false }));
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="fromTime"
                  value={formData.fromTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="toTime"
                  value={formData.toTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              {/* Shift Margin Section */}
              {/* <ShiftMargin formData={formData} setFormData={setFormData} handleChange={handleChange} /> */}
              {/* Core Working Hours Section */}
              {/* <CoreWorkingHours formData={formData} setFormData={setFormData} handleChange={handleChange}/> */}
            </div>

            {/* Weekend Based On */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Weekends are based on
              </label>
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="location"
                    name="weekendBasedOn"
                    value="location"
                    checked={formData.weekendBasedOn === 'location'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="location" className="ml-2 text-sm text-gray-900">
                    Location
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="shift"
                    name="weekendBasedOn"
                    value="shift"
                    checked={formData.weekendBasedOn === 'shift'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="shift" className="ml-2 text-sm text-gray-900">
                    Shift
                  </label>
                </div>
              </div>

              {/* Weekend Configuration for Shift */}
              {formData.weekendBasedOn === 'shift' && (
                <Shift formData={formData} setFormData={setFormData} handleChange={handleChange} />
              )}
            </div>

            {/* Shift Allowance */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="provideShiftAllowance"
                  name="provideShiftAllowance"
                  checked={formData.provideShiftAllowance}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="provideShiftAllowance" className="text-sm font-medium text-gray-900">
                  Provide shift allowance
                </label>
              </div>

              {/* Shift Allowance Rate */}
              {formData.provideShiftAllowance && (
                <div className="ml-7 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate per day
                  </label>
                  <input
                    type="text"
                    name="shiftAllowanceRate"
                    value={formData.shiftAllowanceRate || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter rate per day"
                  />
                </div>
              )}
            </div>

            {/* Eligibility Criteria */}
            <EligibilityCriteria formData={formData} setFormData={setFormData} toggleDropdown={toggleDropdown} dropdownRef={dropdownRef} showDropdown={showDropdown} data={data} />

            {/* Warning Message */}
            {formData.weekendBasedOn === 'shift' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  Shift based weekends override location based weekends
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions - Fixed at bottom */}
        <div className="flex items-center justify-start space-x-4 p-6 border-t bg-white flex-shrink-0">
          <ButtonReusable title={isUpdate ? 'Update Shift' : 'Create Shift'} action={handleSubmit} isBLue={false} />
          <ButtonReusable title={"Cancel"} action={() => handleShowForm()} />
        </div>
      </div>
    </div>
  );
}

export default FormShift;