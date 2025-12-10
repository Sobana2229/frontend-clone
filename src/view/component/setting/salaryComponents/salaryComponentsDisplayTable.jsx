import { useEffect, useState } from "react";
import { modalConfirmDeleteEarning, salaryComponentEarningHeaders, salaryComponentReimbursementHeaders, tabsSalaryComponents } from "../../../../../data/dummy";
import HeaderReusable from "../headerReusable";
import TableReusable from "../tableReusable";
import PaginationPages from "../../paginations";
import salaryComponentStoreManagements from "../../../../store/tdPayroll/setting/salaryComponent";
import { toast } from "react-toastify";
import SimpleModalMessage from "../../../component/simpleModalMessage";
import { modalConfirmDeleteWorkLocation } from "../../../../../data/dummy";
import { CustomToast } from "../../customToast";
import Modal from "react-modal";

function SalaryComponentsDisplayTable({setShowForm, showForm, indexTab}) {
    const { fetchSalaryComponent, listEarning, findOneComponent, clearData, deleteSalaryComponent, listReimbursement, changeStatusSalaryComponent, loading } = salaryComponentStoreManagements();
    const [activeTab, setActiveTab] = useState(tabsSalaryComponents[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [tempUuid, setTempUuid] = useState("");
    const [tempType, setTempType] = useState("");
    const [tempItem, setTempItem] = useState("");

    useEffect(() => {
        setActiveTab(tabsSalaryComponents[indexTab]);
    }, [indexTab]);

    useEffect(() => {
        if(!listEarning){
            const access_token = localStorage.getItem("accessToken");
            fetchSalaryComponent(access_token, "earning");
        }
    }, [listEarning]);

    useEffect(() => {
        if(!listReimbursement){
            const access_token = localStorage.getItem("accessToken");
            fetchSalaryComponent(access_token, "reimbursement");
        }
    }, [listReimbursement]);
    
    const handleEdit = async (uuid, item, type) => {
        // ✅ Edit button is always enabled - user can edit even if component is used
        const access_token = localStorage.getItem("accessToken");
        await findOneComponent(access_token, type, uuid);
        setShowForm(item);
    }

    const handleShowForm = async (item) => {
        clearData();
        setShowForm(item);
    }
    
    const handleDelete = async () => {
        const access_token = localStorage.getItem("accessToken");
        try {
            const response = await deleteSalaryComponent(access_token, tempType, tempUuid);
            if(response){ 
                await fetchSalaryComponent(access_token, tempType);
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
        } catch (error) {
            toast(<CustomToast message={error.message || "Failed to delete salary component"} status={"error"} />, {
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

    const handleChangeActiveStatus = async (uuid, item, type) => {
        const access_token = localStorage.getItem("accessToken");
        try {
            const response = await changeStatusSalaryComponent(access_token, type, uuid);
            if(response){ 
                await fetchSalaryComponent(access_token, type);
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
        } catch (error) {
            toast(<CustomToast message={error.message || "Failed to change status"} status={"error"} />, {
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

    const handleActionTable = (uuid, item, type, status) => {
        if(status == "delete"){
            setShowModalConfirm(!showModalConfirm);
            setTempUuid(uuid);
            setTempItem(item);
            setTempType(type);
        } else {
            handleEdit(uuid, item, type);
        }
    }
    return (
       <div className="w-full flex-1 flex items-start justify-start bg-white relative pb-10 rounded-2xl overflow-hidden">
            <TableReusable dataHeaders={
                activeTab === "Earnings" ? salaryComponentEarningHeaders : activeTab === "Reimbursements" ? salaryComponentReimbursementHeaders : []
            } dataTable={
                activeTab === "Earnings" ? listEarning?.list : activeTab === "Reimbursements" ? listReimbursement?.list : []
            } tableFor={activeTab} handleEdit={handleActionTable} handleDelete={handleActionTable} handleChangeActiveStatus={handleChangeActiveStatus} />
            <div className="w-full absolute bottom-5 flex items-center justify-end">
                <PaginationPages totalPages={
                    activeTab === "Earnings" ? listEarning?.totalPages : activeTab === "Reimbursements" ? listReimbursement?.totalPages : 0
                } currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </div>


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
                    message={modalConfirmDeleteEarning} 
                    showModal={showModalConfirm} 
                    setShowModal={setShowModalConfirm} 
                    handleConfirm={handleDelete}
                    title={"Earnings"}
                    isDelete={true}
                    tempUuid={tempUuid}
                />
            </Modal>
        </div>
    );
}

export default SalaryComponentsDisplayTable;
  