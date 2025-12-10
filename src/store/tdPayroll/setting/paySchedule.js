import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const payScheduleStoreManagements = create((set, get) => ({
    loading: false,
    error: null,
    payScheduleData: null,

    createPaySchedule: async (formData, access_token) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + "/td-payroll/pay-schedule", formData, {
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

    fetchPaySchedule: async (access_token, params) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/pay-schedule", {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params
            });
            set({ payScheduleData: response?.data ?? null });
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    updatePaySchedule: async (formData, access_token) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.put(baseUrl + "/td-payroll/pay-schedule", formData, {
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

    deletePaySchedule: async (access_token) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.delete(baseUrl + "/td-payroll/pay-schedule", {
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

    clearData: () => {
        set({ payScheduleData: null });
    },

    clearError: () => {
        set({ loading: false, error: null });
    }
}));

export default payScheduleStoreManagements;
