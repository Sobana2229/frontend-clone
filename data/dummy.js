export const formStepAddEmployees = ["basic details", "salary details", "personal details", "payment informations"];
export const employeesDummy = [
    { 
        id: 1, 
        name: 'test test test', 
        employeeId: '123123123', 
        email: 'test@mail.com', 
        department: 'full stack developer', 
        designation: 'software developer',
        status: 'Active',
        isComplete: true
    },
    { 
        id: 2, 
        name: 'test 1 test 1 v', 
        employeeId: '323232', 
        email: 'test1@mail.com', 
        department: 'full stack developer', 
        designation: 'software developer',
        status: 'Active',
        isComplete: true
    },
    { 
        id: 3, 
        name: 'udin udin duin', 
        employeeId: 'oaosd123', 
        email: '', 
        department: 'full stack developer', 
        designation: 'software developer',
        status: 'Active',
        isComplete: false
    },
];

export const EmployeeHeadersoptionFilter = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
];

export const timesheetDataDummy = [
    { id: 'TD E1', name: 'mubeenbus', hours: '08:54', rate: 0, amount: '0.00', avatar: '👤' },
    { id: 'S2', name: 'Lilly Williams', hours: '00:00', rate: 0, amount: '0.00', avatar: '👩' },
    { id: 'S3', name: 'Clarkson Walter', hours: '00:00', rate: 0, amount: '0.00', avatar: '👨' },
    { id: 'TD E10', name: 'Aalijlal test G...', hours: '12:10', rate: 0, amount: '0.00', avatar: '👤' },
    { id: 'TD E11', name: 'Mubeen test ...', hours: '00:00', rate: 0, amount: '0.00', avatar: '👤' },
    { id: 'TD E013', name: 'Mubeen e...', hours: '00:00', rate: 0, amount: '0.00', avatar: '👤' },
    { id: 'TD E014', name: 'Mubeen em...', hours: '00:00', rate: 0, amount: '0.00', avatar: '👤' },
    { id: 'TD E015', name: 'Mubeen em...', hours: '00:00', rate: 0, amount: '0.00', avatar: '👤' },
    { id: 'TD E016', name: 'Mubeen e...', hours: '00:00', rate: 0, amount: '0.00', avatar: '👤' },
]

export const workLocations = {
    addressDummy: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make",
}

export const dummyLoops = [1,2,3,4,5]

export const dapartementHeaders = ["Department Name", "Department Code", "Total Employees", "Description", "Action"]

export const dapartementDummy = [
    {
        DepartmentName: "software developer",
        DepartmentCode: "9009",
        Description: "tes desv",
        TotalEmployees: 20,
    }
]

export const designationsHeaders = ["Designation Name", "Total Employees", "Action"]

export const designationsDummy = [
    {
        DepartmentName: "developer",
        TotalEmployees: 20,
    }
]

export const tabsStatutoryComponents = [
    "SPK",
];

export const tabsSalaryComponents = [
    "Earnings",
    "Deductions",
    "Benefits",
    "Reimbursements",
];

export const tabsUserAndRoles = [
    "Users",
    "Roles",
];

export const userSettingHeaders = ["User Details", "Role", "Status", ""]

export const userSettingDummy = [
    {
        userDetails: {
            name: "Aalijlal Ganteng",
            img: "https://images.unsplash.com/photo-1747515203898-2df8f083f417?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            email: "o8TtV@example.com",
        },
        role: "admin",
        status: "Active",
    }
]

export const RoleSettingHeaders = ["Role Name", "Description", ""]

export const RoleSettingDummy = [
    {
        role: "admin",
        des: "test des",
    }
]

export const tamplateTypeHeaders = ["Template Type", ""]

export const tamplateTypeDummy = [
    {
        type: {
            title: "Payslip Notification",
            des: "This email will be sent when you pay your employees."
        }
    }
]

export const tamplateSideBarSetting = ["Regular Payslips", "Final Settlement Payslip", "Salary Certificate", "Salary Revision Letter", "Bonus Letter"];

export const referenceSideBarSetting = ["Employee Portal", "Web Tabs", "FBP Preference", "Reimbursement Claims Preference", "IT Declaration Preference", "POI Preference", "Employee", "Loan", "Sender Email Preferences", "Custom Button"];

export const tabOrganisationProfiles = ["Organisation Profile"];

export const tabOverviewEmployees = ["Overview", "Personal Info", "Salary Details", "Payslips", "Leave", "Shift & Attendance", "Loans"];

export const tabApprovalSettings = ["Pay Run", "Salary Revision"];

export const tabBackupData = ["Backup Data", "Backup Audit Trail"];

