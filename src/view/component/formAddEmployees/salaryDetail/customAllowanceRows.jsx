import { getComponentsByKeySalaryDetail } from "../../../../../service/salaryEmployeeDetail/salaryCalculations";

const CustomAllowanceRows = ({ 
  salaryComponent, 
  customAllowances, 
  setCustomAllowances, 
  basicAmount,
  isEditMode,
  calculationMode = 'annual'
}) => {
  const calculateAmount = (component, inputValue) => {
    const value = parseFloat(inputValue) || 0;
    
    if (calculationMode === 'monthly') {
      // Monthly mode: inputValue is already monthly amount
      if (component.calculationType === 'Flat Amount') {
        return {
          monthly: value,
          annual: value * 12
        };
      } else if (component.calculationType === 'Percentage of Basic') {
        const basicMonthly = parseFloat(basicAmount) || 0;
        const monthly = (basicMonthly * value) / 100;
        return {
          monthly: Math.round(monthly),
          annual: Math.round(monthly * 12)
        };
      }
    } else {
      // Annual mode: existing logic
      if (component.calculationType === 'Flat Amount') {
        // In Annual mode, Flat Amount input is monthly amount
        return {
          monthly: value,
          annual: value * 12
        };
      } else if (component.calculationType === 'Percentage of Basic') {
        const basicMonthly = parseFloat(basicAmount) || 0;
        const monthly = (basicMonthly * value) / 100;
        return {
          monthly: Math.round(monthly),
          annual: Math.round(monthly * 12)
        };
      }
    }
    
    if (component.calculationType === 'Custom Formula') {
      return {
        monthly: 0,
        annual: 0
      };
    }
    
    return { monthly: 0, annual: 0 };
  };
  
  const handleCustomAllowanceChange = (componentUuid, value) => {
    setCustomAllowances(prev => ({
      ...prev,
      [componentUuid]: value
    }));
  };
  
  const renderCalculationInput = (component) => {
    const currentValue = customAllowances[component.uuid] ?? '0';
    
    if (calculationMode === 'monthly') {
      // Monthly mode: always show monthly input field
      if (component.calculationType === 'Flat Amount') {
        return (
          <div className="flex items-center justify-center">
            {isEditMode ? (
              <input 
                type="text" 
                placeholder="0" 
                disabled={!isEditMode}
                value={currentValue}
                onChange={(e) => handleCustomAllowanceChange(component.uuid, e.target.value)}
                className="w-full px-4 py-2 text-lg border-y-2 bg-transparent focus:ring-0 outline-none rounded-md border-2 text-right" 
              />
            ) : (
              <div className="w-full text-lg text-gray-500 flex items-center justify-end pe-[7%]">
                $<span className="">{currentValue || 0}</span>
              </div>
            )}
          </div>
        );
      } else if (component.calculationType === 'Percentage of Basic') {
        // For Monthly mode, Percentage of Basic: show input for percentage, display calculated monthly
        return (
          <div className="flex items-center justify-start">
            {isEditMode ? (
              <>
                <input 
                  type="text" 
                  placeholder="0" 
                  disabled={!isEditMode}
                  value={currentValue}
                  onChange={(e) => handleCustomAllowanceChange(component.uuid, e.target.value)}
                  className="w-full px-4 py-2 text-lg border-y-2 bg-transparent focus:ring-0 outline-none rounded-s-md border-2 text-left" 
                />
                <div className="w-full text-center px-4 py-3 bg-gray-td-50 focus:ring-0 outline-none text-sm rounded-r-md border-y-2 border-r-2 capitalize">
                  % of Basic
                </div>
              </>
            ) : (
              <div className="text-right text-lg text-gray-600 pe-4">
                ${calculateAmount(component, currentValue).monthly || 0}
              </div>
            )}
          </div>
        );
      }
    } else {
      // Annual mode: existing logic
      if (component.calculationType === 'Flat Amount') {
        return (
          <div className="flex items-center justify-center">
            {isEditMode ? (
              <input 
                type="text" 
                placeholder="0" 
                disabled={!isEditMode}
                value={currentValue}
                onChange={(e) => handleCustomAllowanceChange(component.uuid, e.target.value)}
                className="w-full px-4 py-2 text-lg border-y-2 bg-transparent focus:ring-0 outline-none rounded-md border-2 text-right" 
              />
            ) : (
              <div className="w-full text-lg text-gray-500 flex items-center justify-end pe-[7%]">
                $<span className="">{currentValue || 0}</span>
              </div>
            )}
          </div>
        );
      } else if (component.calculationType === 'Percentage of Basic') {
        return (
          <div className="flex items-center justify-start">
            {isEditMode ? (
              <>
                <input 
                  type="text" 
                  placeholder="0" 
                  disabled={!isEditMode}
                  value={currentValue}
                  onChange={(e) => handleCustomAllowanceChange(component.uuid, e.target.value)}
                  className="w-full px-4 py-2 text-lg border-y-2 bg-transparent focus:ring-0 outline-none rounded-s-md border-2 text-left" 
                />
                <div className="w-full text-center px-4 py-3 bg-gray-td-50 focus:ring-0 outline-none text-sm rounded-r-md border-y-2 border-r-2 capitalize">
                  % of Basic
                </div>
              </>
            ) : (
              <div className="w-full text-lg text-gray-500 flex items-center justify-end pe-[7%]">
                $<span className="">{currentValue || 0}</span>
              </div>
            )}
          </div>
        );
      }
    }
    
    if (component.calculationType === 'Custom Formula') {
      return <span className="text-gray-500">Custom Formula</span>;
    }
    
    return <span>-</span>;
  };
  
  // ✅ Filter out Custom Allowance One Time Pay (they are shown in OneTimeEarningsRows)
  // ✅ Filter out Variable Pay (they are handled separately)
  const customComponents = getComponentsByKeySalaryDetail(salaryComponent, "customAllowance")
    .filter(comp => {
      // Exclude One Time Pay yang scheduled
      if (comp.payType === "One Time Pay" && comp.isSchedule === true) return false;
      // Exclude Variable Pay
      if (comp.payType === "Variable Pay") return false;
      return true;
    });
  
  if (customComponents.length === 0) {
    return null;
  }
  
  return (
    <>
      {customComponents.map((component) => {
        const valueToCalculate = customAllowances[component.uuid] ?? '0';
        const calculations = calculateAmount(component, valueToCalculate);
        
        return (
          <tr key={component.uuid} className="">
            <td className="px-6 py-2 text-left text-lg text-black capitalize font-normal">{component.earningName}</td>
            {isEditMode && (
              <td className="px-6 py-2 text-left text-lg text-black capitalize font-normal">
                {calculationMode === 'monthly' ? (
                  <span>{component.calculationType || 'Fixed Amount'}</span>
                ) : (
                  component.calculationType === 'Flat Amount' ? 'Fixed amount' :
                  component.calculationType === 'Percentage of Basic' ? 
                    renderCalculationInput(component) :
                  component.calculationType === 'Custom Formula' ? 'Custom Formula' : 
                  component.calculationType
                )}
              </td>
            )}
            <td className="px-6 py-2">
              {calculationMode === 'monthly' ? (
                // Monthly mode: always show input field for monthly amount
                renderCalculationInput(component)
              ) : (
                // Annual mode: existing logic
                component.calculationType === 'Percentage of Basic' ? (
                  <div className="text-right text-lg text-gray-600 capitalize pe-4">${calculations.monthly}</div>
                ) : (
                  renderCalculationInput(component)
                )
              )}
            </td>
            <td className="pe-10 py-2 text-right text-lg text-gray-600 capitalize">${calculations.annual}</td>
          </tr>
        );
      })}
    </>
  );
};

export default CustomAllowanceRows;