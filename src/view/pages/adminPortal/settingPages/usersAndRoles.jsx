import { useEffect, useState } from "react";
import { RoleSettingHeaders, tabsUserAndRoles, userSettingHeaders } from "../../../../../data/dummy";
import HeaderReusable from "../../../component/setting/headerReusable";
import TableReusable from "../../../component/setting/tableReusable";
import userAndRoleStoreManagements from "../../../../store/tdPayroll/setting/userAndRole";
import PaginationPages from "../../../component/paginations";
import { toast } from "react-toastify";
import { CustomToast } from "../../../component/customToast";
import RoleForm from "../../../component/setting/userAndRoles/roleForm";
import UserForm from "../../../component/setting/userAndRoles/userForm";
import { checkPermission } from "../../../../../helper/globalHelper";
import authStoreManagements from "../../../../store/tdPayroll/auth";

function UsersAndRoles() {
    const { fetchData, roleList, loading, deleteData, getById, updateData, userList } = userAndRoleStoreManagements();
    const [activeTab, setActiveTab] = useState(tabsUserAndRoles[0]);
    const [showForm, setShowForm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [tempData, setTempData] = useState({});
    const [isUpdate, setIsUpdate] = useState(false);
    const { user } = authStoreManagements();

    useEffect(() => {
        if (!roleList) {
            const params = {
                limit: 10, 
                page: currentPage,
            };
            const access_token = localStorage.getItem("accessToken");
            fetchData(access_token, "role", params);
        }
        if (!userList) {
            const params = {
                limit: 10, 
                page: currentPage,
            };
            const access_token = localStorage.getItem("accessToken");
            fetchData(access_token, "user", params);
        }
    }, []); // only run once

    const handleCancel = () => {
        setShowForm(false);
    };

    const handleShowForm = () => {
        setShowForm(true);
        setTempData({});
        setIsUpdate(false);
    };

    const handleEdit = async (uuid, isStatus) => {
        const access_token = localStorage.getItem("accessToken");
        if(isStatus){
            const response = await updateData({}, access_token, activeTab === "Users" ? "user" : "role", uuid);
            if(response){
                const params = {
                    limit: 10, 
                    page: 1,
                };
                await fetchData(access_token, activeTab === "Users" ? "user" : "role", params);
                toast(<CustomToast message={response} status="success" />, {
                    autoClose: 3000,
                    closeButton: false,
                    hideProgressBar: true,
                    position: "top-center",
                    style: {
                        background: "transparent",
                        boxShadow: "none",
                        padding: 0,
                    },
                });
            }
        }else{
            const response = await getById(access_token, uuid, activeTab === "Users" ? "user" : "role");
            if(response){
                setTempData(response);
                setIsUpdate(true);
                setShowForm(true);
            }
        }
    };

    const handleDelete = async(uuid) => {
        const access_token = localStorage.getItem("accessToken");
        const response = await deleteData(access_token, uuid, activeTab === "Users" ? "user" : "role");
        if(response){
            const params = {
                limit: 10, 
                page: 1,
            };
            await fetchData(access_token, activeTab === "Users" ? "user" : "role", params);
            toast(<CustomToast message={response} status="success" />, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                style: {
                    background: "transparent",
                    boxShadow: "none",
                    padding: 0,
                },
            });
        }
    };

    return (
        <>
            {!showForm ? (
                <div className="w-full h-full flex-col flex items-start justify-start">
                    <HeaderReusable title="Users & Roles" tabs={tabsUserAndRoles} activeTab={activeTab} setActiveTab={setActiveTab} needTabs={true} isAddData={true} addDataTitle={`Add ${activeTab}`} handleShowModal={handleShowForm} />
                    {activeTab === "Users" ? (
                        checkPermission(user, "Manage Users", "Full Access") ? (
                            <div className="w-full flex-1 flex items-start justify-start bg-white relative pb-10 rounded-2xl overflow-hidden">
                                <TableReusable dataHeaders={userSettingHeaders} dataTable={userList?.list} tableFor="UserSettings" handleEdit={handleEdit} handleDelete={handleDelete} />
                                <div className="w-full absolute bottom-5 flex items-center justify-end">
                                    <PaginationPages 
                                        totalPages={userList?.totalPage} 
                                        currentPage={currentPage} 
                                        setCurrentPage={setCurrentPage} 
                                    />
                                </div>
                            </div>
                        ) : (
                            <p>No data available</p>
                        )
                    ) : (
                        <div className="w-full flex-1 flex items-start justify-start bg-white relative pb-10 rounded-2xl overflow-hidden">
                            <TableReusable dataHeaders={RoleSettingHeaders} dataTable={roleList?.list} tableFor="RoleSettings" handleEdit={handleEdit} handleDelete={handleDelete} />
                            <div className="w-full absolute bottom-5 flex items-center justify-end">
                                <PaginationPages 
                                    totalPages={roleList?.totalPage} 
                                    currentPage={currentPage} 
                                    setCurrentPage={setCurrentPage} 
                                />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="w-full h-full flex-col flex items-start justify-start">
                    {activeTab === "Users" ? (
                        <UserForm handleCancel={handleCancel} isUpdate={isUpdate} tempData={tempData} />
                    ) : (
                        <RoleForm handleCancel={handleCancel} isUpdate={isUpdate} tempData={tempData} />
                    )}
                </div>
            )}
        </>
    );
}

export default UsersAndRoles;
  