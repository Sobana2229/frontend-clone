import { create } from "zustand";

const subSidebarStoreManagements = create((set, get) => ({
    activeTab: "",
    showSubSidebar: true,
    showX: false,
    showAddButton: false,
    showThreeDots: false,
    showHeaderDropDown: false,
    forceHeaderLabel: "",
    headerDropDownProps: {},
    addButtonFunction: null,
    cancelButtonFunction: null,

    setSubSidebarState: async (state) => {
        set({ ...state });
    },

    resetSubSidebarState: async () => {
        set({
            activeTab: "",
            showSubSidebar: true,
            showX: false,
            showAddButton: false,
            showThreeDots: false,
            showHeaderDropDown: false,
            forceHeaderLabel: "",
            headerDropDownProps: {},
            addButtonFunction: null,
            cancelButtonFunction: null,
        });
    },
}));

export default subSidebarStoreManagements;