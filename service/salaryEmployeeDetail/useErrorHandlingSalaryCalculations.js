import { useEffect, useState } from 'react';
import { toast } from "react-toastify";

export const useErrorHandling = (calculations, formData, isDataLoaded, calculationMode) => {
    const [hasCalculationError, setHasCalculationError] = useState(false);
    const [errorShown, setErrorShown] = useState(false);
    
    useEffect(() => {
        if (!calculations) {
            setHasCalculationError(false);
            return;
        }
        
        let hasError = false;
        
        if (calculationMode === 'annual') {
            const ctc = parseFloat(formData.annualCTC) || 0;
            const fixedCTC = calculations.fixedCTC || 0;
            const monthlyCTC = ctc / 12;
            const fixedAllowanceMonthly = calculations.fixedAllowance?.monthly || 0;
            const totalOneTimeEarnings = calculations.totalOneTimeEarnings || 0; // Annual amount
            const totalEmployeeDeductionsAnnual = calculations.totalEmployeeDeductionsAnnual || 0;
            const totalReimbursementsAnnual = calculations.totalReimbursementsAnnual || 0;
            
            // Calculate allEarningsMonthly from individual components
            const allEarningsMonthly = (
                (calculations.basic?.annual || 0) +
                (calculations.hra?.annual || 0) +
                (calculations.dearnessAllowance?.annual || 0) +
                (calculations.conveyanceAllowance?.annual || 0) +
                (calculations.childrenEducationAllowance?.annual || 0) +
                (calculations.hostelExpenditureAllowance?.annual || 0) +
                (calculations.transportAllowance?.annual || 0) +
                (calculations.helperAllowance?.annual || 0) +
                (calculations.travellingAllowance?.annual || 0) +
                (calculations.uniformAllowance?.annual || 0) +
                (calculations.dailyAllowance?.annual || 0) +
                (calculations.cityCompensatoryAllowance?.annual || 0) +
                (calculations.overtimeAllowance?.annual || 0) +
                (calculations.telephoneAllowance?.annual || 0) +
                (calculations.fixedMedicalAllowance?.annual || 0) +
                (calculations.projectAllowance?.annual || 0) +
                (calculations.foodAllowance?.annual || 0) +
                (calculations.holidayAllowance?.annual || 0) +
                (calculations.entertainmentAllowance?.annual || 0) +
                (calculations.foodCoupon?.annual || 0) +
                (calculations.researchAllowance?.annual || 0) +
                (calculations.booksAndPeriodicalsAllowance?.annual || 0) +
                (calculations.fuelAllowance?.annual || 0) +
                (calculations.driverAllowance?.annual || 0) +
                (calculations.leaveTravelAllowance?.annual || 0) +
                (calculations.vehicleMaintenanceAllowance?.annual || 0) +
                (calculations.telephoneAndInternetAllowance?.annual || 0) +
                (calculations.shiftAllowance?.annual || 0)
            ) / 12;
            
            // Get customAllowancesTotal from calculations (it's included in allEarningsWithoutFixedAllowance)
            // But we need to add it separately since allEarningsMonthly calculation above doesn't include it
            // Check if customAllowancesTotal is available in calculations object
            const customAllowancesTotal = calculations.customAllowancesTotal || 0; // Annual amount
            const customAllowancesMonthly = customAllowancesTotal / 12;
            
            const spkEmployeeContributionMonthly = totalEmployeeDeductionsAnnual / 12;
            const reimbursementsMonthly = totalReimbursementsAnnual / 12;
            
            // ✅ FIXED: Check if total components exceed monthlyCTC
            // Formula: Fixed Allowance Monthly + allEarningsMonthly + customAllowancesMonthly + totalOneTimeEarningsAnnual + spkEmployeeContributionMonthly + reimbursementsMonthly
            // If this sum > monthlyCTC, show error
            // Note: totalOneTimeEarnings is annual amount, used directly (not divided by 12)
            const totalComponentsMonthly = fixedAllowanceMonthly + 
                                         allEarningsMonthly + 
                                         customAllowancesMonthly + // Add customAllowancesMonthly separately
                                         totalOneTimeEarnings + // Annual amount used directly
                                         spkEmployeeContributionMonthly + 
                                         reimbursementsMonthly;
            
            // ✅ Check if totalErrorHandling is not zero (should be 0 when balanced)
            // This is the primary indicator - if totalErrorHandling is 0, no error should be shown
            const totalErrorHandlingAnnual = calculations.totalErrorHandling?.annual || 0;
            const totalErrorHandlingNotZero = Math.abs(totalErrorHandlingAnnual) > 0.01; // Use small threshold for floating point comparison
            
            // ✅ If totalErrorHandling is 0 (or very close to 0), no error should be shown
            // Only check other conditions if totalErrorHandling is not zero
            if (!totalErrorHandlingNotZero) {
                hasError = false;
            } else {
                // Only check other conditions if totalErrorHandling is not zero
                const fixedCTCNegative = fixedCTC < 0;
                const fixedAllowanceNegative = fixedAllowanceMonthly < 0;
                const componentsExceedMonthlyCTC = monthlyCTC > 0 && totalComponentsMonthly > monthlyCTC;
                
                hasError = fixedCTCNegative || fixedAllowanceNegative || componentsExceedMonthlyCTC;
            }
        }else {
            hasError = false;
        }
        
        setHasCalculationError(hasError);
        
        if (hasError && isDataLoaded && !errorShown) {
            setErrorShown(true);
        }
        
        if (!hasError && errorShown) {
            setErrorShown(false);
        }
    }, [calculations, formData.annualCTC, isDataLoaded, errorShown, calculationMode]);

    return { hasCalculationError, errorShown };
};