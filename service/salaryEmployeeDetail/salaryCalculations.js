export const calculateOneTimeEarnings = (salaryComponent, bonuses, commissions, giftCoupons) => {
    let totalOneTimeEarnings = 0;
    
    // Bonus
    const bonusComponents = getComponentsByKeySalaryDetail(salaryComponent, "bonus");
    totalOneTimeEarnings += bonusComponents.reduce((total, component) => {
        const bonusData = bonuses[component.uuid];
        const amount = parseFloat(bonusData?.amount || 0);
        return total + amount;
    }, 0);

    // Commission
    const commissionComponents = getComponentsByKeySalaryDetail(salaryComponent, "commission");
    totalOneTimeEarnings += commissionComponents.reduce((total, component) => {
        const commissionData = commissions[component.uuid];
        const amount = parseFloat(commissionData?.amount || 0);
        return total + amount;
    }, 0);

    // Gift Coupon
    const giftCouponComponents = getComponentsByKeySalaryDetail(salaryComponent, "giftCoupon");
    totalOneTimeEarnings += giftCouponComponents.reduce((total, component) => {
        const giftCouponData = giftCoupons[component.uuid];
        const amount = parseFloat(giftCouponData?.amount || 0);
        return total + amount;
    }, 0);
    
    return totalOneTimeEarnings;
};

export const calculateBasicSalary = (selectedBasicComponent, formData, fixedCTC) => {
    if (!selectedBasicComponent) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let basicAnnual = 0;
    if (selectedBasicComponent.calculationType === 'Percentage of CTC') {
        const basicPct = parseFloat(formData.basicPercentage) || 0;
        basicAnnual = (fixedCTC * basicPct) / 100;
    } else if (selectedBasicComponent.calculationType === 'Flat Amount') {
        const basicAmount = parseFloat(formData.basicAmount) || 0;
        basicAnnual = basicAmount * 12;
    }

    return {
        annual: basicAnnual,
        monthly: basicAnnual / 12
    };
};

export const calculateHRA = (selectHouseRentAllowanceComponent, formData, fixedCTC, basicAnnual) => {
    if (!selectHouseRentAllowanceComponent) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let hraAnnual = 0;
    if (selectHouseRentAllowanceComponent.calculationType === 'Percentage of CTC') {
        const hraPct = parseFloat(formData.hraPercentage) || 0;
        hraAnnual = (fixedCTC * hraPct) / 100;
    } else if (selectHouseRentAllowanceComponent.calculationType === 'Percentage of Basic') {
        const hraPct = parseFloat(formData.hraPercentage) || 0;
        hraAnnual = (basicAnnual * hraPct) / 100;
    } else if (selectHouseRentAllowanceComponent.calculationType === 'Flat Amount') {
        const hraAmount = parseFloat(formData.hraAmount) || 0;
        hraAnnual = hraAmount * 12;
    }
    
    return {
        annual: hraAnnual,
        monthly: hraAnnual / 12
    };
};

export const calculateDearnessAllowance = (selectDearnessAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectDearnessAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let dearnessAnnual = 0;
    if (selectDearnessAllowance.calculationType === 'Percentage of CTC') {
        const dearnessPct = parseFloat(formData.dearnessAllowancePercentage) || 0;
        dearnessAnnual = (fixedCTC * dearnessPct) / 100;
    } else if (selectDearnessAllowance.calculationType === 'Percentage of Basic') {
        const dearnessPct = parseFloat(formData.dearnessAllowancePercentage) || 0;
        dearnessAnnual = (basicAnnual * dearnessPct) / 100;
    } else if (selectDearnessAllowance.calculationType === 'Flat Amount') {
        const dearnessAmount = parseFloat(formData.dearnessAllowanceAmount) || 0;
        dearnessAnnual = dearnessAmount * 12;
    }
    
    return {
        annual: dearnessAnnual,
        monthly: dearnessAnnual / 12
    };
};

export const calculateConveyanceAllowance = (selectConveyanceAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectConveyanceAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let conveyanceAllowanceAnnual = 0;
    if (selectConveyanceAllowance.calculationType === 'Percentage of CTC') {
        const conveyanceAllowancePct = parseFloat(formData.conveyanceAllowancePercentage) || 0;
        conveyanceAllowanceAnnual = (fixedCTC * conveyanceAllowancePct) / 100;
    } else if (selectConveyanceAllowance.calculationType === 'Percentage of Basic') {
        const conveyanceAllowancePct = parseFloat(formData.conveyanceAllowancePercentage) || 0;
        conveyanceAllowanceAnnual = (basicAnnual * conveyanceAllowancePct) / 100;
    } else if (selectConveyanceAllowance.calculationType === 'Flat Amount') {
        const conveyanceAllowanceAmount = parseFloat(formData.conveyanceAllowanceAmount) || 0;
        conveyanceAllowanceAnnual = conveyanceAllowanceAmount * 12;
    }
    
    return {
        annual: conveyanceAllowanceAnnual,
        monthly: conveyanceAllowanceAnnual / 12
    };
};

