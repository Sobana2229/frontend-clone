import React, { useState, useEffect } from 'react';
import ButtonReusable from '../buttonReusable';
import employeeStoreManagements from '../../../store/tdPayroll/employee';
import { toast } from "react-toastify";
import salaryComponentStoreManagements from '../../../store/tdPayroll/setting/salaryComponent';
import CustomAllowanceRows from './salaryDetail/customAllowanceRows';
import ReimbursementRows from './salaryDetail/reimbursementRows';
import BenefitRows from './salaryDetail/benefitRows';
import statutoryComponentStoreManagements from '../../../store/tdPayroll/setting/statutoryComponent';
import { useSalaryCalculations } from '../../../../service/salaryEmployeeDetail/useSalaryCalculations';
import { useErrorHandling } from '../../../../service/salaryEmployeeDetail/useErrorHandlingSalaryCalculations';
import { getComponentsByKeySalaryDetail } from '../../../../service/salaryEmployeeDetail/salaryCalculations';
import OneTimeEarningsRows from './salaryDetail/oneTimeEarningsRowsRows';
import EarningRow from './salaryDetail/earningRow';
import { Info } from '@phosphor-icons/react';
import ReimbursementFbpRows from './salaryDetail/reimbursementFbpRows';
import ReuseableInput from '../reuseableInput';
import { CustomToast } from '../customToast';
import { checkPermission } from '../../../../helper/globalHelper';
import authStoreManagements from '../../../store/tdPayroll/auth';
import { useLocation } from "react-router-dom";

