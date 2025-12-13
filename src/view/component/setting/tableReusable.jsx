import {
  CaretDown,
  CaretLeftIcon,
  CaretRightIcon,
  CheckCircle,
  CheckFat,
  DoorOpen,
  DotsThree,
  DotsThreeOutlineVertical,
  Download,
  Eye,
  Lock,
  MagnifyingGlass,
  NotePencil,
  Pencil,
  PenIcon,
  Prohibit,
  Trash,
  TrashIcon,
  Triangle,
  WarningCircleIcon,
  X,
} from "@phosphor-icons/react";
import React, { useEffect, useRef, useState } from "react";
const baseUrl = import.meta.env.VITE_BASEURL;
const token = localStorage.getItem("zoho_access_token");
import dayjs from "dayjs";
import { statusShowGlobal } from "../../../../data/dummy";
import ReuseableInput from "../reuseableInput";
import { useLocation } from "react-router-dom";
import ReimbursementTypeDropdown from "../employeePortal/ReimbursementTypeDropdown";


function TableReusable({
  dataHeaders = [],
  objectHeaders = {},
  dataTable = [],
  objectTable = {},
  tableFor,
  handleEdit,
  handleDelete,
  handleChangeActiveStatus,
  handleView,
  resened,
  loading,
  role,
  dataReimbursementEmployee,
  formatReimbursementName,
  formatFunction = () => {},
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);
  const { pathname } = useLocation();
  const [approveAmount, setApproveAmount] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  
  /* for movable table */
  const [scrollLeft, setScrollLeft] = useState(0);
  const rightTableRef = useRef(null);
  const [buttonPosition, setButtonPosition] = useState({ top: '50%' });


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e, uuid) => {
    const { name, value } = e.target;
    setApproveAmount((prev) => ({
      ...prev,
      [uuid]: {
        ...prev[uuid],
        [name]: value,
      },
    }));
  };

  // Normalize headers for reimbursementEmployeePortal (remove last header which is action column)
  const normalizedHeaders =
    tableFor === "reimbursementEmployeePortal"
      ? dataHeaders?.slice(0, -1)
      : dataHeaders;

  /* for movable table */
  const scrollLeftAction = () => {
    if (rightTableRef.current) {
      const scrollAmount = rightTableRef.current.clientWidth * 0.12;
      rightTableRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRightAction = () => {
    if (rightTableRef.current) {
      const scrollAmount = rightTableRef.current.clientWidth * 0.12;
      rightTableRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (rightTableRef.current) {
      setScrollLeft(rightTableRef.current.scrollLeft);
    }
  };

  const handleRowMouseEnter = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = rightTableRef.current.getBoundingClientRect();
    const relativeTop = rect.top - containerRect.top + rect.height / 2;
    setButtonPosition({ top: `${relativeTop}px` });
  };

  /* Sori pak sulit saya benerinnya takut nyenggol page lain, jd saya paksa gini */
  if (tableFor === "annualEarningsEmployeePortal") {
    return (
      /* Target Table */
      <div
        className="max-h-full h-full w-full flex-grow"
      >
        <div className="flex min-h-full">
          {/* Left Table - Fixed */}
          <div
            className="border-r border-gray-300 flex-shrink-0 w-[600px]"
          >
            <table className="border-collapse w-full">

              {/* Earnings and YTD Headers */}
              <thead className="bg-gray-100">
                <tr className="border-b border-gray-200">
                  <th className="px-6 text-left text-lg font-semibold text-gray-900 w-80" style={{ height: '72px' }}>
                    Earnings
                  </th>
                  <th className="px-6 text-right text-lg font-semibold text-gray-900 w-40" style={{ height: '72px' }}>
                    YTD Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-100">

                {/* Earnings Rows */}
                {objectTable?.earningsData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors" style={{ height: '52px' }}>
                    <td className="px-6 text-md text-gray-700 align-middle">{row.component}</td>
                    <td className="px-6 text-md text-gray-900 text-right font-medium align-middle">
                      {formatFunction(row.ytdTotal)}
                    </td>
                  </tr>
                ))}

                {/* Total Earnings */}
                <tr className="border-b-2 border-gray-300" style={{ height: '52px' }}>
                  <td className="px-6 text-md font-semibold text-gray-900 align-middle">Total Earnings</td>
                  <td className="px-6 text-md font-bold text-gray-900 text-right align-middle">
                    {formatFunction(objectTable?.totalsData.totalEarnings.ytdTotal)}
                  </td>
                </tr>

                {/* Contributions Title */}
                <tr style={{ height: '52px' }}>
                  <td className="px-6 text-lg font-medium text-gray-700 align-middle">Contributions</td>
                  <td className="px-6 align-middle"></td>
                </tr>

                {/* Contributions Rows */}
                {objectTable?.contributionsData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors" style={{ height: '52px' }}>
                    <td className="px-6 text-md text-gray-700 align-middle">{row.component}</td>
                    <td className="px-6 text-md text-gray-900 text-right font-medium align-middle">
                      {formatFunction(row.ytdTotal)}
                    </td>
                  </tr>
                ))}

                {/* Total Statutories */}
                <tr className="border-b-2 border-gray-300" style={{ height: '52px' }}>
                  <td className="px-6 text-md font-semibold text-gray-900 align-middle">Total Statutories</td>
                  <td className="px-6 text-md font-bold text-gray-900 text-right align-middle">
                    {formatFunction(objectTable?.totalsData.totalStatutories.ytdTotal)}
                  </td>
                </tr>

                {/* Deductions Title */}
                <tr style={{ height: '52px' }}>
                  <td className="px-6 text-lg font-medium text-gray-700 align-middle">Deductions</td>
                  <td className="px-6 align-middle"></td>
                </tr>

                {/* Deductions Rows */}
                {objectTable?.deductionsData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors" style={{ height: '52px' }}>
                    <td className="px-6 text-md text-gray-700 align-middle">{row.component}</td>
                    <td className="px-6 text-md text-gray-900 text-right font-medium align-middle">
                      {formatFunction(row.ytdTotal)}
                    </td>
                  </tr>
                ))}

                {/* Total Deductions */}
                <tr className="border-b-2 border-gray-300" style={{ height: '52px' }}>
                  <td className="px-6 text-md font-semibold text-gray-900 align-middle">Total Deductions</td>
                  <td className="px-6 text-md font-bold text-gray-900 text-right align-middle">
                    {formatFunction(objectTable?.totalsData.totalDeductions.ytdTotal)}
                  </td>
                </tr>

                {/* Take Home */}
                <tr className="border-b-2 border-gray-300" style={{ height: '52px' }}>
                  <td className="px-6 text-lg font-medium text-gray-700 align-middle">Take Home</td>
                  <td className="px-6 text-md text-gray-900 text-right font-medium align-middle">
                    {formatFunction(objectTable?.totalsData.takeHome.ytdTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Right Table - Scrollable Horizontally */}
          <div
            ref={rightTableRef}
            onScroll={handleScroll}
            className="flex-1 overflow-x-auto relative"
          >

            {/* Left Scroll Button */}
            <button
              onClick={scrollLeftAction}
              className="absolute z-20 bg-white hover:bg-[#f7faff] shadow-lg rounded-lg p-2 transition-all hover:scale-110"
              aria-label="Scroll left"
              style={{
                left: `${scrollLeft + 8}px`,
                top: buttonPosition.top,
                transform: 'translateY(-50%)',
                pointerEvents: 'auto',
                transition: 'top 0.2s ease-out'
              }}
            >
              <CaretLeftIcon size={20} weight="bold" className="text-blue-600" />
            </button>

            {/* Right Scroll Button */}
            <button
              onClick={scrollRightAction}
              className="absolute z-20 bg-white hover:bg-[#f7faff] shadow-lg rounded-lg p-2 transition-all hover:scale-110"
              aria-label="Scroll right"
              style={{
                right: `${-scrollLeft + 8}px`,
                top: buttonPosition.top,
                transform: 'translateY(-50%)',
                pointerEvents: 'auto',
                transition: 'top 0.2s ease-out'
              }}
            >
              <CaretRightIcon size={20} weight="bold" className="text-blue-600" />
            </button>

            
            <table className="border-collapse min-w-full">
              {/* Month Headers */}
              <thead className="bg-[#f7faff]">
                <tr className="border-b border-gray-200">
                  {dataHeaders.map((header, index) => (
                    <th key={header.key} 
                      className="
                        border-r border-gray-200 
                        px-6 
                        text-right text-lg font-semibold text-gray-900 
                        min-w-[200px]" 
                      style={{ height: '72px' }}
                    >
                      <div className="flex flex-row gap-2 items-center justify-end h-full">
                        <span>{header.label.split(" ")[0]}</span>
                        <span>{header.label.split(" ")[1]}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white">
                {/* Earnings Rows */}
                {objectTable?.earningsData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors" style={{ height: '52px' }}
                    onMouseEnter={handleRowMouseEnter}
                  >
                    {dataHeaders.map(header => (
                      <td key={header.key} className="border-r border-gray-200 px-6 text-md text-gray-900 text-right align-middle">
                        {row[header.key] !== undefined ? formatFunction(row[header.key]) : "-"}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Total Earnings */}
                <tr className="border-b-2 border-gray-300 bg-gray-50" style={{ height: '52px' }}>
                  {dataHeaders.map(header => (
                    <td key={header.key} className="border-r border-gray-200 px-6 text-md font-semibold text-gray-900 text-right align-middle">
                      {objectTable?.totalsData.totalEarnings[header.key] !== undefined ? formatFunction(objectTable?.totalsData.totalEarnings[header.key]) : "-"}
                    </td>
                  ))}
                </tr>

                {/* Contributions Title */}
                <tr style={{ height: '52px' }}>
                  {dataHeaders.map(header => (
                    <td key={header.key} className="border-r border-gray-200 px-6 align-middle"></td>
                  ))}
                </tr>

                {/* Contributions Rows */}
                {objectTable?.contributionsData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors" style={{ height: '52px' }}
                    onMouseEnter={handleRowMouseEnter}
                  >
                    {dataHeaders.map(header => (
                      <td key={header.key} className="border-r border-gray-200 px-6 text-md text-gray-900 text-right align-middle">
                        {row[header.key] !== undefined ? formatFunction(row[header.key]) : "-"}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Total Statutories */}
                <tr className="border-b-2 border-gray-300 bg-gray-50" style={{ height: '52px' }}>
                  {dataHeaders.map(header => (
                    <td key={header.key} className="border-r border-gray-200 px-6 text-md font-semibold text-gray-900 text-right align-middle">
                      {objectTable?.totalsData.totalStatutories[header.key] !== undefined ? formatFunction(objectTable?.totalsData.totalStatutories[header.key]) : "-"}
                    </td>
                  ))}
                </tr>

                {/* Deductions Title */}
                <tr style={{ height: '52px' }}>
                  {dataHeaders.map(header => (
                    <td key={header.key} className="border-r border-gray-200 px-6 align-middle"></td>
                  ))}
                </tr>

                {/* Deductions Rows */}
                {objectTable?.deductionsData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors" style={{ height: '52px' }}
                    onMouseEnter={handleRowMouseEnter}
                  >
                    {dataHeaders.map(header => (
                      <td key={header.key} className="border-r border-gray-200 px-6 text-md text-gray-900 text-right align-middle">
                        {row[header.key] !== undefined ? formatFunction(row[header.key]) : "-"}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Total Deductions */}
                <tr className="border-b-2 border-gray-300 bg-gray-50" style={{ height: '52px' }}>
                  {dataHeaders.map(header => (
                    <td key={header.key} className="border-r border-gray-200 px-6 text-md font-semibold text-gray-900 text-right align-middle">
                      {objectTable?.totalsData.totalDeductions[header.key] !== undefined ? formatFunction(objectTable?.totalsData.totalDeductions[header.key]) : "-"}
                    </td>
                  ))}
                </tr>

                {/* Take Home */}
                <tr className="border-b-2 border-gray-300" style={{ height: '52px' }}>
                  {dataHeaders.map(header => (
                    <td key={header.key} className="border-r border-gray-200 px-6 text-md text-gray-900 text-right align-middle">
                      {objectTable?.totalsData.takeHome[header.key] !== undefined ? formatFunction(objectTable?.totalsData.takeHome[header.key]) : "-"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
  else if (tableFor === "loanEmployeePortal") {
    return (
      /* Loan Employee Portal */
      <table className="w-full">
        {/* Headers */}
        <thead>
          <tr>
            {dataHeaders?.map((el, idx) => (
              <th
                key={idx}
                scope="col"
                className={`px-6 py-5 bg-blue-td-50 text-base font-medium text-blue-td-600 uppercase tracking-wider border-b-[1px] ${idx >= 3 ? 'text-right' : 'text-left' /* numbers right aligned */
                  }`}
              >
                {el}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {dataTable?.map((el, idx) => (
            <tr
              onClick={() => handleView(el?.uuid, el, "loan")}
              key={idx}
              className="bg-white hover:bg-gray-50 cursor-pointer"
            >
              {/* Loan Number */}
              <td className="px-6 py-4 whitespace-nowrap text-left text-base text-blue-50 border-b-[1px]">
                {el?.loanId}
              </td>

              {/* Loan Name */}
              <td className="px-6 py-4 whitespace-nowrap text-left text-base text-black border-b-[1px] capitalize">
                {el?.loanType}
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap text-left text-base text-black border-b-[1px]">
                <div className="flex flex-col items-start justify-start space-y-2">
                  <div
                    className={`py-0.5 px-3 capitalize rounded-full ${el?.totalAmount - el?.amountRepaid !== 0
                        ? "bg-blue-td-50 text-blue-td-50"
                        : "bg-gray-200 text-gray-50"
                      }`}
                  >
                    {el?.totalAmount - el?.amountRepaid === 0 ? "Close" : "Open"}
                  </div>
                </div>
              </td>

              {/* Loan Amount */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-base text-black border-b-[1px]">
                {formatFunction(el?.totalAmount)}
              </td>

              {/* Amount Repaid */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-base text-black border-b-[1px]">
                {formatFunction(el?.amountRepaid)}
              </td>

              {/* Remaining Amount */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-base text-black border-b-[1px]">
                {formatFunction(el?.remainingAmount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  else if (tableFor === "employeePortalRegulation") {
    return (
      <div className="h-full w-full overflow-hidden rounded-lg">
        <div className="h-full overflow-auto">
          <table className="w-full table-fixed">
            <thead className="sticky top-0 bg-blue-50 z-10">
              <tr>
                {dataHeaders?.map(
                  (el, idx) => (
                    // idx !== dataHeaders?.length - 1 && (
                    <th
                      key={idx}
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-blue-500 uppercase tracking-wide"
                    >
                      {el}
                    </th>
                  )
                  // )
                )}
              </tr>
            </thead>
            <tbody className="bg-white">
              {dataTable?.map((el, idx) => (
                <tr key={idx} className="hover:bg-gray-50 cursor-pointer">
                  {/* Employee Name */}
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                    <div className="flex flex-col items-start justify-start space-y-2">
                      <p className="text-blue-500 text-sm font-normal">
                        {el?.employeeName}
                      </p>
                    </div>
                  </td>

                  {/* From */}
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                    <div className="flex flex-col items-start justify-start space-y-2">
                      <p className="text-black text-sm font-normal">
                        {dayjs(el?.dateFrom).format("DD/MM/YYYY")}
                      </p>
                    </div>
                  </td>

                  {/* To */}
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                    <div className="flex flex-col items-start justify-start space-y-2">
                      <p className="text-black text-sm font-normal">
                        {dayjs(el?.dateTo).format("DD/MM/YYYY")}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                    <div className="flex flex-col items-start justify-start space-y-2">
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${(el?.status).toLowerCase() === "approved" ? "bg-green-100 text-green-700" :
                          (el?.status).toLowerCase() === "pending" ? "bg-[#FFF3E0] text-[#DB6E00]"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {el?.status}
                      </span>
                    </div>
                  </td>

                  {!pathname?.includes("employee-portal") ? (

                    /* Action */
                    <td
                      className={`text-black flex items-center justify-center ${(el?.status !== "pending" || el?.status !== "draft") &&
                        "border-b-[1px]"
                        } py-2.5 space-x-2`}
                    >
                      <>
                        {el?.status === "pending" || el?.status === "draft" ? (
                          <>
                            <button
                              onClick={() => handleEdit(el.uuid, "approved")}
                              className="h-8 w-8 rounded-full border-[1px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <CheckFat size={16} className="text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleEdit(el.uuid, "rejected")}
                              className="h-8 w-8 rounded-full border-[1px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <X size={16} className="text-gray-600" />
                            </button>
                          </>
                        ) : (
                          <div className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500">
                            <button
                              onClick={() => handleEdit(el.uuid, "edit")}
                              className="h-8 w-8 rounded-full border-[1px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <PenIcon size={16} className="text-gray-600" />
                            </button>
                          </div>
                        )}
                      </>
                    </td>
                  ) : (
                    <td className="px-6 py-4 whitespace-nowrap text-left border-b-[1px]">
                      {(el?.status === "pending" || el?.status === "draft") && (
                        <button
                          onClick={() => handleEdit(el.uuid, "canceled")}
                          className="rounded-full border-[1px] px-3 py-1 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`w-full max-h-full overflow-x-auto ${
        tableFor === "reimbursementForm" ? 
          "overflow-y-visible" :
        tableFor === "employeeSummary" ? 
          "overflow-y-auto h-[85%]" :
          tableFor !== "epfContributionEmployeePortal" &&
          tableFor !== "loanEmployeePortal" ?
          " h-[85%]" :
          " flex-grow" 
      }`}
    >
      {tableFor === "Departments" ? (
        <table className="w-full table-auto">
          <thead>
            <tr>
              {dataHeaders?.map((el, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-6 py-5 bg-blue-td-50 text-left text-base font-medium text-blue-td-600 uppercase tracking-wider border-b-[1px]"
                >
                  {el}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataTable?.map((el, idx) => (
              <tr key={el?.uuid} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-left text-base text-blue-td-500 border-b-[1px]">
                  {el?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-base text-black border-b-[1px]">
                  {el?.departmentCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-base text-black border-b-[1px]">
                  {el?.totalEmployee}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-base text-black border-b-[1px]">
                  {/* {el?.description} */}
                  <div
                    key={idx}
                    className="h-8 w-8 text-lg flex items-center justify-center rounded-md text-gray-td-600 duration-300 ease-in-out transition-all relative"
                    onMouseEnter={() => setOpenMenu(idx)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <Eye weight="fill" />
                    {openMenu === idx && (
                      <div className="absolute w-[300px] h-fit -top-4 right-[200%] bg-black text-white font-light p-2 rounded-md shadow-lg space-y-2">
                        <h1 className="text-sm font-medium">Description</h1>
                        <p className="text-xs w-full whitespace-normal">
                          Designs, develops, and maintains software applications
                          to solve business problems and improve user
                          experiences.
                        </p>
                        <div className="absolute w-3 h-3 rotate-45 bg-black top-5 -translate-y-1/2 -right-1"></div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-black border-b-[1px] flex items-center space-x-2">
                  <button
                    className="h-8 w-8 text-lg flex items-center justify-center rounded-md bg-gray-td-100 text-gray-td-600 duration-300 ease-in-out transition-all hover:bg-blue-100 hover:text-blue-td-600"
                    onClick={() => {
                      handleEdit(el?.uuid);
                      setOpenMenu(null);
                    }}
                  >
                    <NotePencil weight="fill" />
                  </button>
                  <button
                    className="h-8 w-8 text-lg flex items-center justify-center rounded-md bg-gray-td-100 text-gray-td-600 duration-300 ease-in-out transition-all hover:bg-red-100 hover:text-red-td-600"
                    onClick={() => {
                      handleDelete(el?.uuid);
                      setOpenMenu(null);
                    }}
                  >
                    <Trash weight="fill" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : tableFor === "Designations" ? (
        <table className="w-full table-auto">
          <thead>
            <tr>
              {dataHeaders?.map((el, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-6 py-5 bg-blue-td-50 text-left text-base font-medium text-blue-td-600 uppercase tracking-wider border-b-[1px]"
                >
                  {el}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataTable?.map((el, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-left text-base text-blue-td-500 border-b-[1px]">
                  {el?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-base text-black border-b-[1px]">
                  {el?.totalEmployee}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-base text-black border-b-[1px] flex items-center space-x-2">
                  <button
                    className="h-8 w-8 text-lg flex items-center justify-center rounded-md bg-gray-td-100 text-gray-td-600 duration-300 ease-in-out transition-all hover:bg-blue-100 hover:text-blue-td-600"
                    onClick={() => {
                      handleEdit(el?.uuid);
                      setOpenMenu(null);
                    }}
                  >
                    <NotePencil weight="fill" />
                  </button>
                  <button
                    className="h-8 w-8 text-lg flex items-center justify-center rounded-md bg-gray-td-100 text-gray-td-600 duration-300 ease-in-out transition-all hover:bg-red-100 hover:text-red-td-600"
                    onClick={() => {
                      handleDelete(el?.uuid);
                      setOpenMenu(null);
                    }}
                  >
                    <Trash weight="fill" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : tableFor === "UserSettings" ? (
        <table className="w-full table-auto">
          <thead>
            <tr>
              {dataHeaders?.map((el, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-b-[1px]"
                >
                  <div className="flex items-center justify-start space-x-3">
                    <p>{el}</p>
                    {el && <Triangle weight="fill" className="text-[10px]" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataTable?.map((el, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px] flex items-center justify-start space-x-4">
                  <div className="w-14 h-14 bg-blue-td-100 rounded-full flex items-center justify-center overflow-hidden">
                    <h1 className="text-[40px] -mt-[10%]">{el?.email?.[0]}</h1>
                  </div>
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <h1 className="text-blue-500 text-lg font-normal">
                      {el?.name}
                    </h1>
                    <p className="text-black text-sm font-normal">
                      {el?.email}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-black border-b-[1px] capitalize">
                  {el?.Role?.name}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-left text-sm ${
                    el?.status == "active" ? "text-green-500" : "text-gray-400"
                  } border-b-[1px] uppercase`}
                >
                  {el?.status}
                </td>
                {/* Actions */}
                <td className="text-black flex items-center justify-end pe-10 py-[10%] border-b-[1px]">
                  <div
                    className="relative"
                    ref={openMenu === el?.uuid ? menuRef : null}
                  >
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === el?.uuid ? null : el?.uuid)
                      }
                      className="h-8 w-8 rounded-full border-[1px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <Pencil size={16} className="text-gray-600" />
                    </button>

                    {openMenu === el?.uuid && (
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button
                          onClick={() => handleDelete(el?.uuid)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            handleEdit(el?.uuid);
                            setOpenMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleEdit(el?.uuid, true);
                            setOpenMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          {el?.status == "active" ? "Inactive" : "Active"}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : tableFor === "RoleSettings" ? (
        <table className="w-full table-auto">
          <thead>
            <tr>
              {dataHeaders?.map((el, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-b-[1px]"
                >
                  <div className="flex items-center justify-start space-x-3">
                    <p>{el}</p>
                    {el && <Triangle weight="fill" className="text-[10px]" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataTable?.map((el, idx) => (
              <tr key={el?.uuid} className="hover:bg-gray-50">
                {/* Role Name */}
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-black border-b-[1px] capitalize">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">{el?.name}</span>
                  </div>
                </td>
                {/* Description */}
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-black border-b-[1px]">
                  <div className="flex items-center gap-2">
                    <p>{el?.description}</p>
                  </div>
                </td>
                {/* Actions */}
                <td className="text-black flex items-center justify-end pe-10 py-[5%] border-b-[1px]">
                  <div
                    className="relative"
                    ref={openMenu === el?.uuid ? menuRef : null}
                  >
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === el?.uuid ? null : el?.uuid)
                      }
                      className="h-8 w-8 rounded-full border-[1px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <Pencil size={16} className="text-gray-600" />
                    </button>

                    {openMenu === el?.uuid && (
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button
                          onClick={() => handleDelete(el?.uuid)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            handleEdit(el?.uuid);
                            setOpenMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleEdit(el?.uuid, true);
                            setOpenMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          {el?.status == "active" ? "Inactive" : "Activate"}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : tableFor === "EmailTemplates" ? (
        <table className="w-full table-auto">
          <thead>
            <tr>
              {dataHeaders?.map((el, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-b-[1px]"
                >
                  {el}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataTable?.map((el, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <h1 className="text-blue-500 text-lg font-normal">
                      {el?.type?.title}
                    </h1>
                    <p className="text-black text-sm font-normal">
                      {el?.type?.des}
                    </p>
                  </div>
                </td>
                <td className="text-black border-b-[1px]">
                  <button className="h-8 w-8 rounded-full border-[1px] flex items-center justify-center bg-gray-50">
                    <Pencil className="text-sm" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : tableFor === "holiday" ? (
        <table className="w-full table-auto">
          <thead>
            <tr>
              {dataHeaders?.map((el, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-b-[1px]"
                >
                  {el}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataTable?.map((el, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">
                      {el?.holidayName}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">
                      {dayjs(el?.startDate).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">
                      {el?.description}
                    </p>
                  </div>
                </td>
                <td className="text-black border-b-[1px]">
                  <div
                    className="relative"
                    ref={openMenu === el?.uuid ? menuRef : null}
                  >
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === el?.uuid ? null : el?.uuid)
                      }
                      className="h-8 w-8 rounded-full border-[1px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <Pencil size={16} className="text-gray-600" />
                    </button>

                    {openMenu === el?.uuid && (
                      <div className="absolute right-32 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button
                          onClick={() => handleDelete(el?.uuid)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            handleEdit(el?.uuid);
                            setOpenMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : tableFor === "Earnings" ? (
        <table className="w-full table-auto">
          <thead>
            <tr>
              {dataHeaders?.map((el, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`px-6 py-4 bg-blue-td-50 text-blue-td-500 ${
                    el == "Consider for SPK" ? "text-center" : "text-left"
                  } text-lg font-medium uppercase tracking-wider border-b-[1px]`}
                >
                  {el}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataTable?.map((el, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-lg font-normal">{el?.earningName}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-lg text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black sm font-normal">
                      {el?.earningName}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-lg text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black font-normal">
                      {el?.payType && `${el?.payType};`} {el?.calculationType}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-lg text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    {el?.considerSpk ? (
                      <CheckCircle size={20} className={`text-green-td-500`} />
                    ) : (
                      <Prohibit size={20} className={`text-gray-td-500`} />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-lg text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <div
                      className={`flex items-center justify-center px-4 py-1 ${
                        el?.isActive ? "bg-green-td-50" : "bg-gray-td-50"
                      } rounded-full`}
                    >
                      <p
                        className={`${
                          el?.isActive
                            ? "text-green-td-600"
                            : "text-gray-td-600"
                        } text-sm font-normal`}
                      >
                        {el?.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="text-black border-b-[1px]">
                  <div
                    className="relative"
                    ref={openMenu === el?.uuid ? menuRef : null}
                  >
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === el?.uuid ? null : el?.uuid)
                      }
                      className="h-6 w-6 rounded-full border-[2px] flex items-center justify-center border-gray-td-500"
                    >
                      <DotsThreeOutlineVertical
                        size={16}
                        className="text-gray-td-500"
                      />
                    </button>

                    {openMenu === el?.uuid && (
                      <div className="absolute right-16 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 font-medium overflow-hidden">
                        <button
                          onClick={() =>
                            handleDelete(
                              el?.uuid,
                              "Earnings",
                              "earning",
                              "delete"
                            )
                          }
                          disabled={el?.isUsed}
                          className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                            el?.isUsed
                              ? "text-gray-400 cursor-not-allowed bg-gray-50"
                              : "text-gray-td-700 hover:bg-blue-50 hover:border-l-4 hover:border-blue-td-500"
                          }`}
                          title={el?.isUsed ? "Cannot delete: This component is already assigned to one or more employees" : ""}
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            handleEdit(el?.uuid, "Earnings", "earning");
                            setOpenMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-gray-td-700 hover:bg-blue-50 hover:border-l-4 hover:border-blue-td-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (!el?.isUsed) {
                              handleChangeActiveStatus(
                                el?.uuid,
                                "Earnings",
                                "earning"
                              );
                              setOpenMenu(null);
                            }
                          }}
                          disabled={el?.isUsed}
                          className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                            el?.isUsed
                              ? "text-gray-400 cursor-not-allowed bg-gray-50"
                              : "text-gray-td-700 hover:bg-blue-50 hover:border-l-4 hover:border-blue-td-500"
                          }`}
                          title={el?.isUsed ? "Cannot change status: This component is already assigned to one or more employees" : ""}
                        >
                          Mark as {el?.isActive ? "Inactive" : "Active"}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : 
      /* Reimbursements Claims Table */
     tableFor === "Reimbursements" ? (
  <div className="w-full h-full">
    {/* SAME OUTER STRUCTURE AS LOANS */}
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto bg-white">
        <thead
          className="sticky top-0 z-10"
          style={{ background: "#1C1C1C", height: "78px" }}
        >
          <tr>
            {dataHeaders?.map((el, idx) => (
              <th
                key={idx}
                scope="col"
                className="px-6 text-left text-[14px] font-medium uppercase"
                style={{
                  color: "#ADADAD",
                  lineHeight: "20px",
                  fontFamily: "Inter",
                }}
              >
                {el}
              </th>
            ))}
            <th className="w-16 px-6"></th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {dataTable?.map((el, idx) => (
            <tr
              key={idx}
              className="border-b border-dashed hover:bg-gray-50"
              style={{
                height: "86px",
                borderColor: "rgba(28, 28, 28, 0.1)",
              }}
            >
              {/* Claim Number */}
              <td className="px-6 text-left">
                <p className="text-[16px] text-[#1C1C1C]" style={{ fontFamily: "Inter" }}>
                  {el?.claimNumber}
                </p>
              </td>

              {/* Employee Name */}
              <td className="px-6 text-left">
                <p
                  className="text-[16px] text-[rgba(28,28,28,0.5)]"
                  style={{ fontFamily: "Inter" }}
                >
                  {el?.employeeName}
                </p>
              </td>

              {/* Submitted Date */}
              <td className="px-6 text-left">
                <p className="text-[16px] text-[#1C1C1C]" style={{ fontFamily: "Inter" }}>
                  {el?.submittedDate}
                </p>
              </td>

              {/* Claim Amount */}
              <td className="px-6 text-left">
                <p className="text-[16px] text-[#1C1C1C]" style={{ fontFamily: "Inter" }}>
                  ${el?.claimAmount}
                </p>
              </td>

              {/* Approved Amount */}
              <td className="px-6 text-left">
                <p className="text-[16px] text-[#1C1C1C]" style={{ fontFamily: "Inter" }}>
                  ${el?.approvedAmount}
                </p>
              </td>

              {/* Status */}
              <td className="px-6 text-left">
                <div className="flex items-center gap-2">
                  {el?.status?.toLowerCase() === "pending" ? (
                    <>
                      <button
                        onClick={() => handleApprove(el?.uuid)}
                        className="h-[30px] px-4 bg-[#D5FAF2] text-[#014F45] text-[14px] rounded-[25px]"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(el?.uuid)}
                        className="h-[30px] px-4 bg-[#FEE2E2] text-[#991B1B] text-[14px] rounded-[25px]"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`h-[30px] px-6 flex items-center justify-center rounded-[25px] text-[14px] ${
                        el?.status?.toLowerCase() === "approved"
                          ? "bg-[#D5FAF2] text-[#014F45]"
                          : "bg-[#FEE2E2] text-[#991B1B]"
                      }`}
                    >
                      {el?.status}
                    </span>
                  )}
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 text-center">
                <div
                  className="relative inline-block"
                  ref={openMenu === el?.uuid ? menuRef : null}
                >
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === el?.uuid ? null : el?.uuid)
                    }
                    className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                  >
                    <DotsThreeOutlineVertical size={16} />
                  </button>

                  {openMenu === el?.uuid && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border z-50">
                      <button
                        onClick={() => {
                          handleEdit(el?.uuid, "Reimbursements", "reimbursement");
                          setOpenMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(
                            el?.uuid,
                            "Reimbursements",
                            "reimbursement",
                            "delete"
                          );
                          setOpenMenu(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
) : 
tableFor === "loans" ? (
  <div className="w-full h-full">
    <table className="w-full table-auto">
      <thead className="sticky top-0 z-10" style={{ background: '#1C1C1C', height: '78px' }}>
        <tr>
          {dataHeaders?.map((el, idx) => (
            <th
              key={idx}
              scope="col"
              className={`px-6 text-xs font-medium uppercase tracking-wider ${
                idx === 3 ? 'text-center' : idx >= 4 ? 'text-right' : 'text-left'
              }`}
              style={{
                color: '#ADADAD',
                fontSize: '14px',
                lineHeight: '20px',
                fontFamily: 'Inter'
              }}
            >
              {el}
            </th>
          ))}
          <th className="w-16 px-6"></th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {dataTable?.map((el, idx) => (
          <tr
            key={idx}
            className="hover:bg-gray-50 cursor-pointer transition-colors border-b border-dashed"
            style={{ 
              height: '80px',
              borderColor: 'rgba(28, 28, 28, 0.1)'
            }}
            onClick={() => handleView?.(el?.uuid, "Loans", "loan")}
          >
            {/* Employee Name */}
            <td className="px-6 whitespace-nowrap text-left" style={{ fontFamily: 'Inter' }}>
              <div className="font-normal text-base" style={{ color: '#1C1C1C' }}>
                {el?.Employee?.firstName} {el?.Employee?.middleName} {el?.Employee?.lastName}
              </div>
              <div className="text-sm" style={{ color: 'rgba(28, 28, 28, 0.6)' }}>
                ({el?.Employee?.employeeId || el?.employeeId})
              </div>
            </td>

            {/* Loan Number */}
            <td className="px-6 whitespace-nowrap text-left text-base" style={{ color: '#1C1C1C', fontFamily: 'Inter' }}>
              {el?.loanNumber}
            </td>

            {/* Loan Name */}
            <td className="px-6 whitespace-nowrap text-left text-base capitalize" style={{ color: 'rgba(28, 28, 28, 0.6)', fontFamily: 'Inter' }}>
              {el?.LoanName?.name || el?.loanType}
            </td>

            {/* Status */}
            <td className="px-6 whitespace-nowrap text-center">
              <span
                className="inline-flex items-center justify-center rounded-full"
                style={{
                  width: '90px',
                  height: '30px',
                  background: el?.loanAmount - el?.amountRepaid === 0 ? 'rgba(28, 28, 28, 0.1)' : '#F5FAFF',
                  color: el?.loanAmount - el?.amountRepaid === 0 ? 'rgba(28, 28, 28, 0.6)' : '#0066FE',
                  fontFamily: 'Inter',
                  fontSize: '16px'
                }}
              >
                {el?.loanAmount - el?.amountRepaid === 0 ? "Close" : "Open"}
              </span>
            </td>

            {/* Loan Amount */}
            <td className="px-6 whitespace-nowrap text-right text-base" style={{ color: 'rgba(28, 28, 28, 0.6)', fontFamily: 'Inter' }}>
              ${el?.loanAmount?.toLocaleString("en-US") || el?.totalAmount?.toLocaleString("en-US")}
            </td>

            {/* Amount Repaid */}
            <td className="px-6 whitespace-nowrap text-right text-base" style={{ color: '#1C1C1C', fontFamily: 'Inter' }}>
              ${el?.amountRepaid?.toLocaleString("en-US")}.0
            </td>

            {/* Remaining Amount */}
            <td className="px-6 whitespace-nowrap text-right text-base" style={{ color: '#0066FE', fontFamily: 'Inter' }}>
              ${Math.abs(el?.loanAmount - el?.amountRepaid)?.toLocaleString("en-US") || 
                el?.remainingAmount?.toLocaleString("en-US")}
            </td>

            {/* Actions Menu */}
            <td className="px-6 whitespace-nowrap text-center">
              <div className="relative inline-block" ref={openMenu === el?.uuid ? menuRef : null}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(openMenu === el?.uuid ? null : el?.uuid);
                  }}
                  className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="4" r="1.8" fill="rgba(28, 28, 28, 0.6)"/>
                    <circle cx="10" cy="10" r="1.8" fill="rgba(28, 28, 28, 0.6)"/>
                    <circle cx="10" cy="16" r="1.8" fill="rgba(28, 28, 28, 0.6)"/>
                  </svg>
                </button>

                {openMenu === el?.uuid && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-50" style={{ borderColor: 'rgba(162, 161, 168, 0.2)' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView?.(el?.uuid, "Loans", "loan");
                        setOpenMenu(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      style={{ color: '#1C1C1C' }}
                    >
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit?.(el?.uuid);
                        setOpenMenu(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      style={{ color: '#1C1C1C' }}
                    >
                      Edit Loan
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete?.(el?.uuid);
                        setOpenMenu(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 border-t"
                      style={{ color: '#EF4444', borderColor: 'rgba(162, 161, 168, 0.1)' }}
                    >
                      Delete Loan
                    </button>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
): tableFor === "loanDetails" ? (
  <div className="relative max-h-[420px] overflow-y-auto custom-scroll">
  <table className="w-full border-separate border-spacing-y-2">

  <thead className="sticky top-0 z-20">

    <tr className="bg-[#1F1F1F]">
      {dataHeaders?.map((el, idx) => (
        <th
          key={idx}
          scope="col"
          className={`px-6 py-4 text-sm font-medium text-gray-300 uppercase tracking-wide
            ${idx === 0 ? "text-center rounded-l-lg" : ""}
            ${idx === 1 ? "text-left" : ""}
            ${idx > 1 ? "text-right" : ""}
            ${idx === dataHeaders.length - 1 ? "rounded-r-lg" : ""}
          `}
        >
          {el}
        </th>
      ))}
    </tr>
  </thead>

  <tbody>
    {dataTable?.map((el, idx) => (
      <tr
        key={idx}
        className="bg-white hover:bg-gray-50 transition"
      >
        {/* STATUS COLUMN */}
        <td className="px-6 py-4 text-center">
          <div className="flex items-center justify-center relative">
            <div
              className={`h-9 w-9 rounded-full flex items-center justify-center z-20
                ${el?.status === "paid"
                  ? "bg-blue-td-500"
                  : "bg-white border border-gray-400"}
              `}
            >
              {el?.status === "paid" ? (
                <CheckFat className="text-white" weight="fill" />
              ) : (
                <span className="text-sm font-medium">{idx + 1}</span>
              )}
            </div>

            {idx !== dataTable.length - 1 && (
              <div className="absolute w-0.5 h-16 bg-blue-td-500 top-full"></div>
            )}
          </div>
        </td>

        {/* DATE */}
        <td className="px-6 py-4 text-left text-sm text-gray-700">
          {dayjs(el?.date).format("DD/MM/YYYY")}
        </td>

        {/* AMOUNT PAID */}
        <td className="px-6 py-4 text-right text-sm text-gray-700">
          $
          {(el?.status === "paid"
            ? el?.amountRepaid
            : el?.expectedAmount
          )?.toLocaleString("en-US")}
        </td>

        {/* TOTAL PAID */}
        <td className="px-6 py-4 text-right text-sm text-gray-700">
          $
          {(idx === dataTable.length - 1
            ? el?.expectedAmount
            : el?.totalAmountRepaid
          )?.toLocaleString("en-US")}
        </td>

        {/* REMAINING */}
        <td className="px-6 py-4 text-right text-sm text-red-td-400">
          ${el?.remainingAmount?.toLocaleString("en-US")}
        </td>
      </tr>
    ))}
  </tbody>
</table>
</div>
      ) : tableFor === "attendance-break" ? (
        <table className="w-full table-auto">
          <thead>
            <tr>
              {dataHeaders?.map((el, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-b-[1px]"
                >
                  {el}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataTable?.map((el, idx) => (
              <tr key={el?.uuid} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex items-center justify-start space-x-2">
                    <div
                      className="h-5 w-5"
                      style={{ backgroundColor: el?.color }}
                    ></div>
                    <p className="text-black text-sm font-normal">{el?.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">
                      {dayjs(el?.fromTime, "HH:mm:ss").format("HH:mm")} -{" "}
                      {dayjs(el?.toTime, "HH:mm:ss").format("HH:mm")}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">{el?.type}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p
                      className={`${
                        el?.isActive ? "text-green-500" : "text-red-500"
                      } text-sm font-normal`}
                    >
                      {el?.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </td>
                <td className="text-black flex items-center justify-center border-b-[1px] py-2">
                  <div
                    className="relative"
                    ref={openMenu === el?.uuid ? menuRef : null}
                  >
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === el?.uuid ? null : el?.uuid)
                      }
                      className="h-8 w-8 rounded-full border-[1px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <Pencil size={16} className="text-gray-600" />
                    </button>

                    {openMenu === el?.uuid && (
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button
                          onClick={() => handleDelete(el?.uuid)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            handleEdit(el?.uuid);
                            setOpenMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleChangeActiveStatus(
                              el?.uuid,
                              "AttendanceBreak",
                              "attendance-break"
                            )
                          }
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          Mark as {el?.isActive ? "Inactive" : "Active"}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : tableFor === "attendance" ? (
        <table className="w-full table-auto">
          <thead>
            <tr>
              {dataHeaders?.map((el, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-b-[1px]"
                >
                  {el}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataTable?.map((el, idx) => (
              <tr key={el?.uuid} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">
                      {el?.settingsName}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">
                      {el?.applicableTo}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">
                      {el?.workingHoursCalculation !== "every-valid-check"
                        ? "First check-in and last check-out"
                        : "Every valid check-in and check-out"}
                    </p>
                  </div>
                </td>
                <td className="text-black flex items-center justify-center border-b-[1px] py-[20%]">
                  <div
                    className="relative"
                    ref={openMenu === el?.uuid ? menuRef : null}
                  >
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === el?.uuid ? null : el?.uuid)
                      }
                      className="h-8 w-8 rounded-full border-[1px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <Pencil size={16} className="text-gray-600" />
                    </button>

                    {openMenu === el?.uuid && (
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button
                          onClick={() => handleDelete(el?.uuid)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            handleEdit(el?.uuid);
                            setOpenMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : tableFor === "leave-types" ? (
        <table className="w-full table-auto">
          <thead>
            <tr>
              {dataHeaders?.map((el, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-b-[1px]"
                >
                  {el}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataTable?.map((el, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">
                      {el?.leaveName}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">
                      {el?.selectType}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">
                      {el?.leaveAllocation !== "Select" && "Days"}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p
                      className={`${
                        el?.isActive ? "text-green-500" : "text-red-500"
                      } text-sm font-normal`}
                    >
                      {el?.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </td>
                <td className="text-black border-b-[1px]">
                  <div
                    className="relative"
                    ref={openMenu === el?.uuid ? menuRef : null}
                  >
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === el?.uuid ? null : el?.uuid)
                      }
                      className="h-8 w-8 rounded-full border-[1px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <Pencil size={16} className="text-gray-600" />
                    </button>

                    {openMenu === el?.uuid && (
                      <div className="absolute right-32 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button
                          onClick={() => handleDelete(el?.uuid)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            handleEdit(el?.uuid);
                            setOpenMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleChangeActiveStatus(
                              el?.uuid,
                              "leave-types",
                              "leave-types"
                            )
                          }
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          Mark as {el?.isActive ? "Inactive" : "Active"}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : tableFor === "leave-type-holiday" ? (
        <table className="w-full table-auto">
          <thead>
            <tr>
              {dataHeaders?.map((el, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-b-[1px]"
                >
                  {el}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataTable?.map((el, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">{el?.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">{el?.date}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">
                      {el?.organizationDetail?.Country?.name}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    {el?.applicableFor?.map((el, idx) => (
                      <p className="text-black text-sm font-normal">
                        {el?.shift?.shiftName}
                      </p>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">
                      {el?.classification}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">
                      {el?.description}
                    </p>
                  </div>
                </td>
                <td className="text-black border-b-[1px]">
                  <div
                    className="relative"
                    ref={openMenu === el?.uuid ? menuRef : null}
                  >
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === el?.uuid ? null : el?.uuid)
                      }
                      className="h-8 w-8 rounded-full border-[1px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <Pencil size={16} className="text-gray-600" />
                    </button>

                    {openMenu === el?.uuid && (
                      <div className="absolute right-32 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button
                          onClick={() => handleDelete(el?.uuid)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            handleEdit(el?.uuid);
                            setOpenMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : tableFor === "senderEmailSetting" ? (
        <table className="w-full table-auto">
          <thead>
            <tr>
              {dataHeaders?.map((el, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-b-[1px]"
                >
                  {el}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataTable?.map((el, idx) => (
              <tr key={el?.uuid} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm border-b">
                  <div className="flex items-center justify-start space-x-2">
                    <p className="text-black text-sm font-normal">{el?.name}</p>
                    {el?.isPrimary && (
                      <div className="px-2 py-0.5 flex items-center justify-center bg-green-500">
                        <p className="text-white text-xs font-medium">
                          Primary
                        </p>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">
                      {el?.email}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm border-b">
                  <div className="flex items-center justify-start space-x-2">
                    {!el?.isVerified && (
                      <WarningCircleIcon className="text-orange-500" />
                    )}
                    <p
                      className={`text-sm font-medium ${
                        el?.isVerified ? "text-green-600" : "text-orange-500"
                      }`}
                    >
                      {el?.isVerified ? "Verified" : "Unverified"}
                    </p>
                    {!el?.isVerified && (
                      <button
                        disabled={loading}
                        onClick={() => {
                          resened(el?.uuid);
                        }}
                        className="text-blue-500"
                      >
                        {loading ? "processing..." : "(Resend Invitation)"}
                      </button>
                    )}
                  </div>
                </td>
                <td className="text-black flex items-center justify-center border-b-[1px] py-2.5">
                  <div
                    className="relative"
                    ref={openMenu === el?.uuid ? menuRef : null}
                  >
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === el?.uuid ? null : el?.uuid)
                      }
                      className="h-8 w-8 rounded-full border-[1px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <Pencil size={16} className="text-gray-600" />
                    </button>

                    {openMenu === el?.uuid && (
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button
                          onClick={() => handleDelete(el?.uuid)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            handleEdit(el?.uuid);
                            setOpenMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : tableFor === "payrollHistory" ? (
        <table className="w-full table-auto">
          <thead>
            <tr>
              {dataHeaders?.map((el, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-b-[1px]"
                >
                  {el}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataTable?.map((el, idx) => (
              <tr
                // onClick={() => handleView(el?.uuid, "Loans", "loan")}
                key={idx}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">
                      {el?.paymentDate}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">{el?.type}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">
                      {el?.detail}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    {el?.status && (
                      <div
                        className={`py-0.5 px-3 rounded-sm capitalize
                                        ${
                                          el?.status == "paymentDue"
                                            ? "bg-orange-200 text-orange-500"
                                            : el?.status == "paid"
                                            ? "bg-green-200 text-green-500"
                                            : "bg-gray-200 text-gray-500"
                                        }`}
                      >
                        {statusShowGlobal[el?.status]}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-black border-b-[1px] flex items-center space-x-2">
                  <button
                    className="h-8 w-8 text-lg flex items-center justify-center rounded-md bg-gray-td-100 text-gray-td-600 duration-300 ease-in-out transition-all hover:bg-red-100 hover:text-red-td-600"
                    onClick={() => {
                      handleDelete(el?.uuid);
                    }}
                  >
                    <Trash weight="fill" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : tableFor === "employeeSummary" ? (
        <table className="w-full table-auto">
          <thead>
            <tr>
              {dataHeaders?.map((el, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-b-[1px]"
                >
                  {el}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataTable?.listEmployees?.map((el, idx) => (
              <tr
                onClick={() => handleView(el?.employeeUuid, el?.employeeName)}
                key={idx}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex items-center justify-start space-x-2">
                    <p className="text-black text-sm font-normal">
                      {el?.employeeName}
                    </p>
                    {el?.status && (
                      <div
                        className={`flex items-center justify-center px-2 ${
                          el?.status?.status == "salary hold"
                            ? "bg-red-td-500 text-white"
                            : "bg-blue-td-500 text-white"
                        } relative`}
                      >
                        <h1>{el?.status?.status}</h1>
                        <div
                          key={idx}
                          className="h-8 w-8 text-lg flex items-center justify-center rounded-md text-gray-td-600 duration-300 ease-in-out transition-all relative"
                          onMouseEnter={() => setOpenMenu(idx)}
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          <Eye weight="fill" className="text-white" />
                          {openMenu === idx && (
                            <div className="absolute w-[200px] h-fit -top-10 -left-[250%] bg-black text-white font-light p-2 rounded-md shadow-lg space-y-2">
                              <p className="text-xs w-full whitespace-normal">
                                {el?.status?.reason}
                              </p>
                              <div className="absolute w-3 h-3 rotate-45 bg-black top-4 left-1/2 -translate-x-1/2"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-black text-sm font-normal">
                      {el?.paidDays?.toLocaleString("en-US")}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    {el?.status?.status != "skipped" && (
                      <p className="text-black text-sm font-normal">
                        ${el?.monthlyCtc?.toLocaleString("en-US")}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    {el?.status?.status != "skipped" && (
                      <p className="text-black text-sm font-normal">
                        ${el?.earnings?.toLocaleString("en-US")}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    {el?.status?.status != "skipped" && (
                      <p className="text-black text-sm font-normal">
                        ${el?.reimbursements?.toLocaleString("en-US")}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    {el?.status?.status != "skipped" && (
                      <p className="text-black text-sm font-normal">
                        ${el?.grossPay?.toLocaleString("en-US")}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    {el?.status?.status != "skipped" && (
                      <p className="text-black text-sm font-normal">
                        ${el?.deductions?.toLocaleString("en-US")}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    {el?.status?.status != "skipped" && (
                      <p className="text-black text-sm font-normal">
                        ${el?.benefits?.toLocaleString("en-US")}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-blue-500 border-b-[1px]">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    {el?.status?.status != "skipped" && (
                      <p className="text-black text-sm font-normal">
                        ${el?.netPay?.toLocaleString("en-US")}
                      </p>
                    )}
                  </div>
                </td>
                <td className="text-black flex items-center justify-center border-b-[1px] py-2.5">
                  {dataTable?.checkPayrun?.status == "draft" && (
                    <div
                      className="relative"
                      ref={openMenu === el?.employeeUuid ? menuRef : null}
                    >
                      {el?.status?.status == "skipped" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(
                              el?.employeeUuid,
                              "delete",
                              el?.employeeName
                            );
                            setOpenMenu(null);
                          }}
                          className="w-full h-full flex items-center justify-center py-2.5"
                        >
                          add to payroll
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenu(
                                openMenu === el?.employeeUuid
                                  ? null
                                  : el?.employeeUuid
                              );
                            }}
                            className="h-8 w-8 rounded-full border-[1px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <Pencil size={16} className="text-gray-600" />
                          </button>

                          {openMenu === el?.employeeUuid && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                              {/* <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(el?.employeeUuid);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                            >
                                                                Delete
                                                            </button> */}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(
                                    el?.employeeUuid,
                                    el?.status?.status == "salary hold"
                                      ? "delete"
                                      : "Withhold Salary",
                                    el?.employeeName
                                  );
                                  setOpenMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                {el?.status?.status == "salary hold"
                                  ? "Revert Salary Withhold"
                                  : "Withhold Salary"}
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(
                                    el?.employeeUuid,
                                    "Skip Payroll",
                                    el?.employeeName
                                  );
                                  setOpenMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                Skip from this payroll
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(el?.employeeUuid, "salaryDetail");
                                  setOpenMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                Revise Salary
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(el?.employeeUuid, "initiateExit");
                                  setOpenMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                Initiate Exit Process
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(
                                    el?.employeeUuid,
                                    "employeeDetail"
                                  );
                                  setOpenMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                View Employee Details
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : tableFor === "reimbursementEmployeePortal" ? (
        <table className="min-w-full border-collapse">
          <thead className="bg-[#F5FAFF]">
            <tr>
              {normalizedHeaders?.map((el, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`py-4 text-left text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1F87FF] border-b border-[#E5E7EB] ${
                    idx === 0 ? "pl-8 pr-6" : "px-6"
                  }`}
                >
                  {el}
                </th>
              ))}
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {dataTable && dataTable.length > 0 ? (
              // Filter out duplicates based on uuid or claimNumber
              dataTable
                .filter((el, idx, self) => {
                  const identifier = el?.uuid || el?.claimNumber;
                  return (
                    !identifier ||
                    idx ===
                      self.findIndex(
                        (item) =>
                          (item?.uuid || item?.claimNumber) === identifier
                      )
                  );
                })
                .map((el, idx, filteredArray) => {
                  const isLastRow = idx === (filteredArray?.length || 0) - 1;

                  // Helper function to get status badge styling
                  const getStatusBadge = (status) => {
                    const statusLower = status?.toLowerCase();
                    let bgColor = "#F3F4F6";
                    let textColor = "#374151";
                    let displayText = status;

                    if (
                      statusLower === "approve" ||
                      statusLower === "approved"
                    ) {
                      bgColor = "#D5FAF2";
                      textColor = "#016558";
                      displayText = "Approved";
                    } else if (
                      statusLower === "submitted" ||
                      statusLower === "pending"
                    ) {
                      bgColor = "#FFF3E0";
                      textColor = "#DB6E00";
                      displayText = "Pending";
                    } else if (
                      statusLower === "rejected" ||
                      statusLower === "reject"
                    ) {
                      bgColor = "#FEE2E2";
                      textColor = "#991B1B";
                      displayText = "Rejected";
                    } else if (statusLower === "recalled") {
                      bgColor = "#FFEDD5";
                      textColor = "#9A3412";
                      displayText = "Recalled";
                    } else if (statusLower === "draft") {
                      bgColor = "#F3F4F6";
                      textColor = "#4B5563";
                      displayText = "Draft";
                    }

                    return (
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: bgColor, color: textColor }}
                      >
                        {displayText}
                      </span>
                    );
                  };

                  // Get reimbursement name from SalaryDetailComponents list (same as summary)
                  const getReimbursementName = () => {
                    if (!el?.bills || el.bills.length === 0) return "-";

                    // Get salaryDetailComponentUuid from first bill
                    const salaryDetailComponentUuid =
                      el.bills[0]?.salaryDetailComponentUuid;
                    if (!salaryDetailComponentUuid) return "-";

                    // Find matching component from SalaryDetailComponents list
                    const component =
                      dataReimbursementEmployee?.SalaryDetailComponents?.find(
                        (comp) => comp.uuid === salaryDetailComponentUuid
                      );

                    if (component?.SalaryComponentReimbursement?.nameInPaysl) {
                      // Use formatReimbursementName if provided, otherwise use raw name
                      return formatReimbursementName
                        ? formatReimbursementName(
                            component.SalaryComponentReimbursement.nameInPaysl
                          )
                        : component.SalaryComponentReimbursement.nameInPaysl;
                    }

                    return "-";
                  };

                  const reimbursementName = getReimbursementName();

                  return (
                    <tr
                      key={el?.uuid || el?.claimNumber || idx}
                      className="cursor-pointer bg-white transition-colors hover:bg-[#F9FAFB]"
                    >
                      <td
                        className={`pl-8 pr-6 py-5 text-left text-sm font-medium text-[#1F87FF] ${
                          isLastRow ? "" : "border-b border-[#E5E7EB]"
                        }`}
                      >
                        <p className="truncate">{el?.claimNumber}</p>
                      </td>
                      <td
                        className={`px-6 py-5 text-left text-sm text-[#374151] ${
                          isLastRow ? "" : "border-b border-[#E5E7EB]"
                        }`}
                      >
                        <p className="truncate">{reimbursementName}</p>
                      </td>
                      <td
                        className={`px-6 py-5 text-left text-sm text-[#374151] ${
                          isLastRow ? "" : "border-b border-[#E5E7EB]"
                        }`}
                      >
                        <p>
                          {el?.claimDate
                            ? dayjs(el.claimDate).format("DD/MM/YYYY")
                            : "-"}
                        </p>
                      </td>
                      <td
                        className={`px-6 py-5 text-left text-sm text-[#374151] ${
                          isLastRow ? "" : "border-b border-[#E5E7EB]"
                        }`}
                      >
                        <p>
                          $
                          {Number(el?.totalAmount || 0).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </p>
                      </td>
                      <td
                        className={`px-6 py-5 text-left text-sm text-[#374151] ${
                          isLastRow ? "" : "border-b border-[#E5E7EB]"
                        }`}
                      >
                        <p>
                          $
                          {Number(
                            el?.status === "approve"
                              ? el?.approvedAmount || 0
                              : 0
                          ).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </td>
                      <td
                        className={`px-6 py-5 text-left text-sm ${
                          isLastRow ? "" : "border-b border-[#E5E7EB]"
                        }`}
                      >
                        {getStatusBadge(el?.status)}
                      </td>
                      <td
                        className={`px-6 py-5 text-center relative ${
                          isLastRow ? "" : "border-b border-[#E5E7EB]"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(
                              openDropdownId === el?.uuid ? null : el?.uuid
                            );
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#F3F4F6] transition-colors text-[#6B7280] hover:text-[#1F87FF]"
                        >
                          <DotsThreeOutlineVertical size={18} weight="bold" />
                        </button>

                        {openDropdownId === el?.uuid && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                if (handleEdit) {
                                  handleEdit(el?.uuid, "edit");
                                }
                                setOpenDropdownId(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors"
                            >
                              Edit
                            </button>
                            {/* <button
                              type="button"
                              onClick={() => {
                                if (handleChangeActiveStatus) {
                                  handleChangeActiveStatus(el?.uuid, "active");
                                }
                                setOpenDropdownId(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors border-t border-[#E5E7EB]"
                            >
                              Mark as Active
                            </button> */}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td
                  colSpan={(normalizedHeaders?.length || 6) + 1}
                  className="pl-8 pr-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[#F5FAFF] flex items-center justify-center">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 2C9 1.44772 9.44772 1 10 1H14C14.5523 1 15 1.44772 15 2V3H19C19.5523 3 20 3.44772 20 4V6C20 6.55228 19.5523 7 19 7H5C4.44772 7 4 6.55228 4 6V4C4 3.44772 4.44772 3 5 3H9V2Z"
                          fill="#1F87FF"
                          opacity="0.3"
                        />
                        <path
                          d="M5 8H19V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V8Z"
                          stroke="#1F87FF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 12V18M14 12V18"
                          stroke="#1F87FF"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-[#374151]">
                        No claims yet
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        Get started by creating your first reimbursement claim
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : tableFor === "reimbursementEmployeeApproval" ? (
  <div className="w-full h-full ">
    <table className="w-full table-auto">
      
      {/* HEADER */}
      <thead
        className="sticky top-0 z-10"
        style={{ background: "#1C1C1C", height: "78px" }}
      >
        <tr>
          {dataHeaders?.map((el, idx) => (
            <th
              key={idx}
              scope="col"
              className={`text-xs font-medium uppercase tracking-wider 
                ${idx === 3 ? "text-center" : idx >= 4 ? "text-right" : "text-left"}
                ${idx === 0 ? "pl-10" : ""} 
                ${idx === dataHeaders.length - 1 ? "pr-10" : ""}
              `}
              style={{
                color: "#ADADAD",
                fontSize: "14px",
                lineHeight: "20px",
                fontFamily: "Inter",
              }}
            >
              {el}
            </th>
          ))}
        </tr>
      </thead>

      {/* BODY */}
      <tbody className="bg-white">
        {dataTable?.map((el, idx) => (
          <tr
            key={idx}
            className="hover:bg-gray-50 cursor-pointer transition-colors border-b border-dashed"
            style={{
              height: "80px",
              borderColor: "rgba(28, 28, 28, 0.1)",
            }}
          >
            {/* Claim Number */}
            <td
              className="pl-10 whitespace-nowrap text-left"
              style={{ fontFamily: "Inter", color: "#1C1C1C" }}
            >
              <div className="font-normal text-base">
                {el?.claimNumber}
              </div>
            </td>

            {/* Employee Name */}
            <td
              className="whitespace-nowrap text-left"
              style={{ fontFamily: "Inter" }}
            >
              <div className="font-normal text-base" style={{ color: "#0066FE" }}>
                {el?.Employee?.firstName} {el?.Employee?.lastName}
              </div>
            </td>

            {/* Submitted Date */}
            <td
              className="whitespace-nowrap text-left text-base"
              style={{ color: "rgba(28, 28, 28, 0.6)", fontFamily: "Inter" }}
            >
              {dayjs(el?.claimDate).format("DD/MM/YYYY")}
            </td>

            {/* Claim Amount */}
            <td
              className="whitespace-nowrap text-right text-base"
              style={{ color: "rgba(28, 28, 28, 0.6)", fontFamily: "Inter" }}
            >
              {formatFunction(Number(el?.totalAmount || 0))}
            </td>

            {/* Approve / Approved Amount */}
            <td className="whitespace-nowrap text-center">
              {el?.status !== "approve" && el?.status !== "reject" ? (
                <ReuseableInput
                  id={`approveAmount-${el.uuid}`}
                  name="approveAmount"
                  placeholder="Approve Amount..."
                  value={approveAmount[el.uuid]?.approveAmount || ""}
                  onChange={(e) => handleInputChange(e, el.uuid)}
                  type="number"
                />
              ) : (
                <div
                  className="text-base font-normal"
                  style={{ fontFamily: "Inter", color: "#1C1C1C" }}
                >
                  {formatFunction(Number(el?.approvedAmount || 0))}
                </div>
              )}
            </td>

            {/* STATUS + ACTIONS */}
            <td className="pr-10 whitespace-nowrap text-center">
              {el?.status !== "approve" && el?.status !== "reject" ? (
                <div className="flex items-center justify-center gap-3">

                  {/* Approve Button */}
                  <button
                    onClick={() =>
                      handleEdit(
                        el.uuid,
                        "approve",
                        approveAmount[el.uuid]?.approveAmount || ""
                      )
                    }
                    className="h-8 w-8 rounded-full border flex items-center justify-center bg-white hover:bg-gray-100"
                    style={{ borderColor: "rgba(28,28,28,0.3)" }}
                  >
                    <CheckFat size={16} className="text-gray-600" />
                  </button>

                  {/* Reject Button */}
                  <button
                    onClick={() => handleEdit(el.uuid, "reject")}
                    className="h-8 w-8 rounded-full border flex items-center justify-center bg-white hover:bg-gray-100"
                    style={{ borderColor: "rgba(28,28,28,0.3)" }}
                  >
                    <X size={16} className="text-gray-600" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span
                    className="px-4 py-1.5 rounded-full"
                    style={{
                      background:
                        el?.status === "approve"
                          ? "rgba(0, 200, 0, 0.15)"
                          : "rgba(255, 0, 0, 0.15)",
                      color: el?.status === "approve" ? "#0F9D58" : "#EF4444",
                      fontFamily: "Inter",
                      fontSize: "14px",
                    }}
                  >
                    {el?.status === "approve" ? "Approved" : "Rejected"}
                  </span>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEdit(el.uuid, "edit")}
                    className="h-8 w-8 rounded-full border flex items-center justify-center bg-white hover:bg-gray-100"
                    style={{ borderColor: "rgba(28,28,28,0.3)" }}
                  >
                    <PenIcon size={16} className="text-gray-600" />
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
  </div>
  
) : 
  tableFor === "employeePortalLeave" ? (
  /* TABLE LEAVE EMPLOYEE AND LEAVE APPROVAL */
  <table className="w-full table-auto bg-white border border-dashed border-[rgba(28,28,28,0.1)] rounded-t-[10px]">
    <thead>
      <tr className="bg-[#1C1C1C] h-20">
        <th className="text-center w-[33px] py-5">
          <input 
            type="checkbox" 
            className="w-[18px] h-[18px] rounded-[4px] border border-[#ADADAD]" 
          />
        </th>
        {dataHeaders?.map((el, idx) => (
          
          <th
            key={idx}
            scope="col"
            className="px-6 py-5 text-left text-[14px] font-medium leading-5 text-[#ADADAD] uppercase"
            style={{ fontFamily: 'Inter', fontWeight: 500 }}
          >
            {el}
          </th>
        ))}
      </tr>
    </thead>

    <tbody className="bg-white">
      {dataTable?.map((el, idx) => (
        <tr 
          key={idx} 
          className="border-b border-dashed border-[rgba(28,28,28,0.1)] h-[86px]"
        >
          {/* Checkbox */}
          <td className="text-center">
            <input 
              type="checkbox" 
              className="w-[18px] h-[18px] rounded-[4px] border border-[rgba(28,28,28,0.3)]" 
            />
          </td>

          {/* employee name */}
          <td className="px-6 text-left">
            <p 
              className="text-[16px] leading-6 font-normal text-[rgba(28,28,28,0.5)]"
              style={{ fontFamily: 'Inter' }}
            >
              {el?.employeeName}
            </p>
          </td>

          {/* date from - to */}
          <td className="px-6 text-left">
            <p 
              className="text-[16px] leading-6 font-normal text-[#1C1C1C]"
              style={{ fontFamily: 'Inter' }}
            >
              {dayjs(el?.dateFrom).format("DD/MM/YYYY")} -{" "}
              {dayjs(el?.dateTo).format("DD/MM/YYYY")}
            </p>
          </td>

          {/* no of days (units) */}
          <td className="px-6 text-left">
            <p 
              className="text-[16px] leading-6 font-normal text-[#1C1C1C]"
              style={{ fontFamily: 'Inter' }}
            >
              {el?.dayCount} Days
            </p>
          </td>

          {/* leave type */}
          <td className="px-6 text-left">
            <p 
              className="text-[16px] leading-6 font-normal text-[rgba(28,28,28,0.5)]"
              style={{ fontFamily: 'Inter' }}
            >
              {el?.LeaveType.leaveName}
            </p>
          </td>

          {/* leave status (Paid/Unpaid) */}
          <td className="px-6 text-left">
            <span 
              className={`inline-flex items-center justify-center h-[30px] px-4 text-[16px] leading-6 font-normal rounded-[25px] ${
                el?.leaveStatus === 'Paid' 
                  ? 'bg-[#D5FAF2] text-[#014F45]' 
                  : 'bg-[rgba(28,28,28,0.1)] text-[#1C1C1C]'
              }`}
              style={{ fontFamily: 'Inter', minWidth: '80px' }}
            >
              {el?.leaveStatus || 'Paid'}
            </span>
          </td>

          {/* reason */}
          <td className="px-6 text-left">
            <p 
              className="text-[16px] leading-6 font-normal text-[#1C1C1C]"
              style={{ fontFamily: 'Inter' }}
            >
              {el?.reason}
            </p>
          </td>

          {/* status (Approve/Approved/Rejected) */}
          <td className="px-6 text-left">
            <div className="flex items-center gap-2">
              {el?.status === "pending" || el?.status === "draft" ? (
                <>
                  <button 
                    onClick={() => handleEdit(el.uuid, "approved")}
                    className="h-[30px] px-4 bg-[#D5FAF2] text-[#014F45] text-[16px] leading-6 font-normal rounded-[25px] hover:opacity-80"
                    style={{ fontFamily: 'Inter', minWidth: '80px' }}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleEdit(el.uuid, "rejected")}
                    className="h-[30px] px-4 bg-[#FEE2E2] text-[#991B1B] text-[16px] leading-6 font-normal rounded-[25px] hover:opacity-80"
                    style={{ fontFamily: 'Inter', minWidth: '80px' }}
                  >
                    Reject
                  </button>
                </>
              ) : (
                <span 
                  className={`inline-flex items-center justify-center h-[30px] px-4 text-[16px] leading-6 font-normal rounded-[25px] ${
                    el?.status?.toLowerCase() === "approved" 
                      ? 'bg-[#D5FAF2] text-[#014F45]' 
                      : 'bg-[#FEE2E2] text-[#991B1B]'
                  }`}
                  style={{ fontFamily: 'Inter', minWidth: '100px' }}
                >
                  {el?.status}
                </span>
              )}
            </div>
          </td>

          {!pathname?.includes("employee-portal") ? (
            <td className="text-black text-center py-2.5">
              {el?.status !== "pending" && el?.status !== "draft" && (
                <button
                  onClick={() => handleEdit(el.uuid, "edit")}
                  className="h-8 w-8 rounded-full border-[1px] flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors mx-auto"
                >
                  <PenIcon size={16} className="text-gray-600" />
                </button>
              )}
            </td>
          ) : (
            <td className="px-6 text-left">
              {(el?.status === "pending" || el?.status === "draft") && (
                <button
                  onClick={() => handleEdit(el.uuid, "canceled")}
                  className="h-[30px] px-4 bg-[#FEE2E2] text-[#991B1B] text-[16px] leading-6 font-normal rounded-[25px] hover:opacity-80"
                  style={{ fontFamily: 'Inter' }}
                >
                  Cancel
                </button>
              )}
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
): tableFor === "payslipEmployeePortal" ? (
        <table className="min-w-full border-collapse">
          <thead className="bg-[#F5FAFF]">
            <tr>
              {dataHeaders?.map((el, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === dataHeaders.length - 1;
                return (
                  <th
                    key={idx}
                    scope="col"
                    className={`py-4 text-left text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1F87FF] border-b border-[#F5FAFF] ${
                      isFirst ? "pl-8 pr-4" : isLast ? "pl-6 pr-4" : "pl-6 pr-4"
                    }`}
                  >
                    {el}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {dataTable && dataTable.length > 0 ? (
              dataTable.map((el, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 cursor-pointer"
                  onMouseEnter={() => setHoveredRow(idx)}
                  onMouseLeave={() => {
                    setHoveredRow(null);
                    setHoveredColumn(null);
                  }}
                >
                  <td className="pl-8 pr-4 py-4 text-left text-sm text-[#111827] border-b border-[#F5FAFF]">
                    <div className="flex flex-col items-start justify-start">
                      <p className="text-sm font-normal text-[#1F87FF]">
                        {el?.month}
                      </p>
                    </div>
                  </td>
                  <td className="pl-6 pr-4 py-4 text-left text-sm text-[#111827] border-b border-[#F5FAFF]">
                    <div className="flex flex-col items-start justify-start">
                      <p className="text-sm font-normal">{el?.grossPay}</p>
                    </div>
                  </td>
                  <td className="pl-6 pr-4 py-4 text-left text-sm text-[#111827] border-b border-[#F5FAFF]">
                    <div className="flex flex-col items-start justify-start">
                      <p className="text-sm font-normal">
                        {el?.reimbursements}
                      </p>
                    </div>
                  </td>
                  <td className="pl-6 pr-4 py-4 text-left text-sm text-[#111827] border-b border-[#F5FAFF]">
                    <div className="flex flex-col items-start justify-start">
                      <p className="text-sm font-normal">{el?.deductions}</p>
                    </div>
                  </td>
                  <td className="pl-6 pr-4 py-4 text-left text-sm text-[#111827] border-b border-[#F5FAFF]">
                    <div className="flex flex-col items-start justify-start">
                      <p className="text-sm font-normal">{el?.takeHome}</p>
                    </div>
                  </td>
                  <td
                    className="pl-6 pr-4 py-4 text-left text-sm text-[#111827] border-b border-[#F5FAFF]"
                    onMouseEnter={() => setHoveredColumn("payslip")}
                    onMouseLeave={() => setHoveredColumn(null)}
                  >
                    {el.hasPayslip ? (
                      <button
                        onClick={() => handleEdit(el, "payslip")}
                        className="bg-[#F5FAFF] text-[#1F87FF] px-4 py-1.5 rounded-full font-medium text-sm hover:bg-[#E0F2FE] transition-all duration-200"
                      >
                        View
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={dataHeaders?.length || 6}
                  className="pl-8 pr-4 py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[#F5FAFF] flex items-center justify-center">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 2C9 1.44772 9.44772 1 10 1H14C14.5523 1 15 1.44772 15 2V3H19C19.5523 3 20 3.44772 20 4V6C20 6.55228 19.5523 7 19 7H5C4.44772 7 4 6.55228 4 6V4C4 3.44772 4.44772 3 5 3H9V2Z"
                          fill="#1F87FF"
                          opacity="0.3"
                        />
                        <path
                          d="M5 8H19V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V8Z"
                          stroke="#1F87FF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 12V18M14 12V18"
                          stroke="#1F87FF"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-[#374151]">
                        No payslips found
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        No payslip data available for the selected year.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : tableFor === "reimbursementForm" ? (
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {dataHeaders?.map((el, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`py-4 text-left text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1F87FF] border-b border-[#E5E7EB] ${
                    idx === 0 ? "pl-8 pr-6" : "px-6"
                  }`}
                >
                  {el}
                </th>
              ))}
              {dataTable?.length > 0 && (
                <th className="py-4 text-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1F87FF] border-b border-[#E5E7EB] px-2 w-[60px]"></th>
              )}
              {dataTable?.length > 1 && (
                <th className="py-4 text-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[#1F87FF] border-b border-[#E5E7EB] px-2 w-[60px]"></th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white">
            {dataTable?.map((bill, index) => {
              const isLastRow = index === dataTable.length - 1;
              const formProps = handleEdit; // Pass all form handlers through handleEdit prop

              return (
                <tr key={index} className="hover:bg-gray-50">
                  {/* Reimbursement Type */}
                  <td
                    className={`py-4 whitespace-nowrap pl-8 pr-6 overflow-visible ${
                      !isLastRow ? "border-b border-[#E5E7EB]" : ""
                    }`}
                  >
                    <ReimbursementTypeDropdown
                      bill={bill}
                      index={index}
                      formProps={formProps}
                    />
                  </td>
                  {/* Bill Date */}
                  <td
                    className={`py-4 whitespace-nowrap px-6 ${
                      !isLastRow ? "border-b border-[#E5E7EB]" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <div className="relative w-full">
                        <input
                          type="date"
                          value={
                            bill.billDate ? bill.billDate.split("T")[0] : ""
                          }
                          onChange={(e) => {
                            formProps?.handleBillChange?.(
                              index,
                              "billDate",
                              e.target.value || ""
                            );
                          }}
                          onClick={(e) => e.target.showPicker?.()}
                          className="w-full px-[14px] py-[10px] pr-10 border border-[#D1D5DB] rounded-lg bg-white text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F87FF] focus:border-[#1F87FF] cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden"
                        />
                        {formProps?.Calendar && (
                          <formProps.Calendar
                            size={20}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
                          />
                        )}
                      </div>
                    </div>
                  </td>
                  {/* Bill Number */}
                  <td
                    className={`py-4 whitespace-nowrap px-6 ${
                      !isLastRow ? "border-b border-[#E5E7EB]" : ""
                    }`}
                  >
                    <input
                      type="text"
                      value={bill.billNo}
                      onChange={(e) =>
                        formProps?.handleBillChange(
                          index,
                          "billNo",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-[14px] py-[10px] border border-[#D1D5DB] rounded-lg bg-white text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F87FF] focus:border-[#1F87FF]"
                      placeholder=""
                    />
                  </td>
                  {/* Claim Amount */}
                  <td
                    className={`py-4 whitespace-nowrap text-right px-6 ${
                      !isLastRow ? "border-b border-[#E5E7EB]" : ""
                    }`}
                  >
                    <div className="relative inline-block w-full max-w-[175px] -ml-20"> {/* added this because relative + absolute make the position bad */}
                      <div 
                        className="absolute left-0 top-0 h-[42px] w-[27px] bg-[#F9FAFB] rounded-l-lg border border-r-0 border-[#D1D5DB] flex items-center justify-center">
                        <span className="text-sm font-medium text-[#111827]">
                          $
                        </span>
                      </div>
                      <input
                        type="number"
                        value={bill.billAmount || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Only allow numbers and decimal point
                          if (value === "" || /^\d*\.?\d*$/.test(value)) {
                            formProps?.handleBillChange(
                              index,
                              "billAmount",
                              parseFloat(value) || 0
                            );
                          }
                        }}
                        onKeyDown={(e) => {
                          // Prevent 'e', 'E', '+', '-' characters
                          if (
                            e.key === "e" ||
                            e.key === "E" ||
                            e.key === "+" ||
                            e.key === "-"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        className="w-full pl-[35px] pr-[14px] py-[10px] border border-[#D1D5DB] rounded-lg bg-white text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F87FF] focus:border-[#1F87FF]"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </td>
                  {/* Approved Amount - Only show for admin */}
                  {/* !formProps?.hideApprovedAmount */ false && (
                    <td
                      className={`py-4 whitespace-nowrap text-right px-6 ${
                        !isLastRow ? "border-b border-[#E5E7EB]" : ""
                      }`}
                    >
                      <div className="relative inline-block w-full max-w-[175px]">
                        <div className="absolute left-0 top-0 h-[42px] w-[27px] bg-[#F9FAFB] rounded-l-lg border border-r-0 border-[#D1D5DB] flex items-center justify-center">
                          <span className="text-sm font-medium text-[#111827]">
                            $
                          </span>
                        </div>
                        <input
                          type="number"
                          value={bill.approvedAmount || ""}
                          disabled
                          placeholder="0"
                          onChange={(e) => {
                            const value = e.target.value;
                            // Only allow numbers and decimal point
                            if (value === "" || /^\d*\.?\d*$/.test(value)) {
                              formProps?.handleBillChange(
                                index,
                                "approvedAmount",
                                parseFloat(value) || 0
                              );
                            }
                          }}
                          onKeyDown={(e) => {
                            // Prevent 'e', 'E', '+', '-' characters
                            if (
                              e.key === "e" ||
                              e.key === "E" ||
                              e.key === "+" ||
                              e.key === "-"
                            ) {
                              e.preventDefault();
                            }
                          }}
                          className="w-full pl-[35px] pr-[14px] py-[10px] border border-[#D1D5DB] rounded-lg bg-white text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#1F87FF] focus:border-[#1F87FF]"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </td>
                  )}
                  {/* Attachments */}
                  <td
                    className={`py-4 px-6 ${
                      !isLastRow ? "border-b border-[#E5E7EB]" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-2 items-center">
                      <div className="flex items-center justify-center">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={(e) =>
                              formProps?.handleFileChange(index, e.target.files)
                            }
                            className="hidden"
                          />
                          {formProps?.Link && (
                            <formProps.Link
                              size={28}
                              className="text-[#1F87FF] hover:text-[#0066DD]"
                            />
                          )}
                        </label>
                      </div>
                      {/* Preview Images */}
                      {formProps?.previewImages?.[index] &&
                        formProps.previewImages[index].length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formProps.previewImages[index].map(
                              (preview, imgIndex) => (
                                <div key={imgIndex} className="relative">
                                  <img
                                    src={preview.url}
                                    alt={preview.name}
                                    className="w-16 h-16 object-cover rounded-md border border-gray-300"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      formProps?.removeImage?.(index, imgIndex)
                                    }
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                  >
                                    ×
                                  </button>
                                  <p className="text-xs text-gray-500 mt-1 truncate w-16">
                                    {preview.name}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  </td>
                  {/* Add Bill Button */}
                  {dataTable.length > 0 && (
                    <td
                      className={`py-4 whitespace-nowrap text-center px-2 w-[60px] ${
                        !isLastRow ? "border-b border-[#E5E7EB]" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => formProps?.duplicateBill?.(index)}
                        className="cursor-pointer p-1 hover:bg-blue-50 rounded transition-colors flex items-center justify-center"
                        title="Duplicate bill"
                      >
                        {formProps?.PlusSquare && (
                          <formProps.PlusSquare
                            size={20}
                            weight="bold"
                            className="text-[#1F87FF]"
                          />
                        )}
                      </button>
                    </td>
                  )}
                  {/* Delete Button */}
                  {dataTable.length > 1 && (
                    <td
                      className={`py-4 whitespace-nowrap text-center px-2 w-[60px] ${
                        !isLastRow ? "border-b border-[#E5E7EB]" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => formProps?.removeBill(index)}
                        className="cursor-pointer p-1 hover:bg-red-50 rounded transition-colors"
                        title="Delete bill"
                      >
                        {formProps?.Trash && (
                          <formProps.Trash
                            size={20}
                            className="text-[#1F87FF] hover:text-red-600"
                          />
                        )}
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
            {/* Add Another Bill Button Row */}
            <tr>
              <td
                colSpan={
                  dataHeaders?.length +
                  (dataTable?.length > 0 ? 1 : 0) +
                  (dataTable?.length > 1 ? 1 : 0)
                }
                className="pl-8 pr-6 py-4"
              >
                <button
                  type="button"
                  onClick={() => handleEdit?.addBill?.()}
                  className="flex items-center gap-2 text-[#1F87FF] hover:text-[#0066DD] text-sm font-medium"
                >
                  {handleEdit?.Plus &&
                    (() => {
                      const Plus = handleEdit.Plus;
                      return (
                        <Plus
                          size={20}
                          weight="bold"
                          className="text-[#1F87FF]"
                        />
                      );
                    })()}
                  <span>Add another bill</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      ) : tableFor === "epfContributionEmployeePortal" ? (
        /* EPF or SPK CONTRIBUTION EMPLOYEE PORTAL */
        <table className="min-w-full border-collapse">
          <thead className="bg-[#F5FAFF]">

            {/* Headers 1 hidden at the moment*/}
            {/* <tr>

              <th
                scope="col"
                className="pt-2 pb-2 pl-8 pr-4 text-left text-[14px] font-semibold uppercase tracking-[0.08em] text-[#1F87FF] border-b border-[#F5FAFF]"
              >
              Empty cell to align with Month position
              </th>
              
              Your Contribution - spans 2 columns (EPF, VPF)
              <th
                colSpan={2}
                scope="col"
                className="pt-2 pb-2 px-6 text-center text-[14px] font-semibold uppercase tracking-[0.08em] text-[#1F87FF] border-b border-[#F5FAFF]"
              >
                {objectHeaders.headers_1[0]}
              </th>
              
              Employer Contribution - spans 2 columns (EPF, EPS)
              <th
                colSpan={2}
                scope="col"
                className="pt-2 pb-2 px-6 text-center text-[14px] font-semibold uppercase tracking-[0.08em] text-[#1F87FF] border-b border-[#F5FAFF]"
              >
                {objectHeaders.headers_1[1]}
              </th>
            </tr> */}

            {/* Headers 2 */}
            <tr>
              {dataHeaders.map((el, idx) => {
                return (
                  <th
                    key={idx}
                    scope="col"
                    className={`pt-4 pb-4 px-12 ${idx === 0 ? 'text-left' : 'text-right'} text-base font-semibold uppercase tracking-[0.08em] text-[#1F87FF] border-b border-[#F5FAFF]`}
                  >
                    {el}
                  </th>
                );
              })}
            </tr>
            </thead>

            <tbody className="bg-white">
              {dataTable?.slice(1).map((row, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-12 pr-4 py-4 whitespace-nowrap text-base font-medium text-gray-700 text-left">
                    {row.month}
                  </td>
                  <td className="px-12 py-4 whitespace-nowrap text-base font-medium text-gray-700 text-right">
                    {row.yourSpkContribution}
                  </td>
                  <td className="px-12 py-4 whitespace-nowrap text-base font-medium text-gray-700 text-right">
                    {row.spkEmployerContribution}
                  </td>
                  <td className="px-12 py-4 whitespace-nowrap text-base font-medium text-gray-700 text-right">
                    {row.totalContribution}
                  </td>
                </tr>
              ))}
              
              {/* Total Row */}
              <tr className="bg-[#F5FAFF] border-t-2 border-[#1F87FF]/20 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <td className="px-12 pr-4 py-5 whitespace-nowrap text-base font-bold text-gray-900 text-left">
                  Total
                </td>
                <td className="px-12 py-5 whitespace-nowrap text-base font-bold text-gray-900 text-right">
                  {dataTable?.[0]?.yourSpkContribution}
                </td>
                <td className="px-12 py-5 whitespace-nowrap text-base font-bold text-gray-900 text-right">
                  {dataTable?.[0]?.spkEmployerContribution}
                </td>
                <td className="px-12 py-5 whitespace-nowrap text-base font-bold text-gray-900 text-right">
                  {dataTable?.[0]?.totalContribution}
                </td>
              </tr>
            </tbody>
            </table>
      ) :
      (
        <h1>What's table for?</h1>
      )}
    </div>
  );
}

export default TableReusable;
