import {
  Outlet,
  useLocation,
  matchPath,
  Navigate,
  useNavigate,
} from "react-router-dom";
import WildCard from "../view/wildCard";
import HeaderBar from "./component/headerBar";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SideBar from "./component/sideBar";
import ScrollToTop from "./component/scrollToTop";
import authStoreManagements from "../store/tdPayroll/auth";
import configurationStoreManagements from "../store/tdPayroll/configuration";
import organizationStoreManagements from "../store/tdPayroll/setting/organization";
import employeeStoreManagements from "../store/tdPayroll/employee";
import payScheduleStoreManagements from "../store/tdPayroll/setting/paySchedule";
import leaveAndAttendanceStoreManagements from "../store/tdPayroll/setting/leaveAndAttendance";
import salaryComponentStoreManagements from "../store/tdPayroll/setting/salaryComponent";
import statutoryComponentStoreManagements from "../store/tdPayroll/setting/statutoryComponent";
import taxStoreManagements from "../store/tdPayroll/setting/tax";
import loanStoreManagements from "../store/tdPayroll/loan";
import senderEmailPreferenceStoreManagements from "../store/tdPayroll/setting/senderEmailPreference";
import SimpleCalculator from "./component/simpleCalculator";
import { CustomToast } from "./component/customToast";
import employeePortalStoreManagements from "../store/tdPayroll/employeePortal";
import documentStoreManagements from "../store/tdPayroll/document";
import userAndRoleStoreManagements from "../store/tdPayroll/setting/userAndRole";
import reimbursementStoreManagements from "../store/tdPayroll/approval/reimbursement";
import payrunStoreManagements from "../store/tdPayroll/payrun";