export const backupDataHeaders = ["Backup Time", "	User Name", "File Type", "Export Status", "Download Link"];

export const modalRestrictionEmployee = "You cannot add new employees directly in Zoho Payroll since the Zoho People integration is enabled. Please add the employee in Zoho People so that the employee can be fetched in Zoho Payroll."

export const modalConfirmDeleteWorkLocation = "Are you sure you want to permanently delete this work location? This action cannot be undone."

export const modalConfirmDeleteEarning = 'You are about to delete the Earning "Basic". This cannot be undone. Are you sure you want to proceed?'

export const templateRegularPayslipsList = ["Elegant Template", "Standard Template", "Mini Template", "Simple Template", "Lite Template", "Simple Spreadsheet Template", "Professional Template"];

export const templateRegularPayslipsEdit = ["Show PAN", "Show YTD Values", "Show Bank Account Number", "Show Work Location", "Show Department", "Show Designation", "Show Benefits Summary"];

export const templateFinalSettlementPayslipList= ["Final Settlement Template"];

export const salaryCertificateTemplate= ["Standard Template"];

export const salaryRevisionLetterTemplate= ["Standard Template"];

export const bonusLetterTemplate= ["Standard Template"];

export const earningElegantTemplate= [
    { label: 'Basic', amount: 60000, ytd: 120000 },
    { label: 'House Rent Allowance', amount: 60000, ytd: 120000 },
    { label: 'Conveyance Allowance', amount: 0, ytd: 0 },
    { label: 'Fixed Allowance', amount: 0, ytd: 0 },
    { label: 'Bonus', amount: 0, ytd: 0 },
    { label: 'Commission', amount: 0, ytd: 0 },
    { label: 'Leave Encashment', amount: 0, ytd: 0 },
];

export const deductionsElegantTemplate= [
    { label: 'Income Tax', amount: 22130, ytd: 265554 },
    { label: 'EPF Contribution', amount: 25, ytd: 50 },
    { label: 'Voluntary Provident Fund', amount: 25, ytd: 50 },
];

export const benefitsDataElegantTemplate = [
    {
      benefit: "EPF Contribution",
      employeeContribution: "₹25.00",
      employeeYTD: "₹50.00",
      employerContribution: "₹25.00",
      employerYTD: "₹50.00"
    },
    {
      benefit: "EPS Contribution",
      employeeContribution: "₹0.00",
      employeeYTD: "₹0.00",
      employerContribution: "₹25.00",
      employerYTD: "₹50.00"
    },
    {
      benefit: "Employer EDLI Contribution",
      employeeContribution: "₹0.00",
      employeeYTD: "₹0.00",
      employerContribution: "₹25.00",
      employerYTD: "₹50.00"
    },
    {
      benefit: "Employer EPF Admin Charges",
      employeeContribution: "₹0.00",
      employeeYTD: "₹0.00",
      employerContribution: "₹25.00",
      employerYTD: "₹50.00"
    },
    {
      benefit: "Employee State Insurance",
      employeeContribution: "₹0.00",
      employeeYTD: "₹0.00",
      employerContribution: "₹25.00",
      employerYTD: "₹50.00"
    },
    {
      benefit: "Labour Welfare Fund",
      employeeContribution: "₹0.00",
      employeeYTD: "₹0.00",
      employerContribution: "₹25.00",
      employerYTD: "₹50.00"
    },
    {
      benefit: "Voluntary Provident Fund",
      employeeContribution: "₹25.00",
      employeeYTD: "₹50.00",
      employerContribution: "₹25.00",
      employerYTD: "₹50.00"
    }
];

export const employeeGender = ["male", "female", "other"];
export const employeeCitizenCategory = ["Brunei Citizen", "Permanent", "Foreigner"];
export const employeeGenderOptions = [
    {value: "male", label: "Male"},
    {value: "female", label: "Female"},
    {value: "other", label: "Other"},
];

export const employeeLoanEarning = ["Salary Advance", "Employee Loan"];

export const employeeLoanEarningOptions = [
    { label: "Salary Advance", value: "true" },
    { label: "Employee Loan", value: "false" },
];

export const tableHeadEmployee = [
    "action",
    "EMPLOYEE NAME",
    "WORK EMAIL",
    "DEPARTMENT",
    "EMPLOYEE STATUS",
    "PORTAL ACCESS",
];

export const employeePageOptions = [
    "Import data",
    "Export data",
];

