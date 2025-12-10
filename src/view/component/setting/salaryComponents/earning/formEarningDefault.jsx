import ReuseableInput from "../../../reuseableInput";

function FormEarningDefault({formData, setFormData, handleInputChange, earningType}) {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Main Fields */}
            <div className="space-y-6">
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

                {/* Calculation Type Section */}
                {(!formData.isFBPComponent || earningType === "Basic") ? (
                    <>
                        {/* Calculation Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Calculation Type <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="flatAmount"
                                        name="calculationType"
                                        value="Flat Amount"
                                        checked={formData.calculationType === 'Flat Amount'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-blue-td-600 border-gray-300 focus:ring-blue-td-500"
                                    />
                                    <label htmlFor="flatAmount" className="ml-3 text-sm text-gray-700">
                                        Flat Amount
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id={formData?.earningType === "Basic" ? "percentageOfCtc" : "percentageOfBasic"}
                                        name="calculationType"
                                        value={formData?.earningType === "Basic" ? "Percentage of CTC" : "Percentage of Basic"}
                                        checked={
                                        formData?.earningType === "Basic"
                                            ? formData.calculationType === "Percentage of CTC"
                                            : formData.calculationType === "Percentage of Basic"
                                        }
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-blue-td-600 border-gray-300 focus:ring-blue-td-500"
                                    />
                                    <label
                                        htmlFor={formData?.earningType === "Basic" ? "percentageOfCtc" : "percentageOfBasic"}
                                        className="ml-3 text-sm text-gray-700"
                                    >
                                        {formData?.earningType === "Basic" ? "Percentage of CTC" : "Percentage of Basic"}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Enter Amount/Percentage */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {formData.calculationType === "Flat Amount" ? "Enter Amount" : "Enter Percentage"}
                            </label>
                            
                            <div className="relative overflow-hidden rounded-lg">
                                {formData.calculationType === "Flat Amount" ? (
                                    <>
                                        <ReuseableInput
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            isFocusRing={false}
                                            isDollar={true}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <ReuseableInput
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            isFocusRing={false}
                                            isPercentage={true}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter Maximum Amount <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center space-x-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-2.5 text-gray-500 text-sm">$</span>
                                <input
                                    type="number"
                                    name="maxAmount"
                                    value={formData.maxAmount || ''}
                                    onChange={handleInputChange}
                                    className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-td-500 focus:border-blue-td-500 text-sm"
                                    min="0"
                                    placeholder="123"
                                />
                            </div>
                            <span className="text-sm text-gray-500">per month</span>
                        </div>
                        {formData.restrictFBPOverride && (
                            <p className="text-xs text-gray-500 mt-2">
                                Note: Employees will not be able to edit this amount in their FBP declarations once it is selected.
                            </p>
                        )}
                    </div>
                )}

                {/* Mark as Active */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-td-600 border-gray-300 rounded focus:ring-blue-td-500"
                    />
                    <label htmlFor="isActive" className="ml-3 text-sm text-gray-700">
                        Mark this as Active
                    </label>
                </div>
            </div>

            {/* Right Column - Other Configurations */}
            <div className="bg-blue-td-50 rounded-lg p-6">
                <h3 className="text-base font-semibold text-blue-td-600 mb-6">Other Configurations</h3>
                
                <div className="space-y-6">
                    {/* Make this earning a part of employee's salary structure */}
                    <div className="flex items-start space-x-3">
                        <input
                            type="checkbox"
                            id="isSalaryStructure"
                            name="isSalaryStructure"
                            checked={formData.isSalaryStructure}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-td-600 border-gray-300 rounded focus:ring-blue-td-500 mt-0.5"
                        />
                        <label htmlFor="isSalaryStructure" className="text-sm text-black leading-5">
                            Make this earning a part of the employee's salary structure
                        </label>
                    </div>

                    {/* Taxable earning */}
                    <div className="flex items-start space-x-3">
                        <input
                            type="checkbox"
                            id="isTaxable"
                            name="isTaxable"
                            checked={formData.isTaxable}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-td-600 border-gray-300 rounded focus:ring-blue-td-500 mt-0.5"
                        />
                        <div>
                            <label htmlFor="isTaxable" className="text-sm text-black leading-5">
                                This is a taxable earning
                            </label>
                            <p className="text-xs text-gray-500 mt-1 leading-4">
                                The income tax amount will be divided equally and deducted every month across the financial year.
                            </p>
                        </div>
                    </div>

                    {/* Calculate on pro-rata basis */}
                    <div className="flex items-start space-x-3">
                        <input
                            type="checkbox"
                            id="isProRataBasis"
                            name="isProRataBasis"
                            checked={formData.isProRataBasis}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-td-600 border-gray-300 rounded focus:ring-blue-td-500 mt-0.5"
                        />
                        <div>
                            <label htmlFor="isProRataBasis" className="text-sm text-black leading-5">
                                Calculate on pro-rata basis
                            </label>
                            <p className="text-xs text-gray-500 mt-1 leading-4">
                                Pay will be adjusted based on employee working days.
                            </p>
                        </div>
                    </div>

                    {/* Consider for SPK Contribution - Only show for Basic */}
                    {earningType === "Basic" && (
                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                id="considerSpk"
                                name="considerSpk"
                                checked={formData.considerSpk}
                                onChange={handleSpkChange}
                                className="w-4 h-4 text-blue-td-600 border-gray-300 rounded focus:ring-blue-td-500 mt-0.5"
                            />
                            <div className="flex-1">
                                <label htmlFor="considerSpk" className="text-sm text-black leading-5">
                                    Consider for SPK Contribution
                                </label>
                                
                                {/* SPK Options */}
                                <div className="mt-3 space-y-2 pl-1">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="spkAlways"
                                            name="spkContribution"
                                            value="Always"
                                            checked={formData.spkContribution === 'Always'}
                                            onChange={handleInputChange}
                                            disabled={!formData.considerSpk}
                                            className="w-3.5 h-3.5 text-blue-td-600 border-gray-300 focus:ring-blue-td-500"
                                        />
                                        <label htmlFor="spkAlways" className="ml-2 text-xs text-black">
                                            Always
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="spkConditional"
                                            name="spkContribution"
                                            value="Only when PF Wage is less than $ 15,000"
                                            checked={formData.spkContribution === 'Only when PF Wage is less than $ 15,000'}
                                            onChange={handleInputChange}
                                            disabled={!formData.considerSpk}
                                            className="w-3.5 h-3.5 text-blue-td-600 border-gray-300 focus:ring-blue-td-500"
                                        />
                                        <label htmlFor="spkConditional" className="ml-2 text-xs text-black">
                                            Only when PF Wage is less than $ 15,000
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Show this component in payslip */}
                    <div className="flex items-start space-x-3">
                        <input
                            type="checkbox"
                            id="showInPayslip"
                            name="showInPayslip"
                            checked={formData.showInPayslip}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-td-600 border-gray-300 rounded focus:ring-blue-td-500 mt-0.5"
                        />
                        <label htmlFor="showInPayslip" className="text-sm text-black leading-5">
                            Show this component in payslip
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormEarningDefault;