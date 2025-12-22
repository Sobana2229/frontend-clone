import dayjs from "dayjs";

export const truncateText = (text, maxLength = 45) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

export const formatNicknameFromEmail = (email) => {
    if (!email) return "";
    return email.split("@")[0];
};

export const formatFullDateAndHours = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export const formatZohoDateFull = (dateStr) => {
    const monthMap = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };
  
    const [day, monStr, year] = dateStr.split("-");
    const month = monthMap[monStr] || "00";
  
    return `${day}/${month}/${year}`;
}
  
export const transformEligibility = (data) => {
    if (!data) return [];
    const grouped = {};
    for (const item of data) {
        if (!grouped[item.field]) {
            grouped[item.field] = [];
        }

        if (item.field === "Locations" && item.City) {
            grouped[item.field].push({
                value: item.City.id,
                label: item.City.name,
            });
        }

        if (item.field === "Departments" && item.Departement) {
            grouped[item.field].push({
                value: item.Departement.uuid,
                label: item.Departement.name,
            });
        }
    }

    return Object.keys(grouped).map((field) => ({
        field,
        value: grouped[field],
    }));
}

export const formatAttendanceResponse = (response) => {
    let result;
    if (response?.AttendanceAndDepartments?.length > 0) {
        result = response.AttendanceAndDepartments.map(item => ({
            value: item.Departement?.uuid,
            label: item.Departement?.name,
        }));
    }

    if (response?.AttendanceAndEmploymentTypes?.length > 0) {
        result = response.AttendanceAndEmploymentTypes.map(item => ({
            value: item.EmploymentType?.uuid,
            label: item.EmploymentType?.name,
        }));
    }

    if (response?.AttendanceAndUsers?.length > 0) {
        result = response.AttendanceAndUsers.map(item => ({
            value: item.Employee?.uuid,
            label: `${item?.Employee?.firstName} ${item?.Employee?.middleName} ${item?.Employee?.lastName}`,
        }));
    }

    if (response?.AttendanceAndShifts?.length > 0) {
        result = response.AttendanceAndShifts.map(item => ({
            value: item.Shift?.uuid,
            label: item.Shift?.name || item.Shift?.shiftName,
        }));
    }

    return result;
}

export const getWeekData = (weekDate) => {
    const startOfWeek = weekDate.startOf('week');
    return Array.from({ length: 7 }, (_, index) => {
        const date = startOfWeek.add(index, 'day');
        return {
            day: date.format('ddd'),
            date: date.date(),
            fullDate: date,
            isToday: date.isSame(dayjs(), 'day'),
            isCurrentMonth: date.isSame(weekDate, 'month')
        };
    });
};

export const convertWeekendScheduleFromAPI = (weekendScheduleShifts) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weeks = ['All', '1st', '2nd', '3rd', '4th', '5th'];
  const weekendSchedule = {};
  days.forEach(day => {
    weekendSchedule[day] = {};
    weeks.forEach(week => {
      weekendSchedule[day][week] = false;
    });
  });
  if (weekendScheduleShifts && Array.isArray(weekendScheduleShifts)) {
    weekendScheduleShifts.forEach(schedule => {
      if (schedule.dayOfWeek && schedule.weekNumber && schedule.scheduleType) {
        weekendSchedule[schedule.dayOfWeek][schedule.weekNumber] = schedule.scheduleType;
      }
    });
  }
  return weekendSchedule;
};

export const processEligibilityCriteria = (eligibilityCriteriaShifts) => {
    if (!eligibilityCriteriaShifts || eligibilityCriteriaShifts.length === 0) {
      return [{ field: 'Locations', value: [] }];
    }
    const grouped = eligibilityCriteriaShifts.reduce((acc, criteria) => {
      const existingField = acc.find(item => item.field === criteria.field); 
      if (existingField) {
        const value = criteria.field === 'Locations' 
          ? { value: criteria.cityId, label: criteria.cityName || `City ${criteria.cityId}` }
          : { value: criteria.departmentUuid, label: criteria.departmentName || `Department ${criteria.departmentUuid}` };
        existingField.value.push(value);
      } else {
        const value = criteria.field === 'Locations' 
          ? { value: criteria.cityId, label: criteria.cityName || `City ${criteria.cityId}` }
          : { value: criteria.departmentUuid, label: criteria.departmentName || `Department ${criteria.departmentUuid}` };
        acc.push({ field: criteria.field, value: [value] });
      }
      return acc;
    }, []);
    return grouped.length > 0 ? grouped : [{ field: 'Locations', value: [] }];
};