export const calculateChildrenEducationAllowance = (selectChildrenEducationAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectChildrenEducationAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let childrenEducationAllowanceAnnual = 0;
    if (selectChildrenEducationAllowance.calculationType === 'Percentage of CTC') {
        const childrenEducationAllowancePct = parseFloat(formData.childrenEducationAllowancePercentage) || 0;
        childrenEducationAllowanceAnnual = (fixedCTC * childrenEducationAllowancePct) / 100;
    } else if (selectChildrenEducationAllowance.calculationType === 'Percentage of Basic') {
        const childrenEducationAllowancePct = parseFloat(formData.childrenEducationAllowancePercentage) || 0;
        childrenEducationAllowanceAnnual = (basicAnnual * childrenEducationAllowancePct) / 100;
    } else if (selectChildrenEducationAllowance.calculationType === 'Flat Amount') {
        const childrenEducationAllowanceAmount = parseFloat(formData.childrenEducationAllowanceAmount) || 0;
        childrenEducationAllowanceAnnual = childrenEducationAllowanceAmount * 12;
    }
    
    return {
        annual: childrenEducationAllowanceAnnual,
        monthly: childrenEducationAllowanceAnnual / 12
    };
};

export const calculateHostelExpenditureAllowance = (selectHostelExpenditureAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectHostelExpenditureAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let hostelExpenditureAllowanceAnnual = 0;
    if (selectHostelExpenditureAllowance.calculationType === 'Percentage of CTC') {
        const hostelExpenditureAllowancePct = parseFloat(formData.hostelExpenditureAllowancePercentage) || 0;
        hostelExpenditureAllowanceAnnual = (fixedCTC * hostelExpenditureAllowancePct) / 100;
    } else if (selectHostelExpenditureAllowance.calculationType === 'Percentage of Basic') {
        const hostelExpenditureAllowancePct = parseFloat(formData.hostelExpenditureAllowancePercentage) || 0;
        hostelExpenditureAllowanceAnnual = (basicAnnual * hostelExpenditureAllowancePct) / 100;
    } else if (selectHostelExpenditureAllowance.calculationType === 'Flat Amount') {
        const hostelExpenditureAllowanceAmount = parseFloat(formData.hostelExpenditureAllowanceAmount) || 0;
        hostelExpenditureAllowanceAnnual = hostelExpenditureAllowanceAmount * 12;
    }
    
    return {
        annual: hostelExpenditureAllowanceAnnual,
        monthly: hostelExpenditureAllowanceAnnual / 12
    };
};

export const calculateTransportAllowance = (selectTransportAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectTransportAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let transportAllowanceAnnual = 0;
    if (selectTransportAllowance.calculationType === 'Percentage of CTC') {
        const transportAllowancePct = parseFloat(formData.transportAllowancePercentage) || 0;
        transportAllowanceAnnual = (fixedCTC * transportAllowancePct) / 100;
    } else if (selectTransportAllowance.calculationType === 'Percentage of Basic') {
        const transportAllowancePct = parseFloat(formData.transportAllowancePercentage) || 0;
        transportAllowanceAnnual = (basicAnnual * transportAllowancePct) / 100;
    } else if (selectTransportAllowance.calculationType === 'Flat Amount') {
        const transportAllowanceAmount = parseFloat(formData.transportAllowanceAmount) || 0;
        transportAllowanceAnnual = transportAllowanceAmount * 12;
    }
    
    return {
        annual: transportAllowanceAnnual,
        monthly: transportAllowanceAnnual / 12
    };
};

export const calculateHelperAllowance = (selectHelperAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectHelperAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let helperAllowanceAnnual = 0;
    if (selectHelperAllowance.calculationType === 'Percentage of CTC') {
        const helperAllowancePct = parseFloat(formData.helperAllowancePercentage) || 0;
        helperAllowanceAnnual = (fixedCTC * helperAllowancePct) / 100;
    } else if (selectHelperAllowance.calculationType === 'Percentage of Basic') {
        const helperAllowancePct = parseFloat(formData.helperAllowancePercentage) || 0;
        helperAllowanceAnnual = (basicAnnual * helperAllowancePct) / 100;
    } else if (selectHelperAllowance.calculationType === 'Flat Amount') {
        const helperAllowanceAmount = parseFloat(formData.helperAllowanceAmount) || 0;
        helperAllowanceAnnual = helperAllowanceAmount * 12;
    }
    
    return {
        annual: helperAllowanceAnnual,
        monthly: helperAllowanceAnnual / 12
    };
};

export const calculateTravellingAllowance = (selectTravellingAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectTravellingAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let travellingAllowanceAnnual = 0;
    if (selectTravellingAllowance.calculationType === 'Percentage of CTC') {
        const travellingAllowancePct = parseFloat(formData.travellingAllowancePercentage) || 0;
        travellingAllowanceAnnual = (fixedCTC * travellingAllowancePct) / 100;
    } else if (selectTravellingAllowance.calculationType === 'Percentage of Basic') {
        const travellingAllowancePct = parseFloat(formData.travellingAllowancePercentage) || 0;
        travellingAllowanceAnnual = (basicAnnual * travellingAllowancePct) / 100;
    } else if (selectTravellingAllowance.calculationType === 'Flat Amount') {
        const travellingAllowanceAmount = parseFloat(formData.travellingAllowanceAmount) || 0;
        travellingAllowanceAnnual = travellingAllowanceAmount * 12;
    }
    
    return {
        annual: travellingAllowanceAnnual,
        monthly: travellingAllowanceAnnual / 12
    };
};

export const calculateUniformAllowance = (selectUniformAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectUniformAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let uniformAllowanceAnnual = 0;
    if (selectUniformAllowance.calculationType === 'Percentage of CTC') {
        const uniformAllowancePct = parseFloat(formData.uniformAllowancePercentage) || 0;
        uniformAllowanceAnnual = (fixedCTC * uniformAllowancePct) / 100;
    } else if (selectUniformAllowance.calculationType === 'Percentage of Basic') {
        const uniformAllowancePct = parseFloat(formData.uniformAllowancePercentage) || 0;
        uniformAllowanceAnnual = (basicAnnual * uniformAllowancePct) / 100;
    } else if (selectUniformAllowance.calculationType === 'Flat Amount') {
        const uniformAllowanceAmount = parseFloat(formData.uniformAllowanceAmount) || 0;
        uniformAllowanceAnnual = uniformAllowanceAmount * 12;
    }
    
    return {
        annual: uniformAllowanceAnnual,
        monthly: uniformAllowanceAnnual / 12
    };
};

export const calculateDailyAllowance = (selectDailyAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectDailyAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let dailyAllowanceAnnual = 0;
    if (selectDailyAllowance.calculationType === 'Percentage of CTC') {
        const dailyAllowancePct = parseFloat(formData.dailyAllowancePercentage) || 0;
        dailyAllowanceAnnual = (fixedCTC * dailyAllowancePct) / 100;
    } else if (selectDailyAllowance.calculationType === 'Percentage of Basic') {
        const dailyAllowancePct = parseFloat(formData.dailyAllowancePercentage) || 0;
        dailyAllowanceAnnual = (basicAnnual * dailyAllowancePct) / 100;
    } else if (selectDailyAllowance.calculationType === 'Flat Amount') {
        const dailyAllowanceAmount = parseFloat(formData.dailyAllowanceAmount) || 0;
        dailyAllowanceAnnual = dailyAllowanceAmount * 12;
    }
    
    return {
        annual: dailyAllowanceAnnual,
        monthly: dailyAllowanceAnnual / 12
    };
};

export const calculateCityCompensatoryAllowance = (selectCityCompensatoryAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectCityCompensatoryAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let cityCompensatoryAllowanceAnnual = 0;
    if (selectCityCompensatoryAllowance.calculationType === 'Percentage of CTC') {
        const cityCompensatoryAllowancePct = parseFloat(formData.cityCompensatoryAllowancePercentage) || 0;
        cityCompensatoryAllowanceAnnual = (fixedCTC * cityCompensatoryAllowancePct) / 100;
    } else if (selectCityCompensatoryAllowance.calculationType === 'Percentage of Basic') {
        const cityCompensatoryAllowancePct = parseFloat(formData.cityCompensatoryAllowancePercentage) || 0;
        cityCompensatoryAllowanceAnnual = (basicAnnual * cityCompensatoryAllowancePct) / 100;
    } else if (selectCityCompensatoryAllowance.calculationType === 'Flat Amount') {
        const cityCompensatoryAllowanceAmount = parseFloat(formData.cityCompensatoryAllowanceAmount) || 0;
        cityCompensatoryAllowanceAnnual = cityCompensatoryAllowanceAmount * 12;
    }
    
    return {
        annual: cityCompensatoryAllowanceAnnual,
        monthly: cityCompensatoryAllowanceAnnual / 12
    };
};

