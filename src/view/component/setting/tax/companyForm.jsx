import { useEffect, useState } from "react";
import Select from "react-select";
import taxStoreManagements from "../../../../store/tdPayroll/setting/tax";
import { toast } from "react-toastify";
import employeeStoreManagements from "../../../../store/tdPayroll/employee";
import { CustomToast } from "../../customToast";

function CompanyForm({setShowForm}) {
    const { createTax, fetchTax, taxCompanyData, updateTax, clearTaxData } = taxStoreManagements()
    const { getEmployeeOverview, dataEmployeesOptions } = employeeStoreManagements();
    const [formData, setFormData] = useState({
        rocNumber: '',
        incorporationDate: '',
        tapAccountNo: '',
        scpAccountNo: '',
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
        if (taxCompanyData) {
            const incorporationDate = taxCompanyData?.incorporationDate 
                ? new Date(taxCompanyData.incorporationDate).toISOString().split('T')[0] 
                : '';
            setFormData({
                rocNumber: taxCompanyData?.rocNumber || '',
                incorporationDate: incorporationDate,
                tapAccountNo: taxCompanyData?.tapAccountNo || '',
                scpAccountNo: taxCompanyData?.scpAccountNo || '',
                taxPaymentFrequency: taxCompanyData?.taxPaymentFrequency || 'Monthly',
                deductorTypeSection: taxCompanyData?.isEmployee ? 'Employee' : 'Non-Employee',
                deductorName: taxCompanyData?.deductorName || '',
                deductorIdNumber: taxCompanyData?.deductorIdNumber || '',
                deductorDesignation: taxCompanyData?.deductorDesignation || '',
                deductorType: taxCompanyData?.deductorType || '',
                deductorUuid: taxCompanyData?.deductorUuid || ''
            });
        } else {
            const access_token = localStorage.getItem("accessToken");
            fetchTax(access_token, "company");
        }
    }, [taxCompanyData, dataEmployeesOptions]); 
    
    const handleInputChange = (field, value, additionalInfo) => {
        if (field === 'deductorTypeSection') {
            if (value === 'Employee') {
                setFormData(prev => ({
                    ...prev,
                    [field]: value,
                    deductorIdNumber: taxCompanyData?.isEmployee ? taxCompanyData?.deductorIdNumber : "",
                    deductorName: "",
                    deductorUuid: ""
                }));
            } else if (value === 'Non-Employee') {
                setFormData(prev => ({
                    ...prev,
                    [field]: value,
                    deductorIdNumber: !taxCompanyData?.isEmployee ? taxCompanyData?.deductorIdNumber : "",
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

    const handleSubmit = async() => {
        const body = { 
            ...formData, 
            deductorIdNumber: formData?.deductorIdNumber ? String(formData.deductorIdNumber) : "",
            isEmployee: formData?.deductorTypeSection === 'Employee' ? true : false 
        };
        const access_token = localStorage.getItem("accessToken");
        let response;
        // ✅ Check if taxCompanyData exists AND has uuid to determine update vs create
        if(taxCompanyData && taxCompanyData?.uuid){
            response = await updateTax(body, access_token, "company", taxCompanyData.uuid)
        }else{
            response = await createTax(body, access_token, "company")
        }
        if(response){
            await fetchTax(access_token, "company");
            await fetchTax(access_token, "tax"); // Refresh taxData for display
            await clearTaxData("individual");
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
    return (
        <div className="">
            <div className="space-y-6">
                {/* Company Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ROC Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.rocNumber}
                            onChange={(e) => handleInputChange('rocNumber', e.target.value.toUpperCase())}
                            placeholder="RC/00007538"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            maxLength={11}
                        />
                        <div className="text-xs text-gray-500 mt-1 w-full flex items-center justify-end">{formData.rocNumber.length}/11</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Incorporation Date
                        </label>
                        <input
                            type="date"
                            value={formData.incorporationDate}
                            onChange={(e) => handleInputChange('incorporationDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            TAP Account No <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.tapAccountNo}
                            onChange={(e) => handleInputChange('tapAccountNo', e.target.value)}
                            placeholder="000075381"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            maxLength={9}
                        />
                        <div className="text-xs text-gray-500 mt-1 w-full flex items-center justify-end">{formData.tapAccountNo.length}/9</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            SCP Account No <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.scpAccountNo}
                            onChange={(e) => handleInputChange('scpAccountNo', e.target.value)}
                            placeholder="000075381"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            maxLength={9}
                        />
                        <div className="text-xs text-gray-500 mt-1 w-full flex items-center justify-end">{formData.scpAccountNo.length}/9</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tax Payment Frequency <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.taxPaymentFrequency}
                            onChange={(e) => handleInputChange('taxPaymentFrequency', e.target.value)}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                        />
                    </div>
                </div>

                {/* Tax Deductor Details */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4 text-gray-800">Tax Deductor Details</h3>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Deductor's Type
                        </label>
                        <div className="flex space-x-6">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="deductorTypeSection"
                                    value="Employee"
                                    checked={formData.deductorTypeSection === 'Employee'}
                                    onChange={(e) => handleInputChange('deductorTypeSection', e.target.value)}
                                    className="mr-2 text-blue-600"
                                />
                                Employee
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="deductorTypeSection"
                                    value="Non-Employee"
                                    checked={formData.deductorTypeSection === 'Non-Employee'}
                                    onChange={(e) => handleInputChange('deductorTypeSection', e.target.value)}
                                    className="mr-2 text-blue-600"
                                />
                                Non-Employee
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {formData.deductorTypeSection !== 'Non-Employee' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deductor's Name
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
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    isClearable
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deductor's Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.deductorName}
                                    onChange={(e) => handleInputChange('deductorName', e.target.value)}
                                    placeholder="Enter deductor's name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deductor's ID Number
                            </label>
                            <input
                                type="text"
                                value={formData.deductorIdNumber}
                                onChange={(e) => handleInputChange('deductorIdNumber', e.target.value)}
                                placeholder="Enter Deductor's ID Number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {formData.deductorTypeSection === 'Non-Employee' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Deductor's Designation
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.deductorDesignation}
                                        onChange={(e) => handleInputChange('deductorDesignation', e.target.value)}
                                        placeholder="Enter designation"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        isClearable
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Submit Section */}
                <div className="flex justify-between items-center pt-6 border-t">
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                    >
                        Save
                    </button>
                    <p className="text-sm text-gray-500">
                        <span className="text-red-500">* Indicates mandatory fields</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CompanyForm;