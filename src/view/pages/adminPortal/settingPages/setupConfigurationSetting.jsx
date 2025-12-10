import { useState, useEffect } from "react";
import { OrganisationTopBarSettings, SetupConfigurationTopBarSettings } from "../../../../../data/subSidebar";
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
import Taxes from "./taxes";
import StatutoryComponents from "./statutoryComponents";
import PaySchedule from "./paySchedule";
import { checkPermission } from "../../../../../helper/globalHelper";
import authStoreManagements from "../../../../store/tdPayroll/auth";


function SetupConfigurationSetting() {
    const navigate = useNavigate();
    const { user } = authStoreManagements();
    const { fetchOrganizationSetting, designationList, loading, deleteOrganizationSetting, createOrganizationSetting, updateOrganizationSetting } = organizationStoreManagements();
    const [activeIdx, setActiveIdx] = useState(0);
    const [showSetupConfiguration, setShowSetupConfiguration] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);
    const [tempUuid, setTempUuid] = useState("");
    const [formData, setFormData] = useState({});
    const [modalDepartement, setModalDepartement] = useState(false);
    const [modalDesignation, setModalDesignation] = useState(false);

    const handleShowForm = (formFor, isEdit) => {
        if(!isEdit){
            setFormData({});
        }
        if(formFor == "Departments"){
            setModalDepartement(true);
        }else if(formFor == "Designations"){
            setModalDesignation(true);
        }else{
            setShowSetupConfiguration(formFor);
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
        return SetupConfigurationTopBarSettings.filter((setting) => {
            if (setting === "Tax Details") {
                return checkPermission(user, "Taxes", "Full Access");
            }
            if (setting === "Statutory Components") {
                return checkPermission(user, "Salary and Statutory Components", "Full Access");
            }
            if (setting === "Pay Schedule") {
                return checkPermission(user, "Pay Schedule", "Full Access");
            }
            return true;
        });
    };

    const filteredSettings = getFilteredSettings();

    // Validasi activeIdx setiap kali filteredSettings berubah
    useEffect(() => {
        if (filteredSettings && activeIdx >= filteredSettings.length) {
            setActiveIdx(0);
        }
    }, [filteredSettings, activeIdx]);

    return (
        <div className="w-full h-full flex flex-col items-start justify-start overflow-hidden pt-14">
            <HeaderReusable title={"Setup & Configuration"}  handleBack={() => navigate(-1)} />
            {!showSetupConfiguration ? (
                <div className="w-full flex-1 flex items-start justify-start bg-gray-td-200 px-2 flex-col min-h-0">
                    <div className="w-full flex-1 py-5 space-y-5 overflow-y-auto pe-2 min-h-0">
                        {/* Top bar buttons */}
                        <div className="w-full rounded-md bg-white p-3 flex items-center justify-between space-x-2 flex-shrink-0">
                            <div className="flex">
                                {filteredSettings && filteredSettings.length > 0 && filteredSettings.map((el, idx) => {
                                    const isActive = idx === activeIdx;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveIdx(idx)}
                                            className={`py-2 px-4 rounded-md transition-all ${
                                                isActive
                                                    ? "bg-blue-td-500 text-white shadow-md shadow-blue-td-300"
                                                    : "bg-white"
                                            }`}
                                        >
                                            {el}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        {/* Content area */}
                        <div className="w-full flex-1 rounded-md min-h-0">
                            {filteredSettings[activeIdx] === "Pay Schedule" && <PaySchedule />}
                            {filteredSettings[activeIdx] === "Tax Details" && <Taxes />}
                            {filteredSettings[activeIdx] === "Statutory Components" && <StatutoryComponents />}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {showSetupConfiguration == "organisation form" && (
                        <OrganisationProfileForm setShowFormOrganizationProfiles={setShowSetupConfiguration} showFormOrganizationProfiles={showSetupConfiguration} />
                    )}
                    {showSetupConfiguration == "Work Locations" && (
                        <WorkLocationForm setShowSetupConfiguration={setShowSetupConfiguration} showSetupConfiguration={showSetupConfiguration} data={formData} isUpdate={isUpdate} tempUuid={tempUuid} setTempUuid={setTempUuid} />
                    )}
                </>
            )}

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

export default SetupConfigurationSetting;