export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const moduleLeaveAndAttendance = [
    // success
    // {
    //     id: 'leaveTypes',
    //     title: 'Leave Types',
    //     description: '',
    //     status: 'completed',
    //     buttons: [
    //         { text: 'Configure Now', type: 'primary' },
    //         { text: 'Mark as Completed', type: 'secondary' }
    //     ]
    // },
    {
        id: 'leave-types',
        title: 'Leave Types',
        description: 'Configure Leave Type schedules and manage public Leave Types for your organization.',
        status: 'pending',
        buttons: [
            { text: 'Configure Now', type: 'primary' },
            { text: 'Mark as Completed', type: 'secondary' }
        ]
    },
    {
        id: 'holiday',
        title: 'Holiday Management',
        
        // complated
        // description: '',
        // status: 'completed',

        // uncompleted
        description: 'Configure holiday schedules and manage public holidays for your organization.',
        status: 'pending',
        buttons: [
            { text: 'Configure Now', type: 'primary' },
            { text: 'Mark as Completed', type: 'secondary' }
        ]
    },
    {
        id: 'shift',
        title: 'Shift Management',
        description: 'Customize work shift times, total checked-in hours, workday duration, and Shift regularisation.',
        status: 'pending',
        buttons: [
            { text: 'Configure Now', type: 'primary' },
            { text: 'Do It Later', type: 'secondary' }
        ]
    },
    {
        id: 'attendance',
        title: 'Attendance Management',
        description: 'Customize work shift times, total checked-in hours, workday duration, and attendance regularisation.',
        status: 'pending',
        buttons: [
            { text: 'Configure Now', type: 'primary' },
            { text: 'Do It Later', type: 'secondary' }
        ]
    },
    {
        id: 'preferences',
        title: 'Setup Preferences',
        description: 'Define the attendance cycle, report generation day, and choose to include leave encashment details for pay runs.',
        status: 'pending',
        buttons: [
            { text: 'Configure Now', type: 'primary' }
        ]
    },
    {
        id: 'balance',
        title: 'Employee Leave Balance',
        description: 'Upload your employees\' leave balances from your previous records to continue from where you left off.',
        status: 'pending',
        buttons: [
            { text: 'Import', type: 'primary' },
            { text: 'Do It Later', type: 'secondary' }
        ]
    }
];

export const holidayLeaveAndAttandanceHeaders = ["Holiday Name", "Date", "Description", ""]

export const shiftLeaveAndAttandanceHeaders = ["Shift name", "Shift time", ""]

export const attendanceLeaveAndAttandanceHeaders = ["Settings name", "Settings type", "Total hours calculation", ""]

export const attendanceBreakLeaveAndAttandanceHeaders = ["Break name", "Time range", "Type", "Status", ""]

export const leaveTypeHolidayLeaveAndAttandanceHeaders = ["Name", "Date", "Location", "Shifts", "Classification", "Description", ""]

// export const attendanceLeaveAndAttandanceSidebar = ["Specific Policies", "Attendance Policy", "Break"]
export const attendanceLeaveAndAttandanceSidebar = ["Specific Policies", "Break"]

export const leaveTypesLeaveAndAttandanceSidebar = ["Leave and Policy", "Holiday"]

export const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
];

export const availableShifts = [
    "General", "Full Time", "Lenient Shift", "Freelancer", 
    "FTP Testing Shift", "Strict Shift (Late)", "Part Time"
];

export const leaveTypeLeaveAndAttandanceHeaders = ["Leave Name", "Leave type",	"Unit",	"Status", ""]

export const holidayLeaveAndAttandanceDummy = [
    {
        uuid: "120893aksdjaksjd",
        name: "idul fitri",
        date: "19/08/2025",
        description: "descirpsioon",
    }
]

export const fileOptions = ["Import", "CSV", "XLS", "XLSX"];

export const payrunOptionDraft = ["Delete Pay Run", "Show Downloads"];

export const LeaveAndAttandanceLocations = [
    { value: "all", label: "All Locations" },
    { value: "head-office", label: "Head Office" },
    { value: "branch-1", label: "Branch 1" },
    { value: "branch-2", label: "Branch 2" },
    { value: "warehouse", label: "Warehouse" },
    { value: "warehouseA", label: "WarehouseA" },
    { value: "warehousBe", label: "WarehouseB" },
];

export const exportTypeOptionPayrun = [
    { value: 'employee_payrun_details', label: 'Employee Pay Run Details' },
    { value: 'one_time_earnings_deductions', label: 'One Time Earnings and Deductions' },
    { value: 'lop_details', label: 'LOP Details' },
    { value: 'payrun_payment_details', label: 'Payrun Payment Details' },
    { value: 'tds_worksheet_report', label: 'TDS Worksheet Report' }
];

