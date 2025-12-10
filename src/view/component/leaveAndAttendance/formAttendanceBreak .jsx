import { useState, useEffect, useRef } from "react";
import ButtonReusable from "../buttonReusable";
import { 
  Coffee, 
  Timer, 
  CloudSnow, 
  Hamburger, 
  Lock,
  Bed,
  PaperPlaneRight,
  SmileyWink,
  Trash,
  Plus,
  X
} from "@phosphor-icons/react";
import { colorOptions } from "../../../../data/dummy";
import leaveAndAttendanceStoreManagements from "../../../store/tdPayroll/setting/leaveAndAttendance";
import organizationStoreManagements from "../../../store/tdPayroll/setting/organization";
import { toast } from "react-toastify";

function FormAttendanceBreak({handleShowForm, section, data = {}, tempUuid, isUpdate=false}) {
  const { loading, createLeaveAndAttendance, fetchLeaveAndAttendance, updateLeaveAndAttendance, fetchAvailableShifts, availableShifts } = leaveAndAttendanceStoreManagements();
  const { 
    shiftOptions, 
    fetchOrganizationSetting, 
  } = organizationStoreManagements();
  const [filteredShiftOptions, setFilteredShiftOptions] = useState([]);
  
  const transformDataToFormStructure = (data) => {
    if (!data?.applicableShifts || data?.applicableShifts?.length === 0) {
      return [{ field: 'Shift', value: [] }];
    }

    const shiftValues = data?.applicableShifts?.map(shift => {
      const shiftName = shift?.Shift?.shiftName;
      return {
        label: shiftName || 'Unknown Shift',
        value: shift?.shiftUuid
      };
    });

    return [{ field: 'Shift', value: shiftValues }];
  };

  const [formData, setFormData] = useState({
    name: data?.name || "",
    color: data?.color || "#3B82F6",
    icon: data?.icon || "Coffee",
    type: data?.type || "paid",
    fromTime: data?.fromTime || "",
    toTime: data?.toTime || "",
    effectiveDate: data?.effectiveDate || "",
    applicableFor: [{ field: 'Shift', value: [] }],
    typeDisplay: data?.typeDisplay,
    effectiveDateDisplay: data?.effectiveDateDisplay
  });

  const [showDropdown, setShowDropdown] = useState({
    color: false,
    icon: false
  });
  
  const dropdownRefs = useRef({});
  const fieldOptionsApplicableFor = ['Shift'];

  const availableIcons = [
    { name: "Coffee", component: Coffee },
    { name: "Timer", component: Timer },
    { name: "CloudSnow", component: CloudSnow },
    { name: "Hamburger", component: Hamburger },
    { name: "Lock", component: Lock },
    { name: "Bed", component: Bed },
    { name: "PaperPlaneRight", component: PaperPlaneRight },
    { name: "SmileyWink", component: SmileyWink }
  ];

  useEffect(() => {
    if (!shiftOptions || shiftOptions?.length === 0) {
      const access_token = localStorage.getItem("accessToken");
      fetchOrganizationSetting("shift", access_token, false, null, true);
    }
  }, []);

  // Fetch available shifts for attendance-break
  useEffect(() => {
    // Reset filteredShiftOptions first to prevent showing old data
    setFilteredShiftOptions([]);
    
    const fetchShifts = async () => {
      const access_token = localStorage.getItem("accessToken");
      await fetchAvailableShifts(access_token, "attendance-break", isUpdate ? tempUuid : null);
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
    if (data?.applicableShifts && data?.applicableShifts?.length > 0) {
      const transformedApplicableFor = transformDataToFormStructure(data);
      setFormData(prev => ({
        ...prev,
        applicableFor: transformedApplicableFor
      }));
    }
  }, [data?.applicableShifts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const activeDropdowns = Object.keys(showDropdown).filter(key => showDropdown[key]);
      for (const dropdownKey of activeDropdowns) {
        const dropdownElement = dropdownRefs?.current?.[dropdownKey];
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
      [key]: !prev?.[key]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getOptionsForField = (fieldType) => {
    switch(fieldType) {
      case 'Shift':
        // Always use filtered shifts (available shifts for attendance-break)
        // Don't fallback to shiftOptions to prevent showing used shifts
        return filteredShiftOptions || [];
      default:
        return [];
    }
  };

  const getAllSelectedValues = (excludeIndex = -1) => {
    const selectedValues = [];
    formData?.applicableFor?.forEach((criteria, index) => {
      if (index !== excludeIndex) {
        if (criteria?.value && Array.isArray(criteria?.value)) {
          selectedValues.push(...criteria?.value?.map(item => item?.value).filter(Boolean));
        }
      }
    });
    return selectedValues;
  };

  const getSelectedFields = (excludeIndex = -1) => {
    const selectedFields = [];
    formData?.applicableFor?.forEach((criteria, index) => {
      if (index !== excludeIndex && criteria?.field) {
        selectedFields.push(criteria?.field);
      }
    });
    return selectedFields;
  };

  const addCriteria = () => {
    const availableFields = fieldOptionsApplicableFor?.filter(field => 
      !formData?.applicableFor?.some(criteria => criteria?.field === field)
    );
    
    if (availableFields?.length > 0) {
      setFormData(prev => ({
        ...prev,
        applicableFor: [...(prev?.applicableFor || []), { field: availableFields[0], value: [] }]
      }));
    }
  };

  const removeCriteria = (index) => {
    setFormData(prev => ({
      ...prev,
      applicableFor: prev?.applicableFor?.filter((_, i) => i !== index) || []
    }));
  };

  const handleCriteriaChange = (index, field, value) => {
    const updatedCriteria = [...(formData?.applicableFor || [])];
    if (updatedCriteria?.[index]) {
      updatedCriteria[index][field] = value;
      if (field === 'field') {
        updatedCriteria[index].value = [];
      }
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
    const currentValues = formData?.applicableFor?.[index]?.value || [];
    const isAlreadySelected = currentValues?.some(item => item?.value === selectedOption?.value);
    
    if (!isAlreadySelected && selectedOption) {
      const newValues = [...currentValues, selectedOption];
      handleCriteriaChange(index, 'value', newValues);
    }
  };

  const removeSelectedValue = (criteriaIndex, valueToRemove) => {
    const currentValues = formData?.applicableFor?.[criteriaIndex]?.value || [];
    const newValues = currentValues?.filter(item => item?.value !== valueToRemove?.value);
    handleCriteriaChange(criteriaIndex, 'value', newValues);
  };

  const handleSubmit = async () => {
    if (!formData?.name?.trim()) {
      toast.error("Please enter break name", {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
        theme: "colored"
      });
      return;
    }

    if (!formData?.fromTime || !formData?.toTime) {
      toast.error("Please set start and end time", {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
        theme: "colored"
      });
      return;
    }

    const hasSelectedShifts = formData?.applicableFor?.some(criteria => 
      criteria?.value && criteria?.value?.length > 0
    );

    if (!hasSelectedShifts) {
      toast.error("Please select at least one applicable shift", {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
        theme: "colored"
      });
      return;
    }

    const access_token = localStorage.getItem("accessToken");
    let response;
    if(isUpdate){
      response = await updateLeaveAndAttendance(formData, access_token, "attendance-break", tempUuid);
    }else{
      response = await createLeaveAndAttendance(formData, access_token, "attendance-break");
    }
    if(response){
      await fetchLeaveAndAttendance(access_token, "attendance-break", 1);
      toast.success(response, {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
        theme: "colored"
      });
      handleShowForm("Break");
    }
  };

  const calculateDuration = () => {
    if (formData?.fromTime && formData?.toTime) {
      const from = new Date(`2000-01-01T${formData?.fromTime}:00`);
      const to = new Date(`2000-01-01T${formData?.toTime}:00`);
      if (to < from) {
        to.setDate(to.getDate() + 1);
      }
      const diffMs = to - from;
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffHrs.toString().padStart(2, '0')}.${diffMins.toString().padStart(2, '0')} hrs`;
    }
    return "00.00 hrs";
  };

  const SelectedIconComponent = availableIcons?.find(icon => icon?.name === formData?.icon)?.component || Coffee;

  return (
    <div className="w-full h-screen overflow-y-auto flex items-start justify-normal pb-32">
      <div className="w-1/2">
        <div className="w-full space-y-6 bg-white p-6">
          {/* Name, Color, and Icon */}
          <div className="flex items-center justify-start space-x-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData?.name || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter break name"
              />
            </div>

            {/* Color Picker */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                  style={{ backgroundColor: formData?.color || "#3B82F6" }}
                  onClick={() => toggleDropdown('color')}
                />
                {showDropdown?.color && (
                  <div className="w-[200px] absolute z-30 top-full mt-2 bg-white border rounded-lg shadow-lg p-2">
                    <div className="grid grid-cols-4 gap-2">
                      {colorOptions?.map((color, index) => (
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

            {/* Icon Picker */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Icon
              </label>
              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer flex items-center justify-center hover:bg-gray-50"
                  onClick={() => toggleDropdown('icon')}
                >
                  <SelectedIconComponent size={20} color="#6B7280" />
                </div>
                {showDropdown?.icon && (
                  <div className="w-[200px] absolute z-30 top-full mt-2 bg-white border rounded-lg shadow-lg p-2">
                    <div className="grid grid-cols-4 gap-2">
                      {availableIcons?.map((icon) => {
                        const IconComponent = icon?.component;
                        return (
                          <div
                            key={icon?.name}
                            className={`w-8 h-8 rounded cursor-pointer border-2 hover:border-gray-400 transition-colors flex items-center justify-center ${
                              formData?.icon === icon?.name ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                            }`}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, icon: icon?.name }));
                            }}
                          >
                            <IconComponent size={16} color={formData?.icon === icon?.name ? '#3B82F6' : '#6B7280'} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Type */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="paid"
                  checked={formData?.type === "paid"}
                  onChange={(e) => handleRadioChange("type", e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Paid</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="unpaid"
                  checked={formData?.type === "unpaid"}
                  onChange={(e) => handleRadioChange("type", e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Unpaid</span>
              </label>
            </div>
          </div>

          {/* Start Time - End Time */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Start time - End time</label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">Start time</label>
                <input
                  type="time"
                  name="fromTime"
                  value={formData?.fromTime || ""}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">End time</label>
                <input
                  type="time"
                  name="toTime"
                  value={formData?.toTime || ""}
                  onChange={handleChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="text-sm text-gray-600">
                {calculateDuration()}
              </div>
            </div>
          </div>

          {/* Applicable Shifts */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Applicable shifts <span className="text-red-500">*</span>
            </label>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              {formData?.applicableFor?.map((criteria, index) => {
                const availableOptions = getOptionsForField(criteria?.field);
                const selectedValuesFromOtherCriteria = getAllSelectedValues(index);
                
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700 min-w-[60px]">Shift is</span>

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
                              {selectedItem?.label || 'Unknown Shift'}
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
                            Select shifts
                          </span>
                        )}
                        <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      
                      {showDropdown?.[`value-${index}`] && (
                        <div className="dropdown-content absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {availableOptions?.length > 0 ? (
                            availableOptions
                              ?.filter(option => !selectedValuesFromOtherCriteria?.includes(option?.value))
                              ?.map((option) => {
                                const isSelectedInCurrentCriteria = criteria?.value?.some(item => item?.value === option?.value);
                                
                                return (
                                  <button
                                    key={option?.value}
                                    type="button"
                                    onClick={() => handleValueSelect(index, option)}
                                    disabled={isSelectedInCurrentCriteria}
                                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                                      isSelectedInCurrentCriteria ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
                                    }`}
                                  >
                                    {option?.label || 'Unknown Shift'} {isSelectedInCurrentCriteria && '✓'}
                                  </button>
                                );
                              })
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No shifts available
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="w-8"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Effective Date - TAMBAH SECTION INI */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Effective date of policy for absent records
            </label>
            <p className="text-sm text-gray-500">
              Select the date from which the absent records of your employees should be updated based on the policy defined above
            </p>
            <div className="relative w-48">
              <input
                type="date"
                name="effectiveDate"
                value={formData?.effectiveDate || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p>{`Tool tip : Break effective from ${formData?.effectiveDateDisplay} with`} <span className="capitalize">{`${formData?.typeDisplay}`}</span>.</p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-start space-x-4 p-6 border-t bg-white flex-shrink-0">
            <ButtonReusable 
              title={isUpdate ? 'Update Break' : 'Create Break'} 
              action={handleSubmit} 
              isBLue={true} 
            />
            <ButtonReusable 
              title={"Cancel"} 
              action={() => handleShowForm("Break")} 
              isBLue={false} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormAttendanceBreak;