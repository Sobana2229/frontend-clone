import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const leaveAndAttendanceStoreManagements = create((set, get) => ({
    loading: false,
    error: null,
    workLocationOptions: [],
    holidayData: [],
    shiftData: [],
    attendanceData: [],
    attendancePolicyData: [],
    leaveTypesData: [],
    leaveTypesDataHoliday: [],
    attendanceBreakData: [],
    fetchWorkLocationOptions: async (access_token) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + `/td-payroll/leave-and-attendance/work-location`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
            set({ workLocationOptions: response?.data || [] });
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },

    createLeaveAndAttendance: async (formData, access_token, type) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.post(baseUrl + `/td-payroll/leave-and-attendance/${type}`, formData, {
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

    updateLeaveAndAttendance: async (formData, access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.put(baseUrl + `/td-payroll/leave-and-attendance/${type}/${uuid}`, formData, {
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

    deleteLeaveAndAttendance: async (access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.delete(baseUrl + `/td-payroll/leave-and-attendance/${type}/${uuid}`, {
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

    changeStatusLeaveAndAttendance: async (access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.patch(baseUrl + `/td-payroll/leave-and-attendance/${type}/${uuid}`, {}, {
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

    fetchLeaveAndAttendance: async (access_token, type, currentPage) => {
        const params = {
            limit: 10, 
            page: currentPage ?? 1,
        };
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + `/td-payroll/leave-and-attendance/${type}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params
            });  
            switch(type) {    
                case 'holiday':
                    set({ holidayData: response?.data|| [] });
                    break;
                case 'shift':
                    set({ shiftData: response?.data ?? null });
                    break;
                case 'attendance':
                    set({ attendanceData: response?.data ?? null });
                    break;
                case 'attendance-policy':
                    set({ attendancePolicyData: response?.data ?? null });
                    break;
                case 'leave-types':
                    set({ leaveTypesData: response?.data ?? null });
                    break;
                case 'attendance-break':
                    set({ attendanceBreakData: response?.data ?? null });
                    break;
                case 'leave-type-holiday':
                    set({ leaveTypesDataHoliday: response?.data ?? null });
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

    availableShifts: [],
    
    fetchAvailableShifts: async (access_token, entityType, excludeUuid = null) => {
        set({ loading: true, error: null, availableShifts: [] }); // Reset availableShifts before fetching
        try {
            const params = excludeUuid ? { excludeUuid } : {};
            const {data: response} = await axios.get(baseUrl + `/td-payroll/leave-and-attendance/available-shifts/${entityType}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
                params
            });
            set({ availableShifts: response?.data || [] });
            return response?.data || [];
        } catch (error) {
            set({ error: error?.response?.data, availableShifts: [] });
            return [];
        } finally {
            set({ loading: false });
        }
    },

    fetchOneLeaveAndAttendance: async (access_token, type, uuid) => {
        set({ loading: true, error: null });
        try {
            const {data: response} = await axios.get(baseUrl + `/td-payroll/leave-and-attendance/${type}/${uuid}`, {
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

    uploadFileLeaveAndAttendance: async (formData, access_token, type) => {
        set({ loading: true, error: null });
        try {
            const { data: response } = await axios.post(
                baseUrl + `/td-payroll/leave-and-attendance/upload-file/${type}`, 
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

export default leaveAndAttendanceStoreManagements;