export const exportFormatOptionPayrun = [
    { value: 'XLS (Microsoft Excel 1997-2004 Compatible)', label: 'XLS (Microsoft Excel 1997-2004 Compatible)' },
    { value: 'XLSX (Microsoft Excel 2007-2019)', label: 'XLSX (Microsoft Excel 2007-2019)' },
    { value: 'CSV (Comma Separated Values)', label: 'CSV (Comma Separated Values)' },
    { value: 'PDF (Portable Document Format)', label: 'PDF (Portable Document Format)' }
];

export const exitReasonPayruns = [
    'Terminated By Employer',
    'Termination By Death',
    'Termination by Disability',
    'Resigned By Employee',
];

export const subComponentsEmployee = [
  { salaryGroup: "$500.00 and below", contributionRate: "8.5%" },
  { salaryGroup: "$500.01 – $1,500.00", contributionRate: "8.5%" },
  { salaryGroup: "$1,500.01 – $2,800.00", contributionRate: "8.5%" },
  { salaryGroup: "$2,800.01 and above", contributionRate: "8.5%" }
]

export const subComponentsEmployer = [ 
  { salaryGroup: "$500.00 and below", contributionRate: "Set at $57.50" },
  { salaryGroup: "$500.01 – $1,500.00", contributionRate: "10.5% (min $57.50)" },
  { salaryGroup: "$1,500.01 – $2,800.00", contributionRate: "9.5%" },
  { salaryGroup: "$2,800.01 and above", contributionRate: "8.5%" }
]

export const dropDownSalaryComponents = [ "Earnings", "Deductions", "Benefits", "Reimbursements" ]

export const salaryComponentEarningHeaders = ["Name", "Earning Type", "Calculation Type", "Consider for SPK", "Status", ""]

export const salaryComponentReimbursementHeaders = ["Name", "Reimbursement Type", "Maximum Reimbursable Amount", "Status", ""]

export const loanHeaders = [
  "EMPLOYEE NAME", 
  "LOAN NUMBER", 
  "LOAN NAME", 
  "STATUS", 
  "LOAN AMOUNT", 
  "AMOUNT REPAID", 
  "REMAINING AMOUNT",
  "             " // For actions column
];

export const advanceSalaryHeaders = ["Employee Name", "Advance Salary Number", "Advance Salary Name", "Status", "Advance Salary Amount", "", "Remaining Amount"]

export const loanDetailHeaders = ["INSTALMENT STATUS", "INSTALMENT DATE", "AMOUNREPAID", "TOTAL AMOUNT REPAID", "REMAINING AMOUNT"]

export const regulationEmployeeHeaders = ["Employee Nae", "From", "To", "status", ""]

export const leaveEmployeeHeaders = ["employee name", "leave dates"," units ", "no. of days", "leave type", "reason for leave", "status"]

export const loanPaymentModeList = ["Cheque", "Cash", "Bank Transfer", "Others"]

export const payslipEmployeePortalHeaders = ["Month", "Gross Pay", "Reimbursements", "Deductions", "Take Home", "Payslips"]

export const fieldOptionsEligibilityCriteria = ['Locations', 'Departments'];

export const fieldOptionsCriteriaBasedEmployees = ['Shift'];

export const applicableToOptions = ["Shift"];

export const senderEmailSettingHeaders = ["Name", "Email Address", "", ""]

export const salaryDetailPortalConfig = [
    {
        id: "salary-structure",
        label: "Salary Structure",
        hasDropdown: false
    },
    {
        id: "payslips", 
        label: "Payslips",
        hasDropdown: false
    },
    {
        id: "annual-earnings",
        label: "Annual Earnings", 
        hasDropdown: false
    },
    {
        id: "epf-contribution",
        label: "EPF Contribution Summary",
        hasDropdown: true,
        subTabs: [
            "EPF Contribution Summary",
            "Employee State Insurance Summary", 
            "TN Labour Welfare Fund Summary"
        ]
    }
];

export const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export const salaryComponentEarningType = [
    "Basic", 
    "Custom Allowance", 
    "Bonus", 
    "House Rent Allowance", 
    "Dearness Allowance", 
    "Conveyance Allowance", 
    "Commission", 
    "Children Education Allowance",
    "Hostel Expenditure Allowance",
    "Transport Allowance",
    "Helper Allowance",
    "Travelling Allowance",
    "Uniform Allowance",
    "Daily Allowance",
    "City Compensatory Allowance",
    "Overtime Allowance",
    "Telephone Allowance",
    "Fixed Medical Allowance",
    "Project Allowance",
    "Food Allowance",
    "Holiday Allowance",
    "Entertainment Allowance",
    "Food Coupon",
    "Gift Coupon",
    "Research Allowance",
    "Books And Periodicals Allowance",
    "Shift Allowance",
    "Fuel Allowance",
    "Driver Allowance",
    "Leave Travel Allowance",
    "Vehicle Maintenance Allowance",
    "Telephone And Internet Allowance"
]

