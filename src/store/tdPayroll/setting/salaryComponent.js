import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const salaryComponentStoreManagements = create((set, get) => ({
    loading: false,
    error: null,
    listEarning: null,
    salaryComponentAll: null,
    listReimbursement: null,
    dataEarning: null,
    dataReimbursement: null,
    salaryComponent: null,
    reimbursementTypeOptions: [],

    createSalaryComponent: async (formData, access_token, type) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + "/td-payroll/salary-component/" + type, formData, {
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

    createOptionSalaryComponent: async (formData, type, access_token) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + "/td-payroll/salary-component/option/" + type, formData, {
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

    updateSalaryComponent: async (formData, access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.put(baseUrl + `/td-payroll/salary-component/${type}/${uuid}`, formData, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            return response?.data;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Failed to update salary component';
            set({ error: error?.response?.data });
            throw new Error(errorMessage);
        } finally {
            set({ loading: false });
        }
    },

    deleteSalaryComponent: async (access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.delete(baseUrl + `/td-payroll/salary-component/${type}/${uuid}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });            
            return response?.data;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Failed to delete salary component';
            set({ error: error?.response?.data });
            throw new Error(errorMessage);
        } finally {
            set({ loading: false });
        }
    },

    changeStatusSalaryComponent: async (access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.patch(baseUrl + `/td-payroll/salary-component/${type}/${uuid}`, {}, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });            
            return response?.data;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Failed to change status';
            set({ error: error?.response?.data });
            throw new Error(errorMessage);
        } finally {
            set({ loading: false });
        }
    },

    fetchAllSalaryComponent: async (access_token) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/salary-component", {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            set({ salaryComponent: response?.data ?? null });
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    findOneComponent: async (access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + `/td-payroll/salary-component/${type}/${uuid}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            switch (type) {
                case "earning":
                    set({ dataEarning: response?.data ?? null });
                    break;
                case "reimbursement":
                    set({ dataReimbursement: response?.data ?? null });
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

    fetchOptionSalaryComponent: async (access_token, type) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/salary-component/option/" + type, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
           
            switch(type) {    
                case 'reimbursementType':
                    const reimbursementTypeData = [
                        ...response?.data,
                        { value: 'create-new-data', label: 'New Reimbursement Type' }
                    ];
                    set({ reimbursementTypeOptions: reimbursementTypeData || [] });
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

    fetchSalaryComponent: async (access_token, type) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/salary-component/" + type, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            switch(type) {    
                case 'all':
                    set({ salaryComponentAll: response?.data ?? null });
                    break;
                case 'earning':
                    set({ listEarning: response?.data ?? null });
                    break;
                case 'reimbursement':
                    set({ listReimbursement: response?.data ?? null });
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

    clearData: () => {
        set({ dataEarning: null });
    },

    clearError: () => {
        set({ loading: false, error: null });
    }
}));

export default salaryComponentStoreManagements;