export const calculateOvertimeAllowance = (selectOvertimeAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectOvertimeAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let overtimeAllowanceAnnual = 0;
    if (selectOvertimeAllowance.calculationType === 'Percentage of CTC') {
        const overtimeAllowancePct = parseFloat(formData.overtimeAllowancePercentage) || 0;
        overtimeAllowanceAnnual = (fixedCTC * overtimeAllowancePct) / 100;
    } else if (selectOvertimeAllowance.calculationType === 'Percentage of Basic') {
        const overtimeAllowancePct = parseFloat(formData.overtimeAllowancePercentage) || 0;
        overtimeAllowanceAnnual = (basicAnnual * overtimeAllowancePct) / 100;
    } else if (selectOvertimeAllowance.calculationType === 'Flat Amount') {
        const overtimeAllowanceAmount = parseFloat(formData.overtimeAllowanceAmount) || 0;
        overtimeAllowanceAnnual = overtimeAllowanceAmount * 12;
    }
    
    return {
        annual: overtimeAllowanceAnnual,
        monthly: overtimeAllowanceAnnual / 12
    };
};

export const calculateTelephoneAllowance = (selectTelephoneAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectTelephoneAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let telephoneAllowanceAnnual = 0;
    if (selectTelephoneAllowance.calculationType === 'Percentage of CTC') {
        const telephoneAllowancePct = parseFloat(formData.telephoneAllowancePercentage) || 0;
        telephoneAllowanceAnnual = (fixedCTC * telephoneAllowancePct) / 100;
    } else if (selectTelephoneAllowance.calculationType === 'Percentage of Basic') {
        const telephoneAllowancePct = parseFloat(formData.telephoneAllowancePercentage) || 0;
        telephoneAllowanceAnnual = (basicAnnual * telephoneAllowancePct) / 100;
    } else if (selectTelephoneAllowance.calculationType === 'Flat Amount') {
        const telephoneAllowanceAmount = parseFloat(formData.telephoneAllowanceAmount) || 0;
        telephoneAllowanceAnnual = telephoneAllowanceAmount * 12;
    }
    
    return {
        annual: telephoneAllowanceAnnual,
        monthly: telephoneAllowanceAnnual / 12
    };
};

export const calculateFixedMedicalAllowance = (selectFixedMedicalAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectFixedMedicalAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let fixedMedicalAllowanceAnnual = 0;
    if (selectFixedMedicalAllowance.calculationType === 'Percentage of CTC') {
        const fixedMedicalAllowancePct = parseFloat(formData.fixedMedicalAllowancePercentage) || 0;
        fixedMedicalAllowanceAnnual = (fixedCTC * fixedMedicalAllowancePct) / 100;
    } else if (selectFixedMedicalAllowance.calculationType === 'Percentage of Basic') {
        const fixedMedicalAllowancePct = parseFloat(formData.fixedMedicalAllowancePercentage) || 0;
        fixedMedicalAllowanceAnnual = (basicAnnual * fixedMedicalAllowancePct) / 100;
    } else if (selectFixedMedicalAllowance.calculationType === 'Flat Amount') {
        const fixedMedicalAllowanceAmount = parseFloat(formData.fixedMedicalAllowanceAmount) || 0;
        fixedMedicalAllowanceAnnual = fixedMedicalAllowanceAmount * 12;
    }
    
    return {
        annual: fixedMedicalAllowanceAnnual,
        monthly: fixedMedicalAllowanceAnnual / 12
    };
};

export const calculateProjectAllowance = (selectProjectAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectProjectAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let projectAllowanceAnnual = 0;
    if (selectProjectAllowance.calculationType === 'Percentage of CTC') {
        const projectAllowancePct = parseFloat(formData.projectAllowancePercentage) || 0;
        projectAllowanceAnnual = (fixedCTC * projectAllowancePct) / 100;
    } else if (selectProjectAllowance.calculationType === 'Percentage of Basic') {
        const projectAllowancePct = parseFloat(formData.projectAllowancePercentage) || 0;
        projectAllowanceAnnual = (basicAnnual * projectAllowancePct) / 100;
    } else if (selectProjectAllowance.calculationType === 'Flat Amount') {
        const projectAllowanceAmount = parseFloat(formData.projectAllowanceAmount) || 0;
        projectAllowanceAnnual = projectAllowanceAmount * 12;
    }
    
    return {
        annual: projectAllowanceAnnual,
        monthly: projectAllowanceAnnual / 12
    };
};

