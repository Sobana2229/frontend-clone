import HeaderReusable from "../../component/setting/headerReusable";
import {
  Scroll,
  FilePlus,
  GasPump,
  Wrench,
  Laptop,
  TShirt,
  ForkKnife,
  Lightning,
  CaretRight,
} from "@phosphor-icons/react";
import { reimbursementEmployeePortalHeaders } from "../../../../data/dummy";
import { useEffect, useState } from "react";
import PaginationPages from "../../component/paginations";
import TableReusable from "../../component/setting/tableReusable";
import employeePortalStoreManagements from "../../../store/tdPayroll/employeePortal";
import FormReimbursementEmployeePortal from "../../component/employeePortal/formReimbursement";
import { toast } from "react-toastify";
import { CustomToast } from "../../component/customToast";
import dayjs from "dayjs";
import PeriodPicker from "../../component/employeePortal/PeriodPicker";

function ReimbursementEmployeePortal() {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    getReimbursementEmployee,
    dataReimbursementEmployeeList,
    dataReimbursementEmployee,
    loading,
    modifyReimbursementEmployee,
    getOneReimbursementEmployee,
  } = employeePortalStoreManagements();
  const [showForm, setShowForm] = useState(false);
  const [tempData, setTempData] = useState(undefined);
  const [tempUuid, setTempUuid] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(
    dayjs().format("YYYY-MM")
  );

  // Use real API data
  const displayData = dataReimbursementEmployeeList;

  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");
    getReimbursementEmployee(
      access_token,
      "reimbursementList",
      selectedPeriod,
      currentPage,
      10
    );
  }, [selectedPeriod, currentPage]);

  useEffect(() => {
    if (!dataReimbursementEmployee) {
      const access_token = localStorage.getItem("accessToken");
      getReimbursementEmployee(access_token, "reimbursement");
    }
  }, []);

  // Format period for display
  const formatPeriodDisplay = (period) => {
    if (!period) return "";
    const date = dayjs(period);
    const year = date.year();
    const month = date.format("MM"); // 01, 02, 03, etc.
    return `${year} - ${month}`;
  };

  // Handle period selection
  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    setCurrentPage(1); // Reset to first page when period changes
  };

  const handleShowModal = async () => {
    if (!showForm) {
      setTempData(undefined);
      setIsUpdate(false);
      setTempUuid("");
    }
    setShowForm(!showForm);
  };

  const handleCancel = () => {
    setShowForm(false);
    setTempData(undefined);
    setIsUpdate(false);
    setTempUuid("");
  };

  const handleDelete = async (uuid) => {
    const access_token = localStorage.getItem("accessToken");
    const response = await modifyReimbursementEmployee(
      access_token,
      "delete-reimbursement",
      uuid,
      {}
    );
    if (response) {
      await getReimbursementEmployee(
        access_token,
        "reimbursementList",
        selectedPeriod,
        currentPage,
        10
      );
      toast(<CustomToast message={response} status={"success"} />, {
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

  const handleEdit = async (uuid, type) => {
    const access_token = localStorage.getItem("accessToken");
    if (type == "status") {
      const response = await modifyReimbursementEmployee(
        access_token,
        "status-reimbursement",
        uuid,
        {}
      );
      if (response) {
        await getReimbursementEmployee(
          access_token,
          "reimbursementList",
          selectedPeriod,
          currentPage,
          10
        );
        toast(<CustomToast message={response} status={"success"} />, {
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
    } else {
      const data = await getOneReimbursementEmployee(
        access_token,
        "reimbursement",
        uuid
      );
      setTempData(data);
      setShowForm(true);
      setIsUpdate(true);
      setTempUuid(uuid);
    }
  };

  // CALCULATE USAGE untuk balance display dengan parent-child structure
  const calculateReimbursementUsage = (componentUuid) => {
    if (!displayData?.list) return 0;

    let totalUsed = 0;

    // Loop through parent claims
    displayData.list.forEach((claim) => {
      // Loop through bills dalam setiap claim
      if (claim.bills && claim.bills.length > 0) {
        claim.bills.forEach((bill) => {
          if (
            bill.salaryDetailComponentUuid === componentUuid &&
            ["approve", "submitted"].includes(claim.status)
          ) {
            totalUsed += parseFloat(bill.billAmount || 0);
          }
        });
      } else {
        // FALLBACK: Old single record structure (backward compatibility)
        if (
          claim.salaryDetailComponentUuid === componentUuid &&
          ["approve", "submitted"].includes(claim.status)
        ) {
          totalUsed += parseFloat(claim.billAmount || 0);
        }
      }
    });

    return totalUsed;
  };

  // Helper function to get icon based on reimbursement name
  const getReimbursementIcon = (name) => {
    const nameLower = name?.toLowerCase() || "";
    if (nameLower.includes("fuel")) {
      return <GasPump size={20} weight="regular" className="text-[#6B7280]" />;
    } else if (
      nameLower.includes("vehicle") ||
      nameLower.includes("maintenance")
    ) {
      return <Wrench size={20} weight="regular" className="text-[#6B7280]" />;
    } else if (nameLower.includes("laptop")) {
      return <Laptop size={20} weight="regular" className="text-[#6B7280]" />;
    } else if (
      nameLower.includes("dress") ||
      nameLower.includes("shirt") ||
      nameLower.includes("clothing")
    ) {
      return <TShirt size={20} weight="regular" className="text-[#6B7280]" />;
    } else if (
      nameLower.includes("lunch") ||
      nameLower.includes("meal") ||
      nameLower.includes("food")
    ) {
      return (
        <ForkKnife size={20} weight="regular" className="text-[#6B7280]" />
      );
    } else if (
      nameLower.includes("electric") ||
      nameLower.includes("electricity") ||
      nameLower.includes("power")
    ) {
      return (
        <Lightning size={20} weight="regular" className="text-[#6B7280]" />
      );
    }
    // Default icon
    return <FilePlus size={20} weight="regular" className="text-[#6B7280]" />;
  };

  // Helper function to format reimbursement name with "Reimbursement" suffix and capitalize first letter
  const formatReimbursementName = (name) => {
    if (!name) return "";

    // Remove "Reimbursement" if already exists (case insensitive)
    let cleanName = name.replace(/reimbursement/gi, "").trim();

    // Capitalize first letter
    cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    // Add "Reimbursement" suffix
    return `${cleanName} Reimbursement`;
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#F9FAFB]">
      <HeaderReusable
        title={
          showForm ? (isUpdate ? "Edit Claim" : "New Claim") : "Reimbursements"
        }
        isAddData={!showForm}
        addDataTitle="Add Claim"
        handleShowModal={handleShowModal}
      />
      {!showForm ? (
        <div className="w-full flex-1 overflow-y-auto p-6 flex flex-col">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1">
            <div className="bg-[#F5FAFF] px-8 py-7 space-y-8">
              <div className="flex flex-wrap items-center gap-6 text-[#6B7280]">
                <h2 className="text-[20px] font-medium text-[#374151]">
                  Unclaimed Amount Summary
                </h2>
                <span className="text-[#D1D5DB] text-2xl leading-none">|</span>
                <div className="flex items-center gap-2 text-sm font-medium">
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
                  <span>Period :</span>
                  <PeriodPicker
                    selectedPeriod={selectedPeriod}
                    onPeriodSelect={handlePeriodSelect}
                    formatPeriodDisplay={formatPeriodDisplay}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
                {dataReimbursementEmployee?.SalaryDetailComponents &&
                dataReimbursementEmployee.SalaryDetailComponents.length > 0 ? (
                  dataReimbursementEmployee.SalaryDetailComponents.map((el) => {
                    // Calculate usage dengan parent-child structure
                    const totalUsed = calculateReimbursementUsage(el.uuid);
                    const availableAmount = parseFloat(el?.amount || 0);
                    const remainingAmount = availableAmount - totalUsed;

                    return (
                      <div
                        key={el.uuid}
                        className="flex items-start gap-3 px-1"
                      >
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-[#E5E7EB]">
                          {getReimbursementIcon(
                            el?.SalaryComponentReimbursement?.nameInPaysl
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="truncate text-lg font-medium text-[#111827]">
                            $
                            {remainingAmount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <span className="text-sm text-[#6B7280]">
                            {formatReimbursementName(
                              el?.SalaryComponentReimbursement?.nameInPaysl
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center text-gray-500">
                    No reimbursement categories available
                  </div>
                )}
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#1F87FF] transition-colors hover:text-[#0066DD]"
              >
                Show Detailed Summary
                <CaretRight size={12} />
              </button>
            </div>

            <div className="border-t border-[#E5E7EB] px-0 py-7 flex-1 flex flex-col">
              <div className="flex items-center gap-3 text-[#111827] px-8">
                <Scroll size={24} weight="bold" className="text-[#1F87FF]" />

                <h1 className="text-xl font-medium">Allll </h1>
              </div>

              <div className="mt-6 overflow-hidden flex-1">
                <TableReusable
                  dataHeaders={reimbursementEmployeePortalHeaders}
                  dataTable={displayData?.list}
                  tableFor={"reimbursementEmployeePortal"}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                  dataReimbursementEmployee={dataReimbursementEmployee}
                  formatReimbursementName={formatReimbursementName}
                />
              </div>

              {Number(displayData?.totalPage || 0) > 1 && (
                <div className="mt-6 flex w-full items-center justify-end px-8">
                  <PaginationPages
                    totalPages={displayData?.totalPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex-1 overflow-y-auto p-6">
          <FormReimbursementEmployeePortal
            key={tempUuid || "create"}
            handleCancel={handleCancel}
            data={tempData}
            isUpdate={isUpdate}
            tempUuid={tempUuid}
          />
        </div>
      )}
    </div>
  );
}

export default ReimbursementEmployeePortal;
