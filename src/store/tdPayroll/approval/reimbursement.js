import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const reimbursementStoreManagements = create((set, get) => ({
    loading: false,
    error: null,
    error: null,
    reimbursementEmployeeList: null,
    
    getReimbursementEmployeeList: async (access_token, type, params) => {
        set({ loading: true, error: null });
        try {
            const url = `/td-payroll/approval/${type}`
            const {data: response} = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params
            });
            switch (type) {
                case 'reimbursement':
                    set({ reimbursementEmployeeList: response?.data || [] });
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

    modifyReimbursementEmployee: async (access_token, uuid, type, formData={}) => {
        set({ loading: true, error: null });
        try {
            const url = `/td-payroll/approval/${type}/${uuid}`
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

export default reimbursementStoreManagements;