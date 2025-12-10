import React, { useEffect, useState, useRef } from "react";
import ReuseableInput from "../reuseableInput";
import TableReusable from "../setting/tableReusable";
import employeePortalStoreManagements from "../../../store/tdPayroll/employeePortal";
import employeeStoreManagements from "../../../store/tdPayroll/employee";
import authStoreManagements from "../../../store/tdPayroll/auth";
import { toast } from "react-toastify";
import { CustomToast } from "../customToast";
import dayjs from "dayjs";
import {
  Calendar,
  CaretLeft,
  CaretRight,
  Link,
  Plus,
  PlusSquare,
  Trash,
} from "@phosphor-icons/react";
import { useLocation } from "react-router-dom";

function FormReimbursementEmployeePortal({
  handleCancel,
  data,
  isUpdate,
  tempUuid,
}) {
  const {
    dataReimbursementEmployee,
    createReimbursementEmployee,
    getReimbursementEmployee,
    loading,
    modifyReimbursementEmployee,
  } = employeePortalStoreManagements();
  const {
    fetchEmployeePersonalDetail,
    dataEmployeePersonalDetail,
    getEmployeeOverview,
    dataEmployeesOptions,
  } = employeeStoreManagements();

  const { user } = authStoreManagements();
  const [formData, setFormData] = useState({
    claimDate: dayjs().format("YYYY-MM-DD"),
    employeeUuid: "",
    bills: [
      {
        reimbursementUuid: "",
        billDate: "",
        billNo: "",
        billAmount: 0,
        approvedAmount: 0,
        remarks: "",
        attachments: [],
      },
    ],
  });
  const [previewImages, setPreviewImages] = useState([[]]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState({});
  const [datePickerMonth, setDatePickerMonth] = useState({});
  const datePickerRefs = useRef({});

  const { pathname } = useLocation();

  // Check if user is employee (not admin)
  // Employee portal pathname or user without admin permissions
  const isEmployee =
    pathname === "/employee-portal/reimbursement" ||
    (user?.role?.permissions?.length === 0 &&
      user?.role?.name !== "SUPER_ADMIN" &&
      user?.role?.name !== "ORGANIZATION_ADMIN");

  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");

    // handle admin can access employee selection
    if (pathname === "/employee-portal/reimbursement") {
      fetchEmployeePersonalDetail(access_token, null, "employee-portal");
      // Fetch reimbursement types for employee portal
      if (!dataReimbursementEmployee) {
        getReimbursementEmployee(access_token, "reimbursement");
      }
    } else if (pathname === "/reimbursement") {
      if (!dataEmployeesOptions) {
        getEmployeeOverview(access_token, "employeeOptions");
      }
    }
  }, []);

  // Fetch reimbursement types when employee is selected (admin only)
  useEffect(() => {
    if (pathname === "/reimbursement" && formData.employeeUuid) {
      const access_token = localStorage.getItem("accessToken");
      getReimbursementEmployee(access_token, "reimbursement", null, 1, 10, formData.employeeUuid);
    }
  }, [formData.employeeUuid, pathname]);

  useEffect(() => {
    if (data && data.bills) {
      // EDIT MODE - populate dengan multiple bills dari 1 claim
      setFormData({
        claimDate: data.claimDate
          ? dayjs(data.claimDate).format("YYYY-MM-DD") // Changed from DD-MM-YYYY
          : "",
        bills: data.bills.map((bill) => ({
          reimbursementUuid: bill.salaryDetailComponentUuid || "",
          billDate: bill.billDate
            ? new Date(bill.billDate).toISOString().split("T")[0]
            : "",
          billNo: bill.billNo || "",
          billAmount: parseFloat(bill.billAmount) || 0,
          approvedAmount:
            parseFloat(bill.approvedAmount || bill.billAmount) || 0,
          remarks: bill.remarks || "",
          attachments: [],
        })),
      });

      // Set preview images untuk setiap bill
      const allPreviews = data.bills.map((bill) => {
        if (bill.attachments && bill.attachments.length > 0) {
          return bill.attachments
            .filter((attachment) =>
              [".png", ".jpg", ".jpeg", ".gif"].includes(attachment.extension)
            )
            .map((attachment) => ({
              url: `${import.meta.env.VITE_BASEURL}${attachment.url}`,
              name: attachment.filename,
              isExisting: true,
              serverId: attachment.filename,
            }));
        }
        return [];
      });
      setPreviewImages(allPreviews);
    } else if (data) {
      // FALLBACK: Old single record structure (backward compatibility)
      setFormData({
        claimDate: data.claimDate
          ? dayjs(data.claimDate).format("YYYY-MM-DD")
          : "",
        bills: [
          {
            reimbursementUuid: data.salaryDetailComponentUuid || "",
            billDate: data.billDate
              ? new Date(data.billDate).toISOString().split("T")[0]
              : "",
            billNo: data.billNo || "",
            billAmount: parseFloat(data.billAmount) || 0,
            approvedAmount:
              parseFloat(data.approvedAmount || data.billAmount) || 0,
            remarks: data.remarks || "",
            attachments: [],
          },
        ],
      });

      if (data.attachments && data.attachments.length > 0) {
        const existingPreviews = data.attachments
          .filter((attachment) =>
            [".png", ".jpg", ".jpeg", ".gif"].includes(attachment.extension)
          )
          .map((attachment) => ({
            url: `${import.meta.env.VITE_BASEURL}${attachment.url}`,
            name: attachment.filename,
            isExisting: true,
            serverId: attachment.filename,
          }));
        setPreviewImages([existingPreviews]);
      } else {
        setPreviewImages([[]]);
      }
    } else {
      // CREATE MODE - reset to initial state
      setFormData({
        claimDate: dayjs().format("YYYY-MM-DD"),
        employeeUuid: "",
        bills: [
          {
            reimbursementUuid: "",
            billDate: "",
            billNo: "",
            billAmount: 0,
            approvedAmount: 0,
            remarks: "",
            attachments: [],
          },
        ],
      });
      setPreviewImages([[]]);
      setDeletedFiles([]);
    }
  }, [data]);

  const handleClaimDateChange = (e) => {
    const val = e.target.value;
    // Date input type="date" already handles YYYY-MM-DD format
    setFormData({
      ...formData,
      claimDate: val,
    });
  };
  const handleEmployeeSelect = (selectedOption) => {
    const selectedEmployeeUuid = selectedOption?.value || "";
    setFormData((prev) => ({
      ...prev,
      employeeUuid: selectedEmployeeUuid,
    }));
    // useEffect will handle fetching reimbursement types when employeeUuid changes
  };
  const getSelectedValue = (options, valueKey) => {
    if (!options || !Array.isArray(options)) return null;
    return (
      options.find((option) => option.value === formData[valueKey]) || null
    );
  };

  // Helper function to capitalize each word
  const capitalizeEachWord = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Get employee name and code
  const getEmployeeName = () => {
    const emp = dataEmployeePersonalDetail?.Employee;
    if (emp) {
      const name = [emp?.firstName, emp?.middleName, emp?.lastName]
        .filter(Boolean)
        .join(" ");
      const capitalizedName = capitalizeEachWord(name);
      const code = emp?.employeeId || "";
      return capitalizedName ? `${capitalizedName} (${code})` : code || "-";
    }
    return capitalizeEachWord(user?.name) || "-";
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

  // Date picker handlers
  const toggleDatePicker = (billIndex) => {
    setShowDatePicker((prev) => ({
      ...prev,
      [billIndex]: !prev[billIndex],
    }));
    if (!datePickerMonth[billIndex]) {
      setDatePickerMonth((prev) => ({
        ...prev,
        [billIndex]: dayjs(),
      }));
    }
  };

  const selectDate = (billIndex, date) => {
    handleBillChange(billIndex, "billDate", dayjs(date).format("YYYY-MM-DD"));
    setShowDatePicker((prev) => ({
      ...prev,
      [billIndex]: false,
    }));
  };

  // Handle click outside date picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(datePickerRefs.current).forEach((billIndex) => {
        if (
          datePickerRefs.current[billIndex] &&
          !datePickerRefs.current[billIndex].contains(event.target)
        ) {
          setShowDatePicker((prev) => ({
            ...prev,
            [billIndex]: false,
          }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBillChange = (index, field, value) => {
    const updatedBills = [...formData.bills];
    updatedBills[index][field] = value;
    setFormData({
      ...formData,
      bills: updatedBills,
    });
  };

  const handleFileChange = (billIndex, files) => {
    const newFiles = Array.from(files);
    const updatedBills = [...formData.bills];

    const existingFiles = updatedBills[billIndex].attachments || [];
    const combinedFiles = [...existingFiles, ...newFiles];

    updatedBills[billIndex].attachments = combinedFiles;
    setFormData({
      ...formData,
      bills: updatedBills,
    });

    const newPreviewImages = [...previewImages];
    const existingPreviews = newPreviewImages[billIndex] || [];

    let loadedCount = 0;
    const newPreviews = [];

    newFiles.forEach((file, index) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews[index] = {
            file: file,
            url: e.target.result,
            name: file.name,
            isExisting: false,
          };

          loadedCount++;

          if (
            loadedCount ===
            newFiles.filter((f) => f.type.startsWith("image/")).length
          ) {
            const combinedPreviews = [
              ...existingPreviews,
              ...newPreviews.filter(Boolean),
            ];
            newPreviewImages[billIndex] = combinedPreviews;
            setPreviewImages([...newPreviewImages]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        loadedCount++;
      }
    });

    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs[billIndex].value = "";
  };

  const addBill = (insertIndex = null) => {
    const newBill = {
      reimbursementUuid: "",
      billDate: "",
      billNo: "",
      billAmount: 0,
      remarks: "",
      attachments: [],
    };

    if (insertIndex !== null && insertIndex >= 0) {
      // Insert at specific index
      const newBills = [...formData.bills];
      newBills.splice(insertIndex, 0, newBill);
      setFormData({
        ...formData,
        bills: newBills,
      });
      const newPreviews = [...previewImages];
      newPreviews.splice(insertIndex, 0, []);
      setPreviewImages(newPreviews);
    } else {
      // Append to end (default behavior)
      setFormData({
        ...formData,
        bills: [...formData.bills, newBill],
      });
      setPreviewImages([...previewImages, []]);
    }
  };

  const duplicateBill = (index) => {
    if (index >= 0 && index < formData.bills.length) {
      const billToDuplicate = formData.bills[index];
      const previewToDuplicate = previewImages[index] || [];

      // Create a copy of the bill with all its data
      const duplicatedBill = {
        reimbursementUuid: billToDuplicate.reimbursementUuid || "",
        billDate: billToDuplicate.billDate || "",
        billNo: billToDuplicate.billNo || "",
        billAmount: billToDuplicate.billAmount || 0,
        approvedAmount: billToDuplicate.approvedAmount || 0,
        remarks: billToDuplicate.remarks || "",
        attachments: [], // Don't copy attachments, user needs to re-upload
      };

      // Insert the duplicated bill right after the current one
      const insertIndex = index + 1;
      const newBills = [...formData.bills];
      newBills.splice(insertIndex, 0, duplicatedBill);

      setFormData({
        ...formData,
        bills: newBills,
      });

      // Copy preview images (but they won't be functional, user needs to re-upload)
      const newPreviews = [...previewImages];
      newPreviews.splice(insertIndex, 0, []);
      setPreviewImages(newPreviews);
    }
  };

  const removeBill = (index) => {
    if (formData.bills.length > 1) {
      const updatedBills = formData.bills.filter((_, i) => i !== index);
      const updatedPreviews = previewImages.filter((_, i) => i !== index);

      setFormData({
        ...formData,
        bills: updatedBills,
      });
      setPreviewImages(updatedPreviews);
    }
  };

  const removeImage = (billIndex, imageIndex) => {
    const updatedPreviews = [...previewImages];
    const imageToRemove = updatedPreviews[billIndex][imageIndex];

    if (imageToRemove.isExisting) {
      setDeletedFiles((prev) => [...prev, imageToRemove.serverId]);
    } else {
      const existingImagesCount = updatedPreviews[billIndex].filter(
        (p) => p.isExisting
      ).length;
      const updatedBills = [...formData.bills];
      const updatedFiles = [...updatedBills[billIndex].attachments];

      const newFileIndex = imageIndex - existingImagesCount;
      if (newFileIndex >= 0) {
        updatedFiles.splice(newFileIndex, 1);
        updatedBills[billIndex].attachments = updatedFiles;

        setFormData({
          ...formData,
          bills: updatedBills,
        });
      }
    }

    const newPreviews = [...updatedPreviews[billIndex]];
    newPreviews.splice(imageIndex, 1);
    updatedPreviews[billIndex] = newPreviews;
    setPreviewImages(updatedPreviews);
  };

  const handleSumbit = async (status) => {
    const payload = new FormData();
    const access_token = localStorage.getItem("accessToken");

    // Validate and format claimDate to YYYY-MM-DD for API
    let claimDateFormatted = formData.claimDate;
    if (!claimDateFormatted || claimDateFormatted.trim() === "") {
      toast(<CustomToast message="Claim Date is required" status={"error"} />, {
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

    // If date is in DD-MM-YYYY format, convert to YYYY-MM-DD
    if (claimDateFormatted.includes("-")) {
      const parts = claimDateFormatted.split("-");
      if (parts.length === 3) {
        // Check if format is DD-MM-YYYY (first part is > 12)
        if (parseInt(parts[0]) > 12 && parseInt(parts[0]) <= 31) {
          claimDateFormatted = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        // Otherwise assume it's already YYYY-MM-DD
      }
    }

    // Validate the date is valid
    const dateObj = dayjs(claimDateFormatted);
    if (!dateObj.isValid()) {
      toast(
        <CustomToast message="Invalid Claim Date format" status={"error"} />,
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
      return;
    }

    payload.append("claimDate", claimDateFormatted);

    // NO recordUuid for parent-child structure

    formData.bills.forEach((bill, index) => {
      payload.append(
        `bills[${index}][reimbursementUuid]`,
        bill.reimbursementUuid
      );
      payload.append(`bills[${index}][billDate]`, bill.billDate);
      payload.append(`bills[${index}][billNo]`, bill.billNo);
      payload.append(`bills[${index}][billAmount]`, bill.billAmount);
      payload.append(
        `bills[${index}][approvedAmount]`,
        bill.approvedAmount || bill.billAmount
      );
      payload.append(`bills[${index}][remarks]`, bill.remarks);
      payload.append(`bills[${index}][status]`, status);

      if (bill.attachments && bill.attachments.length > 0) {
        bill.attachments.forEach((file) => {
          payload.append(`attachments_${index}`, file);
        });
      }
    });

    if (deletedFiles.length > 0) {
      deletedFiles.forEach((filename, index) => {
        payload.append(`deletedFiles[${index}]`, filename);
      });
    }

    let response;
    if (isUpdate) {
      response = await modifyReimbursementEmployee(
        access_token,
        "reimbursement",
        tempUuid,
        payload
      );
    } else {
      // Pass employeeUuid as query param for admin, null for employee portal
      const employeeUuidForApi = pathname === "/reimbursement" ? formData.employeeUuid : null;
      response = await createReimbursementEmployee(
        access_token,
        payload,
        "reimbursement",
        employeeUuidForApi
      );
    }

    if (response) {
      await getReimbursementEmployee(access_token, "reimbursementList");
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

      setFormData({
        claimDate: dayjs().format("YYYY-MM-DD"),
        employeeUuid: "",
        bills: [
          {
            reimbursementUuid: "",
            billDate: "",
            billNo: "",
            billAmount: 0,
            approvedAmount: 0,
            remarks: "",
            attachments: [],
          },
        ],
      });
      setPreviewImages([[]]);
      setDeletedFiles([]);

      handleCancel();
    }
  };

  // Date Picker Component
  const DatePickerComponent = ({ billIndex, value, onChange }) => {
    const currentMonth = datePickerMonth[billIndex] || dayjs();
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const startDate = startOfMonth.startOf("week");
    const endDate = endOfMonth.endOf("week");
    const days = [];
    let day = startDate;
    while (day.isBefore(endDate) || day.isSame(endDate, "day")) {
      days.push(day);
      day = day.add(1, "day");
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-[15px] shadow-lg z-[100] w-[360px] p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() =>
              setDatePickerMonth((prev) => ({
                ...prev,
                [billIndex]: currentMonth.subtract(1, "month"),
              }))
            }
            className="p-1 hover:bg-gray-100 rounded"
          >
            <CaretLeft size={24} />
          </button>
          <p className="text-lg font-semibold text-gray-900">
            {currentMonth.format("MMMM YYYY")}
          </p>
          <button
            type="button"
            onClick={() =>
              setDatePickerMonth((prev) => ({
                ...prev,
                [billIndex]: currentMonth.add(1, "month"),
              }))
            }
            className="p-1 hover:bg-gray-100 rounded"
          >
            <CaretRight size={24} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-700"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mb-2"></div>
        <div className="grid grid-cols-7 gap-2">
          {weeks.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((date, dateIndex) => {
                const isCurrentMonth = date.month() === currentMonth.month();
                const isSelected = value && dayjs(value).isSame(date, "day");
                const isToday = date.isSame(dayjs(), "day");

                return (
                  <button
                    key={dateIndex}
                    type="button"
                    onClick={() => onChange(date.format("YYYY-MM-DD"))}
                    className={`h-[39px] w-[38px] rounded-full flex items-center justify-center text-sm ${
                      !isCurrentMonth
                        ? "text-gray-300"
                        : isSelected
                        ? "bg-[#1F87FF] text-white"
                        : isToday
                        ? "bg-[#F5FAFF] text-[#1F87FF]"
                        : "text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {date.format("D")}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm flex flex-col flex-1 h-full">
      <div className="flex-1 flex flex-col px-8 py-7 overflow-y-auto min-h-0">
        {/* Employee Details Section */}
        <div className="w-full mb-8">
          <div className="grid grid-cols-2 gap-6">
            {/* handle admin can access employee selection */}
            {pathname == "/reimbursement" ? (
              <ReuseableInput
                label="Employee Name"
                id="employeeName"
                name="employeeName"
                as="react-select"
                selectOptionsReact={dataEmployeesOptions}
                handleSelectChangeReact={handleEmployeeSelect}
                selectedValueReact={getSelectedValue(
                  dataEmployeesOptions,
                  "employeeUuid"
                )}
                isDisabled={false}
                required={false}
                isFocusRing={false}
                isBorderLeft={true}
                borderColor={"#DC2626"}
                placeholder="Select an Employee"
              />
            ) : (
              <ReuseableInput
                label="Employee Name"
                id="employeeName"
                name="employeeName"
                value={getEmployeeName()}
                isDisabled={true}
                required={false}
                isFocusRing={false}
                isBorderLeft={true}
                borderColor={"#6B7280"}
              />
            )}
            <div className="w-fit min-w-[150px]">
              <ReuseableInput
                type="date"
                label="Claim Date"
                id="claimDate"
                name="claimDate"
                value={formData.claimDate}
                onChange={handleClaimDateChange}
                placeholder="YYYY-MM-DD"
                required={false}
                isDisabled={false}
                isFocusRing={false}
                isBorderLeft={true}
                borderColor={"#DC2626"}
              />
            </div>
          </div>
        </div>

        {/* Reimbursement Details Section */}
        <div className="w-full mb-6 relative">
          <div className="overflow-x-auto overflow-y-visible border border-[#D1D5DB] rounded-lg">
            <TableReusable
              tableFor="reimbursementForm"
              dataHeaders={[
                "REIMBURSEMENT TYPE*",
                "BILL DATE",
                "BILL NUMBER",
                "CLAIM AMOUNT*",
                // Hide APPROVED AMOUNT for employees (only show for admin)
                // also hide for admin
                // ...(isEmployee ? [] : ["APPROVED AMOUNT*"]),
                "ATTACHMENTS",
              ]}
              dataTable={formData.bills}
              handleEdit={{
                handleBillChange,
                handleFileChange,
                removeBill,
                addBill,
                duplicateBill,
                toggleDatePicker,
                selectDate,
                formatReimbursementName,
                dataReimbursementEmployee,
                datePickerRefs,
                showDatePicker,
                datePickerMonth,
                setDatePickerMonth,
                dayjs,
                Calendar,
                CaretLeft,
                CaretRight,
                DatePickerComponent,
                Link,
                Trash,
                Plus,
                PlusSquare,
                previewImages,
                removeImage,
                // Flag to hide approved amount column for employees
                hideApprovedAmount: isEmployee,
              }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons - akan selalu di bawah */}
      <div className="w-full flex items-center justify-start gap-3 px-8 py-6 border-t border-[#E5E7EB] bg-white">
        <button
          type="button"
          onClick={() => handleSumbit("submitted")}
          disabled={loading}
          className="px-[14px] py-[8px] bg-[#1F87FF] text-[#F5FAFF] text-sm font-semibold rounded-lg hover:bg-[#0066DD] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          Save & Approve
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="px-[14px] py-[8px] border border-[#111827] text-[#111827] text-sm font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default FormReimbursementEmployeePortal;
