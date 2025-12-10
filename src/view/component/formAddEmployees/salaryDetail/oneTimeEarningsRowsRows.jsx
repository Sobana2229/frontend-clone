import React from 'react';
import { getComponentsByKeySalaryDetail } from '../../../../../service/salaryEmployeeDetail/salaryCalculations';
import { useState } from 'react';
import { CalendarDots, CalendarDotsIcon } from '@phosphor-icons/react';
import dayjs from "dayjs";

const OneTimeEarningsRows = ({ 
  salaryComponent, 
  bonuses, 
  setBonuses,
  commissions,
  setCommissions,
  giftCoupons,
  setGiftCoupons,
  customAllowancesOneTime, // ✅ Custom Allowance One Time Pay
  setCustomAllowancesOneTime, // ✅ Setter for Custom Allowance One Time Pay
  calculations,
  isEditMode
}) => {
  const [showSchedule, setShowSchedule] = useState({});
  
  const handleBonusChange = (componentUuid, field, value) => {
    setBonuses(prev => ({
      ...prev,
      [componentUuid]: {
        ...prev[componentUuid],
        [field]: value
      }
    }));
  };

  const handleCommissionChange = (componentUuid, field, value) => {
    setCommissions(prev => ({
      ...prev,
      [componentUuid]: {
        ...prev[componentUuid],
        [field]: value
      }
    }));
  };

  const handleGiftCouponChange = (componentUuid, field, value) => {
    setGiftCoupons(prev => ({
      ...prev,
      [componentUuid]: {
        ...prev[componentUuid],
        [field]: value
      }
    }));
  };

  const handleCustomAllowanceOneTimeChange = (componentUuid, field, value) => {
    setCustomAllowancesOneTime(prev => ({
      ...prev,
      [componentUuid]: {
        ...prev[componentUuid],
        [field]: value
      }
    }));
  };

  // Get all active components, then filter to only show scheduled earnings (isSchedule: true)
  // AND only show those that exist in bonuses/commissions/giftCoupons/customAllowancesOneTime state (already filtered by usedInPayrunUuid)
  const bonusComponents = getComponentsByKeySalaryDetail(salaryComponent, "bonus")
    .filter(comp => comp.isSchedule === true)
    .filter(comp => bonuses[comp.uuid] !== undefined); // ✅ Only show if exists in bonuses state (not filtered out)
  const commissionComponents = getComponentsByKeySalaryDetail(salaryComponent, "commission")
    .filter(comp => comp.isSchedule === true)
    .filter(comp => commissions[comp.uuid] !== undefined); // ✅ Only show if exists in commissions state
  const giftCouponComponents = getComponentsByKeySalaryDetail(salaryComponent, "giftCoupon")
    .filter(comp => comp.isSchedule === true)
    .filter(comp => giftCoupons[comp.uuid] !== undefined); // ✅ Only show if exists in giftCoupons state
  // ✅ Custom Allowance One Time Pay: filter by payType = "One Time Pay" and isSchedule = true
  const customAllowanceOneTimeComponents = getComponentsByKeySalaryDetail(salaryComponent, "customAllowance")
    .filter(comp => comp.payType === "One Time Pay" && comp.isSchedule === true)
    .filter(comp => customAllowancesOneTime?.[comp.uuid] !== undefined); // ✅ Only show if exists in customAllowancesOneTime state
  
  const allOneTimeEarnings = [
    ...bonusComponents.map(comp => ({ ...comp, type: 'bonus' })),
    ...commissionComponents.map(comp => ({ ...comp, type: 'commission' })),
    ...giftCouponComponents.map(comp => ({ ...comp, type: 'giftCoupon' })),
    ...customAllowanceOneTimeComponents.map(comp => ({ ...comp, type: 'customAllowanceOneTime' })) // ✅ Add Custom Allowance One Time Pay
  ];
  
  if (allOneTimeEarnings.length === 0) {
    return null;
  }

  const getComponentData = (component) => {
    switch (component.type) {
      case 'bonus':
        return bonuses[component.uuid] || { amount: component.amount || '', payoutDate: '' };
      case 'commission':
        return commissions[component.uuid] || { amount: component.amount || '', payoutDate: '' };
      case 'giftCoupon':
        return giftCoupons[component.uuid] || { amount: component.amount || '', payoutDate: '' };
      case 'customAllowanceOneTime':
        return customAllowancesOneTime?.[component.uuid] || { amount: component.amount || '', payoutDate: '' };
      default:
        return { amount: '', payoutDate: '' };
    }
  };

  const getHandleChange = (type) => {
    switch (type) {
      case 'bonus':
        return handleBonusChange;
      case 'commission':
        return handleCommissionChange;
      case 'giftCoupon':
        return handleGiftCouponChange;
      case 'customAllowanceOneTime':
        return handleCustomAllowanceOneTimeChange;
      default:
        return () => {};
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'bonus':
        return 'bg-blue-100 text-blue-800';
      case 'commission':
        return 'bg-green-100 text-green-800';
      case 'giftCoupon':
        return 'bg-purple-100 text-purple-800';
      case 'customAllowanceOneTime':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'bonus':
        return 'Bonus';
      case 'commission':
        return 'Commission';
      case 'giftCoupon':
        return 'Gift Coupon';
      case 'customAllowanceOneTime':
        return 'Custom Allowance';
      default:
        return type;
    }
  };

  const toggleSchedule = (componentUuid) => {
    setShowSchedule(prev => ({
      ...prev,
      [componentUuid]: !prev[componentUuid]
    }));
  };

  // Filter items:
  // - For view mode: only show those with data (amount and payoutDate)
  // - For edit mode: show all (but already filtered by bonuses/commissions/giftCoupons state above)
  // Note: Components that have been used (usedInPayrunUuid) are already filtered out
  // because they don't exist in bonuses/commissions/giftCoupons state
  const filteredItems = isEditMode 
    ? allOneTimeEarnings 
    : allOneTimeEarnings.filter(component => {
        const data = getComponentData(component);
        return data.amount && data.payoutDate;
      });

  // Jika tidak ada item yang bisa ditampilkan, return null
  if (filteredItems.length === 0) {
    return null;
  }
  
  return (
    <>
      <tr>
        <td className="py-5 text-lg font-medium text-black flex items-center justify-start space-x-2 px-6">
          <p>One Time Earnings </p>
          {isEditMode && (
            <div className="bg-gray-50 border-l-2 border-l-gray-td-400 rounded-sm text-xs px-2 text-gray-500">Year</div>
          )}
        </td>
        {isEditMode && (
          <td></td>
        )}
        <td></td>
        <td></td>
      </tr>
      {filteredItems.map((component, idx) => {
        const data = getComponentData(component);
        const handleChange = getHandleChange(component.type);
        
        return (
          <tr key={component.uuid} className={`${(!isEditMode && idx === filteredItems.length - 1) && "border-b"}`}>
            <td className="px-6 py-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <p className="text-lg text-black capitalize font-normal">{component.earningName || component.type}</p>
                </div>
                
                {isEditMode ? (
                  <>
                    <button 
                      className='flex items-center justify-start space-x-2 text-blue-td-500 hover:text-blue-td-600 transition-colors' 
                      onClick={() => toggleSchedule(component.uuid)}
                      disabled={!isEditMode}
                    >
                      <CalendarDots size={19} />
                      <p className='text-base'>Schedule Payment</p>
                    </button>
                    
                    {(showSchedule[component.uuid] || data.payoutDate) && (
                      <input 
                        type="date" 
                        value={data.payoutDate}
                        disabled={!isEditMode}
                        onChange={(e) => handleChange(component.uuid, 'payoutDate', e.target.value)}
                        className={`px-2 py-1 bg-transparent focus:ring-0 outline-none text-sm ${isEditMode && "rounded-md border-2 focus:border-blue-td-500"} w-fit`} 
                        placeholder="dd/mm/yyyy"
                      />
                    )}
                  </>
                ) : (
                  <div className="w-full flex items-center justify-start space-x-2">
                    <CalendarDotsIcon size={19} />
                    <p className="text-gray-600">
                      Payout Month : {data.payoutDate ? dayjs(data.payoutDate).format('MMM, YYYY') : ''}
                    </p>
                  </div>
                )}
              </div>
            </td>
            {isEditMode && (
              <td className="px-6 py-4 text-left text-lg text-black capitalize font-normal">Fixed amount</td>
            )}
            <td className="px-6 py-4 text-center text-gray-400">-</td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-center">
                {isEditMode ? (
                  <input 
                    type="text" 
                    placeholder="0" 
                    value={data.amount}
                    disabled={!isEditMode}
                    onChange={(e) => handleChange(component.uuid, 'amount', e.target.value)}
                    className={`w-full px-4 py-2 text-lg bg-transparent focus:ring-0 outline-none ${isEditMode && "rounded-md border-2 border-y-2"} text-right`} 
                  />
                ) : (
                  <div className="w-full flex items-center justify-end pe-[7%] text-lg text-gray-600">
                    $<span>{data.amount || 0}</span>
                  </div>
                )}
              </div>
            </td>
          </tr>
        );
      })}
      {isEditMode && (
        <tr>
          <td colSpan={4} className="px-6 py-4">
            <div className="bg-blue-td-50 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-blue-td-900 mb-1">
                    Fixed CTC (Annual CTC - One Time Earnings)
                  </h4>
                  <p className="text-sm leading-relaxed border-l-4 border-l-blue-td-200 ps-2">
                    Note: Earnings that are based on the Cost to Company (CTC), will be calculated using the Fixed CTC.
                  </p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default OneTimeEarningsRows;