export const monthlyAttributesSalaryComponent = [
    'basicMonthly',
    'hraMonthly', 
    'dearnessAllowanceMonthly',
    'conveyanceAllowanceMonthly',
    'childrenEducationAllowanceMonthly',
    'hostelExpenditureAllowanceMonthly',
    'transportAllowanceMonthly',
    'helperAllowanceMonthly',
    'travellingAllowanceMonthly',
    'uniformAllowanceMonthly',
    'dailyAllowanceMonthly',
    'cityCompensatoryAllowanceMonthly',
    'overtimeAllowanceMonthly',
    'telephoneAllowanceMonthly',
    'fixedMedicalAllowanceMonthly',
    'projectAllowanceMonthly',
    'foodAllowanceMonthly',
    'holidayAllowanceMonthly',
    'entertainmentAllowanceMonthly',
    'foodCouponMonthly',
    'researchAllowanceMonthly',
    'booksAndPeriodicalsAllowanceMonthly',
    'fuelAllowanceMonthly',
    'driverAllowanceMonthly',
    'leaveTravelAllowanceMonthly',
    'vehicleMaintenanceAllowanceMonthly',
    'telephoneAndInternetAllowanceMonthly',
    'shiftAllowanceMonthly',
    'fixedAllowanceMonthly',
]

export const salaryComponentMonthlyMap = {
  basicMonthly: "Basic",
  hraMonthly: "House Rent Allowance",
  dearnessAllowanceMonthly: "Dearness Allowance",
  conveyanceAllowanceMonthly: "Conveyance Allowance",
  childrenEducationAllowanceMonthly: "Children Education Allowance",
  hostelExpenditureAllowanceMonthly: "Hostel Expenditure Allowance",
  transportAllowanceMonthly: "Transport Allowance",
  helperAllowanceMonthly: "Helper Allowance",
  travellingAllowanceMonthly: "Travelling Allowance",
  uniformAllowanceMonthly: "Uniform Allowance",
  dailyAllowanceMonthly: "Daily Allowance",
  cityCompensatoryAllowanceMonthly: "City Compensatory Allowance",
  overtimeAllowanceMonthly: "Overtime Allowance",
  telephoneAllowanceMonthly: "Telephone Allowance",
  fixedMedicalAllowanceMonthly: "Fixed Medical Allowance",
  projectAllowanceMonthly: "Project Allowance",
  foodAllowanceMonthly: "Food Allowance",
  holidayAllowanceMonthly: "Holiday Allowance",
  entertainmentAllowanceMonthly: "Entertainment Allowance",
  foodCouponMonthly: "Food Coupon",
  researchAllowanceMonthly: "Research Allowance",
  booksAndPeriodicalsAllowanceMonthly: "Books And Periodicals Allowance",
  fuelAllowanceMonthly: "Fuel Allowance",
  driverAllowanceMonthly: "Driver Allowance",
  leaveTravelAllowanceMonthly: "Leave Travel Allowance",
  vehicleMaintenanceAllowanceMonthly: "Vehicle Maintenance Allowance",
  telephoneAndInternetAllowanceMonthly: "Telephone And Internet Allowance",
  shiftAllowanceMonthly: "Shift Allowance",
  fixedAllowanceMonthly: "Fixed Allowance" // ← ini aku mapping ke “Custom Allowance”
};

export const statusShowGlobal = {
  draft: "Draft",
  reject: "Reject",
  paymentDue: "Payment Due",
  paid: "Paid",
};

export const payrunEarningOptions = [
    { value: "bonus", label: "Bonus" },
    { value: "commission", label: "Commission" }, 
    { value: "leaveEncashment", label: "Leave Encashment" }
];

export const tabsPayRuns = ["Run Payroll", "Payroll History"];

export const payRunHeaders = ["Payment Date", "Payroll Type", "Details", "", ""];

export const payRundummyData = [
    {
        date: "01/09/2025",
        payrollType: "Payroll Type",
        details: "Details"
    },
    {
        date: "01/09/2025",
        payrollType: "Payroll Type",
        details: "Details"
    }
];

