import { Info } from "@phosphor-icons/react";
import payrunStoreManagements from "../../../store/tdPayroll/payrun";
import { useEffect } from "react";
import dayjs from "dayjs";
import { statusShowGlobal } from "../../../../data/dummy";
import LoadingIcon from '../loadingIcon';

function RunPayroll({setShowForm, handleCreate, isCreatingPayrun = false}) {
    const { payrunThisMonth, getPayrunData, getPoiExitPayrun, payrunDataExitEmployeePoi } = payrunStoreManagements();
    useEffect(() => {
        // ✅ Always fetch fresh data on mount to ensure latest payrun data is displayed
        // This ensures card appears after creating new payrun and navigating back
        const access_token = localStorage.getItem("accessToken");
        getPayrunData(access_token);
    }, [])

    useEffect(() => {
        if(!payrunDataExitEmployeePoi){
            const access_token = localStorage.getItem("accessToken");
            getPoiExitPayrun(access_token);
        }
    }, []);

    const shouldShowPayrun = () => {
        // ✅ Jika belum ada payrun (checkPayrun === null), show card untuk create payrun baru
        if (!payrunThisMonth?.checkPayrun) {
            // Jika belum ada payrun, cek apakah sudah tanggal payDay atau sesudahnya
            const payDay = payrunThisMonth?.dataPaySchedule?.payDay; // Corrected to use 'payDay' property
            const today = dayjs();
            const currentDayOfMonth = today.date();
            const currentMonth = today.month(); // 0-indexed month
            const currentYear = today.year();

            // Mendapatkan bulan dan tahun dari payrun yang akan datang (contoh: Desember 2025)
            // Kita asumsikan payrunThisMonth?.dataPaySchedule?.startMonth merepresentasikan bulan payrun tersebut
            const payrunMonth = dayjs(payrunThisMonth?.dataPaySchedule?.startMonth, 'MMMM-YYYY').month();
            const payrunYear = dayjs(payrunThisMonth?.dataPaySchedule?.startMonth, 'MMMM-YYYY').year();
            
            // Tampilkan card hanya jika bulan dan tahun cocok dan sudah tanggal payDay atau sesudahnya
            if (payDay && currentMonth === payrunMonth && currentYear === payrunYear && currentDayOfMonth >= payDay) {
                return true; // Show card untuk create payrun baru
            }
            return false; // Jangan tampilkan jika belum tanggal payDay
        }

        // ✅ Jika status sudah "paid", tidak perlu ditampilkan lagi
        if (payrunThisMonth?.checkPayrun?.status === "paid") {
            return false;
        }

        // ✅ Untuk payrun dengan status draft/paymentDue/reject, selalu tampilkan card
        // Tidak perlu check payDate karena payrun ini masih perlu di-edit/approve
        const status = payrunThisMonth?.checkPayrun?.status;
        if (status === "draft" || status === "paymentDue" || status === "reject") {
            return true;
        }

        // ✅ Fallback: jika ada payDate, check apakah sudah mencapai payDate
        if (payrunThisMonth?.dataPaySchedule?.payDate) {
            const today = dayjs();
            const payDate = dayjs(payrunThisMonth?.dataPaySchedule?.payDate);
            return today.isAfter(payDate, 'day') || today.isSame(payDate, 'day');
        }

        return false;
    };
    return (
        <div className="w-full h-full flex-col flex items-start justify-start relative p-5 space-y-6">
            {shouldShowPayrun() && (
                <>
                    <div className="flex items-center justify-center space-x-2">
                        <h1 className="font-medium text-xl">
                            Process Pay Run for {payrunThisMonth?.dataPaySchedule?.startMonth ? payrunThisMonth.dataPaySchedule.startMonth.replace('-', ' ') : dayjs(payrunThisMonth?.dataPaySchedule?.payDate).format("MMMM YYYY")}
                        </h1>
                        <div className={
                            `py-0.5 px-3 rounded-sm capitalize
                            ${payrunThisMonth?.checkPayrun?.status == "paymentDue" ? "bg-orange-200 text-orange-500" : 
                                payrunThisMonth?.checkPayrun?.status == "paid" ? "bg-green-200 text-green-500" :
                                payrunThisMonth?.checkPayrun?.status == "draft" ? "bg-gray-td-200 text-gray-td-500" : 
                                payrunThisMonth?.checkPayrun?.status == "reject" ? "bg-red-td-500 text-white" : 
                                "bg-blue-td-500 text-white"
                            }`
                        }>{payrunThisMonth?.checkPayrun?.status ? statusShowGlobal[payrunThisMonth?.checkPayrun?.status] : "ready"}</div>
                    </div>
                    <div className="w-1/2 border-s border-gray-500 rounded-md shadow-md p-5 space-y-10">
                        <div className="w-full flex items-center justify-between">
                            <div className="flex space-x-5">
                                <div className="flex flex-col items-start justify-start pe-10 border-e-2 space-y-1">
                                    <p className="font-light">Employees' Net Pay</p>
                                    <h3 className="font-medium text-lg">${payrunThisMonth?.totalNetMonthly?.toLocaleString("en-US")}</h3>
                                </div>
                                <div className="flex flex-col items-start justify-start pe-10 border-e-2 space-y-1">
                                    <p className="font-light">Payment Date</p>
                                    <h3 className="font-medium text-lg">{dayjs(payrunThisMonth?.dataPaySchedule?.payDate).format("DD/MM/YYYY")}</h3>
                                </div>
                                <div className="flex flex-col items-start justify-start pe-10 space-y-1">
                                    <p className="font-light">No. of Employees</p>
                                    <h3 className="font-medium text-lg">{payrunThisMonth?.countEmployees}</h3>
                                </div>
                            </div>

                            <button 
                                onClick={handleCreate} 
                                disabled={isCreatingPayrun}
                                className={`py-2 px-3 bg-blue-500 rounded-md text-white flex items-center justify-center space-x-2 ${
                                    isCreatingPayrun ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isCreatingPayrun && (
                                    <div className="w-4 h-4">
                                        <LoadingIcon />
                                    </div>
                                )}
                                <span>{(payrunThisMonth?.checkPayrun?.status && !isCreatingPayrun) ? "View Detail" : "Create Pay"}</span>
                            </button>
                        </div>
                        <div className="flex items-center justify-start space-x-2">
                            <Info/>
                            <p className="text-sm font-normal">Please approve this payroll on or before {dayjs(payrunThisMonth?.dataPaySchedule?.payDate).format("DD/MM/YYYY")}.</p>
                        </div>
                    </div>
                </>
            )}

           {payrunDataExitEmployeePoi?.length > 0 && (
                <>
                {payrunDataExitEmployeePoi?.map((item, index) => (
                    <>
                        <div className="flex items-center justify-center space-x-2">
                            <h1 className="font-medium text-xl">
                                final settlement Payroll
                            </h1>
                            <div className={
                                `py-0.5 px-3 rounded-sm capitalize
                                ${item?.status == "paymentDue" ? "bg-orange-200 text-orange-500" : 
                                    item?.status == "paid" ? "bg-green-200 text-green-500" :
                                    item?.status == "draft" ? "bg-gray-td-200 text-gray-td-500" : 
                                    item?.status == "reject" ? "bg-red-td-500 text-white" : 
                                    "bg-blue-td-500 text-white"
                                }`
                            }>{item?.status ? statusShowGlobal[item?.status] : "ready"}</div>
                        </div>

                        <div className="w-1/2 border-s border-gray-500 rounded-md shadow-md p-5 space-y-10">
                            <div className="w-full flex items-center justify-between">
                                <div className="flex space-x-5">
                                    <div className="flex flex-col items-start justify-start pe-10 border-e-2 space-y-1">
                                        <p className="font-light">Employees' Net Pay</p>
                                        <h3 className="font-medium text-lg">${payrunDataExitEmployeePoi?.receivableAmount?.toLocaleString("en-US")}</h3>
                                    </div>
                                    <div className="flex flex-col items-start justify-start pe-10 border-e-2 space-y-1">
                                        <p className="font-light">Payment Date</p>
                                        <h3 className="font-medium text-lg">{dayjs(payrunDataExitEmployeePoi?.lastWorkingDay).format("DD/MM/YYYY")}</h3>
                                    </div>
                                    <div className="flex flex-col items-start justify-start pe-10 space-y-1">
                                        <p className="font-light">Employee</p>
                                        <h3 className="font-medium text-lg">
                                            {item?.Employee?.firstName} {item?.Employee?.middleName} {item?.Employee?.lastName}
                                        </h3>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleCreate} 
                                    disabled={isCreatingPayrun}
                                    className={`py-2 px-3 bg-blue-500 rounded-md text-white flex items-center justify-center space-x-2 ${
                                        isCreatingPayrun ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isCreatingPayrun && (
                                        <div className="w-4 h-4">
                                            <LoadingIcon />
                                        </div>
                                    )}
                                    <span>{payrunThisMonth?.checkPayrun?.status ? "View Detail" : "Create Pay"}</span>
                                </button>
                            </div>
                            <div className="flex items-center justify-start space-x-2">
                                <Info/>
                                <p className="text-sm font-normal">Please approve this payroll on or before {dayjs(payrunThisMonth?.dataPaySchedule?.payDate).format("DD/MM/YYYY")}.</p>
                            </div>
                        </div>
                    </>
                ))}
                </>
            )}
        </div>
    );
}

export default RunPayroll;