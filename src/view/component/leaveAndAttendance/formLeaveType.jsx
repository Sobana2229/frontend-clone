import { useState, useEffect, useRef } from "react";
import ButtonReusable from "../buttonReusable";
import leaveAndAttendanceStoreManagements from "../../../store/tdPayroll/setting/leaveAndAttendance";
import { toast } from "react-toastify";
import CriteriaBasedEmployees from "./leaveType/criteriaBasedEmployees";
import { allocationOptions, leaveTypeOptions } from "../../../../data/dummy";

function FormLeaveType({handleShowForm, section, data = {}, tempUuid, isUpdate=false}) {
  const { loading, createLeaveAndAttendance, fetchLeaveAndAttendance, updateLeaveAndAttendance } = leaveAndAttendanceStoreManagements();
  const [formData, setFormData] = useState({
    leaveName: data.leaveName || "",
    code: data.code || "",
    selectType: data.selectType || "",
    description: data.description || "",
    showDescription: data.showDescription || false,
    leaveAllocation: data.leaveAllocation || "",
    leaveDays: data.leaveDays || null,
    proRateBalance: data.proRateBalance || false,
    resetLeaveBalance: data.resetLeaveBalance || false,
    resetFrequency: data.resetFrequency || "",
    carryForwardUnused: data.carryForwardUnused || false,
    maxCarryForwardDays: data.maxCarryForwardDays || null,
    encashRemaining: data.encashRemaining || false,
    maxEncashmentDays: data.maxEncashmentDays || null,
    allowNegativeBalance: data.allowNegativeBalance || false,
    negativeBalanceType: data.negativeBalanceType || "Year End Limit",
    allowPastDates: data.allowPastDates || true,
    pastDateLimit: data.pastDateLimit || "no-limit",
    pastDaysLimit: data.pastDaysLimit || null,
    allowFutureDates: data.allowFutureDates || true,
    futureDateLimit: data.futureDateLimit || "no-limit",
    futureDaysLimit: data.futureDaysLimit || null,
    applicableTo: data.applicableTo || "all-employees",
    criteriaBasedEmployees: data.criteriaBasedEmployees || [
      { field: 'Shift', value: [] }
    ],
    postponeLeaveCredits: data.postponeLeaveCredits || false,
    postponeDays: data.postponeDays || null,
    postponePeriod: data.postponePeriod || "Year",
    effectiveDate: data.effectiveDate || "",
    hasExpiryDate: data.hasExpiryDate || false,
    expiryDate: data.expiryDate || "",
    effectiveDateDisplay: data.effectiveDateDisplay,
    selectTypeDisplay: data.selectTypeDisplay,
  });
  const [showSelectTypeDropdown, setShowSelectTypeDropdown] = useState(false);
  const [showAllocationDropdown, setShowAllocationDropdown] = useState(false);
  const [showResetFrequencyDropdown, setShowResetFrequencyDropdown] = useState(false);
  const [showNegativeBalanceDropdown, setShowNegativeBalanceDropdown] = useState(false);
  const [showPostponePeriodDropdown, setShowPostponePeriodDropdown] = useState(false);
  const [showCriteriaDropdown, setShowCriteriaDropdown] = useState({});
  const selectTypeRef = useRef(null);
  const allocationRef = useRef(null);
  const resetFrequencyRef = useRef(null);
  const negativeBalanceRef = useRef(null);
  const postponePeriodRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectTypeRef.current && !selectTypeRef.current.contains(event.target)) {
        setShowSelectTypeDropdown(false);
      }
      if (allocationRef.current && !allocationRef.current.contains(event.target)) {
        setShowAllocationDropdown(false);
      }
      if (resetFrequencyRef.current && !resetFrequencyRef.current.contains(event.target)) {
        setShowResetFrequencyDropdown(false);
      }
      if (negativeBalanceRef.current && !negativeBalanceRef.current.contains(event.target)) {
        setShowNegativeBalanceDropdown(false);
      }
      if (postponePeriodRef.current && !postponePeriodRef.current.contains(event.target)) {
        setShowPostponePeriodDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update criteriaBasedEmployees saat data berubah (untuk edit)
  useEffect(() => {
    if (isUpdate && data?.criteriaBasedEmployees) {
      setFormData(prev => ({
        ...prev,
        criteriaBasedEmployees: data.criteriaBasedEmployees.length > 0 ? data.criteriaBasedEmployees : [{ field: 'Shift', value: [] }]
      }));
    }
  }, [isUpdate, data?.criteriaBasedEmployees]);

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

  const handleDropdownSelect = (field, value, label) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      [`${field}Label`]: label
    }));
    switch(field) {
      case 'selectType':
        setShowSelectTypeDropdown(false);
        break;
      case 'leaveAllocation':
        setShowAllocationDropdown(false);
        break;
      case 'resetFrequency':
        setShowResetFrequencyDropdown(false);
        break;
      case 'negativeBalanceType':
        setShowNegativeBalanceDropdown(false);
        break;
      case 'postponePeriod':
        setShowPostponePeriodDropdown(false);
        break;
    }
  };

  const toggleCriteriaDropdown = (dropdownKey) => {
    setShowCriteriaDropdown(prev => ({
      ...prev,
      [dropdownKey]: !prev[dropdownKey]
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
      <div className="w-full max-w-4xl space-y-6 bg-white p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Let's set up a new leave type.</h2>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Leave Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Leave Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="leaveName"
              value={formData.leaveName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter leave name"
            />
          </div>

          {/* Code */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter code"
            />
          </div>

          {/* Select Type */}
          <div className="space-y-2" ref={selectTypeRef}>
            <label className="block text-sm font-medium text-gray-700">
              Select Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSelectTypeDropdown(!showSelectTypeDropdown)}
                className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
              >
                <span className={formData.selectType ? "text-gray-900" : "text-gray-500"}>
                  {formData.selectType ? leaveTypeOptions.find(opt => opt.value === formData.selectType)?.label : "Select"}
                </span>
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showSelectTypeDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {leaveTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleDropdownSelect('selectType', option.value, option.label)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, showDescription: !prev.showDescription }))}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Description
            </button>
          </div>
          {formData.showDescription && (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter description"
            />
          )}
        </div>

        {/* Leave Allocation */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-gray-900">How many leaves do employees get?</h3>
          <div className="flex items-center space-x-4">
            <div className="relative" ref={allocationRef}>
              <button
                type="button"
                onClick={() => setShowAllocationDropdown(!showAllocationDropdown)}
                className="px-3 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center min-w-32"
              >
                <span className={formData.leaveAllocation ? "text-gray-900" : "text-gray-500"}>
                  {formData.leaveAllocation ? allocationOptions.find(opt => opt.value === formData.leaveAllocation)?.label : "Select"}
                </span>
                <svg className="h-4 w-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showAllocationDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {allocationOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleDropdownSelect('leaveAllocation', option.value, option.label)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <input
              type="number"
              name="leaveDays"
              value={formData.leaveDays || ""}
              onChange={handleChange}
              min="0"
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Days"
            />
            <span className="text-sm text-gray-700">Days</span>
          </div>

          {/* Pro-rate and Reset checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="proRateBalance"
                checked={formData.proRateBalance}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-2">
                <span className="text-sm text-gray-700">Pro-rate leave balance for new joinees based on their date of joining</span>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </label>

            {/* Reset Leave Balance */}
            <div className="space-y-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="resetLeaveBalance"
                  checked={formData.resetLeaveBalance}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                />
                <div className="ml-2">
                  <span className="text-sm text-gray-700">Reset the leave balance of employees</span>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </label>

              {formData.resetLeaveBalance && (
                <div className="ml-6 space-y-4 border-l-2 border-gray-200 pl-4">
                  {/* Reset Frequency */}
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">every</span>
                    <div className="relative" ref={resetFrequencyRef}>
                      <button
                        type="button"
                        onClick={() => setShowResetFrequencyDropdown(!showResetFrequencyDropdown)}
                        className="px-3 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center min-w-32"
                      >
                        <span className={formData.resetFrequency ? "text-gray-900" : "text-gray-500"}>
                          {formData.resetFrequency || "Select"}
                        </span>
                        <svg className="h-4 w-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showResetFrequencyDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                          {["Yearly", "Monthly"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleDropdownSelect('resetFrequency', option)}
                              className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Carry Forward */}
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="carryForwardUnused"
                        checked={formData.carryForwardUnused}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Carry forward unused leave days upon reset?</span>
                    </label>

                    {formData.carryForwardUnused && (
                      <div className="ml-6 flex items-center space-x-2">
                        <span className="text-sm text-gray-700">Max carry forward days</span>
                        <input
                          type="number"
                          name="maxCarryForwardDays"
                          value={formData.maxCarryForwardDays || ""}
                          onChange={handleChange}
                          min="0"
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Encash Remaining */}
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="encashRemaining"
                        checked={formData.encashRemaining}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Encash remaining leave days?</span>
                    </label>

                    {formData.encashRemaining && (
                      <div className="ml-6 flex items-center space-x-2">
                        <span className="text-sm text-gray-700">Max encashment days</span>
                        <input
                          type="number"
                          name="maxEncashmentDays"
                          value={formData.maxEncashmentDays || ""}
                          onChange={handleChange}
                          min="0"
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Employee Leave Request Preferences */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-gray-900">Employee Leave Request Preferences</h3>
          
          {/* Allow negative leave balance */}
          <div className="space-y-4">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="allowNegativeBalance"
                checked={formData.allowNegativeBalance}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
              />
              <div className="ml-2">
                <span className="text-sm text-gray-700">Allow negative leave balance</span>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </label>

            {formData.allowNegativeBalance && (
              <div className="ml-6 space-y-3">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Consider negative leave balance as</span>
                  <div className="relative" ref={negativeBalanceRef}>
                    <button
                      type="button"
                      onClick={() => setShowNegativeBalanceDropdown(!showNegativeBalanceDropdown)}
                      className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
                    >
                      <span className={formData.negativeBalanceType ? "text-gray-900" : "text-gray-500"}>
                        {formData.negativeBalanceType || "Year End Limit"}
                      </span>
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showNegativeBalanceDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                        {["No Limit", "Year End Limit", "No Limit and mark as LOP"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleDropdownSelect('negativeBalanceType', option)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Allow applying for leave on past dates */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="allowPastDates"
                checked={formData.allowPastDates}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Allow applying for leave on past dates</span>
            </label>

            {formData.allowPastDates && (
              <div className="ml-6 space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="pastDateLimit"
                    value="no-limit"
                    checked={formData.pastDateLimit === "no-limit"}
                    onChange={(e) => handleRadioChange("pastDateLimit", e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">No limit on past dates</span>
                </label>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="pastDateLimit"
                    value="set-limit"
                    checked={formData.pastDateLimit === "set-limit"}
                    onChange={(e) => handleRadioChange("pastDateLimit", e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Set Limit</span>
                  {formData.pastDateLimit === "set-limit" && (
                    <div className="ml-4 flex items-center space-x-2">
                      <input
                        type="number"
                        name="pastDaysLimit"
                        value={formData.pastDaysLimit || ""}
                        onChange={handleChange}
                        min="1"
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">days before today</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Allow applying for leave on future dates */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="allowFutureDates"
                checked={formData.allowFutureDates}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Allow applying for leave on future dates</span>
            </label>

            {formData.allowFutureDates && (
              <div className="ml-6 space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="futureDateLimit"
                    value="no-limit"
                    checked={formData.futureDateLimit === "no-limit"}
                    onChange={(e) => handleRadioChange("futureDateLimit", e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">No limit on future dates</span>
                </label>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="futureDateLimit"
                    value="set-limit"
                    checked={formData.futureDateLimit === "set-limit"}
                    onChange={(e) => handleRadioChange("futureDateLimit", e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Set Limit</span>
                  {formData.futureDateLimit === "set-limit" && (
                    <div className="ml-4 flex items-center space-x-2">
                      <input
                        type="number"
                        name="futureDaysLimit"
                        value={formData.futureDaysLimit || ""}
                        onChange={handleChange}
                        min="1"
                        className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">days after today</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Applicability and Validity */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-gray-900">Applicability and Validity</h3>
          
          {/* Who can apply this leave */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Who all can apply this leave?</p>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="applicableTo"
                  value="all-employees"
                  checked={formData.applicableTo === "all-employees"}
                  onChange={(e) => handleRadioChange("applicableTo", e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">All employees</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="applicableTo"
                  value="criteria-based"
                  checked={formData.applicableTo === "criteria-based"}
                  onChange={(e) => handleRadioChange("applicableTo", e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Criteria-Based Employees</span>
              </label>
            </div>
          </div>

          {/* Criteria-Based Employees Component */}
          {formData.applicableTo === "criteria-based" && (
            <CriteriaBasedEmployees 
              formData={formData}
              setFormData={setFormData}
              showDropdown={showCriteriaDropdown}
              toggleDropdown={toggleCriteriaDropdown}
              entityType="leave-types"
              excludeUuid={isUpdate ? tempUuid : null}
            />
          )}

          {/* Postpone leave credits */}
          <div className="space-y-4">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="postponeLeaveCredits"
                checked={formData.postponeLeaveCredits}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
              />
              <div className="ml-2">
                <span className="text-sm text-gray-700">Postpone leave credits for employees</span>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </label>

            {formData.postponeLeaveCredits && (
              <div className="ml-6 space-y-4 border-l-2 border-gray-200 pl-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    name="postponeDays"
                    value={formData.postponeDays || ""}
                    onChange={handleChange}
                    min="0"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                  
                  <div className="relative" ref={postponePeriodRef}>
                    <button
                      type="button"
                      onClick={() => setShowPostponePeriodDropdown(!showPostponePeriodDropdown)}
                      className="px-3 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center min-w-24"
                    >
                      <span className={formData.postponePeriod ? "text-gray-900" : "text-gray-500"}>
                        {formData.postponePeriod || "Year"}
                      </span>
                      <svg className="h-4 w-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showPostponePeriodDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                        {["Month", "Year"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleDropdownSelect('postponePeriod', option)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <span className="text-sm text-gray-700">after date of joining</span>
                  <div className="flex items-center text-xs text-gray-500">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Leave type effective from */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Leave type effective from
            </label>
            <input
              type="date"
              name="effectiveDate"
              value={formData.effectiveDate}
              onChange={handleChange}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p>{`Tool tip : Leave effective from ${formData?.effectiveDateDisplay} with`} <span className="capitalize">{`${formData?.selectTypeDisplay}`}</span>.</p>

          {/* Set expiry for leave type */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="hasExpiryDate"
                checked={formData.hasExpiryDate}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Set expiry for leave type</span>
            </label>

            {formData.hasExpiryDate && (
              <div className="ml-6 space-y-4 border-l-2 border-gray-200 pl-4">
                {/* Expiry Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <ButtonReusable title={"Save"} action={handleSubmit} />
          <ButtonReusable title={"Cancel"} action={() => handleShowForm()} isBLue={false} />
        </div>
      </div>
    </div>
  );
}

export default FormLeaveType;