import { useState, useEffect, useRef } from "react";
import ButtonReusable from "../buttonReusable";
import leaveAndAttendanceStoreManagements from "../../../store/tdPayroll/setting/leaveAndAttendance";
import { toast } from "react-toastify";
import Lenientmode from "./attendance/lenientmode";
import Applicable from "./attendance/applicable";
import ImposeMaximumHours from "./attendance/imposeMaximumHours";
import RoundOff from "./attendance/roundOff";
import GracePeriodPolicy from "./attendance/gracePeriodPolicy";
import StrictmodeAttendance from "./attendance/strictmodeAttendance";
import RegularizationSettings from "./attendance/regularizationSetting";

function FormAttendance({handleShowForm, section, data = {}, tempUuid, isUpdate=false}) {
  const { loading, createLeaveAndAttendance, fetchLeaveAndAttendance, updateLeaveAndAttendance } = leaveAndAttendanceStoreManagements();
  const [formData, setFormData] = useState({
    settingsName: data.settingsName || "",
    applicableTo: data.applicableTo || "Shift",
    selectValue: data.selectValue || "",
    workingHoursCalculation: data.workingHoursCalculation || "every-valid-check",
    expectedHoursMode: data.expectedHoursMode || "strict",
    hoursSettingMode: data.hoursSettingMode || "shift-hours",
    fullDayHours: data.fullDayHours || null,
    halfDayHours: data.halfDayHours || null,
    expectedHoursPerDay: data.expectedHoursPerDay || null,
    allowOvertimeAndDeviation: data.allowOvertimeAndDeviation || false,
    imposeMaximumHoursPerDay: data.imposeMaximumHoursPerDay || false,
    maxHoursPerDay: data.maxHoursPerDay || null,
    roundOff: data.roundOff || false,
    roundOffFirstCheckIn: data.roundOffFirstCheckIn || null,
    roundOffLastCheckOut: data.roundOffLastCheckOut || null,
    roundOffWorkedHours: data.roundOffWorkedHours || null,
    gracePeriodPolicy: data.gracePeriodPolicy || false,
    gracePeriodRules: data.gracePeriodRules || [],
    regularizationPolicy: data.regularizationPolicy || "allow-anytime",
    regularizationDaysLimit: data.regularizationDaysLimit || 5,
    restrictRegularizationDays: data.restrictRegularizationDays || false,
    maxRegularizationDaysPerMonth: data.maxRegularizationDaysPerMonth || null,
    effectiveDate: data.effectiveDate,
    effectiveDateDisplay: data.effectiveDateDisplay,
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSelectDropdown, setShowSelectDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const selectDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (selectDropdownRef.current && !selectDropdownRef.current.contains(event.target)) {
        setShowSelectDropdown(false);
      }
    };
    
    if (showDropdown || showSelectDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, showSelectDropdown]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleChange = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleDropdownSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === 'applicableTo') {
      setShowDropdown(false);
    } else if (field === 'selectValue') {
      setShowSelectDropdown(false);
    }
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
    <div className="w-full h-screen overflow-y-auto  flex items-start justify-normal pb-32">
      <div className="w-full max-w-4xl space-y-6 bg-white p-6">
        {/* Settings Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Settings name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="settingsName"
            value={formData.settingsName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter settings name"
          />
        </div>

        {/* Applicable To */}
        <Applicable 
          formData={formData}
          setFormData={setFormData}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          handleDropdownSelect={handleDropdownSelect}
          showSelectDropdown={showSelectDropdown}
          setShowSelectDropdown={setShowSelectDropdown}
          selectDropdownRef={selectDropdownRef}
          dropdownRef={dropdownRef }
          entityType="attendance"
          excludeUuid={isUpdate ? tempUuid : null}
        />

        {/* Policy Priority Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-gray-700">
            Employee attendance-policy applicability priority order: User specific, Employment type-based, Department-based, Shift-based, and General attendance policy
          </p>
        </div>

        {/* Working Hours Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Working hours</h3>
            <p className="text-sm text-gray-600 mb-6">Define how you want working hours to be calculated in your organization</p>
          </div>

          {/* Calculate total working hours from */}
          <div className="space-y-4">
            <h4 className="text-base font-medium text-gray-800">Calculate total working hours from</h4>
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

          {/* Additional Options */}
          <div className="space-y-6 border-t pt-6">
            {/* Allow overtime and deviation */}
            <div className="space-y-2">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="allowOvertimeAndDeviation"
                  checked={formData.allowOvertimeAndDeviation}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                />
                <div className="ml-2">
                  <span className="text-sm font-medium text-gray-700">Allow overtime and deviation</span>
                  <p className="text-sm text-gray-500 mt-1">If allowed, the system will calculate the extra and deficit time based on logged hours</p>
                </div>
              </label>
            </div>

            {/* Impose maximum hours per day */}
            <ImposeMaximumHours formData={formData} setFormData={setFormData} handleChange={handleChange} />

            {/* Round-off */}
            <RoundOff formData={formData} setFormData={setFormData} handleChange={handleChange} />
          </div>

          {/* Grace period policy */}
          <GracePeriodPolicy formData={formData} setFormData={setFormData} handleToggleChange={handleToggleChange} />

          <RegularizationSettings 
            formData={formData} 
            setFormData={setFormData} 
            handleToggleChange={handleToggleChange} 
            handleChange={handleChange} 
          />

          {/* Effective Date - TAMBAH SECTION INI */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Effective date of Attendance Policy
            </label>
            <div className="relative w-48">
              <input
                type="date"
                name="effectiveDate"
                value={formData?.effectiveDate || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p>{`Tool tip : Attendance Policy effective from ${formData?.effectiveDateDisplay}`}</p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-6">
          <ButtonReusable title={"save"} action={handleSubmit} />
          <ButtonReusable title={"cancel"} action={() => handleShowForm()} isBLue={false} />
        </div>
      </div>
    </div>
  );
}

export default FormAttendance;
