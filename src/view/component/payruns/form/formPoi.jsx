import { useEffect, useState } from "react";
import employeeStoreManagements from "../../../../store/tdPayroll/employee";

function FormExitEmployeePoi({ handleSubmit, formDataPOI, setFormDataPOI, uuid}) {
  const { dataEmployeePersonalDetail } = employeeStoreManagements();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setFormDataPOI(prev => ({
      ...prev,
      employeeExitPayrunUuid: uuid
    }));
  }, [uuid]);

  const handleInputChangePOI = (e) => {
    const { name, value } = e.target;
    setFormDataPOI(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const handleAddDeduction = () => {
    const newDeduction = {
      id: Date.now(),
      name: '',
      amount: 0
    };
    
    setFormDataPOI(prev => ({
      ...prev,
      deductions: [...prev.deductions, newDeduction]
    }));
  };
  const handleRemoveDeduction = (id) => {
    setFormDataPOI(prev => ({
      ...prev,
      deductions: prev.deductions.filter(deduction => deduction.id !== id)
    }));
  };

  const handleDeductionChange = (id, field, value) => {
    setFormDataPOI(prev => ({
      ...prev,
      deductions: prev.deductions.map(deduction => 
        deduction.id === id 
          ? { ...deduction, [field]: field === 'amount' ? (parseInt(value) || 0) : value }
          : deduction
      )
    }));
  };

  return(
    <div className="w-1/2 p-6">
      {/* Header POI */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Proof of Investment</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-black rounded-full relative">
                <div className="absolute top-1 left-2 w-4 h-2 bg-yellow-400 rounded-sm"></div>
              </div>
            </div>
            <div>
              <div className="font-semibold text-lg">{dataEmployeePersonalDetail?.nickname}</div>
              <div className="text-sm text-gray-600">ID: {dataEmployeePersonalDetail?.Employee?.uuid}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Base Days and Payable Days */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Base Days for September 2025</span>
          <span className="text-sm font-semibold text-gray-900">30 Days</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Payable Days for September 2025</span>
          <span className="text-sm font-semibold text-gray-900">1 Days</span>
        </div>
        <div className="flex space-x-4 text-sm">
          <button className="text-blue-600 hover:text-blue-800">+ Add LOP</button>
          <button className="text-blue-600 hover:text-blue-800">+ Adjust Past LOP</button>
        </div>
      </div>

      {/* Earnings/Deductions Form */}
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">EARNINGS / DEDUCTIONS</h3>
          <span className="text-lg font-semibold text-gray-800">AMOUNT</span>
        </div>

        {/* Additional Earnings Section */}
        <div className="space-y-4">
          <h4 className="text-base font-medium text-gray-700">Additional Earnings</h4>
          <p className="text-sm text-gray-600">Add any additional amount to pay, other than the regular salary.</p>

          {/* Bonus */}
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Bonus</label>
            <input
              type="number"
              name="bonus"
              value={formDataPOI.bonus}
              onChange={handleInputChangePOI}
              className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          {/* Commission */}
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Commission</label>
            <input
              type="number"
              name="commission"
              value={formDataPOI.commission}
              onChange={handleInputChangePOI}
              className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          {/* August Basic */}
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">August Basic</label>
            <input
              type="number"
              name="augustBasic"
              value={formDataPOI.augustBasic}
              onChange={handleInputChangePOI}
              className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          {/* House RA correction */}
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">House RA correction</label>
            <input
              type="number"
              name="houseRACorrection"
              value={formDataPOI.houseRACorrection}
              onChange={handleInputChangePOI}
              className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          {/* Transport Car Allowance */}
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Transport Car Allowance</label>
            <input
              type="number"
              name="transportCarAllowance"
              value={formDataPOI.transportCarAllowance}
              onChange={handleInputChangePOI}
              className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          {/* Lunch Allowance */}
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Lunch Allowance</label>
            <input
              type="number"
              name="lunchAllowance"
              value={formDataPOI.lunchAllowance}
              onChange={handleInputChangePOI}
              className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          {/* Leave Encashment */}
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Leave Encashment</label>
            <input
              type="number"
              name="leaveEncashment"
              value={formDataPOI.leaveEncashment}
              onChange={handleInputChangePOI}
              className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          {/* Gratuity */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Gratuity</label>
              <button 
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-blue-600 hover:text-blue-800 text-xs underline"
              >
                How it is calculated?
              </button>
            </div>
            <input
              type="number"
              name="gratuity"
              value={formDataPOI.gratuity}
              onChange={handleInputChangePOI}
              className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="16347"
            />
          </div>
        </div>
      </div>

      {/* Gratuity Calculation Info */}
      {showTooltip && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="flex items-start space-x-2">
            <div className="text-sm">
              <div className="font-medium text-blue-800 mb-2">Gratuity Calculation</div>
              <div className="text-blue-700 space-y-1">
                <div>Gratuity Amount = Average Pay * 15 * Number of years</div>
                <div>Average Pay per day = (Latest Basic / 26) = (28,334 / 26) = ₹1,089.769</div>
                <div>Calculated Gratuity Amount = 1,089.769 * 15 * 1 = ₹16,347.00</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deductions Section */}
      <div className="space-y-4 mt-8">
        <h4 className="text-base font-medium text-gray-700">Deductions</h4>
        <p className="text-sm text-gray-600">One-time deductions that must be deducted from this employee's pay are listed below</p>

        {formDataPOI.deductions.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">i</span>
              </div>
              <span className="text-sm text-gray-600">You haven't added any deductions yet</span>
            </div>
            <button
              onClick={handleAddDeduction}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
            >
              <span>+</span>
              <span>Add Deduction</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {formDataPOI.deductions.map((deduction) => (
              <div key={deduction.id} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={deduction.name}
                  onChange={(e) => handleDeductionChange(deduction.id, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Deduction Name"
                />
                <input
                  type="number"
                  value={deduction.amount}
                  onChange={(e) => handleDeductionChange(deduction.id, 'amount', e.target.value)}
                  className="w-24 px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
                <button
                  onClick={() => handleRemoveDeduction(deduction.id)}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={handleAddDeduction}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
            >
              <span>+</span>
              <span>Add Deduction</span>
            </button>
          </div>
        )}
      </div>

      {/* Notice Pay Section */}
      <div className="space-y-4 mt-8">
        <h4 className="text-base font-medium text-gray-700">Notice Pay</h4>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="noticePayHold"
              checked={formDataPOI.noticePayHold}
              onChange={(e) => setFormDataPOI(prev => ({...prev, noticePayHold: e.target.checked}))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Does this Employee hold Notice Pay?</span>
          </label>
          
          <div className="text-sm text-gray-600 ml-7">
            Check this option if: the employee is not serving the mandated notice period (you can recover an amount) or, the company terminates a employee without prior notice (you need to pay an amount).
          </div>

          {/* Notice Pay Type - Only show when checkbox is checked */}
          {formDataPOI.noticePayHold && (
            <div className="ml-7 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notice pay type</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="noticePayType"
                      value="payable"
                      checked={formDataPOI.noticePayType === 'payable'}
                      onChange={(e) => setFormDataPOI(prev => ({...prev, noticePayType: e.target.value}))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Payable</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="noticePayType"
                      value="receivable"
                      checked={formDataPOI.noticePayType === 'receivable'}
                      onChange={(e) => setFormDataPOI(prev => ({...prev, noticePayType: e.target.value}))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">Receivable</span>
                  </label>
                </div>
              </div>

              {/* Amount field based on selected type */}
              {formDataPOI.noticePayType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formDataPOI.noticePayType === 'payable' ? 'Payable Amount' : 'Receivable Amount'}
                  </label>
                  <input
                    type="number"
                    name={formDataPOI.noticePayType === 'payable' ? 'payableAmount' : 'receivableAmount'}
                    value={formDataPOI.noticePayType === 'payable' ? formDataPOI.payableAmount : formDataPOI.receivableAmount}
                    onChange={(e) => {
                      const field = formDataPOI.noticePayType === 'payable' ? 'payableAmount' : 'receivableAmount';
                      setFormDataPOI(prev => ({...prev, [field]: parseInt(e.target.value) || 0}));
                    }}
                    className="w-32 px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notes Section */}
      <div className="space-y-4 mt-8">
        <h4 className="text-base font-medium text-gray-700">Notes</h4>
        <p className="text-sm text-gray-600">This will be shown in full and final settlement payslip</p>
        
        <textarea
          name="finalSettlementNotes"
          value={formDataPOI.finalSettlementNotes}
          onChange={(e) => setFormDataPOI(prev => ({...prev, finalSettlementNotes: e.target.value}))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Add any notes for the final settlement..."
        />
      </div>

      {/* Warning Message */}
      <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <p className="text-sm text-orange-800">
            Looks like this employee hasn't submitted the investment proofs. Make sure you collect them before processing the Final Settlement payroll.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-start space-x-4">
        <button
          onClick={() => {setFormDataPOI({
            bonus: 0,
            commission: 0,
            augustBasic: 0,
            houseRACorrection: 0,
            transportCarAllowance: 0,
            lunchAllowance: 0,
            leaveEncashment: 0,
            gratuity: 16347,
            deductions: [],
            noticePayHold: false,
            noticePayType: '',
            payableAmount: 0,
            receivableAmount: 0,
            finalSettlementNotes: ''
          })}}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={() => {
            setFormDataPOI(prev => ({
              ...prev,
              status: "paymentDue"
            }));
            handleSubmit("save")
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Save and Continue
        </button>
        <button
          onClick={() => {
            setFormDataPOI(prev => ({
              ...prev,
              status: "draft"
            }));
            handleSubmit("draft")
          }}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Save Draft
        </button>
      </div>
    </div>
  );
}

export default FormExitEmployeePoi;