export const calculateFoodAllowance = (selectFoodAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectFoodAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let foodAllowanceAnnual = 0;
    if (selectFoodAllowance.calculationType === 'Percentage of CTC') {
        const foodAllowancePct = parseFloat(formData.foodAllowancePercentage) || 0;
        foodAllowanceAnnual = (fixedCTC * foodAllowancePct) / 100;
    } else if (selectFoodAllowance.calculationType === 'Percentage of Basic') {
        const foodAllowancePct = parseFloat(formData.foodAllowancePercentage) || 0;
        foodAllowanceAnnual = (basicAnnual * foodAllowancePct) / 100;
    } else if (selectFoodAllowance.calculationType === 'Flat Amount') {
        const foodAllowanceAmount = parseFloat(formData.foodAllowanceAmount) || 0;
        foodAllowanceAnnual = foodAllowanceAmount * 12;
    }
    
    return {
        annual: foodAllowanceAnnual,
        monthly: foodAllowanceAnnual / 12
    };
};

export const calculateHolidayAllowance = (selectHolidayAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectHolidayAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let holidayAllowanceAnnual = 0;
    if (selectHolidayAllowance.calculationType === 'Percentage of CTC') {
        const holidayAllowancePct = parseFloat(formData.holidayAllowancePercentage) || 0;
        holidayAllowanceAnnual = (fixedCTC * holidayAllowancePct) / 100;
    } else if (selectHolidayAllowance.calculationType === 'Percentage of Basic') {
        const holidayAllowancePct = parseFloat(formData.holidayAllowancePercentage) || 0;
        holidayAllowanceAnnual = (basicAnnual * holidayAllowancePct) / 100;
    } else if (selectHolidayAllowance.calculationType === 'Flat Amount') {
        const holidayAllowanceAmount = parseFloat(formData.holidayAllowanceAmount) || 0;
        holidayAllowanceAnnual = holidayAllowanceAmount * 12;
    }
    
    return {
        annual: holidayAllowanceAnnual,
        monthly: holidayAllowanceAnnual / 12
    };
};

export const calculateEntertainmentAllowance = (selectEntertainmentAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectEntertainmentAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let entertainmentAllowanceAnnual = 0;
    if (selectEntertainmentAllowance.calculationType === 'Percentage of CTC') {
        const entertainmentAllowancePct = parseFloat(formData.entertainmentAllowancePercentage) || 0;
        entertainmentAllowanceAnnual = (fixedCTC * entertainmentAllowancePct) / 100;
    } else if (selectEntertainmentAllowance.calculationType === 'Percentage of Basic') {
        const entertainmentAllowancePct = parseFloat(formData.entertainmentAllowancePercentage) || 0;
        entertainmentAllowanceAnnual = (basicAnnual * entertainmentAllowancePct) / 100;
    } else if (selectEntertainmentAllowance.calculationType === 'Flat Amount') {
        const entertainmentAllowanceAmount = parseFloat(formData.entertainmentAllowanceAmount) || 0;
        entertainmentAllowanceAnnual = entertainmentAllowanceAmount * 12;
    }
    
    return {
        annual: entertainmentAllowanceAnnual,
        monthly: entertainmentAllowanceAnnual / 12
    };
};

export const calculateFoodCoupon = (selectFoodCoupon, formData, fixedCTC, basicAnnual) => {
    if (!selectFoodCoupon) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let foodCouponAnnual = 0;
    if (selectFoodCoupon.calculationType === 'Percentage of CTC') {
        const foodCouponPct = parseFloat(formData.foodCouponPercentage) || 0;
        foodCouponAnnual = (fixedCTC * foodCouponPct) / 100;
    } else if (selectFoodCoupon.calculationType === 'Percentage of Basic') {
        const foodCouponPct = parseFloat(formData.foodCouponPercentage) || 0;
        foodCouponAnnual = (basicAnnual * foodCouponPct) / 100;
    } else if (selectFoodCoupon.calculationType === 'Flat Amount') {
        const foodCouponAmount = parseFloat(formData.foodCouponAmount) || 0;
        foodCouponAnnual = foodCouponAmount * 12;
    }
    
    return {
        annual: foodCouponAnnual,
        monthly: foodCouponAnnual / 12
    };
};

export const calculateResearchAllowance = (selectResearchAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectResearchAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let researchAllowanceAnnual = 0;
    if (selectResearchAllowance.calculationType === 'Percentage of CTC') {
        const researchAllowancePct = parseFloat(formData.researchAllowancePercentage) || 0;
        researchAllowanceAnnual = (fixedCTC * researchAllowancePct) / 100;
    } else if (selectResearchAllowance.calculationType === 'Percentage of Basic') {
        const researchAllowancePct = parseFloat(formData.researchAllowancePercentage) || 0;
        researchAllowanceAnnual = (basicAnnual * researchAllowancePct) / 100;
    } else if (selectResearchAllowance.calculationType === 'Flat Amount') {
        const researchAllowanceAmount = parseFloat(formData.researchAllowanceAmount) || 0;
        researchAllowanceAnnual = researchAllowanceAmount * 12;
    }
    
    return {
        annual: researchAllowanceAnnual,
        monthly: researchAllowanceAnnual / 12
    };
};

