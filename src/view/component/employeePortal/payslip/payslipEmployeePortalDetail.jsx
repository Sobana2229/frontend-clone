import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { DownloadSimple } from "@phosphor-icons/react";
import ElegantTemplate from "../../pdfTamplates/regularPayslips/elegantTemplate";
import employeeStoreManagements from "../../../../store/tdPayroll/employee";
import employeePortalStoreManagements from "../../../../store/tdPayroll/employeePortal";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import PeriodPicker from "../PeriodPicker";
import { salaryComponentMonthlyMap } from "../../../../../data/dummy";

const baseUrl = import.meta.env.VITE_BASEURL;


const PayslipEmployeePortalDetail = ({
  data,
  monthActive,
  autoDownload = false,
  onDownloadComplete,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(monthActive);
  const { fetchEmployeePersonalDetail, dataEmployeePersonalDetail } =
    employeeStoreManagements();
  const { getPayslipEmployee, dataPayslipEmployee } =
    employeePortalStoreManagements();
  const [downloading, setDownloading] = useState(false);
  const [pdfMode, setPdfMode] = useState(false);
  const [detailedPayslipData, setDetailedPayslipData] = useState(null);
  const [hasAutoDownloaded, setHasAutoDownloaded] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(
    monthActive?.month
      ? dayjs(monthActive.month, "MMMM YYYY").format("YYYY-MM")
      : dayjs().format("YYYY-MM")
  );
  const [payslipListData, setPayslipListData] = useState(data || []);
  const [historicalPayslipsData, setHistoricalPayslipsData] = useState(null);
  const [lastFetchedUuid, setLastFetchedUuid] = useState(null);
  const [lastFetchType, setLastFetchType] = useState(null);


  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");
    fetchEmployeePersonalDetail(access_token, null, "employee-portal");

    if (selectedPeriod) {
      getPayslipEmployee(access_token, null, null, selectedPeriod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (monthActive) {
      setSelectedMonth(monthActive);
    }
    if (data && data.length > 0 && payslipListData.length === 0) {
      setPayslipListData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthActive, data]);


  useEffect(() => {
    if (
      selectedMonth?.payrunUuid &&
      selectedMonth.payrunUuid !== lastFetchedUuid
    ) {
      const access_token = localStorage.getItem("accessToken");
      setLastFetchedUuid(selectedMonth.payrunUuid);
      setLastFetchType("detail");
      getPayslipEmployee(access_token, null, null, selectedMonth.payrunUuid);
    } else if (selectedMonth && !selectedMonth.payrunUuid) {
      setDetailedPayslipData(null);
      setLastFetchedUuid(null);
      setLastFetchType(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth?.payrunUuid]);


  useEffect(() => {
    if (
      dataPayslipEmployee?.employee &&
      !dataPayslipEmployee?.historicalPayslips
    ) {
      setDetailedPayslipData(dataPayslipEmployee.employee);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataPayslipEmployee]);


  useEffect(() => {
    if (autoDownload && !hasAutoDownloaded && pdfMode && detailedPayslipData) {
      const timer = setTimeout(() => {
        handleDownloadPayslip();
        setHasAutoDownloaded(true);
        if (onDownloadComplete) {
          onDownloadComplete();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoDownload, hasAutoDownloaded, pdfMode, detailedPayslipData]);


  useEffect(() => {
    if (autoDownload && !pdfMode) {
      setPdfMode(true);
    }
  }, [autoDownload]);


  const getCurrentMonthData = () => {
    return (
      payslipListData.find((item) => item.month === selectedMonth?.month) ||
      selectedMonth
    );
  };


  const currentData = getCurrentMonthData();


  const formatCurrency = (value) => {
    if (!value && value !== 0) return "$0.00";
    const numValue =
      typeof value === "string"
        ? parseFloat(value.replace(/[^0-9.-]+/g, ""))
        : value;
    return `$${numValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };


  const parseCurrency = (value) => {
    if (!value) return 0;
    if (typeof value === "number") return value;
    return parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0;
  };


  const grossPay = parseCurrency(
    currentData.grossPay || currentData.originalData?.grossPay || 0
  );
  const deductions = parseCurrency(
    currentData.deductions || currentData.originalData?.deductions || 0
  );
  const takeHome = parseCurrency(
    currentData.takeHome || currentData.originalData?.netPay || 0
  );
  const reimbursements = parseCurrency(
    currentData.reimbursements || currentData.originalData?.reimbursements || 0
  );


  const getEarningsData = () => {
    // ✅ PRIORITAS 1: dari originalData.earnings (response dari backend)
    if (currentData?.originalData?.earnings && 
        Array.isArray(currentData.originalData.earnings) && 
        currentData.originalData.earnings.length > 0) {
      // ✅ Override label dengan monthlyAllowanceNames jika tersedia
      const monthlyAllowanceNames = dataPayslipEmployee?.monthlyAllowanceNames || {};
      
      const earnings = currentData.originalData.earnings.map(item => {
        // ✅ Jika label dari backend sudah match dengan salah satu nameInPayslip, gunakan langsung
        // ✅ Jika tidak, coba reverse lookup berdasarkan field name
        let finalLabel = item.label;
        const labelLower = item.label?.toLowerCase() || "";
        
        // Cek apakah label sudah match dengan salah satu nameInPayslip
        const matchedField = Object.entries(monthlyAllowanceNames).find(([field, nameInPayslip]) => {
          if (!nameInPayslip) return false;
          const nameLower = nameInPayslip.toLowerCase();
          return labelLower === nameLower || 
                 labelLower.includes(nameLower) || 
                 nameLower.includes(labelLower);
        });
        
        if (matchedField) {
          finalLabel = matchedField[1]; // Use nameInPayslip
        } else {
          // Reverse lookup: coba match berdasarkan field name pattern
          const fieldName = Object.keys(monthlyAllowanceNames).find(field => {
            const fieldPattern = field.replace(/([A-Z])/g, " $1").toLowerCase().replace("monthly", "").trim();
            return labelLower.includes(fieldPattern) || fieldPattern.includes(labelLower);
          });
          
          if (fieldName && monthlyAllowanceNames[fieldName]) {
            finalLabel = monthlyAllowanceNames[fieldName];
          }
        }
        
        return {
          label: finalLabel,
          amount: parseFloat(item.amount) || 0
        };
      });

      // ✅ Add Fixed Allowance, Custom Allowance, and Basic Custom Allowance from payrollCalculation.earnings if not already in earnings
      const payrollEarnings = currentData?.originalData?.payrollCalculation?.earnings || {};
      
      // Check if Fixed Allowance already exists in earnings
      const hasFixedAllowance = earnings.some(e => e.label?.toLowerCase().includes("fixed allowance"));
      if (!hasFixedAllowance && payrollEarnings.fixedAllowance && parseFloat(payrollEarnings.fixedAllowance) > 0) {
        earnings.push({
          label: "Fixed Allowance",
          amount: parseFloat(payrollEarnings.fixedAllowance)
        });
      }

      // Check if Custom Allowance already exists in earnings
      const hasCustomAllowance = earnings.some(e => e.label?.toLowerCase() === "custom allowance");
      if (!hasCustomAllowance && payrollEarnings.customAllowance && parseFloat(payrollEarnings.customAllowance) > 0) {
        earnings.push({
          label: "Custom Allowance",
          amount: parseFloat(payrollEarnings.customAllowance)
        });
      }

      // Check if Basic Custom Allowance already exists in earnings
      const hasBasicCustomAllowance = earnings.some(e => e.label?.toLowerCase() === "basic custom allowance");
      if (!hasBasicCustomAllowance && payrollEarnings.basicCustomAllowance && parseFloat(payrollEarnings.basicCustomAllowance) > 0) {
        earnings.push({
          label: "Basic Custom Allowance",
          amount: parseFloat(payrollEarnings.basicCustomAllowance)
        });
      }

      return earnings;
    }
    
    // ✅ PRIORITAS 2: dari detailedPayslipData
    if (detailedPayslipData) {
      // ✅ Get monthlyAllowanceNames from dataPayslipEmployee if available (declare once at the top)
      const monthlyAllowanceNames = dataPayslipEmployee?.monthlyAllowanceNames || {};
      
      const earnings = [];
      if (detailedPayslipData.basicMonthly) {
        earnings.push({
          label: "Basic",
          amount: parseFloat(detailedPayslipData.basicMonthly) || 0,
        });
      }
      
      if (detailedPayslipData.hraMonthly) {
        earnings.push({
          label: monthlyAllowanceNames.hraMonthly || salaryComponentMonthlyMap.hraMonthly || "House Rent Allowance",
          amount: parseFloat(detailedPayslipData.hraMonthly) || 0,
        });
      }
      if (detailedPayslipData.conveyanceAllowanceMonthly) {
        earnings.push({
          label: monthlyAllowanceNames.conveyanceAllowanceMonthly || salaryComponentMonthlyMap.conveyanceAllowanceMonthly || "Conveyance Allowance",
          amount:
            parseFloat(detailedPayslipData.conveyanceAllowanceMonthly) || 0,
        });
      }
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
                            currentData?.originalData?.payrollCalculation?.earnings?.fixedAllowance;
      if (fixedAllowance && parseFloat(fixedAllowance) > 0) {
        earnings.push({
          label: "Fixed Allowance",
          amount: parseFloat(fixedAllowance)
        });
      }

      // ✅ Display Custom Allowance from payrollCalculation.earnings (bukan basic)
      const customAllowance = detailedPayslipData?.payrollCalculation?.earnings?.customAllowance || 
                              currentData?.originalData?.payrollCalculation?.earnings?.customAllowance;
      if (customAllowance && parseFloat(customAllowance) > 0) {
        earnings.push({
          label: "Custom Allowance",
          amount: parseFloat(customAllowance)
        });
      }

      // ✅ Display Basic Custom Allowance from payrollCalculation.earnings (jika ada)
      const basicCustomAllowance = detailedPayslipData?.payrollCalculation?.earnings?.basicCustomAllowance || 
                                   currentData?.originalData?.payrollCalculation?.earnings?.basicCustomAllowance;
      if (basicCustomAllowance && parseFloat(basicCustomAllowance) > 0) {
        earnings.push({
          label: "Basic Custom Allowance",
          amount: parseFloat(basicCustomAllowance)
        });
      }

      if (reimbursements > 0) {
        earnings.push({ label: "Reimbursements", amount: reimbursements });
      }

      if (earnings.length > 0) return earnings;
    }
    
    // ✅ PRIORITAS 3: Fallback dummy
    return getDefaultEarnings();
  };


  const getDefaultEarnings = () => {
    return [
      { label: "Basic", amount: Math.round(grossPay * 0.58) },
      { label: "House Rent Allowance", amount: Math.round(grossPay * 0.12) },
      { label: "Conveyance Allowance", amount: Math.round(grossPay * 0.1) },
      ...(reimbursements > 0
        ? [{ label: "Reimbursements", amount: reimbursements }]
        : []),
    ];
  };


  const getDeductionsData = () => {
    // ✅ PRIORITAS 1: dari originalData.deductionsList (response dari backend)
    if (currentData?.originalData?.deductionsList && 
        Array.isArray(currentData.originalData.deductionsList) && 
        currentData.originalData.deductionsList.length > 0) {
      return currentData.originalData.deductionsList.map(item => ({
        label: item.label,
        amount: parseFloat(item.amount) || 0
      }));
    }
    
    // ✅ PRIORITAS 2: dari detailedPayslipData
    if (detailedPayslipData) {
      const deductionsList = [];
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
      if (deductionsList.length > 0) return deductionsList;
    }
    
    // ✅ PRIORITAS 3: Fallback dummy
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


  const earningsData = getEarningsData();
  const deductionsData = getDeductionsData();


  const getMonthAbbreviation = () => {
    if (!selectedMonth?.month) return "";
    const monthDate = dayjs(selectedMonth.month, "MMMM YYYY");
    return monthDate.format("MMM YYYY").toUpperCase();
  };


  const DonutChart = ({ grossPay, deductions, takeHome }) => {
    const total = takeHome + deductions;
    const chartData = [];

    if (total > 0) {
      if (takeHome > 0) {
        chartData.push({
          name: "Take Home",
          value: takeHome,
          color: "#35d8b8",
        });
      }
      if (deductions > 0) {
        chartData.push({
          name: "Deductions",
          value: deductions,
          color: "#EF4444",
        });
      }
    }

    return (
      <div
        className="
          relative 
          w-full 
          h-full
          bg-[#F3F4F6]
          rounded-lg"
      >
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-8 border-[#E5E7EB]"></div>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-600">
            {getMonthAbbreviation()}
          </span>
        </div>
      </div>
    );
  };


  const handlePdfModeToggle = () => {
    setPdfMode(!pdfMode);
  };


  // Helper function to wait for all images to load
  const waitForImages = (element) => {
    return new Promise((resolve) => {
      const images = element.querySelectorAll("img");
      if (images.length === 0) {
        resolve();
        return;
      }

      let loadedCount = 0;
      const totalImages = images.length;

      const checkComplete = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          resolve();
        }
      };

      images.forEach((img) => {
        if (img.complete) {
          checkComplete();
        } else {
          img.onload = checkComplete;
          img.onerror = checkComplete; // Continue even if image fails to load
        }
      });
    });
  };

  const handleDownloadPayslip = async () => {
    setDownloading(true);
    try {
      const payslipElement = document.querySelector("[data-payslip-content]");

      if (!payslipElement) {
        alert("Payslip content not found!");
        return;
      }

      // Wait for all images (including logo) to load
      await waitForImages(payslipElement);
      
      // Additional delay to ensure rendering is complete
      await new Promise((resolve) => setTimeout(resolve, 300));

      // ✅ Optimize canvas settings for smaller file size
      const canvas = await html2canvas(payslipElement, {
        scale: 1.5, // Reduced from 2 to 1.5 for smaller file size (still good quality)
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        width: payslipElement.scrollWidth,
        height: payslipElement.scrollHeight,
        logging: false,
        onclone: (clonedDoc) => {
          // Ensure images are loaded in cloned document
          const clonedImages = clonedDoc.querySelectorAll("img");
          clonedImages.forEach((img) => {
            if (img.src && !img.complete) {
              img.crossOrigin = "anonymous";
            }
          });
        },
      });

      // ✅ Use JPEG with quality 0.85 for better compression (smaller file size)
      const imgData = canvas.toDataURL("image/jpeg", 0.85);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // ✅ Use JPEG format instead of PNG for smaller file size
      pdf.addImage(
        imgData,
        "JPEG",
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );

      while (heightLeft >= pdfHeight) {
        position = position - pdfHeight;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
        heightLeft -= pdfHeight;
      }

      const monthName = selectedMonth.month.replace(/\s+/g, "_");
      const fileName = `Payslip_${monthName}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      alert("Failed to download payslip. Please try again.");
    } finally {
      setDownloading(false);
    }
  };


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


  const mappedEmployee = mapEmployeePersonalDetail(dataEmployeePersonalDetail);


  const formatFinancialYear = (period) => {
    if (!period) return "";
    const date = dayjs(period);
    const year = date.year();
    const month = date.month() + 1;
    return `${year} - ${String(month).padStart(2, "0")}`;
  };


  const formatCurrencyForData = (value) => {
    if (!value && value !== 0) return "$0.00";
    const numValue = parseFloat(value);
    return `$${numValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };


  const generatePayslipData = (apiData) => {
    if (!apiData) {
      return [];
    }

    if (apiData.historicalPayslips && apiData.historicalPayslips.length > 0) {
      return apiData.historicalPayslips.map((payslip) => ({
        month: payslip.month || dayjs(payslip.monthDate).format("MMMM YYYY"),
        grossPay: formatCurrencyForData(payslip.grossPay || 0),
        reimbursements: formatCurrencyForData(payslip.reimbursements || 0),
        deductions: formatCurrencyForData(payslip.deductions || 0),
        takeHome: formatCurrencyForData(payslip.netPay || 0),
        hasPayslip: payslip.hasPayslip || false,
        hasTaxWorksheet: payslip.hasTaxWorksheet || false,
        payrunUuid: payslip.payrunUuid,
        payrunStatus: payslip.payrunStatus,
        originalData: payslip,
      }));
    }

    return [];
  };


  useEffect(() => {
    if (selectedPeriod) {
      const access_token = localStorage.getItem("accessToken");
      setLastFetchType("list");
      getPayslipEmployee(access_token, null, null, selectedPeriod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);


  useEffect(() => {
    if (
      dataPayslipEmployee?.historicalPayslips &&
      Array.isArray(dataPayslipEmployee.historicalPayslips) &&
      dataPayslipEmployee.historicalPayslips.length > 0 &&
      !dataPayslipEmployee?.employee
    ) {
      if (lastFetchType === "list" || lastFetchType === null) {
        setHistoricalPayslipsData(dataPayslipEmployee.historicalPayslips);
        const generatedData = generatePayslipData(dataPayslipEmployee);
        setPayslipListData(generatedData);

        if (generatedData.length > 0) {
          let monthToSelect = null;

          if (monthActive?.month) {
            const matchingMonth = generatedData.find(
              (item) => item.month === monthActive.month
            );
            if (matchingMonth) {
              monthToSelect = matchingMonth;
            }
          }

          if (!monthToSelect && selectedMonth?.month) {
            const currentMonthExists = generatedData.find(
              (item) => item.month === selectedMonth.month
            );
            if (currentMonthExists) {
              monthToSelect = currentMonthExists;
            }
          }

          if (!monthToSelect) {
            monthToSelect = generatedData[0];
          }

          if (monthToSelect) {
            if (
              !selectedMonth?.month ||
              selectedMonth.month !== monthToSelect.month ||
              (monthToSelect.payrunUuid &&
                monthToSelect.payrunUuid !== lastFetchedUuid)
            ) {
              setSelectedMonth(monthToSelect);
            }
          }
        }
      } else if (lastFetchType === "detail") {
        setLastFetchType(null);
        setLastFetchedUuid(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataPayslipEmployee]);


  useEffect(() => {
    if (historicalPayslipsData && historicalPayslipsData.length > 0) {
      const tempData = { historicalPayslips: historicalPayslipsData };
      const generatedData = generatePayslipData(tempData);
      if (JSON.stringify(generatedData) !== JSON.stringify(payslipListData)) {
        setPayslipListData(generatedData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historicalPayslipsData, dataPayslipEmployee]);


  const handlePeriodSelect = (period) => {
    if (!period) return;
    setSelectedPeriod(period);
    const periodDate = dayjs(period);
    const matchingMonth = payslipListData.find((item) => {
      const itemDate = dayjs(item.month, "MMMM YYYY");
      return (
        itemDate.year() === periodDate.year() &&
        itemDate.month() === periodDate.month()
      );
    });
    if (matchingMonth) {
      setSelectedMonth(matchingMonth);
    } else if (payslipListData.length > 0) {
      setSelectedMonth(payslipListData[0]);
    }
  };


  return (
    <div className="w-full h-full flex bg-[#F9FAFB] p-6">
      <div className="w-full flex bg-white rounded-lg overflow-hidden">
        <div className="w-80 flex-shrink-0 flex flex-col overflow-hidden border-r border-[#E5E7EB] relative">
          <div className="px-4 py-3 border-b border-[#E5E7EB] relative z-10">
            <div className="flex items-center gap-2 bg-white w-fit">
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

          <div className="flex-1 overflow-y-auto">
            <div>
              {payslipListData.map((item, index) => {
                const isSelected = selectedMonth.month === item.month;
                const takeHomeValue = parseCurrency(item.takeHome);
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedMonth(item)}
                    className={`px-4 py-4 cursor-pointer transition-colors ${
                      isSelected ? "bg-[#F5FAFF]" : "hover:bg-[#F9FAFB]"
                    }`}
                  >
                    <div className="flex flex-col">
                      <p className={`font-medium text-[#1F87FF]`}>
                        {item.month}
                      </p>
                      <p className={`text-sm mt-1 text-[#6B7280]`}>
                        Take Home: {formatCurrency(takeHomeValue)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-lg font-semibold text-[#111827]">
                Payslip for {selectedMonth?.month || "N/A"}
              </h2>
            </div>

            <div className="px-6 pb-6">
              <div className="flex flex-col lg:flex-row items-start gap-4 bg-white w-full">
                <div className="flex-1 w-full lg:flex-[2] h-[208px]">
                  <DonutChart
                    grossPay={grossPay}
                    deductions={deductions}
                    takeHome={takeHome}
                  />
                </div>

                <div className="flex-shrink-0 w-full lg:flex-1 flex flex-col gap-[4px] h-[208px]">
                  <div
                    className="flex flex-row items-center justify-between
                                 w-full flex-1
                                 bg-[#F3F4F6]
                                 rounded-lg
                                 p-4"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-1 bg-[#9CA3AF] rounded-l flex-shrink-0 self-stretch"></div>
                      <div className="flex flex-col justify-center">
                        <div className="text-sm text-[#9CA3AF]">Gross Pay</div>
                        <div className="text-2xl font-semibold text-[#6B7280]">
                          {formatCurrency(grossPay)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex flex-row items-center justify-between
                                 w-full flex-1
                                 bg-[#F3F4F6]
                                 rounded-lg
                                 p-4"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-1 bg-[#EF4444] rounded-l flex-shrink-0 self-stretch"></div>
                      <div className="flex flex-col justify-center">
                        <div className="text-sm text-[#9CA3AF]">Deductions</div>
                        <div className="text-2xl font-semibold text-[#6B7280]">
                          {formatCurrency(deductions)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full lg:flex-[2] h-[208px]">
                  <div
                    className="flex flex-row items-center justify-between
                                 w-full h-full
                                 bg-[#F3F4F6]
                                 rounded-lg
                                 p-4 relative"
                  >
                    <div className="flex items-start gap-2 w-full">
                      <div
                        className="w-1 bg-[#10B981] rounded-l flex-shrink-0"
                        style={{ alignSelf: "stretch", minHeight: "48px" }}
                      ></div>
                      <div className="flex flex-col justify-center py-1">
                        <div className="text-sm text-[#6B7280]">Take Home</div>
                        <div className="text-2xl font-semibold text-[#374151]">
                          {formatCurrency(takeHome)}
                        </div>
                      </div>
                    </div>
                    {pdfMode && (
                      <button
                        onClick={handleDownloadPayslip}
                        disabled={downloading}
                        className="absolute top-3 right-3 text-[#1F87FF] hover:text-[#0066CC] transition-colors"
                        title="Download Payslip"
                      >
                        <DownloadSimple size={20} weight="bold" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
              <h3 className="text-lg font-semibold text-[#111827]">
                Payslip Details
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#6B7280]">Show in PDF mode</span>
                <button
                  onClick={handlePdfModeToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    pdfMode ? "bg-[#1F87FF]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      pdfMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {pdfMode ? (
              <div className="w-full p-6">
                <div data-payslip-content>
                  <ElegantTemplate
                    isEmployeePortal={true}
                    imgUrl={dataEmployeePersonalDetail?.Organization?.profileImagePath 
                      ? `${baseUrl}${dataEmployeePersonalDetail.Organization.profileImagePath}` 
                      : ""}
                    data={{
                      companyName: dataEmployeePersonalDetail?.Organization?.name || dataPayslipEmployee?.dataPaySchedule?.organizationName || "Company Name",
                      month: selectedMonth.month,
                      netPay: takeHome,
                      grossPay: grossPay,
                      deductions: deductions,
                      earnings: earningsData,
                      deductionsList: deductionsData,
                      paidDays: currentData.originalData?.paidDays || 30,
                      lopDays: currentData.originalData?.lopDays || 0,
                      absentDays: currentData.originalData?.absentDays !== undefined && currentData.originalData?.absentDays !== null ? currentData.originalData.absentDays : null,
                      payDate: currentData.originalData?.payrunRecordPayments?.paymentDate || new Date().toISOString(),
                      hasPayslip: true, // Always show payslip details in employee portal
                      monthlyAllowanceNames: dataPayslipEmployee?.monthlyAllowanceNames || {} // ✅ Pass monthlyAllowanceNames to template
                    }}
                    employee={mappedEmployee}
                  />
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="bg-[#F5FAFF] rounded-lg p-6 mb-6">
                  <div className="flex items-center">
                    <div className="flex flex-col gap-2 flex-1">
                      <h3 className="text-base font-medium text-[#374151]">
                        {selectedMonth?.month || "N/A"}
                      </h3>
                      <p className="text-sm text-[#6B7280]">
                        Paid Days : {currentData.originalData?.paidDays || 30} • LOP
                        Days : {currentData.originalData?.lopDays || 0}
                      </p>
                    </div>

                    <div className="h-12 w-px bg-[#E5E7EB] mx-4"></div>

                    <div className="flex-1 grid grid-cols-2 gap-x-20 gap-y-2">
                      <div className="flex flex-col">
                        <p className="text-sm text-[#6B7280] mb-2">
                          Bank Account No
                        </p>
                        <p className="text-sm text-[#374151] font-medium">
                          {mappedEmployee.accountNumber || "-"}
                        </p>
                      </div>

                      <div className="flex flex-col">
                        <p className="text-sm text-[#6B7280] mb-2">
                          SPK Account No
                        </p>
                        <p className="text-sm text-[#374151] font-medium">
                          {mappedEmployee.esiNumber || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-[#E5E7EB] overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#F5FAFF]">
                        <th className="px-6 py-4 text-left text-base font-semibold text-[#111827] border-r border-[#E5E7EB] w-1/2">
                          Earnings
                        </th>
                        <th className="px-6 py-4 text-left text-base font-semibold text-[#111827] w-1/2">
                          Deductions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({
                        length: Math.max(
                          earningsData.length,
                          deductionsData.length
                        ),
                      }).map((_, index) => (
                        <tr key={index} className="bg-white">
                          <td className="px-6 py-4 border-r border-[#E5E7EB]">
                            {earningsData[index] ? (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-[#6B7280]">
                                  {earningsData[index].label}
                                </span>
                                <span className="text-sm font-medium text-[#111827]">
                                  {formatCurrency(earningsData[index].amount)}
                                </span>
                              </div>
                            ) : (
                              <div></div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {deductionsData[index] ? (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-[#6B7280]">
                                  {deductionsData[index].label}
                                </span>
                                <span className="text-sm font-medium text-[#111827]">
                                  {formatCurrency(deductionsData[index].amount)}
                                </span>
                              </div>
                            ) : (
                              <div></div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayslipEmployeePortalDetail;
