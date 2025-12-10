import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const userAndRoleStoreManagements = create((set, get) => ({
    loading: false,
    error: null,
    permissionData: null,
    roleList: null,
    roleData: null,
    userList: null,

    fetchData: async (access_token, type, params) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + `/td-payroll/user-and-role/${type}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params
            });
            switch (type) {
                case "permission":
                        set({ permissionData: response?.data });
                    break;
                case "role":
                    if (params && Object.keys(params).length > 0) {
                        set({ roleList: response?.data });
                    } else {
                        set({ roleData: response?.data });
                    }
                    break;
                case "user":
                        set({ userList: response?.data });
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
    
    getById: async (access_token, uuid, type) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + `/td-payroll/user-and-role/${type}/${uuid}`, {
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

    createData: async (formData, access_token, type) => {
        set({ loading: true, error: null });
        try {            
            const {data: response} = await axios.post(baseUrl + `/td-payroll/user-and-role/${type}`, formData, {
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

    updateData: async (formData, access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {            
            const {data: response} = await axios.put(baseUrl + `/td-payroll/user-and-role/${type}/${uuid}`, formData, {
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

    deleteData: async (access_token, uuid, type) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.delete(baseUrl + `/td-payroll/user-and-role/${type}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params: {
                    uuid
                }
            });
           return response?.data;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    checkValidationToken: async (access_token) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/invitation-validation-user", {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });
            return response;
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

export default userAndRoleStoreManagements;
