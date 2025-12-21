// Updated OrganisationSetting component
import { useState, useEffect } from "react";
import { OrganisationTopBarSettings } from "../../../../../data/subSidebar";
import HeaderReusable from "../../../component/setting/headerReusable";
import OrganisationProfile from "./organisationProfile";
import OrganisationProfileForm from "../../../component/organisationProfiles/organisationProfileForm";
import WorkLocations from "./workLocations";
import { BoxArrowUp, Plus, PlusSquare } from "@phosphor-icons/react";
import WorkLocationForm from "../../../component/organisationProfiles/workLocationForm";
import Departments from "./departments";
import Modal from "react-modal";
import FormModal from "../../../component/formModal";
import Designations from "./designations";
import organizationStoreManagements from "../../../../store/tdPayroll/setting/organization";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CustomToast } from "../../../component/customToast";
import { checkPermission } from "../../../../../helper/globalHelper";
import authStoreManagements from "../../../../store/tdPayroll/auth";

function OrganisationSetting({ activeTabIndex = 0 }) {  // Accept activeTabIndex prop
    const navigate = useNavigate();
    const { fetchOrganizationSetting, designationList, loading, deleteOrganizationSetting, createOrganizationSetting, updateOrganizationSetting } = organizationStoreManagements();
    const [showFormOrganizationProfiles, setShowFormOrganizationProfiles] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);
    const [tempUuid, setTempUuid] = useState("");
    const [formData, setFormData] = useState({});
    const [modalDepartement, setModalDepartement] = useState(false);
    const [modalDesignation, setModalDesignation] = useState(false);
    const [showUploadFile, setShowUploadFile] = useState(false);
    const { user } = authStoreManagements();

    const handleShowForm = (formFor, isEdit) => {
        if(!isEdit){
            setFormData({});
        }
        if(formFor == "Departments"){
            setModalDepartement(true);
        }else if(formFor == "Designations"){
            setModalDesignation(true);
        }else{
            setShowFormOrganizationProfiles(formFor);
        }
    }

    const handleCreateDesignation = async (name) => {
        const formData = { name }
        const access_token = localStorage.getItem("accessToken");
        const response = await createOrganizationSetting(formData, "designation", access_token);
        if(response){
            await fetchOrganizationSetting("designation", access_token, true);
            toast(<CustomToast message={response} status={"success"} />, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                style: {
                    background: 'transparent',
                    boxShadow: 'none',
                    padding: 0
                }
            });
            setModalDesignation(false);
        }
    }

    const submitEditDesignation = async () => {
        setIsUpdate(false);
        setTempUuid("");
        const access_token = localStorage.getItem("accessToken");
        let response = await updateOrganizationSetting(formData, "designation", access_token, tempUuid);
        if(response){
            await fetchOrganizationSetting("designation", access_token, true);
            setFormData({
                name: "",
            });
            setModalDesignation(false);
            toast(<CustomToast message={response} status={"success"} />, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                style: {
                    background: 'transparent',
                    boxShadow: 'none',
                    padding: 0
                }
            });
        }
    }

    // Helper function untuk filter berdasarkan permission
    const getFilteredSettings = () => {
        return OrganisationTopBarSettings.filter((setting) => {
           
            if (setting === "Departments") {
                return checkPermission(user, "Department", "Full Access");
            }
            if (setting === "Designations") {
                return checkPermission(user, "Designation", "Full Access");
            }
            if (setting === "Work Locations") {
                return checkPermission(user, "Work Location", "Full Access");
            }
            return true;
        });
    };

    const filteredSettings = getFilteredSettings();

    const handleAddButtonClick = () => {
        const currentSetting = filteredSettings[activeTabIndex]; // Use activeTabIndex prop
        if(currentSetting == "Departments"){
            setFormData({});
            setModalDepartement(true);
        }else if(currentSetting == "Designations"){
            setFormData({});
            setModalDesignation(true);
        }else{
            handleShowForm(currentSetting);
        }
    };

    const rightActions = activeTabIndex !== 0 && filteredSettings[activeTabIndex] !== "Organisation Overview" && filteredSettings[activeTabIndex] !== "Organisation Profile" ? (
        <>
            <button 
                onClick={handleAddButtonClick} 
                className="py-2 px-4 rounded-md transition-all bg-blue-td-500 text-white shadow-md shadow-blue-td-300 flex items-center justify-center gap-2 capitalize whitespace-nowrap"
            >
                <PlusSquare className="text-lg flex-shrink-0" />
                <span className="whitespace-nowrap">add {filteredSettings[activeTabIndex]}</span>
            </button>
            <button 
                onClick={() => setShowUploadFile(true)} 
                className="p-2 rounded-md transition-all bg-blue-td-50 text-blue-td-600 shadow-md flex items-center justify-center flex-shrink-0"
            >
                <BoxArrowUp className="text-xl" /> 
            </button>
        </>
    ) : null;

    return (
        <div className="w-full h-full flex flex-col items-start justify-start overflow-hidden pt-14">
            <HeaderReusable 
                title={"Organisation Profiles"}  
                handleBack={() => navigate(-1)} 
                rightActions={rightActions}
            />
            <div className="w-full flex-1 flex items-start justify-start bg-gray-td-200 min-h-0" style={{ height: 'calc(100vh - 7.5rem)' }}>
                {/* Content area - NO MORE SIDEBAR */}
                <div className="flex-1 overflow-y-auto flex items-start justify-start px-2 py-2 min-h-0 h-full">
                    <div className="w-full rounded-md">
                        {showFormOrganizationProfiles == "organisation form" ? (
                            <OrganisationProfileForm setShowFormOrganizationProfiles={setShowFormOrganizationProfiles} showFormOrganizationProfiles={showFormOrganizationProfiles} />
                        ) : showFormOrganizationProfiles == "Work Locations" ? (
                            <WorkLocationForm setShowFormOrganizationProfiles={setShowFormOrganizationProfiles} showFormOrganizationProfiles={showFormOrganizationProfiles} data={formData} isUpdate={isUpdate} tempUuid={tempUuid} setTempUuid={setTempUuid} />
                        ) : (
                            <>
                                {(filteredSettings[activeTabIndex] === "Organisation Overview" || filteredSettings[activeTabIndex] === "Organisation Profile") && (
                                    <OrganisationProfile handleShowForm={handleShowForm} />
                                )}
                                {filteredSettings[activeTabIndex] === "Work Locations" && (
                                    <WorkLocations 
                                        handleShowFormWorkLocations={handleShowForm} 
                                        setIsUpdate={setIsUpdate} 
                                        setTempUuid={setTempUuid} 
                                        setFormData={setFormData} 
                                        tempUuid={tempUuid} 
                                        setShowUploadFile={setShowUploadFile} 
                                        showUploadFile={showUploadFile} 
                                    />
                                )}
                                {filteredSettings[activeTabIndex] === "Departments" && (
                                    <Departments 
                                        handleShowFormDepartments={handleShowForm} 
                                        setIsUpdate={setIsUpdate} 
                                        setTempUuid={setTempUuid} 
                                        setFormData={setFormData} 
                                        setShowUploadFile={setShowUploadFile} 
                                        showUploadFile={showUploadFile} 
                                    />
                                )}
                                {filteredSettings[activeTabIndex] === "Designations" && (
                                    <Designations 
                                        handleShowFormDepartments={handleShowForm} 
                                        setIsUpdate={setIsUpdate} 
                                        setTempUuid={setTempUuid} 
                                        setFormData={setFormData} 
                                        setShowUploadFile={setShowUploadFile} 
                                        showUploadFile={showUploadFile} 
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalDepartement}
                contentLabel="Full Screen Modal"
                ariaHideApp={false}
                style={{
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1000,
                },
                content: {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: "none",
                    backgroundColor: "transparent",
                    padding: 0,
                    margin: 0,
                    overflow: "hidden",
                },
                }}>
                <FormModal
                    setShowModal={setModalDepartement} 
                    titleForm={"Departement"}
                    isSetting={true}
                    formFor={"departement"}
                    data={formData}
                    isUpdate={isUpdate}
                    tempUuid={tempUuid}
                    setIsUpdate={setIsUpdate}
                    setTempUuid={setTempUuid}
                />
            </Modal>

            <Modal
                isOpen={modalDesignation}
                contentLabel="Full Screen Modal"
                ariaHideApp={false}
                style={{
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1000,
                },
                content: {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: "none",
                    backgroundColor: "transparent",
                    padding: 0,
                    margin: 0,
                    overflow: "hidden",
                },
                }}>
                <FormModal
                    setShowModal={setModalDesignation} 
                    submit={handleCreateDesignation}
                    submitEdit={submitEditDesignation}
                    isSingle={true}
                    label={"Designation"}
                    titleForm={"Designation"}
                    isUpdate={isUpdate}
                    tempUuid={tempUuid}
                    data={formData}
                    setData={setFormData}
                    setIsUpdate={setIsUpdate}
                    setTempUuid={setTempUuid}
                />
            </Modal>
        </div>
    );
}

export default OrganisationSetting;