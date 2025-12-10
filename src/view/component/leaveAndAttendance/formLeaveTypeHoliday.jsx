import { useState, useEffect, useRef } from "react";
import ButtonReusable from "../buttonReusable";
import { Plus, Trash, X } from "@phosphor-icons/react";
import leaveAndAttendanceStoreManagements from "../../../store/tdPayroll/setting/leaveAndAttendance";
import organizationStoreManagements from "../../../store/tdPayroll/setting/organization";
import { toast } from "react-toastify";

function FormLeaveTypeHoliday({handleShowForm, section, data = {}, tempUuid, isUpdate=false}) {
  const { loading, createLeaveAndAttendance, fetchLeaveAndAttendance, updateLeaveAndAttendance, fetchAvailableShifts, availableShifts } = leaveAndAttendanceStoreManagements();
  const { 
    shiftOptions, 
    fetchOrganizationSetting, 
    cityOptions,
  } = organizationStoreManagements();
  const [filteredShiftOptions, setFilteredShiftOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: data.name || "",
    startDate: data.startDate || "",
    endDate: data.endDate || "",
    applicableFor: data.applicableFor || [{ field: 'Shift', value: [] }],
    classification: data.classification || "Holiday",
    description: data.description || "",
    reminderDays: data.reminderDays || "",
    notifyEmployees: data.notifyEmployees || true,
    reprocessLeaveApplications: data.reprocessLeaveApplications || false
  });
  const [showDropdown, setShowDropdown] = useState({});
  const dropdownRefs = useRef({});
  const fieldOptionsApplicableFor = ['Shift'];
  const classificationOptions = ['Holiday', 'Restricted holiday'];
  const reminderOptions = Array.from({ length: 30 }, (_, i) => i + 1);



  useEffect(() => {
    if(shiftOptions?.length === 0) {
      const access_token = localStorage.getItem("accessToken");
      fetchOrganizationSetting("shift", access_token, false, null, true);
    }
  }, []);

  // Fetch available shifts for holiday
  useEffect(() => {
    // Reset filteredShiftOptions first to prevent showing old data
    setFilteredShiftOptions([]);
    
    const fetchShifts = async () => {
      const access_token = localStorage.getItem("accessToken");
      await fetchAvailableShifts(access_token, "holiday", isUpdate ? tempUuid : null);
    };
    
    fetchShifts();
  }, [isUpdate, tempUuid, fetchAvailableShifts]);

  // Update filtered shift options when availableShifts change
  useEffect(() => {
    // Always use availableShifts if it's been fetched (even if empty array)
    // Only fallback to shiftOptions if availableShifts hasn't been fetched yet (undefined)
    if (availableShifts !== undefined) {
      setFilteredShiftOptions(availableShifts);
    } else {
      // Wait for availableShifts to be fetched before showing options
      setFilteredShiftOptions([]);
    }
  }, [availableShifts, shiftOptions]);


  useEffect(() => {
    if(cityOptions?.length === 0) {
      const access_token = localStorage.getItem("accessToken");
      fetchOrganizationSetting("city", access_token, false, null, true);
    }
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      const activeDropdowns = Object.keys(showDropdown).filter(key => showDropdown[key]);
      for (const dropdownKey of activeDropdowns) {
        const dropdownElement = dropdownRefs.current[dropdownKey];
        if (dropdownElement && !dropdownElement.contains(event.target)) {
          if (!event.target.closest('.dropdown-content')) {
            Object.keys(showDropdown).forEach(key => {
              if (showDropdown[key]) {
                toggleDropdown(key);
              }
            });
            break;
          }
        }
      }
    };
    
    if (Object.values(showDropdown).some(Boolean)) {
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  const getOptionsForField = (fieldType) => {
    switch(fieldType) {
      case 'Shift':
        // Always use filtered shifts (available shifts for holiday)
        // Don't fallback to shiftOptions to prevent showing used shifts
        return filteredShiftOptions || [];
      default:
        return [];
    }
  };


  const getAllSelectedValues = (excludeIndex = -1) => {
    const selectedValues = [];
    formData.applicableFor.forEach((criteria, index) => {
      if (index !== excludeIndex) {
        if (criteria?.value && Array.isArray(criteria?.value)) {
          selectedValues.push(...criteria?.value?.map(item => item.value));
        }
      }
    });
    return selectedValues;
  };


  const getSelectedFields = (excludeIndex = -1) => {
    const selectedFields = [];
    formData.applicableFor.forEach((criteria, index) => {
      if (index !== excludeIndex && criteria.field) {
        selectedFields.push(criteria.field);
      }
    });
    return selectedFields;
  };


  const addCriteria = () => {
    const availableFields = fieldOptionsApplicableFor.filter(field => 
      !formData.applicableFor.some(criteria => criteria.field === field)
    );
    
    if (availableFields.length > 0) {
      setFormData(prev => ({
        ...prev,
        applicableFor: [...prev.applicableFor, { field: availableFields[0], value: [] }]
      }));
    }
  };


  const removeCriteria = (index) => {
    setFormData(prev => ({
      ...prev,
      applicableFor: prev.applicableFor.filter((_, i) => i !== index)
    }));
  };


  const handleCriteriaChange = (index, field, value) => {
    const updatedCriteria = [...formData.applicableFor];
    updatedCriteria[index][field] = value;
    if (field === 'field') {
      updatedCriteria[index].value = [];
    }
    
    setFormData(prev => ({
      ...prev,
      applicableFor: updatedCriteria
    }));
    
    if (field !== 'value') {
      setShowDropdown({});
    }
  };


  const handleValueSelect = (index, selectedOption) => {
    const currentValues = formData.applicableFor[index].value || [];
    const isAlreadySelected = currentValues.some(item => item.value === selectedOption.value);
    
    if (!isAlreadySelected) {
      const newValues = [...currentValues, selectedOption];
      handleCriteriaChange(index, 'value', newValues);
    }
  };


  const removeSelectedValue = (criteriaIndex, valueToRemove) => {
    const currentValues = formData.applicableFor[criteriaIndex].value || [];
    const newValues = currentValues.filter(item => item.value !== valueToRemove.value);
    handleCriteriaChange(criteriaIndex, 'value', newValues);
  };


  const handleSubmit = async () => {
    const access_token = localStorage.getItem("accessToken");
    let response;
    if(isUpdate){
      response = await updateLeaveAndAttendance(formData, access_token, "leave-type-holiday", tempUuid);
    }else{
      response = await createLeaveAndAttendance(formData, access_token, "leave-type-holiday");
    }
    if(response){
      await fetchLeaveAndAttendance(access_token, "leave-type-holiday", 1);
      toast.success(response, {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
        theme: "colored"
      })
      handleShowForm("Holiday")
    }
  };


  return (
    <div className="w-full h-screen overflow-y-auto flex items-start justify-normal pb-32">
      <div className="w-1/2">
        <div className="w-full space-y-6 bg-white p-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter holiday name"
            />
          </div>


          {/* Start Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>


          {/* End Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>


          {/* Applicable for */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Applicable for
            </label>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              {formData.applicableFor?.map((criteria, index) => {
                const availableOptions = getOptionsForField(criteria.field);
                const selectedValuesFromOtherCriteria = getAllSelectedValues(index);
                const selectedFields = getSelectedFields(index);
                
                return (
                  <div key={index} className="flex items-center space-x-3">
                    {/* Field Dropdown */}
                    <div 
                      className="relative" 
                      ref={el => dropdownRefs.current[`field-${index}`] = el}
                    >
                      <button
                        type="button"
                        onClick={() => toggleDropdown(`field-${index}`)}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm min-w-[120px] text-left flex items-center justify-between hover:bg-gray-50"
                      >
                        {criteria.field}
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showDropdown[`field-${index}`] && (
                        <div className="dropdown-content absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                          {fieldOptionsApplicableFor?.filter(option => !selectedFields.includes(option))?.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleCriteriaChange(index, 'field', option)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                            >
                              {option}
                            </button>
                          ))}
                          {fieldOptionsApplicableFor?.filter(option => !selectedFields?.includes(option))?.length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              All field types are already selected
                            </div>
                          )}
                        </div>
                      )}
                    </div>


                    {/* Is */}
                    <span className="text-sm text-gray-700">is</span>


                    {/* Value Multi-Select Dropdown */}
                    <div 
                      className="flex-1 relative"
                      ref={el => dropdownRefs.current[`value-${index}`] = el}
                    >
                      <div 
                        className="min-h-[40px] px-3 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer flex flex-wrap gap-2 items-center"
                        onClick={() => toggleDropdown(`value-${index}`)}
                      >
                        {criteria?.value && criteria?.value?.length > 0 ? (
                          criteria?.value?.map((selectedItem, valueIndex) => (
                            <span 
                              key={valueIndex}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800"
                            >
                              {selectedItem.label}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSelectedValue(index, selectedItem);
                                }}
                                className="ml-1 hover:text-blue-600"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Select
                          </span>
                        )}
                        <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      
                      {/* Dropdown Options */}
                      {showDropdown[`value-${index}`] && (
                        <div className="dropdown-content absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {availableOptions?.length > 0 ? (
                            availableOptions
                              ?.filter(option => !selectedValuesFromOtherCriteria.includes(option.value))
                              ?.map((option) => {
                                const isSelectedInCurrentCriteria = criteria.value?.some(item => item.value === option.value);
                                
                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleValueSelect(index, option)}
                                    disabled={isSelectedInCurrentCriteria}
                                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                                      isSelectedInCurrentCriteria ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
                                    }`}
                                  >
                                    {option.label} {isSelectedInCurrentCriteria && '✓'}
                                  </button>
                                );
                              })
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              {criteria.field === 'Shift' ? 'No departments available' : 'No locations available'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>


                    {/* Remove Button */}
                    {formData.applicableFor?.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCriteria(index)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash size={16} />
                      </button>
                    )}
                  </div>
                );
              })}


              {/* Add Criteria Button */}
              {formData.applicableFor?.length < fieldOptionsApplicableFor.length && (
                <button
                  type="button"
                  onClick={addCriteria}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus size={16} />
                  <span>Add Criteria</span>
                </button>
              )}
            </div>
          </div>


          {/* Classification */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Classification <span className="text-red-500">*</span>
            </label>
            <div className="relative" ref={el => dropdownRefs.current['classification'] = el}>
              <button
                type="button"
                onClick={() => toggleDropdown('classification')}
                className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
              >
                <span className="text-gray-900">{formData.classification}</span>
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showDropdown.classification && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {classificationOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, classification: option }));
                        toggleDropdown('classification');
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>


          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter description"
            />
          </div>


          {/* Reminder Days */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              No of day(s) before when the reminder email is to be sent
            </label>
            <div className="relative" ref={el => dropdownRefs.current['reminderDays'] = el}>
              <button
                type="button"
                onClick={() => toggleDropdown('reminderDays')}
                className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
              >
                <span className={formData.reminderDays ? "text-gray-900" : "text-gray-500"}>
                  {formData.reminderDays ? `${formData.reminderDays} days` : "Select"}
                </span>
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showDropdown.reminderDays && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {reminderOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, reminderDays: option }));
                        toggleDropdown('reminderDays');
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      {option} days
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>


          {/* Checkboxes */}
          <div className="space-y-4">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="notifyEmployees"
                checked={formData.notifyEmployees}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
              />
              <div className="ml-3">
                <span className="text-sm text-gray-700">Notify applicable employees via feeds</span>
                <p className="text-xs text-gray-500 mt-1">
                  (They will receive a feed notification instantly once this holiday is saved)
                </p>
              </div>
            </label>


            <label className="flex items-center">
              <input
                type="checkbox"
                name="reprocessLeaveApplications"
                checked={formData.reprocessLeaveApplications}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">
                Reprocess leave applications based on this added holiday
              </span>
            </label>
          </div>
          <div className="">
            <p>Note : Shift based holiday will override the location based holiday</p>
          </div>


          {/* Form Actions */}
          <div className="flex items-center justify-start space-x-4 p-6 border-t bg-white flex-shrink-0">
            <ButtonReusable 
              title={isUpdate ? 'Update Holiday' : 'Create Holiday'} 
              action={handleSubmit} 
              isBLue={true} 
            />
            <ButtonReusable 
              title={"Cancel"} 
              action={() => handleShowForm("Holiday")} 
              isBLue={false} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}


export default FormLeaveTypeHoliday;