export const transformCriteriaBasedEmployees = (criteriaData) => {
  if (!criteriaData || criteriaData.length === 0) {
    return [{ field: 'Shift', value: [] }];
  }
  const groupedCriteria = criteriaData.reduce((acc, item) => {
    if (!acc[item.field]) {
      acc[item.field] = [];
    }
    if (item.field === 'Locations' && item.City) {
      acc[item.field].push({
        value: item.City.id,
        label: item.City.name
      });
    } else if (item.field === 'Departments' && item.Departement) {
      acc[item.field].push({
        value: item.Departement.uuid,
        label: item.Departement.name
      });
    } else if (item.field === 'Designations' && item.Designation) {
      acc[item.field].push({
        value: item.Designation.uuid,
        label: item.Designation.name
      });
    } else if (item.field === 'Shift' && item.Shift) {
      acc[item.field].push({
        value: item.Shift.uuid,
        label: item.Shift.shiftName
      });
    } else if (item.field === 'Gender') {
      acc[item.field].push({
        value: item.genderValue,
        label: item.genderValue === 'male' ? 'Male' : 'Female'
      });
    }

    return acc;
  }, {});
  
  return Object.keys(groupedCriteria).map(field => ({
    field: field,
    value: groupedCriteria[field]
  }));
};

export const transformApplicableForFromDatabase = (applicableForData) => {
  const grouped = {};
  
  applicableForData.forEach(item => {
    if (!grouped[item.field]) {
      grouped[item.field] = [];
    }
    
    if (item.field === 'Locations' && item.city) {
      grouped[item.field].push({
        value: item.cityId,
        label: item.city.name
      });
    } else if (item.field === 'Departments' && item.department) {
      grouped[item.field].push({
        value: item.departmentUuid,
        label: item.department.name
      });
    } else if (item.field === 'Shift' && item.shift) {
      grouped[item.field].push({
        value: item.shiftUuid,
        label: item.shift.shiftName
      });
    }
  });
  
  return Object.keys(grouped).map(field => ({
    field: field,
    value: grouped[field]
  }));
};

function flagEmojiToCountryCode(emoji) {
  if (!emoji) return "";
  return [...emoji]
    .map(char => String.fromCodePoint(char.codePointAt(0) - 127397))
    .join("")
    .toLowerCase();
}

