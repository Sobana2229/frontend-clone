import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const senderEmailPreferenceStoreManagements = create((set, get) => ({
    loading: false,
    error: null,
    dataSenderEmailPreference: null,

    createSenderEmailPreference: async (formData, access_token) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + `/td-payroll/sender-email-preference`, formData, {
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

    getOneSenderEmailPreference: async (access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + `/td-payroll/sender-email-preference/${uuid}`, {
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

    fetchSenderEmailPreference: async (access_token, params) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + `/td-payroll/sender-email-preference`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params
            });

            set({ dataSenderEmailPreference: response?.data ?? null });
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    checkValidationToken: async (access_token) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/invitation-sender-email", {
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

    updateSenderEmailPreference: async (formData, access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.put(baseUrl + `/td-payroll/sender-email-preference/${uuid}`, formData, {
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

    deleteSenderEmailPreference: async (access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.delete(baseUrl + `/td-payroll/sender-email-preference/${uuid}`, {
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

    resendInvitationSenderEmailPreference: async (access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + `/td-payroll/sender-email-preference/resend-invitation/${uuid}`, {
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

export default senderEmailPreferenceStoreManagements;
