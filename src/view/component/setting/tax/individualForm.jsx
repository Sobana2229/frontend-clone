import { useEffect, useState } from "react";
import { CaretDown, Calendar } from "@phosphor-icons/react";
import Select from "react-select";
import { toast } from "react-toastify";
import taxStoreManagements from "../../../../store/tdPayroll/setting/tax";
import employeeStoreManagements from "../../../../store/tdPayroll/employee";
import { CustomToast } from "../../customToast";

function IndividualForm({setShowForm}) {
    const { createTax, fetchTax, taxIndividualData, updateTax, clearTaxData } = taxStoreManagements();
    const { getEmployeeOverview, dataEmployeesOptions } = employeeStoreManagements();
    const [formData, setFormData] = useState({
        ieNumber: '',
        registerDate: '',
        tapAccountNo: '',
        scpAccountNo: '',
        individualEmployerName: '',
        rocNumber: '',
        taxPaymentFrequency: 'Monthly',
        deductorTypeSection: 'Employee',
        deductorName: '',
        deductorIdNumber: '',
        deductorDesignation: '',
        deductorType: '',
        deductorUuid: ''
    });

    useEffect(() => {
        if (!dataEmployeesOptions) {
            const access_token = localStorage.getItem("accessToken");
            getEmployeeOverview(access_token, "employeeOptions");
        }
    }, []);

    useEffect(() => {
        if (taxIndividualData) {
            const registerDate = taxIndividualData?.registerDate 
                ? new Date(taxIndividualData.registerDate).toISOString().split('T')[0] 
                : '';
            setFormData({
                ieNumber: taxIndividualData?.ieNumber || '',
                registerDate: registerDate,
                tapAccountNo: taxIndividualData?.tapAccountNo || '',
                scpAccountNo: taxIndividualData?.scpAccountNo || '',
                individualEmployerName: taxIndividualData?.individualEmployerName || '',
                rocNumber: taxIndividualData?.rocNumber || '',
                taxPaymentFrequency: taxIndividualData?.taxPaymentFrequency || 'Monthly',
                deductorTypeSection: taxIndividualData?.isEmployee ? 'Employee' : 'Non-Employee',
                deductorName: taxIndividualData?.deductorName || '',
                deductorIdNumber: taxIndividualData?.deductorIdNumber || '',
                deductorDesignation: taxIndividualData?.deductorDesignation || '',
                deductorType: taxIndividualData?.deductorType || '',
                deductorUuid: taxIndividualData?.deductorUuid || ''
            });
        } else {
            const access_token = localStorage.getItem("accessToken");
            fetchTax(access_token, "individual");
        }
    }, [taxIndividualData, dataEmployeesOptions]);

    const handleInputChange = (field, value, additionalInfo) => {
        if (field === 'deductorTypeSection') {
            if (value === 'Employee') {
                setFormData(prev => ({
                    ...prev,
                    [field]: value,
                    deductorIdNumber: taxIndividualData?.isEmployee ? taxIndividualData?.deductorIdNumber : "",
                    deductorName: "",
                    deductorUuid: "" 
                }));
            } else if (value === 'Non-Employee') {
                setFormData(prev => ({
                    ...prev,
                    [field]: value,
                    deductorIdNumber: !taxIndividualData?.isEmployee ? taxIndividualData?.deductorIdNumber : "",
                    deductorName: "",
                    deductorUuid: ""
                }));
            }
        } else if (field === 'deductorUuid') {
            const selectedOption = dataEmployeesOptions?.find(opt => opt.value === value);
            setFormData(prev => ({
                ...prev,
                deductorUuid: value,
                deductorName: selectedOption?.label || "",
                deductorIdNumber: additionalInfo || selectedOption?.additionalInfo || ""
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSubmit = async () => {
        const body = { 
            ...formData, 
            deductorIdNumber: formData?.deductorIdNumber ? String(formData.deductorIdNumber) : "",
            isEmployee: formData.deductorTypeSection === 'Employee' 
        };
        const access_token = localStorage.getItem("accessToken");
        let response;

        // ✅ Check if taxIndividualData exists AND has uuid to determine update vs create
        if (taxIndividualData && taxIndividualData?.uuid) {
            response = await updateTax(body, access_token, "individual", taxIndividualData.uuid);
        } else {
            response = await createTax(body, access_token, "individual");
        }

        if (response) {
            await fetchTax(access_token, "individual");
            await fetchTax(access_token, "tax"); // Refresh taxData for display
            await clearTaxData("company");
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
            setShowForm(false);
        }
    };

    // Custom Select Styles
    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '42px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            boxShadow: 'none',
            '&:hover': {
                border: '1px solid #d1d5db'
            },
            '&:focus-within': {
                border: '1px solid #3b82f6',
                boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)'
            }
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#9ca3af',
            fontSize: '14px'
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#6b7280',
            '&:hover': {
                color: '#6b7280'
            }
        })
    };

    return (
        <div className="space-y-8">
            {/* Individual Information */}
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    Individual Employer Name<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.individualEmployerName}
                    onChange={(e) => handleInputChange('individualEmployerName', e.target.value)}
                    placeholder="Mubasir"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        IE Number<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.ieNumber}
                        onChange={(e) => handleInputChange('ieNumber', e.target.value.toUpperCase())}
                        placeholder="IE/00007538"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        maxLength={12}
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">{formData.ieNumber.length}/12</div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Register Date
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            value={formData.registerDate}
                            onChange={(e) => handleInputChange('registerDate', e.target.value)}
                            className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        TAP Account Number<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.tapAccountNo}
                        onChange={(e) => handleInputChange('tapAccountNo', e.target.value)}
                        placeholder="000075381"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        maxLength={9}
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">{formData.tapAccountNo.length}/9</div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        SCP Account Number<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.scpAccountNo}
                        onChange={(e) => handleInputChange('scpAccountNo', e.target.value)}
                        placeholder="000075381"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        maxLength={9}
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">{formData.scpAccountNo.length}/9</div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        ROC Number(obtain)
                    </label>
                    <input
                        type="text"
                        value={formData.rocNumber}
                        onChange={(e) => handleInputChange('rocNumber', e.target.value.toUpperCase())}
                        placeholder="RC/00007538"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        maxLength={11}
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">{formData.rocNumber.length}/11</div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Tax Payment Frequency<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.taxPaymentFrequency}
                        disabled
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-500 bg-gray-50 cursor-not-allowed"
                    />
                </div>
            </div>

            {/* Tax Deductor Details */}
            <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Tax Deductor Details</h3>
                
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                        Deductor's Type
                    </label>
                    <div className="flex items-center space-x-8">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <div className="relative">
                                <input
                                    type="radio"
                                    name="deductorTypeSection"
                                    value="Employee"
                                    checked={formData.deductorTypeSection === 'Employee'}
                                    onChange={(e) => handleInputChange('deductorTypeSection', e.target.value)}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                    formData.deductorTypeSection === 'Employee' 
                                        ? "border-blue-600 bg-blue-600" 
                                        : "border-gray-300 bg-white hover:border-gray-400"
                                }`}>
                                    {formData.deductorTypeSection === 'Employee' && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                            </div>
                            <span className="text-sm text-gray-700 font-medium">Employee</span>
                        </label>
                        
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <div className="relative">
                                <input
                                    type="radio"
                                    name="deductorTypeSection"
                                    value="Non-Employee"
                                    checked={formData.deductorTypeSection === 'Non-Employee'}
                                    onChange={(e) => handleInputChange('deductorTypeSection', e.target.value)}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                    formData.deductorTypeSection === 'Non-Employee' 
                                        ? "border-blue-600 bg-blue-600" 
                                        : "border-gray-300 bg-white hover:border-gray-400"
                                }`}>
                                    {formData.deductorTypeSection === 'Non-Employee' && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                            </div>
                            <span className="text-sm text-gray-700 font-medium">Non-Employee</span>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.deductorTypeSection !== 'Non-Employee' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Deductor's name
                            </label>
                            <Select
                                options={dataEmployeesOptions}
                                value={
                                    formData.deductorUuid && dataEmployeesOptions
                                    ? dataEmployeesOptions.find(opt => opt.value === formData.deductorUuid) || null
                                    : null
                                }
                                onChange={(selected) => {
                                    if (selected) {
                                        handleInputChange('deductorUuid', selected.value, selected.additionalInfo);
                                    } else {
                                        handleInputChange('deductorUuid', '', '');
                                    }
                                }}
                                placeholder="Select a Tax Deductor"
                                styles={customSelectStyles}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                isClearable
                                components={{
                                    DropdownIndicator: ({ ...props }) => (
                                        <div {...props.innerProps} className="px-2">
                                            <CaretDown className="h-4 w-4 text-gray-400" />
                                        </div>
                                    )
                                }}
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Deductor's name
                            </label>
                            <input
                                type="text"
                                value={formData.deductorName}
                                onChange={(e) => handleInputChange('deductorName', e.target.value)}
                                placeholder="Enter deductor's name"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Deductor's ID Number
                        </label>
                        <input
                            type="text"
                            value={formData.deductorIdNumber}
                            onChange={(e) => handleInputChange('deductorIdNumber', e.target.value)}
                            placeholder="Enter Deductor's ID Number"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                    </div>

                    {formData.deductorTypeSection === 'Non-Employee' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Deductor's Designation
                                </label>
                                <input
                                    type="text"
                                    value={formData.deductorDesignation}
                                    onChange={(e) => handleInputChange('deductorDesignation', e.target.value)}
                                    placeholder="Enter designation"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Deductor's ID Type
                                </label>
                                <Select
                                    options={[
                                        { value: "Red IC", label: "Red IC" },
                                        { value: "Green IC", label: "Green IC" },
                                        { value: "Purple IC", label: "Purple IC" },
                                        { value: "Yellow IC", label: "Yellow IC" }
                                    ]}
                                    value={formData.deductorType ? { value: formData.deductorType, label: formData.deductorType } : null}
                                    onChange={(selected) => handleInputChange('deductorType', selected?.value || '')}
                                    placeholder="Select ID Type"
                                    styles={customSelectStyles}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    isClearable
                                    components={{
                                        DropdownIndicator: ({ ...props }) => (
                                            <div {...props.innerProps} className="px-2">
                                                <CaretDown className="h-4 w-4 text-gray-400" />
                                            </div>
                                        )
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Submit Section */}
            <div className="flex justify-between items-center pt-6">
                <button
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                >
                    Save
                </button>
                <p className="text-sm text-gray-500">
                    <span className="text-red-500">* indicates mandatory fields</span>
                </p>
            </div>
        </div>
    );
}

export default IndividualForm;