export const calculateBooksAndPeriodicalsAllowance = (selectBooksAndPeriodicalsAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectBooksAndPeriodicalsAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let booksAndPeriodicalsAllowanceAnnual = 0;
    if (selectBooksAndPeriodicalsAllowance.calculationType === 'Percentage of CTC') {
        const booksAndPeriodicalsAllowancePct = parseFloat(formData.booksAndPeriodicalsAllowancePercentage) || 0;
        booksAndPeriodicalsAllowanceAnnual = (fixedCTC * booksAndPeriodicalsAllowancePct) / 100;
    } else if (selectBooksAndPeriodicalsAllowance.calculationType === 'Percentage of Basic') {
        const booksAndPeriodicalsAllowancePct = parseFloat(formData.booksAndPeriodicalsAllowancePercentage) || 0;
        booksAndPeriodicalsAllowanceAnnual = (basicAnnual * booksAndPeriodicalsAllowancePct) / 100;
    } else if (selectBooksAndPeriodicalsAllowance.calculationType === 'Flat Amount') {
        const booksAndPeriodicalsAllowanceAmount = parseFloat(formData.booksAndPeriodicalsAllowanceAmount) || 0;
        booksAndPeriodicalsAllowanceAnnual = booksAndPeriodicalsAllowanceAmount * 12;
    }
    
    return {
        annual: booksAndPeriodicalsAllowanceAnnual,
        monthly: booksAndPeriodicalsAllowanceAnnual / 12
    };
};

export const calculateFuelAllowance = (selectFuelAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectFuelAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let fuelAllowanceAnnual = 0;
    if (selectFuelAllowance.calculationType === 'Percentage of CTC') {
        const fuelAllowancePct = parseFloat(formData.fuelAllowancePercentage) || 0;
        fuelAllowanceAnnual = (fixedCTC * fuelAllowancePct) / 100;
    } else if (selectFuelAllowance.calculationType === 'Percentage of Basic') {
        const fuelAllowancePct = parseFloat(formData.fuelAllowancePercentage) || 0;
        fuelAllowanceAnnual = (basicAnnual * fuelAllowancePct) / 100;
    } else if (selectFuelAllowance.calculationType === 'Flat Amount') {
        const fuelAllowanceAmount = parseFloat(formData.fuelAllowanceAmount) || 0;
        fuelAllowanceAnnual = fuelAllowanceAmount * 12;
    }
    
    return {
        annual: fuelAllowanceAnnual,
        monthly: fuelAllowanceAnnual / 12
    };
};

export const calculateDriverAllowance = (selectDriverAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectDriverAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let driverAllowanceAnnual = 0;
    if (selectDriverAllowance.calculationType === 'Percentage of CTC') {
        const driverAllowancePct = parseFloat(formData.driverAllowancePercentage) || 0;
        driverAllowanceAnnual = (fixedCTC * driverAllowancePct) / 100;
    } else if (selectDriverAllowance.calculationType === 'Percentage of Basic') {
        const driverAllowancePct = parseFloat(formData.driverAllowancePercentage) || 0;
        driverAllowanceAnnual = (basicAnnual * driverAllowancePct) / 100;
    } else if (selectDriverAllowance.calculationType === 'Flat Amount') {
        const driverAllowanceAmount = parseFloat(formData.driverAllowanceAmount) || 0;
        driverAllowanceAnnual = driverAllowanceAmount * 12;
    }
    
    return {
        annual: driverAllowanceAnnual,
        monthly: driverAllowanceAnnual / 12
    };
};

export const calculateLeaveTravelAllowance = (selectLeaveTravelAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectLeaveTravelAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let leaveTravelAllowanceAnnual = 0;
    if (selectLeaveTravelAllowance.calculationType === 'Percentage of CTC') {
        const leaveTravelAllowancePct = parseFloat(formData.leaveTravelAllowancePercentage) || 0;
        leaveTravelAllowanceAnnual = (fixedCTC * leaveTravelAllowancePct) / 100;
    } else if (selectLeaveTravelAllowance.calculationType === 'Percentage of Basic') {
        const leaveTravelAllowancePct = parseFloat(formData.leaveTravelAllowancePercentage) || 0;
        leaveTravelAllowanceAnnual = (basicAnnual * leaveTravelAllowancePct) / 100;
    } else if (selectLeaveTravelAllowance.calculationType === 'Flat Amount') {
        const leaveTravelAllowanceAmount = parseFloat(formData.leaveTravelAllowanceAmount) || 0;
        leaveTravelAllowanceAnnual = leaveTravelAllowanceAmount * 12;
    }
    
    return {
        annual: leaveTravelAllowanceAnnual,
        monthly: leaveTravelAllowanceAnnual / 12
    };
};