export const payRunEmployeedummyData = [
    {
      id: "LAL21",
      name: "ijlal alim rafif",
      code: "LAL21",
      paidDays: 30,
      grossPay: 761.00,
      deductions: 0.00,
      taxes: 0.00,
      benefits: 72.00,
      reimbursements: 0.00,
      netPay: 689.00
    },
    {
      id: "JOKO12", 
      name: "joko koko jojo",
      code: "JOKO12",
      paidDays: 30,
      grossPay: 2083.00,
      deductions: 0.00,
      taxes: 0.00,
      benefits: 0.00,
      reimbursements: 0.00,
      netPay: 2083.00
    }
];

export const payRunEmployeeHeaders = [
    "Employee Name",
    "Paid Days",
    "Monthly CTC",
    "Earnings",
    "Reimbursements",
    "Gross Pay",
    "Deductions",
    "Benefits",
    "Net Pay",
    ""
]
			 	
export const reimbursementEmployeePortalHeaders = [
    "Claim Number",
    "Reimbursement Name",
    "Claim Date",
    "Total Bill Amount",
    "Approved Amount",
    "Status",
    ''
]

export const loanEmployeePortalHeaders = [
    "Loan Number",
    "Loan Name",
    "Status",
    "Loan Amount",
    "Amount Repaid",
    "Remaining Amount",
    
]

export const advanceSalaryEmployeePortalHeaders = [
    "Adv. Salary Number",
    "Adv. Salary Name",
    "Status",
    "Adv. Salary Amount",
    "Amount Repaid",
    "Remaining Amount",
]

export const reimbursementEmployeeApprovalHeaders = [
    "claim number",
    "employee name",
    "submitted date",
    "claim amount",
    "approved amount",
    "status",
]

export const epfContriButionHeaders = {
    headers_1: ["Your Contribution", "Employer Contribution"],
    headers_2: ["Month", "EPF", "VPF", "EPF", "EPS"]
}

export const reimbursementEmployeeApprovalBillHeaders = [
    "Reimbursement Type",
    "Bill Date",
    "Bill Number",
    "Attachments",
    "Claim Amount",
    "Approved Amount",
    ''
]

export const getDefaultWeekendSchedule = () => ({
  Sunday: { All: false, '1st': false, '2nd': false, '3rd': false, '4th': false, '5th': false },
  Monday: { All: false, '1st': false, '2nd': false, '3rd': false, '4th': false, '5th': false },
  Tuesday: { All: false, '1st': false, '2nd': false, '3rd': false, '4th': false, '5th': false },
  Wednesday: { All: false, '1st': false, '2nd': false, '3rd': false, '4th': false, '5th': false },
  Thursday: { All: false, '1st': false, '2nd': false, '3rd': false, '4th': false, '5th': false },
  Friday: { All: false, '1st': false, '2nd': false, '3rd': false, '4th': false, '5th': false },
  Saturday: { All: false, '1st': false, '2nd': false, '3rd': false, '4th': false, '5th': false }
});

export const allLeaveTypesAttendace  = [
    'Annual Leaves',
    'Brunei Public Holiday', 
    'Bruneian Sick leave',
    'Casual Leave',
    'Maternity Leave',
    'Sick Leave',
    'Study Leave',
    'Absent'
];

export const leaveTypeOptions = [
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "Unpaid" },
];

export const allocationOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
];

export const validateField = (name, value) => {
    switch (name) {
        case 'firstName':
        case 'lastName':
        case 'companyName':
            return value.trim().length > 0;
        case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        case 'phoneNumber':
            return value.trim().length > 0 && value.trim().length <= 7;
        case 'password':
            return Object.values(passwordErrors).every(valid => valid);
        default:
            return false;
    }
};

export const OrganisationDateFormat = [ "DD/MM/YYYY [13/09/2025]", "YYYY-MM-DD [2025/09/13]", "DD Month YYYY [13 September 2025]" ]
export const accountTypeBankDetails = [ "Business Current Account", "Current Account", "Corporate Deposit Account", "Foreign Currency Account", "Savings Account" ]
export const employeeDifferentlyAbledType = [ "None", "Visual", "Hearing", "Speech" ]

export const flexibleBenefitComponents = [
  {
    id: 1,
    name: "Vehicle Maintenance Reimbursement",
    maxAmount: 6000,
    isRestricted: true
  },
  {
    id: 2,
    name: "Laptop",
    maxAmount: 2000,
    isRestricted: true
  },
  {
    id: 3,
    name: "Dress",
    maxAmount: 500,
    isRestricted: true
  }
];

// Urutan permission yang diinginkan
export const permissionOrder = [
  "Full Access",
  "View",
  "Create",
  "Edit",
  "Delete"
  // tambahkan nama permission lain, misal: "Approve", "Pay", "Upload"
];


