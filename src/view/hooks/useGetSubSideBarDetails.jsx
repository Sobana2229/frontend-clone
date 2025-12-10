import { Briefcase, Calendar, CalendarCheck, Receipt, WalletIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const useGetSubSidebarDetails = () => {
    const pathname = useLocation().pathname;
    // console.log("pathName bossss", pathname)
    const [headers, setHeaders] = useState("Home");
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        if (
            pathname === "/employee-portal/loan" ||
            pathname === "/employee-portal/advance-salary"
        ) {
            setHeaders("Benefits");
            setMenuItems([
                { title: "Loans", to: "/employee-portal/loan", icon: <Receipt size={20} /> },
                { title: "Advance Salary", to: "/employee-portal/advance-salary", icon: <WalletIcon size={20} /> },
            ]);
        }
    
        else if (
            pathname ==="/reimbursement" ||
            pathname ==="/salary-revision" ||
            pathname ==="/leave-approval" ||
            pathname ==="/regularization-attendance"
        ) {
            setHeaders("Approvals");
            setMenuItems([
                { title: "Reimbursement", to: "/reimbursement", icon: <Receipt size={20} />, addButtonLabel: "Add Claims", headerLabel: "Claims" },
                { title: "Salary Revision", to: "/salary-revision", icon: <Briefcase size={20} /> },
                { title: "Leave", to: "/leave-approval", icon: <Calendar size={20} />, addButtonLabel: "Leave Request", headerLabel: "Leave Requests" },
                { title: "Attendance", to: "/regularization-attendance", icon: <CalendarCheck size={20} />, addButtonLabel: "Add Regularization", headerLabel: "Regularization Requests" },
            ]);
        }
        
        // ✅ Employee Portal: Handle leave-attendance path for regularization
        else if (pathname === "/employee-portal/leave-attendance") {
            setHeaders("Leave & Attendance");
            setMenuItems([
                { title: "Attendance", to: "/employee-portal/leave-attendance", icon: <CalendarCheck size={20} />, addButtonLabel: "Add Regularization", headerLabel: "Regularization Requests" },
            ]);
        }
    }, [])

    return { headers, menuItems };
};