function Layout() {
  const navigate = useNavigate();
  const {
    error: authError,
    clearError: clearAuthError,
    fetchMe,
    user,
  } = authStoreManagements();
  const { error: configurationError, clearError: clearconfigurationError } =
    configurationStoreManagements();
  const { error: organizationError, clearError: clearOrganizationError } =
    organizationStoreManagements();
  const { error: employeeError, clearError: clearEmployeeError } =
    employeeStoreManagements();
  const { error: payScheduleError, clearError: clearPayScheduleError } =
    payScheduleStoreManagements();
  const {
    error: leaveAndAttendanceError,
    clearError: clearLeaveAndAttendanceError,
  } = leaveAndAttendanceStoreManagements();
  const {
    error: salaryComponentceError,
    clearError: clearSalaryComponentceError,
  } = salaryComponentStoreManagements();
  const {
    error: statutoryComponentError,
    clearError: clearStatutoryComponentError,
  } = statutoryComponentStoreManagements();
  const { error: taxError, clearError: clearTaxError } = taxStoreManagements();
  const { error: loanError, clearError: clearLoanError } =
    loanStoreManagements();
  const {
    error: senderEmailPreferenceError,
    clearError: clearSenderEmailPreferenceError,
  } = senderEmailPreferenceStoreManagements();
  const { error: employeePortal, clearError: clearErrorEmployeePortal } =
    employeePortalStoreManagements();
  const { error: document, clearError: clearErrorDocument } =
    documentStoreManagements();
  const { error: userAndRole, clearError: clearErrorUserAndRole } =
    userAndRoleStoreManagements();
  const { error: reimbursement, clearError: clearErrorReimbursement } =
    reimbursementStoreManagements();
  const { error: payrun, clearError: clearErrorPayrun } =
    payrunStoreManagements();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userValidated, setUserValidated] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const isRootPath = location.pathname === "/";

  const errorHandlers = (error, storeName) => {
    const { pathname } = location;
    if (error == "access_token is not defined") {
      localStorage.clear();
      if (
        pathname == "/register" ||
        pathname == "/forgot-password" ||
        pathname == "/login" ||
        pathname == "/register-organization" ||
        pathname.includes("/invite-employee") ||
        pathname.includes("/invite-user") ||
        pathname.includes("/invite-sender-email")
      )
        return;
      navigate("/login");
      return;
    }
    let formatting = [];

    if (Array.isArray(error)) {
      error?.map((el) => {
        formatting.push(el?.data.message || el?.data.user || el);
      });
    } else if (error && typeof error === "object") {
      const errorMessage =
        error.message || error.user || error.error || error.msg;
      if (errorMessage) {
        formatting.push(errorMessage);
      }
    } else if (error) {
      formatting.push(
        error == "access_token is not defined" ? "Please login again" : error
      );
    }

    const msg = formatting.join(", ");
    if (!msg) return;
    if (
      (pathname == "/register" ||
        pathname == "/forgot-password" ||
        pathname == "/login" ||
        pathname == "/register-organization" ||
        pathname.includes("/invite-employee") ||
        pathname.includes("/invite-user") ||
        pathname.includes("/invite-sender-email")) &&
      msg === "You must login again."
    )
      return;

    // Handle 403 Forbidden - redirect employee to employee portal if they don't have permission
    const errorCode = error?.code;
    const isForbiddenError =
      errorCode === 403 ||
      (typeof msg === "string" &&
        (msg.toLowerCase().includes("not authorized") ||
          msg.toLowerCase().includes("forbidden")));

    if (isForbiddenError) {
      const hasAdminAccess = user?.role?.permissions?.length > 0;
      const isEmployeeOnly = user?.isEnablePortalAccess && !hasAdminAccess;

      if (isEmployeeOnly && !pathname.includes("/employee-portal")) {
        navigate("/employee-portal");
        return;
      }

      toast(<CustomToast message={`${storeName}: ${msg}`} status={"error"} />, {
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
      return;
    }

    if (error?.code === 400 || error?.code === 404) {
      toast(
        <CustomToast message={`${storeName}: ${msg}`} status={"warning"} />,
        {
          autoClose: 3000,
          closeButton: false,
          hideProgressBar: true,
          position: "top-center",
          style: {
            background: "transparent",
            boxShadow: "none",
            padding: 0,
          },
        }
      );
    } else {
      toast(<CustomToast message={`${storeName}: ${msg}`} status={"error"} />, {
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
    }
  };

  const isPublicPath = (pathname) => {
    const publicPaths = [
      "/login",
      "/register",
      "/forgot-password",
      "/register-organization",
    ];
    return (
      publicPaths.some((path) => pathname === path) ||
      pathname.includes("/invite-employee") ||
      pathname.includes("/invite-user") ||
      pathname.includes("/invite-sender-email")
    );
  };

  const isEmployeePortalPath = (pathname) => {
    return pathname.includes("/employee-portal");
  };

  const validatePortalAccess = async (currentPath) => {
    if (isPublicPath(currentPath)) return;
    const access_token = localStorage.getItem("accessToken");
    if (!access_token) {
      navigate("/login");
      return;
    }
    const response = await fetchMe(access_token);
    if (!response) return;

    const hasPortalAccess = response?.isEnablePortalAccess;
    if (hasPortalAccess) {
      if (
        user?.role?.permissions?.length == 0 &&
        user?.role == "STANDARD_EMPLOYEE"
      ) {
        navigate("/employee-portal");
        return;
      }
    } else {
      if (isEmployeePortalPath(currentPath)) {
        navigate("/employees");
        return;
      }
    }
  };

  useEffect(() => {
    if (!user && !userValidated) {
      fetchUserLogin();
    } else if (user) {
      validatePortalAccess(location.pathname);
    }
  }, [location.pathname]);

  const fetchUserLogin = async () => {
    const access_token = localStorage.getItem("accessToken");
    if (access_token) {
      const response = await fetchMe(access_token);
      setUserValidated(true);
      if (!response) {
        navigate("/login");
        return;
      }

      if (response?.isEnablePortalAccess) {
        navigate("/employee-portal");
        return;
      }
      if (response && !response?.isRegisterDone) {
        navigate("/register-organization");
        return;
      }
    }
  };

  // useEffect(() => {
  //   if (authError) {
  //     errorHandlers(authError, 'Auth');
  //     clearAuthError();
  //   }
  // }, [authError]);

  useEffect(() => {
    if (configurationError) {
      errorHandlers(configurationError, "Configuration");
      clearconfigurationError();
    }
  }, [configurationError]);

  useEffect(() => {
    if (organizationError) {
      errorHandlers(organizationError, "Organization");
      clearOrganizationError();
    }
  }, [organizationError]);

  useEffect(() => {
    if (employeeError) {
      errorHandlers(employeeError, "Employee");
      clearEmployeeError();
    }
  }, [employeeError]);

  useEffect(() => {
    if (payScheduleError) {
      errorHandlers(payScheduleError, "PaySchedule");
      clearPayScheduleError();
    }
  }, [payScheduleError]);

  useEffect(() => {
    if (leaveAndAttendanceError) {
      errorHandlers(leaveAndAttendanceError, "LeaveAndAttendance");
      clearLeaveAndAttendanceError();
    }
  }, [leaveAndAttendanceError]);

  useEffect(() => {
    if (salaryComponentceError) {
      errorHandlers(salaryComponentceError, "SalaryComponent");
      clearSalaryComponentceError();
    }
  }, [salaryComponentceError]);

  useEffect(() => {
    if (statutoryComponentError) {
      errorHandlers(statutoryComponentError, "StatutoryComponent");
      clearStatutoryComponentError();
    }
  }, [statutoryComponentError]);

  useEffect(() => {
    if (loanError) {
      errorHandlers(loanError, "Loans");
      clearLoanError();
    }
  }, [loanError]);

  useEffect(() => {
    if (taxError) {
      errorHandlers(taxError, "Tax");
      clearTaxError();
    }
  }, [taxError]);

  useEffect(() => {
    if (senderEmailPreferenceError) {
      errorHandlers(senderEmailPreferenceError, "senderEmailPreference");
      clearSenderEmailPreferenceError();
    }
  }, [senderEmailPreferenceError]);

  useEffect(() => {
    if (employeePortal) {
      errorHandlers(employeePortal, "employeePortal");
      clearErrorEmployeePortal();
    }
  }, [employeePortal]);

  useEffect(() => {
    if (document) {
      errorHandlers(document, "document");
      clearErrorDocument();
    }
  }, [document]);

  useEffect(() => {
    if (userAndRole) {
      errorHandlers(userAndRole, "userAndRole");
      clearErrorUserAndRole();
    }
  }, [userAndRole]);

  useEffect(() => {
    if (reimbursement) {
      errorHandlers(reimbursement, "reimbursement");
      clearErrorReimbursement();
    }
  }, [reimbursement]);

  useEffect(() => {
    if (payrun) {
      errorHandlers(payrun, "payrun");
      clearErrorPayrun();
    }
  }, [payrun]);

  if (isRootPath) {
    return <Navigate to="/employees" replace />;
  }

  const validPaths = [
    "/employees",
    "/dashboard",
    "/pay-runs",
    "/reimbursement",
    "/proof-of-investments",
    "/regularization-attendance",
    "/salary-revision",
    "/leave-approval",
    // "/form-six-teen",
    "/loan",
    "/giving",
    "/documents",
    "/reports",
    "/setting",
    "/add-employees",
    // "/timesheet",
    // "/attandance",
    // "/leaves",
    "/templates",
    // "/los-leaves",
    "/register-organization",
    "/invite-employee",
    "/invite-user",
    "/employee-portal",
    "/invite-sender-email",
  ];

  const isValidPath =
    validPaths.includes(location.pathname) ||
    matchPath("/add-employees/:id", location.pathname) ||
    matchPath("/employees/:id", location.pathname) ||
    matchPath("/loan/:id", location.pathname) ||
    matchPath("/advance-salary/:id", location.pathname) ||
    matchPath("/templates/:id", location.pathname) ||
    matchPath("/invite-employee/:token", location.pathname) ||
    matchPath("/invite-user/:token", location.pathname) ||
    matchPath("/invite-sender-email/:token", location.pathname) ||
    location.pathname.startsWith("/employee-portal") ||
    location.pathname.startsWith("/reports/");

  const isLoginPage = ["/login", "/register", "/forgot-password"].includes(
    location.pathname
  );

  if (isLoginPage) {
    return (
      <div className="w-full flex relative">
        <Outlet />
      </div>
    );
  }

  if (!isValidPath) {
    return (
      <div className="w-full flex relative">
        <WildCard />
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex relative overflow-hidden">
      <ScrollToTop />
      {!location.pathname.includes("/templates") &&
        location.pathname !== "/register-organization" &&
        !location.pathname.includes("/invite-employee") &&
        !location.pathname.includes("/invite-user") &&
        !location.pathname.includes("/invite-sender-email") && (
          <>
            {/* !location.pathname.includes("/employee-portal") &&  */!location.pathname.includes("/setting") && (
            <HeaderBar setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} setShowCalculator={setShowCalculator} showCalculator={showCalculator} />
          )}
            {!location.pathname.includes("/setting") && (
              <SideBar
                setIsSidebarOpen={setIsSidebarOpen}
                isSidebarOpen={isSidebarOpen}
              />
            )}
          </>
        )}
      <div className="w-full h-full flex items-center justify-center overflow-y-auto scroll-container relative">
        {showCalculator && (
          <div className="absolute bottom-0 left-3 z-50">
            <SimpleCalculator />
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