export const flagImage = ({ emoji, country, className = "" }) => {
  const code = flagEmojiToCountryCode(emoji);
  return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code.toUpperCase()}.svg`;
};
export const getEmployerContributionRate = (monthlySalary) => {
  if (monthlySalary <= 500) {
    return { rate: 0, fixedAmount: 57.50 };
  } else if (monthlySalary > 500 && monthlySalary <= 1500) {
    return { rate: 10.5, fixedAmount: 0, minAmount: 57.50 };
  } else if (monthlySalary > 1500 && monthlySalary <= 2800) {
    return { rate: 9.5, fixedAmount: 0 };
  } else {
    return { rate: 8.5, fixedAmount: 0 };
  }
};

export const calculateEPFBenefits = (basicMonthly, statutoryComponentSpk, citizenCategory ) => {
  const roundToTwo = (num) => Math.round(num * 100) / 100;
  
  if (!statutoryComponentSpk || !basicMonthly) {
    return [];
  }
  const component = statutoryComponentSpk;
  const benefitItems = [];
  const isStatutoryComponents = citizenCategory ||false;
  if (!isStatutoryComponents) {
    return benefitItems;
  }

  const pfWagesMonthly = roundToTwo(basicMonthly);
  if (component.tapNumber && component.scpNumber) {
    // =================================================================
    // DISABLED: Employee Contribution (kept for future activation)
    // =================================================================
    const employeeRate = 8.5;
    const employeeMonthly = roundToTwo(pfWagesMonthly * (employeeRate / 100));
    const employeeAnnual = roundToTwo(employeeMonthly * 12);

    benefitItems.push({
      uuid: 'spk-employee',
      name: 'SPK - Employee Contribution',
      calculationType: `${employeeRate}% Basic of Wages`,
      monthly: employeeMonthly,
      annual: employeeAnnual,
      description: "Employee's contribution to Employee Provident Fund",
      type: 'employee_cost'
    });
    // =================================================================

    const employerConfig = getEmployerContributionRate(pfWagesMonthly);
    let employerMonthly = 0;
    let calculationType = '';

    if (employerConfig.fixedAmount > 0 && employerConfig.rate === 0) {
      employerMonthly = employerConfig.fixedAmount;
      calculationType = `Fixed $${employerConfig.fixedAmount}`;
    } else {
      employerMonthly = roundToTwo(pfWagesMonthly * (employerConfig.rate / 100));
      if (employerConfig.minAmount && employerMonthly < employerConfig.minAmount) {
        employerMonthly = employerConfig.minAmount;
        calculationType = `${employerConfig.rate}% Basic of Wages (min $${employerConfig.minAmount})`;
      } else {
        calculationType = `${employerConfig.rate}% Basic of Wages`;
      }
    }

    const employerAnnual = roundToTwo(employerMonthly * 12);
    benefitItems.push({
      uuid: 'spk-employer',
      name: 'SPK - Employer Contribution',
      calculationType: calculationType,
      monthly: employerMonthly,
      annual: employerAnnual,
      description: "Employer's contribution to Employee Provident Fund",
      type: 'employer_cost'
    });
  }
  
  if (component.isAdminCharges && component.adminFee) {
    const adminFee = roundToTwo(parseFloat(component.adminFee) || 0);
    let adminMonthly = 0;
    
    if (component.deductionCycle === 'Monthly') {
      adminMonthly = adminFee;
    } else if (component.deductionCycle === 'Annually') {
      adminMonthly = roundToTwo(adminFee / 12);
    }
    
    benefitItems.push({
      uuid: 'spk-admin',
      name: 'SPK Admin Charges',
      calculationType: `${component.deductionCycle} - $${adminFee}`,
      monthly: adminMonthly,
      annual: roundToTwo(adminMonthly * 12),
      description: 'Administrative charges for SPK management',
      type: 'employer_cost'
    });
  }
  
  return benefitItems;
}; 

export const checkPermission = (user, permissionPath, permissionName) => {
  // ✅ Cek role admin dulu
  const isAdmin = user?.role?.name === "SUPER_ADMIN" || user?.role?.name === "ORGANIZATION_ADMIN";
  if (isAdmin) return true;

  // ✅ Kalau bukan admin, cek permission
  const hasPermission = user?.role?.permissions?.find(
    perm => perm.path === permissionPath && perm.name === permissionName
  );
  return !!hasPermission;
};

export const sumAllHours = (attendance) => {
    if (!attendance) return '00:00';
    
    let totalMinutes = 0;

    // Prioritas: Regulation > CheckInOut (pilih salah satu, jangan sum keduanya)
    if (attendance.regulationDetails?.length > 0) {
        attendance.regulationDetails.forEach(regulation => {
            // Round decimal hours to nearest minute like formatHoursFromDecimal
            const minutes = Math.round(regulation.hoursWorked * 60);
            totalMinutes += minutes;
        });
    } else if (attendance.checkInOutRecords?.length > 0) {
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
    
    console.log('sumAllHours - Final result:', formatted, 'from', totalMinutes, 'total minutes');
    return formatted;
};


// ✅ GENERATE MONTH OPTIONS - SAMPAI BULAN SEKARANG
export const generateMonthOptions = (year = new Date().getFullYear()) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const currentMonth = new Date().getMonth(); // 0-11
  const currentYear = new Date().getFullYear();
  
  // Kalau year input sama dengan current year, filter sampai current month
  if (year === currentYear) {
    return months.slice(0, currentMonth + 1).map(month => `${month} ${year}`);
  }
  
  // Kalau year berbeda, return semua 12 bulan
  return months.map(month => `${month} ${year}`);
};

export const getWorkDatesInMonth = (workDays, monthIndex, year) => {
  const weekDaysArr = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const workDayIndices = workDays.map(d => weekDaysArr.indexOf(d));
  const dates = [];
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, monthIndex, i);
      if (workDayIndices.includes(d.getDay())) {
          dates.push(i);
      }
  }
  return dates;
}