export const reportSections = [
    {
        title: "Payroll Overview",
        items: [
            "Payroll Journal Summary",
            "Payroll Summary",
            "Salary Register - Monthly",
            "Salary Statement",
            "Pay Summary",
            "LOP Summary",
            "Variable Pay Earnings Report",
            "Scheduled Pay Earnings Report",
        ],
    },
    {
        title: "Statutory Reports",
        items: [
            "SPK Summary",
            "Employee Contribution",
            "Employer Contribution",
        ],
    },
    {
        title: "Loan Reports",
        items: [
            "Loan Outstanding Summary",
            "Loan Overall Summary",
        ],
    },
    {
        title: "Advance Salary Reports",
        items: [
            "Advance Salary Outstanding Summary",
            "Advance Salary Overall Summary",
        ],
    },
    {
        title: "Employee Reports",
        items: [
            "Compensation Details",
            "Reimbursement Summary",
            "Full and Final Settlement",
            "Salary Revision Report",
            "Salary Revision History",
            "Salary Withhold Report",
        ],
    },
    {
        title: "Attendance Reports",
        items: [
            "Attendance Summary Report",
            "Employee daily attendance status report",
            "Attendance Status Report",
            "Daily attendance status",
            "Attendance Absent Report",
            "Attendance Overtime Report",
        ],
    },
    {
        title: "Leave Reports",
        items: [
            "Payroll LOP Report",
            "LOP Report",
            "Leave Encashment Report",
            "Leave type based summary Report",
            "Leave summary Report",
            "Leave Balance Report",
        ],
    },
    {
        title: "Files",
        items: [
            "Personal Uploads",
            "Acknowledgement Receipts",
        ],
    },
];

export const optionFiscal = {
    'january-december': 'January – December',
    'february-january': 'February – January',
    'march-february': 'March – February',
    'april-march': 'April – March',
    'may-april': 'May – April',
    'june-may': 'June – May',
    'july-june': 'July – June',
    'august-july': 'August – July',
    'september-august': 'September – August',
    'october-september': 'October – September',
    'november-october': 'November – October',
    'december-november': 'December – November',
};

export const annualEarningsDummy = {
    earningsData: [
        {
            component: 'Basic',
            ytdTotal: 2800000.00,
            june: 40000.00,
            may: 40000.00,
            april: 40000.00,
            march: 40000.00
        },
        {
            component: 'House Rent Allowance',
            ytdTotal: 56000.00,
            june: 8000.00,
            may: 8000.00,
            april: 8000.00,
            march: 8000.00
        },
        {
            component: 'Conveyance Allowance',
            ytdTotal: 35000.00,
            june: 5000.00,
            may: 5000.00,
            april: 5000.00,
            march: 5000.00
        },
        {
            component: 'Fixed Allowance',
            ytdTotal: 35175.00,
            june: 5025.00,
            may: 5025.00,
            april: 5025.00,
            march: 5025.00
        },
        {
            component: 'Unclaimed Vehicle Maintenance Reimbursement',
            ytdTotal: 42000.00,
            june: 6000.00,
            may: 6000.00,
            april: 6000.00,
            march: 6000.00
        },
        {
            component: 'Unclaimed Dress',
            ytdTotal: 3500.00,
            june: 500.00,
            may: 500.00,
            april: 500.00,
            march: 500.00
        },
        {
            component: 'Transport Allowance %',
            ytdTotal: 28000.00,
            june: 4000.00,
            may: 4000.00,
            april: 4000.00,
            march: 4000.00
        },
        {
            component: 'Telephone Allowance %',
            ytdTotal: 2800.00,
            june: 400.00,
            may: 400.00,
            april: 400.00,
            march: 400.00
        }
    ],
    contributionsData: [
        {
            component: 'SPK Employer Contribution',
            ytdTotal: 33600.00,
            june: 4800.00,
            may: 4800.00,
            april: 4800.00,
            march: 4800.00
        },
        {
            component: 'SPK Employee Contribution',
            ytdTotal: 33600.00,
            june: 4800.00,
            may: 4800.00,
            april: 4800.00,
            march: 4800.00
        },
        {
            component: 'Zakath Sal',
            ytdTotal: 2000.00,
            june: 0.00,
            may: 0.00,
            april: 2000.00,
            march: 0.00
        }
    ],
    deductionsData: [
        {
            component: 'Business',
            ytdTotal: 10000.00,
            june: 2500.00,
            may: 2500.00,
            april: 2500.00,
            march: 2500.00
        },
        {
            component: 'Loan Deduction',
            ytdTotal: 15000.00,
            june: 3750.00,
            may: 3750.00,
            april: 3750.00,
            march: 3750.00
        }
    ],
    taxesData: [
        {
            component: 'Professional Tax',
            ytdTotal: 1250.00,
            june: 0.00,
            may: 0.00,
            april: 1250.00,
            march: 0.00
        },
        {
            component: 'Income Tax',
            ytdTotal: 8000.00,
            june: 2000.00,
            may: 2000.00,
            april: 2000.00,
            march: 2000.00
        }
    ],
    totalsData: {
        totalEarnings: {
            ytdTotal: 3002475.00,
            june: 68925.00,
            may: 68925.00,
            april: 68925.00,
            march: 68925.00
        },
        totalStatutories: {
            ytdTotal: 69200.00,
            june: 9600.00,
            may: 9600.00,
            april: 11600.00,
            march: 9600.00
        },
        totalDeductions: {
            ytdTotal: 25000.00,
            june: 6250.00,
            may: 6250.00,
            april: 6250.00,
            march: 6250.00
        },
        totalTaxes: {
            ytdTotal: 9250.00,
            june: 2000.00,
            may: 2000.00,
            april: 3250.00,
            march: 2000.00
        },
        takeHome: {
            ytdTotal: 2899025.00,
            june: 51075.00,
            may: 51075.00,
            april: 47825.00,
            march: 51075.00
        }
    }
}

