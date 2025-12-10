import { useEffect, useState } from "react";
import { CaretDownIcon, Download, ArrowsClockwise, Funnel, WalletIcon } from "@phosphor-icons/react";
import employeePortalStoreManagements from "../../../../store/tdPayroll/employeePortal";
import dayjs from "dayjs";
import employeeStoreManagements from "../../../../store/tdPayroll/employee";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import TableReusable from "../../../component/setting/tableReusable";
import { epfContriButionHeaders, spkContributionDataDummy, spkContributionHeadersDummy, spkTotalDummy } from "../../../../../data/dummy";

function EpfContributionSumEmployeePortal() {
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

    // Generate Years sama seperti PayslipEmployeePortal (regular years, bukan financial years)
    const generateYears = () => {
        const currentYear = dayjs().year();
        const years = [];
        for (let i = 0; i < 5; i++) {
            years.push(currentYear - i);
        }
        return years;
    };

    const years = generateYears();
    const [selectedYear, setSelectedYear] = useState(years[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        getSalaryStructureEmployee(access_token, selectedYear);
    }, [selectedYear]);

    const handleYearChange = (year) => {
        setSelectedYear(year);
        setIsDropdownOpen(false);
        const access_token = localStorage.getItem("accessToken");
        getSalaryStructureEmployee(access_token, year);
    };

    // Helper function untuk menghitung SPK berdasarkan basic salary
    const calculateSPKContributions = (basicSalary) => {
        const basic = parseFloat(basicSalary) || 0;
        
        // SPK Employee Contribution (8.5% of basic wages)
        const spkEmployeeContribution = Math.round(basic * 0.085);
        
        // SPK Employer Contribution breakdown
        // EPF: 3.67% of basic wages (capped at certain limit)
        // EPS: 4.83% of basic wages (capped at ₹15,000)
        const epfEmployerContribution = Math.round(basic * 0.0367);
        const epsEmployerContribution = Math.round(Math.min(basic, 15000) * 0.0483);
        
        return {
            employee: spkEmployeeContribution,
            employerEPF: epfEmployerContribution,
            employerEPS: epsEmployerContribution,
            total: spkEmployeeContribution + epfEmployerContribution + epsEmployerContribution
        };
    };

    // Helper function to get month data by key
    const getMonthDataByKey = (monthKey) => {
        if (dataEmployeeAnnualEarning && Array.isArray(dataEmployeeAnnualEarning)) {
            const monthItem = dataEmployeeAnnualEarning.find(item => item[monthKey]);
            return monthItem ? monthItem[monthKey] : null;
        }
        return null;
    };

    // Generate monthly contribution data berdasarkan API data
    const generateMonthlyContributionData = () => {
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                          'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const monthlyData = [];
        
        if (dataEmployeeAnnualEarning && Array.isArray(dataEmployeeAnnualEarning)) {
            // Process actual data from API
            monthNames.forEach((monthKey, index) => {
                const monthData = getMonthDataByKey(monthKey);
                
                if (monthData && Object.keys(monthData).length > 0) {
                    const basicSalary = parseFloat(monthData.basicMonthly) || 0;
                    const spkContributions = calculateSPKContributions(basicSalary);
                    
                    monthlyData.push({
                        month: `${monthLabels[index]} ${selectedYear}`,
                        pfWages: basicSalary,
                        yourContribution: { 
                            epf: spkContributions.employee, 
                            vpf: 0.00 
                        },
                        employerContribution: { 
                            epf: spkContributions.employerEPF, 
                            eps: spkContributions.employerEPS 
                        },
                        totalContribution: spkContributions.total
                    });
                }
            });
        }

        // Fallback jika tidak ada data dari API
        if (monthlyData.length === 0) {
            // Sample data untuk Apr-Jul berdasarkan selected year
            const sampleMonths = [
                { month: `Apr ${selectedYear}`, basicSalary: 83333 },
                { month: `May ${selectedYear}`, basicSalary: 83333 },
                { month: `Jun ${selectedYear}`, basicSalary: 83333 },
                { month: `Jul ${selectedYear}`, basicSalary: 83333 }
            ];

            return sampleMonths.map(item => {
                const spkContributions = calculateSPKContributions(item.basicSalary);
                return {
                    month: item.month,
                    pfWages: item.basicSalary,
                    yourContribution: { 
                        epf: spkContributions.employee, 
                        vpf: 0.00 
                    },
                    employerContribution: { 
                        epf: spkContributions.employerEPF, 
                        eps: spkContributions.employerEPS 
                    },
                    totalContribution: spkContributions.total
                };
            });
        }

        return monthlyData;
    };

    // Calculate totals dari monthly data
    const calculateTotalsFromMonthly = (monthlyData) => {
        return monthlyData.reduce((acc, item) => ({
            pfWages: acc.pfWages + item.pfWages,
            yourContribution: {
                epf: acc.yourContribution.epf + item.yourContribution.epf,
                vpf: acc.yourContribution.vpf + item.yourContribution.vpf
            },
            employerContribution: {
                epf: acc.employerContribution.epf + item.employerContribution.epf,
                eps: acc.employerContribution.eps + item.employerContribution.eps
            },
            totalContribution: acc.totalContribution + item.totalContribution
        }), {
            pfWages: 0,
            yourContribution: { epf: 0, vpf: 0 },
            employerContribution: { epf: 0, eps: 0 },
            totalContribution: 0
        });
    };

    // Generate data
    const monthlyData = generateMonthlyContributionData();
    const totals = calculateTotalsFromMonthly(monthlyData);

    // Summary data berdasarkan totals
    const summaryData = {
        totalContribution: totals.totalContribution,
        totalEmployerContribution: totals.employerContribution.epf + totals.employerContribution.eps,
        yourTotalContribution: totals.yourContribution.epf + totals.yourContribution.vpf
    };

    // Statutory details - bisa diambil dari employee data
    const statutoryDetails = {
        pfAccountNumber: "-", // TODO: ambil dari employee data jika ada
        uan: "-" // TODO: ambil dari employee data jika ada
    };

    const formatCurrency = (amount) => {
        return `$${amount.toLocaleString()}.00`;
    };

    const handleDownloadPayslip = async () => {
        setDownloading(true);
        try {
            // Cari element dengan data-epf-content
            const epfElement = document.querySelector('[data-epf-content]');
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

    const formattedSpkContributionData = spkContributionDataDummy.map(item => {
        const yourSpkContribution = formatCurrency(item.yourSpkContribution)
        const spkEmployerContribution = formatCurrency(item.spkEmployerContribution)
        const totalContribution = formatCurrency(item.totalContribution)
        return {
            month: item.month,
            yourSpkContribution: yourSpkContribution,
            spkEmployerContribution: spkEmployerContribution,
            totalContribution: totalContribution
        }
    })


    if (loading) {
        return (
            <div className="w-full h-full bg-white flex items-center justify-center">
                <div className="text-gray-500">Loading EPF contribution data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full bg-white flex items-center justify-center">
                <div className="text-red-500">Error loading EPF contribution data: {error}</div>
            </div>
        );
    }

    return (
        <div
            className="
                flex flex-col
                w-full h-full"
        >   

            {/* Header Light Blue Bg */}
            <div
                className="
                    w-full flex-shrink-0
                    flex flex-col items-center justify-start
                    p-8 gap-8"
                style={{ backgroundColor: "#f7faff" }}
            >
                {/* First Row */}
                <div
                    className="
                        flex
                        w-full h-1/3
                        gap-[20px]
                        "
                >

                    {/* Title */}
                    <div
                        className="
                            flex flex-row items-center justify-start
                            flex-shrink-0"
                    >
                        <h3
                            className="
                            text-xl font-medium text-gray-600 uppercase tracking-wider
                            whitespace-nowrap"
                        >
                            SPK Contribution Summary
                        </h3>
                    </div>

                    {/* Year Dropdown */}
                    <div 
                    className="
                        flex items-center
                        border-l-2 border-gray-300
                        flex-shrink-0
                        pl-[20px] gap-2"
                    >   
                        {/* Filter Icon */}
                        <Funnel size={16} className="text-gray-600" />

                        {/* Financial Year */}
                        <span className="text-sm text-gray-600 whitespace-nowrap">Financial Year :</span>
                        
                        {/* Year Range */}
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                <span>{selectedYear}</span>
                                <CaretDownIcon
                                    size={16}
                                    className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full right-0 mt-1 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                    <div className="py-1">
                                        {years.map((year) => (
                                            <button
                                                key={year}
                                                onClick={() => handleYearChange(year)}
                                                className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${selectedYear === year
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
                    
                    {/* Download Button - Takes remaining space */}
                    <div
                        className="
                        flex items-center justify-end
                        flex-grow
                        h-full"
                    >   
                        <button 
                            onClick={handleDownloadPayslip}
                            disabled={downloading}
                            className={`
                                ${downloading
                                ? 'text-gray-600 cursor-not-allowed'
                                : 'text-blue-500 hover:text-blue-600'
                                } 
                                flex items-center
                                text-sm
                                gap-2`}>
                            <Download size={16} />
                            <span>{downloading ? 'Generating...' : 'Download'}</span>
                        </button>
                    </div>

                </div>

                {/* Second Row */}
                <div
                    className="
                        flex
                        w-full h-full
                        gap-[20px]
                        "
                >
                    {/* Total Contribution */}
                    <div 
                        className="
                            flex flex-row items-center justify-center
                            gap-2"
                    >
                        {/* Wallet Icon With Circle*/}
                        <div className="flex items-center space-x-3"
                            
                        >
                            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                                <WalletIcon size={16} className="text-blue-600" />
                            </div>
                        </div>

                        {/* Total Contribution Amount */}
                        <div
                            className="flex flex-col items-start"
                            
                        >
                            <div>
                                <p className="text-base text-gray-600">Total Contribution</p>
                            </div>
                            <div className="text-2xl font-semibold text-gray-900">
                                {formatCurrency(summaryData.totalContribution)}
                            </div>
                        </div>
                    </div>
                    
                    {/* Total Employer Contribution */}
                    <div
                        className="
                            flex flex-row items-center justify-center
                            gap-2"
                    >
                        <div
                            className="
                                flex flex-col items-start
                                border-l-2 border-gray-300
                                pl-4 gap-2"
                        >

                            {/* Total Employer Contribution */}
                            <div
                                className="
                                    flex flex-row items-start justify-center
                                    gap-2"
                            >
                                <p className="text-base text-gray-600">Total Employer Contribution:</p>
                                <div className="text-base font-semibold text-gray-900">
                                    {formatCurrency(summaryData.totalEmployerContribution)}
                                </div>
                            </div>

                            {/* Your Total Contribution */}
                             <div
                                className="
                                    flex flex-row items-start justify-center
                                    gap-2"
                            >
                                <p className="text-base text-gray-600">Your Total Contribution:</p>
                                <div className="text-base font-semibold text-gray-900">
                                    {formatCurrency(summaryData.yourTotalContribution)}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Statutory Details */}
            <div
                className="
                    w-full flex-shrink-0
                    flex flex-row justify-start
                    pl-8 pt-4 pb-8"
            >
                {/* Total Employer Contribution */}
                <div
                    className="
                            flex flex-row items-center justify-start
                            w-1/2
                            p-4 gap-16
                            border-2 border-gray-200 rounded-md"
                >
                    <div
                        className="
                                flex flex-col items-start
                                border-l-4 border-gray-300
                                pl-2"
                    >

                        <p className="text-base text-gray-600">STATUTORY</p>
                        <p className="text-base text-gray-600">DETAILS</p>

                    </div>

                    <div
                        className="
                                flex flex-col items-start"
                    >

                        <p className="text-base text-gray-600">PF Account Number</p>
                        <p className="text-base text-gray-600">{statutoryDetails.pfAccountNumber}</p>

                    </div>

                    <div
                        className="
                                flex flex-col items-start"
                    >

                        <p className="text-base text-gray-600">UAN</p>
                        <p className="text-base text-gray-600">{statutoryDetails.uan}</p>

                    </div>

                </div>
            </div>

            {/* Main Content */}
            <div 
                className="
                    flex flex-col
                    w-full flex-grow
                    overflow-hidden"
            >
                {/* TABLE */}
                <TableReusable
                    dataHeaders={spkContributionHeadersDummy}
                    dataTable={
                        [
                            // {
                            //     formattedTotalYourContributionEpf: formatCurrency(totals.yourContribution.epf),
                            //     formattedTotalYourContributionVpf: formatCurrency(totals.yourContribution.vpf),
                            //     formattedTotalEmployerContributionEpf: formatCurrency(totals.employerContribution.epf),
                            //     formattedTotalEmployerContributionEps: formatCurrency(totals.employerContribution.eps),
                            // },
                            // ...monthlyData.map(item => {
                            //     const formattedYourContributionEpf = formatCurrency(item.yourContribution.epf);
                            //     const formattedYourContributionVpf = formatCurrency(item.yourContribution.vpf);
                            //     const formattedEmployerContributionEpf = formatCurrency(item.employerContribution.epf);
                            //     const formattedEmployerContributionEps = formatCurrency(item.employerContribution.eps);
                            //     return {
                            //         month: item.month,
                            //         yourContributionEpf: formattedYourContributionEpf,
                            //         yourContributionVpf: formattedYourContributionVpf,
                            //         employerContributionEpf: formattedEmployerContributionEpf,
                            //         employerContributionEps: formattedEmployerContributionEps
                            //     }
                            // })
                            {   
                                yourSpkContribution: formatCurrency(spkTotalDummy.yourSpkContribution),
                                spkEmployerContribution: formatCurrency(spkTotalDummy.spkEmployerContribution),
                                totalContribution: formatCurrency(spkTotalDummy.totalContribution),
                            },
                            ...formattedSpkContributionData
                            
                             
                            
                        ]
                    }
                    tableFor={"epfContributionEmployeePortal"}
                // handleEdit={handleEdit}
                />

                
                    {/* Empty State */}
                    {monthlyData.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-500">
                                <p className="text-lg font-medium">No EPF contribution data found</p>
                                <p className="text-sm mt-1">No EPF contribution data available for the selected year.</p>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
}

export default EpfContributionSumEmployeePortal;