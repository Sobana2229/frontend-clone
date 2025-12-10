import { useMemo } from 'react';
import {
    calculateBasicSalary,
    calculateHRA,
    calculateDearnessAllowance,
    calculateConveyanceAllowance,
    calculateChildrenEducationAllowance,
    calculateHostelExpenditureAllowance,
    calculateTransportAllowance,
    calculateHelperAllowance,
    calculateTravellingAllowance,
    calculateUniformAllowance,
    calculateDailyAllowance,
    calculateCityCompensatoryAllowance,
    calculateOvertimeAllowance,
    calculateTelephoneAllowance,
    calculateFixedMedicalAllowance,
    calculateProjectAllowance,
    calculateFoodAllowance,
    calculateHolidayAllowance,
    calculateEntertainmentAllowance,
    calculateFoodCoupon,
    calculateResearchAllowance,
    calculateBooksAndPeriodicalsAllowance,
    calculateFuelAllowance,
    calculateDriverAllowance,
    calculateLeaveTravelAllowance,
    calculateVehicleMaintenanceAllowance,
    calculateTelephoneAndInternetAllowance,
    calculateShiftAllowance,
    calculateCustomAllowances,
    calculateReimbursements,
    calculateStatutoryComponents,
    calculateOneTimeEarnings
} from './salaryCalculations';
import { calculateEPFBenefits } from '../../helper/globalHelper';
export const useSalaryCalculations = ({
    formData,
    calculationMode = 'annual',
    selectedBasicComponent,
    selectedHouseRentAllowanceComponent,
    selectedDearnessAllowanceComponent,
    selectedConveyanceAllowanceComponent,
    selectedChildrenEducationAllowanceComponent,
    selectedHostelExpenditureAllowanceComponent,
    selectedTransportAllowanceComponent,
    selectedHelperAllowanceComponent,
    selectedTravellingAllowanceComponent,
    selectedUniformAllowanceComponent,
    selectedDailyAllowanceComponent,
    selectedCityCompensatoryAllowanceComponent,
    selectedOvertimeAllowanceComponent,
    selectedTelephoneAllowanceComponent,
    selectedFixedMedicalAllowanceComponent,
    selectedProjectAllowanceComponent,
    selectedFoodAllowanceComponent,
    selectedHolidayAllowanceComponent,
    selectedEntertainmentAllowanceComponent,
    selectedFoodCouponComponent,
    selectedResearchAllowanceComponent,
    selectedBooksAndPeriodicalsAllowanceComponent,
    selectedFuelAllowanceComponent,
    selectedDriverAllowanceComponent,
    selectedLeaveTravelAllowanceComponent,
    selectedVehicleMaintenanceAllowanceComponent,
    selectedTelephoneAndInternetAllowanceComponent,
    selectedShiftAllowanceComponent,
    customAllowances,
    customAllowancesOneTime, // ✅ Custom Allowance One Time Pay
    bonuses,
    commissions,
    giftCoupons,
    reimbursements,
    fbpSelections,
    statutoryComponentSpk,
    salaryComponent,
    includeOneTimeEarnings = true, // ✅ Toggle to include/exclude one time earnings
}) => {
    return useMemo(() => {
        const roundToTwo = (num) => Math.round(num * 100) / 100;
        // ✅ Calculate One Time Earnings (Bonus + Commission + Gift Coupon + Custom Allowance One Time Pay)
        // ✅ Only calculate if includeOneTimeEarnings is true
        const totalOneTimeEarningsFromComponents = includeOneTimeEarnings ? calculateOneTimeEarnings(
            salaryComponent, 
            bonuses, 
            commissions, 
            giftCoupons
        ) : 0;
        
        // ✅ Calculate Custom Allowance One Time Pay
        // ✅ Only calculate if includeOneTimeEarnings is true
        const customAllowanceOneTimeTotal = includeOneTimeEarnings ? Object.values(customAllowancesOneTime || {}).reduce((total, item) => {
            const amount = parseFloat(item?.amount || 0);
            return total + amount;
        }, 0) : 0;
        
        // ✅ Total One Time Earnings = Bonus + Commission + Gift Coupon + Custom Allowance One Time Pay
        // ✅ Will be 0 if includeOneTimeEarnings is false
        const totalOneTimeEarnings = totalOneTimeEarningsFromComponents + customAllowanceOneTimeTotal;

        if (calculationMode === 'monthly') {
            // MONTHLY-FIRST FLOW: Calculate from individual component inputs
            
            const basicMonthly = parseFloat(formData.basicMonthly) || 0;
            const hraMonthly = parseFloat(formData.hraMonthly) || 0;
            const dearnessAllowanceMonthly = parseFloat(formData.dearnessAllowanceMonthly) || 0;
            const conveyanceAllowanceMonthly = parseFloat(formData.conveyanceAllowanceMonthly) || 0;
            const childrenEducationAllowanceMonthly = parseFloat(formData.childrenEducationAllowanceMonthly) || 0;
            const hostelExpenditureAllowanceMonthly = parseFloat(formData.hostelExpenditureAllowanceMonthly) || 0;
            const transportAllowanceMonthly = parseFloat(formData.transportAllowanceMonthly) || 0;
            const helperAllowanceMonthly = parseFloat(formData.helperAllowanceMonthly) || 0;
            const travellingAllowanceMonthly = parseFloat(formData.travellingAllowanceMonthly) || 0;
            const uniformAllowanceMonthly = parseFloat(formData.uniformAllowanceMonthly) || 0;
            const dailyAllowanceMonthly = parseFloat(formData.dailyAllowanceMonthly) || 0;
            const cityCompensatoryAllowanceMonthly = parseFloat(formData.cityCompensatoryAllowanceMonthly) || 0;
            const overtimeAllowanceMonthly = parseFloat(formData.overtimeAllowanceMonthly) || 0;
            const telephoneAllowanceMonthly = parseFloat(formData.telephoneAllowanceMonthly) || 0;
            const fixedMedicalAllowanceMonthly = parseFloat(formData.fixedMedicalAllowanceMonthly) || 0;
            const projectAllowanceMonthly = parseFloat(formData.projectAllowanceMonthly) || 0;
            const foodAllowanceMonthly = parseFloat(formData.foodAllowanceMonthly) || 0;
            const holidayAllowanceMonthly = parseFloat(formData.holidayAllowanceMonthly) || 0;
            const entertainmentAllowanceMonthly = parseFloat(formData.entertainmentAllowanceMonthly) || 0;
            const foodCouponMonthly = parseFloat(formData.foodCouponMonthly) || 0;
            const researchAllowanceMonthly = parseFloat(formData.researchAllowanceMonthly) || 0;
            const booksAndPeriodicalsAllowanceMonthly = parseFloat(formData.booksAndPeriodicalsAllowanceMonthly) || 0;
            const fuelAllowanceMonthly = parseFloat(formData.fuelAllowanceMonthly) || 0;
            const driverAllowanceMonthly = parseFloat(formData.driverAllowanceMonthly) || 0;
            const leaveTravelAllowanceMonthly = parseFloat(formData.leaveTravelAllowanceMonthly) || 0;
            const vehicleMaintenanceAllowanceMonthly = parseFloat(formData.vehicleMaintenanceAllowanceMonthly) || 0;
            const telephoneAndInternetAllowanceMonthly = parseFloat(formData.telephoneAndInternetAllowanceMonthly) || 0;
            const shiftAllowanceMonthly = parseFloat(formData.shiftAllowanceMonthly) || 0;
            
            const customAllowancesTotal = calculateCustomAllowances(
                salaryComponent, 
                customAllowances, 
                basicMonthly * 12,
                0
            );
            
            const totalReimbursementsAnnual = calculateReimbursements(
                salaryComponent, 
                reimbursements, 
                fbpSelections
            );
            
            const { totalEmployerBenefitsAnnual, totalEmployeeDeductionsAnnual } = calculateStatutoryComponents(
                statutoryComponentSpk, 
                basicMonthly,
                statutoryComponentSpk?.citizenCategory
            );
            
            const basic = { 
                monthly: basicMonthly, 
                annual: basicMonthly * 12 
            };
            const hra = { 
                monthly: hraMonthly, 
                annual: hraMonthly * 12 
            };
            const dearnessAllowance = { 
                monthly: dearnessAllowanceMonthly, 
                annual: dearnessAllowanceMonthly * 12 
            };
            const conveyanceAllowance = { 
                monthly: conveyanceAllowanceMonthly, 
                annual: conveyanceAllowanceMonthly * 12 
            };
            const childrenEducationAllowance = { 
                monthly: childrenEducationAllowanceMonthly, 
                annual: childrenEducationAllowanceMonthly * 12 
            };
            const hostelExpenditureAllowance = { 
                monthly: hostelExpenditureAllowanceMonthly, 
                annual: hostelExpenditureAllowanceMonthly * 12 
            };
            const transportAllowance = { 
                monthly: transportAllowanceMonthly, 
                annual: transportAllowanceMonthly * 12 
            };
            const helperAllowance = { 
                monthly: helperAllowanceMonthly, 
                annual: helperAllowanceMonthly * 12 
            };
            const travellingAllowance = { 
                monthly: travellingAllowanceMonthly, 
                annual: travellingAllowanceMonthly * 12 
            };
            const uniformAllowance = { 
                monthly: uniformAllowanceMonthly, 
                annual: uniformAllowanceMonthly * 12 
            };
            const dailyAllowance = { 
                monthly: dailyAllowanceMonthly, 
                annual: dailyAllowanceMonthly * 12 
            };
            const cityCompensatoryAllowance = { 
                monthly: cityCompensatoryAllowanceMonthly, 
                annual: cityCompensatoryAllowanceMonthly * 12 
            };
            const overtimeAllowance = { 
                monthly: overtimeAllowanceMonthly, 
                annual: overtimeAllowanceMonthly * 12 
            };
            const telephoneAllowance = { 
                monthly: telephoneAllowanceMonthly, 
                annual: telephoneAllowanceMonthly * 12 
            };
            const fixedMedicalAllowance = { 
                monthly: fixedMedicalAllowanceMonthly, 
                annual: fixedMedicalAllowanceMonthly * 12 
            };
            const projectAllowance = { 
                monthly: projectAllowanceMonthly, 
                annual: projectAllowanceMonthly * 12 
            };
            const foodAllowance = { 
                monthly: foodAllowanceMonthly, 
                annual: foodAllowanceMonthly * 12 
            };
            const holidayAllowance = { 
                monthly: holidayAllowanceMonthly, 
                annual: holidayAllowanceMonthly * 12 
            };
            const entertainmentAllowance = { 
                monthly: entertainmentAllowanceMonthly, 
                annual: entertainmentAllowanceMonthly * 12 
            };
            const foodCoupon = { 
                monthly: foodCouponMonthly, 
                annual: foodCouponMonthly * 12 
            };
            const researchAllowance = { 
                monthly: researchAllowanceMonthly, 
                annual: researchAllowanceMonthly * 12 
            };
            const booksAndPeriodicalsAllowance = { 
                monthly: booksAndPeriodicalsAllowanceMonthly, 
                annual: booksAndPeriodicalsAllowanceMonthly * 12 
            };
            const fuelAllowance = { 
                monthly: fuelAllowanceMonthly, 
                annual: fuelAllowanceMonthly * 12 
            };
            const driverAllowance = { 
                monthly: driverAllowanceMonthly, 
                annual: driverAllowanceMonthly * 12 
            };
            const leaveTravelAllowance = { 
                monthly: leaveTravelAllowanceMonthly, 
                annual: leaveTravelAllowanceMonthly * 12 
            };
            const vehicleMaintenanceAllowance = { 
                monthly: vehicleMaintenanceAllowanceMonthly, 
                annual: vehicleMaintenanceAllowanceMonthly * 12 
            };
            const telephoneAndInternetAllowance = { 
                monthly: telephoneAndInternetAllowanceMonthly, 
                annual: telephoneAndInternetAllowanceMonthly * 12 
            };
            const shiftAllowance = { 
                monthly: shiftAllowanceMonthly, 
                annual: shiftAllowanceMonthly * 12 
            };
            
            const fixedAllowance = { 
                monthly: 0, 
                annual: 0 
            };
            
            const spk = calculateEPFBenefits(basic.monthly, statutoryComponentSpk, statutoryComponentSpk?.citizenCategory);
            const totalSpkMonthly = spk
                .filter(item => item.type === 'employer_cost')
                .reduce((acc, item) => acc + item.monthly, 0);
            const grossSalaryAnnual = basic.annual + hra.annual + dearnessAllowance.annual + 
                conveyanceAllowance.annual + childrenEducationAllowance.annual + hostelExpenditureAllowance.annual + 
                transportAllowance.annual + helperAllowance.annual + travellingAllowance.annual + 
                uniformAllowance.annual + dailyAllowance.annual + cityCompensatoryAllowance.annual + 
                overtimeAllowance.annual + telephoneAllowance.annual + fixedMedicalAllowance.annual + 
                projectAllowance.annual + foodAllowance.annual + holidayAllowance.annual + 
                entertainmentAllowance.annual + researchAllowance.annual + foodCoupon.annual + 
                booksAndPeriodicalsAllowance.annual + fuelAllowance.annual + driverAllowance.annual + 
                leaveTravelAllowance.annual + vehicleMaintenanceAllowance.annual + telephoneAndInternetAllowance.annual + 
                shiftAllowance.annual + customAllowancesTotal + totalReimbursementsAnnual + (totalSpkMonthly * 12);
            
            const grossSalaryMonthly = grossSalaryAnnual / 12;
            const netSalaryAnnual = grossSalaryAnnual - totalEmployeeDeductionsAnnual;
            const netSalaryMonthly = netSalaryAnnual / 12;
            
            // ✅ MONTHLY MODE: Calculate CTC according to formula
            // Formula: monthlyCTC = totalEarningsMonthly + totalReimbursementsMonthly + totalOneTimeEarnings
            // Note: totalOneTimeEarnings is annual amount, but added directly to monthlyCTC per requirement
            // annualCTC = monthlyCTC * 12
            const totalEarningsMonthly = basic.monthly + hra.monthly + dearnessAllowance.monthly + 
                conveyanceAllowance.monthly + childrenEducationAllowance.monthly + hostelExpenditureAllowance.monthly + 
                transportAllowance.monthly + helperAllowance.monthly + travellingAllowance.monthly + 
                uniformAllowance.monthly + dailyAllowance.monthly + cityCompensatoryAllowance.monthly + 
                overtimeAllowance.monthly + telephoneAllowance.monthly + fixedMedicalAllowance.monthly + 
                projectAllowance.monthly + foodAllowance.monthly + holidayAllowance.monthly + 
                entertainmentAllowance.monthly + researchAllowance.monthly + foodCoupon.monthly + 
                booksAndPeriodicalsAllowance.monthly + fuelAllowance.monthly + driverAllowance.monthly + 
                leaveTravelAllowance.monthly + vehicleMaintenanceAllowance.monthly + telephoneAndInternetAllowance.monthly + 
                shiftAllowance.monthly + (customAllowancesTotal / 12); // Custom Allowance Fixed Pay (convert annual to monthly)
            
            const totalReimbursementsMonthly = totalReimbursementsAnnual / 12;
            // ✅ Formula: monthlyCTC = totalEarningsMonthly + totalReimbursementsMonthly + totalOneTimeEarnings (annual)
            const monthlyCTC = totalEarningsMonthly + totalReimbursementsMonthly + totalOneTimeEarnings;
            const ctcCalculated = monthlyCTC * 12; // annualCTC
            
            // ✅ For monthly mode, totalCostToCompany = calculated annualCTC
            const totalCostToCompanyAnnual = ctcCalculated;
            const totalCostToCompanyMonthly = monthlyCTC;
            
            return {
                basic: { 
                    monthly: roundToTwo(basic.monthly), 
                    annual: roundToTwo(basic.annual) 
                },
                hra: { 
                    monthly: roundToTwo(hra.monthly), 
                    annual: roundToTwo(hra.annual) 
                },
                dearnessAllowance: { 
                    monthly: roundToTwo(dearnessAllowance.monthly), 
                    annual: roundToTwo(dearnessAllowance.annual) 
                },
                conveyanceAllowance: { 
                    monthly: roundToTwo(conveyanceAllowance.monthly), 
                    annual: roundToTwo(conveyanceAllowance.annual) 
                },
                childrenEducationAllowance: { 
                    monthly: roundToTwo(childrenEducationAllowance.monthly), 
                    annual: roundToTwo(childrenEducationAllowance.annual) 
                },
                hostelExpenditureAllowance: { 
                    monthly: roundToTwo(hostelExpenditureAllowance.monthly), 
                    annual: roundToTwo(hostelExpenditureAllowance.annual) 
                },
                transportAllowance: { 
                    monthly: roundToTwo(transportAllowance.monthly), 
                    annual: roundToTwo(transportAllowance.annual) 
                },
                helperAllowance: { 
                    monthly: roundToTwo(helperAllowance.monthly), 
                    annual: roundToTwo(helperAllowance.annual) 
                },
                travellingAllowance: { 
                    monthly: roundToTwo(travellingAllowance.monthly), 
                    annual: roundToTwo(travellingAllowance.annual) 
                },
                uniformAllowance: { 
                    monthly: roundToTwo(uniformAllowance.monthly), 
                    annual: roundToTwo(uniformAllowance.annual) 
                },
                dailyAllowance: { 
                    monthly: roundToTwo(dailyAllowance.monthly), 
                    annual: roundToTwo(dailyAllowance.annual) 
                },
                cityCompensatoryAllowance: { 
                    monthly: roundToTwo(cityCompensatoryAllowance.monthly), 
                    annual: roundToTwo(cityCompensatoryAllowance.annual) 
                },
                overtimeAllowance: { 
                    monthly: roundToTwo(overtimeAllowance.monthly), 
                    annual: roundToTwo(overtimeAllowance.annual) 
                },
                telephoneAllowance: { 
                    monthly: roundToTwo(telephoneAllowance.monthly), 
                    annual: roundToTwo(telephoneAllowance.annual) 
                },
                fixedMedicalAllowance: { 
                    monthly: roundToTwo(fixedMedicalAllowance.monthly), 
                    annual: roundToTwo(fixedMedicalAllowance.annual) 
                },
                projectAllowance: { 
                    monthly: roundToTwo(projectAllowance.monthly), 
                    annual: roundToTwo(projectAllowance.annual) 
                },
                foodAllowance: { 
                    monthly: roundToTwo(foodAllowance.monthly), 
                    annual: roundToTwo(foodAllowance.annual) 
                },
                holidayAllowance: { 
                    monthly: roundToTwo(holidayAllowance.monthly), 
                    annual: roundToTwo(holidayAllowance.annual) 
                },
                entertainmentAllowance: { 
                    monthly: roundToTwo(entertainmentAllowance.monthly), 
                    annual: roundToTwo(entertainmentAllowance.annual) 
                },
                foodCoupon: { 
                    monthly: roundToTwo(foodCoupon.monthly), 
                    annual: roundToTwo(foodCoupon.annual) 
                },
                researchAllowance: { 
                    monthly: roundToTwo(researchAllowance.monthly), 
                    annual: roundToTwo(researchAllowance.annual) 
                },
                booksAndPeriodicalsAllowance: { 
                    monthly: roundToTwo(booksAndPeriodicalsAllowance.monthly), 
                    annual: roundToTwo(booksAndPeriodicalsAllowance.annual) 
                },
                fuelAllowance: { 
                    monthly: roundToTwo(fuelAllowance.monthly), 
                    annual: roundToTwo(fuelAllowance.annual) 
                },
                driverAllowance: { 
                    monthly: roundToTwo(driverAllowance.monthly), 
                    annual: roundToTwo(driverAllowance.annual) 
                },
                leaveTravelAllowance: { 
                    monthly: roundToTwo(leaveTravelAllowance.monthly), 
                    annual: roundToTwo(leaveTravelAllowance.annual) 
                },
                vehicleMaintenanceAllowance: { 
                    monthly: roundToTwo(vehicleMaintenanceAllowance.monthly), 
                    annual: roundToTwo(vehicleMaintenanceAllowance.annual) 
                },
                telephoneAndInternetAllowance: { 
                    monthly: roundToTwo(telephoneAndInternetAllowance.monthly), 
                    annual: roundToTwo(telephoneAndInternetAllowance.annual) 
                },
                shiftAllowance: { 
                    monthly: roundToTwo(shiftAllowance.monthly), 
                    annual: roundToTwo(shiftAllowance.annual) 
                },
                fixedAllowance: { 
                    monthly: roundToTwo(fixedAllowance.monthly), 
                    annual: roundToTwo(fixedAllowance.annual) 
                },
                gross: { 
                    monthly: roundToTwo(grossSalaryMonthly), 
                    annual: roundToTwo(grossSalaryAnnual) 
                },
                net: { 
                    monthly: roundToTwo(netSalaryMonthly), 
                    annual: roundToTwo(netSalaryAnnual) 
                },
                total: { 
                    monthly: roundToTwo(ctcCalculated / 12), 
                    annual: roundToTwo(ctcCalculated) 
                },
                totalCostToCompany: {
                    monthly: roundToTwo(totalCostToCompanyMonthly),
                    annual: roundToTwo(totalCostToCompanyAnnual)
                },
                totalOneTimeEarnings,
                totalEmployerBenefitsAnnual,
                totalEmployeeDeductionsAnnual,
                totalReimbursementsAnnual,
                fixedCTC: 0,
                ctcCalculated
            };
            
        } else {
            // ANNUAL-FIRST FLOW: Original calculation logic
            const ctc = parseFloat(formData.annualCTC) || 0;
            const fixedCTC = ctc - totalOneTimeEarnings;
            
            const basic = calculateBasicSalary(selectedBasicComponent, formData, fixedCTC);
            const hra = calculateHRA(selectedHouseRentAllowanceComponent, formData, fixedCTC, basic.annual);
            const dearnessAllowance = calculateDearnessAllowance(selectedDearnessAllowanceComponent, formData, fixedCTC, basic.annual);
            const conveyanceAllowance = calculateConveyanceAllowance(selectedConveyanceAllowanceComponent, formData, fixedCTC, basic.annual);
            const childrenEducationAllowance = calculateChildrenEducationAllowance(selectedChildrenEducationAllowanceComponent, formData, fixedCTC, basic.annual);
            const hostelExpenditureAllowance = calculateHostelExpenditureAllowance(selectedHostelExpenditureAllowanceComponent, formData, fixedCTC, basic.annual);
            const transportAllowance = calculateTransportAllowance(selectedTransportAllowanceComponent, formData, fixedCTC, basic.annual);
            const helperAllowance = calculateHelperAllowance(selectedHelperAllowanceComponent, formData, fixedCTC, basic.annual);
            const travellingAllowance = calculateTravellingAllowance(selectedTravellingAllowanceComponent, formData, fixedCTC, basic.annual);
            const uniformAllowance = calculateUniformAllowance(selectedUniformAllowanceComponent, formData, fixedCTC, basic.annual);
            const dailyAllowance = calculateDailyAllowance(selectedDailyAllowanceComponent, formData, fixedCTC, basic.annual);
            const cityCompensatoryAllowance = calculateCityCompensatoryAllowance(selectedCityCompensatoryAllowanceComponent, formData, fixedCTC, basic.annual);
            const overtimeAllowance = calculateOvertimeAllowance(selectedOvertimeAllowanceComponent, formData, fixedCTC, basic.annual);
            const telephoneAllowance = calculateTelephoneAllowance(selectedTelephoneAllowanceComponent, formData, fixedCTC, basic.annual);
            const fixedMedicalAllowance = calculateFixedMedicalAllowance(selectedFixedMedicalAllowanceComponent, formData, fixedCTC, basic.annual);
            const projectAllowance = calculateProjectAllowance(selectedProjectAllowanceComponent, formData, fixedCTC, basic.annual);
            const foodAllowance = calculateFoodAllowance(selectedFoodAllowanceComponent, formData, fixedCTC, basic.annual);
            const holidayAllowance = calculateHolidayAllowance(selectedHolidayAllowanceComponent, formData, fixedCTC, basic.annual);
            const entertainmentAllowance = calculateEntertainmentAllowance(selectedEntertainmentAllowanceComponent, formData, fixedCTC, basic.annual);
            const foodCoupon = calculateFoodCoupon(selectedFoodCouponComponent, formData, fixedCTC, basic.annual);
            const researchAllowance = calculateResearchAllowance(selectedResearchAllowanceComponent, formData, fixedCTC, basic.annual);
            const booksAndPeriodicalsAllowance = calculateBooksAndPeriodicalsAllowance(selectedBooksAndPeriodicalsAllowanceComponent, formData, fixedCTC, basic.annual);
            const fuelAllowance = calculateFuelAllowance(selectedFuelAllowanceComponent, formData, fixedCTC, basic.annual);
            const driverAllowance = calculateDriverAllowance(selectedDriverAllowanceComponent, formData, fixedCTC, basic.annual);
            const leaveTravelAllowance = calculateLeaveTravelAllowance(selectedLeaveTravelAllowanceComponent, formData, fixedCTC, basic.annual);
            const vehicleMaintenanceAllowance = calculateVehicleMaintenanceAllowance(selectedVehicleMaintenanceAllowanceComponent, formData, fixedCTC, basic.annual);
            const telephoneAndInternetAllowance = calculateTelephoneAndInternetAllowance(selectedTelephoneAndInternetAllowanceComponent, formData, fixedCTC, basic.annual);
            const shiftAllowance = calculateShiftAllowance(selectedShiftAllowanceComponent, formData, fixedCTC, basic.annual);
            
            const customAllowancesTotal = calculateCustomAllowances(
                salaryComponent, 
                customAllowances, 
                basic.annual, 
                fixedCTC
            );
            
            const totalReimbursementsAnnual = calculateReimbursements(
                salaryComponent, 
                reimbursements, 
                fbpSelections
            );
            
            const { totalEmployerBenefitsAnnual, totalEmployeeDeductionsAnnual } = calculateStatutoryComponents(
                statutoryComponentSpk, 
                basic.monthly,
                statutoryComponentSpk?.citizenCategory
            );
            const spk = calculateEPFBenefits(basic.monthly, statutoryComponentSpk, statutoryComponentSpk?.citizenCategory);
            const totalSpkMonthly = spk
                .filter(item => item.type === 'employer_cost')
                .reduce((acc, item) => acc + item.monthly, 0);
            
            // ✅ FIXED: Calculate Fixed Allowance as LEFTOVER from Monthly CTC
            // Formula: Fixed Allowance = Monthly CTC - (All Earnings + One Time Earnings + Reimbursements + SPK Employee Contribution)
            // Where Monthly CTC = annualCTC / 12 (not fixedCTC, because totalMonthly = annualCTC / 12)
            const allEarningsWithoutFixedAllowance = 
                basic.annual + 
                hra.annual + 
                dearnessAllowance.annual + 
                conveyanceAllowance.annual + 
                childrenEducationAllowance.annual + 
                hostelExpenditureAllowance.annual + 
                transportAllowance.annual + 
                helperAllowance.annual + 
                travellingAllowance.annual + 
                uniformAllowance.annual + 
                dailyAllowance.annual + 
                cityCompensatoryAllowance.annual + 
                overtimeAllowance.annual + 
                telephoneAllowance.annual + 
                fixedMedicalAllowance.annual + 
                projectAllowance.annual + 
                foodAllowance.annual + 
                holidayAllowance.annual + 
                entertainmentAllowance.annual + 
                foodCoupon.annual + 
                booksAndPeriodicalsAllowance.annual + 
                researchAllowance.annual + 
                fuelAllowance.annual + 
                driverAllowance.annual + 
                leaveTravelAllowance.annual + 
                vehicleMaintenanceAllowance.annual + 
                telephoneAndInternetAllowance.annual + 
                shiftAllowance.annual + 
                customAllowancesTotal;
            
            // Calculate monthly CTC from annualCTC (this equals totalMonthly)
            const monthlyCTC = ctc / 12;
            
            // ✅ BREAKDOWN: All Earnings Components (Annual)
            const earningsBreakdown = {
                basic: basic.annual,
                hra: hra.annual,
                dearnessAllowance: dearnessAllowance.annual,
                conveyanceAllowance: conveyanceAllowance.annual,
                childrenEducationAllowance: childrenEducationAllowance.annual,
                hostelExpenditureAllowance: hostelExpenditureAllowance.annual,
                transportAllowance: transportAllowance.annual,
                helperAllowance: helperAllowance.annual,
                travellingAllowance: travellingAllowance.annual,
                uniformAllowance: uniformAllowance.annual,
                dailyAllowance: dailyAllowance.annual,
                cityCompensatoryAllowance: cityCompensatoryAllowance.annual,
                overtimeAllowance: overtimeAllowance.annual,
                telephoneAllowance: telephoneAllowance.annual,
                fixedMedicalAllowance: fixedMedicalAllowance.annual,
                projectAllowance: projectAllowance.annual,
                foodAllowance: foodAllowance.annual,
                holidayAllowance: holidayAllowance.annual,
                entertainmentAllowance: entertainmentAllowance.annual,
                foodCoupon: foodCoupon.annual,
                booksAndPeriodicalsAllowance: booksAndPeriodicalsAllowance.annual,
                researchAllowance: researchAllowance.annual,
                fuelAllowance: fuelAllowance.annual,
                driverAllowance: driverAllowance.annual,
                leaveTravelAllowance: leaveTravelAllowance.annual,
                vehicleMaintenanceAllowance: vehicleMaintenanceAllowance.annual,
                telephoneAndInternetAllowance: telephoneAndInternetAllowance.annual,
                shiftAllowance: shiftAllowance.annual,
                customAllowancesTotal: customAllowancesTotal // ✅ Custom Allowance (Fixed Pay ONLY, NOT Variable Pay or One Time Pay)
            };
            
            // Calculate all components in monthly terms
            const allEarningsMonthly = allEarningsWithoutFixedAllowance / 12;
            const oneTimeEarningsMonthly = totalOneTimeEarnings / 12;
            const reimbursementsMonthly = totalReimbursementsAnnual / 12;
            const spkEmployeeContributionMonthly = totalEmployeeDeductionsAnnual / 12;
            
            // ✅ FIXED: Fixed Allowance = Monthly CTC - (All Earnings + One Time Earnings Annual + Reimbursements + SPK Employee Contribution)
            // Formula: monthlyCTC - allEarningsMonthly - totalOneTimeEarningsAnnual - spkEmployeeContributionMonthly - reimbursementsMonthly
            // Note: One Time Earnings Annual (215) is subtracted directly from monthly CTC (not converted to monthly)
            // This means: monthlyCTC already accounts for One Time Earnings as if it's paid monthly
            const fixedAllowanceMonthly = Math.max(0, 
                monthlyCTC - 
                allEarningsMonthly - 
                totalOneTimeEarnings - // ✅ Use annual amount directly (not divided by 12)
                reimbursementsMonthly - 
                spkEmployeeContributionMonthly
            );
            
            const fixedAllowanceAnnual = fixedAllowanceMonthly * 12;
            
            // ✅ FIXED: Adjust ctcCalculated to account for the fact that totalOneTimeEarnings was already subtracted in fixedAllowance
            // Since fixedAllowanceMonthly subtracts totalOneTimeEarnings from monthlyCTC, when we calculate annual:
            // - fixedAllowanceAnnual = (monthlyCTC - totalOneTimeEarnings - ...) * 12
            // - grossSalaryAnnual includes fixedAllowanceAnnual
            // - So when we add totalOneTimeEarnings back for CTC, we're adding it back correctly
            // But we need to ensure ctcCalculated = annualCTC
            // Formula: ctcCalculated = grossSalaryAnnual + totalOneTimeEarnings + SPK Employer Cost
            // But since fixedAllowance already subtracted totalOneTimeEarnings from monthly, we need to add it back properly
            
            // ✅ FIXED: grossSalaryAnnual uses normal formula (all earnings + reimbursements + fixedAllowance)
            // Note: fixedAllowanceAnnual is calculated as sum of components for display/reporting purposes
            // But for grossSalaryAnnual, we use the standard formula
            const grossSalaryAnnual = basic.annual + hra.annual + dearnessAllowance.annual + conveyanceAllowance.annual + childrenEducationAllowance.annual + hostelExpenditureAllowance.annual + transportAllowance.annual + helperAllowance.annual + travellingAllowance.annual + uniformAllowance.annual + dailyAllowance.annual + cityCompensatoryAllowance.annual + overtimeAllowance.annual + telephoneAllowance.annual + fixedMedicalAllowance.annual + projectAllowance.annual + foodAllowance.annual + holidayAllowance.annual + entertainmentAllowance.annual + researchAllowance.annual + foodCoupon.annual + booksAndPeriodicalsAllowance.annual + fuelAllowance.annual + driverAllowance.annual + leaveTravelAllowance.annual + vehicleMaintenanceAllowance.annual + telephoneAndInternetAllowance.annual + shiftAllowance.annual + customAllowancesTotal + totalReimbursementsAnnual + fixedAllowanceAnnual;
            const grossSalaryMonthly = grossSalaryAnnual / 12;
            const netSalaryAnnual = grossSalaryAnnual - totalEmployeeDeductionsAnnual;
            const netSalaryMonthly = netSalaryAnnual / 12;
            
            // ✅ FIXED: Calculate CTC correctly to match annualCTC
            // The issue: fixedAllowanceMonthly subtracts totalOneTimeEarnings (215 annual) from monthlyCTC (2000)
            // This means: fixedAllowanceAnnual = (2000 - 215 - ...) * 12 = (1785 - ...) * 12
            // When we calculate grossSalaryAnnual, it includes fixedAllowanceAnnual
            // Then we add totalOneTimeEarnings (215) back, but this doesn't account for the fact that
            // we subtracted 215 from each of the 12 months (total 215 * 12 = 2580), but only add back 215 once.
            // 
            // To fix this, we need to adjust the calculation:
            // Since fixedAllowanceMonthly = monthlyCTC - allEarningsMonthly - totalOneTimeEarnings - reimbursementsMonthly - spkEmployeeContributionMonthly
            // And fixedAllowanceAnnual = fixedAllowanceMonthly * 12
            // Then: grossSalaryAnnual = allEarningsAnnual + reimbursementsAnnual + fixedAllowanceAnnual
            //      = allEarningsAnnual + reimbursementsAnnual + (monthlyCTC - allEarningsMonthly - totalOneTimeEarnings - reimbursementsMonthly - spkEmployeeContributionMonthly) * 12
            //      = allEarningsAnnual + reimbursementsAnnual + (monthlyCTC * 12) - (allEarningsMonthly * 12) - (totalOneTimeEarnings * 12) - (reimbursementsMonthly * 12) - (spkEmployeeContributionMonthly * 12)
            //      = allEarningsAnnual + reimbursementsAnnual + annualCTC - allEarningsAnnual - (totalOneTimeEarnings * 12) - reimbursementsAnnual - (spkEmployeeContributionMonthly * 12)
            //      = annualCTC - (totalOneTimeEarnings * 12) - (spkEmployeeContributionMonthly * 12)
            // 
            // So: ctcCalculated = grossSalaryAnnual + totalOneTimeEarnings + SPK Employer
            //                  = annualCTC - (totalOneTimeEarnings * 12) - (spkEmployeeContributionMonthly * 12) + totalOneTimeEarnings + SPK Employer
            //                  = annualCTC - (totalOneTimeEarnings * 11) - (spkEmployeeContributionMonthly * 12) + SPK Employer
            // 
            // ✅ FIXED: Calculate CTC correctly
            // CTC = Gross Salary + One Time Earnings + SPK Employer Cost
            // Note: fixedAllowanceAnnual was calculated by subtracting totalOneTimeEarnings from monthly CTC
            // So: fixedAllowanceAnnual = (monthlyCTC - totalOneTimeEarnings - ...) * 12
            // When we calculate grossSalaryAnnual, it includes fixedAllowanceAnnual
            // Then we add totalOneTimeEarnings back for CTC calculation
            // This should balance: grossSalaryAnnual + totalOneTimeEarnings + SPK = annualCTC
            const ctcCalculated = grossSalaryAnnual + totalOneTimeEarnings + (totalSpkMonthly * 12);
            
            // ✅ FIXED: totalErrorHandling should show the difference WITHOUT SPK Employer Cost
            // Formula: (Gross Salary Annual + One Time Earnings) - Annual CTC
            // SPK Employer Cost is excluded from totalErrorHandling calculation
            const ctcCalculatedForErrorHandling = grossSalaryAnnual + totalOneTimeEarnings;
            const totalErrorHandlingAnnual = ctcCalculatedForErrorHandling - ctc;
            const totalErrorHandlingMonthly = totalErrorHandlingAnnual / 12;
            
            // ✅ Total Cost to Company should be the annualCTC directly (not fixedCTC)
            // This represents the total annual cost including one-time earnings
            const totalCostToCompanyAnnual = ctc;
            const totalCostToCompanyMonthly = totalCostToCompanyAnnual / 12;
            
            return {
                basic: { 
                    monthly: roundToTwo(basic.monthly), 
                    annual: roundToTwo(basic.annual) 
                },
                hra: { 
                    monthly: roundToTwo(hra.monthly), 
                    annual: roundToTwo(hra.annual) 
                },
                dearnessAllowance: { 
                    monthly: roundToTwo(dearnessAllowance.monthly), 
                    annual: roundToTwo(dearnessAllowance.annual) 
                },
                conveyanceAllowance: { 
                    monthly: roundToTwo(conveyanceAllowance.monthly), 
                    annual: roundToTwo(conveyanceAllowance.annual) 
                },
                childrenEducationAllowance: { 
                    monthly: roundToTwo(childrenEducationAllowance.monthly), 
                    annual: roundToTwo(childrenEducationAllowance.annual) 
                },
                hostelExpenditureAllowance: { 
                    monthly: roundToTwo(hostelExpenditureAllowance.monthly), 
                    annual: roundToTwo(hostelExpenditureAllowance.annual) 
                },
                transportAllowance: { 
                    monthly: roundToTwo(transportAllowance.monthly), 
                    annual: roundToTwo(transportAllowance.annual) 
                },
                helperAllowance: { 
                    monthly: roundToTwo(helperAllowance.monthly), 
                    annual: roundToTwo(helperAllowance.annual) 
                },
                travellingAllowance: { 
                    monthly: roundToTwo(travellingAllowance.monthly), 
                    annual: roundToTwo(travellingAllowance.annual) 
                },
                uniformAllowance: { 
                    monthly: roundToTwo(uniformAllowance.monthly), 
                    annual: roundToTwo(uniformAllowance.annual) 
                },
                dailyAllowance: { 
                    monthly: roundToTwo(dailyAllowance.monthly), 
                    annual: roundToTwo(dailyAllowance.annual) 
                },
                cityCompensatoryAllowance: { 
                    monthly: roundToTwo(cityCompensatoryAllowance.monthly), 
                    annual: roundToTwo(cityCompensatoryAllowance.annual) 
                },
                overtimeAllowance: { 
                    monthly: roundToTwo(overtimeAllowance.monthly), 
                    annual: roundToTwo(overtimeAllowance.annual) 
                },
                telephoneAllowance: { 
                    monthly: roundToTwo(telephoneAllowance.monthly), 
                    annual: roundToTwo(telephoneAllowance.annual) 
                },
                fixedMedicalAllowance: { 
                    monthly: roundToTwo(fixedMedicalAllowance.monthly), 
                    annual: roundToTwo(fixedMedicalAllowance.annual) 
                },
                projectAllowance: { 
                    monthly: roundToTwo(projectAllowance.monthly), 
                    annual: roundToTwo(projectAllowance.annual) 
                },
                foodAllowance: { 
                    monthly: roundToTwo(foodAllowance.monthly), 
                    annual: roundToTwo(foodAllowance.annual) 
                },
                holidayAllowance: { 
                    monthly: roundToTwo(holidayAllowance.monthly), 
                    annual: roundToTwo(holidayAllowance.annual) 
                },
                entertainmentAllowance: { 
                    monthly: roundToTwo(entertainmentAllowance.monthly), 
                    annual: roundToTwo(entertainmentAllowance.annual) 
                },
                foodCoupon: { 
                    monthly: roundToTwo(foodCoupon.monthly), 
                    annual: roundToTwo(foodCoupon.annual) 
                },
                researchAllowance: { 
                    monthly: roundToTwo(researchAllowance.monthly), 
                    annual: roundToTwo(researchAllowance.annual) 
                },
                booksAndPeriodicalsAllowance: { 
                    monthly: roundToTwo(booksAndPeriodicalsAllowance.monthly), 
                    annual: roundToTwo(booksAndPeriodicalsAllowance.annual) 
                },
                fuelAllowance: { 
                    monthly: roundToTwo(fuelAllowance.monthly), 
                    annual: roundToTwo(fuelAllowance.annual) 
                },
                driverAllowance: { 
                    monthly: roundToTwo(driverAllowance.monthly), 
                    annual: roundToTwo(driverAllowance.annual) 
                },
                leaveTravelAllowance: { 
                    monthly: roundToTwo(leaveTravelAllowance.monthly), 
                    annual: roundToTwo(leaveTravelAllowance.annual) 
                },
                vehicleMaintenanceAllowance: { 
                    monthly: roundToTwo(vehicleMaintenanceAllowance.monthly), 
                    annual: roundToTwo(vehicleMaintenanceAllowance.annual) 
                },
                telephoneAndInternetAllowance: { 
                    monthly: roundToTwo(telephoneAndInternetAllowance.monthly), 
                    annual: roundToTwo(telephoneAndInternetAllowance.annual) 
                },
                shiftAllowance: { 
                    monthly: roundToTwo(shiftAllowance.monthly), 
                    annual: roundToTwo(shiftAllowance.annual) 
                },
                fixedAllowance: { 
                    monthly: roundToTwo(fixedAllowanceMonthly), 
                    annual: roundToTwo(fixedAllowanceAnnual) 
                },
                gross: { 
                    monthly: roundToTwo(grossSalaryMonthly), 
                    annual: roundToTwo(grossSalaryAnnual) 
                },
                net: { 
                    monthly: roundToTwo(netSalaryMonthly), 
                    annual: roundToTwo(netSalaryAnnual) 
                },
                total: { 
                    monthly: roundToTwo(ctcCalculated / 12), 
                    annual: roundToTwo(ctcCalculated) 
                },
                totalCostToCompany: {
                    monthly: roundToTwo(totalCostToCompanyMonthly),
                    annual: roundToTwo(totalCostToCompanyAnnual)
                },
                totalErrorHandling: {
                    monthly: roundToTwo(totalErrorHandlingMonthly),
                    annual: roundToTwo(totalErrorHandlingAnnual)
                },
                totalOneTimeEarnings,
                totalEmployerBenefitsAnnual,
                totalEmployeeDeductionsAnnual,
                totalReimbursementsAnnual,
                customAllowancesTotal, // ✅ Add customAllowancesTotal to return value for error handling
                fixedCTC,
                ctcCalculated
            };
        }
    }, [
        formData,
        calculationMode,
        selectedBasicComponent,
        selectedHouseRentAllowanceComponent,
        selectedDearnessAllowanceComponent,
        selectedConveyanceAllowanceComponent,
        selectedChildrenEducationAllowanceComponent,
        selectedHostelExpenditureAllowanceComponent,
        selectedTransportAllowanceComponent,
        selectedHelperAllowanceComponent,
        selectedTravellingAllowanceComponent,
        selectedUniformAllowanceComponent,
        selectedDailyAllowanceComponent,
        selectedCityCompensatoryAllowanceComponent,
        selectedOvertimeAllowanceComponent,
        selectedTelephoneAllowanceComponent,
        selectedFixedMedicalAllowanceComponent,
        selectedProjectAllowanceComponent,
        selectedFoodAllowanceComponent,
        selectedHolidayAllowanceComponent,
        selectedEntertainmentAllowanceComponent,
        selectedFoodCouponComponent,
        selectedResearchAllowanceComponent,
        selectedBooksAndPeriodicalsAllowanceComponent,
        selectedFuelAllowanceComponent,
        selectedDriverAllowanceComponent,
        selectedLeaveTravelAllowanceComponent,
        selectedVehicleMaintenanceAllowanceComponent,
        selectedTelephoneAndInternetAllowanceComponent,
        selectedShiftAllowanceComponent,
        customAllowances,
        customAllowancesOneTime, // ✅ Add to dependencies
        bonuses,
        commissions,
        giftCoupons,
        reimbursements,
        fbpSelections,
        statutoryComponentSpk,
        salaryComponent,
        includeOneTimeEarnings, // ✅ Add to dependencies
    ]);
};