import ReuseableInput from "../../../reuseableInput";

function FormCustomAllowance({formData, setFormData, handleInputChange}) {
    const handlePayTypeChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            payType: value,
            isSalaryStructure: value === 'Fixed Pay' ? true : false,
            isTaxable: value === 'Variable Pay' ? true : false,
            isProRataBasis: value === 'Fixed Pay' ? true : false,
            considerSpk: value === 'Fixed Pay' ? true : false,
            isSchedule: value === 'One Time Pay' ? true : false, // ✅ Set isSchedule for One Time Pay
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Main Fields */}
            <div className="space-y-4">
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

                {/* Pay Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pay Type <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="fixedPay"
                                name="payType"
                                value="Fixed Pay"
                                checked={formData.payType === 'Fixed Pay'}
                                onChange={handlePayTypeChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <label htmlFor="fixedPay" className="ml-2 text-sm text-gray-700">
                                Fixed Pay (Fixed amount paid at the end of every month.)
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="variablePay"
                                name="payType"
                                value="Variable Pay"
                                checked={formData.payType === 'Variable Pay'}
                                onChange={handlePayTypeChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <label htmlFor="variablePay" className="ml-2 text-sm text-gray-700">
                                Variable Pay (Variable amount paid during any payroll.)
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="oneTimePay"
                                name="payType"
                                value="One Time Pay"
                                checked={formData.payType === 'One Time Pay'}
                                onChange={handlePayTypeChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <label htmlFor="oneTimePay" className="ml-2 text-sm text-gray-700">
                                1 Time Pay
                            </label>
                        </div>
                    </div>
                </div>

                {/* Calculation Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Calculation Type <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="flatAmount"
                                name="calculationType"
                                value="Flat Amount"
                                checked={formData.calculationType === 'Flat Amount'}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <label htmlFor="flatAmount" className="ml-2 text-sm text-gray-700">
                                Flat Amount
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="percentageOfBasic"
                                name="calculationType"
                                value="Percentage of Basic"
                                checked={formData.calculationType === 'Percentage of Basic'}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <label htmlFor="percentageOfBasic" className="ml-2 text-sm text-gray-700">
                                Percentage of Basic
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="customFormula"
                                name="calculationType"
                                value="Custom Formula"
                                checked={formData.calculationType === 'Custom Formula'}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <label htmlFor="customFormula" className="ml-2 text-sm text-gray-700">
                                Custom Formula
                            </label>
                        </div>
                    </div>
                </div>

                {/* Enter Amount / Percentage */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formData.calculationType === "Flat Amount" ? "Enter Amount" : 
                         formData.calculationType === "Custom Formula" ? "Custom Formula" : "Enter Percentage"}
                    </label>
                    
                    {formData.calculationType === "Flat Amount" ? (
                        <div className="relative">
                            <ReuseableInput
                                id="amount"
                                name="amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleInputChange}
                                isFocusRing={false}
                                isDollar={true}
                            />
                        </div>
                    ) : formData.calculationType === "Custom Formula" ? (
                        <textarea
                            name="customFormula"
                            value={formData.customFormula || ""}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                                    focus:border-transparent resize-none"
                            placeholder="Enter custom formula"
                        />
                    ) : (
                        <div className="relative">
                            <ReuseableInput
                                id="amount"
                                name="amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleInputChange}
                                isFocusRing={false}
                                isPercentage={true}
                            />
                        </div>
                    )}
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
                        disabled={formData?.payType == 'Fixed Pay' || formData?.payType === "One Time Pay"}
                        checked={formData.isSalaryStructure}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <label htmlFor="isSalaryStructure" className="text-sm text-black">
                        Make this earning a part of the employee's salary structure
                    </label>
                </div>

                {/* schedule - Only show for One Time Pay */}
                {formData?.payType === "One Time Pay" && (
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
                )}

                {/* Taxable earning */}
                <div className="flex items-start space-x-3">
                    <input
                        type="checkbox"
                        id="isTaxable"
                        name="isTaxable"
                        disabled={formData?.payType == 'Fixed Pay' || formData?.payType === "One Time Pay"}
                        checked={formData.isTaxable}
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

                {/* Tax Deduction Preference - Only show if taxable */}
                {(formData.isTaxable && formData?.payType == 'Variable Pay') && (
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
                )}

                {/* Calculate on pro-rata basis */}
                {formData?.payType != "Variable Pay" && (
                    <div className="flex items-start space-x-3">
                        <input
                            type="checkbox"
                            id="isProRataBasis"
                            name="isProRataBasis"
                            checked={formData.isProRataBasis}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                        />
                        <div>
                            <label htmlFor="isProRataBasis" className="text-sm text-black">
                                Calculate on pro-rata basis
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                                Pay will be adjusted based on employee working days.
                            </p>
                        </div>
                    </div>
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

export default FormCustomAllowance;