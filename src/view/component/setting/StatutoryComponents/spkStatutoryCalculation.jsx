import { X } from "@phosphor-icons/react";
import { useState } from "react";
import ToggleAction from "../../toggle";

function SpkStatutoryCalculation({setShowForm}) {
    const [showConfiguration, setShowConfiguration] = useState(false);
    const [olpEnabled, setOlpEnabled] = useState(true);
    
    const defaultPackages = [
        {
            id: 1,
            name: "PACKAGE 1",
            basic: 500,
            fuelAllowance: 100,
            foodAllowance: 50,
            employeeContribution: 42.5,
            employerContribution: 57.5,
            employerPercentage: "10.5% of $500",
        },
        {
            id: 2,
            name: "PACKAGE 2",
            basic: 1000,
            fuelAllowance: 200,
            foodAllowance: 100,
            employeeContribution: 85,
            employerContribution: 105,
            employerPercentage: "10.5% of $1000",
        },
        {
            id: 3,
            name: "PACKAGE 3",
            basic: 2000,
            fuelAllowance: 400,
            foodAllowance: 200,
            employeeContribution: 170,
            employerContribution: 190,
            employerPercentage: "9.5% of $2000",
        },
        {
            id: 4,
            name: "PACKAGE 4",
            basic: 3000,
            fuelAllowance: 600,
            foodAllowance: 300,
            employeeContribution: 255,
            employerContribution: 255,
            employerPercentage: "8.5% of $3000",
        },
    ];

    const packages = defaultPackages.map((pkg) => {
        if (olpEnabled) {
            return {
                ...pkg,
                basic: pkg.basic / 2,
                fuelAllowance: pkg.fuelAllowance / 2,
                foodAllowance: pkg.foodAllowance / 2,
                employeeContribution: pkg.employeeContribution / 2,
                employerContribution: pkg.employerContribution / 2,
            };
        }
        return pkg;
    });

    return (
        <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-50 fixed inset-0">
            <div className="w-[90%] max-w-6xl bg-white rounded-md max-h-[90%] overflow-y-auto">
                <div className="w-full flex items-center justify-between border-b py-5 px-10">
                    <h1 className="text-xl font-normal">SPK Sample Calculation</h1>
                    <button onClick={() => setShowForm(false)}>
                        <X className="text-black font-bold text-xl" />
                    </button>
                </div>
                
                <div className="w-full py-5 px-10">
                    {/* Description */}
                    <p className="text-gray-600 mb-4">
                        Let's assume the salary packages considered for SPK is as shown as below, the calculation is based on the settings we've configured
                    </p>
                    
                    {/* Show Current Configuration Button */}
                    <button 
                        className="flex items-center text-blue-500 hover:text-blue-700 mb-6"
                        onClick={() => setShowConfiguration(!showConfiguration)}
                    >
                        <span>Show Current Configuration</span>
                        <svg 
                            className={`ml-2 w-4 h-4 transform transition-transform ${showConfiguration ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Configuration Details (collapsible) */}
                    {showConfiguration && (
                        <div className="bg-white px-6 rounded-md mb-6">
                            <div className="mb-6">
                                <h3 className="text-[#FF9F29] font-medium mb-4">SPK CONTRIBUTION SETTINGS</h3>
                                <div className="space-y-3">
                                    <div className="flex">
                                        <span className="text-black w-72">Employee Contribution</span>
                                        <span className="text-black">:</span>
                                        <span className="text-black ml-3">8.5% of Actual Basic Wage</span>
                                    </div>
                                    <div className="flex">
                                        <span className="text-black w-72">Employer Contribution</span>
                                        <span className="text-black">:</span>
                                        <span className="text-black ml-3">10.5% of Actual Basic Wage</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-[#FF9F29] font-medium mb-4">LOP CONTRIBUTION</h3>
                                <div className="space-y-3">
                                    <div className="flex">
                                        <span className="text-black w-72">Pro-rate Restricted Basic wage</span>
                                        <span className="text-black">:</span>
                                        <span className="text-black ml-3">Enabled</span>
                                    </div>
                                    <div className="text-black">
                                        Consider all components when basic wage
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Title and Toggle */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <h2 className="text-lg font-medium">Salary and SPK Calculation</h2>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-3 text-sm">with 15 days OLP</span>
                            <ToggleAction setAction={setOlpEnabled} Action={olpEnabled} color={"orange"} />
                        </div>
                    </div>

                    {/* Salary Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border border-gray-200 p-3 text-left bg-white text-[#FF9F29] font-medium">
                                        SALARY COMPONENTS
                                        {olpEnabled && (
                                            <span className="ml-4 text-xs font-medium text-black bg-orange-400 p-2">WITH 15 DAYS LOP</span>
                                        )}
                                    </th>
                                    {packages.map((pkg) => (
                                        <th key={pkg.id} className="border border-gray-200 p-3 text-center bg-white text-[#FF9F29] font-medium">
                                            {pkg.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Basic Salary Row */}
                                <tr>
                                    <td className="border border-gray-200 p-3">
                                        <div>
                                            <div className="font-medium">Basic</div>
                                            <div className="text-sm text-gray-500">Always considered for SPK</div>
                                        </div>
                                    </td>
                                    {packages.map((pkg) => (
                                        <td key={pkg.id} className="border border-gray-200 p-3 text-center font-medium">
                                            ${pkg.basic}
                                        </td>
                                    ))}
                                </tr>

                                {/* Fuel Allowance Row */}
                                <tr className="bg-white">
                                    <td className="border border-gray-200 p-3">
                                        <div>
                                            <div className="font-medium">Fuel Allowance</div>
                                            <div className="text-sm text-gray-500">SPK applies only on employee's Basic Wage (ref package).</div>
                                        </div>
                                    </td>
                                    {packages.map((pkg) => (
                                        <td key={pkg.id} className="border border-gray-200 p-3 text-center font-medium">
                                            ${pkg.fuelAllowance}
                                        </td>
                                    ))}
                                </tr>

                                {/* Food Allowance Row */}
                                <tr>
                                    <td className="border border-gray-200 p-3">
                                        <div>
                                            <div className="font-medium">Food Allowance</div>
                                            <div className="text-sm text-gray-500">SPK applies only on employee's Basic Wage (ref package).</div>
                                        </div>
                                    </td>
                                    {packages.map((pkg) => (
                                        <td key={pkg.id} className="border border-gray-200 p-3 text-center font-medium">
                                            ${pkg.foodAllowance}
                                        </td>
                                    ))}
                                </tr>

                                {/* SPK Contribution Header */}
                                <tr>
                                    <td className="border border-gray-200 p-3 bg-white text-[#FF9F29] font-medium" colSpan={5}>
                                        SPK Contribution
                                        {olpEnabled && (
                                            <span className="ml-4 text-xs font-medium text-black bg-orange-400 p-2">WITH 15 DAYS LOP</span>
                                        )}
                                    </td>
                                </tr>

                                {/* Employee Contribution Row */}
                                <tr className="bg-white">
                                    <td className="border border-gray-200 p-3">
                                        <div>
                                            <div className="font-medium">Employee</div>
                                            <div className="text-sm text-gray-500">8.5% of Actual Basic Wage</div>
                                        </div>
                                    </td>
                                    {packages.map((pkg) => (
                                        <td key={pkg.id} className="border border-gray-200 p-3 text-center font-medium">
                                            ${pkg.employeeContribution}
                                        </td>
                                    ))}
                                </tr>

                                {/* Employer Contribution Row */}
                                <tr>
                                    <td className="border border-gray-200 p-3">
                                        <div>
                                            <div className="font-medium">Employer</div>
                                            <div className="text-sm text-gray-500">10.5% of Actual Basic Wage</div>
                                        </div>
                                    </td>
                                    <td className="border border-gray-200 p-3 text-center">
                                        <div className="text-blue-500 text-sm">Set</div>
                                        <div className="font-medium">${packages[0].employerContribution}</div>
                                    </td>
                                    {packages.slice(1).map((pkg) => (
                                        <td key={pkg.id} className="border border-gray-200 p-3 text-center">
                                            <div className="font-medium">${pkg.employerContribution}</div>
                                            <div className="text-sm text-gray-500">({pkg.employerPercentage})</div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* OK Button */}
                <div className="mt-6 flex justify-start border-t py-5 px-10">
                    <button 
                        className="text-black px-3 py-2 rounded-md bg-blue-td-50 border border-blue-td-500"
                        onClick={() => setShowForm(false)}
                    >
                        Okay, Got it!
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SpkStatutoryCalculation;