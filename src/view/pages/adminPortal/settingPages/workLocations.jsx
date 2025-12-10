import CardSetting from "../../../component/setting/cardSetting";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import organizationStoreManagements from "../../../../store/tdPayroll/setting/organization";
import Modal from "react-modal";
import { toast } from "react-toastify";
import UploadFormFile from "../../../component/uploadFormFile";
import SimpleModalMessage from "../../../component/simpleModalMessage";
import { modalConfirmDeleteWorkLocation } from "../../../../../data/dummy";
import { CustomToast } from "../../../component/customToast";

function WorkLocations({setIsUpdate, setTempUuid, handleShowFormWorkLocations, setFormData, tempUuid, setShowUploadFile, showUploadFile}) {
    const {pathname} = useLocation();
    const { fetchOrganizationSetting, workLocationList, loading, deleteOrganizationSetting, updateOrganizationSetting } = organizationStoreManagements();
    const [showModalConfirm, setShowModalConfirm] = useState(false);

    useEffect(() => {
        if(workLocationList.length === 0){
            const access_token = localStorage.getItem("accessToken");
            fetchOrganizationSetting("work-location", access_token, true);
        }
    }, [pathname]);

    const handleEdit = async (uuid) => {
        setIsUpdate(true);
        setTempUuid(uuid);
        const access_token = localStorage.getItem("accessToken");
        const response = await fetchOrganizationSetting("work-location", access_token, false, uuid);
        if(response){ 
            setFormData({
                workLocationName: response?.workLocationName,
                addressLine1: response?.addressLine1,
                addressLine2: response?.addressLine2,
                state: response?.stateId,
                city: response?.cityId,
                pincode: response?.postalCode,
                addressDetail: response?.addressDetail,
            });
            handleShowFormWorkLocations('Work Locations', true);
        }
    }

    const handleActionPopUp = async (uuid, isDelete) => {
        let response;
        const access_token = localStorage.getItem("accessToken");
        if(isDelete){
            response = await deleteOrganizationSetting("work-location", access_token, uuid);
        }else{
            const access_token = localStorage.getItem("accessToken");
            const workLocationData = await fetchOrganizationSetting("work-location", access_token, false, uuid);
            if(workLocationData){ 
                const body = {
                    workLocationName: workLocationData?.workLocationName,
                    addressDetail: workLocationData?.addressDetail,
                    addressLine1: workLocationData?.addressLine1,
                    addressLine2: workLocationData?.addressLine2,
                    state: workLocationData?.stateId,
                    city: workLocationData?.cityId,
                    pincode: workLocationData?.postalCode,
                    status: workLocationData?.status === "active" ? "inactive" : "active"
                }
                response = await updateOrganizationSetting(body, "work-location", access_token, uuid);
            }
        }
        if(response){ 
            await fetchOrganizationSetting("work-location", access_token, true);
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
            setShowModalConfirm(false);
        }
    };

    const handleShowUploadForm = () => {
        setShowUploadFile(!showUploadFile);
    }

    const handleShowModalConfirm = (uuid, type) => {
        if(type === "status"){
            handleActionPopUp(uuid, false);
        }else{
            setShowModalConfirm(!showModalConfirm);
            setTempUuid(uuid);
        }
    }
    return (
        <div className="w-full h-full flex-col flex items-start justify-start">
            {showUploadFile ? (
                <div className='w-full flex items-start justify-start p-5'>
                    <UploadFormFile handleShowForm={handleShowUploadForm} sampleFile={"work-location"} />     
                </div>
            ) : (
                <div className={`w-full`}>
                    <div className={`w-full grid grid-cols-4 items-start justify-start gap-5`}>
                        {workLocationList?.list?.map((el, idx) => {
                            return (
                                <CardSetting key={el?.uuid} data={el} cardFor="workLocations" handleEdit={handleEdit} handleActionPopUp={handleShowModalConfirm} />     
                            )
                        })}
                    </div>
                </div>
            )}

            <Modal
                isOpen={showModalConfirm}
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
                <SimpleModalMessage 
                    message={modalConfirmDeleteWorkLocation} 
                    showModal={showModalConfirm} 
                    setShowModal={setShowModalConfirm} 
                    handleConfirm={handleActionPopUp}
                    title={"Work Location"}
                    isDelete={true}
                    tempUuid={tempUuid}
                />
            </Modal>
        </div>
    );
}

export default WorkLocations;