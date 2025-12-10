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
            {!isLoanEmployeePortal ?(<div className="w-full flex items-center justify-between border-b border-gray-200 bg-white"
        >
                <div className="p-4 h-16 w-[23.9%] flex items-center justify-between border-r">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-sm font-medium text-gray-700">All {loanLabelPlural}</h2>
                        <CaretDown size={16} className="text-gray-500" />
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
            </div>) :
                (
                    <div className="w-full flex items-center justify-between border-b border-gray-200 bg-white"
                    >

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
            <div className="w-full flex-1 flex overflow-y-auto bg-gray-td-300 p-5 overflow-hidden">
                <div className="w-full flex h-full bg-white rounded-xl overflow-hidden">
                    {/* Left Sidebar */}
                    <div className="w-[23.5%] border-r border-gray-200 flex flex-col">    
                        {/* Employee Filter - UPDATED */}
                        <div className="p-3 border-b border-gray-200 flex-shrink-0 relative">
                            <button
                                onClick={() => setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen)}
                                className="w-full flex items-center justify-between space-x-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 p-2 rounded-md transition-colors"
                            >
                                <div className="flex items-center space-x-2">
                                    <User />
                                    <span className="truncate">{getSelectedEmployeeInfo()}</span>
                                </div>
                                <CaretDown 
                                    size={12} 
                                    className={`text-gray-400 transition-transform ${isEmployeeDropdownOpen ? 'rotate-180' : ''}`} 
                                />
                            </button>
                            
                            {/* Employee Dropdown */}
                            {isEmployeeDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                                    {/* All Employees Option */}
                                    <button
                                        onClick={() => handleEmployeeSelect("all")}
                                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 border-b border-gray-100 ${
                                            selectedEmployeeUuid === "all" || !selectedEmployeeUuid ? 'bg-blue-td-50 text-blue-td-600' : 'text-gray-700'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>All Employees</span>
                                            <span className="text-xs text-gray-500">({dataList?.length || 0} {loanLabelLowercase}s)</span>
                                        </div>
                                    </button>
                                    
                                    {/* Individual Employee Options */}
                                    {employeeOptions.map((employee) => (
                                        <button
                                            key={employee.uuid}
                                            onClick={() => handleEmployeeSelect(employee.uuid)}
                                            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                                                selectedEmployeeUuid === employee.uuid ? 'bg-blue-td-50 text-blue-td-600' : 'text-gray-700'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">{employee.name}</div>
                                                    <div className="text-xs text-gray-500">{employee.employeeId}</div>
                                                </div>
                                                <span className="text-xs text-gray-500">({employee.loanCount} {loanLabelLowercase}s)</span>
                                            </div>
                                        </button>
                                    ))}
                                    
                                    {employeeOptions.length === 0 && (
                                        <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                            No employees found
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {/* Filter Info */}
                        {selectedEmployeeUuid && selectedEmployeeUuid !== "all" && (
                            <div className="px-3 py-2 bg-blue-td-50 border-b border-gray-200 flex-shrink-0">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-blue-td-600">Filtered by employee</span>
                                    <button
                                        onClick={() => handleEmployeeSelect("all")}
                                        className="text-blue-td-600 hover:text-blue-td-800 font-medium"
                                    >
                                        Clear filter
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* Loan Items - Scrollable - FILTERED */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredDataList.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 text-sm">
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
                                            className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 text-left ${el?.uuid === tempUuid ? "bg-blue-td-50 border-l-4 border-blue-td-500" : ""}`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {`${el?.Employee?.firstName} ${el?.Employee?.middleName} ${el?.Employee?.lastName}`} ({el?.Employee?.employeeId})
                                                </span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {formatCurrency(el?.loanAmount)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-600">
                                                <div className="flex items-center space-x-2">
                                                    <span>{el?.LoanName?.name}</span>
                                                    <span>|</span>
                                                    <span>{el?.loanNumber}</span>
                                                </div>
                                                <span className="text-blue-td-500 px-2 py-1 rounded text-xs font-medium">
                                                    {el?.loanAmount - el?.amountRepaid === 0 ? "Close" : "Open"}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Main Content - Same as before */}
                    <div className="w-full flex flex-col min-h-0 flex-1">
                        <div className="flex-1 overflow-y-auto p-5 space-y-10">
                            <div className="w-full grid grid-cols-4 auto-rows-[170px] gap-3">
                                {/* ini span 2 row */}
                                <div className="bg-[#FFE2B8] rounded-2xl row-span-2 flex items-center justify-center flex-col space-y-5">
                                    <div className="w-40 h-40 rounded-full bg-[#FFF3E0] flex items-center justify-center text-6xl font-medium">
                                    {loanData?.employeeName?.charAt(0).toUpperCase()}
                                    </div>
                                    <h1 className="text-2xl font-bold capitalize">{loanData?.employeeName}</h1>
                                    <p className="text-2xl font-normal">{data?.LoanName?.name}</p>
                                </div>

                                <div className="bg-gray-td-50 flex p-12 flex-col rounded-tl-2xl">
                                    <h2 className="text-gray-td-400 font-medium text-lg text-left">{loanLabel} Amount</h2>
                                    <h2 className="font-normal text-4xl text-left">
                                        {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        }).format(data?.loanAmount ?? 0)}
                                    </h2>
                                </div>
                                <div className="bg-gray-td-50 flex p-12 flex-col rounded-tr-2xl">
                                    <h2 className="text-gray-td-400 font-medium text-lg text-left">Remaining Amount</h2>
                                    <h2 className="font-normal text-4xl text-left text-red-td-500">
                                        {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        }).format((data?.loanAmount ?? 0) - (data?.amountRepaid ?? 0))}
                                    </h2>
                                </div>
                                <div className="bg-gray-td-50 flex p-12 flex-col">
                                    <div className="w-full flex items-center justify-start space-x-2">
                                        <h2 className="text-gray-td-400 font-medium text-base text-left">Instalment(s) Remaining</h2>
                                        <Info className="mt-1" size={20} />
                                    </div>
                                    <h2 className="font-normal text-4xl text-left">
                                        {loanPaymentHistory?.paymentSchedule 
                                            ? loanPaymentHistory.paymentSchedule.filter(el => el?.status === "paid").length 
                                            : 0
                                        } / {data?.paidOffInstalment + (
                                            loanPaymentHistory?.paymentSchedule 
                                            ? loanPaymentHistory.paymentSchedule.filter(el => el?.status === "paid").length 
                                            : 0
                                        )}
                                    </h2>
                                </div>
                                <div className="bg-gray-td-50 flex p-12 flex-col rounded-bl-2xl">
                                    <h2 className="text-gray-td-400 font-medium text-lg text-left">Instalment Amount</h2>
                                    <h2 className="font-normal text-4xl text-left">
                                        {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        }).format(data?.instalmentAmount ?? 0)}
                                    </h2>
                                </div>

                                {/* ini span 2 kolom */}
                                <div className="bg-gray-td-50 col-span-2 flex p-12 flex-col rounded-br-2xl relative">
                                    <div className="flex-1">
                                        <h2 className="text-gray-td-400 font-medium text-lg text-left">Amount Prepaid</h2>
                                        <h2 className="font-normal text-4xl text-left text-green-td-400">
                                            {new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            }).format(data?.amountRepaid ?? 0)}
                                        </h2>
                                        <p className="text-gray-td-400">
                                            Next Instalment Date: <span className="text-black">{loanData?.nextInstalmentDate}</span>
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center justify-center absolute right-0 top-1/5">
                                        {/* Semicircle Progress Diagram */}
                                        <div className="relative">
                                            <svg
                                                width="200"
                                                height="120"
                                                viewBox="0 0 200 120"
                                                className="transform"
                                            >
                                                {/* Background semicircle */}
                                                <path
                                                    d="M 20 100 A 80 80 0 0 1 180 100"
                                                    fill="none"
                                                    stroke="#e5e7eb"
                                                    strokeWidth="16"
                                                    strokeLinecap="round"
                                                />
                                                
                                                {/* Progress semicircle */}
                                                <path
                                                    d="M 20 100 A 80 80 0 0 1 180 100"
                                                    fill="none"
                                                    stroke="#f97316"
                                                    strokeWidth="16"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${Math.PI * 80}`}
                                                    strokeDashoffset={`${Math.PI * 80 * (1 - (
                                                        ((data?.amountRepaid || 0) / (data?.loanAmount || 1)) || 0
                                                    ))}`}
                                                    className="transition-all duration-1000 ease-out"
                                                />
                                            </svg>
                                            
                                            {/* Percentage text in center */}
                                            <div className="absolute inset-0 flex items-end justify-center pb-4">
                                                <span className="text-3xl font-bold text-gray-900">
                                                    {Math.round(((data?.amountRepaid || 0) / (data?.loanAmount || 1)) * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="w-full flex flex-col items-start justify-start space-y-5">
                                <h1 className="text-xl font-normal">{loanLabel} Repayment Summary</h1>
                                <div className="w-full flex flex-col items-start justify-start">
                                    <div className="w-1/4 h-40 bg-[#D9FBEA] rounded-xl">
                                        <div className="w-full h-1/2 flex items-center justify-between p-5">
                                            <p>{disbursementLabel} Date</p>
                                            <p>{loanData?.disbursementDate}</p>
                                        </div>
                                        <div className="w-full h-0.5 bg-white"></div>
                                        <div className="w-full h-1/2 flex items-center justify-between p-5">
                                            <p>{disbursementLabel} Date</p>
                                            <p>
                                                {dayjs(data?.disbursementDate)
                                                    .add(data?.paidOffInstalment ?? 0, "month")
                                                    .format("DD/MM/YYYY")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* table history */}
                            <div className="w-full h-fit p-5">
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
                        <div className="w-full flex h-full bg-white rounded-xl overflow-hidden">

                            {/* Main Content - Same as before */}
                            <div className="w-full flex flex-col min-h-0 flex-1">
                                <div className="flex-1 overflow-y-auto p-5 space-y-10">
                                    
                                    {/* Dashboard or Chart Section */}
                                    <div className="w-full flex gap-3">
                                        
                                        {/* Left side - Pie Chart Container*/}
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

                                        {/* Right side - Grid of cards */}
                                        <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-3">
                                            
                                            {/* Row 1 - Three cards */}
                                            
                                            {/* Loan Amount */}
                                            <div className="bg-gray-td-50 flex flex-col justify-center p-6 rounded-tl-2xl">
                                                <h2 className="text-gray-td-400 font-normal text-sm mb-1">{loanLabel} Amount</h2>
                                                <h2 className="text-gray-td-400 font-normal text-3xl">
                                                    {new Intl.NumberFormat("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                    }).format(data?.loanAmount ?? 0)}
                                                </h2>
                                            </div>

                                            {/* Remaining Amount */}
                                            <div className="bg-gray-td-50 flex flex-col justify-center p-6">
                                                <h2 className="text-gray-td-400 font-normal text-sm mb-1">Remaining Amount</h2>
                                                <h2 className="text-red-td-400 font-normal text-3xl">
                                                    {new Intl.NumberFormat("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                    }).format((data?.loanAmount ?? 0) - (data?.amountRepaid ?? 0))}
                                                </h2>
                                            </div>

                                            {/* Instalments Remaining */}
                                            <div className="bg-gray-td-50 flex flex-col justify-center p-6 rounded-tr-2xl">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h2 className="text-gray-td-400 font-normal text-sm mb-1">Instalment(s) Remaining</h2>
                                                    <Info size={16} className="text-gray-td-400" />
                                                </div>
                                                <h2 className="text-gray-td-400 font-normal text-3xl">
                                                    {loanPaymentHistory?.paymentSchedule
                                                        ? loanPaymentHistory.paymentSchedule.filter(el => el?.status === "paid").length
                                                        : 0}
                                                    <span className="text-gray-td-400 font-normal text-xl"> / {data?.paidOffInstalment}</span>
                                                </h2>
                                            </div>

                                            {/* Row 2 - Two cards */}
                                            
                                            {/* Instalment Amount */}
                                            <div className="bg-gray-td-50 flex flex-col justify-center p-6 rounded-bl-2xl">
                                                <h2 className="text-gray-td-400 font-normal text-sm mb-1">Instalment Amount</h2>
                                                <h2 className="text-gray-td-400 font-normal text-3xl">
                                                    {new Intl.NumberFormat("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                    }).format(data?.instalmentAmount ?? 0)}
                                                </h2>
                                            </div>

                                            {/* Amount Prepaid - Spans 2 columns */}
                                            <div className="bg-gray-td-50 col-span-2 flex flex-col justify-center p-6 rounded-br-2xl">                                               
                                                <h2 className="text-gray-td-400 font-normal text-sm mb-1">Amount Prepaid</h2>
                                                <h2 className="text-green-td-400 font-normal text-3xl">
                                                    {new Intl.NumberFormat("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                    }).format(data?.amountRepaid ?? 0)}
                                                </h2>
                                                <h2 className="text-gray-td-400 font-normal text-sm mt-1">
                                                    Next Instalment Date: <span className="text-black">{loanData?.nextInstalmentDate}</span>
                                                </h2>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full flex flex-col items-start justify-start space-y-5">
                                        <h1 className="text-xl font-normal">{loanLabel} Repayment Summary</h1>
                                        <div className="w-full flex flex-col items-start justify-start">
                                            <div className="w-1/4 h-40 bg-[#D9FBEA] rounded-xl">
                                                <div className="w-full h-1/2 flex items-center justify-between p-5">
                                                    <p>{disbursementLabel} Date</p>
                                                    <p>{loanData?.disbursementDate}</p>
                                                </div>
                                                <div className="w-full h-0.5 bg-white"></div>
                                                <div className="w-full h-1/2 flex items-center justify-between p-5">
                                                    <p>{disbursementLabel} Date</p>
                                                    <p>
                                                        {dayjs(data?.disbursementDate)
                                                            .add(data?.paidOffInstalment ?? 0, "month")
                                                            .format("DD/MM/YYYY")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* table history */}
                                    <div className="w-full h-fit p-5">
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
            )}

            <Modal
                isOpen={showModalRecordPayment}
                contentLabel="Full Screen Modal"
                ariaHideApp={false}
                style={{
                    overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1000,
                    },
                    content: {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: "none",
                    backgroundColor: "transparent",
                    padding: 0,
                    margin: 0,
                    overflow: "hidden",
                    },
                }}>
                <FormModal
                    setShowModal={setShowModalRecordPayment} 
                    formFor="recordPaymentLoan"
                    titleForm="Record Repayment"
                    data={data}
                />
            </Modal>

            <Modal
                isOpen={modalPauseLoans}
                contentLabel="Full Screen Modal"
                ariaHideApp={false}
                style={{
                    overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1000,
                    },
                    content: {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: "none",
                    backgroundColor: "transparent",
                    padding: 0,
                    margin: 0,
                    overflow: "hidden",
                    },
                }}>
                <FormModal
                    setShowModal={setModalPauseLoans} 
                    formFor="pauseLoans"
                    titleForm="pauseLoans"
                    data={tempUuid}
                />
            </Modal>

            <Modal
                isOpen={showModalConfirm}
                contentLabel="Full Screen Modal"
                ariaHideApp={false}
                style={{
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1000,
                },
                content: {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: "none",
                    backgroundColor: "transparent",
                    padding: 0,
                    margin: 0,
                    overflow: "hidden",
                },
            }}>
            <SimpleModalMessage
                setShowModal={setShowModalConfirm} 
                showModal={showModalConfirm}
                message={`Are you sure you want to delete ${data?.LoanName?.name} ${loanLabelLowercase} for ${loanData?.employeeName}?`}
                isDelete={true}
                modalFor={"loan"}
                handleConfirm={handleDelete}
            />
            </Modal>
        </div>
    );
}

export default LoanDetail;