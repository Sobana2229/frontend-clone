import { useState, useEffect } from "react";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DownloadSimple, CaretDown } from "@phosphor-icons/react";
import ElegantTemplate from "../../pdfTamplates/regularPayslips/elegantTemplate";
import employeePortalStoreManagements from "../../../../store/tdPayroll/employeePortal";
import employeeStoreManagements from "../../../../store/tdPayroll/employee";
import Modal from "react-modal";
import authStoreManagements from "../../../../store/tdPayroll/auth";
import { checkPermission } from "../../../../../helper/globalHelper";

const baseUrl = import.meta.env.VITE_BASEURL;

const DocumentPayslipEmployeePortal = ({ isAdminPortal, uuid }) => {
  const { fetchEmployeePersonalDetail, dataEmployeePersonalDetail } =
    employeeStoreManagements();
  const { getPayslipEmployee, dataPayslipEmployee, loading } =
    employeePortalStoreManagements();
  const { user } = authStoreManagements();
  const [downloading, setDownloading] = useState(null);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModalPrevFile, setShowModalPrevFile] = useState(false);
  const [selectedPayslipData, setSelectedPayslipData] = useState(null);
  
  // Generate years array
  const generateYears = () => {
    const currentYear = dayjs().year();
    const years = [];
    for (let i = 0; i < 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  const years = generateYears();

  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");
    if (!isAdminPortal) {
      fetchEmployeePersonalDetail(access_token, null, "employee-portal");
    }
    getPayslipEmployee(access_token, selectedYear, uuid);  
  }, [selectedYear, uuid]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setIsDropdownOpen(false);
  };

  // ✅ Generate payslip data from store
  const generatePayslipData = () => {
    if (!dataPayslipEmployee || !dataPayslipEmployee.historicalPayslips) {
      return [];
    }

    const payslips = dataPayslipEmployee.historicalPayslips;

    if (isAdminPortal && uuid) {
      return payslips
        .filter((payslip) => payslip.hasPayslip && payslip.payrunStatus === 'paid')
        .map((payslip) => ({
          month: dayjs(payslip.monthDate).format("MMMM YYYY"),
          monthDate: payslip.monthDate,
          grossPay: payslip.grossPay || 0,
          reimbursements: payslip.reimbursements || 0,
          deductions: payslip.deductions || 0,
          netPay: payslip.netPay || 0,
          earnings: Array.isArray(payslip.earnings) ? payslip.earnings : [],
          deductionsList: Array.isArray(payslip.deductionsList)
            ? payslip.deductionsList
            : [],
          taxes: payslip.taxes || 0,
          hasPayslip: payslip.hasPayslip,
          hasTaxWorksheet: payslip.hasTaxWorksheet || false,
          payrunUuid: payslip.payrunUuid,
          payrunStatus: payslip.payrunStatus,
          paidDays: payslip.paidDays || 30,
          lopDays: payslip.lopDays || 0,
          absentDays: payslip.absentDays || null,
          payrunRecordPayments: payslip.payrunRecordPayments || {},
          benefits: Array.isArray(payslip.benefits) ? payslip.benefits : [],
          totalEmployeeBenefits: payslip.totalEmployeeBenefits || 0,
          totalEmployerBenefits: payslip.totalEmployerBenefits || 0
        }));
    }

    return payslips.map((payslip) => ({
      month: dayjs(payslip.monthDate).format("MMMM YYYY"),
      monthDate: payslip.monthDate,
      grossPay: payslip.grossPay || 0,
      reimbursements: payslip.reimbursements || 0,
      deductions: payslip.deductions || 0,
      netPay: payslip.netPay || 0,
      earnings: Array.isArray(payslip.earnings) ? payslip.earnings : [],
      deductionsList: Array.isArray(payslip.deductionsList)
        ? payslip.deductionsList
        : [],
      taxes: payslip.taxes || 0,
      hasPayslip: payslip.hasPayslip,
      hasTaxWorksheet: payslip.hasTaxWorksheet || false,
      payrunUuid: payslip.payrunUuid,
      payrunStatus: payslip.payrunStatus,
      paidDays: payslip.paidDays || 30,
      lopDays: payslip.lopDays || 0,
      absentDays: payslip.absentDays || null,
      payrunRecordPayments: payslip.payrunRecordPayments || {},
      benefits: Array.isArray(payslip.benefits) ? payslip.benefits : [],
      totalEmployeeBenefits: payslip.totalEmployeeBenefits || 0,
      totalEmployerBenefits: payslip.totalEmployerBenefits || 0
    }));
  };

  const payslipData = generatePayslipData();

  const handleDownload = async (monthData) => {
    if (!monthData || !monthData.hasPayslip) {
      alert("Payslip not available for this month");
      return;
    }

    setDownloading(monthData.month);

    try {
      // ✅ Force show the element temporarily by removing 'hidden' class
      const hiddenContainer = document.querySelector(".hidden");
      if (hiddenContainer) {
        hiddenContainer.classList.remove("hidden");
        hiddenContainer.style.position = "absolute";
        hiddenContainer.style.left = "-9999px";
        hiddenContainer.style.top = "0";
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const selector = `[data-payslip="${monthData.month.replace(/\s+/g, "-")}"]`;
      const payslipElement = document.querySelector(selector);

      if (!payslipElement) {
        alert("Failed to generate payslip. Please try again.");
        if (hiddenContainer) {
          hiddenContainer.classList.add("hidden");
        }
        setDownloading(null);
        return;
      }

      // Wait for all images (including logo) to load
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

      await waitForImages(payslipElement);
      
      // Additional delay to ensure rendering is complete
      await new Promise((resolve) => setTimeout(resolve, 300));

      // ✅ Optimize canvas settings for smaller file size
      const canvas = await html2canvas(payslipElement, {
        scale: 1.5, // Reduced from 2 to 1.5 for smaller file size (still good quality)
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        width: payslipElement.scrollWidth,
        height: payslipElement.scrollHeight,
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

      // Hide again
      if (hiddenContainer) {
        hiddenContainer.classList.add("hidden");
        hiddenContainer.style.position = "";
        hiddenContainer.style.left = "";
        hiddenContainer.style.top = "";
      }

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error("Failed to generate canvas");
      }

      // ✅ Use JPEG with quality 0.85 for better compression (smaller file size)
      // JPEG is much smaller than PNG while maintaining good quality for documents
      const imgData = canvas.toDataURL("image/jpeg", 0.85);

      if (!imgData || imgData === "data:,") {
        throw new Error("Failed to generate image data");
      }

      // ✅ Enable PDF compression for smaller file size
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true
      });

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // ✅ Use JPEG format instead of PNG for smaller file size
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const employeeName = mappedEmployee.fullName.replace(/\s+/g, "_");
      const monthName = monthData.month.replace(/\s+/g, "_");
      const fileName = `Payslip_${monthName}_${employeeName}.pdf`;

      pdf.save(fileName);

      alert(`✅ Payslip downloaded: ${fileName}`);
    } catch (error) {
      alert(`❌ Failed to download payslip: ${error.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2
    }).format(amount || 0);
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
      const parts = [addressLine1, addressLine2, district, country, postcode].filter(
        Boolean
      );
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
        org?.postalCode
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : "-";
    };

    return {
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
      dateOfBirth: detail?.dateOfBirth || "-",
      age: detail?.age || "-",
      maritalStatus: detail?.maritalStatus || "-",
      bloodGroup: detail?.bloodGroup || "-",
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
      employmentType: detail?.EmploymentType?.name || "-",
      employeeStatus: detail?.employeeStatus || "-",
      citizenshipCategory: detail?.Employee?.citizenCategory || "-", // ✅ FIX: Use Employee.citizenCategory instead of EmployeePersonalDetail.citizenshipCategory
      emergencyContactName: detail?.emergencyContactName || "-",
      emergencyContactMobile: detail?.emergencyContactMobile || "-",
      workLocation: org?.addressLine1 || "-"
    };
  };

  const mappedEmployee = mapEmployeePersonalDetail(dataEmployeePersonalDetail);

  const getPayslipTemplateData = (monthData) => {
    return {
      companyName: dataEmployeePersonalDetail?.Organization?.name || dataPayslipEmployee?.dataPaySchedule?.organizationName || "Company Name",
      month: monthData.month,
      netPay: monthData.netPay || 0,
      grossPay: monthData.grossPay || 0,
      deductions: monthData.deductions || 0,
      earnings: Array.isArray(monthData.earnings) ? monthData.earnings : [],
      deductionsList: Array.isArray(monthData.deductionsList)
        ? monthData.deductionsList
        : [],
      taxes: monthData.taxes || 0,
      paidDays: monthData.paidDays || 30,
      lopDays: monthData.lopDays || 0,
      absentDays: monthData.absentDays !== undefined && monthData.absentDays !== null ? monthData.absentDays : null,
      reimbursements: monthData.reimbursements || 0,
      payDate: monthData.payrunRecordPayments?.paymentDate || new Date().toISOString(),
      benefits: Array.isArray(monthData.benefits) ? monthData.benefits : [],
      totalEmployeeBenefits: monthData.totalEmployeeBenefits || 0,
      totalEmployerBenefits: monthData.totalEmployerBenefits || 0,
      hasPayslip: monthData.hasPayslip || false
    };
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {checkPermission(user, "Payslips", "View") ? (
        <>
          {/* Year Dropdown */}
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-600">▼</span>
              <span className="text-sm text-gray-600">Financial Year :</span>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <span>
                    {selectedYear} - {(selectedYear + 1) % 100}
                  </span>
                  <CaretDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <div className="py-1">
                      {years.map((year) => (
                        <button
                          key={year}
                          onClick={() => handleYearChange(year)}
                          className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                            selectedYear === year
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-700"
                          }`}
                        >
                          {year} - {(year + 1) % 100}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              {isAdminPortal && uuid ? (
                <thead className="text-sm text-[#1F87FF] uppercase">
                  <tr className="bg-[#F5FAFF]">
                    <th
                      scope="col"
                      className="px-6 py-5 font-medium capitalize text-left"
                    >
                      PAYMENT DATE
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-5 font-medium capitalize text-left"
                    >
                      MONTH
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-5 font-medium capitalize text-left"
                    >
                      PAYMENT MODE
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-5 font-medium capitalize text-left"
                    >
                      PAYSLIPS
                    </th>
                  </tr>
                </thead>
              ) : (
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month & Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
              )}

              {isAdminPortal && uuid ? (
                <tbody className="bg-white divide-y divide-gray-200">
                  {payslipData && payslipData.length > 0 ? (
                    payslipData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-base font-medium text-[#111827]">
                            {`${item?.paidDays}/${dayjs(
                              item.month,
                              "MMMM YYYY"
                            ).format("MM/YYYY")}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-base text-[#111827]">
                            {item.month}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-base text-[#111827]">
                            {item?.payrunRecordPayments?.paidThroughAccount ||
                              "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {item.hasPayslip ? (
                            <div className="w-full flex items-center justify-start space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedPayslipData(item);
                                  setShowModalPrevFile(true);
                                }}
                                disabled={downloading === item.month}
                                className="inline-flex items-center space-x-2 text-[#1F87FF] hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed border-r pe-2"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDownload(item)}
                                disabled={downloading === item.month}
                                className="inline-flex items-center space-x-2 text-[#D1D5DB] disabled:opacity-50 disabled:cursor-not-allowed hover:text-blue-600"
                              >
                                <DownloadSimple size={16} weight="bold" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-base text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No payslips found for {selectedYear}
                      </td>
                    </tr>
                  )}
                </tbody>
              ) : (
                <tbody className="bg-white divide-y divide-gray-200">
                  {payslipData && payslipData.length > 0 ? (
                    payslipData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`text-sm font-medium ${
                              item.hasPayslip
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          >
                            {item.month}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Payslips</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {item.hasPayslip ? (
                            <button
                              onClick={() => handleDownload(item)}
                              disabled={downloading === item.month}
                              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <DownloadSimple size={16} weight="bold" />
                              <span className="text-sm font-medium">
                                {downloading === item.month
                                  ? "Downloading..."
                                  : "Download"}
                              </span>
                            </button>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No payslips found for {selectedYear}
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>
          </div>

          {/* Hidden PDF Templates */}
          <div className="hidden">
            {payslipData &&
              payslipData
                .filter((item) => item.hasPayslip)
                .map((item, index) => (
                  <div
                    key={index}
                    data-payslip={item.month.replace(/\s+/g, "-")}
                  >
                    <ElegantTemplate
                      isEmployeePortal={true}
                      imgUrl={dataEmployeePersonalDetail?.Organization?.profileImagePath 
                        ? `${baseUrl}${dataEmployeePersonalDetail.Organization.profileImagePath}` 
                        : ""}
                      data={getPayslipTemplateData(item)}
                      employee={mappedEmployee}
                    />
                  </div>
                ))}
          </div>
        </>
      ) : (
        <p>No data available</p>
      )}

      <Modal
        isOpen={showModalPrevFile}
        contentLabel="Payslip Preview"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            border: "none",
            backgroundColor: "transparent",
            padding: 0,
            margin: 0,
            overflow: "visible",
            minHeight: "unset"
          }
        }}
      >
        <div className="min-w-[700px] max-w-[900px] w-full bg-white rounded-xl shadow-lg flex flex-col relative">
          {/* Header Area */}
          <div className="flex items-center justify-between px-7 pt-7 pb-3 border-b">
            <div className="text-2xl font-semibold text-gray-800">
              {selectedPayslipData
                ? `Payslip for ${selectedPayslipData.month}`
                : "Payslip Preview"}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleDownload(selectedPayslipData)}
                className="px-4 py-2 bg-[#0066DD] text-white rounded-xl hover:bg-blue-600"
              >
                Download
              </button>
              <button
                onClick={() => setShowModalPrevFile(false)}
                className="px-4 py-2 bg-white border-2 border-black rounded-xl font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
          {/* Payslip Content */}
          <div className="w-full max-h-[80vh] overflow-y-auto flex items-start justify-center px-7 py-8">
            {selectedPayslipData && (
              <ElegantTemplate
                isEmployeePortal={true}
                imgUrl={dataEmployeePersonalDetail?.Organization?.profileImagePath 
                  ? `${baseUrl}${dataEmployeePersonalDetail.Organization.profileImagePath}` 
                  : ""}
                data={getPayslipTemplateData(selectedPayslipData)}
                employee={mappedEmployee}
              />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentPayslipEmployeePortal;
