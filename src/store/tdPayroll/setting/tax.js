import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const taxStoreManagements = create((set, get) => ({
    loading: false,
    error: null,
    taxCompanyData: null,
    taxIndividualData: null,
    taxData: null,

    createTax: async (formData, access_token, type) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + `/td-payroll/tax/${type}`, formData, {
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

    fetchTax: async (access_token, type) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + `/td-payroll/tax/${type}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            if(type === "tax") {
                set({ taxData: response?.data ?? null });
            }else if(type === "company") {
                set({ taxCompanyData: response?.data ?? null });
            }else {
                set({ taxIndividualData: response?.data ?? null });
            }
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    updateTax: async (formData, access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.put(baseUrl + `/td-payroll/tax/${type}/${uuid}`, formData, {
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

    clearTaxData: async (type) => {
        set({ loading: true, error: null });
        try {
            if(type === "tax") {
                set({ taxData: null });
            }else if(type === "company") {
                set({ taxCompanyData: null });
            }else {
                set({ taxIndividualData: null });
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

export default taxStoreManagements;
