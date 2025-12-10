import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { CaretDownIcon, CaretLeftIcon, CaretRightIcon, Funnel } from "@phosphor-icons/react";
import employeePortalStoreManagements from "../../../../store/tdPayroll/employeePortal";
import dayjs from "dayjs";
import TableReusable from "../../../component/setting/tableReusable";

/* biar bisa break ke bawah labalnya */
const CustomXAxisTick = ({ x, y, payload }) => {
    const parts = payload.value.split(' ');
    const month = parts[0]; // e.g., "Jan"
    const year = parts[1];  // e.g., "2025"

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={16}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize={14}
            >
                {month}
            </text>
            <text
                x={0}
                y={0}
                dy={32}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize={14}
            >
                {year}
            </text>
        </g>
    );
};

function AnnualEarningEmployeePortal() {
    const { 
        getSalaryStructureEmployee, 
        dataEmployeeAnnualEarning,
        loading,
        error
    } = employeePortalStoreManagements();

    // Generate Years sama seperti PayslipEmployeePortal
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

    // Helper function to get month data by key
    const getMonthDataByKey = (monthKey) => {
        if (dataEmployeeAnnualEarning && Array.isArray(dataEmployeeAnnualEarning)) {
            const monthItem = dataEmployeeAnnualEarning.find(item => item[monthKey]);
            return monthItem ? monthItem[monthKey] : {};
        }
        return {};
    };

    // Helper function to get monthly value from API data
    const getMonthlyValue = (year, monthIndex) => {
        const currentDate = dayjs();
        const currentYear = currentDate.year();
        const currentMonth = currentDate.month();
        
        // Only show data for past months or current month
        if (year < currentYear || (year === currentYear && monthIndex <= currentMonth)) {
            // Get actual data from API if available
            if (dataEmployeeAnnualEarning && Array.isArray(dataEmployeeAnnualEarning)) {
                const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                                  'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                
                // Find the month data in the array
                const monthKey = monthNames[monthIndex];
                const monthData = getMonthDataByKey(monthKey);
                
                if (monthData && Object.keys(monthData).length > 0) {
                    // Calculate total monthly salary from the data
                    let totalMonthly = 0;
                    
                    // Add basic salary
                    if (monthData.basicMonthly) {
                        totalMonthly += parseFloat(monthData.basicMonthly);
                    }
                    
                    // Add fixed allowance
                    if (monthData.fixedAllowanceMonthly) {
                        totalMonthly += parseFloat(monthData.fixedAllowanceMonthly);
                    }
                    
                    // Add all other monthly allowances
                    const monthlyFields = [
                        'hraMonthly', 'dearnessAllowanceMonthly', 'conveyanceAllowanceMonthly',
                        'childrenEducationAllowanceMonthly', 'hostelExpenditureAllowanceMonthly',
                        'transportAllowanceMonthly', 'helperAllowanceMonthly', 'travellingAllowanceMonthly',
                        'uniformAllowanceMonthly', 'dailyAllowanceMonthly', 'cityCompensatoryAllowanceMonthly',
                        'overtimeAllowanceMonthly', 'telephoneAllowanceMonthly', 'fixedMedicalAllowanceMonthly',
                        'projectAllowanceMonthly', 'foodAllowanceMonthly', 'holidayAllowanceMonthly',
                        'entertainmentAllowanceMonthly', 'foodCouponMonthly', 'researchAllowanceMonthly',
                        'booksAndPeriodicalsAllowanceMonthly', 'fuelAllowanceMonthly', 'driverAllowanceMonthly',
                        'leaveTravelAllowanceMonthly', 'vehicleMaintenanceAllowanceMonthly',
                        'telephoneAndInternetAllowanceMonthly', 'shiftAllowanceMonthly'
                    ];
                    
                    monthlyFields.forEach(field => {
                        if (monthData[field]) {
                            totalMonthly += parseFloat(monthData[field]);
                        }
                    });
                    
                    // Convert to thousands for chart display
                    return Math.round(totalMonthly / 1000);
                }
            }
            
            // Fallback to sample data if no API data
            if (selectedYear === years[0] && monthIndex <= 8) { // Up to September
                return monthIndex === 6 ? 77 : 80; // July shows 77, others show 80
            }
        }
        return 0;
    };

    // Generate chart data based on selected year (January - December)
    const generateChartData = (year) => {
        return [
            { month: `Jan ${year}`, value: getMonthlyValue(year, 0) },
            { month: `Feb ${year}`, value: getMonthlyValue(year, 1) },
            { month: `Mar ${year}`, value: getMonthlyValue(year, 2) },
            { month: `Apr ${year}`, value: getMonthlyValue(year, 3) },
            { month: `May ${year}`, value: getMonthlyValue(year, 4) },
            { month: `Jun ${year}`, value: getMonthlyValue(year, 5) },
            { month: `Jul ${year}`, value: getMonthlyValue(year, 6) },
            { month: `Aug ${year}`, value: getMonthlyValue(year, 7) },
            { month: `Sep ${year}`, value: getMonthlyValue(year, 8) },
            { month: `Oct ${year}`, value: getMonthlyValue(year, 9) },
            { month: `Nov ${year}`, value: getMonthlyValue(year, 10) },
            { month: `Dec ${year}`, value: getMonthlyValue(year, 11) }
        ];
    };

    // Generate earnings data based on selected year
    const generateEarningsData = (year) => {
        // Get actual data from API if available
        if (dataEmployeeAnnualEarning && Array.isArray(dataEmployeeAnnualEarning)) {
            const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                              'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            
            // Create components map from available months
            const componentsMap = new Map();
            
            // Process each month's data
            dataEmployeeAnnualEarning.forEach(monthItem => {
                Object.keys(monthItem).forEach(monthKey => {
                    const monthData = monthItem[monthKey];
                    if (monthData && Object.keys(monthData).length > 0) {
                        // Process basic components
                        if (monthData.basicMonthly && parseFloat(monthData.basicMonthly) > 0) {
                            if (!componentsMap.has('Basic')) {
                                componentsMap.set('Basic', {
                                    component: 'Basic',
                                    ytdTotal: 0,
                                    monthlyData: {}
                                });
                            }
                            const monthIndex = monthNames.indexOf(monthKey);
                            const comp = componentsMap.get('Basic');
                            comp.monthlyData[monthIndex] = parseFloat(monthData.basicMonthly);
                            comp.ytdTotal += parseFloat(monthData.basicMonthly);
                        }

                        // Process HRA
                        if (monthData.hraMonthly && parseFloat(monthData.hraMonthly) > 0) {
                            if (!componentsMap.has('House Rent Allowance')) {
                                componentsMap.set('House Rent Allowance', {
                                    component: 'House Rent Allowance',
                                    ytdTotal: 0,
                                    monthlyData: {}
                                });
                            }
                            const monthIndex = monthNames.indexOf(monthKey);
                            const comp = componentsMap.get('House Rent Allowance');
                            comp.monthlyData[monthIndex] = parseFloat(monthData.hraMonthly);
                            comp.ytdTotal += parseFloat(monthData.hraMonthly);
                        }

                        // Process Fixed Allowance
                        if (monthData.fixedAllowanceMonthly && parseFloat(monthData.fixedAllowanceMonthly) > 0) {
                            if (!componentsMap.has('Fixed Allowance')) {
                                componentsMap.set('Fixed Allowance', {
                                    component: 'Fixed Allowance',
                                    ytdTotal: 0,
                                    monthlyData: {}
                                });
                            }
                            const monthIndex = monthNames.indexOf(monthKey);
                            const comp = componentsMap.get('Fixed Allowance');
                            comp.monthlyData[monthIndex] = parseFloat(monthData.fixedAllowanceMonthly);
                            comp.ytdTotal += parseFloat(monthData.fixedAllowanceMonthly);
                        }

                        // Process other allowances dynamically
                        const allowanceFields = [
                            { key: 'transportAllowanceMonthly', name: 'Transport Allowance' },
                            { key: 'projectAllowanceMonthly', name: 'Project Allowance' },
                            { key: 'foodCouponMonthly', name: 'Food Coupon' },
                            { key: 'shiftAllowanceMonthly', name: 'Shift Allowance' },
                            { key: 'telephoneAllowanceMonthly', name: 'Telephone Allowance' },
                            { key: 'overtimeAllowanceMonthly', name: 'Overtime Allowance' },
                            { key: 'vehicleMaintenanceAllowanceMonthly', name: 'Vehicle Maintenance Allowance' }
                        ];

                        allowanceFields.forEach(field => {
                            if (monthData[field.key] && parseFloat(monthData[field.key]) > 0) {
                                if (!componentsMap.has(field.name)) {
                                    componentsMap.set(field.name, {
                                        component: field.name,
                                        ytdTotal: 0,
                                        monthlyData: {}
                                    });
                                }
                                const monthIndex = monthNames.indexOf(monthKey);
                                const comp = componentsMap.get(field.name);
                                comp.monthlyData[monthIndex] = parseFloat(monthData[field.key]);
                                comp.ytdTotal += parseFloat(monthData[field.key]);
                            }
                        });

                        // Process SalaryDetailComponents if available
                        if (monthData.SalaryDetailComponents && Array.isArray(monthData.SalaryDetailComponents)) {
                            monthData.SalaryDetailComponents.forEach(component => {
                                if (component.type === 'allowance' && parseFloat(component.amount) > 0) {
                                    const compName = component.name || component.componentName || 'Other Allowance';
                                    if (!componentsMap.has(compName)) {
                                        componentsMap.set(compName, {
                                            component: compName,
                                            ytdTotal: 0,
                                            monthlyData: {}
                                        });
                                    }
                                    const monthIndex = monthNames.indexOf(monthKey);
                                    const comp = componentsMap.get(compName);
                                    comp.monthlyData[monthIndex] = parseFloat(component.amount);
                                    comp.ytdTotal += parseFloat(component.amount);
                                }
                            });
                        }
                    }
                });
            });
            
            // Convert map to array and format for table
            return Array.from(componentsMap.values()).map(comp => ({
                component: comp.component,
                ytdTotal: comp.ytdTotal,
                [`december${year}`]: comp.monthlyData[11] || 0,
                [`november${year}`]: comp.monthlyData[10] || 0,
                [`october${year}`]: comp.monthlyData[9] || 0,
                [`september${year}`]: comp.monthlyData[8] || 0
            }));
        }

        // Fallback to sample data structure
        const sampleComponents = [
            { name: 'Basic', multiplier: 1 },
            { name: 'House Rent Allowance', multiplier: 0.3 },
            { name: 'Fixed Allowance', multiplier: 0.14 },
            { name: 'Transport Allowance', multiplier: 0.032 },
            { name: 'Project Allowance', multiplier: 0.12 },
            { name: 'Food Coupon', multiplier: 0.1 },
            { name: 'Shift Allowance', multiplier: 0.08 }
        ];

        return sampleComponents.map(comp => {
            const baseAmount = 50000 * comp.multiplier;
            return {
                component: comp.name,
                ytdTotal: baseAmount * 4,
                [`december${year}`]: year === years[0] ? 0 : baseAmount,
                [`november${year}`]: year === years[0] ? 0 : baseAmount,
                [`october${year}`]: year === years[0] ? 0 : baseAmount,
                [`september${year}`]: year === years[0] ? baseAmount : baseAmount
            };
        });
    };

    // Generate contributions data
    const generateContributionsData = (year) => {
        if (dataEmployeeAnnualEarning && Array.isArray(dataEmployeeAnnualEarning)) {
            // Calculate EPF and other statutory contributions from actual data
            const contributionsData = [];
            const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                              'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            
            // Check for EPF contributions in available months
            const epfData = { ytdTotal: 0, monthlyData: {} };
            
            dataEmployeeAnnualEarning.forEach(monthItem => {
                Object.keys(monthItem).forEach(monthKey => {
                    const monthData = monthItem[monthKey];
                    if (monthData && Object.keys(monthData).length > 0) {
                        // Calculate EPF from basic salary (typically 12%)
                        if (monthData.basicMonthly) {
                            const basicSalary = parseFloat(monthData.basicMonthly);
                            const epfContribution = Math.round(basicSalary * 0.12);
                            const monthIndex = monthNames.indexOf(monthKey);
                            
                            epfData.monthlyData[monthIndex] = epfContribution;
                            epfData.ytdTotal += epfContribution;
                        }

                        // Process SalaryDetailComponents for other contributions
                        if (monthData.SalaryDetailComponents && Array.isArray(monthData.SalaryDetailComponents)) {
                            monthData.SalaryDetailComponents.forEach(component => {
                                if (component.type === 'contribution' && parseFloat(component.amount) > 0) {
                                    const compName = component.name || component.componentName || 'Other Contribution';
                                    // Add to contributions data
                                }
                            });
                        }
                    }
                });
            });

            if (epfData.ytdTotal > 0) {
                contributionsData.push({
                    component: 'EPF Contribution',
                    ytdTotal: epfData.ytdTotal,
                    [`december${year}`]: epfData.monthlyData[11] || 0,
                    [`november${year}`]: epfData.monthlyData[10] || 0,
                    [`october${year}`]: epfData.monthlyData[9] || 0,
                    [`september${year}`]: epfData.monthlyData[8] || 0
                });
            }

            return contributionsData;
        }

        return [{
            component: 'EPF Contribution',
            ytdTotal: 24000.00,
            [`december${year}`]: year === years[0] ? 0 : 6000.00,
            [`november${year}`]: year === years[0] ? 0 : 6000.00,
            [`october${year}`]: year === years[0] ? 0 : 6000.00,
            [`september${year}`]: year === years[0] ? 6000.00 : 6000.00
        }];
    };

    // Generate deductions data
    const generateDeductionsData = (year) => {
        if (dataEmployeeAnnualEarning && Array.isArray(dataEmployeeAnnualEarning)) {
            const deductionsMap = new Map();
            const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                              'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

            dataEmployeeAnnualEarning.forEach(monthItem => {
                Object.keys(monthItem).forEach(monthKey => {
                    const monthData = monthItem[monthKey];
                    if (monthData && Object.keys(monthData).length > 0) {
                        // Process SalaryDetailComponents for deductions
                        if (monthData.SalaryDetailComponents && Array.isArray(monthData.SalaryDetailComponents)) {
                            monthData.SalaryDetailComponents.forEach(component => {
                                if (component.type === 'deduction' && parseFloat(component.amount) > 0) {
                                    const compName = component.name || component.componentName || 'Other Deduction';
                                    if (!deductionsMap.has(compName)) {
                                        deductionsMap.set(compName, {
                                            component: compName,
                                            ytdTotal: 0,
                                            monthlyData: {}
                                        });
                                    }
                                    const monthIndex = monthNames.indexOf(monthKey);
                                    const comp = deductionsMap.get(compName);
                                    comp.monthlyData[monthIndex] = parseFloat(component.amount);
                                    comp.ytdTotal += parseFloat(component.amount);
                                }
                            });
                        }
                        
                        // TAMBAHAN: Fallback kalo ga ada detail, ambil dari field deductions total
                        if (monthData.deductions && parseFloat(monthData.deductions) > 0) {
                            // Cek dulu apakah sudah ada data dari SalaryDetailComponents
                            let hasDetailedDeductions = false;
                            if (monthData.SalaryDetailComponents && Array.isArray(monthData.SalaryDetailComponents)) {
                                hasDetailedDeductions = monthData.SalaryDetailComponents.some(
                                    comp => comp.type === 'deduction' && parseFloat(comp.amount) > 0
                                );
                            }
                            
                            // Kalo ga ada detail, pake total deductions
                            if (!hasDetailedDeductions) {
                                const compName = 'Total Deductions';
                                if (!deductionsMap.has(compName)) {
                                    deductionsMap.set(compName, {
                                        component: compName,
                                        ytdTotal: 0,
                                        monthlyData: {}
                                    });
                                }
                                const monthIndex = monthNames.indexOf(monthKey);
                                const comp = deductionsMap.get(compName);
                                comp.monthlyData[monthIndex] = parseFloat(monthData.deductions);
                                comp.ytdTotal += parseFloat(monthData.deductions);
                            }
                        }
                    }
                });
            });

            // Kalo ada data, return array
            if (deductionsMap.size > 0) {
                return Array.from(deductionsMap.values()).map(comp => ({
                    component: comp.component,
                    ytdTotal: comp.ytdTotal,
                    [`december${year}`]: comp.monthlyData[11] || 0,
                    [`november${year}`]: comp.monthlyData[10] || 0,
                    [`october${year}`]: comp.monthlyData[9] || 0,
                    [`september${year}`]: comp.monthlyData[8] || 0
                }));
            }
        }

        // Fallback ke empty array kalo ga ada data sama sekali
        return [];
    };

    // Calculate totals
    const calculateTotals = (earningsData, contributionsData, deductionsData, year) => {
        const totalEarnings = earningsData.reduce((acc, item) => ({
            ytdTotal: acc.ytdTotal + item.ytdTotal,
            [`december${year}`]: acc[`december${year}`] + item[`december${year}`],
            [`november${year}`]: acc[`november${year}`] + item[`november${year}`],
            [`october${year}`]: acc[`october${year}`] + item[`october${year}`],
            [`september${year}`]: acc[`september${year}`] + item[`september${year}`]
        }), {
            ytdTotal: 0,
            [`december${year}`]: 0,
            [`november${year}`]: 0,
            [`october${year}`]: 0,
            [`september${year}`]: 0
        });

        const totalStatutories = contributionsData.reduce((acc, item) => ({
            ytdTotal: acc.ytdTotal + item.ytdTotal,
            [`december${year}`]: acc[`december${year}`] + item[`december${year}`],
            [`november${year}`]: acc[`november${year}`] + item[`november${year}`],
            [`october${year}`]: acc[`october${year}`] + item[`october${year}`],
            [`september${year}`]: acc[`september${year}`] + item[`september${year}`]
        }), {
            ytdTotal: 0,
            [`december${year}`]: 0,
            [`november${year}`]: 0,
            [`october${year}`]: 0,
            [`september${year}`]: 0
        });

        const totalDeductions = deductionsData.reduce((acc, item) => ({
            ytdTotal: acc.ytdTotal + item.ytdTotal,
            [`december${year}`]: acc[`december${year}`] + item[`december${year}`],
            [`november${year}`]: acc[`november${year}`] + item[`november${year}`],
            [`october${year}`]: acc[`october${year}`] + item[`october${year}`],
            [`september${year}`]: acc[`september${year}`] + item[`september${year}`]
        }), {
            ytdTotal: 0,
            [`december${year}`]: 0,
            [`november${year}`]: 0,
            [`october${year}`]: 0,
            [`september${year}`]: 0
        });

        // UBAH: Ambil Take Home dari netPayMonthly API
        const takeHome = {
            ytdTotal: 0,
            [`december${year}`]: 0,
            [`november${year}`]: 0,
            [`october${year}`]: 0,
            [`september${year}`]: 0
        };

        if (dataEmployeeAnnualEarning && Array.isArray(dataEmployeeAnnualEarning)) {
            const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                            'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
            
            dataEmployeeAnnualEarning.forEach(monthItem => {
                Object.keys(monthItem).forEach(monthKey => {
                    const monthData = monthItem[monthKey];
                    if (monthData && Object.keys(monthData).length > 0 && monthData.netPayMonthly) {
                        const netPay = parseFloat(monthData.netPayMonthly);
                        const monthIndex = monthNames.indexOf(monthKey);
                        
                        takeHome.ytdTotal += netPay;
                        
                        // Map ke column yang sesuai
                        if (monthIndex === 11) { // December
                            takeHome[`december${year}`] = netPay;
                        } else if (monthIndex === 10) { // November
                            takeHome[`november${year}`] = netPay;
                        } else if (monthIndex === 9) { // October
                            takeHome[`october${year}`] = netPay;
                        } else if (monthIndex === 8) { // September
                            takeHome[`september${year}`] = netPay;
                        }
                    }
                });
            });
        }

        return { totalEarnings, totalStatutories, totalDeductions, takeHome };
    };

    // Generate data based on selected year
    const chartData = generateChartData(selectedYear);
    const earningsData = generateEarningsData(selectedYear);
    const contributionsData = generateContributionsData(selectedYear);
    const deductionsData = generateDeductionsData(selectedYear);
    const totalsData = calculateTotals(earningsData, contributionsData, deductionsData, selectedYear);
    const formatCurrency = (amount) => {
        return `$${amount?.toLocaleString()}`;
    };

    // Get month column headers dynamically
    const getMonthHeaders = (year) => {
        return [
            { key: `december${year}`, label: `December ${year}` },
            { key: `november${year}`, label: `November ${year}` },
            { key: `october${year}`, label: `October ${year}` },
            { key: `september${year}`, label: `September ${year}` },
            { key: `august${year}`, label: `August ${year}` },
            { key: `july${year}`, label: `July ${year}` },
            { key: `june${year}`, label: `June ${year}` },
            { key: `may${year}`, label: `May ${year}` },
            { key: `april${year}`, label: `April ${year}` },
            { key: `march${year}`, label: `March ${year}` },
            { key: `february${year}`, label: `February ${year}` },
            { key: `january${year}`, label: `January ${year}` }
        ];
    };

    const monthHeaders = getMonthHeaders(selectedYear);

    if (loading) {
        return (
            <div className="w-full h-full bg-white flex items-center justify-center">
                <div className="text-gray-500">Loading annual earning data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full bg-white flex items-center justify-center">
                <div className="text-red-500">Error loading annual earning data: {error}</div>
            </div>
        );
    }

    return (
        <div 
            className="
            w-full h-full"
        >

            {/* Main Container */}
            <div 
                className="
                flex flex-col
                w-full h-full    
                pt-6
                overflow-y-auto"
            >
                {/* Header Section */}
                <div 
                    className="
                        flex flex-col flex-shrink-0 justify-between
                        px-8
                        gap-4
                        h-1/2"
                >   

                    {/* First Row */}
                    <div 
                        className="
                            flex items-center justify-between"                        
                    >
                        <h1 className="text-xl font-semibold text-gray-900">
                            For the financial year: {selectedYear}
                        </h1>

                        {/* Year Dropdown */}
                        <div
                            className="
                                flex items-center
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
                    </div>

                    {/* Second Row */}
                    {/* Line Chart */}
                    <div
                        className="
                            flex-grow
                            w-full"
                    >

                        <ResponsiveContainer width="100%" height="100%"
                        >
                            <AreaChart
                                data={chartData}
                                margin={{ top: 20, right: 40, left: -25, bottom: 20 }}
                            >
                                {/* Subtle grid lines */}
                                <CartesianGrid
                                    strokeDasharray="0"
                                    stroke="#e5e7eb"
                                    horizontal={false}
                                />

                                {/* X-Axis styling */}
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={<CustomXAxisTick />}
                                    height={60}
                                    dy={10}
                                />

                                {/* Y-Axis styling */}
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 14, fill: '#9ca3af' }}
                                    domain={[0, (dataMax) => Math.ceil(dataMax * 1.2)]}
                                    tickFormatter={(value) => `${value}`}
                                    dx={-10}
                                />

                                {/* Color Fill: bisa gradient jg */}
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#dbeafe" stopOpacity={0.6} />
                                        <stop offset="95%" stopColor="#dbeafe" stopOpacity={0.6} />
                                    </linearGradient>
                                </defs>

                                {/* Area with fill */}
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fill="url(#colorValue)"
                                    dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }}
                                    activeDot={{ r: 5, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>

                    </div>
                </div>

                {/* Earnings Table */}
                <div className="
                        flex-grow
                        w-full
                        flex
                        flex-col
                        bg-gray-100
                        pl-4"
                >   
                       
                    {/* Empty State if no data */}
                    {/* earningsData.length === 0 */ false ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500">
                                <p className="text-lg font-medium">No earnings data found</p>
                                <p className="text-sm mt-1">No annual earning data available for the selected year.</p>
                            </div>
                        </div>
                    ) : (
                    /* Table */
                        <TableReusable 
                            dataHeaders={monthHeaders}
                            objectTable={{
                                earningsData: earningsData,
                                contributionsData: contributionsData,
                                deductionsData: deductionsData,
                                totalsData: totalsData
                            }}
                            formatFunction={formatCurrency}
                            tableFor={"annualEarningsEmployeePortal"}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default AnnualEarningEmployeePortal;