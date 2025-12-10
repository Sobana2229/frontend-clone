import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const authStoreManagements = create((set, get) => ({
    loading: false,
    error: null,
    user: null,

    login: async (formData) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + "/td-payroll/auth", formData);
            localStorage.setItem("accessToken", response?.data?.accessToken);
            if(response?.data === "user found"){
                return response?.data;
            }
            if (response?.message?.toLowerCase().includes("success")) {
                return "success login";
            }
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    forgotPassword: async (formData, type) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + `/td-payroll/auth/forgot-password/${type}`, formData);
            return response?.data;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    logout: async (access_token) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + "/td-payroll/auth/logout", {}, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            if (response?.message?.toLowerCase().includes("success")) {
                localStorage.clear();
                return "success logout";
            }
            return "logout failed";
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    registerOtp: async (formData) => {
        set({ loading: true, error: null });
        try {
            const body = {
                ...formData,
                type: "user",
                state: formData.state ? Number(formData.state) : null,
                country: formData.country ? Number(formData.country) : null,
            }
            const {data: response} = await axios.post(baseUrl + "/td-payroll/auth/registration-otp", body);
            if (response?.message?.toLowerCase().includes("success")) {
                return "success send otp";
            }
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    register: async (formData) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + "/td-payroll/auth/register", formData);
            localStorage.setItem("accessToken", response?.data?.accessToken);
            if (response?.message?.toLowerCase().includes("success")) {
                return "success register";
            }
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    resendOtp: async (formData) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + "/td-payroll/auth/registration-resend-otp", formData);
            if (response?.message?.toLowerCase().includes("success")) {
                return "success resend OTP";
            }
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },
    
    fetchMe: async (access_token) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/auth/me", {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            set({ user: response?.data ?? null });
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

export default authStoreManagements;
