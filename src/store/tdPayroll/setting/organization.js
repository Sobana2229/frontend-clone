import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const organizationStoreManagements = create((set, get) => ({
    loading: false,
    error: null,
    designationList: [],
    departementList: [],
    workLocationList: [],
    designationOptions: [],
    natureOfBusinessOptions: [],
    bankNameOptions: [],
    departementOptions: [],
    employmentTypeOptions: [],
    shiftOptions: [],
    employeeOptions: [],
    workLocationOptions: [],
    cityOptions: [],
    isEnabledWebPortal: false,
    isEnabledSelfInput: false,
    isEnabledCheckInOut: false,
    organizationDetail: null,
    
    organizationRegister: async (formData, access_token) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + "/td-payroll/organization", formData, {
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

    fetchoOganizationDetail: async (access_token) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + "/td-payroll/organization", {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });            
            set({ organizationDetail: response?.data || null });
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    updateOganizationDetail: async (formData, access_token, type) => {
        set({ loading: true, error: null });
        try {
            let url = type ? `/td-payroll/organization/${type}` : "/td-payroll/organization";
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
    
    fetchOrganizationSetting: async (type, access_token, isSetting=false, uuid, isView=false, params) => {
        set({ loading: true, error: null });
        try {
            const url = isSetting
                ? `/td-payroll/organization/setting/${type}`
                : `/td-payroll/organization/${type}${uuid ? `/${uuid}` : ""}`;
            const {data: response} = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                params
            });
            if(uuid) return response?.data;
            switch(type) {
                case 'employee-portal':
                    set({ isEnabledWebPortal: response?.data?.isEnable || false });
                    break;
                case 'check-in-out':
                    set({ isEnabledCheckInOut: response?.data?.isEnable || false });
                    break;
                case 'self-input':
                    set({ isEnabledSelfInput: response?.data?.isEnable || false });
                    break;
            }
            if(!isSetting){
                const typeMapping = {
                    designation: { key: "designationOptions", label: "New Designation" },
                    departement: { key: "departementOptions", label: "New Departement" },
                    "employee-type": { key: "employmentTypeOptions", label: "New Employee Type" },
                    shift: { key: "shiftOptions", label: "New Shift" },
                    employee: { key: "employeeOptions", label: "New Employee" },
                    "work-location": { key: "workLocationOptions", label: "New Work Location" },
                    city: { key: "cityOptions" },
                    "nature-of-business": { key: "natureOfBusinessOptions", label: "New Nature of Business" },
                    "bank-name": { key: "bankNameOptions", label: "New Bank Name" },
                };

                if (typeMapping[type]) {
                    const { key, label } = typeMapping[type];

                    let data = Array.isArray(response?.data) ? [...response.data] : [];

                    if (label) {
                        if (!isView) {
                            data.push({ value: 'create-new-data', label });
                        }
                    }

                    set({ [key]: data || [] });
                }
            } else {
                switch(type) {
                    case 'designation':
                        set({ designationList: response?.data || [] });
                        break;
                    case 'departement':
                        set({ departementList: response?.data || [] });
                        break;
                    case 'work-location':
                        set({ workLocationList: response?.data || [] });
                        break;
                    case 'employee-portal':
                        break;
                    default:
                        break;
                }
            }
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },
    
    createOrganizationSetting: async (formData, type, access_token) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + "/td-payroll/organization/" + type, formData, {
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

    updateOrganizationSetting: async (formData, type, access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.put(baseUrl + `/td-payroll/organization/${type}${uuid ? `/${uuid}` : ""}`, formData, {
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

    deleteOrganizationSetting: async (type, access_token, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.delete(baseUrl + `/td-payroll/organization/${type}${uuid ? `/${uuid}` : ""}`, {
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

    uploadFileOrganization: async (formData, access_token, type) => {
        set({ loading: true, error: null });
        try {
            const { data: response } = await axios.post(
                baseUrl + `/td-payroll/organization/upload-file/${type}`, 
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

    clearError: () => {
        set({ loading: false, error: null });
    }
}));

export default organizationStoreManagements;
