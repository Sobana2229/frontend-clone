import { Lock } from "@phosphor-icons/react";
import { useEffect } from "react";

const ReimbursementFbpRows = ({ 
  salaryComponent, 
  reimbursements, 
  setReimbursements,
  fbpSelections, 
  setFbpSelections,
  dataReimbursementComponent,
  isEditMode
}) => {
  const getFbpReimbursementComponents = () => {    
    if (!salaryComponent?.reimbursement) return [];
    const allReimbursements = salaryComponent.reimbursement;
    const activeFbpOnes = allReimbursements.filter(item => 
      item.markAsActive && item.includeFlexibleBenefit === true
    );
    return activeFbpOnes;
  };

  useEffect(() => {
    const fbpComponents = getFbpReimbursementComponents();
    if (fbpComponents.length > 0) {
      const initialReimbursements = {};
      const initialSelections = {};
      
      fbpComponents.forEach(component => {
        const existingData = dataReimbursementComponent?.find(
          item => item.salaryComponentReimbursementUuid === component.uuid
        );

        // ALWAYS populate (tidak pakai check hasOwnProperty)
        initialReimbursements[component.uuid] = existingData?.amount || '';
        
        const willBeSelected = existingData && existingData.isChecked === true;
        initialSelections[component.uuid] = willBeSelected;
      });
      
      // REPLACE state, bukan merge
      setReimbursements(initialReimbursements);
      setFbpSelections(initialSelections);
    }
  }, [salaryComponent, dataReimbursementComponent]);

  const handleComponentToggle = (componentUuid, isChecked) => {
    setFbpSelections(prev => ({
      ...prev,
      [componentUuid]: isChecked
    }));

    if (!isChecked) {
      setReimbursements(prev => ({
        ...prev,
        [componentUuid]: ''
      }));
    }
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

  const calculateAnnualAmount = (monthlyValue) => {
    const monthly = parseFloat(monthlyValue) || 0;
    return monthly * 12;
  };

  const fbpComponents = getFbpReimbursementComponents();

  if (fbpComponents.length === 0) {
    return null;
  }

  return (
    <>
      <tr className="">
        <td className="py-5 w-full text-xl font-medium text-blue-td-500 px-6">
          Flexible Benefit Plan Components
        </td>
        {isEditMode && (
          <td></td>
        )}
        <td></td>
        <td></td>
      </tr>
      
      {fbpComponents.map((component, idx) => {
        const isSelected = fbpSelections[component.uuid] || false;
        const currentValue = reimbursements[component.uuid] || '';
        const annualAmount = calculateAnnualAmount(currentValue);
        const maxAmount = component.maxAmount || component.amount || 0;

        return (
          <tr key={component.uuid} className={`${(!isEditMode && idx == fbpComponents.length - 1) && "border-b"}`}>
            <td className={`px-6 py-2 ${(!isEditMode && idx == fbpComponents.length - 1) && "pb-5"}`}>
              <div className="flex items-start space-x-3">
                <input 
                  type="checkbox"
                  disabled={!isEditMode}
                  id={`fbp-benefit-${component.uuid}`}
                  checked={isSelected}
                  onChange={(e) => handleComponentToggle(component.uuid, e.target.checked)}
                  className="mt-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="text-left text-lg text-gray-td-400 font-normal mb-1">
                    {component.nameInPayslip || component.earningName}
                  </div>
                  <div className="text-xs text-gray-500">
                    Max Amount: <span className="font-medium">${maxAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </td>
            
            {isEditMode && (
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">
                    Max Amount: <span className="font-medium">${maxAmount.toLocaleString()}</span>
                  </div>
                  {component.restrictFBPOverride && (
                    <div className="flex items-center space-x-1">
                      <Lock size={14} />
                      <span className="text-xs text-gray-td-400 underline">Restricted Component</span>
                    </div>
                  )}
                </div>
              </td>
            )}
            
            <td className="px-6 py-4">
              <div className="flex justify-center">
                {isEditMode ? (
                  <input 
                    type="text"
                    placeholder="0"
                    value={currentValue}
                    disabled={!isSelected && !isEditMode}
                    onChange={(e) => handleReimbursementChange(component.uuid, e.target.value, maxAmount)}
                    className={`w-full px-4 py-2 text-lg border-y-2 focus:ring-0 outline-none rounded-md border-2 text-right ${
                      !isSelected ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-transparent'
                    }`}
                  />
                ) : (
                  <div className="w-full text-lg text-gray-600 flex items-center justify-end pe-[7%]">
                    $<span className="">{currentValue || 0}</span>
                  </div>
                )}
              </div>
            </td>
            
            <td className="text-right text-lg text-gray-600 pe-10">
              ${annualAmount.toLocaleString()}
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default ReimbursementFbpRows;