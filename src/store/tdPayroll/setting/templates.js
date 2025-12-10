import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const settingTemplateStoreManagements = create((set, get) => ({
  loading: false,
  error: null,
  success: null,
  imgTamplateSetting: null,
  availableDetailTamplate: null,

  uploadImgTamplateSetting: async (formData) => {
    set({ loading: true, error: null });
    try {
      const {data: response} = await axios.put(baseUrl + "/td-payroll/setting-templates/upload-template-setting", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Zoho-oauthtoken ${access_token}`
        },
      });
      
      set({ imgTamplateSetting: response?.filePath ?? null });
    } catch (error) {
      set({ error: error?.response?.data });
    } finally {
      set({ loading: false });
    }
  },

  fetchImgTamplateSetting: async (formData) => {
    set({ loading: true, error: null });
    try {
      const {data: response} = await axios.get(baseUrl + "/td-payroll/setting-templates/template-thumbnail", {
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Zoho-oauthtoken ${access_token}`
        },
      });
      
      set({ imgTamplateSetting: response?.filePath ?? null });
    } catch (error) {
      set({ error: error?.response?.data });
    } finally {
      set({ loading: false });
    }
  },

  fetchAvailableDetailTamplate: async (name) => {
    set({ loading: true, error: null });
    try {
      const {data: response} = await axios.get(baseUrl + "/td-payroll/setting-templates/available-detail-template", {
        params: {
          name
        },
        headers: {
          // Authorization: `Zoho-oauthtoken ${access_token}`
        },
      });
      
      set({ availableDetailTamplate: response?.data ?? null });
    } catch (error) {
      set({ error: error?.response?.data });
    } finally {
      set({ loading: false });
    }
  },

  createAvailableDetailTamplate: async (body) => {
    set({ loading: true, error: null });
    try {
      const {data: response} = await axios.put(`${baseUrl}/td-payroll/setting-templates/available-detail-template`, body);
      set({ success: response?.data?.message ?? null });
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

export default settingTemplateStoreManagements;
