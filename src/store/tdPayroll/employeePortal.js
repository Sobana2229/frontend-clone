import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const employeePortalStoreManagements = create((set, get) => ({
    loading: false,
    error: null,
    dataReimbursementEmployee: null,
    dataReimbursementEmployeeList: null,
    dataAttandanceEmployeePortal: {},
    dataEmployeeSalaryDetail: null,
    dataBasicSalaryComponent: null,
    dataCustomAllowanceSalaryComponent: null,
    dataBonusComponent: null,
    dataHouseRentAllowanceComponent: null,
    dataDearnessAllowanceComponent: null,
    dataConveyanceAllowanceComponent: null,
    dataChildrenEducationAllowanceComponent: null,
    dataHostelExpenditureAllowanceComponent: null,
    dataTransportAllowanceComponent: null,
    dataHelperAllowanceComponent: null,
    dataTravellingAllowanceComponent: null,
    dataUniformAllowanceComponent: null,
    dataDailyAllowanceComponent: null,
    dataCityCompensatoryAllowanceComponent: null,
    dataOvertimeAllowanceComponent: null,
    dataTelephoneAllowanceComponent: null,
    dataFixedMedicalAllowanceComponent: null,
    dataProjectAllowanceComponent: null,
    dataFoodAllowanceComponent: null,
    dataHolidayAllowanceComponent: null,
    dataEntertainmentAllowanceComponent: null,
    dataFoodCouponComponent: null,
    dataResearchAllowanceComponent: null,
    dataBooksAndPeriodicalsAllowanceComponent: null,
    dataFuelAllowanceComponent: null,
    dataDriverAllowanceComponent: null,
    dataLeaveTravelAllowanceComponent: null,
    dataVehicleMaintenanceAllowanceComponent: null,
    dataTelephoneAndInternetAllowanceComponent: null,
    dataShiftAllowanceComponent: null,
    dataCommissionComponent: null,
    dataGiftCouponsComponent: null,
    dataReimbursementComponent: null,
    dataPayslipEmployee: null,
    dataEmployeeAnnualEarning: null,
    dataEmployeeRegulationList: null,
    dataEmployeeLeave: null,
    dataEmployeeLeaveList: null,
    dataEmployeeLeaveLimit: null,
    
    getSalaryStructureEmployee: async (access_token, year=null) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/employee-portal/salary-structure", {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params: {year}
            });
            if(year){
                set({ dataEmployeeAnnualEarning: response?.data ?? null });
            }else{
                set({ dataEmployeeSalaryDetail: response?.data ?? null });
            }
            
            const comps = response?.data?.SalaryDetailComponents ?? [];
            const isType = (i, t) => (i?.type ?? '').trim().toLowerCase() === t;
            const orNull = arr => (Array.isArray(arr) && arr.length ? arr : null);
            const basic = comps.find(i => isType(i, 'basic')) ?? null;
            set({ dataBasicSalaryComponent: basic });

            const customAllowance = comps.filter(i => isType(i, 'custom allowance'));
            set({ dataCustomAllowanceSalaryComponent: orNull(customAllowance) });

            const bonus = comps.filter(i => isType(i, 'bonus'));
            set({ dataBonusComponent: orNull(bonus) });

            // dataCommissionComponent
            const commissionAllowance = comps.filter(i => isType(i, 'commission'));
            set({ dataCommissionComponent: commissionAllowance });

            // dataGiftCouponsComponent
            const giftCoupons = comps.filter(i => isType(i, 'gift coupon'.toLowerCase()));
            set({ dataGiftCouponsComponent: giftCoupons });

            const houseRentAllowance = comps.find(i => isType(i, 'house rent allowance'));     
            set({ dataHouseRentAllowanceComponent: houseRentAllowance });

            // dataDearnessAllowanceComponent
            const dearnessAllowance = comps.find(i => isType(i, 'dearness allowance'));
            set({ dataDearnessAllowanceComponent: dearnessAllowance });

            // dataConveyanceAllowanceComponent
            const conveyanceAllowance = comps.find(i => isType(i, 'conveyance allowance'));
            set({ dataConveyanceAllowanceComponent: conveyanceAllowance });

            // dataChildrenEducationAllowanceComponent
            const childrenEducationAllowance = comps.find(i => isType(i, 'children education allowance'));
            set({ dataChildrenEducationAllowanceComponent: childrenEducationAllowance });

            // dataHostelExpenditureAllowanceComponent
            const hostelExpenditureAllowance = comps.find(i => isType(i, 'hostel expenditure allowance'));
            set({ dataHostelExpenditureAllowanceComponent: hostelExpenditureAllowance });

            // dataTransportAllowanceComponent
            const transportAllowance = comps.find(i => isType(i, 'transport allowance'));
            set({ dataTransportAllowanceComponent: transportAllowance });

            // dataHelperAllowanceComponent
            const helperAllowance = comps.find(i => isType(i, 'helper allowance'));
            set({ dataHelperAllowanceComponent: helperAllowance });

            // dataTravellingAllowanceComponent
            const travellingAllowance = comps.find(i => isType(i, 'travelling allowance'));
            set({ dataTravellingAllowanceComponent: travellingAllowance });

            // dataUniformAllowanceComponent
            const uniformAllowance = comps.find(i => isType(i, 'uniform allowance'));
            set({ dataUniformAllowanceComponent: uniformAllowance });

            // dataDailyAllowanceComponent
            const dailyAllowance = comps.find(i => isType(i, 'daily allowance'));
            set({ dataDailyAllowanceComponent: dailyAllowance });

            // dataCityCompensatoryAllowanceComponent
            const cityCompensatoryAllowance = comps.find(i => isType(i, 'city compensatory allowance'));
            set({ dataCityCompensatoryAllowanceComponent: cityCompensatoryAllowance });

            // dataOvertimeAllowanceComponent
            const overtimeAllowance = comps.find(i => isType(i, 'overtime allowance'));
            set({ dataOvertimeAllowanceComponent: overtimeAllowance });

            // dataTelephoneAllowanceComponent
            const telephoneAllowance = comps.find(i => isType(i, 'telephone allowance'));
            set({ dataTelephoneAllowanceComponent: telephoneAllowance });

            // dataFixedMedicalAllowanceComponent
            const fixedMedicalAllowance = comps.find(i => isType(i, 'fixed medical allowance'));
            set({ dataFixedMedicalAllowanceComponent: fixedMedicalAllowance });

            // dataProjectAllowanceComponent
            const projectAllowance = comps.find(i => isType(i, 'project allowance'));
            set({ dataProjectAllowanceComponent: projectAllowance });

            // dataFoodAllowanceComponent
            const foodAllowance = comps.find(i => isType(i, 'food allowance'));
            set({ dataFoodAllowanceComponent: foodAllowance });

            // dataHolidayAllowanceComponent
            const holidayAllowance = comps.find(i => isType(i, 'holiday allowance'));
            set({ dataHolidayAllowanceComponent: holidayAllowance });

            // dataEntertainmentAllowanceComponent
            const entertainmentAllowance = comps.find(i => isType(i, 'entertainment allowance'));
            set({ dataEntertainmentAllowanceComponent: entertainmentAllowance });

            // dataFoodCouponComponent
            const foodCoupon = comps.find(i => isType(i, 'food coupon'));
            set({ dataFoodCouponComponent: foodCoupon });

            // dataResearchAllowanceComponent
            const researchAllowance = comps.find(i => isType(i, 'research allowance'));
            set({ dataResearchAllowanceComponent: researchAllowance });

            // dataBooksAndPeriodicalsAllowanceComponent
            const booksAndPeriodicalsAllowance = comps.find(i => isType(i, 'books and periodicals allowance component'));
            set({ dataBooksAndPeriodicalsAllowanceComponent: booksAndPeriodicalsAllowance });

            // dataFuelAllowanceComponent
            const fuelAllowance = comps.find(i => isType(i, 'fuel allowance'));
            set({ dataFuelAllowanceComponent: fuelAllowance });

            // dataDriverAllowanceComponent
            const driverAllowance = comps.find(i => isType(i, 'driver allowance'));
            set({ dataDriverAllowanceComponent: driverAllowance });

            // dataLeaveTravelAllowanceComponent
            const leaveTravelAllowance = comps.find(i => isType(i, 'leave travel allowance'));
            set({ dataLeaveTravelAllowanceComponent: leaveTravelAllowance });

            // dataVehicleMaintenanceAllowanceComponent
            const vehicleMaintenanceAllowance = comps.find(i => isType(i, 'vehicle maintenance allowance'));
            set({ dataVehicleMaintenanceAllowanceComponent: vehicleMaintenanceAllowance });

            // dataTelephoneAndInternetAllowanceComponent
            const telephoneAndInternetAllowance = comps.find(i => isType(i, 'telephone and internet allowance'));
            set({ dataTelephoneAndInternetAllowanceComponent: telephoneAndInternetAllowance });

            // dataShiftAllowanceComponent
            const shiftAllowance = comps.find(i => isType(i, 'shift allowance'));
            set({ dataShiftAllowanceComponent: shiftAllowance });
            
            const reimbursement = comps.filter(i => isType(i, 'reimbursements'));
            set({ dataReimbursementComponent: orNull(reimbursement) });
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    getPayslipEmployee: async (access_token, year = null, uuid, period = null) => {
        set({ loading: true, error: null, dataPayslipEmployee: null }); // Reset data to ensure fresh data
        try {
            const url = uuid ? "/td-payroll/employee-portal/payslip-employee/" + uuid : "/td-payroll/employee-portal/payslip-employee"
            const params = {};
            if (period !== null && period !== undefined) {
                params.period = String(period);
            } else if (year !== null && year !== undefined) {
                params.year = String(year);
            }
            const {data: response} = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params,
            });
            set({ dataPayslipEmployee: response?.data ?? null });
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    getReimbursementEmployee: async (access_token, type, period = null, page = 1, limit = 10, employeeUuid = null) => {
        set({ loading: true, error: null });
        try {
            const url = `/td-payroll/employee-portal/${type}`
            const params = {
                page,
                limit,
            };
            if (period) {
                params.period = period;
            }
            if (employeeUuid) {
                params.employeeUuid = employeeUuid;
            }
            const {data: response} = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params,
            });
            switch (type) {
                case 'reimbursement':
                        set({ dataReimbursementEmployee: response?.data || [] });
                    break;
                case 'reimbursementList':
                        set({ dataReimbursementEmployeeList: response?.data || [] });
                    break
                default:
                    break;
            }
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    fetchDataReportEmployeePortal: async (access_token, date, type, search) => {
        set({ loading: true, error: null });
        try {
            const body = {
                startDate: date?.startDate,
                endDate: date?.endDate,
                search,
            };
            const { data: attendance } = await axios.post(
                `${baseUrl}/td-payroll/employee-portal/attendance-detail`, body, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                }
            );
            switch (type) {
                case "attandance-employe":
                    set({ dataAttandanceEmployeePortal: attendance?.data ?? [] });
                    break;
                default:
                    break;
            }
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    getOneReimbursementEmployee: async (access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const url = `/td-payroll/employee-portal/${type}/${uuid}`
            const {data: response} = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            return response?.data;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    createReimbursementEmployee: async (access_token, formData, type, employeeUuid = null) => {
        set({ loading: true, error: null });
        try {
            const url = `/td-payroll/employee-portal/${type}`
            const params = {};
            if (employeeUuid) {
                params.employeeUuid = employeeUuid;
            }
            const {data: response} = await axios.post(baseUrl + url, formData, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params,
            });
            return response?.data;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    createRegulation: async (access_token, formData, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const url = uuid ? `/td-payroll/regulation/${type}/${uuid}` : `/td-payroll/regulation/${type}`
            const {data: response} = await axios.post(baseUrl + url, formData, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            return response?.data;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    updateRegulation: async (access_token, formData, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const url = `/td-payroll/regulation/${type}/${uuid}`
            const {data: response} = await axios.put(baseUrl + url, formData, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            return response?.data;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    getRegulation: async (access_token, params, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const url = uuid ? `/td-payroll/regulation/${type}/${uuid}` : `/td-payroll/regulation/${type}`
            const {data: response} = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params
            });
            set({ dataEmployeeRegulationList: response?.data || null });
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    getOneRegulation: async (access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const url = `/td-payroll/regulation/get-one/${uuid}`
            const {data: response} = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            return response?.data;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    createLeave: async (access_token, formData, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const url = uuid ? `/td-payroll/leave-employee/${type}/${uuid}` : `/td-payroll/leave-employee/${type}`
            const {data: response} = await axios.post(baseUrl + url, formData, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            return response?.data;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    updateLeave: async (access_token, formData, uuid) => {
        set({ loading: true, error: null });
        try {
            const url = `/td-payroll/leave-employee/${uuid}`
            const {data: response} = await axios.put(baseUrl + url, formData, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            return response?.data;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    getLeave: async (access_token, type) => {
        set({ loading: true, error: null });
        try {
            const url = `/td-payroll/leave-employee/${type}`;
            const {data: response} = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            set({ dataEmployeeLeave: response?.data || null });
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    getLeaveList: async (access_token, params, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const base = type ? `/td-payroll/leave-employee/list/${type}` : `/td-payroll/leave-employee/list`
            const url = uuid ? base + `/${uuid}` : base
            const {data: response} = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params
            });
            set({ dataEmployeeLeaveList: response?.data || null });
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    getLeaveLimit: async (access_token, uuid, params) => {
        set({ loading: true, error: null });
        try {
            const url = `/td-payroll/leave-employee/get-limit/${uuid}`
            const {data: response} = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params
            });
            set({ dataEmployeeLeaveLimit: response?.data || null });
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    getOneLeave: async (access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const url = `/td-payroll/leave-employee/get-one/${uuid}`
            const {data: response} = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            return response?.data;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    modifyReimbursementEmployee: async (access_token, type, uuid, formData={}) => {
        set({ loading: true, error: null });
        try {
            let url = `/td-payroll/employee-portal/${type}`
            if(uuid){
                url = `/td-payroll/employee-portal/${type}/${uuid}`
            }else{
                url = `/td-payroll/employee-portal/${type}`
            }
            const {data: response} = await axios.put(baseUrl + url, formData, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            return response?.data;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    clearError: () => {
        set({ loading: false, error: null });
    }
}));

export default employeePortalStoreManagements;