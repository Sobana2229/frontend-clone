import React, { useEffect } from 'react';
import { calculateEPFBenefits } from '../../../../../helper/globalHelper';

const BenefitRows = ({ 
  statutoryComponentSpk, 
  benefits, 
  setBenefits,
  basicAmount,
  citizenCategory,
  isEditMode,
  isOtherDeductions 
}) => {
  const roundToTwo = (num) => Math.round(num * 100) / 100;
  const benefitItems = calculateEPFBenefits(basicAmount, statutoryComponentSpk, citizenCategory);

  useEffect(() => {
    const employerCosts = benefitItems.filter(item => item.type === 'employer_cost');
    const employeeDeductions = benefitItems.filter(item => item.type === 'employee_cost');
    const totalEmployerCosts = roundToTwo(employerCosts.reduce((sum, item) => sum + item.annual, 0));
    const totalEmployeeDeductions = roundToTwo(employeeDeductions.reduce((sum, item) => sum + item.annual, 0));
    const benefitBreakdown = {};
    
    benefitItems.forEach(item => {
      benefitBreakdown[item.uuid] = {
        monthly: roundToTwo(item.monthly),
        annual: roundToTwo(item.annual),
        type: item.type
      };
    });
    
    setBenefits({
      ...benefitBreakdown,
      totalEmployerCostsAnnual: totalEmployerCosts,
      totalEmployerCostsMonthly: roundToTwo(totalEmployerCosts / 12),
      totalEmployeeDeductionsAnnual: totalEmployeeDeductions,
      totalEmployeeDeductionsMonthly: roundToTwo(totalEmployeeDeductions / 12),
      totalAnnual: totalEmployerCosts,
      totalMonthly: roundToTwo(totalEmployerCosts / 12)
    });
  }, [basicAmount, statutoryComponentSpk, setBenefits]);

  const employerCosts = benefitItems.filter(item => item.type === 'employer_cost');
  const employeeDeductions = benefitItems.filter(item => item.type === 'employee_cost');
  
  return (
    <>
      {/* Benefits Header */}
      <tr className="">
        <td className={`py-5 text-xl font-medium text-blue-td-500 flex items-center justify-start space-x-2 px-6`}>Benefits</td>
        {isEditMode && (
          <td></td>
        )}
        <td></td>
        <td></td>
      </tr>
      
      {(!benefitItems || benefitItems.length === 0) ? (
        <tr className={`${!isEditMode && "border-b"}`}>
          <td className={`px-6 py-2 ${!isEditMode && "pb-5"}`}>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              No statutory benefits configured
            </span>
          </td>
          {isEditMode && (
            <td className="px-6 py-2"></td>
          )}
          <td className="px-6 py-2 text-center">$0</td>
          <td className="px-6 py-2 text-center">$0</td>
        </tr>
      ) : (
        <>
          {!isOtherDeductions ? (
            <>
              {/* Employee Deductions */}
              {employeeDeductions.map((item) => (
                <tr key={item.uuid} className="">
                  <td className="px-6 py-2">
                    <div className="flex flex-col">
                      <span className="text-lg font-normal text-black">{item.name}</span>
                      {isEditMode ? (
                        <>
                          {item.description && (
                            <p className="text-sm text-gray-td-500 mt-1 border-l-2 border-l-gray-td-300 ps-2">
                              {item.description}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          {!isEditMode && (
                            <span className="text-gray-500">{`(${item.calculationType})`}</span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  {isEditMode && (
                    <td className="px-6 py-2">
                      <span className="text-lg text-black underline">{item.calculationType}</span>
                    </td>
                  )}
                  <td className="px-6 py-2 text-center">
                    <div className="text-right text-lg text-gray-600 pe-4">
                      ${roundToTwo(item.monthly).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-2 text-center">
                    <div className="text-right text-lg text-gray-600 pe-4">
                      ${roundToTwo(item.annual).toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))}
            </>
          ) : (
            <>
              <tr className="">
                <td className="px-6 py-2">
                  <div className="flex flex-col">
                    <span className="text-lg font-normal text-black">EPF Contribution</span>
                  </div>
                </td>
              </tr>
              {/* Employee Deductions */}
              {employeeDeductions.map((item) => (
                <tr key={item.uuid} className="relative">
                  <td className="px-6 ps-10 py-2 relative">
                    <div className="absolute top-0 left-7 h-12 w-0.5 bg-gray-600"></div>
                    <div className="flex flex-col">
                      <span className="text-lg font-normal text-black">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 ps-10 py-2">
                    <span className="text-lg text-gray-500">{item.calculationType}</span>
                  </td>
                </tr>
              ))}
            </>
          )}
          
          {!isOtherDeductions ? (
            <>
              {/* Employer Costs */}
              {employerCosts.map((item) => (
                <tr key={item.uuid} className="">
                  <td className="px-6 py-2">
                    <div className="flex flex-col">
                      <span className="text-lg font-normal text-black">{item.name}</span>
                      {isEditMode ? (
                        <>
                          {item.description && (
                            <p className="text-sm text-gray-td-500 mt-1 border-l-2 border-l-gray-td-300 ps-2">
                              {item.description}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          {!isEditMode && (
                            <span className="text-gray-500">{`(${item.calculationType})`}</span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  {isEditMode && (
                    <td className="px-6 py-2">
                      <span className="text-lg text-black underline">{item.calculationType}</span>
                    </td>
                  )}
                  <td className="px-6 py-2 text-center">
                    <div className="text-right text-lg text-gray-600 pe-4">
                      ${roundToTwo(item.monthly).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-2 text-center">
                    <div className="text-right text-lg text-gray-600 pe-4">
                      ${roundToTwo(item.annual).toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))}
            </>
          ) : (
            <>
              {/* Employee Deductions */}
              {employerCosts.map((item) => (
                item.name === "SPK - Employer Contribution" && (
                  <tr key={item.uuid} className="relative">
                    <td className="px-6 ps-10 py-2 relative">
                      <div className="absolute top-0 left-7 h-12 w-0.5 bg-gray-600"></div>
                      <div className="flex flex-col">
                        <span className="text-lg font-normal text-black">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 ps-10 py-2">
                      <span className="text-lg text-gray-500">{item.calculationType}</span>
                    </td>
                  </tr>
                )
              ))}
            </>
          )}
        </>
      )}
    </>
  );
};

export default BenefitRows;