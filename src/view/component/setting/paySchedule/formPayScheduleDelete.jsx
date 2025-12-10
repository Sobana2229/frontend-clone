import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ButtonReusable from "../../buttonReusable";
import { NotePencil } from "@phosphor-icons/react";
import payScheduleStoreManagements from "../../../../store/tdPayroll/setting/paySchedule";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CustomToast } from "../../customToast";
dayjs.extend(customParseFormat);
function FormPayScheduleDelete({setShowModal, setShowForm}) {
    const { deletePaySchedule, clearData, payScheduleData, loading } = payScheduleStoreManagements();

    const handleDelete = async () => {
        const access_token = localStorage.getItem("accessToken");
        const response = await deletePaySchedule(access_token);
        if(response){
            clearData();
            toast(<CustomToast message={"success delete pay schedule"} status="success" />, {
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
            setShowModal(false);
            setShowForm(false);
        }
    }
    return (
        <div className="w-full h-full flex-col flex items-start justify-start relative">
            {/* Header */}
            <div className="flex items-center justify-between w-full p-4 border-b">
                <div className="flex items-center justify-start space-x-2 text-gray-td-600">
                    <NotePencil className="text-xl" />
                    <h2 className="text-lg font-normal">Change Pay Day</h2>
                </div>
                <button 
                onClick={() => setShowModal(false)}
                className="h-5 w-5 -mt-1 border-2 border-blue-td-600 text-blue-td-600 rounded-full font-bold text-xs flex items-center justify-center"
                >
                    ✕
                </button>
            </div>
            <div className="w-full p-5">
                <div className="w-full space-y-5">
                    {/* Warning Message */}
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="text-sm text-gray-td-500">
                            You have a pay run in the draft status. Delete the draft pay run to change the pay day.
                        </div>
                    </div>

                    {/* Pay Run Table */}
                    <div className="bg-[#CFE5FF] rounded-lg overflow-hidden">
                        {/* Table Header */}
                        <div className="px-4 py-3 grid grid-cols-3 gap-4">
                            <div className="text-sm font-semibold text-blue-td-700">PAY DAY</div>
                            <div className="text-sm font-semibold text-blue-td-700">PAYROLL TYPE</div>
                            <div className="text-sm font-semibold text-blue-td-700">PAY PERIOD</div>
                        </div>

                        {/* Table Row */}
                        <div className="px-4 py-4 grid grid-cols-3 gap-4 bg-[#CFE5FF] border-t-2 border-blue-td-600">
                            <div className="text-sm text-blue-td-600">
                                {payScheduleData?.startMonth}
                            </div>
                            <div className="text-sm text-blue-td-600">
                                Regular Payroll
                            </div>
                            <div className="text-sm text-blue-td-600">
                               {payScheduleData?.payDate 
                                    ? dayjs(payScheduleData.payDate).format("DD/MM/YYYY") 
                                    : "-"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Action Buttons */}
            <div className="pt-5 border-t w-full flex items-center justify-start space-x-3 pb-10 px-5">
                <ButtonReusable title={"Delete"} action={handleDelete} isBLue={false} isRed={true} isLoading={loading} />
                {!loading && <ButtonReusable title={"Cancel"} action={() => setShowModal(false)} isBLue={false} />}
            </div>
        </div>
    );
}

export default FormPayScheduleDelete;