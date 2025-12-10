import { Plus, TrashIcon, X } from "@phosphor-icons/react";
import { useRef, useEffect, useState } from "react";
import { employeeGenderOptions, fieldOptionsCriteriaBasedEmployees } from "../../../../../data/dummy";
import organizationStoreManagements from "../../../../store/tdPayroll/setting/organization";
import leaveAndAttendanceStoreManagements from "../../../../store/tdPayroll/setting/leaveAndAttendance";

function CriteriaBasedEmployees({formData, setFormData, toggleDropdown, showDropdown, entityType = "leave-types", excludeUuid = null}) {
    const { 
        departementOptions, 
        fetchOrganizationSetting, 
        cityOptions,
        designationOptions,
        shiftOptions
    } = organizationStoreManagements();
    const { fetchAvailableShifts, availableShifts } = leaveAndAttendanceStoreManagements();
    const [filteredShiftOptions, setFilteredShiftOptions] = useState([]);
    const dropdownRefs = useRef({});

    useEffect(() => {
        if(shiftOptions?.length === 0) {
        const access_token = localStorage.getItem("accessToken");
        fetchOrganizationSetting("shift", access_token, false, null, true);
        }
    }, []);

    // Fetch available shifts for leave-types
    useEffect(() => {
        // Reset filteredShiftOptions first to prevent showing old data
        setFilteredShiftOptions([]);
        
        const fetchShifts = async () => {
            const access_token = localStorage.getItem("accessToken");
            await fetchAvailableShifts(access_token, entityType, excludeUuid);
        };
        
        fetchShifts();
    }, [entityType, excludeUuid, fetchAvailableShifts]);

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
        if(designationOptions?.length === 0) {
            const access_token = localStorage.getItem("accessToken");
            fetchOrganizationSetting("designation", access_token, false, null, true);
        }
    }, []);

    useEffect(() => {
        if(departementOptions?.length === 0) {
            const access_token = localStorage.getItem("accessToken");
            fetchOrganizationSetting("departement", access_token, false, null, true);
        }
    }, []);

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
                    const closeEvent = { target: { closest: () => null } };
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
    }, [showDropdown, toggleDropdown]);

    const getOptionsForField = (fieldType) => {
        switch(fieldType) {
            // case 'Departments':
            //     return departementOptions || [];
            // case 'Locations':
            //     return cityOptions || [];
            // case 'Designations':
            //     return designationOptions || [];
            // case 'Gender':
            //     return employeeGenderOptions;
            case 'Shift':
                // Always use filtered shifts (available shifts for leave-types)
                // Don't fallback to shiftOptions to prevent showing used shifts
                return filteredShiftOptions || [];
            default:
                return [];
        }
    };

    const getAllSelectedValues = (excludeIndex = -1) => {
        const selectedValues = [];
        formData.criteriaBasedEmployees.forEach((criteria, index) => {
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
        formData.criteriaBasedEmployees.forEach((criteria, index) => {
            if (index !== excludeIndex && criteria.field) {
                selectedFields.push(criteria.field);
            }
        });
        return selectedFields;
    };

    const addCriteria = () => {
        setFormData(prev => ({
            ...prev,
            criteriaBasedEmployees: [...prev.criteriaBasedEmployees, { field: 'Shift', value: [] }]
        }));
    };

    const removeCriteria = (index) => {
        setFormData(prev => ({
            ...prev,
            criteriaBasedEmployees: prev.criteriaBasedEmployees.filter((_, i) => i !== index)
        }));
    };

    const handleCriteriaChange = (index, field, value) => {
        const updatedCriteria = [...formData.criteriaBasedEmployees];
        updatedCriteria[index][field] = value;
        if (field === 'field') {
            updatedCriteria[index].value = [];
        }
        
        setFormData(prev => ({
            ...prev,
            criteriaBasedEmployees: updatedCriteria
        }));
        
        if (field !== 'value') {
            toggleDropdown({});
        }
    };

    const handleValueSelect = (index, selectedOption) => {
        const currentValues = formData.criteriaBasedEmployees[index].value || [];
        const isAlreadySelected = currentValues.some(item => item.value === selectedOption.value);
        
        if (!isAlreadySelected) {
            const newValues = [...currentValues, selectedOption];
            handleCriteriaChange(index, 'value', newValues);
        }
    };

    const removeSelectedValue = (criteriaIndex, valueToRemove) => {
        const currentValues = formData.criteriaBasedEmployees[criteriaIndex].value || [];
        const newValues = currentValues.filter(item => item.value !== valueToRemove.value);
        handleCriteriaChange(criteriaIndex, 'value', newValues);
    };

    return (
        <div>
            <div className="space-y-3">
                {formData.criteriaBasedEmployees?.map((criteria, index) => {
                    const availableOptions = getOptionsForField(criteria.field);
                    const selectedValuesFromOtherCriteria = getAllSelectedValues(index);
                    const selectedFields = getSelectedFields(index);
                    return (
                        <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
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
                                        {fieldOptionsCriteriaBasedEmployees?.filter(option => !selectedFields.includes(option))?.map((option) => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => handleCriteriaChange(index, 'field', option)}
                                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        {fieldOptionsCriteriaBasedEmployees?.filter(option => !selectedFields?.includes(option))?.length === 0 && (
                                            <div className="px-3 py-2 text-sm text-gray-500">
                                                All field types are already selected
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* Operator Dropdown */}
                            <div 
                                className="relative"
                            >
                                <h1>is</h1>
                            </div>
                            {/* Value Multi-Select Dropdown */}
                            <div 
                                className="flex-1 relative"
                                ref={el => dropdownRefs.current[`value-${index}`] = el}
                            >
                                {/* Selected Values Display */}
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
                                            Select {criteria.field === 'Departments' ? 'Departments' : criteria.field === 'Shift' ? 'Shifts' : criteria.field === 'Designations' ? 'Designations' : 'Locations'}
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
                                                {criteria.field === 'Departments' ? 'No departments available' : criteria.field === 'Shift' ? 'No shifts available' : criteria.field === 'Designations' ? 'No designations available' : 'No locations available'}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* Remove Button */}
                            {formData.criteriaBasedEmployees?.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeCriteria(index)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <TrashIcon size={16} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
            {/* Add Criteria Button */}
            {/* {formData.criteriaBasedEmployees?.length !== 4 && (
                <button
                    type="button"
                    onClick={addCriteria}
                    className="mt-3 flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                    <Plus size={16} />
                    <span>Add Criteria</span>
                </button>
            )} */}
        </div>
    );
}

export default CriteriaBasedEmployees;