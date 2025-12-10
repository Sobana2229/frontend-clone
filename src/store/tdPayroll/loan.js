import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const loanStoreManagements = create((set, get) => ({
    loading: false,
    error: null,
    loanData: null,
    loanDataByUuid: null,
    loanNameData: null,
    loanNameOptions: [],
    loanPauseData: null,
    loanCard: null,
    loanAdvanceSalary: null,
    loanPaymentHistory: null,

    createLoans: async (formData, access_token, type) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + "/td-payroll/loan/" + type, formData, {
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

    updateLoans: async (formData, access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const url = `/td-payroll/loan/${type}/${uuid}`
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

    pauseLoan: async (access_token, formData, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + "/td-payroll/loan/pause-loan/" + uuid, formData, {
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

    getLoan: async (access_token, type, params) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/loan/" + type, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params
            });
            if(type === "name"){
                set({ loanNameData: response?.data ?? null });
            }else if(type === "card-loan"){
                set({ loanCard: response?.data ?? null });
            }else if(type === "card-advance-salary"){
                set({ loanAdvanceSalary: response?.data ?? null });
            }else if(type === "option"){
                const LoanNameData = [
                    ...response?.data,
                    { value: 'create-new-data', label: 'New Loan' }
                ];
                set({ loanNameOptions: LoanNameData || [] });
            }else{
                set({ loanData: response?.data ?? null });
            }
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    deleteLoans: async (access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const url = `/td-payroll/loan/${type}/${uuid}`
            const {data: response} = await axios.delete(baseUrl + url, {
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

    getLoanPause: async (access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/loan/pause-loan/" + uuid, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            set({ loanPauseData: response?.data || [] });
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    getLoanByUuid: async (access_token, uuid, type, isSalaryAdvance = null) => {
        set({ loading: true, error: null });
        try {
            let url;
            let params = {};
            
            if(uuid){
                if(type){
                    url = `/td-payroll/loan/${type}/${uuid}`
                    // Pass isSalaryAdvance as query param for admin-portal
                    if(type === "admin-portal" && isSalaryAdvance !== null) {
                        params.isSalaryAdvance = isSalaryAdvance;
                    }
                }else{
                    url = `/td-payroll/loan/find/${uuid}`
                }
            }else if(type === "employee-portal-loan"){
                url = `/td-payroll/loan/${type}`
            }else if(type === "employee-portal-advance-salary"){
                url = `/td-payroll/loan/${type}`
            }
            const {data: response} = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params
            });
            switch (type) {
                case "loan-payment":
                    set({ loanPaymentHistory: response?.data || null });
                    break;
                default:
                    set({ loanDataByUuid: response?.data || null });
                    break;
            }
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

export default loanStoreManagements;