import { createBrowserRouter, Navigate, useNavigate } from "react-router-dom";
import WildCard from "../src/view/wildCard";
import Layout from "../src/view/layout";
import EmployeesPage from "../src/view/pages/adminPortal/employeesPage";
import Dashboard from "../src/view/pages/adminPortal/dashboard";
import PayRuns from "../src/view/pages/adminPortal/payRuns";
import Reimbursement from "../src/view/pages/adminPortal/reimbursement";
import ProofOfInvestments from "../src/view/pages/adminPortal/proofOfInvestments";
import SalaryRevision from "../src/view/pages/adminPortal/salaryRevision";
import FormSixTeen from "../src/view/pages/adminPortal/formSixTeen";
import LoanPages from "../src/view/pages/adminPortal/loan";
import GivingPages from "../src/view/pages/adminPortal/giving";
import DocumentPages from "../src/view/pages/adminPortal/documents";
import ReportPages from "../src/view/pages/adminPortal/reports";
import PayrollJournalSummary from "../src/view/pages/adminPortal/payrollJournalSummary";
import PayrollSummary from "../src/view/pages/adminPortal/payrollSummary";
import PaySummary from "../src/view/pages/adminPortal/paySummary";
import LeaveReports from "../src/view/pages/adminPortal/leaveReports";
import PayrollLOPReport from "../src/view/pages/adminPortal/payrollLOPReport";
import LOPReport from "../src/view/pages/adminPortal/lopReport";
import LoanOutstandingSummary from "../src/view/pages/adminPortal/loanOutstandingSummary";
import LoanOverallSummary from "../src/view/pages/adminPortal/loanOverallSummary";
import AdvanceSalaryOverallSummary from "../src/view/pages/adminPortal/advanceSalaryOverallSummary";
import SettingPages from "../src/view/pages/adminPortal/settings";
import FormEmployees from "../src/view/pages/adminPortal/formAddEmplyees/formEmployees";
import TimesheetPage from "../src/view/pages/adminPortal/timesheetPage";
import AttandancePage from "../src/view/pages/adminPortal/attandancePage";
import LeavesPages from "../src/view/pages/adminPortal/leavesPages";
import DetailEmployeePages from "../src/view/pages/adminPortal/employee/detailEmployeePages";
import EditTamplates from "../src/view/pages/adminPortal/settingPages/templates/editTamplates";
import LossOfPayDetails from "../src/view/pages/adminPortal/lossOfPayDetails";
import LoginPages from "../src/view/pages/auth/login";
import RegisterPage from "../src/view/pages/auth/register";
import RegisterOrganizationPage from "../src/view/pages/auth/registerOrganization";
import HomeEmployeePortal from "../src/view/pages/employee-portal/homeEmployeePortal";
import { useEffect, useState } from "react";
import authStoreManagements from "../src/store/tdPayroll/auth";
import SalaryDetailEmployeePortal from "../src/view/pages/employee-portal/salaryDetailEmployeePortal";
import InvestmentsEmployeePortal from "../src/view/pages/employee-portal/investmentsEmployeePortal";
import DocumentEmployeePortal from "../src/view/pages/employee-portal/documentEmployeePortal";
import EmployeeInvitationValidation from "../src/view/pages/auth/employeeInvitationValidation";
import SenderEmailnvitationValidation from "../src/view/pages/auth/senderEmailnvitationValidation";
import ForgotPassword from "../src/view/pages/auth/forgotPassword";
import ReimbursementEmployeePortal from "../src/view/pages/employee-portal/reimbursementEmployeePortal";
import PersonDetailPages from "../src/view/pages/adminPortal/employee/personDetailPages";
import LoanEmployeePortal from "../src/view/pages/employee-portal/loanEmployeePortal";
import LeaveAttendanceEmployeePortal from "../src/view/pages/employee-portal/leaveAttendanceEmployeePortal";
import RegularizationAttendance from "../src/view/pages/adminPortal/regularizationAttendance";
import LeaveApproval from "../src/view/pages/adminPortal/leaveApproval";
import UserInvitationValidation from "../src/view/pages/auth/userInvitationValidation";
import SubLayout from "../src/view/subLayout";
import LoanEmployeePortalDetail from "../src/view/pages/employee-portal/loanEmployeeDetailPage";
import AdvanceSalaryEmployeePortalDetail from "../src/view/pages/employee-portal/advanceSalaryEmployeeDetailPage";
import AdvanceSalaryEmployeePortal from "../src/view/pages/employee-portal/advanceSalaryEmployeePortal";
import TypeBasedSummaryReport from "../src/view/pages/adminPortal/typeBasedSummaryReport";
import LeaveSummaryReport from "../src/view/pages/adminPortal/leaveSummaryReport";
import AdvanceSalaryOutstandingSummary from "../src/view/pages/adminPortal/advanceSalaryOutstandingSummary";

