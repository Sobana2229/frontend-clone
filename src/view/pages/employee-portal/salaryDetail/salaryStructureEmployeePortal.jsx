import { Info, Download } from "@phosphor-icons/react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import employeePortalStoreManagements from "../../../../store/tdPayroll/employeePortal";
import { useEffect } from "react";
import { calculateEPFBenefits } from "../../../../../helper/globalHelper";
import employeeStoreManagements from "../../../../store/tdPayroll/employee";
import statutoryComponentStoreManagements from "../../../../store/tdPayroll/setting/statutoryComponent";
import authStoreManagements from "../../../../store/tdPayroll/auth";
import HeaderReusable from "../../../component/setting/headerReusable";

function SalaryStructureEmployeePortal() {
    const { 
        getSalaryStructureEmployee, 
        dataEmployeeSalaryDetail,
        dataBasicSalaryComponent,
        dataReimbursementComponent,
        getPayslipEmployee,
        dataPayslipEmployee,
    } = employeePortalStoreManagements();
    const { fetchEmployeePersonalDetail, dataEmployeePersonalDetail } = employeeStoreManagements();
    const { fetchStatutoryComponent, statutoryComponentSpk } = statutoryComponentStoreManagements();
    const { user } = authStoreManagements();

    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        
        if(!dataEmployeePersonalDetail){
            fetchEmployeePersonalDetail(access_token, null, "employee-portal");
        }
        
        getSalaryStructureEmployee(access_token);
        
        if (user?.uuid && !statutoryComponentSpk) {
            fetchStatutoryComponent(access_token, "spk", user.uuid);
        }
    }, [user?.uuid]);

    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        const currentYear = new Date().getFullYear();
        getPayslipEmployee(access_token, currentYear, null, null);
    }, []);

    // Helper function to safely parse numbers
    const parseAmount = (value) => {
        return parseFloat(value || 0);
    };

    // Helper function to format currency
    const formatCurrency = (value) => {
        return parseAmount(value).toLocaleString('en-IN');
    };

    // Helper function to get component name by UUID with better error handling
    const getComponentName = (componentUuid, componentArray) => {
        if (!componentUuid || !componentArray) return null;
        
        if (Array.isArray(componentArray)) {
            const component = componentArray.find(item => item.uuid === componentUuid);
            return component?.name || component?.type || null;
        }
        
        if (componentArray.uuid === componentUuid) {
            return componentArray.name || componentArray.type || null;
        }
        
        return null;
    };

    // Calculate SPK Benefits dynamically
    const spkBenefits = calculateEPFBenefits(
        parseAmount(dataEmployeeSalaryDetail?.basicMonthly),
        statutoryComponentSpk,
        dataEmployeePersonalDetail
    );

    // Filter only employer costs (admin charges and employer contribution) - exclude employee
    const benefitsData = spkBenefits
        .filter(item => item.type === 'employer_cost')
        .map(item => ({
            name: item.name,
            amount: item.monthly
        }));

    const benefitsWithoutEmployee = spkBenefits
        .filter(item => item.type === 'employer_cost')
        .map(item => ({
            name: item.name,
            amount: item.monthly
        }));

    const totalBenefitsMonthly = benefitsWithoutEmployee.reduce((sum, item) => sum + item.amount, 0);

    // REIMBURSEMENTS: Pure reimbursements only (exclude FBP items) - dengan deduplication
    const reimbursementsData = Array.from(
        new Map(
            dataEmployeeSalaryDetail?.SalaryDetailComponents
                ?.filter(item => 
                    item.type === "Reimbursements" && 
                    parseAmount(item.amount) > 0 &&
                    item.SalaryComponentReimbursement?.markAsActiv === true
                )
                ?.map(item => [
                    item.salaryComponentReimbursementUuid,
                    {
                        name: item.SalaryComponentReimbursement?.nameInPaysl || "Reimbursement",
                        amount: parseAmount(item.amount),
                        hasInfo: true
                    }
                ]) || []
        ).values()
    );

    // Calculate reimbursements breakdown dengan data yang sudah deduplicated
    const reimbursementsBreakdown = reimbursementsData.reduce((sum, item) => sum + item.amount, 0);

    // Replace mock data with actual API data
    const basicMonthly = parseAmount(dataEmployeeSalaryDetail?.basicMonthly);
    const fixedAllowanceMonthly = parseAmount(dataEmployeeSalaryDetail?.fixedAllowanceMonthly);
    
    const salaryData = {
        monthlyCTC: parseAmount(dataEmployeeSalaryDetail?.totalMonthly),
        yearlyCTC: parseAmount(dataEmployeeSalaryDetail?.totalAnnual || dataEmployeeSalaryDetail?.annualCTC),
        breakdown: {
            earnings: basicMonthly + fixedAllowanceMonthly,
            reimbursements: reimbursementsBreakdown,
            benefits: totalBenefitsMonthly
        }
    };

    // Data untuk pie chart
    const pieChartData = [
        { name: 'Earnings', value: salaryData.breakdown.earnings, color: '#35d8b8' },
        { name: 'Reimbursements', value: salaryData.breakdown.reimbursements, color: '#7ab4fc' },
        { name: 'Benefits', value: salaryData.breakdown.benefits, color: '#febb65' }
    ];

    const mapEarningLabel = (label, monthlyAllowanceNames) => {
        if (!label) return "";
        const labelLower = label.toLowerCase();
        if (!monthlyAllowanceNames) return label;

        const directMatch = Object.entries(monthlyAllowanceNames).find(([, nameInPayslip]) => {
            if (!nameInPayslip) return false;
            const nameLower = nameInPayslip.toLowerCase();
            return (
                labelLower === nameLower ||
                labelLower.includes(nameLower) ||
                nameLower.includes(labelLower)
            );
        });

        if (directMatch) return directMatch[1];

        const fieldMatch = Object.keys(monthlyAllowanceNames).find((field) => {
            const fieldPattern = field
                .replace(/([A-Z])/g, " $1")
                .toLowerCase()
                .replace("monthly", "")
                .trim();
            return labelLower.includes(fieldPattern) || fieldPattern.includes(labelLower);
        });

        if (fieldMatch && monthlyAllowanceNames[fieldMatch]) {
            return monthlyAllowanceNames[fieldMatch];
        }

        return label;
    };

    // EARNINGS: use detailed earnings from latest payslip when available, fallback to Basic + Fixed Allowance summary
    let earningsData = [];

    const latestPayslip = Array.isArray(dataPayslipEmployee?.historicalPayslips)
        ? [...dataPayslipEmployee.historicalPayslips]
              .reverse()
              .find(
                  (p) =>
                      p.hasPayslip &&
                      Array.isArray(p.earnings) &&
                      p.earnings.length > 0
              )
        : null;

    const monthlyAllowanceNames = dataPayslipEmployee?.monthlyAllowanceNames || {};

    if (latestPayslip) {
        earningsData = latestPayslip.earnings
            .map((e) => ({
                name: mapEarningLabel(e.label || "", monthlyAllowanceNames),
                amount: parseAmount(e.amount),
            }))
            .filter((e) => e.amount > 0);
    } else {
        if (basicMonthly > 0) {
            earningsData.push({
                name:
                    getComponentName(
                        dataBasicSalaryComponent?.uuid,
                        [dataBasicSalaryComponent]
                    ) || "Basic",
                amount: basicMonthly,
                type: "Basic",
            });
        }

        if (fixedAllowanceMonthly > 0) {
            earningsData.push({
                name: "Fixed Allowance",
                amount: fixedAllowanceMonthly,
                type: "Fixed Allowance",
            });
        }
    }

    // Loading state
    if (!dataEmployeeSalaryDetail) {
        return (
            <div className="w-full h-full bg-white flex items-center justify-center">
                <div className="text-gray-500">Loading salary structure...</div>
            </div>
        );
    }

    return (
        <div 
            className="
                flex flex-col
                w-full h-full"
        >
            {/* Header */}
            {/* <HeaderReusable
                title={"Salary Structure"}
                isAddData={false}
            /> */}

            {/* Main Container */}
            <div className="
                flex flex-col
                w-full h-full
                overflow-y-auto"
                
            >

                {/* Sub Main Container (white bg rounded) */}
                <div className="
                flex flex-col
                w-full h-auto
                p-4 gap-2
                bg-white
                rounded-lg"
                
                >

                    {/* Header Section with Chart */}
                    <div 
                        className="
                            flex flex-col lg:flex-row items-center justify-center
                            gap-[4px]
                            bg-white"
                        
                    >
                        {/* Pie Chart Container Round (gray bg) */}
                        <div 
                            className="
                                    flex items-center justify-center
                                    w-1/4 lg:w-1/3 h-64
                                    rounded-lg
                                    bg-gray-td-100"
                            
                        >
                            {/* Pie Container Relative */}
                            <div className="
                                        relative 
                                        w-full 
                                        h-full"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={100}
                                            paddingAngle={2}
                                            startAngle={90}
                                            endAngle={-270}
                                            dataKey="value"
                                        >
                                            {pieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-medium text-gray-600 text-center leading-3">
                                        Salary<br />Breakup
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Numbers Container */}
                        <div 
                            className="
                                    flex flex-col items-start justify-center flex-grow
                                    h-auto lg:h-64
                                    bg-white
                                    gap-[4px]"
                            
                            
                        >
                            {/* First Row */}
                            <div className="
                                    flex flex-col sm:flex-row items-center justify-between 
                                    w-full h-auto sm:h-1/2
                                    gap-[4px] sm:gap-0"
                            >
                                {/* Breakdown Cards */}
                                <div className="
                                        flex flex-col sm:flex-row
                                        w-full h-full
                                        gap-[4px]"
                                >
                                    {/* Earnings */}
                                    <div className="flex flex-row items-center justify-between
                                        w-full h-24 sm:h-full
                                        bg-gray-td-100
                                        rounded-lg sm:rounded-tl-lg sm:rounded-tr-none sm:rounded-br-none sm:rounded-bl-none
                                        p-4"
                                    >
                                        <div className="
                                            border-l-4 border-[#35d8b8] bg-gray-td-100
                                            w-full h-3/4
                                            pl-2"
                                        >
                                            <div className="text-s text-gray-600">Earnings</div>
                                            <div className="text-2xl font-semibold text-gray-900">${formatCurrency(salaryData.breakdown.earnings)}.00</div>
                                        </div>
                                    </div>

                                    {/* Reimbursement */}
                                    <div className="flex flex-row items-center justify-between
                                        w-full h-24 sm:h-full
                                        bg-gray-td-100
                                        rounded-lg sm:rounded-none
                                        p-4"
                                    >
                                        <div className="
                                            border-l-4 border-[#7ab4fc] bg-gray-td-100
                                            w-full h-3/4
                                            pl-2"
                                        >
                                            <div className="text-s text-gray-600">Reimbursements</div>
                                            <div className="text-2xl font-semibold text-gray-900">${formatCurrency(salaryData.breakdown.reimbursements)}.00</div>
                                        </div>
                                    </div>

                                    {/* Benefits */}
                                    <div className="flex flex-row items-center justify-between
                                        w-full h-24 sm:h-full
                                        bg-gray-td-100
                                        rounded-lg sm:rounded-tr-lg sm:rounded-tl-none sm:rounded-br-none sm:rounded-bl-none
                                        p-4"
                                    >
                                        <div className="
                                            border-l-4 border-[#febb65] bg-gray-td-100
                                            w-full h-3/4
                                            pl-2"
                                        >
                                            <div className="text-s text-gray-600">Benefits</div>
                                            <div className="text-2xl font-semibold text-gray-900">${formatCurrency(salaryData.breakdown.benefits)}.00</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Second Row */}
                            {/* CTC Info */}
                            <div className="
                                    flex flex-col sm:flex-row items-start justify-between 
                                    w-full h-auto sm:h-1/2
                                    bg-gray-td-100
                                    rounded-b-lg
                                    p-4 gap-4 sm:gap-10"
                            >
                                {/* Monthly CTC */}
                                <div className="
                                        flex flex-col items-start justify-center
                                        w-full sm:w-1/3 h-full"
                                >
                                    <div className="text-s text-gray-600">Monthly CTC</div>
                                    <h2 className="text-2xl font-semibold text-gray-900">
                                        ${formatCurrency(salaryData.monthlyCTC)}.00
                                    </h2>
                                </div>

                                {/* Yearly CTC */}
                                <div className="
                                        flex flex-col items-start justify-center
                                        w-full sm:w-1/3 h-full"
                                >
                                    <div className="text-s text-gray-600">Yearly CTC</div>
                                    <h2 className="text-2xl font-semibold text-gray-900">
                                        ${formatCurrency(salaryData.yearlyCTC)}.00
                                    </h2>
                                </div>

                                <div className="
                                        flex flex-col items-start sm:items-end justify-start
                                        w-full sm:w-1/2 h-full"
                                >
                                    <button className="text-blue-500 hover:text-blue-600 flex items-center space-x-1 text-sm border-l-2 border-gray-td-100 ps-2">
                                        <Download size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content in Single Column Layout */}
                    <div
                        className="
                            flex flex-col items-center
                            w-full h-full"
                    >

                        {/* Container (rounded bordered) */}
                        <div
                            className="
                                flex flex-col
                                w-full
                                rounded-lg
                                border-l-gray-100 border-2
                                bg-white 
                                p-12 gap-[24px]"
                        >

                            {/* Earnings Section - Basic + Fixed Allowance */}
                            {earningsData.length > 0 && (
                                <div
                                    className="
                                        flex flex-col
                                        gap-[16px]"
                                    
                                >
                                    <h3
                                        className="text-lg font-semibold text-gray-900"
                                        
                                    > Earnings
                                    </h3>

                                    <div
                                        className="
                                            w-full grid grid-cols-1 md:grid-cols-1 gap-[16px]"
                                        
                                    >
                                        {earningsData.map((item, index) => (
                                            <div
                                                key={index}
                                                className="
                                                    flex justify-between items-center 
                                                    w-full"
                                                
                                            >
                                                <span className="text-lg text-gray-600">{item.name}</span>
                                                <span className="text-lg font-medium text-gray-900">${formatCurrency(item.amount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reimbursements Section - Pure Reimbursements Only */}
                            {reimbursementsData.length > 0 && (
                                <div
                                    className="
                                        flex flex-col
                                        gap-[16px]"
                                    
                                >
                                    <h3
                                        className="text-lg font-semibold text-gray-900"
                                        
                                    > Reimbursements
                                    </h3>

                                    <div
                                        className="
                                            w-full grid grid-cols-1 md:grid-cols-1 gap-[16px]"
                                        
                                    >
                                        {reimbursementsData.map((item, index) => (
                                            <div
                                                key={index}
                                                className="
                                                    flex justify-between items-center 
                                                    w-full"
                                                
                                            >
                                                <div
                                                    className="
                                                        flex flex-row items-center justify-center
                                                        gap-[4px]"
                                                    
                                                >
                                                    <span
                                                        className="text-lg text-gray-600"
                                                        
                                                    >
                                                        {item.name}
                                                    </span>
                                                    {item.hasInfo && (
                                                        <Info size={16} className="text-gray-400" />
                                                    )}
                                                </div>

                                                <span className="text-lg font-medium text-gray-900">${formatCurrency(item.amount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Benefits Section - Admin Charges + Employer SPK (no employee contribution) */}
                            {benefitsData.length > 0 && (
                                <div
                                    className="
                                        flex flex-col
                                        gap-[16px]"
                                    
                                >
                                    <h3
                                        className="text-lg font-semibold text-gray-900"
                                        
                                    > Benefits
                                    </h3>

                                    <div
                                        className="
                                            w-full grid grid-cols-1 md:grid-cols-1 gap-[16px]"
                                        
                                    >
                                        {benefitsData.map((item, index) => (
                                            <div
                                                key={index}
                                                className="
                                                    flex justify-between items-center 
                                                    w-full"
                                                
                                            >
                                                <span className="text-lg text-gray-600">{item.name}</span>
                                                <span className="text-lg font-medium text-gray-900">${formatCurrency(item.amount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Monthly CTC Total */}
                            <div
                                className="
                                        flex flex-row justify-center
                                        gap-[16px]
                                        border-t-2 border-b-2 border-gray-200
                                        pt-4 pb-4"
                                
                            >
                                <h3
                                    className="flex-1 text-center text-lg font-semibold text-gray-900"
                                    
                                > Monthly CTC
                                </h3>

                                <span className="text-lg font-medium text-gray-900">${formatCurrency(salaryData.monthlyCTC)}</span>

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default SalaryStructureEmployeePortal;