function SalaryDetails({cancel, uuid, isRevise, isAdding, isEditMode, setIsRevise, setIsEditMode, setShowSalaryDetail, showSalaryDetail, setStepComplated=[]}) {
    const { pathname } = useLocation();
    const { 
        updateSalaryDetailEmployee, 
        getSalaryDetailEmployee, 
        dataEmployeeSalaryDetail, 
        dataBasicSalaryComponent, 
        dataCustomAllowanceSalaryComponent, 
        dataBonusComponent, 
        dataReimbursementComponent, 
        dataHouseRentAllowanceComponent,
        dataDearnessAllowanceComponent,
        dataConveyanceAllowanceComponent,
        dataChildrenEducationAllowanceComponent,
        dataHostelExpenditureAllowanceComponent,
        dataTransportAllowanceComponent,
        dataHelperAllowanceComponent,
        dataTravellingAllowanceComponent,
        dataUniformAllowanceComponent,
        dataDailyAllowanceComponent,
        dataCityCompensatoryAllowanceComponent,
        dataOvertimeAllowanceComponent,
        dataTelephoneAllowanceComponent,
        dataFixedMedicalAllowanceComponent,
        dataProjectAllowanceComponent,
        dataFoodAllowanceComponent,
        dataHolidayAllowanceComponent,
        dataEntertainmentAllowanceComponent,
        dataFoodCouponComponent,
        dataResearchAllowanceComponent,
        dataBooksAndPeriodicalsAllowanceComponent,
        dataFuelAllowanceComponent,
        dataDriverAllowanceComponent,
        dataLeaveTravelAllowanceComponent,
        dataVehicleMaintenanceAllowanceComponent,
        dataTelephoneAndInternetAllowanceComponent,
        dataShiftAllowanceComponent,
        dataCommissionComponent, 
        dataGiftCouponsComponent,
        resetSalaryDetailData 
    } = employeeStoreManagements();
    const { user } = authStoreManagements(); 
    const { fetchAllSalaryComponent , salaryComponent } = salaryComponentStoreManagements();
    const { fetchStatutoryComponent, statutoryComponentSpk } = statutoryComponentStoreManagements();
    const [selectedBasicComponent, setSelectedBasicComponent] = useState(null);
    const [selectedHouseRentAllowanceComponent, setSelectedHouseRentAllowanceComponent] = useState(null);
    const [selectedDearnessAllowanceComponent, setSelectedDearnessAllowanceComponent] = useState(null);
    const [selectedConveyanceAllowanceComponent, setSelectedConveyanceAllowanceComponent] = useState(null);
    const [selectedChildrenEducationAllowanceComponent, setSelectedChildrenEducationAllowanceComponent] = useState(null);
    const [selectedHostelExpenditureAllowanceComponent, setSelectedHostelExpenditureAllowanceComponent] = useState(null);
    const [selectedTransportAllowanceComponent, setSelectedTransportAllowanceComponent] = useState(null);
    const [selectedHelperAllowanceComponent, setSelectedHelperAllowanceComponent] = useState(null);
    const [selectedTravellingAllowanceComponent, setSelectedTravellingAllowanceComponent] = useState(null);
    const [selectedUniformAllowanceComponent, setSelectedUniformAllowanceComponent] = useState(null);
    const [selectedDailyAllowanceComponent, setSelectedDailyAllowanceComponent] = useState(null);
    const [selectedCityCompensatoryAllowanceComponent, setSelectedCityCompensatoryAllowanceComponent] = useState(null);
    const [selectedOvertimeAllowanceComponent, setSelectedOvertimeAllowanceComponent] = useState(null);
    const [selectedTelephoneAllowanceComponent, setSelectedTelephoneAllowanceComponent] = useState(null);
    const [selectedFixedMedicalAllowanceComponent, setSelectedFixedMedicalAllowanceComponent] = useState(null);
    const [selectedProjectAllowanceComponent, setSelectedProjectAllowanceComponent] = useState(null);
    const [selectedFoodAllowanceComponent, setSelectedFoodAllowanceComponent] = useState(null);
    const [selectedHolidayAllowanceComponent, setSelectedHolidayAllowanceComponent] = useState(null);
    const [selectedEntertainmentAllowanceComponent, setSelectedEntertainmentAllowanceComponent] = useState(null);
    const [selectedFoodCouponComponent, setSelectedFoodCouponComponent] = useState(null);
    const [selectedResearchAllowanceComponent, setSelectedResearchAllowanceComponent] = useState(null);
    const [selectedBooksAndPeriodicalsAllowanceComponent, setSelectedBooksAndPeriodicalsAllowanceComponent] = useState(null);
    const [selectedFuelAllowanceComponent, setSelectedFuelAllowanceComponent] = useState(null);
    const [selectedDriverAllowanceComponent, setSelectedDriverAllowanceComponent] = useState(null);
    const [selectedLeaveTravelAllowanceComponent, setSelectedLeaveTravelAllowanceComponent] = useState(null);
    const [selectedVehicleMaintenanceAllowanceComponent, setSelectedVehicleMaintenanceAllowanceComponent] = useState(null);
    const [selectedTelephoneAndInternetAllowanceComponent, setSelectedTelephoneAndInternetAllowanceComponent] = useState(null);
    const [selectedShiftAllowanceComponent, setSelectedShiftAllowanceComponent] = useState(null);
    const [customAllowances, setCustomAllowances] = useState({});
    const [customAllowancesOneTime, setCustomAllowancesOneTime] = useState({}); // ✅ Custom Allowance One Time Pay
    const [bonuses, setBonuses] = useState({});
    const [commissions, setCommissions] = useState({});
    const [giftCoupons, setGiftCoupons] = useState({});
    const [formData, setFormData] = useState({
        annualCTC: '',
        basicPercentage: '',
        basicAmount: '',
        hraPercentage: '',
        hraAmount: '',
        dearnessAllowancePercentage: '',
        dearnessAllowanceAmount: '',
        conveyanceAllowancePercentage: '',
        conveyanceAllowanceAmount: '',
        childrenEducationAllowancePercentage: '',
        childrenEducationAllowanceAmount: '',
        hostelExpenditureAllowancePercentage: '',
        hostelExpenditureAllowanceAmount: '',
        transportAllowancePercentage: '',
        transportAllowanceAmount: '',
        helperAllowancePercentage: '',
        helperAllowanceAmount: '',
        travellingAllowancePercentage: '',
        travellingAllowanceAmount: '',
        uniformAllowancePercentage: '',
        uniformAllowanceAmount: '',
        dailyAllowancePercentage: '',
        dailyAllowanceAmount: '',
        cityCompensatoryAllowancePercentage: '',
        cityCompensatoryAllowanceAmount: '',
        overtimeAllowancePercentage: '',
        overtimeAllowanceAmount: '',
        telephoneAllowancePercentage: '',
        telephoneAllowanceAmount: '',
        fixedMedicalAllowancePercentage: '',
        fixedMedicalAllowanceAmount: '',
        projectAllowancePercentage: '',
        projectAllowanceAmount: '',
        foodAllowancePercentage: '',
        foodAllowanceAmount: '',
        holidayAllowancePercentage: '',
        holidayAllowanceAmount: '',
        entertainmentAllowancePercentage: '',
        entertainmentAllowanceAmount: '',
        foodCouponPercentage: '',
        foodCouponAmount: '',
        researchAllowancePercentage: '',
        researchAllowanceAmount: '',
        booksAndPeriodicalsAllowancePercentage: '',
        booksAndPeriodicalsAllowanceAmount: '',
        fuelAllowancePercentage: '',
        fuelAllowanceAmount: '',
        driverAllowancePercentage: '',
        driverAllowanceAmount: '',
        leaveTravelAllowancePercentage: '',
        leaveTravelAllowanceAmount: '',
        vehicleMaintenanceAllowancePercentage: '',
        vehicleMaintenanceAllowanceAmount: '',
        telephoneAndInternetAllowancePercentage: '',
        telephoneAndInternetAllowanceAmount: '',
        shiftAllowancePercentage: '',
        shiftAllowanceAmount: '',
        revisionType: 'amount',
        revisePercetage: '',
        revisedSalaryEffectiveFrom: "",
        payoutMonth: "",
        resultCalculateAnnualCTC: "",
    });
    const [reimbursements, setReimbursements] = useState({});
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [benefits, setBenefits] = useState({});
    const [includeOneTimeEarnings, setIncludeOneTimeEarnings] = useState(false);
    const [fbpSelections, setFbpSelections] = useState({});
    const [calculationMode, setCalculationMode] = useState('annual');

    // Calculate fixed CTC by subtracting one-time earnings
    // ✅ Include Custom Allowance One Time Pay in totalOneTimeEarnings
    const totalOneTimeEarnings = includeOneTimeEarnings ? (
        Object.values(bonuses).reduce((sum, bonus) => sum + parseFloat(bonus.amount || 0), 0) +
        Object.values(commissions).reduce((sum, comm) => sum + parseFloat(comm.amount || 0), 0) +
        Object.values(giftCoupons).reduce((sum, gift) => sum + parseFloat(gift.amount || 0), 0) +
        Object.values(customAllowancesOneTime || {}).reduce((sum, item) => sum + parseFloat(item?.amount || 0), 0)
    ) : 0;

    const formDataForCalculation = calculationMode === 'annual' ? {
        ...formData,
        fixedCTC: parseFloat(formData.annualCTC || 0) - totalOneTimeEarnings
    } : {
        ...formData,
        // Convert annual amounts to monthly for existing data
        basicMonthly: formData.basicMonthly || ((parseFloat(formData.basicAmount) || 0) / 12).toString(),
        hraMonthly: formData.hraMonthly || ((parseFloat(formData.hraAmount) || 0) / 12).toString(),
        dearnessAllowanceMonthly: formData.dearnessAllowanceMonthly || ((parseFloat(formData.dearnessAllowanceAmount) || 0) / 12).toString(),
        conveyanceAllowanceMonthly: formData.conveyanceAllowanceMonthly || ((parseFloat(formData.conveyanceAllowanceAmount) || 0) / 12).toString(),
        childrenEducationAllowanceMonthly: formData.childrenEducationAllowanceMonthly || ((parseFloat(formData.childrenEducationAllowanceAmount) || 0) / 12).toString(),
        hostelExpenditureAllowanceMonthly: formData.hostelExpenditureAllowanceMonthly || ((parseFloat(formData.hostelExpenditureAllowanceAmount) || 0) / 12).toString(),
        transportAllowanceMonthly: formData.transportAllowanceMonthly || ((parseFloat(formData.transportAllowanceAmount) || 0) / 12).toString(),
        helperAllowanceMonthly: formData.helperAllowanceMonthly || ((parseFloat(formData.helperAllowanceAmount) || 0) / 12).toString(),
        travellingAllowanceMonthly: formData.travellingAllowanceMonthly || ((parseFloat(formData.travellingAllowanceAmount) || 0) / 12).toString(),
        uniformAllowanceMonthly: formData.uniformAllowanceMonthly || ((parseFloat(formData.uniformAllowanceAmount) || 0) / 12).toString(),
        dailyAllowanceMonthly: formData.dailyAllowanceMonthly || ((parseFloat(formData.dailyAllowanceAmount) || 0) / 12).toString(),
        cityCompensatoryAllowanceMonthly: formData.cityCompensatoryAllowanceMonthly || ((parseFloat(formData.cityCompensatoryAllowanceAmount) || 0) / 12).toString(),
        overtimeAllowanceMonthly: formData.overtimeAllowanceMonthly || ((parseFloat(formData.overtimeAllowanceAmount) || 0) / 12).toString(),
        telephoneAllowanceMonthly: formData.telephoneAllowanceMonthly || ((parseFloat(formData.telephoneAllowanceAmount) || 0) / 12).toString(),
        fixedMedicalAllowanceMonthly: formData.fixedMedicalAllowanceMonthly || ((parseFloat(formData.fixedMedicalAllowanceAmount) || 0) / 12).toString(),
        projectAllowanceMonthly: formData.projectAllowanceMonthly || ((parseFloat(formData.projectAllowanceAmount) || 0) / 12).toString(),
        foodAllowanceMonthly: formData.foodAllowanceMonthly || ((parseFloat(formData.foodAllowanceAmount) || 0) / 12).toString(),
        holidayAllowanceMonthly: formData.holidayAllowanceMonthly || ((parseFloat(formData.holidayAllowanceAmount) || 0) / 12).toString(),
        entertainmentAllowanceMonthly: formData.entertainmentAllowanceMonthly || ((parseFloat(formData.entertainmentAllowanceAmount) || 0) / 12).toString(),
        foodCouponMonthly: formData.foodCouponMonthly || ((parseFloat(formData.foodCouponAmount) || 0) / 12).toString(),
        researchAllowanceMonthly: formData.researchAllowanceMonthly || ((parseFloat(formData.researchAllowanceAmount) || 0) / 12).toString(),
        booksAndPeriodicalsAllowanceMonthly: formData.booksAndPeriodicalsAllowanceMonthly || ((parseFloat(formData.booksAndPeriodicalsAllowanceAmount) || 0) / 12).toString(),
        fuelAllowanceMonthly: formData.fuelAllowanceMonthly || ((parseFloat(formData.fuelAllowanceAmount) || 0) / 12).toString(),
        driverAllowanceMonthly: formData.driverAllowanceMonthly || ((parseFloat(formData.driverAllowanceAmount) || 0) / 12).toString(),
        leaveTravelAllowanceMonthly: formData.leaveTravelAllowanceMonthly || ((parseFloat(formData.leaveTravelAllowanceAmount) || 0) / 12).toString(),
        vehicleMaintenanceAllowanceMonthly: formData.vehicleMaintenanceAllowanceMonthly || ((parseFloat(formData.vehicleMaintenanceAllowanceAmount) || 0) / 12).toString(),
        telephoneAndInternetAllowanceMonthly: formData.telephoneAndInternetAllowanceMonthly || ((parseFloat(formData.telephoneAndInternetAllowanceAmount) || 0) / 12).toString(),
        shiftAllowanceMonthly: formData.shiftAllowanceMonthly || ((parseFloat(formData.shiftAllowanceAmount) || 0) / 12).toString(),
        fixedCTC: 0
    };

    const calculations = useSalaryCalculations({
        formData: formDataForCalculation,
        calculationMode, // Pass mode to hook
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
        includeOneTimeEarnings, // ✅ Pass toggle state to calculations
    });

    const { hasCalculationError } = useErrorHandling(calculations, formData, isDataLoaded, calculationMode);

    useEffect(() => {
        if (!includeOneTimeEarnings) {
            const resetBonuses = {};
            const resetCommissions = {};
            const resetGiftCoupons = {};
            
            Object.keys(bonuses).forEach(uuid => {
            resetBonuses[uuid] = { amount: '', payoutDate: '' };
            });
            
            Object.keys(commissions).forEach(uuid => {
            resetCommissions[uuid] = { amount: '', payoutDate: '' };
            });
            
            Object.keys(giftCoupons).forEach(uuid => {
            resetGiftCoupons[uuid] = { amount: '', payoutDate: '' };
            });
            
            setBonuses(resetBonuses);
            setCommissions(resetCommissions);
            setGiftCoupons(resetGiftCoupons);
        }
    }, [includeOneTimeEarnings]);

    useEffect(() => {
        if (isAdding) {
            resetSalaryDetailData();
            
            setCustomAllowances({});
            setBonuses({});
            setCommissions({});
            setGiftCoupons({});
            setReimbursements({});
            setBenefits({});
            setFbpSelections({});
            setIncludeOneTimeEarnings(false);
            setIsDataLoaded(false);
            setCalculationMode('annual');
            
            setSelectedBasicComponent(null);
            setSelectedHouseRentAllowanceComponent(null);
            setSelectedDearnessAllowanceComponent(null);
            setSelectedConveyanceAllowanceComponent(null);
            setSelectedChildrenEducationAllowanceComponent(null);
            setSelectedHostelExpenditureAllowanceComponent(null);
            setSelectedTransportAllowanceComponent(null);
            setSelectedHelperAllowanceComponent(null);
            setSelectedTravellingAllowanceComponent(null);
            setSelectedUniformAllowanceComponent(null);
            setSelectedDailyAllowanceComponent(null);
            setSelectedCityCompensatoryAllowanceComponent(null);
            setSelectedOvertimeAllowanceComponent(null);
            setSelectedTelephoneAllowanceComponent(null);
            setSelectedFixedMedicalAllowanceComponent(null);
            setSelectedProjectAllowanceComponent(null);
            setSelectedFoodAllowanceComponent(null);
            setSelectedHolidayAllowanceComponent(null);
            setSelectedEntertainmentAllowanceComponent(null);
            setSelectedFoodCouponComponent(null);
            setSelectedResearchAllowanceComponent(null);
            setSelectedBooksAndPeriodicalsAllowanceComponent(null);
            setSelectedFuelAllowanceComponent(null);
            setSelectedDriverAllowanceComponent(null);
            setSelectedLeaveTravelAllowanceComponent(null);
            setSelectedVehicleMaintenanceAllowanceComponent(null);
            setSelectedTelephoneAndInternetAllowanceComponent(null);
            setSelectedShiftAllowanceComponent(null);
            
            setFormData({
                annualCTC: '',
                basicPercentage: '',
                basicAmount: '',
                hraPercentage: '',
                hraAmount: '',
                dearnessAllowancePercentage: '',
                dearnessAllowanceAmount: '',
                conveyanceAllowancePercentage: '',
                conveyanceAllowanceAmount: '',
                childrenEducationAllowancePercentage: '',
                childrenEducationAllowanceAmount: '',
                hostelExpenditureAllowancePercentage: '',
                hostelExpenditureAllowanceAmount: '',
                transportAllowancePercentage: '',
                transportAllowanceAmount: '',
                helperAllowancePercentage: '',
                helperAllowanceAmount: '',
                travellingAllowancePercentage: '',
                travellingAllowanceAmount: '',
                uniformAllowancePercentage: '',
                uniformAllowanceAmount: '',
                dailyAllowancePercentage: '',
                dailyAllowanceAmount: '',
                cityCompensatoryAllowancePercentage: '',
                cityCompensatoryAllowanceAmount: '',
                overtimeAllowancePercentage: '',
                overtimeAllowanceAmount: '',
                telephoneAllowancePercentage: '',
                telephoneAllowanceAmount: '',
                fixedMedicalAllowancePercentage: '',
                fixedMedicalAllowanceAmount: '',
                projectAllowancePercentage: '',
                projectAllowanceAmount: '',
                foodAllowancePercentage: '',
                foodAllowanceAmount: '',
                holidayAllowancePercentage: '',
                holidayAllowanceAmount: '',
                entertainmentAllowancePercentage: '',
                entertainmentAllowanceAmount: '',
                foodCouponPercentage: '',
                foodCouponAmount: '',
                researchAllowancePercentage: '',
                researchAllowanceAmount: '',
                booksAndPeriodicalsAllowancePercentage: '',
                booksAndPeriodicalsAllowanceAmount: '',
                fuelAllowancePercentage: '',
                fuelAllowanceAmount: '',
                driverAllowancePercentage: '',
                driverAllowanceAmount: '',
                leaveTravelAllowancePercentage: '',
                leaveTravelAllowanceAmount: '',
                vehicleMaintenanceAllowancePercentage: '',
                vehicleMaintenanceAllowanceAmount: '',
                telephoneAndInternetAllowancePercentage: '',
                telephoneAndInternetAllowanceAmount: '',
                shiftAllowancePercentage: '',
                shiftAllowanceAmount: '',
                revisionType: 'amount',
                revisePercetage: '',
                revisedSalaryEffectiveFrom: "",
                payoutMonth: "",
                resultCalculateAnnualCTC: "",
            });
        }
        
        return () => {
            if (isAdding) {
                resetSalaryDetailData();
            }
        };
    }, [isAdding, resetSalaryDetailData]);

    useEffect(() => {
        const fetchAllData = async () => {
            if (!uuid) return;

            const accesstoken = localStorage.getItem("accessToken");
            if (!accesstoken) return;
            
            try {
                await getSalaryDetailEmployee(accesstoken, uuid, isRevise);
                await new Promise(resolve => setTimeout(resolve, 300));
                
                if (!salaryComponent?.earning || salaryComponent.earning.length === 0) {
                    await fetchAllSalaryComponent(accesstoken);
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
                
                if (!statutoryComponentSpk?.earning || statutoryComponentSpk.earning.length === 0) {
                    await fetchStatutoryComponent(accesstoken, "spk", uuid);
                }
            } catch (error) {
                // Error handled silently
            }
        };
        const timeoutId = setTimeout(fetchAllData, 500);
        return () => clearTimeout(timeoutId);
    }, [uuid, isRevise]);

    useEffect(() => {
        if (dataEmployeeSalaryDetail) {
            // ✅ SET calculationMode dari DB
            if (dataEmployeeSalaryDetail.calculationMode) {
                setCalculationMode(dataEmployeeSalaryDetail.calculationMode);
            }
            
            setFormData(prevFormData => ({
                ...prevFormData,
                annualCTC: dataEmployeeSalaryDetail.annualCTC?.toString() || '',
                // ✅ Don't set basicAmount/basicPercentage here - will be set by processAllowanceComponent from SalaryDetailComponents
                // basicPercentage: dataEmployeeSalaryDetail.basicPercentage?.toString() || '',
                // basicAmount: dataEmployeeSalaryDetail.basicAmount?.toString() || '',
                // ✅ Don't set hraAmount/hraPercentage here - will be set by processAllowanceComponent from SalaryDetailComponents
                // hraPercentage: dataEmployeeSalaryDetail.hraPercentage?.toString() || '',
                // hraAmount: dataEmployeeSalaryDetail.hraAmount?.toString() || '',
                // ✅ Don't set dearnessAllowanceAmount/dearnessAllowancePercentage here - will be set by processAllowanceComponent from SalaryDetailComponents
                // dearnessAllowancePercentage: dataEmployeeSalaryDetail.dearnessAllowancePercentage?.toString() || '',
                // dearnessAllowanceAmount: dataEmployeeSalaryDetail.dearnessAllowanceAmount?.toString() || '',
                conveyanceAllowancePercentage: dataEmployeeSalaryDetail.conveyanceAllowancePercentage?.toString() || '',
                conveyanceAllowanceAmount: dataEmployeeSalaryDetail.conveyanceAllowanceAmount?.toString() || '',
                childrenEducationAllowancePercentage: dataEmployeeSalaryDetail.childrenEducationAllowancePercentage?.toString() || '',
                childrenEducationAllowanceAmount: dataEmployeeSalaryDetail.childrenEducationAllowanceAmount?.toString() || '',
                hostelExpenditureAllowancePercentage: dataEmployeeSalaryDetail.hostelExpenditureAllowancePercentage?.toString() || '',
                hostelExpenditureAllowanceAmount: dataEmployeeSalaryDetail.hostelExpenditureAllowanceAmount?.toString() || '',
                transportAllowancePercentage: dataEmployeeSalaryDetail.transportAllowancePercentage?.toString() || '',
                transportAllowanceAmount: dataEmployeeSalaryDetail.transportAllowanceAmount?.toString() || '',
                helperAllowancePercentage: dataEmployeeSalaryDetail.helperAllowancePercentage?.toString() || '',
                helperAllowanceAmount: dataEmployeeSalaryDetail.helperAllowanceAmount?.toString() || '',
                travellingAllowancePercentage: dataEmployeeSalaryDetail.travellingAllowancePercentage?.toString() || '',
                travellingAllowanceAmount: dataEmployeeSalaryDetail.travellingAllowanceAmount?.toString() || '',
                uniformAllowancePercentage: dataEmployeeSalaryDetail.uniformAllowancePercentage?.toString() || '',
                uniformAllowanceAmount: dataEmployeeSalaryDetail.uniformAllowanceAmount?.toString() || '',
                dailyAllowancePercentage: dataEmployeeSalaryDetail.dailyAllowancePercentage?.toString() || '',
                dailyAllowanceAmount: dataEmployeeSalaryDetail.dailyAllowanceAmount?.toString() || '',
                cityCompensatoryAllowancePercentage: dataEmployeeSalaryDetail.cityCompensatoryAllowancePercentage?.toString() || '',
                cityCompensatoryAllowanceAmount: dataEmployeeSalaryDetail.cityCompensatoryAllowanceAmount?.toString() || '',
                overtimeAllowancePercentage: dataEmployeeSalaryDetail.overtimeAllowancePercentage?.toString() || '',
                overtimeAllowanceAmount: dataEmployeeSalaryDetail.overtimeAllowanceAmount?.toString() || '',
                telephoneAllowancePercentage: dataEmployeeSalaryDetail.telephoneAllowancePercentage?.toString() || '',
                telephoneAllowanceAmount: dataEmployeeSalaryDetail.telephoneAllowanceAmount?.toString() || '',
                fixedMedicalAllowancePercentage: dataEmployeeSalaryDetail.fixedMedicalAllowancePercentage?.toString() || '',
                fixedMedicalAllowanceAmount: dataEmployeeSalaryDetail.fixedMedicalAllowanceAmount?.toString() || '',
                projectAllowancePercentage: dataEmployeeSalaryDetail.projectAllowancePercentage?.toString() || '',
                projectAllowanceAmount: dataEmployeeSalaryDetail.projectAllowanceAmount?.toString() || '',
                foodAllowancePercentage: dataEmployeeSalaryDetail.foodAllowancePercentage?.toString() || '',
                foodAllowanceAmount: dataEmployeeSalaryDetail.foodAllowanceAmount?.toString() || '',
                holidayAllowancePercentage: dataEmployeeSalaryDetail.holidayAllowancePercentage?.toString() || '',
                holidayAllowanceAmount: dataEmployeeSalaryDetail.holidayAllowanceAmount?.toString() || '',
                entertainmentAllowancePercentage: dataEmployeeSalaryDetail.entertainmentAllowancePercentage?.toString() || '',
                entertainmentAllowanceAmount: dataEmployeeSalaryDetail.entertainmentAllowanceAmount?.toString() || '',
                foodCouponPercentage: dataEmployeeSalaryDetail.foodCouponPercentage?.toString() || '',
                foodCouponAmount: dataEmployeeSalaryDetail.foodCouponAmount?.toString() || '',
                researchAllowancePercentage: dataEmployeeSalaryDetail.researchAllowancePercentage?.toString() || '',
                researchAllowanceAmount: dataEmployeeSalaryDetail.researchAllowanceAmount?.toString() || '',
                booksAndPeriodicalsAllowancePercentage: dataEmployeeSalaryDetail.booksAndPeriodicalsAllowancePercentage?.toString() || '',
                booksAndPeriodicalsAllowanceAmount: dataEmployeeSalaryDetail.booksAndPeriodicalsAllowanceAmount?.toString() || '',
                fuelAllowancePercentage: dataEmployeeSalaryDetail.fuelAllowancePercentage?.toString() || '',
                fuelAllowanceAmount: dataEmployeeSalaryDetail.fuelAllowanceAmount?.toString() || '',
                driverAllowancePercentage: dataEmployeeSalaryDetail.driverAllowancePercentage?.toString() || '',
                driverAllowanceAmount: dataEmployeeSalaryDetail.driverAllowanceAmount?.toString() || '',
                leaveTravelAllowancePercentage: dataEmployeeSalaryDetail.leaveTravelAllowancePercentage?.toString() || '',
                leaveTravelAllowanceAmount: dataEmployeeSalaryDetail.leaveTravelAllowanceAmount?.toString() || '',
                vehicleMaintenanceAllowancePercentage: dataEmployeeSalaryDetail.vehicleMaintenanceAllowancePercentage?.toString() || '',
                vehicleMaintenanceAllowanceAmount: dataEmployeeSalaryDetail.vehicleMaintenanceAllowanceAmount?.toString() || '',
                telephoneAndInternetAllowancePercentage: dataEmployeeSalaryDetail.telephoneAndInternetAllowancePercentage?.toString() || '',
                telephoneAndInternetAllowanceAmount: dataEmployeeSalaryDetail.telephoneAndInternetAllowanceAmount?.toString() || '',
                shiftAllowancePercentage: dataEmployeeSalaryDetail.shiftAllowancePercentage?.toString() || '',
                shiftAllowanceAmount: dataEmployeeSalaryDetail.shiftAllowanceAmount?.toString() || '',
                // ✅ ADD monthly fields
                basicMonthly: dataEmployeeSalaryDetail.basicMonthly?.toString() || '',
                hraMonthly: dataEmployeeSalaryDetail.hraMonthly?.toString() || '',
                dearnessAllowanceMonthly: dataEmployeeSalaryDetail.dearnessAllowanceMonthly?.toString() || '',
                conveyanceAllowanceMonthly: dataEmployeeSalaryDetail.conveyanceAllowanceMonthly?.toString() || '',
                childrenEducationAllowanceMonthly: dataEmployeeSalaryDetail.childrenEducationAllowanceMonthly?.toString() || '',
                hostelExpenditureAllowanceMonthly: dataEmployeeSalaryDetail.hostelExpenditureAllowanceMonthly?.toString() || '',
                transportAllowanceMonthly: dataEmployeeSalaryDetail.transportAllowanceMonthly?.toString() || '',
                helperAllowanceMonthly: dataEmployeeSalaryDetail.helperAllowanceMonthly?.toString() || '',
                travellingAllowanceMonthly: dataEmployeeSalaryDetail.travellingAllowanceMonthly?.toString() || '',
                uniformAllowanceMonthly: dataEmployeeSalaryDetail.uniformAllowanceMonthly?.toString() || '',
                dailyAllowanceMonthly: dataEmployeeSalaryDetail.dailyAllowanceMonthly?.toString() || '',
                cityCompensatoryAllowanceMonthly: dataEmployeeSalaryDetail.cityCompensatoryAllowanceMonthly?.toString() || '',
                overtimeAllowanceMonthly: dataEmployeeSalaryDetail.overtimeAllowanceMonthly?.toString() || '',
                telephoneAllowanceMonthly: dataEmployeeSalaryDetail.telephoneAllowanceMonthly?.toString() || '',
                fixedMedicalAllowanceMonthly: dataEmployeeSalaryDetail.fixedMedicalAllowanceMonthly?.toString() || '',
                projectAllowanceMonthly: dataEmployeeSalaryDetail.projectAllowanceMonthly?.toString() || '',
                foodAllowanceMonthly: dataEmployeeSalaryDetail.foodAllowanceMonthly?.toString() || '',
                holidayAllowanceMonthly: dataEmployeeSalaryDetail.holidayAllowanceMonthly?.toString() || '',
                entertainmentAllowanceMonthly: dataEmployeeSalaryDetail.entertainmentAllowanceMonthly?.toString() || '',
                foodCouponMonthly: dataEmployeeSalaryDetail.foodCouponMonthly?.toString() || '',
                researchAllowanceMonthly: dataEmployeeSalaryDetail.researchAllowanceMonthly?.toString() || '',
                booksAndPeriodicalsAllowanceMonthly: dataEmployeeSalaryDetail.booksAndPeriodicalsAllowanceMonthly?.toString() || '',
                fuelAllowanceMonthly: dataEmployeeSalaryDetail.fuelAllowanceMonthly?.toString() || '',
                driverAllowanceMonthly: dataEmployeeSalaryDetail.driverAllowanceMonthly?.toString() || '',
                leaveTravelAllowanceMonthly: dataEmployeeSalaryDetail.leaveTravelAllowanceMonthly?.toString() || '',
                vehicleMaintenanceAllowanceMonthly: dataEmployeeSalaryDetail.vehicleMaintenanceAllowanceMonthly?.toString() || '',
                telephoneAndInternetAllowanceMonthly: dataEmployeeSalaryDetail.telephoneAndInternetAllowanceMonthly?.toString() || '',
                shiftAllowanceMonthly: dataEmployeeSalaryDetail.shiftAllowanceMonthly?.toString() || '',
                
                // ✅ TAMBAHKAN INI - populate totalMonthly dan totalAnnual dari backend
                totalMonthly: dataEmployeeSalaryDetail.totalMonthly?.toString() || '0',
                totalAnnual: dataEmployeeSalaryDetail.totalAnnual?.toString() || '0',

                revisionType: dataEmployeeSalaryDetail.revisionType || 'amount',
                revisePercetage: dataEmployeeSalaryDetail.revisePercetage?.toString() || '',
                revisedSalaryEffectiveFrom: dataEmployeeSalaryDetail.revisedSalaryEffectiveFrom 
                    ? new Date(dataEmployeeSalaryDetail.revisedSalaryEffectiveFrom).toISOString().split('T')[0]
                    : '',
                payoutMonth: dataEmployeeSalaryDetail.payoutMonth 
                    ? new Date(dataEmployeeSalaryDetail.payoutMonth).toISOString().split('T')[0]
                    : '',
            }));
            
            setIsDataLoaded(true);
        }
    }, [dataEmployeeSalaryDetail]);

    useEffect(() => {
        if (!salaryComponent?.earning) return;
        
        // Helper function to process allowance component with proper handling for Flat Amount
        const processAllowanceComponent = (dataComponent, componentKey, setSelectedComponent, formFieldPrefix) => {
            if (!dataComponent) return;
            
            const components = getComponentsByKeySalaryDetail(salaryComponent, componentKey);
            const matchingComponent = components.find(
                component => component.uuid === dataComponent.salaryComponentEarningUuid
            );
            
            if (!matchingComponent) return;
            
            setSelectedComponent(matchingComponent);
            
            const componentAmount = dataComponent.amount;
            const hasValidAmount = componentAmount && componentAmount !== "0" && parseFloat(componentAmount) > 0;
            
            if (hasValidAmount) {
                if (matchingComponent.calculationType === 'Percentage of CTC' || 
                    matchingComponent.calculationType === 'Percentage of Basic') {
                    setFormData(prev => ({
                        ...prev,
                        [`${formFieldPrefix}Percentage`]: componentAmount?.toString() || prev[`${formFieldPrefix}Percentage`] || '',
                        [`${formFieldPrefix}Amount`]: '' // Clear amount for percentage-based calculation
                    }));
                } else if (matchingComponent.calculationType === 'Flat Amount') {
                    // For Flat Amount, use amount from SalaryDetailComponents, and clear percentage
                    setFormData(prev => ({
                        ...prev,
                        [`${formFieldPrefix}Amount`]: componentAmount?.toString() || prev[`${formFieldPrefix}Amount`] || '',
                        [`${formFieldPrefix}Percentage`]: '' // Clear percentage for flat amount
                    }));
                }
            } else {
                // If amount is "0" or invalid, check if we have data from SalaryDetail table
                // For Flat Amount, prefer amount over percentage
                if (matchingComponent.calculationType === 'Flat Amount') {
                    setFormData(prev => {
                        // If we have amount from SalaryDetail table, use it and clear percentage
                        const hasAmountFromTable = prev[`${formFieldPrefix}Amount`] && parseFloat(prev[`${formFieldPrefix}Amount`]) > 0;
                        if (hasAmountFromTable) {
                            return {
                                ...prev,
                                [`${formFieldPrefix}Percentage`]: '' // Clear percentage for flat amount
                            };
                        }
                        return prev;
                    });
                }
            }
        };
        
        const processAllowanceComponents = () => {
            // Basic Component
            if (dataBasicSalaryComponent) {
                processAllowanceComponent(
                    dataBasicSalaryComponent,
                    "basic",
                    setSelectedBasicComponent,
                    "basic"
                );
            }

            // House Rent Allowance Component
            if (dataHouseRentAllowanceComponent) {
                processAllowanceComponent(
                    dataHouseRentAllowanceComponent,
                    "houseRentAllowance",
                    setSelectedHouseRentAllowanceComponent,
                    "hra"
                );
            }

            // Dearness Allowance Component
            if (dataDearnessAllowanceComponent) {
                processAllowanceComponent(
                    dataDearnessAllowanceComponent,
                    "dearnessAllowance",
                    setSelectedDearnessAllowanceComponent,
                    "dearnessAllowance"
                );
            }

            // Conveyance Allowance Component
            processAllowanceComponent(
                dataConveyanceAllowanceComponent,
                "conveyanceAllowance",
                setSelectedConveyanceAllowanceComponent,
                "conveyanceAllowance"
            );

            // Children Education Allowance Component
            processAllowanceComponent(
                dataChildrenEducationAllowanceComponent,
                "childrenEducationAllowance",
                setSelectedChildrenEducationAllowanceComponent,
                "childrenEducationAllowance"
            );

            // Hostel Expenditure Allowance Component
            processAllowanceComponent(
                dataHostelExpenditureAllowanceComponent,
                "hostelExpenditureAllowance",
                setSelectedHostelExpenditureAllowanceComponent,
                "hostelExpenditureAllowance"
            );

            // Transport Allowance Component
            processAllowanceComponent(
                dataTransportAllowanceComponent,
                "transportAllowance",
                setSelectedTransportAllowanceComponent,
                "transportAllowance"
            );

            // Helper Allowance Component
            processAllowanceComponent(
                dataHelperAllowanceComponent,
                "helperAllowance",
                setSelectedHelperAllowanceComponent,
                "helperAllowance"
            );

            // Travelling Allowance Component
            processAllowanceComponent(
                dataTravellingAllowanceComponent,
                "travellingAllowance",
                setSelectedTravellingAllowanceComponent,
                "travellingAllowance"
            );

            // Uniform Allowance Component
            processAllowanceComponent(
                dataUniformAllowanceComponent,
                "uniformAllowance",
                setSelectedUniformAllowanceComponent,
                "uniformAllowance"
            );

            // Daily Allowance Component
            processAllowanceComponent(
                dataDailyAllowanceComponent,
                "dailyAllowance",
                setSelectedDailyAllowanceComponent,
                "dailyAllowance"
            );

            // City Compensatory Allowance Component
            processAllowanceComponent(
                dataCityCompensatoryAllowanceComponent,
                "cityCompensatoryAllowance",
                setSelectedCityCompensatoryAllowanceComponent,
                "cityCompensatoryAllowance"
            );

            // Overtime Allowance Component
            processAllowanceComponent(
                dataOvertimeAllowanceComponent,
                "overtimeAllowance",
                setSelectedOvertimeAllowanceComponent,
                "overtimeAllowance"
            );

            // Telephone Allowance Component
            processAllowanceComponent(
                dataTelephoneAllowanceComponent,
                "telephoneAllowance",
                setSelectedTelephoneAllowanceComponent,
                "telephoneAllowance"
            );

            // Fixed Medical Allowance Component
            processAllowanceComponent(
                dataFixedMedicalAllowanceComponent,
                "fixedMedicalAllowance",
                setSelectedFixedMedicalAllowanceComponent,
                "fixedMedicalAllowance"
            );

            // Project Allowance Component
            processAllowanceComponent(
                dataProjectAllowanceComponent,
                "projectAllowance",
                setSelectedProjectAllowanceComponent,
                "projectAllowance"
            );

            // Food Allowance Component
            processAllowanceComponent(
                dataFoodAllowanceComponent,
                "foodAllowance",
                setSelectedFoodAllowanceComponent,
                "foodAllowance"
            );

            // Holiday Allowance Component
            processAllowanceComponent(
                dataHolidayAllowanceComponent,
                "holidayAllowance",
                setSelectedHolidayAllowanceComponent,
                "holidayAllowance"
            );

            // Entertainment Allowance Component
            processAllowanceComponent(
                dataEntertainmentAllowanceComponent,
                "entertainmentAllowance",
                setSelectedEntertainmentAllowanceComponent,
                "entertainmentAllowance"
            );

            // Food Coupon Component
            processAllowanceComponent(
                dataFoodCouponComponent,
                "foodCoupon",
                setSelectedFoodCouponComponent,
                "foodCoupon"
            );

            // Research Allowance Component
            processAllowanceComponent(
                dataResearchAllowanceComponent,
                "researchAllowance",
                setSelectedResearchAllowanceComponent,
                "researchAllowance"
            );

            // Books And Periodicals Allowance Component
            processAllowanceComponent(
                dataBooksAndPeriodicalsAllowanceComponent,
                "booksAndPeriodicalsAllowance",
                setSelectedBooksAndPeriodicalsAllowanceComponent,
                "booksAndPeriodicalsAllowance"
            );

            // Fuel Allowance Component
            processAllowanceComponent(
                dataFuelAllowanceComponent,
                "fuelAllowance",
                setSelectedFuelAllowanceComponent,
                "fuelAllowance"
            );

            // Driver Allowance Component
            processAllowanceComponent(
                dataDriverAllowanceComponent,
                "driverAllowance",
                setSelectedDriverAllowanceComponent,
                "driverAllowance"
            );

            // Leave Travel Allowance Component
            processAllowanceComponent(
                dataLeaveTravelAllowanceComponent,
                "leaveTravelAllowance",
                setSelectedLeaveTravelAllowanceComponent,
                "leaveTravelAllowance"
            );

            // Vehicle Maintenance Allowance Component
            processAllowanceComponent(
                dataVehicleMaintenanceAllowanceComponent,
                "vehicleMaintenanceAllowance",
                setSelectedVehicleMaintenanceAllowanceComponent,
                "vehicleMaintenanceAllowance"
            );

            // Telephone And Internet Allowance Component
            processAllowanceComponent(
                dataTelephoneAndInternetAllowanceComponent,
                "telephoneAndInternetAllowance",
                setSelectedTelephoneAndInternetAllowanceComponent,
                "telephoneAndInternetAllowance"
            );

            // Shift Allowance Component
            processAllowanceComponent(
                dataShiftAllowanceComponent,
                "shiftAllowance",
                setSelectedShiftAllowanceComponent,
                "shiftAllowance"
            );
        };

        processAllowanceComponents();
    }, [salaryComponent, dataBasicSalaryComponent, dataHouseRentAllowanceComponent, dataDearnessAllowanceComponent,
        dataConveyanceAllowanceComponent, dataChildrenEducationAllowanceComponent, dataHostelExpenditureAllowanceComponent,
        dataTransportAllowanceComponent, dataHelperAllowanceComponent, dataTravellingAllowanceComponent,
        dataUniformAllowanceComponent, dataDailyAllowanceComponent, dataCityCompensatoryAllowanceComponent,
        dataOvertimeAllowanceComponent, dataTelephoneAllowanceComponent, dataFixedMedicalAllowanceComponent,
        dataProjectAllowanceComponent, dataFoodAllowanceComponent, dataHolidayAllowanceComponent,
        dataEntertainmentAllowanceComponent, dataFoodCouponComponent, dataResearchAllowanceComponent,
        dataBooksAndPeriodicalsAllowanceComponent, dataFuelAllowanceComponent, dataDriverAllowanceComponent,
        dataLeaveTravelAllowanceComponent, dataVehicleMaintenanceAllowanceComponent, dataTelephoneAndInternetAllowanceComponent,
        dataShiftAllowanceComponent]);

    useEffect(() => {
        if (!salaryComponent?.earning) return;

        // ✅ Custom Allowances - FIXED
        // Split Custom Allowance: One Time Pay vs Fixed/Variable Pay
        const activeCustomAllowances = getComponentsByKeySalaryDetail(salaryComponent, "customAllowance");
        
        if (activeCustomAllowances.length > 0) {
            const updatedCustomAllowances = {}; // For Fixed/Variable Pay
            const updatedCustomAllowancesOneTime = {}; // For One Time Pay
            
            activeCustomAllowances.forEach(component => {
                const existingData = dataCustomAllowanceSalaryComponent?.find(
                    item => item.salaryComponentEarningUuid === component.uuid
                );
                
                // ✅ FILTER: Skip Custom Allowance One Time Pay that has been used in a paid payrun
                if (component.payType === "One Time Pay" && component.isSchedule === true) {
                    // This is One Time Pay - handle like bonuses
                    if (existingData?.usedInPayrunUuid) {
                        return; // Skip this - it's already been used
                    }
                    
                    if (existingData) {
                        // ✅ FIX: Keep existing value even if 0 (don't fallback to component default)
                        updatedCustomAllowancesOneTime[component.uuid] = {
                            amount: existingData.amount !== null && existingData.amount !== undefined 
                                ? existingData.amount.toString() 
                                : '0',
                            payoutDate: existingData.payoutDate 
                                ? new Date(existingData.payoutDate).toISOString().split('T')[0]
                                : ''
                        };
                    } else {
                        // ✅ FIX: Default to '0' instead of component.amount (to prevent reverting to default)
                        updatedCustomAllowancesOneTime[component.uuid] = {
                            amount: '0',
                            payoutDate: ''
                        };
                    }
                } else {
                    // This is Fixed/Variable Pay - handle normally
                    updatedCustomAllowances[component.uuid] = existingData?.amount ?? '0';
                }
            });
            
            setCustomAllowances(updatedCustomAllowances);
            setCustomAllowancesOneTime(updatedCustomAllowancesOneTime);
        } else {
            // Reset jika tidak ada custom allowance yang active
            setCustomAllowances({});
            setCustomAllowancesOneTime({});
        }

        // ✅ Bonuses - FIXED
        // Only show bonuses that are active AND scheduled (isSchedule: true)
        // AND not used in a paid payrun (usedInPayrunUuid is null)
        const activeBonuses = getComponentsByKeySalaryDetail(salaryComponent, "bonus")
            .filter(component => component.isSchedule === true);
        if (activeBonuses.length > 0) {
            const updatedBonuses = {};
            activeBonuses.forEach(component => {
            const existingBonusData = dataBonusComponent?.find(
                item => item.salaryComponentEarningUuid === component.uuid
            );
            // ✅ FILTER: Skip bonus that has been used in a paid payrun
            if (existingBonusData?.usedInPayrunUuid) {
                return; // Skip this bonus - it's already been used
            }
            if (existingBonusData) {
                updatedBonuses[component.uuid] = { 
                amount: existingBonusData.amount ?? '0',  // ✅ Use ?? instead of || 
                payoutDate: existingBonusData.payoutDate 
                    ? new Date(existingBonusData.payoutDate).toISOString().split('T')[0]
                    : ''
                };
            } else {
                updatedBonuses[component.uuid] = { 
                amount: component.amount ?? '0', 
                payoutDate: '' 
                };
            }
            });
            setBonuses(updatedBonuses);
        } else {
            // Reset jika tidak ada bonus yang active dan scheduled
            setBonuses({});
        }

        // Check for one-time earnings data (only unused ones)
        // ✅ Include Custom Allowance One Time Pay
        const activeCustomAllowancesForCheck = getComponentsByKeySalaryDetail(salaryComponent, "customAllowance");
        const hasOneTimeEarningsData = 
            dataBonusComponent?.some(item => item.amount && parseFloat(item.amount) > 0 && !item.usedInPayrunUuid) ||
            dataCommissionComponent?.some(item => item.amount && parseFloat(item.amount) > 0 && !item.usedInPayrunUuid) ||
            dataGiftCouponsComponent?.some(item => item.amount && parseFloat(item.amount) > 0 && !item.usedInPayrunUuid) ||
            dataCustomAllowanceSalaryComponent?.some(item => {
                // Check if this Custom Allowance is One Time Pay (payType = "One Time Pay" and isSchedule = true)
                const component = activeCustomAllowancesForCheck.find(c => c.uuid === item.salaryComponentEarningUuid);
                return component?.payType === "One Time Pay" && component?.isSchedule === true &&
                       item.amount && parseFloat(item.amount) > 0 && !item.usedInPayrunUuid;
            });
        
        // ✅ Set toggle based on whether there's any one-time earnings data with amount > 0
        setIncludeOneTimeEarnings(hasOneTimeEarningsData);

        // ✅ Commissions - FIXED
        // Only show commissions that are active AND scheduled (isSchedule: true)
        // AND not used in a paid payrun (usedInPayrunUuid is null)
        const activeCommissions = getComponentsByKeySalaryDetail(salaryComponent, "commission")
            .filter(component => component.isSchedule === true);
        if (activeCommissions.length > 0) {
            const updatedCommissions = {};
            activeCommissions.forEach(component => {
            const existingCommissionData = dataCommissionComponent?.find(
                item => item.salaryComponentEarningUuid === component.uuid
            );
            // ✅ FILTER: Skip commission that has been used in a paid payrun
            if (existingCommissionData?.usedInPayrunUuid) {
                return; // Skip this commission - it's already been used
            }
            if (existingCommissionData) {
                updatedCommissions[component.uuid] = { 
                amount: existingCommissionData.amount ?? '0',  // ✅ Use ?? instead of ||
                payoutDate: existingCommissionData.payoutDate 
                    ? new Date(existingCommissionData.payoutDate).toISOString().split('T')[0]
                    : ''
                };
            } else {
                updatedCommissions[component.uuid] = { 
                amount: component.amount ?? '0', 
                payoutDate: '' 
                };
            }
            });
            setCommissions(updatedCommissions);
        } else {
            // Reset jika tidak ada commission yang active dan scheduled
            setCommissions({});
        }

        // ✅ Gift Coupons - FIXED
        // Only show gift coupons that are active AND scheduled (isSchedule: true)
        // AND not used in a paid payrun (usedInPayrunUuid is null)
        const activeGiftCoupons = getComponentsByKeySalaryDetail(salaryComponent, "giftCoupon")
            .filter(component => component.isSchedule === true);
        if (activeGiftCoupons.length > 0) {
            const updatedGiftCoupons = {};
            activeGiftCoupons.forEach(component => {
            const existingGiftCouponData = dataGiftCouponsComponent?.find(
                item => item.salaryComponentEarningUuid === component.uuid
            );
            // ✅ FILTER: Skip gift coupon that has been used in a paid payrun
            if (existingGiftCouponData?.usedInPayrunUuid) {
                return; // Skip this gift coupon - it's already been used
            }
            if (existingGiftCouponData) {
                updatedGiftCoupons[component.uuid] = { 
                amount: existingGiftCouponData.amount ?? '0',  // ✅ Use ?? instead of ||
                payoutDate: existingGiftCouponData.payoutDate 
                    ? new Date(existingGiftCouponData.payoutDate).toISOString().split('T')[0]
                    : ''
                };
            } else {
                updatedGiftCoupons[component.uuid] = { 
                amount: component.amount ?? '0', 
                payoutDate: '' 
                };
            }
            });
            setGiftCoupons(updatedGiftCoupons);
        } else {
            // Reset jika tidak ada gift coupon yang active dan scheduled
            setGiftCoupons({});
        }
    }, [salaryComponent, dataCustomAllowanceSalaryComponent, dataBonusComponent, dataCommissionComponent, dataGiftCouponsComponent]);

    useEffect(() => {
        let activeReimbursements = [];
        let activeFbpReimbursements = [];
        
        if (salaryComponent?.reimbursement) {
            activeReimbursements = salaryComponent.reimbursement.filter(
                item => item.markAsActive === true && !item.includeFlexibleBenefit
            );
            activeFbpReimbursements = salaryComponent.reimbursement.filter(
                item => item.markAsActive === true && item.includeFlexibleBenefit === true
            );
        }

        // Handle Reimbursements - FIXED
        if (activeReimbursements.length > 0) {
            const updatedReimbursements = {};
            activeReimbursements.forEach(component => {
                const existingData = dataReimbursementComponent?.find(
                item => item.salaryComponentReimbursementUuid === component.uuid
                );
                // ✅ FIX: Use '0' untuk revision, bukan component.amount (master default)
                updatedReimbursements[component.uuid] = existingData?.amount ?? '0';
            });
            
            setReimbursements(prev => ({
                ...prev,
                ...updatedReimbursements
            }));
        }

        if (activeFbpReimbursements.length > 0) {
            const initialFbpSelections = {};
            activeFbpReimbursements.forEach(component => {
                const existingData = dataReimbursementComponent?.find(
                    item => item.salaryComponentReimbursementUuid === component.uuid
                );
                
                initialFbpSelections[component.uuid] = existingData && existingData.isChecked === true;
                
                if (existingData) {
                    setReimbursements(prev => ({
                        ...prev,
                        [component.uuid]: existingData.amount || ''
                    }));
                }
            });
            setFbpSelections(initialFbpSelections);
        }
    }, [salaryComponent, dataReimbursementComponent]);

    useEffect(() => {
        const dataLoaded = dataEmployeeSalaryDetail && 
                          salaryComponent && 
                          formData.annualCTC !== '';
        if (dataLoaded && !isDataLoaded) {
            setIsDataLoaded(true);
        }
    }, [dataEmployeeSalaryDetail, salaryComponent, formData.annualCTC, isDataLoaded]);

    const handleSubmit = async () => {
        if (hasCalculationError) {
            return;
        }

        const normalizePercentageAmountPair = (percentage, amount, calculationType = null) => {
            const isPercentageEmpty = percentage === '' || percentage === null || percentage === undefined;
            const isAmountEmpty = amount === '' || amount === null || amount === undefined;
            const percentValue = isPercentageEmpty ? 0 : parseFloat(percentage);
            const amountValue = isAmountEmpty ? 0 : parseFloat(amount);
            const finalPercentValue = isNaN(percentValue) ? 0 : percentValue;
            const finalAmountValue = isNaN(amountValue) ? 0 : amountValue;
            
            // For "Flat Amount" calculation type, prioritize amount over percentage
            if (calculationType === 'Flat Amount') {
                if (finalAmountValue > 0) {
                    return { percentage: 0, amount: finalAmountValue };
                }
                if (finalPercentValue > 0) {
                    return { percentage: finalPercentValue, amount: 0 };
                }
                return { percentage: 0, amount: 0 };
            }
            
            // For percentage-based calculation types, prioritize percentage
            if (finalPercentValue > 0) {
                return { percentage: finalPercentValue, amount: 0 };
            }
            if (finalAmountValue > 0) {
                return { percentage: 0, amount: finalAmountValue };
            }
            return { percentage: 0, amount: 0 };
        };

        // Apply ke payload
        const basic = normalizePercentageAmountPair(formData.basicPercentage, formData.basicAmount, selectedBasicComponent?.calculationType);
        const hra = normalizePercentageAmountPair(formData.hraPercentage, formData.hraAmount, selectedHouseRentAllowanceComponent?.calculationType);
        const dearnessAllowance = normalizePercentageAmountPair(formData.dearnessAllowancePercentage, formData.dearnessAllowanceAmount, selectedDearnessAllowanceComponent?.calculationType);
        const conveyanceAllowance = normalizePercentageAmountPair(formData.conveyanceAllowancePercentage, formData.conveyanceAllowanceAmount, selectedConveyanceAllowanceComponent?.calculationType);
        const childrenEducationAllowance = normalizePercentageAmountPair(formData.childrenEducationAllowancePercentage, formData.childrenEducationAllowanceAmount, selectedChildrenEducationAllowanceComponent?.calculationType);
        const hostelExpenditureAllowance = normalizePercentageAmountPair(formData.hostelExpenditureAllowancePercentage, formData.hostelExpenditureAllowanceAmount, selectedHostelExpenditureAllowanceComponent?.calculationType);
        const transportAllowance = normalizePercentageAmountPair(formData.transportAllowancePercentage, formData.transportAllowanceAmount, selectedTransportAllowanceComponent?.calculationType);
        const helperAllowance = normalizePercentageAmountPair(formData.helperAllowancePercentage, formData.helperAllowanceAmount, selectedHelperAllowanceComponent?.calculationType);
        const travellingAllowance = normalizePercentageAmountPair(formData.travellingAllowancePercentage, formData.travellingAllowanceAmount, selectedTravellingAllowanceComponent?.calculationType);
        const uniformAllowance = normalizePercentageAmountPair(formData.uniformAllowancePercentage, formData.uniformAllowanceAmount, selectedUniformAllowanceComponent?.calculationType);
        const dailyAllowance = normalizePercentageAmountPair(formData.dailyAllowancePercentage, formData.dailyAllowanceAmount, selectedDailyAllowanceComponent?.calculationType);
        const cityCompensatoryAllowance = normalizePercentageAmountPair(formData.cityCompensatoryAllowancePercentage, formData.cityCompensatoryAllowanceAmount, selectedCityCompensatoryAllowanceComponent?.calculationType);
        const overtimeAllowance = normalizePercentageAmountPair(formData.overtimeAllowancePercentage, formData.overtimeAllowanceAmount, selectedOvertimeAllowanceComponent?.calculationType);
        const telephoneAllowance = normalizePercentageAmountPair(formData.telephoneAllowancePercentage, formData.telephoneAllowanceAmount, selectedTelephoneAllowanceComponent?.calculationType);
        const fixedMedicalAllowance = normalizePercentageAmountPair(formData.fixedMedicalAllowancePercentage, formData.fixedMedicalAllowanceAmount, selectedFixedMedicalAllowanceComponent?.calculationType);
        const projectAllowance = normalizePercentageAmountPair(formData.projectAllowancePercentage, formData.projectAllowanceAmount, selectedProjectAllowanceComponent?.calculationType);
        const foodAllowance = normalizePercentageAmountPair(formData.foodAllowancePercentage, formData.foodAllowanceAmount, selectedFoodAllowanceComponent?.calculationType);
        const holidayAllowance = normalizePercentageAmountPair(formData.holidayAllowancePercentage, formData.holidayAllowanceAmount, selectedHolidayAllowanceComponent?.calculationType);
        const entertainmentAllowance = normalizePercentageAmountPair(formData.entertainmentAllowancePercentage, formData.entertainmentAllowanceAmount, selectedEntertainmentAllowanceComponent?.calculationType);
        const foodCoupon = normalizePercentageAmountPair(formData.foodCouponPercentage, formData.foodCouponAmount, selectedFoodCouponComponent?.calculationType);
        const researchAllowance = normalizePercentageAmountPair(formData.researchAllowancePercentage, formData.researchAllowanceAmount, selectedResearchAllowanceComponent?.calculationType);
        const booksAndPeriodicalsAllowance = normalizePercentageAmountPair(formData.booksAndPeriodicalsAllowancePercentage, formData.booksAndPeriodicalsAllowanceAmount, selectedBooksAndPeriodicalsAllowanceComponent?.calculationType);
        const fuelAllowance = normalizePercentageAmountPair(formData.fuelAllowancePercentage, formData.fuelAllowanceAmount, selectedFuelAllowanceComponent?.calculationType);
        const driverAllowance = normalizePercentageAmountPair(formData.driverAllowancePercentage, formData.driverAllowanceAmount, selectedDriverAllowanceComponent?.calculationType);
        const leaveTravelAllowance = normalizePercentageAmountPair(formData.leaveTravelAllowancePercentage, formData.leaveTravelAllowanceAmount, selectedLeaveTravelAllowanceComponent?.calculationType);
        const vehicleMaintenanceAllowance = normalizePercentageAmountPair(formData.vehicleMaintenanceAllowancePercentage, formData.vehicleMaintenanceAllowanceAmount, selectedVehicleMaintenanceAllowanceComponent?.calculationType);
        const telephoneAndInternetAllowance = normalizePercentageAmountPair(formData.telephoneAndInternetAllowancePercentage, formData.telephoneAndInternetAllowanceAmount, selectedTelephoneAndInternetAllowanceComponent?.calculationType);
        const shiftAllowance = normalizePercentageAmountPair(formData.shiftAllowancePercentage, formData.shiftAllowanceAmount, selectedShiftAllowanceComponent?.calculationType);


        const payloadForBackend = {
            calculationMode: calculationMode,
            annualCTC: calculationMode === 'monthly' 
                ? parseFloat(calculations?.total?.annual) || 0 
                : parseFloat(formData.annualCTC) || 0,
            
            basicPercentage: basic.percentage,
            basicAmount: basic.amount,
            
            hraPercentage: hra.percentage,
            hraAmount: hra.amount,
            
            dearnessAllowancePercentage: dearnessAllowance.percentage,
            dearnessAllowanceAmount: dearnessAllowance.amount,
            
            conveyanceAllowancePercentage: conveyanceAllowance.percentage,
            conveyanceAllowanceAmount: conveyanceAllowance.amount,
            
            childrenEducationAllowancePercentage: childrenEducationAllowance.percentage,
            childrenEducationAllowanceAmount: childrenEducationAllowance.amount,
            
            hostelExpenditureAllowancePercentage: hostelExpenditureAllowance.percentage,
            hostelExpenditureAllowanceAmount: hostelExpenditureAllowance.amount,
            
            transportAllowancePercentage: transportAllowance.percentage,
            transportAllowanceAmount: transportAllowance.amount,
            
            helperAllowancePercentage: helperAllowance.percentage,
            helperAllowanceAmount: helperAllowance.amount,
            
            travellingAllowancePercentage: travellingAllowance.percentage,
            travellingAllowanceAmount: travellingAllowance.amount,
            
            uniformAllowancePercentage: uniformAllowance.percentage,
            uniformAllowanceAmount: uniformAllowance.amount,
            
            dailyAllowancePercentage: dailyAllowance.percentage,
            dailyAllowanceAmount: dailyAllowance.amount,
            
            cityCompensatoryAllowancePercentage: cityCompensatoryAllowance.percentage,
            cityCompensatoryAllowanceAmount: cityCompensatoryAllowance.amount,
            
            overtimeAllowancePercentage: overtimeAllowance.percentage,
            overtimeAllowanceAmount: overtimeAllowance.amount,
            
            telephoneAllowancePercentage: telephoneAllowance.percentage,
            telephoneAllowanceAmount: telephoneAllowance.amount,
            
            fixedMedicalAllowancePercentage: fixedMedicalAllowance.percentage,
            fixedMedicalAllowanceAmount: fixedMedicalAllowance.amount,
            
            projectAllowancePercentage: projectAllowance.percentage,
            projectAllowanceAmount: projectAllowance.amount,
            
            foodAllowancePercentage: foodAllowance.percentage,
            foodAllowanceAmount: foodAllowance.amount,
            
            holidayAllowancePercentage: holidayAllowance.percentage,
            holidayAllowanceAmount: holidayAllowance.amount,
            
            entertainmentAllowancePercentage: entertainmentAllowance.percentage,
            entertainmentAllowanceAmount: entertainmentAllowance.amount,
            
            foodCouponPercentage: foodCoupon.percentage,
            foodCouponAmount: foodCoupon.amount,
            
            researchAllowancePercentage: researchAllowance.percentage,
            researchAllowanceAmount: researchAllowance.amount,
            
            booksAndPeriodicalsAllowancePercentage: booksAndPeriodicalsAllowance.percentage,
            booksAndPeriodicalsAllowanceAmount: booksAndPeriodicalsAllowance.amount,
            
            fuelAllowancePercentage: fuelAllowance.percentage,
            fuelAllowanceAmount: fuelAllowance.amount,
            
            driverAllowancePercentage: driverAllowance.percentage,
            driverAllowanceAmount: driverAllowance.amount,
            
            leaveTravelAllowancePercentage: leaveTravelAllowance.percentage,
            leaveTravelAllowanceAmount: leaveTravelAllowance.amount,
            
            vehicleMaintenanceAllowancePercentage: vehicleMaintenanceAllowance.percentage,
            vehicleMaintenanceAllowanceAmount: vehicleMaintenanceAllowance.amount,
            
            telephoneAndInternetAllowancePercentage: telephoneAndInternetAllowance.percentage,
            telephoneAndInternetAllowanceAmount: telephoneAndInternetAllowance.amount,
            
            shiftAllowancePercentage: shiftAllowance.percentage,
            shiftAllowanceAmount: shiftAllowance.amount,
            
            selectedBasicComponent: selectedBasicComponent?.uuid || null,
            selectedHouseRentAllowanceComponent: selectedHouseRentAllowanceComponent?.uuid || null,
            selectedDearnessAllowanceComponent: selectedDearnessAllowanceComponent?.uuid || null,
            selectedConveyanceAllowanceComponent: selectedConveyanceAllowanceComponent?.uuid || null,
            selectedChildrenEducationAllowanceComponent: selectedChildrenEducationAllowanceComponent?.uuid || null,
            selectedHostelExpenditureAllowanceComponent: selectedHostelExpenditureAllowanceComponent?.uuid || null,
            selectedTransportAllowanceComponent: selectedTransportAllowanceComponent?.uuid || null,
            selectedHelperAllowanceComponent: selectedHelperAllowanceComponent?.uuid || null,
            selectedTravellingAllowanceComponent: selectedTravellingAllowanceComponent?.uuid || null,
            selectedUniformAllowanceComponent: selectedUniformAllowanceComponent?.uuid || null,
            selectedDailyAllowanceComponent: selectedDailyAllowanceComponent?.uuid || null,
            selectedCityCompensatoryAllowanceComponent: selectedCityCompensatoryAllowanceComponent?.uuid || null,
            selectedOvertimeAllowanceComponent: selectedOvertimeAllowanceComponent?.uuid || null,
            selectedTelephoneAllowanceComponent: selectedTelephoneAllowanceComponent?.uuid || null,
            selectedFixedMedicalAllowanceComponent: selectedFixedMedicalAllowanceComponent?.uuid || null,
            selectedProjectAllowanceComponent: selectedProjectAllowanceComponent?.uuid || null,
            selectedFoodAllowanceComponent: selectedFoodAllowanceComponent?.uuid || null,
            selectedHolidayAllowanceComponent: selectedHolidayAllowanceComponent?.uuid || null,
            selectedEntertainmentAllowanceComponent: selectedEntertainmentAllowanceComponent?.uuid || null,
            selectedFoodCouponComponent: selectedFoodCouponComponent?.uuid || null,
            selectedResearchAllowanceComponent: selectedResearchAllowanceComponent?.uuid || null,
            selectedBooksAndPeriodicalsAllowanceComponent: selectedBooksAndPeriodicalsAllowanceComponent?.uuid || null,
            selectedFuelAllowanceComponent: selectedFuelAllowanceComponent?.uuid || null,
            selectedDriverAllowanceComponent: selectedDriverAllowanceComponent?.uuid || null,
            selectedLeaveTravelAllowanceComponent: selectedLeaveTravelAllowanceComponent?.uuid || null,
            selectedVehicleMaintenanceAllowanceComponent: selectedVehicleMaintenanceAllowanceComponent?.uuid || null,
            selectedTelephoneAndInternetAllowanceComponent: selectedTelephoneAndInternetAllowanceComponent?.uuid || null,
            selectedShiftAllowanceComponent: selectedShiftAllowanceComponent?.uuid || null,
            basicMonthly: calculations.basic.monthly,
            basicAnnual: calculations.basic.annual,
            hraMonthly: calculations.hra.monthly,
            hraAnnual: calculations.hra.annual,
            dearnessAllowanceMonthly: calculations.dearnessAllowance.monthly,
            dearnessAllowanceAnnual: calculations.dearnessAllowance.annual,
            conveyanceAllowanceMonthly: calculations.conveyanceAllowance.monthly,
            conveyanceAllowanceAnnual: calculations.conveyanceAllowance.annual,
            childrenEducationAllowanceMonthly: calculations.childrenEducationAllowance.monthly,
            childrenEducationAllowanceAnnual: calculations.childrenEducationAllowance.annual,
            hostelExpenditureAllowanceMonthly: calculations.hostelExpenditureAllowance.monthly,
            hostelExpenditureAllowanceAnnual: calculations.hostelExpenditureAllowance.annual,
            transportAllowanceMonthly: calculations.transportAllowance.monthly,
            transportAllowanceAnnual: calculations.transportAllowance.annual,
            helperAllowanceMonthly: calculations.helperAllowance.monthly,
            helperAllowanceAnnual: calculations.helperAllowance.annual,
            travellingAllowanceMonthly: calculations.travellingAllowance.monthly,
            travellingAllowanceAnnual: calculations.travellingAllowance.annual,
            uniformAllowanceMonthly: calculations.uniformAllowance.monthly,
            uniformAllowanceAnnual: calculations.uniformAllowance.annual,
            dailyAllowanceMonthly: calculations.dailyAllowance.monthly,
            dailyAllowanceAnnual: calculations.dailyAllowance.annual,
            cityCompensatoryAllowanceMonthly: calculations.cityCompensatoryAllowance.monthly,
            cityCompensatoryAllowanceAnnual: calculations.cityCompensatoryAllowance.annual,
            overtimeAllowanceMonthly: calculations.overtimeAllowance.monthly,
            overtimeAllowanceAnnual: calculations.overtimeAllowance.annual,
            telephoneAllowanceMonthly: calculations.telephoneAllowance.monthly,
            telephoneAllowanceAnnual: calculations.telephoneAllowance.annual,
            fixedMedicalAllowanceMonthly: calculations.fixedMedicalAllowance.monthly,
            fixedMedicalAllowanceAnnual: calculations.fixedMedicalAllowance.annual,
            projectAllowanceMonthly: calculations.projectAllowance.monthly,
            projectAllowanceAnnual: calculations.projectAllowance.annual,
            foodAllowanceMonthly: calculations.foodAllowance.monthly,
            foodAllowanceAnnual: calculations.foodAllowance.annual,
            holidayAllowanceMonthly: calculations.holidayAllowance.monthly,
            holidayAllowanceAnnual: calculations.holidayAllowance.annual,
            entertainmentAllowanceMonthly: calculations.entertainmentAllowance.monthly,
            entertainmentAllowanceAnnual: calculations.entertainmentAllowance.annual,
            foodCouponMonthly: calculations.foodCoupon.monthly,
            foodCouponAnnual: calculations.foodCoupon.annual,
            researchAllowanceMonthly: calculations.researchAllowance.monthly,
            researchAllowanceAnnual: calculations.researchAllowance.annual,
            booksAndPeriodicalsAllowanceMonthly: calculations.booksAndPeriodicalsAllowance.monthly,
            booksAndPeriodicalsAllowanceAnnual: calculations.booksAndPeriodicalsAllowance.annual,
            fuelAllowanceMonthly: calculations.fuelAllowance.monthly,
            fuelAllowanceAnnual: calculations.fuelAllowance.annual,
            driverAllowanceMonthly: calculations.driverAllowance.monthly,
            driverAllowanceAnnual: calculations.driverAllowance.annual,
            leaveTravelAllowanceMonthly: calculations.leaveTravelAllowance.monthly,
            leaveTravelAllowanceAnnual: calculations.leaveTravelAllowance.annual,
            vehicleMaintenanceAllowanceMonthly: calculations.vehicleMaintenanceAllowance.monthly,
            vehicleMaintenanceAllowanceAnnual: calculations.vehicleMaintenanceAllowance.annual,
            telephoneAndInternetAllowanceMonthly: calculations.telephoneAndInternetAllowance.monthly,
            telephoneAndInternetAllowanceAnnual: calculations.telephoneAndInternetAllowance.annual,
            shiftAllowanceMonthly: calculations.shiftAllowance.monthly,
            shiftAllowanceAnnual: calculations.shiftAllowance.annual,
            fixedAllowanceMonthly: calculations.fixedAllowance.monthly,
            fixedAllowanceAnnual: calculations.fixedAllowance.annual,
            totalMonthly: calculations.total.monthly,
            totalAnnual: calculations.total.annual,
            customAllowances: customAllowances, // Fixed/Variable Pay only
            // ✅ FIX: When toggle OFF, set all one-time earnings to empty/0
            // Get all active Custom Allowance One Time Pay components from salaryComponent
            customAllowancesOneTime: includeOneTimeEarnings ? customAllowancesOneTime : (() => {
                const activeCustomAllowances = getComponentsByKeySalaryDetail(salaryComponent, "customAllowance");
                const oneTimePayComponents = activeCustomAllowances.filter(component => 
                    component.payType === "One Time Pay" && component.isSchedule === true
                );
                return oneTimePayComponents.reduce((acc, component) => {
                    acc[component.uuid] = { amount: "0", payoutDate: "" };
                    return acc;
                }, {});
            })(),
            bonuses: includeOneTimeEarnings ? bonuses : Object.keys(bonuses || {}).reduce((acc, uuid) => {
                acc[uuid] = { amount: "", payoutDate: "" };
                return acc;
            }, {}),
            commissions: includeOneTimeEarnings ? commissions : Object.keys(commissions || {}).reduce((acc, uuid) => {
                acc[uuid] = { amount: "", payoutDate: "" };
                return acc;
            }, {}),
            giftCoupons: includeOneTimeEarnings ? giftCoupons : Object.keys(giftCoupons || {}).reduce((acc, uuid) => {
                acc[uuid] = { amount: "", payoutDate: "" };
                return acc;
            }, {}),
            reimbursements: reimbursements,
            fbpSelections: fbpSelections,
            fbpReimbursements: Object.keys(fbpSelections)
                .filter(uuid => fbpSelections[uuid])
                .reduce((acc, uuid) => {
                    acc[uuid] = reimbursements[uuid] || '';
                    return acc;
                }, {}),
            revisionType: formData?.revisionType,
            revisePercetage: formData?.revisePercetage,
            revisedSalaryEffectiveFrom: formData?.revisedSalaryEffectiveFrom,
            payoutMonth: formData?.payoutMonth,
        };

        const access_token = localStorage.getItem("accessToken");
        let response;
        if(isRevise){
            response = await updateSalaryDetailEmployee(payloadForBackend, access_token, uuid, isRevise);
        }else{
            response = await updateSalaryDetailEmployee(payloadForBackend, access_token, uuid);
        }
        if(response){ 
            const access_token = localStorage.getItem("accessToken");
            await getSalaryDetailEmployee(access_token, uuid, isRevise);
            toast(<CustomToast message={response} status={"success"} />, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                style: {
                    background: 'transparent',
                    boxShadow: 'none',
                    padding: 0
                }
            });
            if (pathname == "/add-employees") {
                setStepComplated(prev => [...prev, 2]);
                setIsEditMode(false);
                setShowSalaryDetail(false);
                setIsRevise(false);
            }
        }
    };

    const formatCurrency = (value) => {
        if (!value || value === 0) return '0';
            const absoluteValue = Math.abs(value);
            return value < 0 ? `-${absoluteValue}` : absoluteValue;
        };
        const calculateDeficit = () => {
        const annualCTC = parseFloat(formData.annualCTC) || 0;
        const totalCalculatedAnnual = calculations?.total?.annual || 0;
        const deficitAnnual = totalCalculatedAnnual - annualCTC;
        const deficitMonthly = Math.round(deficitAnnual / 12);

        return {
            annual: deficitAnnual,
            monthly: deficitMonthly
        };
    };

    const deficit = calculateDeficit();

    const handleRevisionTypeChange = (type) => {
        setFormData({
            ...formData, 
            revisionType: type,
            revisePercetage: type === 'percentage' ? formData.revisePercetage : '',
            annualCTC: type === 'amount' ? formData.annualCTC : formData.annualCTC,
            resultCalculateAnnualCTC: ''
        });
    };

    const calculateAnnualCTCFromComponents = () => {
        if (calculationMode === 'monthly') {
            return calculations?.total?.annual || 0;
        }
        return parseFloat(formData.annualCTC || 0);
    };

    return (
        <>
        <div className={`w-full h-fit flex flex-col items-center justify-center bg-white rounded-lg`}>
            {(isRevise && isEditMode) && (
                <div className="w-full flex items-start space-x-10 justify-start border-b-2 relative py-6 px-10">
                    <div className="flex flex-col space-y-2 items-start justify-start">
                        <p className='text-lg'>Annual CTC</p>
                        <div className="flex items-center justify-center">
                            <div className="flex items-center justify-center">
                                <div className="w-fit px-5 py-2 bg-gray-50 border-r-2 focus:ring-0 outline-none text-xl rounded-l-md border-y-2 border-l-2">
                                    $
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="0" 
                                    value={calculationMode === 'annual' ? formData.annualCTC : calculations?.total?.annual || 0}
                                    onChange={(e) => calculationMode === 'annual' && setFormData({...formData, annualCTC: e.target.value})}
                                    disabled={calculationMode === 'monthly'}
                                    className={`w-full px-4 py-2 focus:ring-0 outline-none text-lg border-y-2 ${
                                        calculationMode === 'monthly' 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                            : 'bg-transparent'
                                    }`}
                                />
                                <div className="w-[50%] text-center px-4 py-2.5 text-[#6B7280] bg-gray-50 border-l-2 focus:ring-0 outline-none text-base rounded-r-md border-y-2 border-r-2 capitalize">
                                    <p>per year</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2 items-start justify-start">
                        <p className='text-lg'>Monthly CTC</p>
                        <div className="flex items-center justify-center">
                            <div className="flex items-center justify-center">
                                <div className="w-fit px-5 py-2 bg-gray-50 border-r-2 focus:ring-0 outline-none text-xl rounded-l-md border-y-2 border-l-2">
                                    $
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="0" 
                                    value={calculationMode === 'annual' ? formData.annualCTC/12 : calculations?.total?.annual/12 || 0}
                                    onChange={(e) => calculationMode === 'annual' && setFormData({...formData, annualCTC: e.target.value})}
                                    disabled={calculationMode === 'monthly'}
                                    className={`w-full px-4 py-2 focus:ring-0 outline-none text-lg border-y-2 ${
                                        calculationMode === 'monthly' 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                            : 'bg-transparent'
                                    }`}
                                />
                                <div className="w-[60%] text-center px-4 py-2.5 text-[#6B7280] bg-gray-50 border-l-2 focus:ring-0 outline-none text-base rounded-r-md border-y-2 border-r-2 capitalize">
                                    <p>per Month</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Calculation Mode */}
            <div className="w-full flex flex-col justify-center items-center rounded-lg p-5 px-10">
                {isEditMode && (
                    <div className="w-full flex items-center justify-start mb-10">
                        <div className="flex items-center space-x-4">
                            <span className="text-lg font-medium">Calculation Mode:</span>
                            <label className="flex items-center">
                            <input
                                type="radio"
                                name="calculationMode"
                                value="annual"
                                checked={calculationMode === 'annual'}
                                onChange={(e) => setCalculationMode(e.target.value)}
                                className="mr-2"
                            />
                            Annual CTC Based
                            </label>
                            <label className="flex items-center">
                            <input
                                type="radio"
                                name="calculationMode"
                                value="monthly"
                                checked={calculationMode === 'monthly'}
                                onChange={(e) => setCalculationMode(e.target.value)}
                                className="mr-2"
                            />
                            Monthly Components Based
                            </label>
                        </div>
                    </div>
                )}
                {isRevise && (
                    <>
                        <h1 className='text-xl font-medium text-start mb-10 w-full'>Select the Salary Revision type<span className="text-red-td-400">*</span></h1>
                        <div className="w-full flex flex-col items-start justify-start space-y-10 rounded-md mb-10">
                            <div className="w-[51%] flex items-center justify-start">
                                <label className="flex items-center flex-1 mb-0"> 
                                    <input
                                    type="radio"
                                    name="revisionType"
                                    value="percentage"
                                    checked={formData.revisionType === 'percentage'}
                                    onChange={(e) => handleRevisionTypeChange(e.target.value)}
                                    className="mr-2"
                                    />
                                    Revise CTC by percentage
                                </label>
                                {formData.revisionType === 'percentage' && (
                                    <div className="flex-[0_0_200px]"> 
                                    <ReuseableInput
                                        id="revisePercetage"
                                        name="revisePercetage"
                                        type="number"
                                        value={formData.revisePercetage}
                                        onChange={(e) => {
                                        const percentage = parseFloat(e.target.value) || 0;
                                        const currentCTC = parseFloat(formData?.annualCTC) || 0;
                                        const newCTC = currentCTC * (1 + percentage / 100);
                                        setFormData({
                                            ...formData,
                                            revisePercetage: e.target.value,
                                            resultCalculateAnnualCTC: newCTC,
                                        });
                                        }}
                                        isFocusRing={false}
                                        isPercentage={true}
                                    />
                                    </div>
                                )}
                            </div>
                            <div className="w-[40%] flex items-center justify-start">
                                <label className="flex items-center">
                                    <input
                                        type="radio" 
                                        name="revisionType"
                                        value="amount"
                                        checked={formData.revisionType === 'amount'}
                                        onChange={(e) => handleRevisionTypeChange(e.target.value)}
                                        className="mr-2"
                                    />
                                    Enter the new CTC amount below
                                </label>
                            </div>
                        </div>
                    </>
                )}

                <div className="w-full flex items-center justify-start mb-10">
                    {formData.revisionType === 'percentage' ? (
                        <div className="w-full flex items-center space-x-32">
                            <p className="mr-30 text-lg">
                                Revised Annual CTC<span className="text-red-td-400">*</span>
                            </p>
                            <div className="flex items-center justify-center">
                                <div className="flex w-80 items-center justify-center">
                                    <div className="w-fit px-5 py-2 text-[#6B7280] bg-gray-50 border-r-2 focus:ring-0 outline-none text-xl rounded-l-md border-y-2 border-l-2">
                                        $
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="0"
                                        value={
                                            formData.resultCalculateAnnualCTC
                                                ? formData.resultCalculateAnnualCTC 
                                                : (calculationMode === 'annual' ? formData.annualCTC : calculations?.total?.annual || 0)
                                        }
                                        onChange={(e) => {
                                            if (calculationMode === 'annual') {
                                                setFormData({
                                                    ...formData, 
                                                    annualCTC: e.target.value,
                                                    resultCalculateAnnualCTC: '' 
                                                });
                                            }
                                        }}
                                        disabled={calculationMode === 'monthly' || formData.revisionType === 'percentage'}
                                        className={`w-full px-4 py-2 focus:ring-0 outline-none text-lg border-y-2 ${
                                            calculationMode === 'monthly' || formData.revisionType === 'percentage'
                                                ? 'bg-transparent' 
                                                : ''
                                        }`}
                                    />
                                    <div className="w-[60%] text-center px-4 py-2.5 text-[#6B7280] bg-gray-50 border-l-2 focus:ring-0 outline-none text-base rounded-r-md border-y-2 border-r-2 capitalize">
                                        <p>per year</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (!isRevise) ? (
                        <div className={`w-full flex items-start justify-start ${!isEditMode && "space-x-10 py-7 px-10 border-2 rounded-lg"} relative`}>
                            <div className={`flex ${!isEditMode ? "flex-col space-y-2 items-start justify-start" : "items-center justify-between space-x-10 w-[70%]"} `}>
                                <p className='text-lg'>Annual CTC <span className='text-red-500'>*</span></p>
                                <div className="flex items-center justify-center">
                                    <div className="flex items-center justify-center">
                                        <div className="w-fit px-5 py-2 bg-gray-50 border-r-2 focus:ring-0 outline-none text-xl rounded-l-md border-y-2 border-l-2">
                                            $
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder="0" 
                                            value={calculationMode === 'annual' ? formData.annualCTC : calculations?.total?.annual || 0}
                                            onChange={(e) => calculationMode === 'annual' && setFormData({...formData, annualCTC: e.target.value})}
                                            disabled={calculationMode === 'monthly'}
                                            className={`w-full px-4 py-2 focus:ring-0 outline-none text-lg border-y-2 ${
                                                calculationMode === 'monthly' 
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-transparent'
                                            }`}
                                        />
                                        <div className="w-[50%] text-center px-4 py-2.5 text-[#6B7280] bg-gray-50 border-l-2 focus:ring-0 outline-none text-base rounded-r-md border-y-2 border-r-2 capitalize">
                                            <p>per year</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {!isEditMode && (
                                <div className="flex flex-col space-y-2 items-start justify-start">
                                    <p className='text-lg'>Monthly CTC</p>
                                    <div className="flex items-center justify-center">
                                        <div className="flex items-center justify-center">
                                            <div className="w-fit px-5 py-2 bg-gray-50 border-r-2 focus:ring-0 outline-none text-xl rounded-l-md border-y-2 border-l-2">
                                                $
                                            </div>
                                            <input 
                                                type="text" 
                                                placeholder="0" 
                                                value={calculationMode === 'annual' ? formData.annualCTC/12 : calculations?.total?.annual/12 || 0}
                                                onChange={(e) => calculationMode === 'annual' && setFormData({...formData, annualCTC: e.target.value})}
                                                disabled={calculationMode === 'monthly'}
                                                className={`w-full px-4 py-2 focus:ring-0 outline-none text-lg border-y-2 ${
                                                    calculationMode === 'monthly' 
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                        : 'bg-transparent'
                                                }`}
                                            />
                                            <div className="w-[60%] text-center px-4 py-2.5 text-[#6B7280] bg-gray-50 border-l-2 focus:ring-0 outline-none text-base rounded-r-md border-y-2 border-r-2 capitalize">
                                                <p>per Month</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {checkPermission(user, "Salary Revision", "Edit") && (
                                (!isRevise && !isEditMode) && (
                                    <div className="w-full flex items-center justify-end absolute bottom-7 right-7">
                                        <ButtonReusable 
                                            title={"Revise"} 
                                            action={() => {
                                                setIsRevise(!isRevise)
                                                setShowSalaryDetail(!showSalaryDetail)
                                                setIsEditMode(!isEditMode)
                                            }} 
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    ) : isRevise ? (
                        <div className="w-full flex space-x-[10%] items-center justify-start">
                            <p className='text-lg'>Revised Annual CTC <span className='text-red-500'>*</span></p>
                            <div className="flex items-center justify-center">
                                <div className="flex items-center justify-center">
                                    <div className="w-fit px-5 py-2 bg-gray-50 border-r-2 focus:ring-0 outline-none text-xl rounded-l-md border-y-2 border-l-2">
                                        $
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="0" 
                                        value={calculationMode === 'annual' ? formData.annualCTC : calculations?.total?.annual || 0}
                                        onChange={(e) => calculationMode === 'annual' && setFormData({...formData, annualCTC: e.target.value})}
                                        disabled={calculationMode === 'monthly'}
                                        className={`w-full px-4 py-2 focus:ring-0 outline-none text-lg border-y-2 ${
                                            calculationMode === 'monthly' 
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                : 'bg-transparent'
                                        }`}
                                    />
                                    <div className="w-[50%] text-center px-4 py-2.5 text-[#6B7280] bg-gray-50 border-l-2 focus:ring-0 outline-none text-base rounded-r-md border-y-2 border-r-2 capitalize">
                                        <p>per year</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
                <div className="w-full flex items-center justify-start mb-5">
                    <h1 className='text-xl font-medium text-black'>Salary Structure</h1>
                </div>
               <div className="relative overflow-x-auto w-full border rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 table-fixed">
                        <colgroup>
                            <col style={{ width: isEditMode ? '30%' : '40%' }} /> {/* Salary Components */}
                            {isEditMode && <col style={{ width: '20%' }} />} {/* Calculation Type */}
                            <col style={{ width: '20%' }} /> {/* Monthly Amount */}
                            <col style={{ width: '20%' }} /> {/* Annual Amount */}
                        </colgroup>
                        
                        <thead className="text-sm text-[#1F87FF] uppercase">
                            <tr className='bg-[#F5FAFF]'>
                                <th scope="col" className="px-6 py-5 font-medium">Salary Components</th>
                                {isEditMode && (
                                    <th scope="col" className="px-6 py-5 font-medium">Calculation Type</th>
                                )}
                                <th scope="col" className={`px-6 py-5 font-medium ${!isEditMode && "text-right"}`}>Monthly Amount</th>
                                <th scope="col" className={`px-6 py-5 font-medium ${!isEditMode && "text-right"}`}>Annual Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isEditMode && (
                                <tr>
                                    <td colSpan={2} className="py-5 text-lg font-medium text-black px-6">
                                        <div className="flex items-center justify-start w-full space-x-10">
                                            <span className='font-normal text-base'>Include One Time Earnings in this salary structure</span>
                                            
                                            <button
                                                type="button"
                                                disabled={!isEditMode}
                                                onClick={() => setIncludeOneTimeEarnings(!includeOneTimeEarnings)}
                                                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 ease-in-out ${
                                                    includeOneTimeEarnings 
                                                    ? 'bg-blue-600' 
                                                    : 'bg-gray-300'
                                                }`}
                                            >
                                            <span
                                                className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
                                                includeOneTimeEarnings 
                                                    ? 'translate-x-6' 
                                                    : 'translate-x-1'
                                                }`}
                                            />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {(includeOneTimeEarnings) && (
                                <OneTimeEarningsRows 
                                    salaryComponent={salaryComponent}
                                    bonuses={bonuses}
                                    setBonuses={setBonuses}
                                    commissions={commissions}
                                    setCommissions={setCommissions}
                                    giftCoupons={giftCoupons}
                                    setGiftCoupons={setGiftCoupons}
                                    customAllowancesOneTime={customAllowancesOneTime} // ✅ Add Custom Allowance One Time Pay
                                    setCustomAllowancesOneTime={setCustomAllowancesOneTime} // ✅ Add setter
                                    calculations={calculations}
                                    isEditMode={isEditMode}
                                />
                            )}

                            <tr className="">
                                <td className="py-5 text-xl font-medium text-[#1F87FF] px-6">Earnings</td>
                                {isEditMode && (
                                    <td></td>
                                )}
                                <td></td>
                                <td></td>
                            </tr>
                            
                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedBasicComponent}
                                setSelectedComponent={setSelectedBasicComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="basic"
                                formFieldPrefix="basic"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedHouseRentAllowanceComponent}
                                setSelectedComponent={setSelectedHouseRentAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="houseRentAllowance"
                                formFieldPrefix="hra"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                                calculationKeyOverride="hra"
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedDearnessAllowanceComponent}
                                setSelectedComponent={setSelectedDearnessAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="dearnessAllowance"
                                formFieldPrefix="dearnessAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />
                            
                            
                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedConveyanceAllowanceComponent}
                                setSelectedComponent={setSelectedConveyanceAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="conveyanceAllowance"
                                formFieldPrefix="conveyanceAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedChildrenEducationAllowanceComponent}
                                setSelectedComponent={setSelectedChildrenEducationAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="childrenEducationAllowance"
                                formFieldPrefix="childrenEducationAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedHostelExpenditureAllowanceComponent}
                                setSelectedComponent={setSelectedHostelExpenditureAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="hostelExpenditureAllowance"
                                formFieldPrefix="hostelExpenditureAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedTransportAllowanceComponent}
                                setSelectedComponent={setSelectedTransportAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="transportAllowance"
                                formFieldPrefix="transportAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedHelperAllowanceComponent}
                                setSelectedComponent={setSelectedHelperAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="helperAllowance"
                                formFieldPrefix="helperAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedTravellingAllowanceComponent}
                                setSelectedComponent={setSelectedTravellingAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="travellingAllowance"
                                formFieldPrefix="travellingAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedUniformAllowanceComponent}
                                setSelectedComponent={setSelectedUniformAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="uniformAllowance"
                                formFieldPrefix="uniformAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedDailyAllowanceComponent}
                                setSelectedComponent={setSelectedDailyAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="dailyAllowance"
                                formFieldPrefix="dailyAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedCityCompensatoryAllowanceComponent}
                                setSelectedComponent={setSelectedCityCompensatoryAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="cityCompensatoryAllowance"
                                formFieldPrefix="cityCompensatoryAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedOvertimeAllowanceComponent}
                                setSelectedComponent={setSelectedOvertimeAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="overtimeAllowance"
                                formFieldPrefix="overtimeAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedTelephoneAllowanceComponent}
                                setSelectedComponent={setSelectedTelephoneAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="telephoneAllowance"
                                formFieldPrefix="telephoneAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedFixedMedicalAllowanceComponent}
                                setSelectedComponent={setSelectedFixedMedicalAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="fixedMedicalAllowance"
                                formFieldPrefix="fixedMedicalAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedTransportAllowanceComponent}
                                setSelectedComponent={setSelectedProjectAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="projectAllowance"
                                formFieldPrefix="projectAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedFoodAllowanceComponent}
                                setSelectedComponent={setSelectedFoodAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="foodAllowance"
                                formFieldPrefix="foodAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedHolidayAllowanceComponent}
                                setSelectedComponent={setSelectedHolidayAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="holidayAllowance"
                                formFieldPrefix="holidayAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedEntertainmentAllowanceComponent}
                                setSelectedComponent={setSelectedEntertainmentAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="entertainmentAllowance"
                                formFieldPrefix="entertainmentAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedFoodCouponComponent}
                                setSelectedComponent={setSelectedFoodCouponComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="foodCoupon"
                                formFieldPrefix="foodCoupon"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedResearchAllowanceComponent}
                                setSelectedComponent={setSelectedResearchAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="researchAllowance"
                                formFieldPrefix="researchAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedBooksAndPeriodicalsAllowanceComponent}
                                setSelectedComponent={setSelectedBooksAndPeriodicalsAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="booksAndPeriodicalsAllowance"
                                formFieldPrefix="booksAndPeriodicalsAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedFuelAllowanceComponent}
                                setSelectedComponent={setSelectedFuelAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="fuelAllowance"
                                formFieldPrefix="fuelAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedDriverAllowanceComponent}
                                setSelectedComponent={setSelectedDriverAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="driverAllowance"
                                formFieldPrefix="driverAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedLeaveTravelAllowanceComponent}
                                setSelectedComponent={setSelectedLeaveTravelAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="leaveTravelAllowance"
                                formFieldPrefix="leaveTravelAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedVehicleMaintenanceAllowanceComponent}
                                setSelectedComponent={setSelectedVehicleMaintenanceAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="vehicleMaintenanceAllowance"
                                formFieldPrefix="vehicleMaintenanceAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedTelephoneAndInternetAllowanceComponent}
                                setSelectedComponent={setSelectedTelephoneAndInternetAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="telephoneAndInternetAllowance"
                                formFieldPrefix="telephoneAndInternetAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />

                            <EarningRow
                                salaryComponent={salaryComponent}
                                selectedComponent={selectedShiftAllowanceComponent}
                                setSelectedComponent={setSelectedShiftAllowanceComponent}
                                formData={formData}
                                setFormData={setFormData}
                                calculations={calculations}
                                componentKey="shiftAllowance"
                                formFieldPrefix="shiftAllowance"
                                calculationMode={calculationMode}
                                isEditMode={isEditMode}
                            />
                            
                            <CustomAllowanceRows 
                                salaryComponent={salaryComponent}
                                customAllowances={customAllowances}
                                setCustomAllowances={setCustomAllowances}
                                basicAmount={calculations.basic.monthly}
                                isEditMode={isEditMode}
                                calculationMode={calculationMode}
                            />

                            {/* Conditional Fixed Allowance row */}
                            {calculationMode === 'annual' && (
                                <tr className="">
                                    <td className="px-6 py-2 flex flex-col">
                                        <div className="flex items-center justify-start space-x-2">
                                            <p className='text-right text-lg text-black font-normal'>Fixed Allowance</p>
                                            {isEditMode && (
                                                <Info size={20} />
                                            )}
                                        </div>
                                        {isEditMode && (
                                            <span className='text-xs text-light'>Monthly CTC - Sum of all other components</span>
                                        )}
                                    </td>
                                    {isEditMode && (
                                        <td className="px-6 py-2 text-left text-lg text-black capitalize font-normal">Fixed amount</td>
                                    )}
                                    <td className="text-right text-lg text-gray-600 pe-10">
                                        ${calculations.fixedAllowance.monthly}
                                    </td>
                                    <td className="text-right text-lg text-gray-600 pe-10">
                                        ${calculations.fixedAllowance.annual}
                                    </td>
                                </tr>
                            )}

                            <ReimbursementRows 
                                salaryComponent={salaryComponent}
                                reimbursements={reimbursements}
                                setReimbursements={setReimbursements}
                                isEditMode={isEditMode}
                            />

                            {/* <ReimbursementFbpRows 
                                salaryComponent={salaryComponent}
                                reimbursements={reimbursements}
                                setReimbursements={setReimbursements}
                                fbpSelections={fbpSelections}
                                setFbpSelections={setFbpSelections}
                                dataReimbursementComponent={dataReimbursementComponent}
                                isEditMode={isEditMode}
                            /> */}

                            <BenefitRows
                                statutoryComponentSpk={statutoryComponentSpk}
                                benefits={benefits}
                                setBenefits={setBenefits}
                                basicAmount={calculations?.basic?.monthly || 0}
                                citizenCategory={statutoryComponentSpk?.citizenCategory}
                                isEditMode={isEditMode}
                            />

                            {!isEditMode && (
                                <tr className={`${!includeOneTimeEarnings && 'hidden'}`}>
                                    <td className="py-5 text-xl font-medium text-[#1F87FF] px-6 underline">Fixed CTC (Annual CTC - One Time Earnings)</td>
                                    {isEditMode && (
                                        <td></td>
                                    )}
                                    <td></td>
                                    <td></td>
                                </tr>
                            )}
                            {(includeOneTimeEarnings && !isEditMode) && (
                                <OneTimeEarningsRows 
                                    salaryComponent={salaryComponent}
                                    bonuses={bonuses}
                                    setBonuses={setBonuses}
                                    commissions={commissions}
                                    setCommissions={setCommissions}
                                    giftCoupons={giftCoupons}
                                    setGiftCoupons={setGiftCoupons}
                                    calculations={calculations}
                                    isEditMode={isEditMode}
                                />
                            )}

                            <tr className="h-5">
                                <td></td>
                            </tr>

                            {hasCalculationError && (
                                <tr>
                                    <td colSpan={isEditMode ? 4 : 3} className="px-6 h-full py-4">
                                        <div className="rounded-lg flex items-center justify-between border overflow-hidden">
                                            <div className="flex items-start justify-between">
                                                <div className="py-4 flex items-center justify-center w-12 bg-red-td-50">
                                                    <Info size={20} className='text-red-td-500' />
                                                </div>
                                                <div className="h-full flex flex-col items-start justify-center py-2 ps-4">
                                                    <h1 className='font-normal text-black text-sm'>System Calculated Components' Total</h1>
                                                    <p className='text-xs text-gray-td-400'>
                                                        Amount must be greater than zero. Adjust the CTC or any of the component's amount.
                                                    </p>
                                                    {/* <p className='text-xs text-gray-td-500 mt-1 font-mono'>
                                                        Formula: (Gross Salary Annual + One Time Earnings) - Annual CTC
                                                    </p> */}
                                                </div>
                                            </div>
                                            <div className="flex text-red-td-500 items-center pe-4" style={{ width: isEditMode ? '28%' : '22%' }}>
                                                <p className="text-center font-bold text-lg w-1/2">
                                                    -${(calculations?.totalErrorHandling?.monthly || 0).toLocaleString()}
                                                </p>
                                                <p className="text-center font-bold text-lg w-1/2">
                                                    -${(calculations?.totalErrorHandling?.annual || 0).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            <tr>
                                <td colSpan={isEditMode ? 4 : 3} className={`px-6 ${!isEditMode ? "pb-5" : "pb-10"}`}>
                                    <div className={`${isEditMode && "bg-blue-td-50 rounded-lg"} p-4 flex items-center justify-between`}>
                                        <h4 className="text-xl font-semibold text-black">
                                            Cost to Company
                                        </h4>
                                        <div className={`flex text-black items-center ${isEditMode ? 'gap-[180px]' : 'gap-[195px]'}`}>
                                            <p className="text-center font-bold text-lg min-w-[120px]">
                                                ${(calculations?.totalCostToCompany?.monthly || 0).toLocaleString()}
                                            </p>
                                            <p className="text-center font-bold text-lg min-w-[120px]">
                                                ${(calculations?.totalCostToCompany?.annual || 0).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {!isEditMode && (
                <div className='w-full p-5 px-10'>
                    <div className="w-full flex items-center justify-start mb-5">
                        <h1 className='text-xl font-medium text-black'>Other Deductions</h1>
                    </div>
                    <div className="relative overflow-x-auto w-full border rounded-xl overflow-hidden pb-10">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 table-fixed">
                            <thead className="text-sm text-[#1F87FF] uppercase">
                                <tr className='bg-[#F5FAFF]'>
                                    <th scope="col" className="px-6 py-5 font-medium">DEDUCTION NAME</th>
                                    <th scope="col" className={`px-[8%] py-5 font-medium`}>CALCULATION TYPE</th>
                                    <th scope="col" className={`px-[12%] py-5 font-medium`}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>

                                <BenefitRows
                                    statutoryComponentSpk={statutoryComponentSpk}
                                    benefits={benefits}
                                    setBenefits={setBenefits}
                                    basicAmount={calculations?.basic?.monthly || 0}
                                    citizenCategory={statutoryComponentSpk?.citizenCategory}
                                    isEditMode={isEditMode}
                                    isOtherDeductions={true}
                                />
                            </tbody>
                        </table>
                    </div>  
                </div>
            )}

            {isRevise && (
                <div className="w-full flex flex-col items-center justify-start px-10 my-10">
                    <h1 className='w-full flex items-center justify-start mb-5 text-xl text-black font-medium'>Payout Preferencess<span className='text-red-500'>*</span></h1>
                    <div className="w-full flex flex-col items-start justify-start space-y-5">
                        <div className="w-full flex items-center justify-between bgye">
                            <h1 className="text-lg">Revised Salary effective from</h1>
                            <div className="w-1/4">
                                <ReuseableInput
                                    id="revisedSalaryEffectiveFrom"
                                    name="revisedSalaryEffectiveFrom"
                                    type="date"
                                    value={formData.revisedSalaryEffectiveFrom 
                                        ? formData.revisedSalaryEffectiveFrom.split("T")[0] 
                                        : ""}
                                    onChange={(e) =>
                                        setFormData({
                                        ...formData,
                                        revisedSalaryEffectiveFrom: e.target.value
                                        })
                                    }
                                    isFocusRing={false}
                                />
                            </div>
                            <div className="w-1/2 flex items-center justify-start space-x-2">
                                <div className="h-full">
                                    <Info />
                                </div>
                                <p>The revised salary for Mubeen will be applicable from September, 2025.</p>
                            </div>
                        </div>
                        <div className="w-full flex items-center justify-between">
                            <h1 className="w-[19%] text-lg">Payout Month</h1>
                            <div className="w-1/4">
                                <ReuseableInput
                                    id="payoutMonth"
                                    name="payoutMonth"
                                    type="date"
                                    value={formData.payoutMonth 
                                        ? formData.payoutMonth.split("T")[0] 
                                        : ""}
                                    onChange={(e) =>
                                        setFormData({
                                        ...formData,
                                        payoutMonth: e.target.value
                                        })
                                    }
                                    isFocusRing={false}
                                />
                            </div>
                            <div className="w-1/2 flex items-center justify-start space-x-2">
                                <div className="h-full -mt-[4%]">
                                    <Info />
                                </div>
                                <p>The revised salary amount will be paid out in November, 2025, along with the arrears (if any).</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {isEditMode && (
                <div className="w-full px-10">
                    {isRevise ? (
                        <p className='pb-5 pt-10 text-sm'><span className='font-medium'>Note: </span>Tekydoct Payroll will automatically calculate any arrears in the salary and process them in the payout month, eliminating the need for manually adding arrear components.</p>
                    ) : (
                        <p className='pb-5 pt-10 text-sm'><span className='font-medium'>Note: </span> Any changes made to the salary components will take effect in the current pay run, provided it is not Approved.</p>
                    )}

                    <div className="pt-5 border-t w-full flex items-center justify-start space-x-3 pb-10">
                        <ButtonReusable 
                            title={"Save"} 
                            action={handleSubmit} 
                            disabled={hasCalculationError}
                        />
                        <ButtonReusable title={"Cancel"} action={cancel} isBLue={false} />
                    </div>
                </div>
            )}
        </div>
        </>
    );
}

export default SalaryDetails;