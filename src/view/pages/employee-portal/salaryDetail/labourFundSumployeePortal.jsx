import { useEffect, useState } from "react";
import { CaretDownIcon, Download, ArrowsClockwise } from "@phosphor-icons/react";
import employeePortalStoreManagements from "../../../../store/tdPayroll/employeePortal";
import dayjs from "dayjs";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import employeeStoreManagements from "../../../../store/tdPayroll/employee";

function LabourFundSumployeePortal() {
    const { 
        getSalaryStructureEmployee, 
        dataEmployeeAnnualEarning,
        loading,
        error
    } = employeePortalStoreManagements();
    const { fetchEmployeePersonalDetail, dataEmployeePersonalDetail } = employeeStoreManagements();

    useEffect(() => {
        if(!dataEmployeePersonalDetail){
            const access_token = localStorage.getItem("accessToken");
            fetchEmployeePersonalDetail(access_token, null, "employee-portal");
        }
    }, []);

    // Generate Years
    const generateYears = () => {
        const currentYear = dayjs().year();
        const years = [];
        for (let i = 0; i < 5; i++) {
            years.push(`${currentYear - i} - ${(currentYear - i + 1).toString().slice(-2)}`);
        }
        return years;
    };

    const years = generateYears();
    const [selectedYear, setSelectedYear] = useState(years[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        const actualYear = parseInt(selectedYear.split(' - ')[0]);
        getSalaryStructureEmployee(access_token, actualYear);
    }, [selectedYear]);

    const handleYearChange = (year) => {
        setSelectedYear(year);
        setIsDropdownOpen(false);
        const access_token = localStorage.getItem("accessToken");
        const actualYear = parseInt(year.split(' - ')[0]);
        getSalaryStructureEmployee(access_token, actualYear);
    };

    // Helper function untuk menghitung Labour Welfare Fund
    const calculateLabourWelfareFund = (monthData) => {
        // Labour Welfare Fund biasanya fixed amount per employee
        // Tamil Nadu: ₹20 per month untuk employee dengan salary > ₹15,000
        // Employee: ₹10, Employer: ₹10
        
        if (!monthData) return { employee: 0, employer: 0, total: 0 };
        
        // Calculate total monthly salary to check eligibility
        let totalMonthlySalary = 0;
        if (monthData.totalMonthly) {
            totalMonthlySalary = parseFloat(monthData.totalMonthly);
        } else {
            // Calculate from basic + allowances if totalMonthly not available
            if (monthData.basicMonthly) totalMonthlySalary += parseFloat(monthData.basicMonthly);
            if (monthData.fixedAllowanceMonthly) totalMonthlySalary += parseFloat(monthData.fixedAllowanceMonthly);
        }
        
        // If salary > ₹15,000, Labour Welfare Fund applies
        if (totalMonthlySalary > 15000) {
            return {
                employee: 10.00,
                employer: 10.00,
                total: 20.00
            };
        }
        
        return { employee: 0, employer: 0, total: 0 };
    };

    // Helper function to get month data by key
    const getMonthDataByKey = (monthKey) => {
        if (dataEmployeeAnnualEarning && Array.isArray(dataEmployeeAnnualEarning)) {
            const monthItem = dataEmployeeAnnualEarning.find(item => item[monthKey]);
            return monthItem ? monthItem[monthKey] : null;
        }
        return null;
    };

    // Generate monthly contribution data
    const generateMonthlyContributionData = () => {
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                          'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const actualYear = parseInt(selectedYear.split(' - ')[0]);
        const monthlyData = [];
        
        if (dataEmployeeAnnualEarning && Array.isArray(dataEmployeeAnnualEarning)) {
            monthNames.forEach((monthKey, index) => {
                const monthData = getMonthDataByKey(monthKey);
                
                if (monthData && Object.keys(monthData).length > 0) {
                    const lwfContributions = calculateLabourWelfareFund(monthData);
                    
                    monthlyData.push({
                        month: `${monthLabels[index]} ${actualYear}`,
                        yourContribution: lwfContributions.employee,
                        employerContribution: lwfContributions.employer,
                        totalContribution: lwfContributions.total
                    });
                }
            });
        }

        // Fallback sample data - all ₹0.00 as shown in image
        if (monthlyData.length === 0) {
            const sampleMonths = [
                { month: `Apr ${actualYear}` },
                { month: `May ${actualYear}` },
                { month: `Jun ${actualYear}` },
                { month: `Jul ${actualYear}` }
            ];

            return sampleMonths.map(item => ({
                month: item.month,
                yourContribution: 0.00,
                employerContribution: 0.00,
                totalContribution: 0.00
            }));
        }

        return monthlyData;
    };

    // Calculate totals
    const calculateTotalsFromMonthly = (monthlyData) => {
        return monthlyData.reduce((acc, item) => ({
            yourContribution: acc.yourContribution + item.yourContribution,
            employerContribution: acc.employerContribution + item.employerContribution,
            totalContribution: acc.totalContribution + item.totalContribution
        }), {
            yourContribution: 0,
            employerContribution: 0,
            totalContribution: 0
        });
    };

    // Generate data
    const monthlyData = generateMonthlyContributionData();
    const totals = calculateTotalsFromMonthly(monthlyData);

    // Summary data
    const summaryData = {
        totalContribution: totals.totalContribution,
        totalEmployerContribution: totals.employerContribution,
        yourTotalContribution: totals.yourContribution
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toFixed(2)}`;
    };

    const handleDownloadPayslip = async () => {
        setDownloading(true);
        try {
            const epfElement = document.querySelector('[data-labor-sum]');
            if (!epfElement) {
                alert("EPF content not found!");
                return;
            }

            // Backup styles
            const originalStyles = {
                width: epfElement.style.width,
                fontSize: epfElement.style.fontSize,
                transform: epfElement.style.transform,
                position: epfElement.style.position,
                zIndex: epfElement.style.zIndex,
                padding: epfElement.style.padding,
                backgroundColor: epfElement.style.backgroundColor
            };

            // Apply temporary styles for capture
            epfElement.style.width = '1200px';
            epfElement.style.fontSize = '16px';
            epfElement.style.transform = 'scale(1)';
            epfElement.style.position = 'relative';
            epfElement.style.zIndex = '9999';
            epfElement.style.padding = '10px';
            epfElement.style.backgroundColor = '#ffffff';

            // Backup & apply table styles
            const tables = epfElement.querySelectorAll('table');
            const originalTableStyles = [];
            tables.forEach((table, index) => {
                originalTableStyles[index] = {
                    width: table.style.width,
                    fontSize: table.style.fontSize
                };
                table.style.width = '100%';
                table.style.fontSize = '14px';
            });

            // Backup & apply text styles
            const textElements = epfElement.querySelectorAll('th, td, h3, p, span');
            const originalTextStyles = [];
            textElements.forEach((el, index) => {
                originalTextStyles[index] = el.style.fontSize;
                if (el.tagName === 'H3') {
                    el.style.fontSize = '24px';
                } else if (el.tagName === 'TH' || el.tagName === 'TD') {
                    el.style.fontSize = '14px';
                } else {
                    el.style.fontSize = '16px';
                }
            });

            // Wait sedikit biar style ter-apply
            await new Promise(resolve => setTimeout(resolve, 200));

            // Capture element ke canvas
            const canvas = await html2canvas(epfElement, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: 1200,
                height: epfElement.scrollHeight,
                windowWidth: 1200,
                windowHeight: 1200,
                x: 0,
                y: 0,
                logging: false
            });

            // Restore styles
            Object.keys(originalStyles).forEach(key => {
                epfElement.style[key] = originalStyles[key] || '';
            });
            tables.forEach((table, index) => {
                table.style.width = originalTableStyles[index]?.width || '';
                table.style.fontSize = originalTableStyles[index]?.fontSize || '';
            });
            textElements.forEach((el, index) => {
                el.style.fontSize = originalTextStyles[index] || '';
            });

            // Convert canvas to image
            const imgData = canvas.toDataURL('image/png', 1.0);

            // Setup PDF
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = 297;   // A4 landscape width
            const pageHeight = 210;  // A4 landscape height
            const padding = 10;      // 10mm padding

            // Available space after padding
            const pdfWidth = pageWidth - padding * 2;
            const pdfHeight = pageHeight - padding * 2;

            // Hitung scale image
            let finalWidth = pdfWidth;
            let finalHeight = (canvas.height * finalWidth) / canvas.width;

            if (finalHeight > pdfHeight) {
                finalHeight = pdfHeight;
                finalWidth = (canvas.width * finalHeight) / canvas.height;
            }

            // Posisi: center horizontal, padding top
            const x = (pageWidth - finalWidth) / 2;
            const y = padding;

            // Add image ke PDF
            pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

            // Filename
            const employeeName = dataEmployeePersonalDetail?.Employee?.firstName || 'Employee';
            const fileName = `EPF_Contribution_Summary_${selectedYear}_${employeeName.replace(/\s+/g, '_')}.pdf`;

            // Download
            pdf.save(fileName);

        } catch (error) {
            console.error(error);
            alert("Failed to download EPF summary. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-full bg-white flex items-center justify-center">
                <div className="text-gray-500">Loading Labour Welfare Fund data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full bg-white flex items-center justify-center">
                <div className="text-red-500">Error loading Labour Welfare Fund data: {error}</div>
            </div>
        );
    }

    return (
        <div className="w-[60%] h-full overflow-y-auto">
            <div className="p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-semibold text-gray-900">TN Labour Welfare Fund Summary</h1>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-blue-600">▼</span>
                            <span className="text-sm text-gray-600">Financial Year :</span>
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    <span>{selectedYear}</span>
                                    <CaretDownIcon 
                                        size={16} 
                                        className={`transition-transform duration-200 ${
                                            isDropdownOpen ? 'rotate-180' : ''
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
                                                            ? 'bg-blue-50 text-blue-600' 
                                                            : 'text-gray-700'
                                                    }`}
                                                >
                                                    {year}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleDownloadPayslip}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                        <Download size={16} />
                        <span>Export PDF</span>
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Total Contribution */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <ArrowsClockwise size={16} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Contribution</p>
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(summaryData.totalContribution)}
                        </div>
                    </div>

                    {/* Total Employer Contribution */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Total Employer Contribution : {formatCurrency(summaryData.totalEmployerContribution)}</p>
                        </div>
                    </div>

                    {/* Your Total Contribution */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Your Total Contribution : {formatCurrency(summaryData.yourTotalContribution)}</p>
                        </div>
                    </div>
                </div>

                {/* Monthly Contribution Table */}
                <div data-labor-sum className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Statutory Details */}
                    <div className="bg-white p-6 mb-6 space-y-10">
                        <h3 className="text-xl font-medium mb-4 uppercase tracking-wider">
                            TN Labour Welfare Fund Summary
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Total Employer Contribution */}
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Total Employer Contribution</p>
                                <div className="text-xl font-semibold text-gray-900">
                                    {formatCurrency(summaryData.totalEmployerContribution)}
                                </div>
                            </div>

                            {/* Your Total Contribution */}
                            <div className="">
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Your Total Contribution</p>
                                    <div className="text-xl font-semibold text-gray-900">
                                        {formatCurrency(summaryData.yourTotalContribution)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-center text-base font-medium uppercase tracking-wider border-x border-gray-200">
                                        Month
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-base font-medium uppercase tracking-wider border-x border-gray-200">
                                        Your Contribution
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-base font-medium uppercase tracking-wider border-x border-gray-200">
                                        Employer Contribution
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-base font-medium uppercase tracking-wider border-x border-gray-200">
                                        Total Contribution
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {monthlyData.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-5 whitespace-nowrap text-base font-medium text-gray-900">
                                            {row.month}
                                        </td>
                                        <td className="px-3 py-5 whitespace-nowrap text-base text-gray-900 text-center">
                                            {formatCurrency(row.yourContribution)}
                                        </td>
                                        <td className="px-3 py-5 whitespace-nowrap text-base text-gray-900 text-center">
                                            {formatCurrency(row.employerContribution)}
                                        </td>
                                        <td className="px-3 py-5 whitespace-nowrap text-base text-gray-900 text-center">
                                            {formatCurrency(row.totalContribution)}
                                        </td>
                                    </tr>
                                ))}
                                
                                {/* Total Row */}
                                <tr className="border-t-2 border-blue-200">
                                    <td className="px-6 py-5 whitespace-nowrap text-base font-bold text-gray-900">
                                        Total
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-base font-bold text-gray-900 text-center">
                                        {formatCurrency(totals.yourContribution)}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-base font-bold text-gray-900 text-center">
                                        {formatCurrency(totals.employerContribution)}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-base font-bold text-gray-900 text-center">
                                        {formatCurrency(totals.totalContribution)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {monthlyData.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500">
                                <p className="text-lg font-medium">No Labour Welfare Fund data found</p>
                                <p className="text-sm mt-1">No Labour Welfare Fund data available for the selected financial year.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LabourFundSumployeePortal;