const isAuthenticated = () => {
  // return localStorage.getItem("accessToken") && localStorage.getItem("refreshToken");
  return localStorage.getItem("accessToken");
};

const ProtectedRoute = ({ element, requiresPortalAccess = false }) => {
  const navigate = useNavigate();
  const { fetchMe, user } = authStoreManagements();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateAccess = async () => {
      if (!isAuthenticated()) {
        navigate("/login");
        return;
      }

      const access_token = localStorage.getItem("accessToken");
      if (access_token && !user) {
        const response = await fetchMe(access_token);
        const hasAdminAccess = response?.role?.permissions?.length > 0;
        if (requiresPortalAccess && !response?.isEnablePortalAccess) {
          navigate("/employees");
          return;
        }
        if (
          response?.isEnablePortalAccess &&
          !requiresPortalAccess &&
          !isPublicRoute(window.location.pathname) &&
          !hasAdminAccess
        ) {
          navigate("/employee-portal");
          return;
        }
      } else if (user) {
        const hasAdminAccess = user?.role?.permissions?.length > 0;
        if (requiresPortalAccess && !user?.isEnablePortalAccess) {
          navigate("/employees");
          return;
        }
        if (
          user?.isEnablePortalAccess &&
          !requiresPortalAccess &&
          !isPublicRoute(window.location.pathname) &&
          !hasAdminAccess
        ) {
          navigate("/employee-portal");
          return;
        }
      }

      setIsValidating(false);
    };

    validateAccess();
  }, []);

  // if (isValidating) {
  //     return <div>Loading...</div>;
  // }

  return element;
};

const isPublicRoute = (pathname) => {
  const publicPaths = [
    "/login",
    "/register",
    "/register-organization",
    "/forgot-password",
  ];
  return (
    publicPaths.some((path) => pathname.includes(path)) ||
    pathname.includes("/invite-employee") ||
    pathname.includes("/invite-user") ||
    pathname.includes("/invite-sender-email")
  );
};

const publicRoutes = [
  { path: "login", element: <LoginPages /> },
  { path: "register", element: <RegisterPage /> },
  { path: "forgot-password", element: <ForgotPassword /> },
  { path: "invite-employee/:token", element: <EmployeeInvitationValidation /> },
  { path: "invite-user/:token", element: <UserInvitationValidation /> },
  {
    path: "invite-sender-email/:token",
    element: <SenderEmailnvitationValidation />,
  },
];

const adminRoutes = [
  { path: "employees", element: <EmployeesPage /> },
  { path: "timesheet", element: <TimesheetPage /> },
  { path: "attandance", element: <AttandancePage /> },
  { path: "leaves", element: <LeavesPages /> },
  { path: "dashboard", element: <Dashboard /> },
  { path: "pay-runs", element: <PayRuns /> },
  // { path: "reimbursement", element: <Reimbursement /> },
  { path: "proof-of-investments", element: <ProofOfInvestments /> },
  // { path: "regularization-attendance", element: <RegularizationAttendance /> },
  // { path: "salary-revision", element: <SalaryRevision /> },
  // { path: "leave-approval", element: <LeaveApproval /> },
  { path: "form-six-teen", element: <FormSixTeen /> },
  { path: "loan", element: <LoanPages /> },
  { path: "giving", element: <GivingPages /> },
  { path: "documents", element: <DocumentPages /> },
  { path: "reports/payroll-journal-summary", element: <PayrollJournalSummary /> },
  { path: "reports/payroll-summary", element: <PayrollSummary /> },
  { path: "reports/pay-summary", element: <PaySummary /> },
  { path: "reports/lop-report", element: <LOPReport /> },
  { path: "reports/loan-outstanding-summary", element: <LoanOutstandingSummary /> },
  { path: "reports/loan-overall-summary", element: <LoanOverallSummary /> },
  { path: "reports/advance-salary-overall-summary", element: <AdvanceSalaryOverallSummary /> },
  { path: "reports/leave-reports", element: <LeaveReports /> },
  { path: "reports/leave-reports/payroll-lop-report", element: <PayrollLOPReport /> },
  { path: "reports/leave-reports/type-based-summary", element: <TypeBasedSummaryReport /> },
  { path: "reports/leave-reports/leave-summary-report", element: <LeaveSummaryReport /> },
  { path: "reports/advance-salary-outstanding-summary", element: <AdvanceSalaryOutstandingSummary /> },
  { path: "reports", element: <ReportPages /> },
  { path: "setting", element: <SettingPages /> },
  { path: "add-employees", element: <FormEmployees /> },
  { path: "los-leaves", element: <LossOfPayDetails /> },
  { path: "employees/:id", element: <DetailEmployeePages /> },
  { path: "templates/:id", element: <EditTamplates /> },
  { path: "register-organization", element: <RegisterOrganizationPage /> },
];

