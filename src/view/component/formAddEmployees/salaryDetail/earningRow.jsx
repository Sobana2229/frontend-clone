import { useEffect } from "react";
import { getComponentsByKeySalaryDetail } from "../../../../../service/salaryEmployeeDetail/salaryCalculations";

const EarningRow = ({ 
  salaryComponent, 
  selectedComponent, 
  setSelectedComponent, 
  formData, 
  setFormData, 
  calculations,
  componentKey,
  formFieldPrefix,
  calculationMode,
  isEditMode,
  calculationKeyOverride
}) => {
  useEffect(() => {
    const components = getComponentsByKeySalaryDetail(salaryComponent, componentKey);
    if (components.length > 0 && !selectedComponent) {
      setSelectedComponent(components[0]);
    }
  }, [salaryComponent]);
  
  const handleComponentChange = (component) => {
    setSelectedComponent(component);
    
    if (component?.calculationType === 'Percentage of CTC') {
      setFormData(prev => ({
        ...prev,
        [`${formFieldPrefix}Amount`]: '',
        [`${formFieldPrefix}Percentage`]: prev[`${formFieldPrefix}Percentage`] || ''
      }));
    } else if (component?.calculationType === 'Percentage of Basic') {
      setFormData(prev => ({
        ...prev,
        [`${formFieldPrefix}Amount`]: '',
        [`${formFieldPrefix}Percentage`]: prev[`${formFieldPrefix}Percentage`] || ''
      }));
    } else if (component?.calculationType === 'Flat Amount') {
      setFormData(prev => ({
        ...prev,
        [`${formFieldPrefix}Percentage`]: '',
        [`${formFieldPrefix}Amount`]: prev[`${formFieldPrefix}Amount`] || ''
      }));
    }
  };
  
  const renderCalculationInput = () => {
    if (calculationMode === 'monthly') {
      return <span className="">{selectedComponent?.calculationType || 'Fixed Amount'}</span>;
    }
    
    if (!selectedComponent) {
      if (componentKey === 'dearnessAllowance') {
        return (
          <div className="flex items-center justify-start">
            {isEditMode ? (
              <>
                <input 
                  type="text" 
                  placeholder="0" 
                  disabled={!isEditMode}
                  value={formData[`${formFieldPrefix}Percentage`] || ''}
                  onChange={(e) => setFormData({...formData, [`${formFieldPrefix}Percentage`]: e.target.value})}
                  className={`w-full px-4 py-2 text-lg bg-transparent focus:ring-0 outline-none ${isEditMode && "rounded-s-md border-2 border-y-2"} text-left`} 
                />
                <div className="w-full text-center px-4 py-3 bg-gray-td-50 focus:ring-0 outline-none text-sm rounded-r-md border-y-2 border-r-2 capitalize">
                  <p>% of Basic</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-full text-lg text-gray-600 flex items-center justify-end pe-[7%]">
                  <span className="">{formData[`${formFieldPrefix}Percentage`] || 0}%</span>
                </div>
              </>
            )}
          </div>
        );
      }

      if (componentKey === 'conveyanceAllowance') {
        return (
          <div className="flex items-center justify-center">
            {isEditMode ? (
              <input 
                type="text" 
                placeholder="0" 
                disabled={!isEditMode}
                value={formData[`${formFieldPrefix}Amount`] || ''}
                onChange={(e) => setFormData({...formData, [`${formFieldPrefix}Amount`]: e.target.value})}
                className={`w-full px-4 py-2 text-lg bg-transparent focus:ring-0 outline-none ${isEditMode && "rounded-md border-2 border-y-2"} text-right`}
              />
            ) : (
              <>
                <div className="w-full text-lg text-gray-600 flex items-center justify-end pe-[7%]">
                  $<span className="">{formData[`${formFieldPrefix}Amount`] || 0}</span>
                </div>
              </>
            )}
          </div>
        );
      }
    }
    
    if (selectedComponent?.calculationType === 'Percentage of CTC') {
      return (
        <div className="flex items-center justify-start">
          {isEditMode ? (
            <>
              <input 
                type="text" 
                placeholder="0" 
                disabled={!isEditMode}
                value={formData[`${formFieldPrefix}Percentage`] || ''}
                onChange={(e) => setFormData({...formData, [`${formFieldPrefix}Percentage`]: e.target.value})}
                className={`w-full px-4 py-2 text-lg bg-transparent focus:ring-0 outline-none ${isEditMode && "rounded-s-md border-2 border-y-2"} text-left`} 
              />
              <div className="w-full text-center px-4 py-3 bg-gray-td-50 focus:ring-0 outline-none text-sm rounded-r-md border-y-2 border-r-2 capitalize">
                  <p>% of CTC</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-full text-lg text-gray-600 flex items-center justify-end pe-[7%]">
                <span className="">{formData[`${formFieldPrefix}Percentage`] || 0}%</span>
              </div>
            </>
          )}
        </div>
      );
    } else if (selectedComponent?.calculationType === 'Percentage of Basic') {
      return (
        <div className="flex items-center justify-start">
          {isEditMode ? (
            <>
              <input 
                type="text" 
                placeholder="0" 
                disabled={!isEditMode}
                value={formData[`${formFieldPrefix}Percentage`] || ''}
                onChange={(e) => setFormData({...formData, [`${formFieldPrefix}Percentage`]: e.target.value})}
                className={`w-full px-4 py-2 text-lg bg-transparent focus:ring-0 outline-none ${isEditMode && "rounded-s-md border-2 border-y-2"} text-left`} 
              />
              <div className="w-full text-center px-4 py-3 bg-gray-td-50 focus:ring-0 outline-none text-sm rounded-r-md border-y-2 border-r-2 capitalize">
                  <p> % of Basic</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-full text-lg text-gray-600 flex items-center justify-end pe-[7%]">
                <span className="">{formData[`${formFieldPrefix}Percentage`] || 0}%</span>
              </div>
            </>
          )}
        </div>
      );
    } else if (selectedComponent?.calculationType === 'Flat Amount') {
      return (
        <div className="flex items-center justify-center">
          {isEditMode ? (
            <input 
              type="text" 
              placeholder="0" 
              disabled={!isEditMode}
              value={formData[`${formFieldPrefix}Amount`] || ''}
              onChange={(e) => setFormData({...formData, [`${formFieldPrefix}Amount`]: e.target.value})}
              className={`w-full px-4 py-2 text-lg bg-transparent focus:ring-0 outline-none ${isEditMode && "rounded-md border-2 border-y-2"} text-right`} 
            />
          ) : (
            <>
              <div className="w-full text-lg text-gray-600 flex items-center justify-end pe-[7%]">
                $<span className="">{formData[`${formFieldPrefix}Amount`] || 0}</span>
              </div>
            </>
          )}
        </div>
      );
    }
    
    return <span className="px-6 py-2 text-left text-lg text-black capitalize font-normal">Fixed amount</span>;
  };
  
  const components = getComponentsByKeySalaryDetail(salaryComponent, componentKey);
  const calculationKey = calculationKeyOverride || componentKey;
  const calculationValue = calculations[calculationKey];
  
  const monthlyFieldName = `${formFieldPrefix}Monthly`;
  
  return (
    <>
      {components.length > 0 && (
        <tr className="">
          <td className="px-6 py-2">
            <div className="relative">
              <select 
                className={`w-full pe-4 py-2 text-lg bg-transparent focus:ring-0 outline-none ${(isEditMode && components.length > 1) && 'border-b'} appearance-none cursor-pointer text-black font-normal disabled:text-black disabled:opacity-100`}
                value={selectedComponent?.uuid || ''}
                disabled={!isEditMode}
                onChange={(e) => {
                  const component = components.find(comp => comp.uuid === e.target.value);
                  handleComponentChange(component);
                }}
              >
                {components.map((component) => (
                  <option key={component.uuid} value={component.uuid}>
                    {component.earningName}
                  </option>
                ))}
              </select>
              {(isEditMode && components.length > 1) && (
                <div className="absolute inset-y-0 right-2 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </div>
            {!isEditMode && selectedComponent?.calculationType?.includes("Percentage") && (
              <span className="text-gray-500">{`(${formData[`${formFieldPrefix}Percentage`]} % of ${selectedComponent?.calculationType})`}</span>
            )}
          </td>

          {isEditMode && (
            selectedComponent?.calculationType === 'Flat Amount' && calculationMode !== 'monthly' ? (
              <td className="px-6 py-2 text-left text-lg text-black capitalize font-normal">Fixed amount</td>
            ) : (
              <td className="px-6 py-2">
                {renderCalculationInput()}
              </td>
            )
          )}
          
          <td className="px-6 py-2">
            {calculationMode === 'monthly' ? (
              <input 
                type="text" 
                placeholder="0" 
                disabled={!isEditMode}
                value={formData[monthlyFieldName] || ''}
                onChange={(e) => setFormData({...formData, [monthlyFieldName]: e.target.value})}
                className={`w-full px-4 py-2 text-lg bg-transparent focus:ring-0 outline-none ${isEditMode && "rounded-md border-2 border-y-2"} text-right`} 
              />
            ) : (
              selectedComponent?.calculationType === 'Percentage of Basic' || selectedComponent?.calculationType === 'Percentage of CTC' ? (
                <div className="text-right text-lg text-gray-600 pe-4">
                  ${calculationValue?.monthly || 0}
                </div>
              ) : selectedComponent?.calculationType === 'Flat Amount' ? (
                renderCalculationInput()
              ) : (
                <div className="text-right text-lg text-gray-600 pe-4">
                  ${calculationValue?.monthly || 0}
                </div>
              )
            )}
          </td>
          
          <td className="text-right text-lg text-gray-600 pe-10">
            ${calculationValue?.annual || 0}
          </td>
        </tr>
      )}
    </>
  );
};

export default EarningRow;