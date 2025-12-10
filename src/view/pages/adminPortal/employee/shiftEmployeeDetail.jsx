import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import isoWeek from "dayjs/plugin/isoWeek";
import weekday from 'dayjs/plugin/weekday';
import updateLocale from 'dayjs/plugin/updateLocale';
import Modal from "react-modal";
import FormModal from '../../../component/formModal';
import employeeStoreManagements from '../../../../store/tdPayroll/employee';
import { useParams } from 'react-router-dom';

dayjs.extend(weekday);
dayjs.extend(updateLocale);
dayjs.extend(isoWeek);
dayjs.updateLocale('en', {
  weekStart: 1,
});

function ShiftEmployeeDetail() {
  const { fetchEmployeeWorkShift, employeeWorkShift } = employeeStoreManagements();
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [tempData, setTempData] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);

  const startDate = currentMonth.startOf("month");
  const endDate = currentMonth.endOf("month");

  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");
    fetchEmployeeWorkShift(access_token, id);
  }, [id]);

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

  const getShiftData = (date) => {
    const dayOfWeek = date.day();
    // 1 - 6 days (weekdays only, skip weekends)
    if (dayOfWeek === 0 || dayOfWeek === 7) {
      return null;
    }
    
    const currentDate = date.startOf('day');
    const shiftForThisDate = employeeWorkShift?.find(shift => {
      const fromDate = dayjs(shift.fromDate).startOf('day');
      const toDate = dayjs(shift.toDate).startOf('day');
      return currentDate >= fromDate && currentDate <= toDate;
    });
    
    if (!shiftForThisDate) {
      return null;
    }

    return {
      id: shiftForThisDate.uuid,
      time: `${shiftForThisDate?.Shift?.fromTime} - ${shiftForThisDate?.Shift?.toTime}`,
      color: `${shiftForThisDate?.Shift?.color}`,
      date: date,
      shiftName: `${shiftForThisDate?.Shift?.shiftName}`,
      reason: shiftForThisDate.reason,
      shiftUuid: shiftForThisDate.shiftUuid
    };
  };

  const handleShiftClick = (shift, date) => {
    if (shift) {
      setTempData(shift);
      setIsUpdate(true);
    } else {
      setTempData({ date: date });
      setIsUpdate(false);
    }
    setShowModal(true);
  };

  const handleMonthChange = (delta) => {
    const newMonth = currentMonth.add(delta, "month");
    setCurrentMonth(newMonth);
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(dayjs());
  };

  const weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Employee Shift Schedule
          </h2>
          
          {/* Month Navigation */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleMonthChange(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="text-center min-w-[200px]">
                <div className="font-semibold text-gray-800">
                  {currentMonth.format('MMMM YYYY')}
                </div>
                <div className="text-sm text-gray-600">
                  {startDate.format('MMM DD')} - {endDate.format('MMM DD')}
                </div>
              </div>
              
              <button 
                onClick={() => handleMonthChange(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <button 
              onClick={goToCurrentMonth}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600 bg-gray-50">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {getCalendarDays().map((day, index) => {
              const dateStr = day.format('YYYY-MM-DD');
              const isCurrentMonth = day.month() === currentMonth.month();
              const isToday = day.isSame(dayjs(), 'day');
              const shift = getShiftData(day);
              
              return (
                <div
                  key={dateStr}
                  className={`
                    min-h-[120px] p-2 border border-gray-200
                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                    ${isToday ? 'ring-2 ring-blue-500' : ''}
                  `}
                >
                  {/* Date Number */}
                  <div className={`
                    text-lg font-medium mb-2
                    ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                    ${isToday ? 'text-blue-600 font-bold' : ''}
                  `}>
                    {day.date()}
                  </div>
                  
                  {/* Shift Info */}
                  {isCurrentMonth && (
                    <div className="h-20 flex items-center justify-center">
                      {shift ? (
                        <div 
                          onClick={() => handleShiftClick(shift, day)}
                          style={{ backgroundColor: shift.color }}
                          className="rounded px-2 py-2 text-center w-full transition-all hover:shadow-md cursor-pointer space-y-1"
                        >
                          <div className="text-sm text-white font-medium">
                            {shift.shiftName}
                          </div>
                          <div className="text-xs opacity-80 text-white">
                            {shift.time}
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleShiftClick(null, day)} 
                          className="text-xs text-gray-400 text-center hover:text-gray-600"
                        >
                          No Shift
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
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
          setShowModal={setShowModal} 
          formFor={"shiftemployee"}
          titleForm={"Change Shift"}
          data={tempData}
          isUpdate={isUpdate}
          setIsUpdate={setIsUpdate}
        />
      </Modal>
    </div>
  );
}

export default ShiftEmployeeDetail;
