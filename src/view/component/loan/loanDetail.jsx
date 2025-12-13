import { CaretDown, Plus, X, Calendar, Info, ClipboardText, CurrencyCircleDollar, DotsThree, User } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Modal from "react-modal";
import FormModal from "../formModal";
import TableReusable from "../setting/tableReusable";
import { loanDetailHeaders } from "../../../../data/dummy";
import loanStoreManagements from "../../../store/tdPayroll/loan";
import SimpleModalMessage from "../simpleModalMessage";
import { CustomToast } from "../customToast";
import { toast } from "react-toastify";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

function LoanDetail({setShowDetail, setShowFormLoans, data, dataList, tempUuid, handleView, setIsUpdate, setSelectedLoanData, isAdvance, loanNameUuid, isLoanEmployeePortal = false}) {
    const { getLoanByUuid, loanPaymentHistory, getLoan, deleteLoans } = loanStoreManagements();
    const [loanData, setLoanData] = useState({
        loanNumber: "",
        status: "",
        employeeName: "",
        employeeCode: "",
        loanType: "",
        loanAmount: null,
        instalmentAmount: null,
        progressPercentage: null,
        nextInstalmentDate: "",
        disbursementDate: "",
        perquisiteRate: null,
        loanClosingDate: "",
        reason: "",
        amountRepaid: null,
        remainingAmount: null,
        instalmentsRemaining: null
    });
    const [openMenu, setOpenMenu] = useState(false);
    const [modalPauseLoans, setModalPauseLoans] = useState(false);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [showModalRecordPayment, setShowModalRecordPayment] = useState(false);
    
    // NEW: Employee filter state
    const [selectedEmployeeUuid, setSelectedEmployeeUuid] = useState("");
    const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);

    // Pie Chart State
    const [pieChartData, setPieChartData] = useState([]);

    const loanLabel = isAdvance ? "Advance Salary" : "Loan";
    const disbursementLabel = isAdvance ? "Adv. Payment" : "Disbursement";
    const loanLabelPlural = isAdvance ? "Advance Salaries" : "Loans";
    const loanLabelLowercase = isAdvance ? "advance salary" : "loan";

    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        getLoanByUuid(access_token, data?.uuid, "loan-payment");
    }, [data?.uuid])
    
    useEffect(() => {
        setLoanData({
            loanNumber: data?.loanNumber,
            status: data?.loanAmount - data?.amountRepaid === 0 ? "Close" : "Open",
            employeeName: `${data?.Employee?.firstName} ${data?.Employee?.middleName} ${data?.Employee?.lastName}`,
            employeeCode: data?.Employee?.employeeId,
            loanType: data?.LoanName?.name,
            loanAmount: data?.loanAmount,
            instalmentAmount: data?.instalmentAmount,
            progressPercentage: Math.floor((data?.amountRepaid / data?.loanAmount) * 100),
            nextInstalmentDate: dayjs(data?.deductionStartDate).format("DD/MM/YYYY"),
            disbursementDate: dayjs(data?.disbursementDate).format("DD/MM/YYYY"),
            perquisiteRate: data?.perquisiteRate,
            loanClosingDate: dayjs(data?.deductionStartDate)
                .add(data?.paidOffInstalment ?? 0, "month")
                .format("DD/MM/YYYY"),
            reason: data?.reason,
            amountRepaid: data?.amountRepaid,
            remainingAmount: data?.loanAmount - data?.amountRepaid,
            instalmentsRemaining: data?.paidOffInstalment
        })

        setPieChartData([
            { 
                name: 'Amount Repaid', 
                value: Number(data?.amountRepaid || 100), 
                color: isAdvance ? '#38dab8' : '#ffb85c' 
            },
            { 
                name: 'Remaining Amount', 
                value: (data?.loanAmount - data?.amountRepaid) || 200, 
                color: '#9ca3af' }
        ]);
    }, [data])

    const formatCurrency = (amount) => {
        return `$${amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    };

    // NEW: Generate unique employee options from dataList
    const getEmployeeOptions = () => {
        if (!dataList) return [];
        
        const uniqueEmployees = dataList.reduce((acc, loan) => {
            const employeeKey = loan.Employee?.employeeUuid || loan.employeeUuid;
            if (!acc.find(emp => emp.uuid === employeeKey)) {
                acc.push({
                    uuid: employeeKey,
                    name: `${loan.Employee?.firstName || ""} ${loan.Employee?.middleName || ""} ${loan.Employee?.lastName || ""}`.trim(),
                    employeeId: loan.Employee?.employeeId || "",
                    loanCount: dataList.filter(l => l.employeeUuid === employeeKey).length
                });
            }
            return acc;
        }, []);
        
        return uniqueEmployees.sort((a, b) => a.name.localeCompare(b.name));
    };

    // NEW: Filter dataList based on selected employee
    const getFilteredDataList = () => {
        if (!selectedEmployeeUuid || selectedEmployeeUuid === "all") {
            return dataList;
        }
        return dataList?.filter(loan => loan.employeeUuid === selectedEmployeeUuid) || [];
    };

    // NEW: Handle employee selection
    const handleEmployeeSelect = (employeeUuid) => {
        setSelectedEmployeeUuid(employeeUuid);
        setIsEmployeeDropdownOpen(false);
    };

    // NEW: Get selected employee info
    const getSelectedEmployeeInfo = () => {
        if (!selectedEmployeeUuid || selectedEmployeeUuid === "all") {
            return "All Employees";
        }
        const employeeOptions = getEmployeeOptions();
        const selected = employeeOptions.find(emp => emp.uuid === selectedEmployeeUuid);
        return selected ? `${selected.name} (${selected.employeeId})` : "Select an Employee";
    };

    const handleRecordRepayment = () => {
        setShowModalRecordPayment(true);
    };

    const handleShowForm = (type) => {
        if(type === "pause"){
            setModalPauseLoans(true);
        }else if(type === "delete"){
            setShowModalConfirm(true);
        }else{
            setShowFormLoans(true);
            setIsUpdate(true);
        }
    };

    const handleDelete = async () => {
        const access_token = localStorage.getItem("accessToken");
        const response = await deleteLoans(access_token, "loans-detail", data.uuid);
        if (response) {
            const params = {
                limit: 10, 
                page: 1,
                isSalaryAdvance: isAdvance, 
                loanNameUuid
            };
            await getLoan(access_token, "loan", params);
            await getLoan(access_token, "card-loan");
            toast(<CustomToast message={response} status={"success"} />, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                style: {
                    background: 'transparent',
                    boxShadow: 'none',
                    padding: 0
                }
            });
            setShowModalConfirm(false);
            setShowDetail(false);
        }
    };

    const employeeOptions = getEmployeeOptions();
    const filteredDataList = getFilteredDataList();

    return (
        <div className="w-full flex-col h-screen bg-gray-50 flex">
            {!isLoanEmployeePortal ? (
                <div className="w-full flex items-center justify-between border-b border-gray-200 bg-white">
                    <div className="p-4 h-16 w-[23.9%] flex items-center justify-between border-r bg-[#1C1C1C]">
                        <div className="flex items-center space-x-2">
                            <h2 className="text-xs font-normal text-[#ADADAD]">All {loanLabelPlural}</h2>
                            <CaretDown size={16} className="text-[#ADADAD]" />
                        </div>
                        <button onClick={setShowFormLoans} className="w-8 h-8 rounded bg-blue-td-500 flex items-center justify-center hover:bg-blue-td-600">
                            <Plus size={16} className="text-white" />
                        </button>
                    </div>

                    {/* Header */}
                    <div className="p-4 w-full h-16 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <h1 className="text-lg font-medium text-gray-900">{loanData.loanNumber}</h1>
                            <span className="bg-blue-td-500 text-white px-2 py-1 rounded text-xs font-medium">
                                {loanData.status}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={handleRecordRepayment}
                                className="bg-blue-td-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-td-600"
                            >
                                Record Repayment
                            </button>
                            <div className="relative">
                                <button onClick={() => setOpenMenu(!openMenu)} className="p-2 border hover:bg-gray-100 rounded">
                                    <DotsThree size={20} className="text-gray-500" />
                                </button>
                                {openMenu && (
                                    <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                                        <button
                                            onClick={() => {
                                                handleShowForm("edit");
                                                setOpenMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-td-700 hover:bg-blue-50 hover:border-l-4 hover:border-blue-td-500 flex items-center"
                                        >
                                            Edit {loanLabel}
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleShowForm("pause");
                                                setOpenMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-td-700 hover:bg-blue-50 hover:border-l-4 hover:border-blue-td-500 flex items-center"
                                        >
                                            Pause Instalment Deduction
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleShowForm("delete");
                                                setOpenMenu(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-td-700 hover:bg-blue-50 hover:border-l-4 hover:border-blue-td-500 flex items-center"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full flex items-center justify-between border-b border-gray-200 bg-white">
                    {/* Header */}
                    <div className="p-4 w-full h-16 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <h1 className="text-lg font-medium text-gray-900">{loanData.loanNumber}</h1>
                            <span className="bg-blue-td-500 text-white px-2 py-1 rounded text-xs font-medium">
                                {loanData.status}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {!isLoanEmployeePortal ? (
                
                <div className="w-full flex-1 flex overflow-y-auto bg-white-td-300 p-5 overflow-hidden">
                    <div className="w-full flex h-full bg-white rounded-xl overflow-hidden">
                        {/* Left Sidebar - DARK THEME */}
                        <div className="w-[24.5%] bg-[#fffefe] flex flex-col">    
                            {/* Header Section */}
                            <div className="px-4 py-7 bg-[#1C1C1C] flex-shrink-0 rounded-t-lg">
                                <h2 className="text-l font-normal text-[#a9a9a9f3] uppercase tracking-wide">EMPLOYEE LIST</h2>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto scrollbar-verythin scrollbar-thumb-gray-300 scrollbar-track-gray-200 max-h-[600px]">

                                {filteredDataList.length === 0 ? (
                                    <div className="p-4 text-center text-gray-900 text-sm">
                                        {selectedEmployeeUuid && selectedEmployeeUuid !== "all" 
                                            ? `No ${loanLabelLowercase}s found for selected employee`
                                            : `No ${loanLabelLowercase}s available`
                                        }
                                    </div>
                                ) : (
                                    filteredDataList.map((el, idx) => {
                                        return(
                                            <button 
                                                onClick={() => handleView(el?.uuid, loanLabelPlural, loanLabelLowercase)} 
                                                key={el?.uuid} 
                                                className={`w-full p-4 border-b border-white hover:bg-gray-100 text-left transition-colors ${el?.uuid === tempUuid ? "bg-gray-100 border-l-4 border-blue-td-500" : ""}`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-normal text-black">
                                                        {`${el?.Employee?.firstName} ${el?.Employee?.middleName} ${el?.Employee?.lastName}`} ({el?.Employee?.employeeId})
                                                    </span>
                                                    <span className="text-sm font-semibold text-black">
                                                        {formatCurrency(el?.loanAmount)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center space-x-2 text-gray-400">
                                                        <span>{el?.LoanName?.name}</span>
                                                        <span>|</span>
                                                        <span>{el?.loanNumber}</span>
                                                    </div>
                                                    <span className="bg-blue-td-100 text-blue-td-600 px-2 py-1 rounded text-xs font-normal">
                                                        {el?.loanAmount - el?.amountRepaid === 0 ? "Close" : "Open"}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>

                            {/* Scrollbar Indicator */}
                           
                        </div>

                        {/* Main Content */}
                        <div className="w-full flex flex-col min-h-0 flex-1">
                            <div className="flex-1 overflow-y-auto p-5 space-y-10">
                                <div className="w-full grid grid-cols-4 auto-rows-[130px] gap-3">
                                    {/* Employee Card - spans 2 rows */}
                                    <div className="bg-[#FFE2B8] rounded-2xl row-span-2 flex items-center justify-center flex-col space-y-5">
                                        <div className="w-30 h-30 rounded-full bg-[#FFF3E0] flex items-center justify-center text-6xl font-normal text-[#FF8800]">
                                            {loanData?.employeeName?.charAt(0).toUpperCase()}
                                        </div>
                                        <h1 className="text-xl font-medium capitalize text-[#1C1C1C]">{loanData?.employeeName}</h1>
                                        <p className="text-sm font-normal text-[#1C1C1C99]">{data?.LoanName?.name}</p>
                                    </div>

                                    {/* Loan Amount */}
                                    <div className="bg-white-td-50 flex p-8 flex-col rounded-tl-2xl border border-white-200">
                                        <h2 className="text-gray-td-400 font-normal text-xs mb-2">{loanLabel} Amount</h2>
                                        <h2 className="font-normal text-2xl text-[#1C1C1C]">
                                            {new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            }).format(data?.loanAmount ?? 0)}
                                        </h2>
                                    </div>

                                    {/* Remaining Amount */}
                                    <div className="bg-white-td-50 flex p-8 flex-col border border-gray-200">
                                        <h2 className="text-gray-td-400 font-normal text-xs mb-2">Remaining Amount</h2>
                                        <h2 className="font-normal text-2xl text-red-600">
                                            {new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            }).format((data?.loanAmount ?? 0) - (data?.amountRepaid ?? 0))}
                                        </h2>
                                    </div>

                                    {/* Instalments Remaining */}
                                    <div className="bg-white-td-50 flex p-8 flex-col rounded-tr-2xl border border-gray-200">
                                        <div className="w-full flex items-center justify-start space-x-2 mb-2">
                                            <h2 className="text-gray-td-400 font-normal text-xs">Instalment(s) Remaining</h2>
                                            <Info size={14} className="text-gray-td-400" />
                                        </div>
                                        <h2 className="font-normal text-3xl text-[#1C1C1C]">
                                            {loanPaymentHistory?.paymentSchedule 
                                                ? loanPaymentHistory.paymentSchedule.filter(el => el?.status === "paid").length 
                                                : 0
                                            } <span className="text-xl">/ {data?.paidOffInstalment}</span>
                                        </h2>
                                    </div>

                                    {/* Instalment Amount */}
                                    <div className="bg-white-td-50 flex p-8 flex-col rounded-bl-2xl border border-gray-200">
                                        <h2 className="text-gray-td-400 font-normal text-xs mb-2">Instalment Amount</h2>
                                        <h2 className="font-normal text-2xl text-[#1C1C1C]">
                                            {new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            }).format(data?.instalmentAmount ?? 0)}
                                        </h2>
                                    </div>

                                    {/* Amount Prepaid - spans 2 columns */}
                                    <div className="bg-white-td-50 col-span-2 flex p-8 flex-col rounded-br-2xl relative border border-gray-200">
                                        <div className="flex-1">
                                            <h2 className="text-gray-td-400 font-normal text-xs mb-2">Amount Prepaid</h2>
                                            <h2 className="font-normal text-2xl text-[#0FA38B]">
                                                {new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                }).format(data?.amountRepaid ?? 0)}
                                            </h2>
                                            <p className="text-xs text-gray-td-400 mt-2">
                                                Next Instalment Date: <span className="text-black">{loanData?.nextInstalmentDate}</span>
                                            </p>
                                        </div>
                                        
                                        {/* Progress Circle */}
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2">
                                            <div className="relative w-32 h-20">
                                                <svg width="160" height="88" viewBox="0 0 160 88" className="transform">
                                                    {/* Background semicircle */}
                                                    <path
                                                        d="M 20 80 A 60 60 0 0 1 140 80"
                                                        fill="none"
                                                        stroke="#F6FFFB"
                                                        strokeWidth="16"
                                                        strokeLinecap="round"
                                                    />
                                                    {/* Progress semicircle */}
                                                    <path
                                                        d="M 20 80 A 60 60 0 0 1 140 80"
                                                        fill="none"
                                                        stroke="#0FA38B"
                                                        strokeWidth="16"
                                                        strokeLinecap="round"
                                                        strokeDasharray={`${Math.PI * 60}`}
                                                        strokeDashoffset={`${Math.PI * 60 * (1 - ((data?.amountRepaid || 0) / (data?.loanAmount || 1)))}`}
                                                        className="transition-all duration-1000"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-end justify-center pb-2">
                                                    <span className="text-2xl font-semibold text-gray-900">
                                                        {Math.round(((data?.amountRepaid || 0) / (data?.loanAmount || 1)) * 100)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Table History */}
                                <div className="w-full">
                                    <TableReusable 
                                        dataHeaders={loanDetailHeaders} 
                                        tableFor="loanDetails" 
                                        dataTable={loanPaymentHistory?.paymentSchedule ? loanPaymentHistory?.paymentSchedule : []}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full flex-1 flex overflow-y-auto bg-gray-td-100 p-5 overflow-hidden">
                    <div className="w-full flex h-full bg-black rounded-xl overflow-hidden">
                        {/* Main Content - Employee Portal View */}
                        <div className="w-full flex flex-col min-h-0 flex-1">
                            <div className="flex-1 overflow-y-auto p-5 space-y-10">
                                {/* Dashboard Section */}
                                <div className="w-full flex gap-3">
                                    {/* Pie Chart */}
                                    <div className="flex items-center justify-center bg-gray-td-50 rounded-lg p-8 flex-shrink-0">
                                        <div className="relative w-48 h-48">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={pieChartData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={50}
                                                        outerRadius={90}
                                                        paddingAngle={2}
                                                        dataKey="value"
                                                        startAngle={90}
                                                        endAngle={-270}
                                                    >
                                                        {pieChartData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-2xl font-semibold text-gray-900">
                                                    {Math.round(((data?.amountRepaid || 0) / (data?.loanAmount || 1)) * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Grid of cards */}
                                    <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-3">
                                        {/* Loan Amount */}
                                        <div className="bg-gray-td-50 flex flex-col justify-center p-6 rounded-tl-2xl">
                                            <h2 className="text-gray-td-400 font-normal text-xs mb-1">{loanLabel} Amount</h2>
                                            <h2 className="text-gray-td-400 font-normal text-2xl">
                                                {new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                }).format(data?.loanAmount ?? 0)}
                                            </h2>
                                        </div>

                                        {/* Remaining Amount */}
                                        <div className="bg-gray-td-50 flex flex-col justify-center p-6">
                                            <h2 className="text-gray-td-400 font-normal text-xs mb-1">Remaining Amount</h2>
                                            <h2 className="text-red-td-400 font-normal text-2xl">
                                                {new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                }).format((data?.loanAmount ?? 0) - (data?.amountRepaid ?? 0))}
                                            </h2>
                                        </div>

                                        {/* Instalments Remaining */}
                                        <div className="bg-gray-td-50 flex flex-col justify-center p-6 rounded-tr-2xl">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h2 className="text-gray-td-400 font-normal text-xs">Instalment(s) Remaining</h2>
                                                <Info size={14} className="text-gray-td-400" />
                                            </div>
                                            <h2 className="text-gray-td-400 font-normal text-2xl">
                                                {loanPaymentHistory?.paymentSchedule
                                                    ? loanPaymentHistory.paymentSchedule.filter(el => el?.status === "paid").length
                                                    : 0}
                                                <span className="text-lg"> / {data?.paidOffInstalment}</span>
                                            </h2>
                                        </div>

                                        {/* Instalment Amount */}
                                                                               {/* Instalment Amount */}
                                        <div className="bg-gray-td-50 flex flex-col justify-center p-6 rounded-bl-2xl">
                                            <h2 className="text-gray-td-400 font-normal text-xs mb-1">
                                                Instalment Amount
                                            </h2>
                                            <h2 className="text-gray-td-400 font-normal text-2xl">
                                                {new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                }).format(data?.instalmentAmount ?? 0)}
                                            </h2>
                                        </div>

                                        {/* Amount Prepaid */}
                                        <div className="bg-gray-td-50 flex flex-col justify-center p-6">
                                            <h2 className="text-gray-td-400 font-normal text-xs mb-1">
                                                Amount Prepaid
                                            </h2>
                                            <h2 className="text-green-td-400 font-normal text-2xl">
                                                {new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                }).format(data?.amountRepaid ?? 0)}
                                            </h2>
                                        </div>

                                        {/* Next Instalment Date */}
                                        <div className="bg-gray-td-50 flex flex-col justify-center p-6 rounded-br-2xl">
                                            <h2 className="text-gray-td-400 font-normal text-xs mb-1">
                                                Next Instalment Date
                                            </h2>
                                            <h2 className="text-gray-td-400 font-normal text-lg">
                                                {loanData?.nextInstalmentDate}
                                            </h2>
                                        </div>
                                    </div>
                                </div>

                                {/* Loan Repayment Summary */}
                                <div className="w-full flex flex-col items-start justify-start space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <h1 className="text-base font-normal text-gray-600">
                                            {loanLabel} Repayment Summary
                                        </h1>
                                        <Info size={14} className="text-gray-600" />
                                    </div>

                                    {/* Disbursement & Closing Card */}
                                    <div className="w-full max-w-sm bg-[#D9FBEA] rounded-xl overflow-hidden">
                                        <div className="flex items-center justify-between px-5 py-4">
                                            <p className="text-sm">{disbursementLabel} Date</p>
                                            <p className="text-sm font-medium">
                                                {loanData?.disbursementDate}
                                            </p>
                                        </div>
                                        <div className="w-full h-px bg-white" />
                                        <div className="flex items-center justify-between px-5 py-4">
                                            <p className="text-sm">Loan Closing Date</p>
                                            <p className="text-sm font-medium">
                                                {loanData?.loanClosingDate}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Repayment Table */}
                                <div className="w-full">
                                    <TableReusable
                                        dataHeaders={loanDetailHeaders}
                                        tableFor="loanDetails"
                                        dataTable={
                                            loanPaymentHistory?.paymentSchedule
                                                ? loanPaymentHistory.paymentSchedule
                                                : []
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )}
        </div>
    );  
}
    export default LoanDetail;