export const calculateVehicleMaintenanceAllowance = (selectVehicleMaintenanceAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectVehicleMaintenanceAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let vehicleMaintenanceAllowanceAnnual = 0;
    if (selectVehicleMaintenanceAllowance.calculationType === 'Percentage of CTC') {
        const vehicleMaintenanceAllowancePct = parseFloat(formData.vehicleMaintenanceAllowancePercentage) || 0;
        vehicleMaintenanceAllowanceAnnual = (fixedCTC * vehicleMaintenanceAllowancePct) / 100;
    } else if (selectVehicleMaintenanceAllowance.calculationType === 'Percentage of Basic') {
        const vehicleMaintenanceAllowancePct = parseFloat(formData.vehicleMaintenanceAllowancePercentage) || 0;
        vehicleMaintenanceAllowanceAnnual = (basicAnnual * vehicleMaintenanceAllowancePct) / 100;
    } else if (selectVehicleMaintenanceAllowance.calculationType === 'Flat Amount') {
        const vehicleMaintenanceAllowanceAmount = parseFloat(formData.vehicleMaintenanceAllowanceAmount) || 0;
        vehicleMaintenanceAllowanceAnnual = vehicleMaintenanceAllowanceAmount * 12;
    }
    
    return {
        annual: vehicleMaintenanceAllowanceAnnual,
        monthly: vehicleMaintenanceAllowanceAnnual / 12
    };
};

export const calculateTelephoneAndInternetAllowance = (selectTelephoneAndInternetAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectTelephoneAndInternetAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let telephoneAndInternetAllowanceAnnual = 0;
    if (selectTelephoneAndInternetAllowance.calculationType === 'Percentage of CTC') {
        const telephoneAndInternetAllowancePct = parseFloat(formData.telephoneAndInternetAllowancePercentage) || 0;
        telephoneAndInternetAllowanceAnnual = (fixedCTC * telephoneAndInternetAllowancePct) / 100;
    } else if (selectTelephoneAndInternetAllowance.calculationType === 'Percentage of Basic') {
        const telephoneAndInternetAllowancePct = parseFloat(formData.telephoneAndInternetAllowancePercentage) || 0;
        telephoneAndInternetAllowanceAnnual = (basicAnnual * telephoneAndInternetAllowancePct) / 100;
    } else if (selectTelephoneAndInternetAllowance.calculationType === 'Flat Amount') {
        const telephoneAndInternetAllowanceAmount = parseFloat(formData.telephoneAndInternetAllowanceAmount) || 0;
        telephoneAndInternetAllowanceAnnual = telephoneAndInternetAllowanceAmount * 12;
    }
    
    return {
        annual: telephoneAndInternetAllowanceAnnual,
        monthly: telephoneAndInternetAllowanceAnnual / 12
    };
};

export const calculateShiftAllowance = (selectShiftAllowance, formData, fixedCTC, basicAnnual) => {
    if (!selectShiftAllowance) {
        return {
            annual: 0,
            monthly: 0
        };
    }
    
    let shiftAllowanceAnnual = 0;
    if (selectShiftAllowance.calculationType === 'Percentage of CTC') {
        const shiftAllowancePct = parseFloat(formData.shiftAllowancePercentage) || 0;
        shiftAllowanceAnnual = (fixedCTC * shiftAllowancePct) / 100;
    } else if (selectShiftAllowance.calculationType === 'Percentage of Basic') {
        const shiftAllowancePct = parseFloat(formData.shiftAllowancePercentage) || 0;
        shiftAllowanceAnnual = (basicAnnual * shiftAllowancePct) / 100;
    } else if (selectShiftAllowance.calculationType === 'Flat Amount') {
        const shiftAllowanceAmount = parseFloat(formData.shiftAllowanceAmount) || 0;
        shiftAllowanceAnnual = shiftAllowanceAmount * 12;
    }
    
    return {
        annual: shiftAllowanceAnnual,
        monthly: shiftAllowanceAnnual / 12
    };
};
export const calculateCustomAllowances = (salaryComponent, customAllowances, basicAnnual, fixedCTC) => {
    const customAllowanceComponents = getComponentsByKeySalaryDetail(salaryComponent, "customAllowance");
    // ✅ FIXED: Only include Fixed Pay custom allowances (exclude Variable Pay and One Time Pay)
    // Variable Pay should not be included in allEarningsWithoutFixedAllowance calculation
    return customAllowanceComponents
        .filter(component => {
            // Exclude One Time Pay custom allowances
            const isOneTimePay = component.payType === "One Time Pay" || component.isSchedule === true;
            // ✅ FIXED: Only include Fixed Pay, exclude Variable Pay
            const isFixedPay = component.payType === "Fixed Pay";
            return !isOneTimePay && isFixedPay; // Only Fixed Pay
        })
        .reduce((total, component) => {
            const inputValue = customAllowances[component.uuid] || component.amount || 0;
            const value = parseFloat(inputValue) || 0;
            if (component.calculationType === 'Flat Amount') {
                return total + (value * 12);
            } else if (component.calculationType === 'Percentage of Basic') {
                return total + ((basicAnnual * value) / 100);
            } else if (component.calculationType === 'Percentage of CTC') {
                return total + ((fixedCTC * value) / 100);
            }
            return total;
        }, 0);
};

