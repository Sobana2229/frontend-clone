import { useEffect, useState } from "react";
import payScheduleStoreManagements from "../../../../store/tdPayroll/setting/paySchedule";
import FormPaySchedule from "../../../component/paySchedule/formPaySchedule";
import HeaderReusable from "../../../component/setting/headerReusable";
import LoadingIcon from "../../../component/loadingIcon";
import { CalendarBlankIcon, CalendarCheck, CalendarDot, CalendarDots, CalendarPlus, Lightbulb, PencilSimple } from "@phosphor-icons/react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Modal from "react-modal";
import FormModal from "../../../component/formModal";
import { getOrdinal } from "../../../../../data/dummy";
import payrunStoreManagements from "../../../../store/tdPayroll/payrun";
dayjs.extend(customParseFormat);
function PaySchedule() {
    const { fetchPaySchedule, payScheduleData, loading } = payScheduleStoreManagements();
    const { getPayrunData, payrunDataHistory, payrunThisMonth } = payrunStoreManagements();
    const [showForm, setShowForm] = useState(false);
    const [dataPaySchedule, setDataPaySchedule] = useState(null);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const nextMonth = (currentMonth + 1) % 12;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    // Check if there are any locked payruns for current month or future months
    // Locked payruns are those with status: 'draft', 'paymentDue', 'paid', 'reject'
    // Link "(change)" should show when there are NO locked payruns for current or future months
    const checkPayrunLocked = (payrun) => {
        // Defensive checks: ensure payrun has required properties
        if (!payrun || !payrun.paymentDate || !payrun.status) {
            return false;
        }
        
        try {
            const paymentDate = new Date(payrun.paymentDate);
            // Check if date is valid
            if (isNaN(paymentDate.getTime())) {
                return false;
            }
            
            // Locked statuses: once payrun is created with any of these statuses, schedule cannot be changed
            const lockedStatuses = ['draft', 'paymentDue', 'paid', 'reject'];
            
            // Check if payrun is for current month or future months
            const payrunMonth = paymentDate.getMonth();
            const payrunYear = paymentDate.getFullYear();
            
            // Compare: payrun date should be >= current month
            const isCurrentOrFutureMonth = 
                (payrunYear > currentYear) ||
                (payrunYear === currentYear && payrunMonth >= currentMonth);
            
            return isCurrentOrFutureMonth && lockedStatuses.includes(payrun.status);
        } catch (error) {
            // If date parsing fails, exclude from results
            return false;
        }
    };

    // Check payrunThisMonth (current month payrun)
    // If payrunThisMonth exists and has a status (even if null/undefined, check if status exists)
    const hasLockedPayrunThisMonth = payrunThisMonth?.checkPayrun?.status && payrunThisMonth?.dataPaySchedule?.payDate
        ? checkPayrunLocked({
            paymentDate: payrunThisMonth.dataPaySchedule.payDate,
            status: payrunThisMonth.checkPayrun.status
        })
        : false;

    // Check payrunDataHistory (all payruns)
    const hasLockedPayrunInHistory = Array.isArray(payrunDataHistory) && payrunDataHistory.length > 0
        ? payrunDataHistory.some(checkPayrunLocked)
        : false;

    // Combined check: if either has locked payrun, hide the link
    const hasLockedPayrun = hasLockedPayrunThisMonth || hasLockedPayrunInHistory;

    useEffect(() => {
        const params = {
            all: true
        };
        const access_token = localStorage.getItem("accessToken");
        getPayrunData(access_token, params, "history");
        // Also fetch current month payrun to check for locked status
        getPayrunData(access_token);
    }, [])

    useEffect(() => {
        if(!payScheduleData){
            const access_token = localStorage.getItem("accessToken");
            fetchPaySchedule(access_token);
        }
    }, [])

    const handleShowModalDelete = () => {
        setShowModalDelete(true);
    }

    const handleCancelForm = () => {
        setShowForm(false);
    }
    return (
        <div className={`w-full h-full flex-col flex rounded-md ${loading ? "items-center justify-center" : "items-start justify-start"}`}>
            {loading ? 
                <div className="w-5 h-5">
                    <LoadingIcon color="white" /> 
                </div>
                : 
                <div className={`w-full flex items-center justify-start`}>
                    {(!showForm && payScheduleData) ? 
                        <div className="w-full">
                            {/* Note */}
                            <div className="flex items-center bg-[#FFD08F] p-3 rounded-md mb-4 text-sm">
                                <Lightbulb size={15} className="mr-2 text-orange-800" />
                                <span className="text-gray-td-500">
                                    <b className="font-medium text-black">Note:</b> Pay Schedule cannot be edited once you process the first pay run.
                                </span>
                            </div>

                            {/* Pay Schedule Info */}
                            <div className="flex h-full flex-col rounded-md">
                                <div className="w-full grid grid-cols-2 gap-10">
                                    <div className="bg-white rounded-xl p-10">
                                        <div className="space-y-5">
                                            <div className="w-full flex items-center justify-start space-x-2">
                                                <h2 className="text-2xl font-semibold text-blue-td-500">
                                                    This Organisation&apos;s payroll runs on this schedule.
                                                </h2>
                                            </div>

                                            <div className="w-full flex items-start justify-between text-lg">
                                                <table className="w-full">
                                                    <tbody>
                                                        <tr className="">
                                                            <td className="w-[90%] p-5 flex items-center justify-start space-x-2">
                                                                <div className="w-fit flex items-center justify-center bg-blue-td-50 rounded-md p-1">
                                                                    <CalendarBlankIcon className="text-blue-td-700 texsm" />
                                                                </div>
                                                                <p>
                                                                    Pay Frequency
                                                                </p>
                                                            </td>
                                                            <td className="p-5 font-normal">{payScheduleData?.salaryCalculation == "actual" ? "Every month" : `Every ${payScheduleData?.orgWorkingDays} of working days`}</td>
                                                        </tr>
                                                        <tr className="">
                                                            <td className="w-[90%] p-5 flex items-center justify-start space-x-2">
                                                                <div className="w-fit flex items-center justify-center bg-blue-td-50 rounded-md p-1">
                                                                    <CalendarDots className="text-blue-td-700 texsm" />
                                                                </div>
                                                                <p>
                                                                    Working Days
                                                                </p>
                                                            </td>
                                                            <td className="p-5 font-normal">{payScheduleData?.workDays?.join(", ")}</td>
                                                        </tr>
                                                        <tr className="">
                                                            <td className="w-[90%] p-5 flex items-center justify-start space-x-2">
                                                                <div className="w-fit flex items-center justify-center bg-blue-td-50 rounded-md p-1">
                                                                    <CalendarCheck className="text-blue-td-700 texsm" />
                                                                </div>
                                                                <p>
                                                                    Pay Day
                                                                </p>
                                                            </td>
                                                            <td className="p-5 font-normal">
                                                                <p>
                                                                    {payScheduleData?.payOn === "day"
                                                                    ? `${getOrdinal(payScheduleData?.payDay)} of every month`
                                                                    : "Last day of every month"}{" "}

                                                                    {!hasLockedPayrun && (
                                                                        <span
                                                                            onClick={handleShowModalDelete}
                                                                            className="text-blue-td-500 cursor-pointer"
                                                                        >
                                                                            (change)
                                                                        </span>
                                                                    )}
                                                                </p>
                                                            </td>
                                                        </tr>
                                                        <tr className="">
                                                            <td className="w-[90%] p-5 flex items-center justify-start space-x-2">
                                                                <div className="w-fit flex items-center justify-center bg-blue-td-50 rounded-md p-1">
                                                                    <CalendarDot className="text-blue-td-700 texsm" />
                                                                </div>
                                                                <p>
                                                                    First Pay Period
                                                                </p>
                                                            </td>
                                                            <td className="p-5 font-normal">{payScheduleData?.startMonth?.replace("-", " ")}</td>
                                                        </tr>
                                                        <tr className="">
                                                            <td className="w-[90%] p-5 flex items-center justify-start space-x-2">
                                                                <div className="w-fit flex items-center justify-center bg-blue-td-50 rounded-md p-1">
                                                                    <CalendarPlus className="text-blue-td-700 texsm" />
                                                                </div>
                                                                <p>
                                                                    First Pay Date
                                                                </p>
                                                            </td>
                                                            <td className="p-5 font-normal">
                                                                {payScheduleData?.payDate 
                                                                    ? dayjs(payScheduleData.payDate).format("DD") 
                                                                    : "-"}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg overflow-hidden p-5">
                                        {/* Header Tabs */}
                                        <div className="flex">
                                            <div className="flex-1 bg-[#DB6E00] text-white px-6 py-4 rounded-tl-md">
                                                <h2 className="text-lg font-semibold text-center">Upcoming Payrolls</h2>
                                            </div>
                                            <div className="flex-1 bg-[#016558] text-white px-6 py-4 rounded-tr-md">
                                                <h2 className="text-lg font-semibold text-center">Past Payrolls</h2>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex min-h-96">
                                            {/* Upcoming Payrolls */}
                                            <div className="flex-1 bg-[#FFF3E0] p-6">
                                                <div className="space-y-6">
                                                    {(() => {
                                                        // Extract bulan dari past payrolls
                                                        const pastPayrollMonths = (payrunDataHistory && Array.isArray(payrunDataHistory))
                                                            ? payrunDataHistory.map(payrun => dayjs(payrun.paymentDate).format("MMMM-YYYY"))
                                                            : [];

                                                        // Generate upcoming payrolls (first payroll + next 4)
                                                        const upcomingPayrolls = [];
                                                        
                                                        // Add first payroll
                                                        if (payScheduleData?.startMonth) {
                                                            const firstPayroll = {
                                                                month: payScheduleData.startMonth,
                                                                date: payScheduleData?.payDate 
                                                                    ? dayjs(payScheduleData.payDate).format("DD/MM/YYYY")
                                                                    : dayjs(payScheduleData.startMonth, "MMMM-YYYY").format("DD/MM/YYYY")
                                                            };
                                                            upcomingPayrolls.push(firstPayroll);
                                                        }

                                                        // Add next 4 months
                                                        for (let i = 1; i <= 4; i++) {
                                                            const nextMonth = payScheduleData?.startMonth
                                                                ? dayjs(payScheduleData.startMonth, "MMMM-YYYY").add(i, "month").format("MMMM-YYYY")
                                                                : dayjs("2025-08", "YYYY-MM").add(i, "month").format("MMMM-YYYY");

                                                            const nextDate = payScheduleData?.payDate
                                                                ? dayjs(payScheduleData.payDate).add(i, "month").format("DD/MM/YYYY")
                                                                : dayjs("2025-09-03").add(i, "month").format("DD/MM/YYYY");

                                                            upcomingPayrolls.push({
                                                                month: nextMonth,
                                                                date: nextDate
                                                            });
                                                        }

                                                        // Filter: hanya tampilkan yang tidak ada di past payrolls
                                                        const filteredUpcoming = upcomingPayrolls.filter(
                                                            payroll => !pastPayrollMonths.includes(payroll.month)
                                                        );

                                                        return filteredUpcoming.map((payroll, idx) => (
                                                            <div key={`upcoming-${idx}`} className="flex items-start gap-3">
                                                                <div className="relative">
                                                                    <div className="w-3 h-3 rounded-full bg-[#DB6E00] mt-2 flex-shrink-0 relative z-20"></div>
                                                                    {idx < filteredUpcoming.length - 1 && (
                                                                        <div className="w-4 h-24 bg-[#FFD08F] rounded-full absolute top-1 -left-0.5"></div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold text-gray-900 text-lg">
                                                                        {payroll.month}
                                                                    </h3>
                                                                    <p className="text-gray-600 text-sm">
                                                                        Pay Date : {payroll.date}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ));
                                                    })()}
                                                </div>
                                            </div>

                                            {/* Past Payrolls */}
                                            <div className="flex-1 bg-[#D5FAF2] p-6">
                                                <div className="space-y-6">
                                                    {payrunDataHistory && Array.isArray(payrunDataHistory) && payrunDataHistory.length > 0 ? (
                                                        payrunDataHistory.map((payrun, idx) => {
                                                            const payrollMonth = dayjs(payrun.paymentDate).format("MMMM-YYYY");
                                                            const payrollDate = dayjs(payrun.paymentDate).format("DD/MM/YYYY");

                                                            return (
                                                                <div key={payrun.uuid || idx} className="flex items-start gap-3">
                                                                    <div className="relative">
                                                                        <div className="w-3 h-3 rounded-full bg-[#016558] mt-2 flex-shrink-0 relative z-20"></div>
                                                                        {/* Tampilkan garis vertical hanya jika bukan item terakhir */}
                                                                        {idx < payrunDataHistory.length - 1 && (
                                                                            <div className="w-4 h-24 bg-[#A6F2E3] rounded-full absolute top-1 -left-0.5"></div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-semibold text-gray-900 text-lg">{payrollMonth}</h3>
                                                                        <p className="text-gray-600 text-sm">Pay Date : {payrollDate}</p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="flex items-center justify-center h-32 text-gray-500">
                                                            <p>No past payrolls yet</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : 
                        <FormPaySchedule handleCancelForm={handleCancelForm} dataPaySchedule={dataPaySchedule} />
                    }
                </div>
            }


            <Modal
                isOpen={showModalDelete}
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
                    setShowModal={setShowModalDelete} 
                    formFor={"payScheduleDelete"}
                    setShowForm={setShowForm} 
                />
            </Modal>
        </div>
    );
}

export default PaySchedule;
  