export const loanEmployeePortalData = [
    {
        loanNumber: "LOAN - 00008",
        loanName: "Business",
        status: "Open",
        loanAmount: 35000,
        amountRepaid: 0,
        remainingAmount: 35000
    },
    {
        loanNumber: "LOAN - 00007",
        loanName: "Business",
        status: "Open",
        loanAmount: 30000,
        amountRepaid: 0,
        remainingAmount: 30000
    },
    {
        loanNumber: "LOAN - 00006",
        loanName: "Business",
        status: "Open",
        loanAmount: 20000,
        amountRepaid: 0,
        remainingAmount: 20000
    },
    {
        loanNumber: "LOAN - 00005",
        loanName: "Car",
        status: "Open",
        loanAmount: 40000,
        amountRepaid: 0,
        remainingAmount: 40000
    },
    {
        loanNumber: "LOAN - 00004",
        loanName: "Car",
        status: "Open",
        loanAmount: 85000,
        amountRepaid: 0,
        remainingAmount: 85000
    },
    {
        loanNumber: "LOAN - 00003",
        loanName: "Bike",
        status: "Open",
        loanAmount: 45000,
        amountRepaid: 0,
        remainingAmount: 45000
    },
    {
        loanNumber: "LOAN - 00002",
        loanName: "Gold",
        status: "Open",
        loanAmount: 30000,
        amountRepaid: 0,
        remainingAmount: 30000
    },
    {
        loanNumber: "LOAN - 00001",
        loanName: "Home",
        status: "Open",
        loanAmount: 70000,
        amountRepaid: 0,
        remainingAmount: 70000
    }
];

export const spkContributionDataDummy = [
    {
        month: "Apr 2025",
        yourSpkContribution: 4800.00,
        spkEmployerContribution: 1178.00,
        totalContribution: 5978.00
    },
    {
        month: "May 2025",
        yourSpkContribution: 4800.00,
        spkEmployerContribution: 1178.00,
        totalContribution: 5978.00
    },
    {
        month: "Jun 2025",
        yourSpkContribution: 4800.00,
        spkEmployerContribution: 1178.00,
        totalContribution: 5978.00
    },
    {
        month: "Jul 2025",
        yourSpkContribution: 4800.00,
        spkEmployerContribution: 1178.00,
        totalContribution: 5978.00
    },
    {
        month: "Aug 2025",
        yourSpkContribution: 4800.00,
        spkEmployerContribution: 1178.00,
        totalContribution: 5978.00
    },
    {
        month: "Sep 2025",
        yourSpkContribution: 4800.00,
        spkEmployerContribution: 1178.00,
        totalContribution: 5978.00
    },
    {
        month: "Oct 2025",
        yourSpkContribution: 4800.00,
        spkEmployerContribution: 1178.00,
        totalContribution: 5978.00
    },
    {
        month: "Nov 2025",
        yourSpkContribution: 4800.00,
        spkEmployerContribution: 1178.00,
        totalContribution: 5978.00
    },
];
export const spkContributionHeadersDummy = [
    "Month",
    "Your SPK Contribution",
    "SPK Employer Contribution",
    "Total Contribution"
];

export const spkTotalDummy = {
    month: "Total",
    yourSpkContribution: 33600.00,
    spkEmployerContribution: 8246.00,
    totalContribution: 41846.00
};