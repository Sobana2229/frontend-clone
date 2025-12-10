import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const statutoryComponentStoreManagements = create((set, get) => ({
    loading: false,
    error: null,
    statutoryComponentSpk: null,

    createStatutoryComponent: async (formData, access_token, type) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + `/td-payroll/statutory-component/enable/${type}`, formData, {
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

    fetchStatutoryComponent: async (access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const url = uuid ? `/td-payroll/statutory-component/${type}/${uuid}` : `/td-payroll/statutory-component/${type}`;
            const {data: response} = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            if(type === "spk") {
                set({ statutoryComponentSpk: response?.data ?? null });
            }
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    updateStatutoryComponent: async (formData, access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.put(baseUrl + `/td-payroll/statutory-component/${type}/${uuid}`, formData, {
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

export default statutoryComponentStoreManagements;
