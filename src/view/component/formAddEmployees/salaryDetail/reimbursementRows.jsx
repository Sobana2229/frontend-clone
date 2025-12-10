import { useEffect } from "react";

const ReimbursementRows = ({ 
  salaryComponent, 
  reimbursements, 
  setReimbursements,
  isEditMode
}) => {
  const getReimbursementComponents = () => {    
    if (!salaryComponent?.reimbursement) return [];
    const allReimbursements = salaryComponent.reimbursement;
    const activeNonFbpOnes = allReimbursements.filter(item => 
      item.markAsActive && !item.includeFlexibleBenefit
    );
    return activeNonFbpOnes;
  };
  
  const calculateAmount = (component, inputValue) => {
    const value = parseFloat(inputValue) || 0;
    return {
      monthly: value,
      annual: value * 12
    };
  };
  
  const handleReimbursementChange = (componentUuid, value, maxAmount) => {
    const numericValue = parseFloat(value) || 0;
    const maxNumericAmount = parseFloat(maxAmount) || 0;
    if (numericValue > maxNumericAmount) {
      return;
    }
    
    setReimbursements(prev => ({
      ...prev,
      [componentUuid]: value
    }));
  };
  
  const renderCalculationInput = (component) => {
    const currentValue = reimbursements.hasOwnProperty(component.uuid) 
      ? reimbursements[component.uuid] 
      : '';  // ✅ FALLBACK KE EMPTY STRING, BUKAN MASTER DEFAULT
    
    return (
      <div className="flex items-center justify-center">
        {isEditMode ? (
          <input 
            type="text" 
            placeholder="0" 
            disabled={!isEditMode}
            value={currentValue}
            max={component.amount}
            onChange={(e) => handleReimbursementChange(component.uuid, e.target.value, component.amount)}
            className="w-full px-4 py-2 text-lg border-y-2 bg-transparent focus:ring-0 outline-none rounded-md border-2 text-right" 
          />
        ) : (
          <div className="w-full text-lg text-gray-600 flex items-center justify-end pe-[7%]">
            $<span className="">{currentValue || 0}</span>
          </div>
        )}
      </div>
    );
  };
  
  const reimbursementComponents = getReimbursementComponents();
  
  if (reimbursementComponents.length === 0) {
    return null;
  }
  
  return (
    <>
      {/* Reimbursements Header */}
      <tr className="">
        <td className="py-5 text-xl font-medium text-blue-td-500 flex items-center justify-start space-x-2 px-6">
          Reimbursements
        </td>
        {isEditMode && (
          <td></td>
        )}
        <td></td>
        <td></td>
      </tr>
      
      {reimbursementComponents.map((component, idx) => {
        const valueToCalculate = reimbursements.hasOwnProperty(component.uuid) 
            ? reimbursements[component.uuid] 
            : '0';  // ✅ FALLBACK KE '0', BUKAN MASTER DEFAULT
        const calculations = calculateAmount(component, valueToCalculate);
        
        return (
          <tr key={component.uuid} className={`${(!isEditMode && idx == reimbursementComponents.length - 1) && "border-b"}`}>
            <td className={`px-6 py-2 ${(!isEditMode && idx == reimbursementComponents.length - 1) && "pb-5"}`}>
              <div className="flex flex-col">
                <span className="text-left text-lg text-black capitalize font-normal">{component.nameInPayslip}</span>
                <div className="w-full flex items-center justify-start space-x-2">
                  <p className="text-xs text-gray-400">Max Limit : ${component.amount}</p>
                  <p className="text-xs text-gray-400 border-l ps-2">Monthly Carry Forward</p>
                </div>
              </div>
            </td>
            {isEditMode && (
              <td className="px-6 py-2 text-left text-lg text-black capitalize font-normal">Fixed amount</td>
            )}
            <td className="px-6 py-2">
              {renderCalculationInput(component)}
            </td>
            <td className="text-right text-lg text-gray-600 pe-10">${calculations.annual}</td>
          </tr>
        );
      })}
    </>
  );
};

export default ReimbursementRows;