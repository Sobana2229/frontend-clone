import { create } from "zustand";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASEURL;

const reportStoreManagements = create((set, get) => ({
    loading: false,
    error: null,
    dataAttandancePayroll: null,
    dataAttandanceEmployee: {},
    dataPayrollLopReport: null,
    dataPaySummaryReport: null,
    dataDashboard: null,

    fetchDataReport: async (access_token, date, type, search, uuid) => {
        set({ loading: true, error: null });
        try {
            const body = {
                startDate: date?.startDate,
                endDate: date?.endDate,
                search,
            };
            const url = uuid ? `/td-payroll/report/${type}/${uuid}` : `/td-payroll/report/${type}`
            const { data: attendance } = await axios.post(
                `${baseUrl}${url}`, body, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                }
            );
            switch (type) {
                case "attandance-employe":
                    set({ dataAttandanceEmployee: attendance?.data ?? [] });
                    break;
                case "attandance":
                    set({ dataAttandancePayroll: attendance?.data ?? {} });
                    break;
                case "payroll-lop-report": {
                    const list = Array.isArray(attendance?.data?.data)
                        ? attendance.data.data
                        : Array.isArray(attendance?.data)
                            ? attendance.data
                            : [];
                    set({ dataPayrollLopReport: list });
                    break;
                }
                case "pay-summary": {
                    const list = Array.isArray(attendance?.data?.data)
                        ? attendance.data.data
                        : Array.isArray(attendance?.data)
                            ? attendance.data
                            : [];
                    set({ dataPaySummaryReport: list });
                    break;
                }
                case "dashboard": {
                    // BE response shape: { code, message, data: { success, data: {...dashboardData} } }
                    // Extract deepest data field to keep UI simple.
                    const dashboardPayload = attendance?.data?.data?.data
                        ?? attendance?.data?.data
                        ?? attendance?.data
                        ?? null;
                    set({ dataDashboard: dashboardPayload });
                    break;
                }
                default:
                    break;
            }
        } catch (error) {
            set({ error: error?.response?.data });
        } finally {
            set({ loading: false });
        }
    },
    
    deleteDataReport: async (access_token, type, uuid, isEmployeePortal) => {
        set({ loading: true, error: null });
        try {
            const { data: response } = await axios.delete(
                `${baseUrl}/td-payroll/report/${type}/${uuid}`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                    params: {isEmployeePortal}
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

export default reportStoreManagements;