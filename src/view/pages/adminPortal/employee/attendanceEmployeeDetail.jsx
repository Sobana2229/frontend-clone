import AttendanceCalender from "../../../component/employee/attendanceCalender";
import LeaveAttendanceEmployeePortal from "../../employee-portal/leaveAttendanceEmployeePortal";

function AttendanceEmployeeDetail({dataEmployeePersonalDetail}) {
  return (
    <>
      <LeaveAttendanceEmployeePortal employeeUuid={dataEmployeePersonalDetail?.Employee?.uuid} />
    </>
  );
}

export default AttendanceEmployeeDetail;