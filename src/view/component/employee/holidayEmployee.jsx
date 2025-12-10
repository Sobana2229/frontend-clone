import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import employeePortalStoreManagements from '../../../store/tdPayroll/employeePortal';
import TableReusable from '../setting/tableReusable';
import PaginationPages from '../paginations';
import { leaveEmployeeHeaders } from '../../../../data/dummy';
import { toast } from "react-toastify";
import { CustomToast } from '../customToast';
import authStoreManagements from '../../../store/tdPayroll/auth';
import ReuseableInput from '../reuseableInput';

const HolidayEmployee = ({employeeUuid, fetchType}) => {
    const { createLeave, getLeave, dataEmployeeLeave, updateLeave, getLeaveLimit, dataEmployeeLeaveList, getLeaveList, getOneLeave, dataEmployeeLeaveLimit } = employeePortalStoreManagements();
    const { user } = authStoreManagements();
    const [showForm, setShowForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingUuid, setEditingUuid] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [tempUuid, setTempUuid] = useState(null);
    const [formData, setFormData] = useState({
        dateFrom: '',
        dateTo: '',
        reason: '',
        leaveUuid: null
    });

    useEffect(() => {
        if(!dataEmployeeLeave){
            const access_token = localStorage.getItem("accessToken");
            getLeave(access_token, "options")
        }
    }, [employeeUuid, fetchType]);

    useEffect(() => {
        // if(!dataEmployeeLeaveList){
            const access_token = localStorage.getItem("accessToken");
            const params = {
                    limit: 10, 
                    page: currentPage,
                };
            getLeaveList(access_token, params, fetchType)
        // }
    }, [employeeUuid, fetchType]);

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        if(name === "leaveUuid"){
            const access_token = localStorage.getItem("accessToken");
            const params = {
                tempUuid
            }
            await getLeaveLimit(access_token, value, params)
        }
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = async (uuid, type) => {
        const access_token = localStorage.getItem("accessToken");
        let response;
        if (type !== "edit") {
            const body = {
                status: type
            }
            response = await updateLeave(access_token, body, uuid);
        } else {
            setShowForm(true);
            const leaveData = await getOneLeave(access_token, uuid)
            if (leaveData) {
                setFormData({
                    dateFrom: dayjs(leaveData.dateFrom).format('YYYY-MM-DD'),
                    dateTo: dayjs(leaveData.dateTo).format('YYYY-MM-DD'),
                    reason: leaveData.reason || '',
                    leaveUuid: leaveData.leaveUuid || null
                });
                setEditingUuid(uuid);
                setIsEditMode(true);
                setTempUuid(leaveData?.employeeUuid || null);
            }
            return;
        }  
        if(response){
            const params = {
                limit: 10, 
                page: currentPage,
            };
            await getLeaveList(access_token, params, fetchType)
            const successMessage = isEditMode ? 'Regulation updated successfully' : 'Regulation created successfully';
            toast(<CustomToast message={response || successMessage} status="success" />, {
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
            resetForm();
        }
    };

    const handleSubmit = async () => {
        const access_token = localStorage.getItem("accessToken");
        const targetData = fetchType ? fetchType : 
                            employeeUuid ? "admin-portal" : 
                            "employee-portal";
        let response;
        if(isEditMode && editingUuid){
            response = await updateLeave(access_token, formData, editingUuid);
        }else{
            response = await createLeave(access_token, formData, targetData, employeeUuid);
        }
        if(response){
            const params = {
                limit: 10, 
                page: currentPage,
            };
            await getLeaveList(access_token, params, fetchType)
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
            resetForm();
        }
    };

    const resetForm = () => {
        setFormData({
            dateFrom: '',
            dateTo: '',
            reason: '',
            leaveUuid: null
        });
        setShowForm(false);
        setIsEditMode(false);
        setEditingUuid(null);
    };

    return (
        <div className="w-full h-full flex items-start justify-start p-4 relative overflow-x-hidden">
            <div className=" rounded-lg shadow-lg w-full">
                <div className="flex items-center justify-between p-6 border-b">
                    <h1 className="text-xl font-semibold">
                        Leaves
                        {isEditMode && <span className="text-sm text-blue-600 ml-2">(Editing)</span>}
                    </h1>
                    <button 
                        onClick={() => {
                            if (showForm) {
                                resetForm();
                            } else {
                                setShowForm(true);
                                setIsEditMode(false);
                                setEditingUuid(null);
                            }
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        {showForm ? 'Cancel' : 'Add Leaves'}
                    </button>
                </div>

                <div className="h-fit w-full overflow-y-auto relative">
                    {!showForm && (
                        <>
                            <TableReusable 
                                dataHeaders={leaveEmployeeHeaders} 
                                dataTable={dataEmployeeLeaveList?.list} 
                                tableFor="employeePortalLeave" 
                                handleEdit={handleEdit} 
                                role={user?.role?.name} 
                            />
                            <div className="w-full absolute bottom-5 flex items-center justify-end">
                                <PaginationPages 
                                    totalPages={dataEmployeeLeaveList?.totalPages} 
                                    currentPage={currentPage} 
                                    setCurrentPage={setCurrentPage} 
                                />
                            </div>
                        </>
                    )}
                    
                    {showForm && (
                        <div className="max-w-full p-6">
                            <div className="space-y-6">
                                <div className="w-1/4">
                                    <ReuseableInput
                                        id="leaveUuid"
                                        name="leaveUuid"
                                        value={formData.leaveUuid}
                                        onChange={handleInputChange}
                                        as="select"
                                        isFocusRing={false}
                                        isBorderLeft={true}
                                        borderColor={"red-td-500"}
                                    >
                                        <option value="" hidden>Select</option>
                                        {dataEmployeeLeave?.map((el, idx) => (
                                            <option key={idx} value={el?.uuid} className="capitalize">
                                                {el?.leaveName}
                                            </option>
                                        ))}
                                    </ReuseableInput>
                                </div>
                                {dataEmployeeLeaveLimit && (
                                    <div className="w-full flex items-center justify-start space-x-5">
                                        <h1>remaining Days: {dataEmployeeLeaveLimit?.balance?.remainingDays}</h1>
                                        <h1>used Days: {dataEmployeeLeaveLimit?.balance?.usedDays}</h1>
                                        <h1>total: {dataEmployeeLeaveLimit?.balance?.allocatedDays}</h1>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date Range <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-4 max-w-md">
                                        <input
                                            type="date"
                                            value={formData.dateFrom}
                                            name="dateFrom"
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="date"
                                            value={formData.dateTo}
                                            name="dateTo"
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reason <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.reason}
                                        name="reason"
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter reason for regulation..."
                                    />
                                </div>

                                <div className="flex justify-start space-x-4 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!formData.dateFrom || !formData.dateTo || !formData.reason.trim()}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        {isEditMode ? 'Update Regulation' : 'Submit Regulation'}
                                    </button>
                                    <button
                                        onClick={resetForm}
                                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HolidayEmployee;