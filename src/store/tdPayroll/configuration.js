import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const configurationStoreManagements = create((set, get) => ({
    loading: false,
    error: null,
    phoneNumberData: [],
    stateData: [],
    industry: [],
    city: [],

    fetchPhoneNumberData: async () => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/countries");
            set({ phoneNumberData: response?.data?.list  ?? [] });
            return response?.data?.list ?? [];
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    fetchStateData: async (countryId) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/states/by-country/" + countryId);            
            set({ stateData: response?.data  ?? [] });
            return response?.data  ?? [];
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    fetchCityData: async (stateId) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/city/by-state/" + stateId);
            set({ city: response?.data  ?? [] });
            return response?.data ?? [];
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    fetchIndustryData: async () => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/industry");
            set({ industry: response?.data?.list  ?? [] });
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

export default configurationStoreManagements;