import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import React from "react";
import employeePortalStoreManagements from "../../../../store/tdPayroll/employeePortal";
import employeeStoreManagements from "../../../../store/tdPayroll/employee";
import dayjs from "dayjs";
import TableReusable from "../../../component/setting/tableReusable";
import { payslipEmployeePortalHeaders, salaryComponentMonthlyMap } from "../../../../../data/dummy";
import PayslipEmployeePortalDetail from "../../../component/employeePortal/payslip/payslipEmployeePortalDetail";
import PeriodPicker from "../../../component/employeePortal/PeriodPicker";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ElegantTemplate from "../../../component/pdfTamplates/regularPayslips/elegantTemplate";
import { createRoot } from "react-dom/client";

function PayslipEmployeePortal({
  activeTab,
  onTabChange,
  onShowPayslipDetail,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL params
  const urlPeriod = searchParams.get("period");
  const urlShowPayslip = searchParams.get("showPayslip") === "true";

  const { getPayslipEmployee, dataPayslipEmployee, loading, error } =
    employeePortalStoreManagements();
  const { fetchEmployeePersonalDetail, dataEmployeePersonalDetail } =
    employeeStoreManagements();

  const [selectedYear, setSelectedYear] = useState(
    urlPeriod ? dayjs(urlPeriod).year() : dayjs().year()
  );
  const [selectedPeriod, setSelectedPeriod] = useState(
    urlPeriod || dayjs().format("YYYY-MM")
  );
  const [showPayslip, setShowPayslip] = useState(urlShowPayslip);
  const [tempData, setTempData] = useState({});
  const [downloading, setDownloading] = useState(false);

  // Handle period selection - send period (YYYY-MM) to API
  const handlePeriodSelect = (period) => {
    if (!period) return;
    const year = dayjs(period).year();
    setSelectedPeriod(period);
    setSelectedYear(year);
    // Update URL with new period
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("period", period);
      return newParams;
    });
  };

  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");
    // Send period (YYYY-MM) to API, not just year
    if (selectedPeriod) {
      // Update URL if not already set
      if (!urlPeriod || urlPeriod !== selectedPeriod) {
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set("period", selectedPeriod);
          return newParams;
        });
      }
      getPayslipEmployee(access_token, null, null, selectedPeriod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);

  // Format currency helper
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "$0.00";
    const numValue = parseFloat(value);
    return `$${numValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const generatePayslipData = () => {
    // Return empty array if no data available
    if (!dataPayslipEmployee) {
      return [];
    }

    // Process historical payslips from API
    if (
      dataPayslipEmployee.historicalPayslips &&
      dataPayslipEmployee.historicalPayslips.length > 0
    ) {
      return dataPayslipEmployee.historicalPayslips.map((payslip) => ({
        month: payslip.month || dayjs(payslip.monthDate).format("MMMM YYYY"),
        grossPay: formatCurrency(payslip.grossPay || 0),
        reimbursements: formatCurrency(payslip.reimbursements || 0),
        deductions: formatCurrency(payslip.deductions || 0),
        takeHome: formatCurrency(payslip.netPay || 0),
        hasPayslip: payslip.hasPayslip || false,
        hasTaxWorksheet: payslip.hasTaxWorksheet || false,
        payrunUuid: payslip.payrunUuid,
        payrunStatus: payslip.payrunStatus,
        originalData: payslip, // Keep original data for detail view
      }));
    }

    return [];
  };

  const payslipData = generatePayslipData();

  const handleEdit = (data, type) => {
    setTempData(data);
    setShowPayslip(true);
    // Update URL to show payslip detail
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("showPayslip", "true");
      // Also set month and payrunUuid if available
      if (data.month) {
        newParams.set("month", data.month);
      }
      if (data.payrunUuid) {
        newParams.set("payrunUuid", data.payrunUuid);
      }
      return newParams;
    });
    if (onShowPayslipDetail) {
      onShowPayslipDetail(true);
    }
  };

  const handleCancel = () => {
    setShowPayslip(false);
    // Remove showPayslip from URL
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("showPayslip");
      newParams.delete("month");
      newParams.delete("payrunUuid");
      return newParams;
    });
    if (onShowPayslipDetail) {
      onShowPayslipDetail(false);
    }
  };

  // Fetch employee personal detail on mount
  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");
    fetchEmployeePersonalDetail(access_token, null, "employee-portal");
  }, []);

  // Sync showPayslip state with URL param and find matching data from payslipData
  useEffect(() => {
    if (urlShowPayslip !== showPayslip) {
      setShowPayslip(urlShowPayslip);
      // If URL has showPayslip=true but tempData is empty, try to set it from URL
      if (urlShowPayslip && !tempData.month) {
        const urlMonth = searchParams.get("month");
        const urlPayrunUuid = searchParams.get("payrunUuid");
        if (urlMonth && payslipData.length > 0) {
          // Find matching data from payslipData
          const matchingData = payslipData.find(
            (item) => item.month === urlMonth
          );
          if (matchingData) {
            setTempData(matchingData);
          } else if (urlMonth) {
            // If not found, use basic data from URL
            setTempData({ month: urlMonth, payrunUuid: urlPayrunUuid || null });
          }
        } else if (urlMonth) {
          setTempData({ month: urlMonth, payrunUuid: urlPayrunUuid || null });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlShowPayslip, payslipData]);

  const handleDownload = async (data) => {
    if (!data.payrunUuid) {
      alert("Payslip not available for this month");
      return;
    }

    setDownloading(true);
    try {
      const access_token = localStorage.getItem("accessToken");

      // Fetch detailed payslip data
      await getPayslipEmployee(access_token, null, data.payrunUuid);

      // Wait for data to be available - poll until data is ready
      let payslipDetail = null;
      let attempts = 0;
      const maxAttempts = 30;
      const pollInterval = 200;

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        const storeState = employeePortalStoreManagements.getState();
        payslipDetail = storeState.dataPayslipEmployee;

        if (storeState.loading === false) {
          if (payslipDetail?.employee && !payslipDetail?.historicalPayslips) {
            break;
          }
          if (payslipDetail?.employee) {
            break;
          }
          if (storeState.error) {
            console.error("Error loading payslip:", storeState.error);
            break;
          }
        }
        attempts++;
      }

      // Final check
      const finalState = employeePortalStoreManagements.getState();
      payslipDetail = finalState.dataPayslipEmployee;

      if (finalState.error) {
        alert(
          `Failed to load payslip data: ${
            finalState.error?.message || "Unknown error"
          }`
        );
        setDownloading(false);
        return;
      }

      if (!payslipDetail?.employee) {
        alert("Failed to load payslip data. Please try again.");
        setDownloading(false);
        return;
      }

      // Use detailedPayslipData (same as payslipEmployeePortalDetail.jsx)
      const detailedPayslipData = payslipDetail.employee;

      // Parse currency values (same as payslipEmployeePortalDetail.jsx)
      const parseCurrency = (value) => {
        if (!value) return 0;
        if (typeof value === "number") return value;
        return parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0;
      };

      // Get gross pay, deductions, and take home (same as payslipEmployeePortalDetail.jsx)
      // Use data from originalData (same as currentData.originalData in detail view)
      // The data.originalData contains the raw data from historicalPayslips API response
      const grossPay = parseCurrency(data.originalData?.grossPay || 0);
      const deductions = parseCurrency(data.originalData?.deductions || 0);
      const netPay = parseCurrency(data.originalData?.netPay || 0);
      const reimbursements = parseCurrency(
        data.originalData?.reimbursements || 0
      );

      // Prepare earnings data (same structure as payslipEmployeePortalDetail.jsx)
      const getEarningsData = () => {
        if (detailedPayslipData) {
          const earnings = [];
          // Add basic monthly
          if (detailedPayslipData.basicMonthly) {
            earnings.push({
              label: "Basic",
              amount: parseFloat(detailedPayslipData.basicMonthly) || 0,
            });
          }
          // ✅ Get monthlyAllowanceNames from payslipDetail if available
          const monthlyAllowanceNames = payslipDetail?.monthlyAllowanceNames || {};
          
          // Add HRA
          if (detailedPayslipData.hraMonthly) {
            earnings.push({
              label: monthlyAllowanceNames.hraMonthly || salaryComponentMonthlyMap.hraMonthly || "House Rent Allowance",
              amount: parseFloat(detailedPayslipData.hraMonthly) || 0,
            });
          }
          // Add Conveyance Allowance
          if (detailedPayslipData.conveyanceAllowanceMonthly) {
            earnings.push({
              label: monthlyAllowanceNames.conveyanceAllowanceMonthly || salaryComponentMonthlyMap.conveyanceAllowanceMonthly || "Conveyance Allowance",
              amount:
                parseFloat(detailedPayslipData.conveyanceAllowanceMonthly) || 0,
            });
          }
          // Add other allowances if available
          const allowanceFields = [
            "dearnessAllowanceMonthly",
            "childrenEducationAllowanceMonthly",
            "hostelExpenditureAllowanceMonthly",
            "transportAllowanceMonthly",
            "helperAllowanceMonthly",
            "travellingAllowanceMonthly",
            "uniformAllowanceMonthly",
            "dailyAllowanceMonthly",
            "cityCompensatoryAllowanceMonthly",
            "overtimeAllowanceMonthly",
            "telephoneAllowanceMonthly",
            "fixedMedicalAllowanceMonthly",
            "projectAllowanceMonthly",
            "foodAllowanceMonthly",
            "holidayAllowanceMonthly",
            "entertainmentAllowanceMonthly",
            "foodCouponMonthly",
            "researchAllowanceMonthly",
            "booksAndPeriodicalsAllowanceMonthly",
            "fuelAllowanceMonthly",
            "driverAllowanceMonthly",
            "leaveTravelAllowanceMonthly",
            "vehicleMaintenanceAllowanceMonthly",
            "telephoneAndInternetAllowanceMonthly",
            "shiftAllowanceMonthly",
            // Skip fixedAllowanceMonthly here - will be displayed from payrollCalculation.earnings.fixedAllowance
          ];

          allowanceFields.forEach((field) => {
            const value = parseFloat(detailedPayslipData[field]) || 0;
            if (value > 0) {
              // ✅ Priority: Use nameInPayslip from backend if available, fallback to mapping
              const nameInPayslip = monthlyAllowanceNames[field];
              const mappedName = salaryComponentMonthlyMap[field];
              const autoLabel = field
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())
                .replace("Monthly", "");
              const label = nameInPayslip || mappedName || autoLabel;
              
              earnings.push({ label, amount: value });
            }
          });

          // ✅ Display Fixed Allowance from payrollCalculation.earnings (prioritas dari earnings)
          const fixedAllowance = detailedPayslipData?.payrollCalculation?.earnings?.fixedAllowance || 
                                data?.originalData?.payrollCalculation?.earnings?.fixedAllowance;
          if (fixedAllowance && parseFloat(fixedAllowance) > 0) {
            earnings.push({
              label: "Fixed Allowance",
              amount: parseFloat(fixedAllowance)
            });
          }

          // ✅ Display Custom Allowance from payrollCalculation.earnings (bukan basic)
          const customAllowance = detailedPayslipData?.payrollCalculation?.earnings?.customAllowance || 
                                  data?.originalData?.payrollCalculation?.earnings?.customAllowance;
          if (customAllowance && parseFloat(customAllowance) > 0) {
            earnings.push({
              label: "Custom Allowance",
              amount: parseFloat(customAllowance)
            });
          }

          // ✅ Display Basic Custom Allowance from payrollCalculation.earnings (jika ada)
          const basicCustomAllowance = detailedPayslipData?.payrollCalculation?.earnings?.basicCustomAllowance || 
                                       data?.originalData?.payrollCalculation?.earnings?.basicCustomAllowance;
          if (basicCustomAllowance && parseFloat(basicCustomAllowance) > 0) {
            earnings.push({
              label: "Basic Custom Allowance",
              amount: parseFloat(basicCustomAllowance)
            });
          }

          // Add reimbursements if available
          if (reimbursements > 0) {
            earnings.push({ label: "Reimbursements", amount: reimbursements });
          }

          return earnings.length > 0 ? earnings : getDefaultEarnings();
        }
        return getDefaultEarnings();
      };

      const getDefaultEarnings = () => {
        return [
          { label: "Basic", amount: Math.round(grossPay * 0.58) },
          {
            label: "House Rent Allowance",
            amount: Math.round(grossPay * 0.12),
          },
          { label: "Conveyance Allowance", amount: Math.round(grossPay * 0.1) },
          ...(reimbursements > 0
            ? [{ label: "Reimbursements", amount: reimbursements }]
            : []),
        ];
      };

      const earningsData = getEarningsData();

      // Get deductions breakdown (same structure as payslipEmployeePortalDetail.jsx)
      const getDeductionsData = () => {
        if (detailedPayslipData) {
          const deductionsList = [];
          // Add business deduction if available
          if (detailedPayslipData.totalEmployeeMonthly) {
            const employeeContribution =
              parseFloat(detailedPayslipData.totalEmployeeMonthly) || 0;
            if (employeeContribution > 0) {
              deductionsList.push({
                label: "Business",
                amount: employeeContribution,
              });
            }
          }
          // Add SPK contributions if available
          if (deductions > 0 && deductionsList.length === 0) {
            return getDefaultDeductions();
          }
          return deductionsList.length > 0
            ? deductionsList
            : getDefaultDeductions();
        }
        return getDefaultDeductions();
      };

      const getDefaultDeductions = () => {
        const business = Math.round(deductions * 0.35);
        const spkEmployee = Math.round(deductions * 0.33);
        const spkEmployer = Math.round(deductions * 0.32);
        return [
          { label: "Business", amount: business },
          { label: "SPK Employer Contribution", amount: spkEmployer },
          { label: "SPK Employee Contribution", amount: spkEmployee },
        ];
      };

      const deductionsData = getDeductionsData();

      // Map employee personal detail (same structure as payslipEmployeePortalDetail.jsx)
      const mapEmployeePersonalDetail = (detail) => {
        const emp = detail?.Employee ?? {};
        const org = detail?.Organization ?? {};

        const formatAddress = (
          addressLine1,
          addressLine2,
          district,
          country,
          postcode
        ) => {
          const parts = [
            addressLine1,
            addressLine2,
            district,
            country,
            postcode,
          ].filter(Boolean);
          return parts.length > 0 ? parts.join(", ") : "-";
        };

        const formatOrgAddress = (org) => {
          const parts = [
            org?.addressLine1,
            org?.addressLine2,
            org?.addressLine3,
            org?.City?.name,
            org?.State?.name,
            org?.Country?.name,
            org?.postalCode,
          ].filter(Boolean);
          return parts.length > 0 ? parts.join(", ") : "-";
        };

        return {
          fullName:
            [emp?.firstName, emp?.middleName, emp?.lastName]
              .filter(Boolean)
              .join(" ") ||
            detail?.nickname ||
            "-",
          employeeId: emp?.employeeId || detail?.employeeUuid || "-",
          designation: emp?.Designation?.name || detail?.systemRole || "-",
          department: emp?.Departement?.name || "-",
          joinDate: emp?.joinDate || "",
          email: emp?.email || detail?.personalEmail || "-",
          phoneNumber: emp?.phoneNumber || detail?.personalMobile || "-",
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
          bankName: detail?.bankName || "-",
          bankBranch: detail?.bankBranch || "-",
          accountNumber: detail?.accountNumber || "-",
          bankAccountHolder: detail?.bankAccountHolder || "-",
          pfNumber: detail?.tapNo || "-",
          uan: detail?.scpNo || "-",
          pan: detail?.Employee?.spkAccountNumber || "-", // ✅ FIX: Use Employee.spkAccountNumber instead of EmployeePersonalDetail.idNumber
          esiNumber: detail?.spkNo || "-",
        };
      };

      const mappedEmployee = mapEmployeePersonalDetail(
        dataEmployeePersonalDetail
      );

      // Create hidden container for PDF generation
      const hiddenContainer = document.createElement("div");
      hiddenContainer.style.position = "absolute";
      hiddenContainer.style.left = "-9999px";
      hiddenContainer.style.top = "0";
      hiddenContainer.style.width = "210mm";
      hiddenContainer.style.backgroundColor = "#ffffff";
      document.body.appendChild(hiddenContainer);

      // Render payslip template
      const root = createRoot(hiddenContainer);
      root.render(
        <div data-payslip-content>
          <ElegantTemplate
            isEmployeePortal={true}
            data={{
              month: data.month,
              netPay: netPay,
              grossPay: grossPay,
              deductions: deductions,
              earnings: earningsData,
              deductionsList: deductionsData,
              paidDays: detailedPayslipData?.paidDays || 30,
              lopDays: detailedPayslipData?.lopDays || 0,
              monthlyAllowanceNames: payslipDetail?.monthlyAllowanceNames || {} // ✅ Pass monthlyAllowanceNames to template
            }}
            employee={mappedEmployee}
          />
        </div>
      );

      // Wait for rendering
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate PDF
      const payslipElement = hiddenContainer.querySelector(
        "[data-payslip-content]"
      );
      if (!payslipElement) {
        throw new Error("Payslip content not found");
      }

      const canvas = await html2canvas(payslipElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: payslipElement.scrollWidth,
        height: payslipElement.scrollHeight,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;

      // Calculate image dimensions to fit A4 width exactly
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add image to PDF, splitting across pages if needed
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );

      // Add additional pages if content is taller than one page
      while (heightLeft >= pdfHeight) {
        position = position - pdfHeight;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
        heightLeft -= pdfHeight;
      }

      const monthName = data.month.replace(/\s+/g, "_");
      const fileName = `Payslip_${monthName}.pdf`;
      pdf.save(fileName);

      // Cleanup
      root.unmount();
      document.body.removeChild(hiddenContainer);
    } catch (error) {
      console.error("Download error:", error);
      alert(`Failed to download payslip: ${error.message}`);
    } finally {
      setDownloading(false);
    }
  };

  // Format financial year for display (from period YYYY-MM)
  const formatFinancialYear = (period) => {
    if (!period) return "";
    const date = dayjs(period);
    const year = date.year();
    const month = date.month() + 1; // month is 0-indexed, so add 1
    return `${year} - ${String(month).padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {!showPayslip && (
        <>
          {/* Financial Year Selector */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-2 w-fit border-2 border-[#D1D5DB] rounded-lg px-3 py-1.5">
              <span className="inline-flex h-5 w-5 items-center justify-center text-[#9CA3AF]">
                <svg
                  width="12"
                  height="14"
                  viewBox="0 0 12 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.93584 1.3058C7.15906 0.994625 4.34537 0.994625 1.5686 1.3058C1.52467 1.31071 1.48292 1.32704 1.44796 1.35373C1.41301 1.38043 1.38613 1.41637 1.37009 1.45756C1.35405 1.49874 1.3493 1.54368 1.35527 1.58755C1.36123 1.63141 1.3777 1.67286 1.4031 1.70668L3.94376 5.00389C4.85712 6.1719 5.35784 7.6245 5.35782 9.11816V11.2161L6.35782 11.9981V9.1175C6.35797 7.62365 6.85869 6.17084 7.77209 5.00389L10.3128 1.70668C10.3382 1.67286 10.3546 1.63141 10.3606 1.58755C10.3665 1.54368 10.3617 1.49874 10.3456 1.45756C10.3296 1.41637 10.3028 1.38043 10.2678 1.35373C10.2329 1.32704 10.1911 1.31071 10.1472 1.3058H9.93584ZM1.44868 0.244298C4.26052 -0.0787596 7.1116 -0.0787596 9.92344 0.244298C10.9487 0.362047 11.4561 1.60213 10.8031 2.42522L8.26244 5.72242C7.50891 6.68939 7.10782 7.90567 7.10782 9.11816V12.1453C7.10789 12.2459 7.07963 12.3441 7.02616 12.4271C6.9727 12.5102 6.89625 12.5755 6.80782 12.6156C6.7194 12.6557 6.62204 12.6688 6.52783 12.6534C6.43362 12.6381 6.34575 12.5951 6.27782 12.5306L3.90582 10.4751C3.83681 10.4146 3.78261 10.3386 3.74702 10.2521C3.71143 10.1657 3.69553 10.0714 3.70009 9.97739V9.1175C3.70009 7.90467 3.29963 6.68895 2.54642 5.72122L0.00575399 2.42522C-0.647905 1.60213 -0.139238 0.362047 0.886014 0.244298H1.44868Z"
                    fill="#9CA3AF"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium text-[#6B7280]">
                Financial Year :
              </span>
              <PeriodPicker
                selectedPeriod={selectedPeriod}
                onPeriodSelect={handlePeriodSelect}
                formatPeriodDisplay={formatFinancialYear}
              />
            </div>
          </div>

          {/* Payslip Table Section */}
          <div className="flex-1 overflow-y-auto">
            <TableReusable
              dataHeaders={payslipEmployeePortalHeaders}
              dataTable={payslipData}
              tableFor="payslipEmployeePortal"
              handleEdit={handleEdit}
            />
          </div>
        </>
      )}

      {/* Payslip detail */}
      {showPayslip && (
        <div className="w-full h-full overflow-hidden">
          <PayslipEmployeePortalDetail
            data={payslipData}
            monthActive={tempData}
            handleCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
}

export default PayslipEmployeePortal;
