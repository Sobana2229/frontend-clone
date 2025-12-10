import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const employeeStoreManagements = create((set, get) => ({
    loading: false,
    error: null,
    dataEmployees: [],
    lastFetchedUuid: null,
    dataEmployeeAll: [],
    totalPage: null,
    dataEmployeePersonalDetail: null,
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
    dataEmployeesOptions: null,
    lastestEmployeeAttendance: null,
    employeeShiftData: [],
    employeeWorkShift: [],
    tempDataNewEmployee: null,
    employeeTodayShiftData: null,
    employeeTodayBreakData: null,
    lastestEmployeeTodayBreak: null,
    dataEmployeePaymentInformation: null,

    resetSalaryDetailData: () => set({ 
        lastFetchedUuid: null, // ✅ TAMBAH INI
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
        dataEmployeePaymentInformation: null,
    }),
    
    resetTempData: () => set({ 
        tempDataNewEmployee: null,
        dataEmployeePersonalDetail: null,
        dataEmployeePaymentInformation: null,
    }),
    
    fetchEmployeeList: async (access_token, params) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/employee", {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params,
            });
            if(params?.all){
                set({ dataEmployeeAll: response?.data || [] });
            }else{
                set({ totalPage: response?.data?.totalPage || [] });
                set({ dataEmployees: response?.data || [] });
            }
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    findOneEmployee: async (access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/employee/lastest-employee/" + uuid, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            set({ tempDataNewEmployee: response?.data || null });
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    creatEmployee: async (formData, access_token) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + "/td-payroll/employee/create", formData, {
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

    createEmployeeAttendance: async (formData, access_token, type) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + "/td-payroll/employee/attendance/" + type, formData, {
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

    assignEmployeeShift: async (formData, access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + `/td-payroll/employee/${type}/${uuid}`, formData, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            return response?.data || null;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    getEmployeeOverview: async (access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            let url;
            if(uuid){
                url =`/td-payroll/employee/${type}/${uuid}`
            }else{
                url =`/td-payroll/employee/${type}`
            }
            const {data: response} = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            switch(type) {
                case 'attendance':
                    set({ lastestEmployeeAttendance: response?.data || null });
                    break;
                case 'break':
                    set({ lastestEmployeeTodayBreak: response?.data || null });
                    break;
                case 'shift':
                    set({ employeeShiftData: response?.data?.availableShifts || [] });
                    break;
                case 'employeeOptions':
                    set({ dataEmployeesOptions: response?.data || null });
                    break;
                default:
                    return [];
            }
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    getEmployeeTodayData: async (access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const url = `/td-payroll/employee/today-data/${type}`;
            const {data: response} = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
              switch(type) {
                case 'break':
                    set({ employeeTodayBreakData: response?.data || null });
                    break;
                case 'shift':
                    set({ employeeTodayShiftData: response?.data || [] });
                    break;
                // case 'employeeOptions':
                //     set({ dataEmployeesOptions: response?.data || null });
                //     break;
                default:
                    return [];
            }
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    updateEmployee: async (formData, access_token, uuid, params) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.put(baseUrl + "/td-payroll/employee/personal-detail/" + uuid, formData, {
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

    updateSalaryDetailEmployee: async (formData, access_token, uuid, isRevise=false) => {
        set({ loading: true, error: null });
        try {
            const url = isRevise ? `/td-payroll/employee/salary-detail-revise/${uuid}` : `/td-payroll/employee/salary-detail/${uuid}`
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

    getSalaryDetailEmployee: async (access_token, uuid, isRevise=false) => {
        set({ loading: true, error: null });
        try {
            const url = isRevise ? "/td-payroll/employee/salary-detail-revise/" + uuid : "/td-payroll/employee/salary-detail/" + uuid
            const {data: response} = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                },
            });
            
            const comps = response?.data?.SalaryDetailComponents ?? [];
            const isType = (i, t) => (i?.type ?? '').trim().toLowerCase() === t;
            const orNull = arr => (Array.isArray(arr) && arr.length ? arr : null);
            
            // ✅ BATCH semua state update jadi SATU set() call
            set({ 
                dataEmployeeSalaryDetail: response?.data ?? null,
                lastFetchedUuid: uuid, // ✅ Track UUID
                dataBasicSalaryComponent: comps.find(i => isType(i, 'basic')) ?? null,
                dataCustomAllowanceSalaryComponent: orNull(comps.filter(i => isType(i, 'custom allowance'))),
                dataBonusComponent: orNull(comps.filter(i => isType(i, 'bonus'))),
                dataCommissionComponent: comps.filter(i => isType(i, 'commission')),
                dataGiftCouponsComponent: comps.filter(i => isType(i, 'gift coupon'.toLowerCase())),
                dataHouseRentAllowanceComponent: comps.find(i => isType(i, 'house rent allowance')),
                dataDearnessAllowanceComponent: comps.find(i => isType(i, 'dearness allowance')),
                dataConveyanceAllowanceComponent: comps.find(i => isType(i, 'conveyance allowance')),
                dataChildrenEducationAllowanceComponent: comps.find(i => isType(i, 'children education allowance')),
                dataHostelExpenditureAllowanceComponent: comps.find(i => isType(i, 'hostel expenditure allowance')),
                dataTransportAllowanceComponent: comps.find(i => isType(i, 'transport allowance')),
                dataHelperAllowanceComponent: comps.find(i => isType(i, 'helper allowance')),
                dataTravellingAllowanceComponent: comps.find(i => isType(i, 'travelling allowance')),
                dataUniformAllowanceComponent: comps.find(i => isType(i, 'uniform allowance')),
                dataDailyAllowanceComponent: comps.find(i => isType(i, 'daily allowance')),
                dataCityCompensatoryAllowanceComponent: comps.find(i => isType(i, 'city compensatory allowance')),
                dataOvertimeAllowanceComponent: comps.find(i => isType(i, 'overtime allowance')),
                dataTelephoneAllowanceComponent: comps.find(i => isType(i, 'telephone allowance')),
                dataFixedMedicalAllowanceComponent: comps.find(i => isType(i, 'fixed medical allowance')),
                dataProjectAllowanceComponent: comps.find(i => isType(i, 'project allowance')),
                dataFoodAllowanceComponent: comps.find(i => isType(i, 'food allowance')),
                dataHolidayAllowanceComponent: comps.find(i => isType(i, 'holiday allowance')),
                dataEntertainmentAllowanceComponent: comps.find(i => isType(i, 'entertainment allowance')),
                dataFoodCouponComponent: comps.find(i => isType(i, 'food coupon')),
                dataResearchAllowanceComponent: comps.find(i => isType(i, 'research allowance')),
                dataBooksAndPeriodicalsAllowanceComponent: comps.find(i => isType(i, 'books and periodicals allowance')),
                dataFuelAllowanceComponent: comps.find(i => isType(i, 'fuel allowance')),
                dataDriverAllowanceComponent: comps.find(i => isType(i, 'driver allowance')),
                dataLeaveTravelAllowanceComponent: comps.find(i => isType(i, 'leave travel allowance')),
                dataVehicleMaintenanceAllowanceComponent: comps.find(i => isType(i, 'vehicle maintenance allowance')),
                dataTelephoneAndInternetAllowanceComponent: comps.find(i => isType(i, 'telephone and internet allowance')),
                dataShiftAllowanceComponent: comps.find(i => isType(i, 'shift allowance')),
                dataReimbursementComponent: orNull(comps.filter(i => isType(i, 'reimbursements'))),
            });
        } catch (error) {
            if (error?.response?.status !== 304) {
                set({ error: error?.response?.data });
            }
        } finally {
            set({ loading: false });
        }
    },

    fetchEmployeePersonalDetail: async (access_token, uuid, type) => {
        set({ loading: true, error: null });
        try {
            let url;
            if(uuid){
                if(type == "payment-information"){
                    url = `/td-payroll/employee/payment-information/${uuid}`
                }else{
                    url = `/td-payroll/employee/personal-detail/${uuid}`
                }
            }else if(type === "employee-portal"){
                url = `/td-payroll/employee-portal/personal-detail/${type}`
            }
            const {data: response} = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            switch (type) {
                case "payment-information":
                    set({ dataEmployeePaymentInformation: response?.data || null });
                    break;
                default:
                    set({ dataEmployeePersonalDetail: response?.data || null });
                    break;
            }
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    fetchEmployeeWorkShift: async (access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/employee/work-shift/" + uuid, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            set({ employeeWorkShift: response?.data || null });
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    checkValidationToken: async (access_token) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/invitation-validation-employee", {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            return response;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    reinviteEmployee: async (email, access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(
                baseUrl + `/td-payroll/employee/reinvite/${uuid}`, 
                { email },
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                }
            );
            return response?.data;
        } catch (error) {
            set({ error: error?.response?.data });
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    
    clearError: () => {
        set({ loading: false, error: null });
    }
}));

export default employeeStoreManagements;