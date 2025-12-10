import { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import { applicableToOptions } from "../../../../../data/dummy";
import organizationStoreManagements from "../../../../store/tdPayroll/setting/organization";
import leaveAndAttendanceStoreManagements from "../../../../store/tdPayroll/setting/leaveAndAttendance";
import { generateMonthOptions } from "../../../../../helper/globalHelper";

// ✅ HELPER FUNCTIONS DI ATAS
const ensureArray = (value) => Array.isArray(value) ? value : [];

const getDisplayText = (item) => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
        return item.label || item.name || item.value || String(item);
    }
    return String(item || '');
};

const getValue = (item) => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
        return item.value || item.id || item.name || String(item);
    }
    return String(item || '');
};

function Applicable({formData, setFormData, setShowDropdown, showDropdown, handleDropdownSelect, setShowSelectDropdown, selectDropdownRef, showSelectDropdown, dropdownRef, isPriorPayrun = false, isToggle=false, handleToggle, entityType = null, excludeUuid = null}) {
    const { 
        departementOptions, 
        fetchOrganizationSetting, 
        employmentTypeOptions,
        shiftOptions,
        employeeOptions
    } = organizationStoreManagements();
    const { fetchAvailableShifts, availableShifts } = leaveAndAttendanceStoreManagements();
    const [filteredShiftOptions, setFilteredShiftOptions] = useState([]);

    // ✅ PRIOR PAYRUN MONTHS
    const monthOptions = generateMonthOptions();

    // ✅ ORIGINAL FLOW - FETCH DATA HANYA KALAU BUKAN PRIOR PAYRUN
    useEffect(() => {
        if(isPriorPayrun) return;
        if(departementOptions?.length === 0) {
            const access_token = localStorage.getItem("accessToken");
            fetchOrganizationSetting("departement", access_token, false, null, true);
        }
    }, []);

    useEffect(() => {
        if(isPriorPayrun) return;
        if(employmentTypeOptions?.length === 0) {
            const access_token = localStorage.getItem("accessToken");
            fetchOrganizationSetting("employee-type", access_token, false, null, true);
        }
    }, []);

    useEffect(() => {
        if(isPriorPayrun) return;
        if(shiftOptions?.length === 0) {
            const access_token = localStorage.getItem("accessToken");
            fetchOrganizationSetting("shift", access_token, false, null, true);
        }
    }, []);

    // Fetch available shifts when entityType is provided (fetch early for create mode)
    useEffect(() => {
        if (isPriorPayrun || !entityType) {
            setFilteredShiftOptions([]);
            return;
        }
        
        // Reset filteredShiftOptions first to prevent showing old data
        setFilteredShiftOptions([]);
        
        const fetchShifts = async () => {
            const access_token = localStorage.getItem("accessToken");
            await fetchAvailableShifts(access_token, entityType, excludeUuid);
        };
        
        fetchShifts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entityType, excludeUuid, isPriorPayrun]);

    // Update filtered shift options when availableShifts change (update immediately, don't wait for applicableTo)
    useEffect(() => {
        if (entityType && availableShifts !== undefined) {
            // Use availableShifts if entityType is provided and shifts have been fetched
            setFilteredShiftOptions(availableShifts);
        } else if (!entityType) {
            // No entityType, use all shifts
            setFilteredShiftOptions(shiftOptions || []);
        } else {
            // entityType provided but shifts not fetched yet, wait
            setFilteredShiftOptions([]);
        }
    }, [entityType, availableShifts, shiftOptions]);

    useEffect(() => {
        if(isPriorPayrun) return;
        if(employeeOptions?.length === 0) {
            const access_token = localStorage.getItem("accessToken");
            fetchOrganizationSetting("employee", access_token, false, null, true);
        }
    }, []);

    // ✅ ORIGINAL FLOW
    const getOptionsForApplicable = () => {
        switch(formData?.applicableTo) {
            case 'Department':
                return departementOptions || [];
            case 'Shift':
                // Always use filtered shifts if entityType is provided (even if empty array)
                // Don't fallback to shiftOptions to prevent showing used shifts
                if (entityType) {
                    return filteredShiftOptions || [];
                } else {
                    // No entityType, use all shifts
                    return shiftOptions || [];
                }
            case 'Employment Type':
                return employmentTypeOptions || [];
            case 'User':
                return employeeOptions || [];
            default:
                return [];
        }
    };

    // ✅ PRIOR PAYRUN FLOW - HANDLE MONTH SELECTION
    const handlePriorPayrunSelect = (selectedMonth) => {
        const currentValues = ensureArray(formData?.selectValue);
        
        if (!currentValues.includes(selectedMonth)) {
            setFormData(prev => ({
                ...prev,
                selectValue: [...currentValues, selectedMonth]
            }));
        }
    };

    const handleApplicableToSelect = (field, value) => {
        if (field === 'applicableTo' && formData?.applicableTo !== value) {
            setFormData(prev => ({
                ...prev,
                applicableTo: value,
                selectValue: []
            }));
        } else {
            handleDropdownSelect(field, value);
        }
        setShowDropdown(false);
    };

    const handleValueSelect = (selectedOption) => {
        const currentValues = ensureArray(formData?.selectValue);
        const selectedValue = getValue(selectedOption);
        
        const isAlreadySelected = currentValues.some(item => 
            getValue(item) === selectedValue
        );
        
        if (!isAlreadySelected) {
            const newValues = [...currentValues, selectedOption];
            setFormData(prev => ({
                ...prev,
                selectValue: newValues
            }));
        }
    };

    const removeSelectedValue = (valueToRemove) => {
        const currentValues = ensureArray(formData?.selectValue);
        let newValues;

        if(isPriorPayrun) {
            newValues = currentValues.filter(item => item !== valueToRemove);
        } else {
            const removeValue = getValue(valueToRemove);
            newValues = currentValues.filter(item => getValue(item) !== removeValue);
        }
        
        setFormData(prev => ({
            ...prev,
            selectValue: newValues
        }));
    };

    const currentOptions = isPriorPayrun ? monthOptions : getOptionsForApplicable();

    return (
        <div className="space-y-2">
            <label className={`flex text-base font-medium text-gray-700 items-center justify-start space-x-5 ${isToggle && "mb-5"}`}>
                <p>{isPriorPayrun ? 'Prior Payroll' : 'Applicable to'} <span className="text-red-500">*</span></p>
                {isToggle && (
                    isPriorPayrun && (
                        <div className="flex items-center h-full">
                            <button
                                onClick={handleToggle}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                formData?.priorPayrunStatus ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                            >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                formData?.priorPayrunStatus ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                            </button>
                        </div>
                    )
                )}
            </label>
            {!isPriorPayrun || formData?.priorPayrunStatus ? (
                <div className="flex space-x-3 items-start">
                    {/* Left Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="bg-gray-100 border border-gray-300 rounded-md px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                        >
                            {isPriorPayrun ? 'Configure Prior Payroll' : (formData?.applicableTo || 'Select type')}
                            <svg className="inline ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {showDropdown && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto">
                                {isPriorPayrun ? (
                                    <div
                                        onClick={() => setShowDropdown(false)}
                                        className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                                    >
                                        Prior Payrun
                                    </div>
                                ) : (
                                    applicableToOptions.map((option) => (
                                        <div
                                            key={option}
                                            onClick={() => handleApplicableToSelect('applicableTo', option)}
                                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                                        >
                                            {getDisplayText(option)}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>


                    <span className="flex items-center text-gray-600 mt-2">is</span>


                    {/* Right Dropdown */}
                    <div className="relative flex-1" ref={selectDropdownRef}>
                        {/* Selected Values Display */}
                        <div 
                            className="min-h-[40px] px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer flex flex-wrap gap-2 items-center"
                            onClick={() => setShowSelectDropdown(!showSelectDropdown)}
                        >
                            {ensureArray(formData?.selectValue).length > 0 ? (
                                ensureArray(formData?.selectValue).map((selectedItem, index) => (
                                    <span 
                                        key={`selected-${index}-${isPriorPayrun ? selectedItem : getValue(selectedItem)}`}
                                        className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800"
                                    >
                                        {isPriorPayrun ? selectedItem : getDisplayText(selectedItem)}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeSelectedValue(selectedItem);
                                            }}
                                            className="ml-1 hover:text-blue-600"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400 text-sm">
                                    {isPriorPayrun ? 'Select months' : `Select ${formData?.applicableTo?.toLowerCase() || 'options'}`}
                                </span>
                            )}
                            <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        
                        {/* Dropdown Options */}
                        {showSelectDropdown && (
                            isPriorPayrun ? (
                                // ✅ PRIOR PAYRUN GRID LAYOUT
                                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md p-3 ring-1 ring-black ring-opacity-5">
                                    <div className="grid grid-cols-2 gap-2">
                                        {monthOptions.map((month) => {
                                            const isSelected = ensureArray(formData?.selectValue).includes(month);
                                            
                                            return (
                                                <button
                                                    key={month}
                                                    type="button"
                                                    onClick={() => handlePriorPayrunSelect(month)}
                                                    className={`px-3 py-2 text-sm rounded text-left hover:bg-blue-50 ${
                                                        isSelected 
                                                            ? 'bg-blue-100 text-blue-800 font-medium' 
                                                            : 'bg-gray-50 text-gray-700 border border-gray-200'
                                                    }`}
                                                >
                                                    {month} {isSelected && '✓'}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                // ✅ ORIGINAL FLOW
                                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto">
                                    {currentOptions?.length > 0 ? (
                                        currentOptions?.map((option, index) => {
                                            const optionValue = getValue(option);
                                            const isSelected = ensureArray(formData?.selectValue).some(item => 
                                                getValue(item) === optionValue
                                            );
                                            
                                            return (
                                                <div
                                                    key={`option-${index}-${optionValue}`}
                                                    onClick={() => handleValueSelect(option)}
                                                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${
                                                        isSelected ? 'bg-gray-100 text-gray-400' : ''
                                                    }`}
                                                >
                                                    {getDisplayText(option)} {isSelected && '✓'}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="px-3 py-2 text-sm text-gray-500">
                                            {formData?.applicableTo === 'Department' 
                                                ? 'No departments available' 
                                                : `No ${formData?.applicableTo?.toLowerCase() || 'options'} available`
                                            }
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default Applicable;
