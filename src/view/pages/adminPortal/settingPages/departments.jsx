import { useLocation } from "react-router-dom";
import { dapartementDummy, dapartementHeaders } from "../../../../../data/dummy";
import HeaderReusable from "../../../component/setting/headerReusable";
import TableReusable from "../../../component/setting/tableReusable";
import { useEffect, useState } from "react";
import organizationStoreManagements from "../../../../store/tdPayroll/setting/organization";
import PaginationPages from "../../../component/paginations";
import { toast } from "react-toastify";
import UploadFormFile from "../../../component/uploadFormFile";
import { CustomToast } from "../../../component/customToast";

function Departments({handleShowFormDepartments, setIsUpdate, setTempUuid, setFormData, setShowUploadFile, showUploadFile}) {
    const {pathname} = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    const { fetchOrganizationSetting, departementList, loading, deleteOrganizationSetting } = organizationStoreManagements();

    useEffect(() => {
        if(departementList.length === 0){
          const access_token = localStorage.getItem("accessToken");
          fetchOrganizationSetting("departement", access_token, true);
        }
    }, [pathname]);

    const handleEdit = async (uuid) => {
        setIsUpdate(true);
        setTempUuid(uuid);
        const access_token = localStorage.getItem("accessToken");
        const response = await fetchOrganizationSetting("departement", access_token, false, uuid);
        if(response){ 
            setFormData({
                name: response?.name,
                departmentCode: response?.departmentCode,
                description: response?.description,
            });
            handleShowFormDepartments('Departments', true);
        }
    }

    const handleDelete = async (uuid) => {
        const access_token = localStorage.getItem("accessToken");
        const response = await deleteOrganizationSetting("departement", access_token, uuid);
        if(response){ 
            await fetchOrganizationSetting("departement", access_token, true);
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

    const handleShowUploadForm = () => {
        setShowUploadFile(!showUploadFile);
    }
    return (
        <div className="w-full h-[720px] flex-col flex items-start justify-start relative bg-white rounded-3xl overflow-hidden">
            {showUploadFile ? (
                <div className='w-full flex items-start justify-start p-5'>
                    <UploadFormFile handleShowForm={handleShowUploadForm} sampleFile={"departement"} />     
                </div>
            ) : (
                <>
                    <TableReusable dataHeaders={dapartementHeaders} dataTable={departementList?.list} tableFor="Departments" handleEdit={handleEdit} handleDelete={handleDelete} />
                    <div className="w-full absolute bottom-5 flex items-center justify-end">
                        <PaginationPages totalPages={departementList?.totalPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    </div>
                </>
            )}
        </div>
    );
}

export default Departments;
  