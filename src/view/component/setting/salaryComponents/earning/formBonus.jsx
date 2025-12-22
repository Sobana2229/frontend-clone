import ReuseableInput from "../../../reuseableInput";

function FormCustomBonus({formData, setFormData, handleInputChange, earningType }) {
    const handlePayTypeChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            payType: value,
            isSalaryStructure: value === 'Fixed Pay' ? true : false,
            isTaxable: value === 'Variable Pay' ? true : false,
            isProRataBasis: value === 'Fixed Pay' ? true : false,
            considerSpk: value === 'Fixed Pay' ? true : false,
            showInPayslip: true
        }));
    };

    const handleSpkChange = (e) => {
        const { checked } = e.target;
        setFormData(prev => ({
            ...prev,
            considerSpk: checked,
            spkContribution: checked ? 'Always' : 'Only when PF Wage is less than $ 15,000'
        }));
    };
    
    return (
        <div className="flex gap-8">
            {/* Left Column - Main Fields */}
            <div className="space-y-4" style={{ width: '750px', flexShrink: 0 }}>
                {/* Earning Name */}
                <div>
                    <ReuseableInput
                        label="Earning Name"
                        id="earningName"
                        name="earningName"
                        value={formData.earningName}
                        onChange={handleInputChange}
                        isFocusRing={false}
                        isBorderLeft={true}
                    />
                </div>

                {/* Name in Payslip */}
                <div>
                    <ReuseableInput
                        label="Name in Payslip"
                        id="nameInPayslip"
                        name="nameInPayslip"
                        value={formData.nameInPayslip}
                        onChange={handleInputChange}
                        isFocusRing={false}
                        isBorderLeft={true}
                    />
                </div>

                {/* Mark as Active */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                        Mark this as Active
                    </label>
                </div>
            </div>

            {/* Right Column - Other Configurations */}
            <div className="space-y-4 bg-blue-td-50 rounded-lg p-6">
                <h3 className="text-base font-semibold text-blue-td-600 mb-6">Other Configurations</h3>
                
                {/* Make this earning a part of employee's salary structure */}
                <div className="flex items-start space-x-3">
                    <input
                        type="checkbox"
                        id="isSalaryStructure"
                        name="isSalaryStructure"
                        checked={formData.isSalaryStructure}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <label htmlFor="isSalaryStructure" className="text-sm text-black">
                        Make this earning a part of the employee's salary structure
                    </label>
                </div>

                {/* schedule */}
                <div className="flex items-start space-x-3">
                    <input
                        type="checkbox"
                        id="isSchedule"
                        name="isSchedule"
                        checked={formData.isSchedule}
                        disabled
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <label htmlFor="isSchedule" className="text-sm text-black">
                        This is a scheduled earning
                    </label>
                </div>

                {/* Taxable earning */}
                <div className="flex items-start space-x-3">
                    <input
                        type="checkbox"
                        id="isTaxable"
                        name="isTaxable"
                        checked={formData.isTaxable}
                        disabled
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <div>
                        <label htmlFor="isTaxable" className="text-sm text-black">
                            This is a taxable earning
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                            The income tax amount will be divided equally and deducted every month across the financial year.
                        </p>
                    </div>
                </div>

                {earningType == "Bonus" && (
                    <>
                        {/* Tax Deduction Preference - Only show if taxable */}
                        <div className="ml-7 space-y-2">
                            <label className="block text-sm font-medium text-black">
                                Tax Deduction Preference <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="deductSubsequent"
                                        name="taxDeductionPreference"
                                        value="subsequent"
                                        checked={formData.taxDeductionPreference === 'subsequent'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <div className="ml-2">
                                        <label htmlFor="deductSubsequent" className="text-sm text-black">
                                            Deduct tax in subsequent payrolls of the financial year
                                        </label>
                                        <p className="text-xs text-gray-500">
                                            The income tax amount will be divided equally and deducted every month across the financial year.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="deductSame"
                                        name="taxDeductionPreference"
                                        value="same"
                                        checked={formData.taxDeductionPreference === 'same'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <div className="ml-2">
                                        <label htmlFor="deductSame" className="text-sm text-black">
                                            Deduct tax in same payroll
                                        </label>
                                        <p className="text-xs text-gray-500">
                                            The entire income tax amount will be deducted when it is paid to the employee.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Consider for Spk Contribution - Only available for Basic */}
                {/* <div className="flex items-start space-x-3">
                    <input
                        type="checkbox"
                        id="considerSpk"
                        name="considerSpk"
                        checked={formData.considerSpk}
                        onChange={handleSpkChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <div>
                        <label htmlFor="considerSpk" className="text-sm text-black">
                            Consider for Spk Contribution
                        </label>
                        {formData.considerSpk && (
                            <div className="mt-2 space-y-1">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="SpkAlways"
                                        name="spkContribution"
                                        value="Always"
                                        checked={formData.spkContribution === 'Always'}
                                        onChange={handleInputChange}
                                        className="w-3 h-3 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="SpkAlways" className="ml-2 text-xs text-gray-600">
                                        Always
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div> */}

                {/* Show this component in payslip */}
                <div className="flex items-start space-x-3">
                    <input
                        type="checkbox"
                        id="showInPayslip"
                        name="showInPayslip"
                        disabled
                        checked={formData.showInPayslip}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <label htmlFor="showInPayslip" className="text-sm text-black">
                        Show this component in payslip
                    </label>
                </div>
            </div>
        </div>
    );
}

export default FormCustomBonus;