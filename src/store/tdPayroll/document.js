import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const documentStoreManagements = create((set, get) => ({
    loading: false,
    error: null,
    folderListOrg: null,

    createFolder: async (formData, access_token, type="org") => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + "/td-payroll/document/" + type, formData, {
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

    getFolderList: async (access_token, type="org") => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/document/" + type, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            
            if (type === 'org') {
                set({ folderListOrg: response?.data || [] });
            }
            
            return response?.data;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    deleteFolder: async (access_token, type="org", uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.delete(baseUrl + `/td-payroll/document/${type}/${uuid}`, {
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

    updateFolder: async (formData, access_token, type="org", uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.put(baseUrl + `/td-payroll/document/${type}/${uuid}`, formData, {
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

    uploadDocument: async (formData, access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(
                `${baseUrl}/td-payroll/document/${type}/${uuid}/upload`, 
                formData, 
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                }
            );
            return response?.data;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    getDocumentList: async (access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(
                `${baseUrl}/td-payroll/document/${type}/${uuid}/files`, 
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                }
            );
            return response?.data;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    getAllDocuments: async (access_token, type) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(
                `${baseUrl}/td-payroll/document/${type}/all-files`, 
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                }
            );
            return response?.data;
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    deleteDocument: async (access_token, type, folderUuid, fileName) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.delete(
                `${baseUrl}/td-payroll/document/${type}/${folderUuid}/files/${fileName}`, 
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                }
            );
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

export default documentStoreManagements;