import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";
import { Trash, X } from "@phosphor-icons/react";
import reportStoreManagements from '../../../store/tdPayroll/report';
import MonthlyNavigator from '../monthlyNavigator';
import employeePortalStoreManagements from '../../../store/tdPayroll/employeePortal';
import { CustomToast } from '../customToast';
import { toast } from "react-toastify";
import { useLocation } from 'react-router-dom';
import { checkPermission, sumAllHours } from '../../../../helper/globalHelper';
import authStoreManagements from '../../../store/tdPayroll/auth';

dayjs.extend(isoWeek);
dayjs.extend(weekday);

const AttendanceCalender = ({employeeUuid, isEmployeePortal}) => {
    const {pathname} = useLocation();
    const { user } = authStoreManagements();
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const { dataAttandanceEmployee, fetchDataReport, deleteDataReport } = reportStoreManagements();
    const { dataAttandanceEmployeePortal, fetchDataReportEmployeePortal } = employeePortalStoreManagements();
    const [search, setSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [showCheckInOutModal, setShowCheckInOutModal] = useState(false);
    const [deleteConfirmUuid, setDeleteConfirmUuid] = useState(null);
    const [deleteConfirmType, setDeleteConfirmType] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const startDate = currentMonth.startOf("month");
    const endDate = currentMonth.endOf("month");

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        
        if(isEmployeePortal){
            fetchDataReportEmployeePortal(token, {
                startDate: startDate.format("DD-MMM-YYYY"),
                endDate: endDate.format("DD-MMM-YYYY"),
            }, "attandance-employe", search);
        } else {
            fetchDataReport(token, {
                startDate: startDate.format("DD-MMM-YYYY"),
                endDate: endDate.format("DD-MMM-YYYY"),
            }, "attandance-employe", search, employeeUuid);
        }
    }, [currentMonth, search, employeeUuid, isEmployeePortal]);

    const handleMonthChange = (delta) => {
        const newMonth = currentMonth.add(delta, "month");
        setCurrentMonth(newMonth);
    };

    const getCalendarDays = () => {
        const startOfMonth = currentMonth.startOf('month');
        const endOfMonth = currentMonth.endOf('month');
        const startOfWeek = startOfMonth.startOf('isoWeek');
        const endOfWeek = endOfMonth.endOf('isoWeek');
        
        const days = [];
        let current = startOfWeek;
        
        while (current.isBefore(endOfWeek) || current.isSame(endOfWeek, 'day')) {
            days.push(current);
            current = current.add(1, 'day');
        }
        
        return days;
    };

    const getStatusStyle = (status, isCurrentMonth) => {
        if (!isCurrentMonth) {
            return 'text-gray-300 bg-gray-50';
        }

        const baseClasses = 'text-sm font-medium';
        
        switch (status) {
            case 'present':
                return `${baseClasses} bg-green-100 text-green-800 border-l-4 border-green-500`;
            case 'absent':
                return `${baseClasses} bg-red-100 text-red-800 border-l-4 border-red-500`;
            case 'half-day':
                return `${baseClasses} bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500`;
            case 'weekend':
                return `${baseClasses} bg-gray-100 text-gray-600 border-l-4 border-gray-400`;
            case 'paid-leave':
                return `${baseClasses} bg-orange-100 text-orange-800 border-l-4 border-orange-500`;
            default:
                return `${baseClasses} bg-white text-gray-800`;
        }
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const formatHoursFromDecimal = (decimalHours) => {
        if (!decimalHours && decimalHours !== 0) return '00:00';
        
        const totalMinutes = Math.round(decimalHours * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        return formatted;
    };

    const sumHoursWorked = (checkInOutRecords) => {
        if (!checkInOutRecords || checkInOutRecords.length === 0) {
            return '00:00';
        }

        let totalMinutes = 0;

        checkInOutRecords.forEach(record => {
            const [hours, minutes] = record.hoursWorked.split(':').map(Number);
            totalMinutes += hours * 60 + minutes;
        });

        const finalHours = Math.floor(totalMinutes / 60);
        const finalMinutes = totalMinutes % 60;

        return `${finalHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
    };

    const getTotalHoursForModal = (attendance) => {
        if (!attendance) return '00:00';
        
        console.log('getTotalHoursForModal - Attendance data:', attendance);
        let totalMinutes = 0;

        // Prioritas: Regulation > CheckInOut (pilih salah satu, jangan sum keduanya)
        if (attendance.regulationDetails?.length > 0) {
            console.log('getTotalHoursForModal - Using regulation details');
            attendance.regulationDetails.forEach(regulation => {
                console.log('getTotalHoursForModal - Regulation hoursWorked:', regulation.hoursWorked);
                const minutes = Math.round(regulation.hoursWorked * 60);
                totalMinutes += minutes;
                console.log('getTotalHoursForModal - Added minutes:', minutes, 'from regulation');
            });
        } else if (attendance.checkInOutRecords?.length > 0) {
            console.log('getTotalHoursForModal - Using check-in/out records');
            attendance.checkInOutRecords.forEach(record => {
                const [hours, minutes] = record.hoursWorked.split(':').map(Number);
                totalMinutes += hours * 60 + minutes;
            });
        }

        // Break hours: hanya paid yang di-sum, unpaid/null diabaikan (tidak di-sum)
        if (attendance.breakRecords?.length > 0) {
            attendance.breakRecords.forEach(breakRecord => {
                // Hanya sum jika type = "paid"
                if (breakRecord.type === 'paid' && breakRecord.breakDuration) {
                    const [hours, minutes] = breakRecord.breakDuration.split(':').map(Number);
                    totalMinutes += hours * 60 + minutes;
                }
                // unpaid atau null diabaikan (tidak di-sum)
            });
        }

        const finalHours = Math.floor(totalMinutes / 60);
        const finalMinutes = totalMinutes % 60;
        const formatted = `${finalHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
        
        console.log('getTotalHoursForModal - Final result:', formatted, 'from', totalMinutes, 'total minutes');
        return formatted;
    };

    const handleCheckInOutClick = (dateStr, attendance) => {
        if (attendance?.checkInOutRecords?.length > 0 || 
            attendance?.breakRecords?.length > 0 || 
            attendance?.regulationDetails?.length > 0) {
            setSelectedDate({
                dateStr,
                attendance
            });
            setShowCheckInOutModal(true);
        }
    };

    const closeModal = () => {
        setShowCheckInOutModal(false);
        setSelectedDate(null);
        setDeleteConfirmUuid(null);
        setDeleteConfirmType(null);
    };

    const handleDeleteClick = (uuid, type) => {
        setDeleteConfirmUuid(uuid);
        setDeleteConfirmType(type);
    };

    const handleCancelDelete = () => {
        setDeleteConfirmUuid(null);
        setDeleteConfirmType(null);
    };

    const handleDeleteRecord = async (uuid, type) => {
        const token = localStorage.getItem("accessToken");
        setIsDeleting(true);
        
        try {
            let response;
            
            // Step 1: Delete dari BE berdasarkan type
            if (type === "attendance") {
                response = await deleteDataReport(token, "attendance", uuid, isEmployeePortal);
            } else if (type === "break") {
                response = await deleteDataReport(token, "break", uuid, isEmployeePortal);
            } else if (type === "regulation") {
                response = await deleteDataReport(token, "regulation", uuid, isEmployeePortal);
            }

            if (response) {
                // Step 2: Refresh data setelah delete
                const newStartDate = startDate.format("DD-MMM-YYYY");
                const newEndDate = endDate.format("DD-MMM-YYYY");
                
                if(isEmployeePortal){
                    await fetchDataReportEmployeePortal(token, {
                        startDate: newStartDate,
                        endDate: newEndDate,
                    }, "attandance-employe", search);
                } else {
                    await fetchDataReport(token, {
                        startDate: newStartDate,
                        endDate: newEndDate,
                    }, "attandance-employe", search, employeeUuid);
                }

                // Step 3: Show success toast
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

                // Step 4: Reset modal state
                setDeleteConfirmUuid(null);
                setDeleteConfirmType(null);
                setShowCheckInOutModal(false);
                setSelectedDate(null);
            }
        } catch (error) {
            toast(<CustomToast message={error?.message || "Failed to delete record"} status="error" />, {
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
        } finally {
            setIsDeleting(false);
        }
    };

    const weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const attendanceData = isEmployeePortal ? dataAttandanceEmployeePortal : dataAttandanceEmployee;

    return (
        <div className="w-full h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full">
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center space-x-4">
                        <div className="w-full">
                            <MonthlyNavigator
                                startDate={startDate}
                                endDate={endDate}
                                onMonthChange={handleMonthChange}
                                currentMonth={currentMonth}
                            />
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setCurrentMonth(dayjs())}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Today
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map(day => (
                            <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600 bg-gray-50">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {getCalendarDays().map(day => {
                            const dateStr = day.format('YYYY-MM-DD');
                            const isCurrentMonth = day.month() === currentMonth.month();
                            const isToday = day.isSame(dayjs(), 'day');
                            const attendance = attendanceData?.[dateStr];
                            
                            return (
                                <div
                                    key={dateStr}
                                    className={`
                                        min-h-[120px] p-2 border border-gray-200
                                        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                                        ${isToday ? 'ring-2 ring-blue-500' : ''}
                                    `}
                                >
                                    <div className={`
                                        text-lg font-medium mb-2
                                        ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                                        ${isToday ? 'text-blue-600 font-bold' : ''}
                                    `}>
                                        {day.date()}
                                    </div>
                                    
                                    {attendance && isCurrentMonth && (
                                        <div className={`
                                            p-2 rounded-md text-xs
                                            ${getStatusStyle(attendance.status, isCurrentMonth)}
                                        `}>
                                            {attendance.type}
                                        </div>
                                    )}
                                    
                                    {process.env.NODE_ENV === 'development' && attendance && isCurrentMonth && (
                                        <div className="text-xs text-gray-400 mt-1">
                                            {dateStr}
                                        </div>
                                    )}

                                    {(attendance?.checkInOutRecords?.length > 0 || 
                                        attendance?.breakRecords?.length > 0 || 
                                        attendance?.regulationDetails?.length > 0) && (
                                        <button
                                            onClick={() => handleCheckInOutClick(dateStr, attendance)}
                                            className="text-xs text-blue-500 mt-1 font-medium hover:underline cursor-pointer"
                                        >
                                            {sumAllHours(attendance)} Hrs
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="px-6 pb-6">
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-100 border-l-4 border-green-500 rounded"></div>
                            <span>Present</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-100 border-l-4 border-red-500 rounded"></div>
                            <span>Absent</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-100 border-l-4 border-yellow-500 rounded"></div>
                            <span>Half Day</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-100 border-l-4 border-gray-400 rounded"></div>
                            <span>Weekend</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Check In/Out */}
            {showCheckInOutModal && selectedDate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-auto p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500">{selectedDate.dateStr}</p>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Check-in / Check-out
                                </h3>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Check In/Out Records */}
                        <div className="space-y-3">
                            {selectedDate.attendance.checkInOutRecords && selectedDate.attendance.checkInOutRecords.length > 0 && (
                                <div>
                                    {selectedDate.attendance.checkInOutRecords.map((record, idx) => (
                                        <div key={record.uuid || idx} className="border border-gray-200 rounded-lg p-4 mb-3">
                                            <div className="flex items-center justify-between">
                                                <div className="w-full">
                                                    <div className="w-full flex items-center justify-between">
                                                        <p className="text-sm font-medium text-gray-700 mb-3">
                                                            Record {idx + 1}
                                                        </p>
                                                        {deleteConfirmUuid === record.uuid && deleteConfirmType === "attendance" ? (
                                                            <div className="flex items-center justify-center space-x-2">
                                                                <button 
                                                                    onClick={() => handleDeleteRecord(record.uuid, "attendance")}
                                                                    disabled={isDeleting}
                                                                    className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50"
                                                                >
                                                                    {isDeleting ? "Deleting..." : "Confirm"}
                                                                </button>
                                                                <button 
                                                                    onClick={handleCancelDelete}
                                                                    disabled={isDeleting}
                                                                    className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 disabled:opacity-50"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            (!pathname?.includes("employee-portal") && checkPermission(user, "Attendance", "Edit")) && (
                                                                <button 
                                                                    onClick={() => handleDeleteClick(record.uuid, "attendance")}
                                                                    disabled={isDeleting}
                                                                    className="text-red-500 hover:text-red-600 disabled:opacity-50"
                                                                >
                                                                    <Trash size={20} />
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-500">Check-in</span>
                                                            <span className="text-sm font-medium text-green-600">
                                                                {formatTime(record.checkIn)}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-500">Check-out</span>
                                                            <span className="text-sm font-medium text-red-600">
                                                                {formatTime(record.checkOut)}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                                            <span className="text-xs text-gray-500">Duration</span>
                                                            <span className="text-sm font-medium text-blue-600">
                                                                {record.hoursWorked}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Break Records */}
                            {selectedDate.attendance.breakRecords && selectedDate.attendance.breakRecords.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Break Records</h4>
                                    <div className="space-y-3">
                                        {selectedDate.attendance.breakRecords.map((breakRecord, idx) => (
                                            breakRecord.type === 'paid' && (
                                                <div key={breakRecord.uuid || idx} className="border border-gray-200 rounded-lg p-4 bg-orange-50">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <p className="text-sm font-medium text-gray-700">
                                                            Break {breakRecord?.policyName}
                                                        </p>
                                                        {deleteConfirmUuid === breakRecord.uuid && deleteConfirmType === "break" ? (
                                                            <div className="flex items-center justify-center space-x-2">
                                                                <button 
                                                                    onClick={() => handleDeleteRecord(breakRecord.uuid, "break")}
                                                                    disabled={isDeleting}
                                                                    className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50"
                                                                >
                                                                    {isDeleting ? "Deleting..." : "Confirm"}
                                                                </button>
                                                                <button 
                                                                    onClick={handleCancelDelete}
                                                                    disabled={isDeleting}
                                                                    className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 disabled:opacity-50"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            (!pathname?.includes("employee-portal") && checkPermission(user, "Attendance", "Edit")) && (
                                                                <button 
                                                                    onClick={() => handleDeleteClick(breakRecord.uuid, "break")}
                                                                    disabled={isDeleting}
                                                                    className="text-red-500 hover:text-red-600 disabled:opacity-50"
                                                                >
                                                                    <Trash size={20} />
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-500">Break In</span>
                                                            <span className="text-sm font-medium text-gray-600">
                                                                {formatTime(breakRecord.checkIn)}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-500">Break Out</span>
                                                            <span className="text-sm font-medium text-gray-600">
                                                                {formatTime(breakRecord.checkOut)}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="flex items-center justify-between pt-2 border-t border-orange-200">
                                                            <span className="text-xs text-gray-500">Duration</span>
                                                            <span className="text-sm font-medium text-orange-600">
                                                                {breakRecord.breakDuration}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Regulations Section */}
                            {selectedDate.attendance.regulationDetails && selectedDate.attendance.regulationDetails.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Regulations Applied</h4>
                                    <div className="space-y-3">
                                        {selectedDate.attendance.regulationDetails.map((regulation, idx) => (
                                            <div key={regulation.detailUuid || idx} className="border border-gray-200 rounded-lg p-4 bg-purple-50">
                                                <div className="flex items-center justify-between mb-3">
                                                    <p className="text-sm font-medium text-gray-700">
                                                        Regulation {idx + 1}
                                                    </p>
                                                    <span className="px-2 py-1 text-xs rounded font-medium bg-purple-100 text-purple-800">
                                                        Applied
                                                    </span>
                                                    {deleteConfirmUuid === regulation.regulationUuid && deleteConfirmType === "regulation" ? (
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <button 
                                                                onClick={() => handleDeleteRecord(regulation.regulationUuid, "regulation")}
                                                                disabled={isDeleting}
                                                                className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50"
                                                            >
                                                                {isDeleting ? "Deleting..." : "Confirm"}
                                                            </button>
                                                            <button 
                                                                onClick={handleCancelDelete}
                                                                disabled={isDeleting}
                                                                className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 disabled:opacity-50"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        (!pathname?.includes("employee-portal") && checkPermission(user, "Attendance", "Edit")) && (
                                                            <button 
                                                                onClick={() => handleDeleteClick(regulation.regulationUuid, "regulation")}
                                                                disabled={isDeleting}
                                                                className="text-red-500 hover:text-red-600 disabled:opacity-50"
                                                            >
                                                                <Trash size={20} />
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-500">Check In</span>
                                                        <span className="text-sm font-medium text-gray-600">
                                                            {formatTime(regulation.actualCheckIn)}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-500">Check Out</span>
                                                        <span className="text-sm font-medium text-gray-600">
                                                            {formatTime(regulation.actualCheckOut)}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between pt-2 border-t border-purple-200">
                                                        <span className="text-xs text-gray-500">Hours Worked</span>
                                                        <span className="text-sm font-medium text-purple-600">
                                                            {formatHoursFromDecimal(regulation.hoursWorked)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Total Hours */}
                        {(selectedDate?.attendance.checkInOutRecords?.length > 0 || 
                            selectedDate?.attendance.breakRecords?.length > 0 || 
                            selectedDate?.attendance.regulationDetails?.length > 0) && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Total Hours</span>
                                    <span className="text-lg font-bold text-blue-600">
                                        {getTotalHoursForModal(selectedDate?.attendance)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            disabled={isDeleting}
                            className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceCalender;
