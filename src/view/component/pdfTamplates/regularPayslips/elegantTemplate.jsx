import { useEffect, useRef, useState } from "react";
import { salaryComponentMonthlyMap } from "../../../../../data/dummy";

function ElegantTemplate({
  imgUrl = "",
  availableDetailTamplate,
  logoScale,
  isEmployeePortal = false,
  data = {},
  employee = {}
}) {
  const contentRef = useRef(null);
  const [totalEarnings, setTotalEarnings] = useState(null);
  const [totalDeductions, setTotalDeductions] = useState(null);

  // Enhanced data mapper
  const mapEmployeePersonalDetail = (detail) => {
    const emp = detail?.Employee || {};
    const org = detail?.Organization || {};

    // Helper function to format address
    const formatAddress = (
      addressLine1,
      addressLine2,
      district,
      country,
      postcode
    ) => {
      const parts = [addressLine1, addressLine2, district, country, postcode].filter(
        Boolean
      );
      return parts.length > 0 ? parts.join(", ") : "-";
    };

    // Helper function to format organization address
    const formatOrgAddress = (org) => {
      const parts = [
        org?.addressLine1,
        org?.addressLine2,
        org?.addressLine3,
        org?.City?.name,
        org?.State?.name,
        org?.Country?.name,
        org?.postalCode
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : "-";
    };

    return {
      // Basic Employee Info
      fullName:
        [emp?.firstName, emp?.middleName, emp?.lastName]
          .filter(Boolean)
          .join(" ") || detail?.nickname || "-",
      employeeId: emp?.employeeId || detail?.employeeUuid || "-",
      designation: emp?.Designation?.name || detail?.systemRole || "-",
      department: emp?.Departement?.name || "-",
      joinDate: emp?.joinDate || "",
      email: emp?.email || detail?.personalEmail || "-",
      phoneNumber: emp?.phoneNumber || detail?.personalMobile || "-",
      gender: emp?.gender || "-",

      // Personal Details
      dateOfBirth: detail?.dateOfBirth || "-",
      age: detail?.age || "-",
      maritalStatus: detail?.maritalStatus || "-",
      bloodGroup: detail?.bloodGroup || "-",

      // Address Information
      presentAddress: formatAddress(
        detail?.presentAddressLine1,
        detail?.presentAddressLine2,
        detail?.presentDistrict,
        detail?.presentCountry,
        detail?.presentPostcode
      ),
      permanentAddress: formatAddress(
        detail?.permanentAddressLine1,
        detail?.permanentAddressLine2,
        detail?.permanentDistrict,
        detail?.permanentCountry,
        detail?.permanentPostcode
      ),
      workAddress: formatOrgAddress(org),

      // Banking Details
      bankName: detail?.bankName || "-",
      bankBranch: detail?.bankBranch || "-",
      accountNumber: detail?.accountNumber || "-",
      bankAccountHolder: detail?.bankAccountHolder || "-",

      // Statutory Details
      pfNumber: detail?.tapNo || "-",
      uan: detail?.scpNo || "-",
      pan: emp?.spkAccountNumber || "-", // ✅ FIX: Use Employee.spkAccountNumber instead of EmployeePersonalDetail.idNumber
      esiNumber: detail?.spkNo || "-",

      // Employment Details
      employmentType: detail?.EmploymentType?.name || "-",
      employeeStatus: detail?.employeeStatus || "-",
      citizenshipCategory: emp?.citizenCategory || "-", // ✅ FIX: Use Employee.citizenCategory instead of EmployeePersonalDetail.citizenshipCategory

      // Emergency Contact
      emergencyContactName: detail?.emergencyContactName || "-",
      emergencyContactMobile: detail?.emergencyContactMobile || "-",

      // Work Location
      workLocation: org?.addressLine1 || "-"
    };
  };

  // Dynamic data or fallback to empty arrays
  const employeeData =
    employee && Object.keys(employee).length > 0
      ? employee.Employee
        ? mapEmployeePersonalDetail(employee)
        : employee
      : {
          fullName: "N/A",
          employeeId: "N/A",
          designation: "N/A",
          department: "N/A",
          joinDate: "N/A",
          email: "N/A",
          phoneNumber: "N/A",
          gender: "N/A",
          dateOfBirth: "N/A",
          age: "N/A",
          maritalStatus: "N/A",
          bloodGroup: "N/A",
          presentAddress: "N/A",
          permanentAddress: "N/A",
          workAddress: "N/A",
          bankName: "N/A",
          bankBranch: "N/A",
          accountNumber: "N/A",
          bankAccountHolder: "N/A",
          pfNumber: "N/A",
          uan: "N/A",
          pan: "N/A",
          esiNumber: "N/A",
          employmentType: "N/A",
          employeeStatus: "N/A",
          citizenshipCategory: "N/A", // ✅ Note: Now uses Employee.citizenCategory
          emergencyContactName: "N/A",
          emergencyContactMobile: "N/A",
          workLocation: "N/A"
        };

  const payrollData =
    data && Object.keys(data).length > 0
      ? data
      : {
          month: "N/A",
          netPay: 0,
          grossPay: 0,
          deductions: 0,
          earnings: [],
          deductionsList: [],
          taxes: 0,
          paidDays: 0,
          lopDays: 0,
          absentDays: null,
          reimbursements: 0,
          benefits: [],
          totalEmployeeBenefits: 0,
          totalEmployerBenefits: 0
        };

  useEffect(() => {
    let formatTotalEarnings, formatTotalDeductions;

    // Calculate earnings
    if (Array.isArray(payrollData.earnings) && payrollData.earnings.length > 0) {
      formatTotalEarnings = payrollData.earnings.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    } else {
      formatTotalEarnings = 0;
    }

    // Calculate deductions - Total = SPK Employee Contribution + Loan Deductions
    // Backend sends loan deductions in 'deductions' field
    // SPK Employee Contribution is in 'deductionsList' with label "Employee Contribution"
    // ✅ FIX: Skip SPK calculations for Foreigner
    const isForeigner = employeeData?.citizenshipCategory === "Foreigner";
    
    let loanDeductions = 0;
    if (payrollData.deductions !== undefined && payrollData.deductions !== null) {
      loanDeductions = parseFloat(payrollData.deductions) || 0;
    } else if (Array.isArray(payrollData.deductionsList) && payrollData.deductionsList.length > 0) {
      // Fallback: sum only loans (exclude SPK items)
      loanDeductions = payrollData.deductionsList
        .filter(d => {
          const label = (d.label || '').toLowerCase();
          return !label.includes('employee contribution') && 
                 !label.includes('employer contribution') && 
                 !label.includes('admin fees');
        })
        .reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);
    }
    
    // Find SPK Employee Contribution from deductionsList
    // ✅ FIX: Skip SPK Employee Contribution for Foreigner
    let spkEmployeeContribution = 0;
    if (!isForeigner && Array.isArray(payrollData.deductionsList) && payrollData.deductionsList.length > 0) {
      const spkEmployeeItem = payrollData.deductionsList.find(d => {
        const label = (d.label || '').toLowerCase();
        return label.includes('employee contribution');
      });
      if (spkEmployeeItem) {
        spkEmployeeContribution = parseFloat(spkEmployeeItem.amount || 0);
      }
    }
    
    // Total Deductions = SPK Employee Contribution + Loan Deductions
    // ✅ FIX: For Foreigner, only include loan deductions (SPK is skipped)
    formatTotalDeductions = spkEmployeeContribution + loanDeductions;

    setTotalEarnings(formatTotalEarnings);
    setTotalDeductions(formatTotalDeductions); // Ini langsung dari sum deductionsList

  }, [data, payrollData]);

  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return numAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  };

  const convertToWords = (amount) => {
    const numberToWords = Math.floor(amount || 0).toLocaleString();
    return `Indian Rupee ${numberToWords} Only`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-IN");
    } catch {
      return dateString;
    }
  };

  const toTitleCase = (str) => {
    if (!str || str === "-") return str;
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div
      ref={contentRef}
      className="w-full max-w-4xl mx-auto bg-white p-8 font-sans border border-gray-300 rounded-lg"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b pb-3">
        <div className="flex items-center gap-4">
          {imgUrl && (
            <div
              className={`${
                logoScale?.size || "w-16 h-16"
              } rounded-lg flex items-center justify-center overflow-hidden`}
            >
              <img
                src={imgUrl}
                alt="logo_tamplates"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  // Fallback jika gambar gagal load
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
          <div className="w-[60%] flex flex-col space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">
              {data.companyName || "Company Name"}
            </h1>
            {(availableDetailTamplate?.show_organisation_address ||
              isEmployeePortal) && (
              <p className="text-xs text-gray-600">
                {employeeData.workAddress || "N/A"}
              </p>
            )}
          </div>
        </div>
        <div className="text-right w-[40%] h-full flex items-end justify-center flex-col">
          <div className="text-gray-600 text-sm">Payslip For the Month</div>
          <div className="text-xl font-bold">{payrollData.month}</div>
        </div>
      </div>

      {/* Employee Summary */}
      <div className="mb-4 flex items-center justify-between border-b pb-5">
        <div className="flex-row w-full">
          <h2 className="text-sm text-gray-700 mb-4 font-semibold">
            EMPLOYEE SUMMARY
          </h2>
          <div className="flex rounded-md text-sm gap-4">
            <table className="w-1/2 text-sm table-fixed text-left">
              <tbody>
                <tr>
                  <td className="text-gray-500 w-40">Employee Name</td>
                  <td className="text-gray-500 w-4 text-center py-2">:</td>
                  <td className="font-medium max-w-[220px] break-words">
                    {toTitleCase(employeeData.fullName)}
                  </td>
                </tr>
                {(availableDetailTamplate?.show_designation ||
                  isEmployeePortal) && (
                  <tr>
                    <td className="text-gray-500">Designation</td>
                    <td className="text-gray-500 text-center py-2">:</td>
                    <td className="font-medium whitespace-nowrap">
                      {toTitleCase(employeeData.designation)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="text-gray-500">Employee ID</td>
                  <td className="text-gray-500 text-center py-2">:</td>
                  <td className="font-medium whitespace-nowrap">
                    {employeeData.employeeId}
                  </td>
                </tr>
                {(availableDetailTamplate?.show_department ||
                  isEmployeePortal) && (
                  <tr>
                    <td className="text-gray-500">Department</td>
                    <td className="text-gray-500 text-center py-2">:</td>
                    <td className="font-medium whitespace-nowrap">
                      {toTitleCase(employeeData.department)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="text-gray-500">Date of Joining</td>
                  <td className="text-gray-500 text-center py-2">:</td>
                  <td className="font-medium whitespace-nowrap">
                    {formatDate(employeeData.joinDate)}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-500">Pay Period</td>
                  <td className="text-gray-500 text-center py-2">:</td>
                  <td className="font-medium whitespace-nowrap">
                    {payrollData.month}
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-500">Pay Date</td>
                  <td className="text-gray-500 text-center py-2">:</td>
                  <td className="font-medium whitespace-nowrap">
                    {payrollData.payDate ? formatDate(payrollData.payDate) : formatDate(new Date())}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Net Pay Box */}
            <div className="w-1/2 rounded-lg border-2 overflow-hidden">
              <div className="w-full p-6 bg-green-50">
                <div className="flex flex-col space-y-1 items-start justify-start rounded-s px-4 border-s-2 border-green-400">
                  <div className="text-xl font-bold text-gray-800">
                    ${formatCurrency(payrollData.netPay)}
                  </div>
                  <div className="text-sm font-normal text-gray-400">
                    Total Net Pay
                  </div>
                </div>
              </div>
              <div className="space-y-2 px-6 py-4 text-sm">
                {/* show Paid Days (Paid Days - LOP Days) */}
                <div className="flex space-x-10">
                  <span className="text-gray-500">Paid Days</span>
                  <span className="font-medium">
                    : {Math.max(0, (payrollData.paidDays || 30) - (payrollData.lopDays || 0))}
                  </span>
                </div>
                {/* show Absent - Always show if hasPayslip */}
                {payrollData.hasPayslip && (
                  <div className="flex space-x-10">
                    <span className="text-gray-500">Absent</span>
                    <span className="font-medium">
                      : {payrollData.absentDays !== undefined && payrollData.absentDays !== null ? payrollData.absentDays : 0}
                    </span>
                  </div>
                )}
                {/* show lop days */}
                {(payrollData.lopDays !== undefined && payrollData.lopDays !== null && payrollData.lopDays > 0) && (
                  <div className="flex space-x-10">
                    <span className="text-gray-500">LOP Days</span>
                    <span className="font-medium">
                      : {payrollData.lopDays || 0}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PF and UAN */}
      {!isEmployeePortal && (
        <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
          <div className="space-y-3">
            <div className="flex">
              <span className="w-32 text-gray-500">PF A/C Number</span>
              <span className="text-gray-500 mr-2">:</span>
              <span className="font-medium">{employeeData.pfNumber}</span>
            </div>
            {availableDetailTamplate?.show_bank_account_number && (
              <div className="flex">
                <span className="w-32 text-gray-500">Bank Account No</span>
                <span className="text-gray-500 mr-2">:</span>
                <span className="font-medium">{employeeData.accountNumber}</span>
              </div>
            )}
            {availableDetailTamplate?.show_work_location && (
              <div className="flex">
                <span className="w-32 text-gray-500">Work Location</span>
                <span className="text-gray-500 mr-2">:</span>
                <span className="font-medium">{employeeData.workLocation}</span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex">
              <span className="w-32 text-gray-500">UAN</span>
              <span className="text-gray-500 mr-2">:</span>
              <span className="font-medium">{employeeData.uan}</span>
            </div>
            {availableDetailTamplate?.show_pan && (
              <div className="flex">
                <span className="w-32 text-gray-500">PAN</span>
                <span className="text-gray-500 mr-2">:</span>
                <span className="font-medium">{employeeData.pan}</span>
              </div>
            )}
            <div className="flex">
              <span className="w-32 text-gray-500">ESI Number</span>
              <span className="text-gray-500 mr-2">:</span>
              <span className="font-medium">{employeeData.esiNumber}</span>
            </div>
          </div>
        </div>
      )}

      {/* Earnings and Deductions Table */}
      <div className="mb-8 rounded-lg border-2 text-xs overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5FAFF]">
              <th className="px-6 py-4 text-left font-semibold text-gray-700">
                EARNINGS
              </th>
              <th className="px-6 py-4 text-right font-semibold text-gray-700">
                AMOUNT
              </th>
              <th className="px-6 py-4 text-right font-semibold text-gray-700 border-r border-gray-300">
                YTD
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">
                DEDUCTIONS
              </th>
              <th className="px-6 py-4 text-right font-semibold text-gray-700">
                AMOUNT
              </th>
              <th className="px-6 py-4 text-right font-semibold text-gray-700">
                YTD
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({
              length: Math.max(
                Array.isArray(payrollData.earnings)
                  ? payrollData.earnings.length
                  : 0,
                Array.isArray(payrollData.deductionsList)
                  ? payrollData.deductionsList.filter(d => {
                      const amount = parseFloat(d?.amount) || 0;
                      if (amount <= 0) return false;
                      
                      // ✅ Skip SPK Employee and Employer Contribution for Foreigner
                      const isForeigner = employeeData?.citizenshipCategory === "Foreigner";
                      if (isForeigner) {
                        const label = (d.label || '').toLowerCase();
                        if (label.includes('employee contribution') || 
                            label.includes('employer contribution')) {
                          return false;
                        }
                      }
                      
                      return true;
                    }).length
                  : 0
              )
            }).map((_, index) => {
              const earning = Array.isArray(payrollData.earnings)
                ? payrollData.earnings[index]
                : null;
              
              // ✅ Filter deductions: hanya ambil yang amount > 0
              // ✅ FIX: Hide SPK Employee and Employer Contribution for Foreigner
              const isForeigner = employeeData?.citizenshipCategory === "Foreigner";
              const validDeductions = Array.isArray(payrollData.deductionsList)
                ? payrollData.deductionsList.filter(d => {
                    const amount = parseFloat(d?.amount) || 0;
                    if (amount <= 0) return false;
                    
                    // ✅ Skip SPK Employee and Employer Contribution for Foreigner
                    if (isForeigner) {
                      const label = (d.label || '').toLowerCase();
                      if (label.includes('employee contribution') || 
                          label.includes('employer contribution')) {
                        return false;
                      }
                    }
                    
                    return true;
                  })
                : [];
              const deduction = validDeductions[index] || null;

              // ✅ Override label dengan monthlyAllowanceNames jika tersedia
              let finalLabel = earning?.label || "";
              if (earning && payrollData.monthlyAllowanceNames) {
                // Cari field name dari label (reverse lookup)
                const fieldName = Object.keys(payrollData.monthlyAllowanceNames).find(field => {
                  const nameInPayslip = payrollData.monthlyAllowanceNames[field];
                  return nameInPayslip && earning.label && 
                         (earning.label.toLowerCase() === nameInPayslip.toLowerCase() ||
                          earning.label.toLowerCase().includes(nameInPayslip.toLowerCase()) ||
                          nameInPayslip.toLowerCase().includes(earning.label.toLowerCase()));
                });
                
                if (fieldName && payrollData.monthlyAllowanceNames[fieldName]) {
                  finalLabel = payrollData.monthlyAllowanceNames[fieldName];
                }
              }

              return (
                <tr key={index}>
                  <td className="px-6 py-3 text-gray-600">
                    {finalLabel ? toTitleCase(finalLabel) : ""}
                  </td>
                  <td className="px-6 py-3 text-right font-medium">
                    {earning?.amount
                      ? `$${formatCurrency(earning.amount)}`
                      : earning?.label
                      ? "-"
                      : ""}
                  </td>
                  <td className="px-6 py-3 text-right font-medium border-r border-gray-300">
                    {earning?.ytd
                      ? `$${formatCurrency(earning.ytd)}`
                      : earning?.label
                      ? "-"
                      : ""}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {
                      deduction?.label
                        ? (deduction.label.toLowerCase().includes("empl")
                            ? "SPK " + toTitleCase(deduction.label)
                            : toTitleCase(deduction.label)
                          )
                        : ""
                    }
                  </td>
                  <td className="px-6 py-3 text-right font-medium">
                    {deduction?.amount
                      ? `$${formatCurrency(deduction.amount)}`
                      : deduction?.label
                      ? "-"
                      : ""}
                  </td>
                  <td className="px-6 py-3 text-right font-medium">
                    {deduction?.ytd
                      ? `$${formatCurrency(deduction.ytd)}`
                      : deduction?.label
                      ? "-"
                      : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="font-semibold text-gray-800 border-t border-gray-300 bg-gray-50">
              <td className="px-6 py-3">Gross Earnings</td>
              <td className="px-6 py-3 text-right">
                ${formatCurrency(totalEarnings || 0)}
              </td>
              <td className="px-6 py-3 border-r border-gray-300"></td>
              <td className="px-6 py-3">Total Deductions</td>
              <td className="px-6 py-3 text-right">
                ${formatCurrency(totalDeductions || 0)}
              </td>
              <td className="px-6 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Total Net Payable */}
      <div className="bg-white border-2 rounded-lg mb-6 text-sm overflow-hidden">
        <div className="flex">
          <div className="space-y-1 w-[85%] p-3">
            <h3 className="font-semibold text-gray-800">TOTAL NET PAYABLE</h3>
            <p className="text-gray-500 text-xs">
              Gross Earnings - Total Deductions
            </p>
          </div>
          <div className="text-sm flex-1 font-bold text-gray-800 bg-green-50 flex items-center justify-center p-3">
            ${formatCurrency(payrollData.netPay || 0)}
          </div>
        </div>
      </div>

      {/* Benefits Summary */}
      {!isEmployeePortal &&
        availableDetailTamplate?.show_benefits_summary && (
          <div className="w-full h-fit">
            <div className="bg-white flex flex-col space-y-3">
              <div className="flex space-y-1 flex-col">
                <h2 className="text-normal text-sm font-semibold text-gray-900">
                  Benefits Summary
                </h2>
                <p className="text-gray-600 text-xs">
                  This section provides a detailed breakdown of benefit
                  contributions made by both you and your employer.
                </p>
              </div>
              <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="text-xs">
                      <th className="text-left py-3 px-6 font-semibold text-gray-700 uppercase tracking-wider">
                        BENEFITS
                      </th>
                      <th className="text-right py-3 px-6 font-semibold text-gray-700 uppercase tracking-wider">
                        EMPLOYEE
                        <br />
                        CONTRIBUTION
                      </th>
                      {availableDetailTamplate?.show_ytd_values && (
                        <th className="text-right py-3 px-6 font-semibold text-gray-700 uppercase tracking-wider">
                          EMPLOYEE YTD
                        </th>
                      )}
                      <th className="text-right py-3 px-6 font-semibold text-gray-700 uppercase tracking-wider">
                        EMPLOYER
                        <br />
                        CONTRIBUTION
                      </th>
                      {availableDetailTamplate?.show_ytd_values && (
                        <th className="text-right py-3 px-6 font-semibold text-gray-700 uppercase tracking-wider">
                          EMPLOYER YTD
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {Array.isArray(payrollData.benefits) &&
                    payrollData.benefits.length > 0 ? (
                      payrollData.benefits.map((item, index) => (
                        <tr key={index} className="text-xs">
                          <td className="py-4 px-6 font-light text-gray-900">
                            {item.benefit || "N/A"}
                          </td>
                          <td className="py-4 text-right px-6 text-gray-700">
                            ${formatCurrency(item.employeeContribution || 0)}
                          </td>
                          {availableDetailTamplate?.show_ytd_values && (
                            <td className="py-4 text-right px-6 text-gray-700">
                              ${formatCurrency(item.employeeYTD || 0)}
                            </td>
                          )}
                          <td className="py-4 text-right px-6 text-gray-700">
                            ${formatCurrency(item.employerContribution || 0)}
                          </td>
                          {availableDetailTamplate?.show_ytd_values && (
                            <td className="py-4 text-right px-6 text-gray-700">
                              ${formatCurrency(item.employerYTD || 0)}
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr className="text-xs">
                        <td
                          colSpan={
                            availableDetailTamplate?.show_ytd_values ? 5 : 3
                          }
                          className="py-4 px-6 text-center text-gray-500"
                        >
                          No benefits data available
                        </td>
                      </tr>
                    )}
                    <tr className="bg-gray-50 font-normal text-gray-900 border-t-2 border-gray-300 text-xs">
                      <td className="py-3 px-6 font-semibold">
                        Total Benefits
                      </td>
                      <td className="py-3 text-right px-6">
                        $
                        {formatCurrency(payrollData.totalEmployeeBenefits || 0)}
                      </td>
                      {availableDetailTamplate?.show_ytd_values && (
                        <td className="py-3 text-right px-6">-</td>
                      )}
                      <td className="py-3 text-right px-6">
                        $
                        {formatCurrency(payrollData.totalEmployerBenefits || 0)}
                      </td>
                      {availableDetailTamplate?.show_ytd_values && (
                        <td className="py-3 text-right px-6">-</td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      {/* Signature Section */}
      <div className="mt-8 pt-20 border-gray-300">
        <div className="flex justify-between items-end">
          {/* Authorized Signatory */}
          <div className="flex flex-col items-start space-y-2 w-[45%]">
            <div className="border-b border-gray-400 w-full h-12 mb-2"></div>
            <p className="text-sm font-medium text-gray-700">Authorized Signatory</p>
          </div>

          {/* Employee Signature */}
          <div className="flex flex-col items-end space-y-2 w-[45%]">
            <div className="border-b border-gray-400 w-full h-12 mb-2"></div>
            <p className="text-sm font-medium text-gray-700">Employee Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ElegantTemplate;