export const calculateReimbursements = (salaryComponent, reimbursements, fbpSelections = {}) => {
    // ✅ Reimbursements are stored in salaryComponent.reimbursement, not in earning
    let activeReimbursements = [];
    if (salaryComponent?.reimbursement && Array.isArray(salaryComponent.reimbursement)) {
        activeReimbursements = salaryComponent.reimbursement.filter(item => 
            item.markAsActive === true || item.isActive === true
        );
    }
    
    return activeReimbursements.reduce((total, component) => {
        // For FBP reimbursements, only include if selected
        const isFBP = component.includeFlexibleBenefit === true;
        if (isFBP && !fbpSelections[component.uuid]) {
            return total; // Skip if not selected
        }
        
        const inputValue = reimbursements[component.uuid] || 0;
        const value = parseFloat(inputValue) || 0;
        // ✅ For Monthly mode, reimbursements[uuid] is monthly amount, so multiply by 12
        // ✅ For Annual mode, reimbursements[uuid] is also monthly amount (from form input), so multiply by 12
        return total + (value * 12);
    }, 0);
};

export const calculateStatutoryComponents = (statutoryComponentSpk, basicMonthly, citizenCategory) => {
    let totalEmployerBenefitsAnnual = 0;
    let totalEmployeeDeductionsAnnual = 0;
    if (!citizenCategory || basicMonthly <= 0) {
        return { totalEmployerBenefitsAnnual, totalEmployeeDeductionsAnnual };
    }

    const pfWagesMonthly = basicMonthly;
    if (statutoryComponentSpk?.tapNumber && statutoryComponentSpk?.scpNumber) {
        const employeeContributionMonthly = Math.round(pfWagesMonthly * 0.085);
        totalEmployeeDeductionsAnnual = employeeContributionMonthly * 12;
    }
    
    if (statutoryComponentSpk?.tapNumber && statutoryComponentSpk?.scpNumber) {
        let employerContributionMonthly = 0;
        if (pfWagesMonthly <= 500) {
            employerContributionMonthly = 57.50;
        } else if (pfWagesMonthly >= 500.01 && pfWagesMonthly <= 1500) {
            employerContributionMonthly = Math.max(57.50, Math.round(pfWagesMonthly * 0.105));
        } else if (pfWagesMonthly >= 1500.01 && pfWagesMonthly <= 2800) {
            employerContributionMonthly = Math.round(pfWagesMonthly * 0.095);
        } else {
            employerContributionMonthly = Math.round(pfWagesMonthly * 0.085);
        }
        totalEmployerBenefitsAnnual += employerContributionMonthly * 12;
    }
    
    if (statutoryComponentSpk?.isAdminCharges && statutoryComponentSpk?.adminFee) {
        const adminFee = parseFloat(statutoryComponentSpk?.adminFee) || 0;
        let adminAnnual = 0;
        if (statutoryComponentSpk?.deductionCycle === 'Monthly') {
            adminAnnual = adminFee * 12;
        } else if (statutoryComponentSpk?.deductionCycle === 'Annually') {
            adminAnnual = adminFee;
        }
        totalEmployerBenefitsAnnual += adminAnnual;
    }
    
    return { totalEmployerBenefitsAnnual, totalEmployeeDeductionsAnnual };
};

export const getComponentsByKeySalaryDetail = (salaryComponent, key) => {
  const entry = salaryComponent?.earning?.find(e => e[key]);
  return entry?.[key]?.filter(item => item.isActive) ?? [];
};