import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const payrunStoreManagements = create((set, get) => ({
    loading: false,
    error: null,
    payrunThisMonth: null,
    payrunEmployee: null,
    payrunData: null,
    payrunDataHistory: null,
    firstPayrunData: null,
    payrunDataExitEmployee: null,
    payrunDataExitEmployeePoi: null,
    payrunDownloadHistory: null,
    activeTab: null,
    priorPayrunPeriod: null,
    priorPayrun: null,
    priorPayrunGetOne: null,

    getPayrunData: async (access_token, params, type) => {
        set({ loading: true, error: null });
        try {
            const url = type ? `/td-payroll/payrun/${type}` : '/td-payroll/payrun'
            const {data: response} = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params
            });
             if (type === 'prior-payrun' && params.period) {
            set({ priorPayrunGetOne: response?.data ?? null });
            } else {
                switch(type) {    
                    case 'history':
                        set({ payrunDataHistory: response?.data ?? null });
                        break;
                    case 'prior-payrun':
                        set({ priorPayrun: response?.data ?? null });
                        break;
                    case 'prior-payrun-period':
                        set({ priorPayrunPeriod: response?.data ?? null });
                        break;
                    case 'first-payroll':
                        set({ firstPayrunData: response?.data ?? null });
                        break;
                    default:
                        set({ payrunThisMonth: response?.data ?? null });
                        break;
                }
            }
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    deletePayrunHistory: async (access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const url = '/td-payroll/payrun/' + uuid
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

    getDetailEmployeePayrun: async (access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + `/td-payroll/payrun/detail-employee/${uuid}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            set({ payrunEmployee: response?.data ?? null });
            return true;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    createDetailEmployeePayrun: async (formData, access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + `/td-payroll/payrun/detail-employee/${uuid}`, formData, {
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

    initiateExitPayrun: async (formData, access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + `/td-payroll/payrun/initiate-exit/${uuid}`, formData, {
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

    getInitiateExitPayrun: async (access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + `/td-payroll/payrun/initiate-exit/${uuid}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            set({ payrunDataExitEmployee: response?.data ?? null });
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    poiExitPayrun: async (formData, access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + `/td-payroll/payrun/poi-exit/${uuid}`, formData, {
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

    getPoiExitPayrun: async (access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const url = uuid ? `/td-payroll/payrun/poi-exit/${uuid}` : '/td-payroll/payrun/poi-exit'
            const {data: response} = await axios.get(baseUrl + url , {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            set({ payrunDataExitEmployeePoi: response?.data ?? null });
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    createPayrun: async (formData, access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const url = uuid ? `/td-payroll/payrun/${uuid}` : '/td-payroll/payrun'
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

    createPriorPayrunDetail: async (formData, access_token, selectedPeriod) => {
        set({ loading: true, error: null });
        try {
            const url = selectedPeriod ? `/td-payroll/payrun/prior-payrun-detail/${selectedPeriod}` : '/td-payroll/payrun/prior-payrun-detail'
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

    createPriorPayrun: async (access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const url = uuid ? `/td-payroll/payrun/prior-payrun/${uuid}` : '/td-payroll/payrun/prior-payrun'
            const {data: response} = await axios.post(baseUrl + url, {}, {
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

    deleteDetailEmployeePayrun: async (access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.delete(baseUrl + `/td-payroll/payrun/detail-employee/${uuid}`, {
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

    downloadDetailPayrun: async (access_token, params) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(baseUrl + `/td-payroll/payrun/download-payrun`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params,
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },
    
    getDownloadhistoryDetailPayrun: async (access_token) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + `/td-payroll/payrun/download-payrun-history`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            set({ payrunDownloadHistory: response?.data ?? [] });
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    getPayrun: async (access_token) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/payrun", {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },         
            });
            set({ payrunData: response?.data ?? null });
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    changeStatusEmployee: async (access_token, uuid, formData, type) => {
        set({ loading: true, error: null });
        try {            
            if(type === "delete"){
                const {data: response} = await axios.delete(baseUrl + `/td-payroll/payrun/${type}/${uuid}`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                });
                return response?.data;
            } if(type === "status"){
                const {data: response} = await axios.post(baseUrl + `/td-payroll/payrun/${type}/${uuid}`, formData, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                });
                return response?.data;
            } else {
                const {data: response} = await axios.put(baseUrl + `/td-payroll/payrun`, formData, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                });
                return response?.data;
            }
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    changeActiveTab: (isActive=true) => {
        if(isActive){
            set({ activeTab: 1 });
        }else{
            set({ activeTab: null });
        }
    },

    // ✅ Get Variable Pay Custom Allowance options for payrun earnings
    getVariablePayEarnings: async (access_token) => {
        set({ loading: true, error: null });
        try {
            // ✅ Get all earnings without pagination (we need all Variable Pay options)
            const {data: response} = await axios.get(baseUrl + "/td-payroll/salary-component/earning", {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params: {
                    limit: 1000, // Get all (adjust if needed)
                    page: 1
                }
            });
            
            // ✅ Handle paginated response structure: 
            // Backend List helper returns: { list: [...], page, totalData, totalPage }
            // Response wrapper: { code: 200, message: 'Success', data: { list: [...], page, totalData, totalPage } }
            // So we need: response.data.list (not response.data.data)
            const earningsData = response?.data?.list || [];
            
            if (!Array.isArray(earningsData)) {
                return [];
            }
            
            // Filter only Custom Allowance with Variable Pay and isActive
            const variablePayOptions = earningsData.filter(comp => {
                const isCustomAllowance = comp.earningType === "Custom Allowance";
                const isVariablePay = comp.payType === "Variable Pay";
                const isActive = comp.isActive === true;
                
                return isCustomAllowance && isVariablePay && isActive;
            });
            
            return variablePayOptions.map(comp => ({
                value: comp.uuid,
                label: comp.earningName || comp.nameInPayslip,
                component: comp
            }));
        } catch (error) {
            set({ error: error?.response?.data });
            return [];
        } finally {
            set({ loading: false });
        }
    },

    clearError: () => {
        set({ loading: false, error: null });
    }
}));

export default payrunStoreManagements;