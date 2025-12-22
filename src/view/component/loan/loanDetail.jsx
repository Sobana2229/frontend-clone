import { CaretDown, Plus, X, Calendar, Info, ClipboardText, CurrencyCircleDollar, DotsThree, User, } from "@phosphor-icons/react";
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
import { 
  Users2, 
  FileText, 
  Activity, 
  Hash, 
  PlusCircle, 
  MoreVertical 
} from "lucide-react";
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
    
    const [selectedEmployeeUuid, setSelectedEmployeeUuid] = useState("");
    const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);

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

    const getFilteredDataList = () => {
        if (!selectedEmployeeUuid || selectedEmployeeUuid === "all") {
            return dataList;
        }
        return dataList?.filter(loan => loan.employeeUuid === selectedEmployeeUuid) || [];
    };

    const handleEmployeeSelect = (employeeUuid) => {
        setSelectedEmployeeUuid(employeeUuid);
        setIsEmployeeDropdownOpen(false);
    };

    const getSelectedEmployeeInfo = () => {
        if (!selectedEmployeeUuid || selectedEmployeeUuid === "all") {
            return "Employee";
        }
        const employeeOptions = getEmployeeOptions();
        const selected = employeeOptions.find(emp => emp.uuid === selectedEmployeeUuid);
        return selected ? `${selected.name} (${selected.employeeId})` : "Employee";
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
        <div className="w-full flex-col h-screen bg-white flex pt-20 mt-3">
            <style>{`
                .scrollbar-verythin::-webkit-scrollbar {
                    width: 7px;
                    height: 7px;
                }
                .scrollbar-verythin::-webkit-scrollbar-track {
                    background: rgba(28, 28, 28, 0.05);
                    border-radius: 4px;
                }
                .scrollbar-verythin::-webkit-scrollbar-thumb {
                    background: rgba(28, 28, 28, 0.5);
                    border-radius: 4px;
                }
            `}</style>

            {!isLoanEmployeePortal ? (
                <div className="w-full border-collapse px-5">
      <div
    className="w-full bg-white rounded-lg border border-gray-200"
    style={{ height: '60px' }}
  >
    <div className="flex items-center justify-between h-full px-5">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium" style={{ color: 'rgba(28, 28, 28, 0.6)' }}>
                                FILTER BY :
                            </span>
                            <div className="relative">
                                <button 
                                    onClick={() => setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen)}
                                    className="flex items-center gap-2.5 px-3 py-1 hover:bg-gray-50 rounded"
                                >
                                    <User size={20} style={{ color: 'rgba(28, 28, 28, 0.4)' }} />
                                    <span className="text-sm font-medium" style={{ color: 'rgba(28, 28, 28, 0.5)' }}>
                                        {getSelectedEmployeeInfo()}
                                    </span>
                                    <CaretDown size={14} style={{ color: 'rgba(28, 28, 28, 0.5)' }} />
                                </button>
                                {isEmployeeDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border z-50 max-h-80 overflow-y-auto scrollbar-verythin">
                                        <button
                                            onClick={() => handleEmployeeSelect("all")}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                                        >
                                            All Employees
                                        </button>
                                        {employeeOptions.map((emp) => (
                                            <button
                                                key={emp.uuid}
                                                onClick={() => handleEmployeeSelect(emp.uuid)}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                                            >
                                                {emp.name} ({emp.employeeId})
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
    <button 
        onClick={handleRecordRepayment}
        className="flex items-center rounded font-medium"
        style={{ 
            height: '35px',
            background: '#0066FE',
            borderRadius: '5px',
            overflow: 'hidden'
        }}
    >
        <span className="px-4 text-white text-base">Repayment</span>
        <div 
            className="h-full flex items-center justify-center border-l"
            style={{ 
                width: '35px',
                borderLeftColor: 'rgba(255, 255, 255, 0.3)'
            }}
        >
            <div 
                className="rounded-full flex items-center justify-center"
                style={{
                    width: '20px',
                    height: '20px',
                    border: '1.5px solid white'
                }}
            >
                <Plus size={12} weight="bold" color="white" />
            </div>
        </div>
    </button>
    <div className="relative">
        <button 
            onClick={() => setOpenMenu(!openMenu)} 
            className="flex items-center justify-center rounded hover:bg-gray-50"
            style={{
                width: '35px',
                height: '35px',
                border: '1px solid rgba(28, 28, 28, 0.4)',
                borderRadius: '8px'
            }}
        >
     <MoreVertical size={20} className="text-neutral-600" />
        </button>
        {openMenu && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border overflow-hidden z-50">
                <button
                    onClick={() => {
                        handleShowForm("edit");
                        setOpenMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 hover:border-l-4 hover:border-blue-500"
                    style={{ color: '#1C1C1C' }}
                >
                    Edit {loanLabel}
                </button>
                <button
                    onClick={() => {
                        handleShowForm("pause");
                        setOpenMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 hover:border-l-4 hover:border-blue-500"
                    style={{ color: '#1C1C1C' }}
                >
                    Pause Instalment Deduction
                </button>
                <button
                    onClick={() => {
                        handleShowForm("delete");
                        setOpenMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 hover:border-l-4 hover:border-blue-500"
                    style={{ color: '#1C1C1C' }}
                >
                    Delete
                </button>
            </div>
        )}
    </div>
</div>
                    </div>
                </div>
                </div> 
            ) : (
                <div className="w-full flex items-center justify-between border-b border-gray-200 bg-white">
                    <div className="p-4 w-full h-16 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <h1 className="text-lg font-medium text-gray-900">{loanData.loanNumber}</h1>
                            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                                {loanData.status}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {!isLoanEmployeePortal ? (
                <div className="w-full flex-1 flex overflow-y-auto p-3 overflow-hidden" style={{ background: '#FFFFFF' }}>
                    <div className="w-full flex h-full bg-white rounded-xl overflow-hidden">
                        {/* Left Sidebar */}
                        <div className="flex flex-col" style={{ width: '24.5%', background: '#FFFFFF' }}>    
                            {/* Dark Header */}
                            <div className="flex-shrink-0 rounded-t-lg" style={{ 
                                padding: '28px 14px',
                                background: '#1C1C1C',
                                height: '91px'
                            }}>
                                <h2 className="text-xl font-medium tracking-wide" style={{ color: '#ADADAD' }}>
                                    EMPLOYEE LIST
                                </h2>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto scrollbar-verythin">
                                {filteredDataList.length === 0 ? (
                                    <div className="p-4 text-center text-sm" style={{ color: '#1C1C1C' }}>
                                        {selectedEmployeeUuid && selectedEmployeeUuid !== "all" 
                                            ? `No ${loanLabelLowercase}s found for selected employee`
                                            : `No ${loanLabelLowercase}s available`
                                        }
                                    </div>
                                ) : (
                                    filteredDataList.map((el) => {
                                        return(
                                            <button 
                                                onClick={() => handleView(el?.uuid, loanLabelPlural, loanLabelLowercase)} 
                                                key={el?.uuid} 
                                                className={`w-full border-b hover:bg-gray-50 text-left transition-colors ${
                                                    el?.uuid === tempUuid ? "bg-gray-50 " : ""
                                                }`}
                                                style={{ 
                                                    padding: '16px',
                                                    height: '70px',
                                                    borderBottom: '1px solid #FFFFFF',
                                                    borderLeftColor: el?.uuid === tempUuid ? '#0066FE' : 'transparent'
                                                }}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-normal" style={{ color: '#1C1C1C' }}>
                                                        {`${el?.Employee?.firstName} ${el?.Employee?.middleName} ${el?.Employee?.lastName}`} ({el?.Employee?.employeeId})
                                                    </span>
                                                    <span className="text-base font-semibold" style={{ color: '#1C1C1C' }}>
                                                        {formatCurrency(el?.loanAmount)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2" style={{ color: 'rgba(28, 28, 28, 0.6)' }}>
                                                        <span>{el?.LoanName?.name}</span>
                                                        <span>|</span>
                                                        <span>{el?.loanNumber}</span>
                                                    </div>
                                                    <span className="px-2 py-1 rounded text-xs font-normal" style={{
                                                        background: 'rgba(0, 102, 254, 0.1)',
                                                        color: 'rgba(0, 102, 254, 0.9)'
                                                    }}>
                                                        {el?.loanAmount - el?.amountRepaid === 0 ? "Close" : "Open"}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="w-full flex flex-col min-h-0 flex-1">
                            <div className="flex-1 px-5 space-y-6">
                                <div className="w-full grid grid-cols-4 gap-3" style={{ gridAutoRows: '130px' }}>
                                    {/* Employee Card - spans 2 rows */}
                                    <div className="row-span-2 flex items-center justify-center flex-col space-y-5 rounded-2xl" style={{ background: '#FFE2B8' }}>
                                        <div className="w-30 h-30 rounded-full flex items-center justify-center text-6xl font-normal" style={{
                                            width: '100px',
                                            height: '100px',
                                            background: '#FFF3E0',
                                            color: '#FF8800'
                                        }}>
                                            {loanData?.employeeName?.charAt(0).toUpperCase()}
                                        </div>
                                        <h1 className="text-xl font-medium capitalize" style={{ color: '#1C1C1C' }}>
                                            {loanData?.employeeName}
                                        </h1>
                                        <p className="text-sm font-normal" style={{ color: 'rgba(28, 28, 28, 0.6)' }}>
                                            {data?.LoanName?.name}
                                        </p>
                                    </div>

                                    {/* Loan Amount */}
                                    <div className="flex p-8 flex-col rounded-tl-2xl border" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
                                        <h2 className="text-xs mb-2 font-normal" style={{ color: 'rgba(28, 28, 28, 0.5)' }}>
                                            {loanLabel} Amount
                                        </h2>
                                        <h2 className="font-normal text-2xl" style={{ color: '#1C1C1C' }}>
                                            {new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            }).format(data?.loanAmount ?? 0)}
                                        </h2>
                                    </div>

                                    {/* Remaining Amount */}
                                    <div className="flex p-8 flex-col border" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
                                        <h2 className="text-xs mb-2 font-normal" style={{ color: 'rgba(28, 28, 28, 0.5)' }}>
                                            Remaining Amount
                                        </h2>
                                        <h2 className="font-normal text-2xl" style={{ color: '#DC2626' }}>
                                            {new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            }).format((data?.loanAmount ?? 0) - (data?.amountRepaid ?? 0))}
                                        </h2>
                                    </div>

                                    {/* Instalments Remaining */}
                                    <div className="flex p-8 flex-col rounded-tr-2xl border" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
                                        <div className="w-full flex items-center justify-start gap-2 mb-2">
                                            <h2 className="text-xs font-normal" style={{ color: 'rgba(28, 28, 28, 0.5)' }}>
                                                Instalment(s) Remaining
                                            </h2>
                                            <Info size={14} style={{ color: 'rgba(28, 28, 28, 0.5)' }} />
                                        </div>
                                        <h2 className="font-normal" style={{ fontSize: '30px', lineHeight: '38px', color: '#1C1C1C' }}>
                                            {loanPaymentHistory?.paymentSchedule 
                                                ? loanPaymentHistory.paymentSchedule.filter(el => el?.status === "paid").length 
                                                : 0
                                            } <span className="text-lg">/ {data?.paidOffInstalment}</span>
                                        </h2>
                                    </div>

                                    {/* Instalment Amount */}
                                    <div className="flex p-8 flex-col rounded-bl-2xl border" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
                                        <h2 className="text-xs mb-2 font-normal" style={{ color: 'rgba(28, 28, 28, 0.5)' }}>
                                            Instalment Amount
                                        </h2>
                                        <h2 className="font-normal text-2xl" style={{ color: '#1C1C1C' }}>
                                            {new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            }).format(data?.instalmentAmount ?? 0)}
                                        </h2>
                                    </div>

                                    {/* Amount Prepaid - spans 2 columns */}
                                    <div className="col-span-2 flex p-8 flex-col rounded-br-2xl relative border" style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}>
                                        <div className="flex-1">
                                            <h2 className="text-xs mb-2 font-normal" style={{ color: 'rgba(28, 28, 28, 0.5)' }}>
                                                Amount Prepaid
                                            </h2>
                                            <h2 className="font-normal text-2xl" style={{ color: '#0FA38B' }}>
                                                {new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                }).format(data?.amountRepaid ?? 0)}
                                            </h2>
                                            <p className="text-xs mt-2" style={{ color: 'rgba(28, 28, 28, 0.6)' }}>
                                                Next Instalment Date: <span style={{ color: '#1C1C1C' }}>{loanData?.nextInstalmentDate}</span>
                                            </p>
                                        </div>
                                        
                                        {/* Progress Circle */}
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2">
                                            <div className="relative" style={{ width: '160px', height: '88px' }}>
                                                <svg width="160" height="88" viewBox="0 0 160 88" className="transform">
                                                    <path
                                                        d="M 20 80 A 60 60 0 0 1 140 80"
                                                        fill="none"
                                                        stroke="#F6FFFB"
                                                        strokeWidth="16"
                                                        strokeLinecap="round"
                                                    />
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
                                                    <span className="text-2xl font-semibold" style={{ color: '#1C1C1C' }}>
                                                        {Math.round(((data?.amountRepaid || 0) / (data?.loanAmount || 1)) * 100)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Loan Repayment Summary Title */}
                                <div className="flex items-center ">
                                    <h2 className="text-base font-normal" style={{ color: 'rgba(28, 28, 28, 0.6)' }}>
                                        LOAN REPAYMENT SUMMARY
                                    </h2>
                                    <Info size={12} style={{ color: 'rgba(28, 28, 28, 0.6)' }} />
                                </div>

                                {/* Table */}
                                <div className="w-full  overflow-y-auto scrollbar-verythin">
                                    <div className="min-w-full overflow-y-auto scrollbar-verythin">
                                        {/* Table Header */}
                                        <div className="flex items-center rounded-t-lg overflow-y-auto scrollbar-verythin" style={{ 
                                            height: '50px',
                                            background: '#1C1C1C',
                                            padding: '0 15px'
                                        }}>
                                            <div style={{ width: '141px' }}>
                                                <span className="text-xs font-normal" style={{ color: '#ADADAD' }}>
                                                    INSTALMENT STATUS
                                                </span>
                                            </div>
                                            <div style={{ width: '185px', textAlign: 'right' }}>
                                                <span className="text-xs font-normal" style={{ color: '#ADADAD' }}>
                                                    INSTALMENT DATE
                                                </span>
                                            </div>
                                            <div style={{ width: '174px', textAlign: 'right' }}>
                                                <span className="text-xs font-normal" style={{ color: '#ADADAD' }}>
                                                    AMOUNT REPAID
                                                </span>
                                            </div>
                                            <div style={{ width: '215px', textAlign: 'right' }}>
                                                <span className="text-xs font-normal" style={{ color: '#ADADAD' }}>
                                                    TOTAL AMOUNT REPAID
                                                </span>
                                            </div>
                                            <div style={{ width: '199px', textAlign: 'right' }}>
                                                <span className="text-xs font-normal" style={{ color: '#ADADAD' }}>
                                                    REMAINING AMOUNT
                                                </span>
                                            </div>
                                        </div>

                                        {/* Table Body */}
                                        {/* Table Body */}
<div className="overflow-y-auto scrollbar-verythin" style={{ maxHeight: '400px' }}>
    {loanPaymentHistory?.paymentSchedule?.map((payment, idx) => {
                                            
                                                const isPaid = payment?.status === "paid";
                                                const isLast = idx === loanPaymentHistory.paymentSchedule.length - 1;
                                                
                                                return (
                                                    <div 
                                                        key={idx}
                                                        className="flex items-center relative "
                                                        style={{ 
                                                            height: '91px',
                                                            padding: '0 15px',
                                                            borderBottom: isLast ? 'none' : '1px dashed rgba(28, 28, 28, 0.1)'
                                                        }}
                                                    >
                                                        {/* Status */}
                                                        <div style={{ width: '141px' }} className="flex items-center gap-3">
                                                            <div className="relative flex items-center">
                                                                <div 
                                                                    className="rounded-full flex items-center justify-center"
                                                                    style={{
                                                                        width: '26px',
                                                                        height: '26px',
                                                                        background: isPaid ? '#0066FE' : 'transparent',
                                                                        border: isPaid ? 'none' : '1px solid rgba(28, 28, 28, 0.6)'
                                                                    }}
                                                                >
                                                                    {isPaid ? (
                                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                            <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                        </svg>
                                                                    ) : (
                                                                        <span className="text-base font-normal" style={{ color: 'rgba(28, 28, 28, 0.6)' }}>
                                                                            {idx + 1}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {/* Connecting Line */}
                                                                {!isLast && (
                                                                    <div 
                                                                        className="absolute left-1/2 -translate-x-1/2"
                                                                        style={{
                                                                            top: '26px',
                                                                            width: '1px',
                                                                            height: '45px',
                                                                            borderLeft: isPaid ? '1px solid #0066FE' : '1px dashed rgba(28, 28, 28, 0.2)'
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Date */}
                                                        <div style={{ width: '185px', textAlign: 'right' }}>
                                                            <span className="text-sm font-normal" style={{ color: 'rgba(28, 28, 28, 0.6)' }}>
                                                                {dayjs(payment?.date).format("DD/MM/YYYY")}
                                                            </span>
                                                        </div>

                                                        {/* Amount Repaid */}
                                                        <div style={{ width: '174px', textAlign: 'right' }}>
                                                            <span className="text-base font-normal" style={{ color: 'rgba(28, 28, 28, 0.6)' }}>
                                                                {new Intl.NumberFormat("en-US", {
                                                                    style: "currency",
                                                                    currency: "USD",
                                                                }).format(payment?.amountPaid ?? 0)}
                                                            </span>
                                                        </div>

                                                        {/* Total Amount Repaid */}
                                                        <div style={{ width: '215px', textAlign: 'right' }}>
                                                            <span className="text-base font-normal" style={{ color: 'rgba(28, 28, 28, 0.6)' }}>
                                                                {new Intl.NumberFormat("en-US", {
                                                                    style: "currency",
                                                                    currency: "USD",
                                                                }).format(payment?.totalAmountPaid ?? 0)}
                                                            </span>
                                                        </div>

                                                        {/* Remaining Amount */}
                                                        <div style={{ width: '199px', textAlign: 'right' }}>
                                                            <span className="text-base font-normal" style={{ color: '#DC2626' }}>
                                                                {new Intl.NumberFormat("en-US", {
                                                                    style: "currency",
                                                                    currency: "USD",
                                                                }).format(payment?.remainingAmount ?? 0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full flex-1 flex overflow-y-auto p-5 overflow-hidden" style={{ background: '#F9FAFB' }}>
                    <div className="w-full flex h-full bg-black rounded-xl overflow-hidden">
                        <div className="w-full flex flex-col min-h-0 flex-1">
                            <div className="flex-1 overflow-y-auto p-5 space-y-10">
                                <div className="w-full flex gap-3">
                                    <div className="flex items-center justify-center rounded-lg p-8 flex-shrink-0" style={{ background: '#FAFAFA' }}>
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

                                    <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-3">
                                        <div className="flex flex-col justify-center p-6 rounded-tl-2xl" style={{ background: '#FAFAFA' }}>
                                            <h2 className="text-xs mb-1 font-normal" style={{ color: 'rgba(28, 28, 28, 0.5)' }}>
                                                {loanLabel} Amount
                                            </h2>
                                            <h2 className="text-2xl font-normal" style={{ color: 'rgba(28, 28, 28, 0.5)' }}>
                                                {new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                }).format(data?.loanAmount ?? 0)}
                                            </h2>
                                        </div>

                                        <div className="flex flex-col justify-center p-6" style={{ background: '#FAFAFA' }}>
                                            <h2 className="text-xs mb-1 font-normal" style={{ color: 'rgba(28, 28, 28, 0.5)' }}>
                                                Remaining Amount
                                            </h2>
                                            <h2 className="text-2xl font-normal" style={{ color: '#DC2626' }}>
                                                {new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                }).format((data?.loanAmount ?? 0) - (data?.amountRepaid ?? 0))}
                                            </h2>
                                        </div>

                                        <div className="flex flex-col justify-center p-6 rounded-tr-2xl" style={{ background: '#FAFAFA' }}>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h2 className="text-xs font-normal" style={{ color: 'rgba(28, 28, 28, 0.5)' }}>
                                                    Instalment(s) Remaining
                                                </h2>
                                                <Info size={14} style={{ color: 'rgba(28, 28, 28, 0.5)' }} />
                                            </div>
                                            <h2 className="text-2xl font-normal" style={{ color: 'rgba(28, 28, 28, 0.5)' }}>
                                                {loanPaymentHistory?.paymentSchedule
                                                    ? loanPaymentHistory.paymentSchedule.filter(el => el?.status === "paid").length
                                                    : 0}
                                                <span className="text-lg"> / {data?.paidOffInstalment}</span>
                                            </h2>
                                        </div>

                                        <div className="flex flex-col justify-center p-6 rounded-bl-2xl" style={{ background: '#FAFAFA' }}>
                                            <h2 className="text-xs mb-1 font-normal" style={{ color: 'rgba(28, 28, 28, 0.5)' }}>
                                                Instalment Amount
                                            </h2>
                                            <h2 className="text-2xl font-normal" style={{ color: 'rgba(28, 28, 28, 0.5)' }}>
                                                {new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                }).format(data?.instalmentAmount ?? 0)}
                                            </h2>
                                        </div>

                                        <div className="flex flex-col justify-center p-6" style={{ background: '#FAFAFA' }}>
                                            <h2 className="text-xs mb-1 font-normal" style={{ color: 'rgba(28, 28, 28, 0.5)' }}>
                                                Amount Prepaid
                                            </h2>
                                            <h2 className="text-2xl font-normal" style={{ color: '#0FA38B' }}>
                                                {new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                }).format(data?.amountRepaid ?? 0)}
                                            </h2>
                                        </div>

                                        <div className="flex flex-col justify-center p-6 rounded-br-2xl" style={{ background: '#FAFAFA' }}>
                                            <h2 className="text-xs mb-1 font-normal" style={{ color: 'rgba(28, 28, 28, 0.5)' }}>
                                                Next Instalment Date
                                            </h2>
                                            <h2 className="text-lg font-normal" style={{ color: 'rgba(28, 28, 28, 0.5)' }}>
                                                {loanData?.nextInstalmentDate}
                                            </h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full flex flex-col items-start justify-start space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <h1 className="text-base font-normal text-gray-600">
                                            {loanLabel} Repayment Summary
                                        </h1>
                                        <Info size={14} className="text-gray-600" />
                                    </div>

                                    <div className="w-full max-w-sm rounded-xl overflow-hidden" style={{ background: '#D9FBEA' }}>
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

            {/* Modals */}
            {modalPauseLoans && (
                <Modal isOpen={modalPauseLoans} onRequestClose={() => setModalPauseLoans(false)}>
                    {/* Your pause modal content */}
                </Modal>
            )}
            {showModalConfirm && (
                <SimpleModalMessage
                    isOpen={showModalConfirm}
                    onClose={() => setShowModalConfirm(false)}
                    onConfirm={handleDelete}
                    message={`Are you sure you want to delete this ${loanLabelLowercase}?`}
                />
            )}
            {showModalRecordPayment && (
                <FormModal
                    isOpen={showModalRecordPayment}
                    onClose={() => setShowModalRecordPayment(false)}
                    type="recordPayment"
                    loanData={data}
                />
            )}
        </div>
    );  
}

export default LoanDetail;