// admin routes with sub-sidebar
const adminRoutesWithSubSidebar = [
  { path: "reimbursement", element: <Reimbursement /> },
  { path: "salary-revision", element: <SalaryRevision /> },
  { path: "leave-approval", element: <LeaveApproval /> },
  { path: "regularization-attendance", element: <RegularizationAttendance /> },
];

// employee portal routes with sub-sidebar
const employeePortalWithSubSidebar = [
  { path: "employee-portal/loan", element: <LoanEmployeePortal /> },
  { path: "employee-portal/advance-salary", element: <AdvanceSalaryEmployeePortal /> },
]

const employeePortalRoutes = [
  { path: "employee-portal", element: <HomeEmployeePortal /> },
  {
    path: "employee-portal/salary-detail",
    element: <SalaryDetailEmployeePortal />,
  },
  {
    path: "employee-portal/salary-detail/salary-structure",
    element: <SalaryDetailEmployeePortal />,
  },
  {
    path: "employee-portal/salary-detail/payslips",
    element: <SalaryDetailEmployeePortal />,
  },
  {
    path: "employee-portal/salary-detail/annual-earnings",
    element: <SalaryDetailEmployeePortal />,
  },
  {
    path: "employee-portal/salary-detail/epf-contribution-summary",
    element: <SalaryDetailEmployeePortal />,
  },
  {
    path: "employee-portal/salary-detail/employee-state-insurance-summary",
    element: <SalaryDetailEmployeePortal />,
  },
  {
    path: "employee-portal/salary-detail/tn-labour-welfare-fund-summary",
    element: <SalaryDetailEmployeePortal />,
  },
  {
    path: "employee-portal/leave-attendance",
    element: <LeaveAttendanceEmployeePortal />,
  },
  {
    path: "employee-portal/reimbursement",
    element: <ReimbursementEmployeePortal />,
  },
  {
    path: "employee-portal/investment",
    element: <InvestmentsEmployeePortal />,
  },
  { path: "employee-portal/document", element: <DocumentEmployeePortal /> },
  // { path: "employee-portal/loan", element: <LoanEmployeePortal /> },
  {
    path: "employee-portal/profile-detail",
    element: <PersonDetailPages isEmployeePortal={true} />,
  },
  { path: "employee-portal/loan/:id", element: <LoanEmployeePortalDetail /> },
  { path: "employee-portal/advance-salary/:id", element: <AdvanceSalaryEmployeePortalDetail /> },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      ...publicRoutes,
      ...adminRoutes.map((route) => ({
        path: route.path,
        element: (
          <ProtectedRoute
            element={route.element}
            requiresPortalAccess={false}
          />
        ),
      })),

      // admin sub-sidebar routes
      {
        element: <SubLayout />,
        children: adminRoutesWithSubSidebar.map((route) => ({
          path: route.path,
          element: (
            <ProtectedRoute
              element={route.element}
              requiresPortalAccess={false}
            />
          ),
        })),
      },

      // employee portal sub-sidebar routes
      {
        element: <SubLayout />,
        children: employeePortalWithSubSidebar.map((route) => ({
          path: route.path,
          element: (
            <ProtectedRoute
              element={route.element}
              requiresPortalAccess={true}
            />
          ),
        })),
      },

      ...employeePortalRoutes.map((route) => ({
        path: route.path,
        element: (
          <ProtectedRoute element={route.element} requiresPortalAccess={true} />
        ),
      })),
      { path: "*", element: <WildCard /> },
    ],
  },
]);

export default router;
