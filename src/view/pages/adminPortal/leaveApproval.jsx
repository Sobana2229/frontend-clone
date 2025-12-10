import LeaveEmployee from "../../component/employee/leaveEmployee";

function LeaveApproval() {
    return (
      <div 
        className="w-full h-full flex items-center justify-center overflow-hidden"
      >
        <LeaveEmployee fetchType={"all"} />
      </div>
    );
}

export default LeaveApproval;