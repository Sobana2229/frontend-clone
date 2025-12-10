import React, { useState, useEffect, useRef } from 'react';
import { Clock, SignIn, SignInIcon, SignOut, SignOutIcon, Timer } from '@phosphor-icons/react';
import { toast } from "react-toastify";
import dayjs from 'dayjs';
import employeeStoreManagements from '../../../store/tdPayroll/employee';
import reportStoreManagements from '../../../store/tdPayroll/report';
import employeePortalStoreManagements from '../../../store/tdPayroll/employeePortal';
import { CustomToast } from '../customToast';
import organizationStoreManagements from '../../../store/tdPayroll/setting/organization';

function CheckInCheckOut({ isEmployeePortal = false, employeeUuid = null }) {
  const { 
    createEmployeeAttendance, 
    getEmployeeOverview, 
    lastestEmployeeAttendance,
    getEmployeeTodayData, 
    employeeTodayShiftData, 
    employeeTodayBreakData,
    lastestEmployeeTodayBreak
  } = employeeStoreManagements();
  const { fetchDataReport } = reportStoreManagements();
  const { fetchDataReportEmployeePortal } = employeePortalStoreManagements();
  const { fetchOrganizationSetting, isEnabledCheckInOut } = organizationStoreManagements();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [status, setStatus] = useState('Remote Out');
  const [completedSessionsTime, setCompletedSessionsTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isBreakDropdownOpen, setIsBreakDropdownOpen] = useState(false);
  const [breakElapsedTime, setBreakElapsedTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [breakCompletedTime, setBreakCompletedTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [breakCheckInTime, setBreakCheckInTime] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");
    fetchOrganizationSetting("check-in-out", access_token, true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsBreakDropdownOpen(false);
      }
    };

    if (isBreakDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBreakDropdownOpen]);

  const isWeekend = () => {
    const today = dayjs();
    const dayOfWeek = today.day();
    // return dayOfWeek === 0 || dayOfWeek === 6; // weekends cant check in/out
    return false; // every day
  };
  const shouldShowAttendance = () => {
    // return employeeTodayShiftData && !isWeekend(); // weekends cant check in/out
    return isEnabledCheckInOut; // every day
  };

  const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const calculateElapsedTime = (checkInDate) => {
    if (!checkInDate) return { hours: 0, minutes: 0, seconds: 0 };
    const now = new Date();
    const checkIn = new Date(checkInDate);
    const diffMs = now - checkIn;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  };

  const calculateTotalWorkedTime = (checkInDate, checkOutDate) => {
    if (!checkInDate || !checkOutDate) return { hours: 0, minutes: 0, seconds: 0 };
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffMs = checkOut - checkIn;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  };

  const normalizeTime = (timeObj) => {
    let { hours, minutes, seconds } = timeObj;
    if (seconds >= 60) {
      minutes += Math.floor(seconds / 60);
      seconds = seconds % 60;
    }
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
    }
    return { hours, minutes, seconds };
  };

  const addTimes = (time1, time2) => {
    return normalizeTime({
      hours: time1.hours + time2.hours,
      minutes: time1.minutes + time2.minutes,
      seconds: time1.seconds + time2.seconds
    });
  };

  const timeToSeconds = (timeObj) => {
    return (timeObj.hours * 3600) + (timeObj.minutes * 60) + timeObj.seconds;
  };

  const getAllowedMinutes = (breakItem) => {
    const from = breakItem.fromTime.split(':');
    const to = breakItem.toTime.split(':');
    const fromMinutes = parseInt(from[0]) * 60 + parseInt(from[1]);
    const toMinutes = parseInt(to[0]) * 60 + parseInt(to[1]);
    return toMinutes - fromMinutes;
  };

  const getTotalUsedTime = () => {
    return addTimes(breakCompletedTime, breakElapsedTime);
  };

  const getRemainingSeconds = (breakItem) => {
    const allowedSeconds = getAllowedMinutes(breakItem) * 60;
    const totalUsed = getTotalUsedTime();
    const usedSeconds = timeToSeconds(totalUsed);
    return Math.max(0, allowedSeconds - usedSeconds);
  };

  const getRemainingMinutes = (breakItem) => {
    return Math.floor(getRemainingSeconds(breakItem) / 60);
  };

  const formatTimerDisplay = (timeObj) => {
    const { hours, minutes, seconds } = timeObj;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const refreshCalendarData = async () => {
    try {
      const access_token = localStorage.getItem("accessToken");
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const startDate = formatDateToDDMMMyyyy(startOfMonth);
      const endDate = formatDateToDDMMMyyyy(endOfMonth);
      
      if (isEmployeePortal) {
        await fetchDataReportEmployeePortal(access_token, {
          startDate: startDate,
          endDate: endDate,
        }, "attandance-employe", "");
      } else {
        await fetchDataReport(access_token, {
          startDate: startDate,
          endDate: endDate,
        }, "attandance-employe", "", employeeUuid);
      }
      
      window.dispatchEvent(new CustomEvent('attendanceUpdated', {
        detail: { type: 'attendance-change', timestamp: new Date() }
      }));
    } catch (error) {
      // Silent error
    }
  };

  const formatDateToDDMMMyyyy = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; 
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    if(!employeeTodayShiftData) {
      const access_token = localStorage.getItem("accessToken");
      getEmployeeTodayData(access_token, "shift");
    }
  }, []);

  useEffect(() => {
    if(!employeeTodayBreakData) {
      const access_token = localStorage.getItem("accessToken");
      getEmployeeTodayData(access_token, "break");
    }
  }, []);

  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");
    getEmployeeOverview(access_token, "attendance");
  }, []);

  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");
    getEmployeeOverview(access_token, "break");
  }, []);

  useEffect(() => {
    if (lastestEmployeeTodayBreak && Array.isArray(lastestEmployeeTodayBreak)) {
      const now = new Date();
      let totalCompletedTime = { hours: 0, minutes: 0, seconds: 0 };
      let activeSession = null;
      
      lastestEmployeeTodayBreak.forEach(breakSession => {
        const breakDate = new Date(breakSession.createdAt);
        if (isSameDay(breakDate, now)) {
          const checkIn = new Date(breakSession.checkIn);
          const checkOut = breakSession.checkOut ? new Date(breakSession.checkOut) : null;
          
          if (checkOut) {
            const sessionTime = calculateTotalWorkedTime(checkIn, checkOut);
            totalCompletedTime = addTimes(totalCompletedTime, sessionTime);
          } else {
            activeSession = breakSession;
          }
        }
      });
      
      setBreakCompletedTime(totalCompletedTime);
      
      if (activeSession) {
        setIsBreakActive(true);
        setBreakCheckInTime(new Date(activeSession.checkIn));
        const currentSessionTime = calculateElapsedTime(activeSession.checkIn);
        setBreakElapsedTime(currentSessionTime);
      } else {
        setBreakElapsedTime({ hours: 0, minutes: 0, seconds: 0 });
        setIsBreakActive(false);
        setBreakCheckInTime(null);
      }
    } else if (lastestEmployeeTodayBreak && !Array.isArray(lastestEmployeeTodayBreak)) {
      const now = new Date();
      const breakDate = new Date(lastestEmployeeTodayBreak.updatedAt);
      
      if (isSameDay(breakDate, now)) {
        const checkIn = new Date(lastestEmployeeTodayBreak.checkIn);
        const checkOut = lastestEmployeeTodayBreak.checkOut 
          ? new Date(lastestEmployeeTodayBreak.checkOut) 
          : null;

        if (checkOut) {
          const totalTime = calculateTotalWorkedTime(checkIn, checkOut);
          setBreakCompletedTime(totalTime);
          setBreakElapsedTime({ hours: 0, minutes: 0, seconds: 0 });
          setIsBreakActive(false);
          setBreakCheckInTime(null);
        } else {
          setIsBreakActive(true);
          setBreakCheckInTime(checkIn);
          const currentTime = calculateElapsedTime(checkIn);
          setBreakElapsedTime(currentTime);
        }
      } else {
        setBreakCompletedTime({ hours: 0, minutes: 0, seconds: 0 });
        setBreakElapsedTime({ hours: 0, minutes: 0, seconds: 0 });
        setIsBreakActive(false);
        setBreakCheckInTime(null);
      }
    }
  }, [lastestEmployeeTodayBreak]);

  useEffect(() => {
    let interval;
    if (isBreakActive && breakCheckInTime) {
      interval = setInterval(() => {
        const currentSessionTime = calculateElapsedTime(breakCheckInTime);
        setBreakElapsedTime(currentSessionTime);
        
        if (employeeTodayBreakData) {
          const breakItem = Array.isArray(employeeTodayBreakData) 
            ? employeeTodayBreakData[0] 
            : employeeTodayBreakData;
          
          const allowedSeconds = getAllowedMinutes(breakItem) * 60;
          const totalUsed = addTimes(breakCompletedTime, currentSessionTime);
          const usedSeconds = timeToSeconds(totalUsed);
          
          if (usedSeconds >= allowedSeconds) {
            clearInterval(interval);
            handleStopBreak();
          }
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreakActive, breakCheckInTime, breakCompletedTime]);

  useEffect(() => {
    if (lastestEmployeeAttendance && Array.isArray(lastestEmployeeAttendance)) {
      const now = new Date();
      let totalCompletedTime = { hours: 0, minutes: 0, seconds: 0 };
      let activeSession = null;
      
      lastestEmployeeAttendance.forEach(attendance => {
        const attendanceDate = new Date(attendance.createdAt);
        if (isSameDay(attendanceDate, now)) {
          const checkIn = new Date(attendance.checkIn);
          const checkOut = attendance.checkOut ? new Date(attendance.checkOut) : null;
          
          if (checkOut) {
            const sessionTime = calculateTotalWorkedTime(checkIn, checkOut);
            totalCompletedTime = addTimes(totalCompletedTime, sessionTime);
          } else {
            activeSession = attendance;
          }
        }
      });
      
      setCompletedSessionsTime(totalCompletedTime);
      
      if (activeSession) {
        setStatus('Remote In');
        setIsCheckedIn(true);
        setCheckInTime(new Date(activeSession.checkIn));
        const currentSessionTime = calculateElapsedTime(activeSession.checkIn);
        const combinedTime = addTimes(totalCompletedTime, currentSessionTime);
        setElapsedTime(combinedTime);
      } else {
        setElapsedTime(totalCompletedTime);
        setStatus('Remote Out');
        setIsCheckedIn(false);
        setCheckInTime(null);
      }
    } else if (lastestEmployeeAttendance && !Array.isArray(lastestEmployeeAttendance)) {
      const now = new Date();
      const attendanceDate = new Date(lastestEmployeeAttendance.updatedAt);
      
      if (isSameDay(attendanceDate, now)) {
        const checkIn = new Date(lastestEmployeeAttendance.checkIn);
        const checkOut = lastestEmployeeAttendance.checkOut 
          ? new Date(lastestEmployeeAttendance.checkOut) 
          : null;

        if (checkOut) {
          const totalTime = calculateTotalWorkedTime(checkIn, checkOut);
          setElapsedTime(totalTime);
          setStatus('Remote Out');
          setIsCheckedIn(false);
          setCheckInTime(null);
        } else {
          setStatus('Remote In');
          setIsCheckedIn(true);
          setCheckInTime(checkIn);
          const currentTime = calculateElapsedTime(checkIn);
          setElapsedTime(currentTime);
        }
      } else {
        setElapsedTime({ hours: 0, minutes: 0, seconds: 0 });
        setIsCheckedIn(false);
        setCheckInTime(null);
        setStatus('Remote Out');
      }
    }
  }, [lastestEmployeeAttendance]);

  useEffect(() => {
    let interval;
    if (isCheckedIn && checkInTime) {
      interval = setInterval(() => {
        const currentSessionTime = calculateElapsedTime(checkInTime);
        const combinedTime = addTimes(completedSessionsTime, currentSessionTime);
        setElapsedTime(combinedTime);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCheckedIn, checkInTime, completedSessionsTime]);

  const formatTime = (time) => String(time).padStart(2, '0');
  
  const handleCheckIn = async () => {
    // Stop break if active
    if (isBreakActive) {
      await handleStopBreak();
      toast(<CustomToast message="Break stopped automatically" status="warning" />, {
        autoClose: 2000,
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

    const now = new Date();
    const formData = {
      checkIn: now.toISOString(),
      checkOut: ""
    };
    
    const access_token = localStorage.getItem("accessToken");
    try {
      const response = await createEmployeeAttendance(formData, access_token, "check-in");
      
      if (response) {
        setIsCheckedIn(true);
        setCheckInTime(now);
        setStatus('Remote In');
        await getEmployeeOverview(access_token, "attendance");
      }
    } catch (error) {
      toast(<CustomToast message={error?.response?.data?.message || 'Failed to check in'} status="error" />, {
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
  };

  const handleCheckOut = async () => {
    if (!checkInTime) return;
    
    const now = new Date();
    const formData = {
      checkIn: checkInTime.toISOString(),
      checkOut: now.toISOString()
    };
    
    const access_token = localStorage.getItem("accessToken");
    try {
      const response = await createEmployeeAttendance(formData, access_token, "check-out");
      if (response) {
        const currentSessionTime = calculateTotalWorkedTime(checkInTime, now);
        const finalTime = addTimes(completedSessionsTime, currentSessionTime);
        setElapsedTime(finalTime);
        setIsCheckedIn(false);
        setCheckInTime(null);
        setStatus('Remote Out');
        setCompletedSessionsTime(finalTime);        
        await getEmployeeOverview(access_token, "attendance");
        await refreshCalendarData();
      }
    } catch (error) {
      toast(<CustomToast message={error?.response?.data?.message || 'Failed to check out'} status="error" />, {
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
  };

  const handleStartBreak = async () => {
    // Stop attendance if active
    if (isCheckedIn) {
      await handleCheckOut();
      toast(<CustomToast message="Attendance stopped automatically" status="warning" />, {
        autoClose: 2000,
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

    const breakItem = Array.isArray(employeeTodayBreakData) 
                        ? employeeTodayBreakData[0] 
                        : employeeTodayBreakData;
    const now = new Date();
    const formData = {
      checkIn: now.toISOString(),
      checkOut: "",
      type: breakItem.type
    };
    
    const access_token = localStorage.getItem("accessToken");
    try {
      const response = await createEmployeeAttendance(formData, access_token, "break-check-in");
      
      if (response) {
        setIsBreakActive(true);
        setBreakCheckInTime(now);
        setBreakElapsedTime({ hours: 0, minutes: 0, seconds: 0 });
        await getEmployeeOverview(access_token, "break");
      }
    } catch (error) {
      toast(<CustomToast message={error?.response?.data?.message || 'Failed to start break'} status="error" />, {
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
  };

  const handleStopBreak = async () => {
    if (!breakCheckInTime) return;

    const breakItem = Array.isArray(employeeTodayBreakData) 
                        ? employeeTodayBreakData[0] 
                        : employeeTodayBreakData;
    const now = new Date();
    const formData = {
      checkIn: breakCheckInTime.toISOString(),
      checkOut: now.toISOString(),
      type: breakItem.type
    };
    
    const access_token = localStorage.getItem("accessToken");
    try {
      const response = await createEmployeeAttendance(formData, access_token, "break-check-out");
      
      if (response) {
        const sessionTime = calculateTotalWorkedTime(breakCheckInTime, now);
        const newCompleted = addTimes(breakCompletedTime, sessionTime);
        
        setBreakCompletedTime(newCompleted);
        setIsBreakActive(false);
        setBreakElapsedTime({ hours: 0, minutes: 0, seconds: 0 });
        setBreakCheckInTime(null);

        if (employeeTodayBreakData) {
          const breakItem = Array.isArray(employeeTodayBreakData) 
            ? employeeTodayBreakData[0] 
            : employeeTodayBreakData;
          
          const allowedSeconds = getAllowedMinutes(breakItem) * 60;
          const totalUsedSeconds = timeToSeconds(newCompleted);
          
          if (totalUsedSeconds >= allowedSeconds) {
            toast(<CustomToast message="Break time limit has been reached!" status="warning" />, {
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
        
        await getEmployeeOverview(access_token, "break");
        await refreshCalendarData();
      }
    } catch (error) {
      toast(<CustomToast message={error?.response?.data?.message || 'Failed to stop break'} status="error" />, {
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
  };

  // Show message if no shift data or weekend
  if (!shouldShowAttendance()) {
    return (
      <div className="w-full flex flex-col items-center justify-center space-y-2 p-6">
        <div className="text-gray-400 text-center">
          {isWeekend() ? (
            <>
              <Clock size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">Enjoy your weekend!</p>
              <p className="text-sm mt-1">Attendance tracking is disabled on weekends</p>
            </>
          ) : (
            <>
              {!isEnabledCheckInOut ? (
                <div className="">
                  <Clock size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium">Check-in/Out Disabled</p>
                  <p className="text-sm mt-1">Organization has disabled check-in/out feature</p>
                </div>
              ) : (
                <div className="">
                  <Clock size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium">No Shift Scheduled</p>
                  <p className="text-sm mt-1">You don't have a shift assigned for today</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      <div className="text-teal-400 text-sm font-medium">
        {status}
      </div>

      {/* Timer */}
      <div className="flex items-center space-x-1">
        <span className="text-teal-400 text-3xl tabular-nums">
          {formatTime(elapsedTime.hours)}
        </span>
        <span className="text-teal-400 text-xl">:</span>
        <span className="text-teal-400 text-3xl tabular-nums">
          {formatTime(elapsedTime.minutes)}
        </span>
        <span className="text-teal-400 text-xl">:</span>
        <span className="text-teal-400 text-3xl tabular-nums">
          {formatTime(elapsedTime.seconds)}
        </span>
      </div>

      <div className="flex items-center space-x-4 text-xs text-white font-extralight uppercase tracking-wider">
        <span>Hrs</span>
        <span>Min</span>
        <span>Sec</span>
      </div>

      {/* Action Buttons */}
      <div
        className="w-full flex flex-col items-center justify-center"
      >
        {/* Check-in/out Button */}
        {!isCheckedIn ? (
          <div className="w-full flex items-center justify-between relative" ref={dropdownRef}>
            <button
              onClick={handleCheckIn}
              className="
              flex items-center justify-center space-x-2
              h-12
              py-3 w-full 
              duration-300 
              ease-in-out  
              bg-gray-900 hover:bg-gray-950 text-teal-400 hover:text-teal-300"
            >
              <SignInIcon size={20} weight='bold' />
              <span className="text-md font-medium">Check-in</span>
            </button>

            {isBreakActive && (
              <>
                <button
                  onClick={() => setIsBreakDropdownOpen(!isBreakDropdownOpen)}
                  className="
                  flex items-center justify-center space-x-2
                  h-12
                  py-3 px-10 w-fit 
                  duration-300 
                  ease-in-out  
                  bg-gray-900 hover:bg-gray-950 text-orange-400 hover:text-orange-300
                  border-l-2 border-[#21263B]
                  "
                >
                  <Clock size={20} />
                </button>

                {isBreakDropdownOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-96 overflow-y-auto">
                      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-white">
                          Break Times
                        </h3>
                        <button
                          onClick={() => setIsBreakDropdownOpen(false)}
                          className="text-gray-400 hover:text-white text-sm"
                        >
                          Close
                        </button>
                      </div>

                      <div className="p-3 space-y-3">
                        {employeeTodayBreakData ? (
                          (() => {
                            const breakItem = Array.isArray(employeeTodayBreakData)
                              ? employeeTodayBreakData[0]
                              : employeeTodayBreakData;

                            const totalUsed = getTotalUsedTime();
                            const remainingSeconds = getRemainingSeconds(breakItem);

                            return (
                              <div
                                className="p-3 rounded-lg bg-gray-900 border border-gray-700 space-y-3"
                                style={{ borderLeftWidth: '4px', borderLeftColor: breakItem.color }}
                              >
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Timer size={18} style={{ color: breakItem.color }} />
                                    <span className="text-sm font-medium text-white capitalize">
                                      {breakItem.name}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-xs font-medium px-2.5 py-1 rounded-md ${breakItem.type === 'paid'
                                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                      }`}
                                  >
                                    {breakItem.type === 'paid' ? 'Paid' : 'Unpaid'}
                                  </span>
                                </div>

                                {/* Timer Display */}
                                <div className="flex items-center justify-center py-2">
                                  <div className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700">
                                    <span className="text-2xl font-mono font-bold text-teal-400 tabular-nums">
                                      {formatTimerDisplay(totalUsed)}
                                    </span>
                                  </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center justify-between text-xs bg-gray-800 rounded-lg p-2">
                                  <div className="flex flex-col">
                                    <span className="text-gray-400">Allowed</span>
                                    <span className="font-semibold text-white mt-0.5">
                                      {getAllowedMinutes(breakItem)} Min(s)
                                    </span>
                                  </div>
                                  <div className="h-8 w-px bg-gray-700"></div>
                                  <div className="flex flex-col">
                                    <span className="text-gray-400">Remaining</span>
                                    <span className="font-semibold text-white mt-0.5">
                                      {getRemainingMinutes(breakItem)} Min(s)
                                    </span>
                                  </div>
                                </div>

                                {/* Action Button */}
                                <button
                                  onClick={() => isBreakActive ? handleStopBreak() : handleStartBreak()}
                                  disabled={!isBreakActive && remainingSeconds === 0}
                                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isBreakActive
                                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30'
                                    : remainingSeconds === 0
                                      ? 'bg-gray-700 text-gray-500 border border-gray-600 cursor-not-allowed'
                                      : 'bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30'
                                    }`}
                                >
                                  <Clock size={16} />
                                  <span>
                                    {isBreakActive ? 'Stop Break' : 'Start Break'}
                                  </span>
                                </button>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="text-center py-8 text-sm text-gray-400">
                            No breaks available for your shift today
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="w-full flex items-center justify-between relative" ref={dropdownRef}>
            <button
              onClick={handleCheckOut}
              className="
              flex items-center justify-center space-x-2
              h-12
              py-3 w-full 
              duration-300 
              ease-in-out  
              bg-gray-900 hover:bg-gray-950 text-red-500 hover:text-red-400"
            >
              <SignOutIcon size={20} weight='bold' />
              <span className="text-md font-medium">Check-out</span>
            </button>

            <button
              onClick={() => setIsBreakDropdownOpen(!isBreakDropdownOpen)}
              className="
              flex items-center justify-center space-x-2
              h-12
              py-3 px-10 w-fit 
              duration-300 
              ease-in-out  
              bg-gray-900 hover:bg-gray-950 text-orange-400 hover:text-orange-300
              border-l-2 border-[#21263B]
              "
            >
              <Clock size={20} />
            </button>

            {isBreakDropdownOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-white">
                      Break Times
                    </h3>
                    <button
                      onClick={() => setIsBreakDropdownOpen(false)}
                      className="text-gray-400 hover:text-white text-sm"
                    >
                      Close
                    </button>
                  </div>

                  <div className="p-3 space-y-3">
                    {employeeTodayBreakData ? (
                      (() => {
                        const breakItem = Array.isArray(employeeTodayBreakData)
                          ? employeeTodayBreakData[0]
                          : employeeTodayBreakData;

                        const totalUsed = getTotalUsedTime();
                        const remainingSeconds = getRemainingSeconds(breakItem);

                        return (
                          <div
                            className="p-3 rounded-lg bg-gray-900 border border-gray-700 space-y-3"
                            style={{ borderLeftWidth: '4px', borderLeftColor: breakItem.color }}
                          >
                            {/* Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Timer size={18} style={{ color: breakItem.color }} />
                                <span className="text-sm font-medium text-white capitalize">
                                  {breakItem.name}
                                </span>
                              </div>
                              <span
                                className={`text-xs font-medium px-2.5 py-1 rounded-md ${breakItem.type === 'paid'
                                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                                  : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                  }`}
                              >
                                {breakItem.type === 'paid' ? 'Paid' : 'Unpaid'}
                              </span>
                            </div>

                            {/* Timer Display */}
                            <div className="flex items-center justify-center py-2">
                              <div className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700">
                                <span className="text-2xl font-mono font-bold text-teal-400 tabular-nums">
                                  {formatTimerDisplay(totalUsed)}
                                </span>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between text-xs bg-gray-800 rounded-lg p-2">
                              <div className="flex flex-col">
                                <span className="text-gray-400">Allowed</span>
                                <span className="font-semibold text-white mt-0.5">
                                  {getAllowedMinutes(breakItem)} Min(s)
                                </span>
                              </div>
                              <div className="h-8 w-px bg-gray-700"></div>
                              <div className="flex flex-col">
                                <span className="text-gray-400">Remaining</span>
                                <span className="font-semibold text-white mt-0.5">
                                  {getRemainingMinutes(breakItem)} Min(s)
                                </span>
                              </div>
                            </div>

                            {/* Action Button */}
                            <button
                              onClick={() => isBreakActive ? handleStopBreak() : handleStartBreak()}
                              disabled={!isBreakActive && remainingSeconds === 0}
                              className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isBreakActive
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30'
                                : remainingSeconds === 0
                                  ? 'bg-gray-700 text-gray-500 border border-gray-600 cursor-not-allowed'
                                  : 'bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30'
                                }`}
                            >
                              <Clock size={16} />
                              <span>
                                {isBreakActive ? 'Stop Break' : 'Start Break'}
                              </span>
                            </button>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="text-center py-8 text-sm text-gray-400">
                        No breaks available for your shift today
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* <div className="w-full flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsBreakDropdownOpen(!isBreakDropdownOpen)}
              className="bg-orange-200 p-2 rounded-lg hover:bg-orange-300 transition-colors duration-200 cursor-pointer"
            >
              <Clock size={20} className="text-orange-600" />
            </button>

            {isBreakDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 z-50 max-h-96 overflow-y-auto">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Break Times
                  </h3>
                </div>

                <div className="p-3 space-y-3">
                  {employeeTodayBreakData ? (
                    (() => {
                      const breakItem = Array.isArray(employeeTodayBreakData) 
                        ? employeeTodayBreakData[0] 
                        : employeeTodayBreakData;
                      
                      const totalUsed = getTotalUsedTime();
                      const remainingSeconds = getRemainingSeconds(breakItem);
                      
                      return (
                        <div
                          className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 space-y-2"
                          style={{ borderLeftWidth: '4px', borderLeftColor: breakItem.color }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Timer size={18} style={{ color: breakItem.color }} />
                              <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                {breakItem.name}
                              </span>
                            </div>
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded ${
                                breakItem.type === 'paid'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              }`}
                            >
                              {breakItem.type === 'paid' ? 'Paid' : 'Unpaid'}
                            </span>
                          </div>

                          <div className="flex items-center justify-center py-1">
                            <div className="px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-600 text-base font-bold text-gray-900 dark:text-white">
                              {formatTimerDisplay(totalUsed)}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Allowed </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {getAllowedMinutes(breakItem)} Min(s)
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Remaining </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {getRemainingMinutes(breakItem)} Min(s)
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => isBreakActive ? handleStopBreak() : handleStartBreak()}
                            disabled={!isBreakActive && remainingSeconds === 0}
                            className={`w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-md text-white text-sm font-medium transition-colors duration-200 ${
                              isBreakActive
                                ? 'bg-red-500 hover:bg-red-600'
                                : remainingSeconds === 0
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-green-500 hover:bg-green-600'
                            }`}
                          >
                            <Clock size={14} />
                            <span>
                              {isBreakActive ? 'Stop Break' : 'Start Break'}
                            </span>
                          </button>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
                      No breaks available for your shift today
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default CheckInCheckOut;
