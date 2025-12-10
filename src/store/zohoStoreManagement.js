import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const zohoStore = create((set, get) => ({
  loading: false,
  error: null,
  dataEmployees: [],
  dataLeavesPayroll: [],
  dataTimesheetPayroll: [],
  dataAttandancePayroll: [],
  dataEmployeeById: null,
  dataOrganisationProfile: null,
  dataWorkLocation: null,
  dataCompanyStructure: null,
  dataUserAndRoles: null,
  dataLossOfPayDetails: [],
  logoOrganizationId: null,

  refreshTokenZoho: async () => {
    console.log("start refresh token", new Date());
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(baseUrl + "/zoho/refresh-token");
      const token = data.access_token;
      localStorage.setItem("zoho_access_token", token);
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchZohoEmployees: async (access_token, isAsync=false, search="") => {
    set({ loading: true, error: null });
    if(!search){
      set({ loading: true, error: null });
    }
    try {
      const { data: response } = await axios.post(
        baseUrl + "/zoho/employees",
        { search },
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          },
        }
      );     
      set({ dataEmployees: response ?? [] });
    } catch (error) {
      if(error?.status === 401 && !isAsync){
        await get().refreshTokenZoho();
        window.location.reload();
      }
      set({ error: error?.response?.data?.data?.message, dataEmployees: [] });
    } finally {
      if(!search){
        set({ loading: false });
      }set({ loading: false });
    }
  },

  fetchZohoLeavesPayroll: async (access_token, date) => {
    set({ loading: true, error: null });
    try {
      const {data: response} = await axios.get(baseUrl + "/zoho/zoho-leaves", {
        headers: { Authorization: `Zoho-oauthtoken ${access_token}` },
        params: date
      });
      set({ dataLeavesPayroll: response ?? [] });
    } catch (error) {
      if(error?.status === 401){
        await get().refreshTokenZoho();
        window.location.reload();
      }
      set({ error: error?.response?.data?.data?.message, dataLeavesPayroll: [] });
    } finally {
      set({ loading: false });
    }
  },

  fetchZohoTimesheetPayroll: async (access_token, date, search) => {
    set({ loading: true, error: null });
    try {
      const body = {
        startDate: date?.startDate,
        endDate: date?.endDate,
        search,
      };
      const {data: timesheet} = await axios.post(
        baseUrl + "/zoho/zoho-timesheet", 
        body,
        {
          headers: { Authorization: `Zoho-oauthtoken ${access_token}` 
        },
      });
      set({ dataTimesheetPayroll: timesheet?.response?.result ?? [] });
    } catch (error) {
      if(error?.status === 401){
        await get().refreshTokenZoho();
        window.location.reload();
      }
      set({ error: error?.response?.data?.data?.message, dataTimesheetPayroll: [] });
    } finally {
      set({ loading: false });
    }
  },

  fetchZohoAttandancePayroll: async (access_token, date, search) => {
    set({ loading: true, error: null });
    try {
      const body = {
        startDate: date?.startDate,
        endDate: date?.endDate,
        search,
      };
      const { data: attendance } = await axios.post(
        `${baseUrl}/zoho/zoho-attandance`,
        body,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          },
        }
      );
      set({ dataAttandancePayroll: attendance ?? [] });
    } catch (error) {
      if(error?.status === 401){
        await get().refreshTokenZoho();
        window.location.reload();
      }
      set({ error: error?.response?.data?.data?.message, dataAttandancePayroll: [] });
    } finally {
      set({ loading: false });
    }
  },

  fetchZohoOrganisationProfile: async (access_token) => {
    set({ loading: true, error: null });
    try {
      const {data: organisationProfile} = await axios.get(baseUrl + "/zoho/zoho-organization", {
        headers: { Authorization: `Zoho-oauthtoken ${access_token}` }
      });
      set({ dataOrganisationProfile: organisationProfile?.data ?? null });
      let workLocation = {};
      workLocation.address1 = organisationProfile?.data?.Address?.AddressLine1;
      workLocation.address2 = organisationProfile?.data?.Address?.AddressLine2;
      workLocation.city = organisationProfile?.data?.Address?.City;
      workLocation.Country = organisationProfile?.data?.Address?.Country;
      workLocation.state = organisationProfile?.data?.Address?.State;
      workLocation.pincode = organisationProfile?.data?.Address["PostalCode"];
      set({ dataWorkLocation: workLocation ?? null });
      set({ logoOrganizationId: organisationProfile?.logoId ?? null });
    } catch (error) {
      if(error?.status === 401){
        await get().refreshTokenZoho();
        window.location.reload();
      }
      set({ error: error?.response?.data?.data?.message, dataOrganisationProfile: null, dataWorkLocation: null });
    } finally {
      set({ loading: false });
    }
  },

  fetchZohoCompanyStructure: async (access_token) => {
    set({ loading: true, error: null });
    try {
      const {data: companyStructure} = await axios.get(baseUrl + "/zoho/zoho-company-structure", {
        headers: { Authorization: `Zoho-oauthtoken ${access_token}` },
      });
      set({ dataCompanyStructure: companyStructure ?? null });
    } catch (error) {
      if(error?.status === 401){
        await get().refreshTokenZoho();
        window.location.reload();
      }
      set({ error: error?.response?.data?.data?.message, dataCompanyStructure: null });
    } finally {
      set({ loading: false });
    }
  },

  fetchZohoUserAndRoles: async (access_token) => {
    set({ loading: true, error: null });
    try {
      const {data: userRoles} = await axios.get(baseUrl + "/zoho/zoho-user-role", {
        headers: { Authorization: `Zoho-oauthtoken ${access_token}` },
      });
      set({ dataUserAndRoles: userRoles ?? null });
    } catch (error) {
      if(error?.status === 401){
        await get().refreshTokenZoho();
        window.location.reload();
      }
      set({ error: error?.response?.data?.data?.message, dataUserAndRoles: null });
    } finally {
      set({ loading: false });
    }
  },

  uploadLogoOrganization: async (access_token, body) => {
    set({ loading: true, error: null });
    try {
      const {data: response} = await axios.post(baseUrl + "/zoho/save-logo-organization", body, {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      if(error?.status === 401){
        await get().refreshTokenZoho();
        window.location.reload();
      }
      set({ error: error?.response?.data?.message, dataUserAndRoles: null });
    } finally {
      set({ loading: false });
    }
  },

  asyncDataZohoApi: async (accessToken) => {
    await get().fetchZohoEmployees(accessToken, true);
  },

  fetchZohoEmployeeById: async (access_token, id) => {
    set({ loading: true, error: null });
    try {
      const {data: response} = await axios.get(baseUrl + "/zoho/employees/" + id, {
        headers: { Authorization: `Zoho-oauthtoken ${access_token}` },
      });
      set({ dataEmployeeById: response ?? null });
    } catch (error) {
      if(error?.status === 401 && !isAsync){
        await get().refreshTokenZoho();
        window.location.reload();
      }
      set({ error: error?.response?.data?.data?.message, dataEmployeeById: null });
    } finally {
      set({ loading: false });
    }
  },

  fetchLossOfPayDetails: async (access_token, date) => {
    set({ loading: true, error: null });
    try {
      const body = {
        startDate: date?.startDate,
        endDate: date?.endDate,
      };
      const { data: response } = await axios.post(
        baseUrl + "/zoho/zoho-los-leaves",
        body,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${access_token}`,
          },
        }
      );     
      set({ dataLossOfPayDetails: response ?? [] });
    } catch (error) {
      if(error?.status === 401 && !isAsync){
        await get().refreshTokenZoho();
        window.location.reload();
      }
      set({ error: error?.response?.data?.data?.message, dataEmployees: [] });
    } finally {
      set({ loading: false });
    }
  },
}));

export default zohoStore;
