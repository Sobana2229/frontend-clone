import { useRef } from "react";
import { benefitsDataElegantTemplate } from "../../../../../data/dummy";

function StandardTemplate({imgUrl="", availableDetailTamplate, logoScale}) {
    const contentRef = useRef(null);
    
    return (
        <div ref={contentRef} className="w-full max-w-4xl mx-auto bg-white font-sans shadow-md">
            <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-5 border-b pb-2">
                    <div className="">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">emaar2</h1>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xl font-light">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum 
                            has been the industry's standard dummy text ever since the 1500s, when an unknown 
                            printer took a galley of type and scrambled it to make address 2 chennai Tamil Nadu 
                            600008 India
                        </p>
                    </div>
                    <div className={`${logoScale?.size} rounded-lg flex items-center justify-center overflow-hidden`}>
                        <img src={imgUrl} alt="logo_tamplates" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Payslip Title */}
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Payslip for the month of May 2025</h2>

                {/* Pay Summary Section */}
                <div className="mb-4 border-b pb-7">
                    <h3 className="text-sm font-medium text-gray-800 mb-4">Pay Summary</h3>
                    
                    <div className="flex items-center">
                        {/* Employee Details */}
                        <div className="flex-1 space-y-3 text-sm">
                            <div className="flex">
                                <span className="text-gray-500 w-40">Employee Name</span>
                                <span className="font-normal">Preet Setty, emp012</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 w-40">Designation</span>
                                <span className="font-normal">Software Engineer</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 w-40">Department</span>
                                <span className="font-normal">Product Development</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 w-40">Date of Joining</span>
                                <span className="font-normal">21-09-2014</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 w-40">Pay Period</span>
                                <span className="font-normal">May 2025</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 w-40">Pay Date</span>
                                <span className="font-normal">31/05/2025</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 w-40">PF A/C Number</span>
                                <span className="font-normal">AA/AAA/0000000/000/0000000</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 w-40">UAN</span>
                                <span className="font-normal">101010101010</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 w-40">ESI Number</span>
                                <span className="font-normal">1234567890</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 w-40">PAN</span>
                                <span className="font-normal">AAAAA0000A</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 w-40">Bank Account No</span>
                                <span className="font-normal">101010101010101</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 w-40">Work Location</span>
                                <span className="font-normal">Head Office</span>
                            </div>
                        </div>

                        {/* Net Pay Display */}
                        <div className="flex-shrink-0 text-right w-96 py-5 border-2 flex items-center justify-center flex-col">
                            <div className="text-sm text-gray-500 mb-1">Total Net Pay</div>
                            <div className="text-4xl font-normal text-green-600 mb-2">₹97,870.00</div>
                            <div className="text-sm text-gray-500">Paid Days : 28 | LOP Days : 3</div>
                        </div>
                    </div>
                </div>

                {/* Earnings and Deductions Table */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Earnings */}
                    <div className="flex flex-col justify-between h-full">
                        <div>
                            <div className="bg-gray-50 py-3 px-2 mb-4">
                                <div className="flex justify-between items-start font-semibold text-gray-800 text-xs">
                                <span>Earnings</span>
                                <div className="flex space-x-16">
                                    <span>Amount</span>
                                    <span>YTD</span>
                                </div>
                                </div>
                            </div>

                            <div className="space-y-3 text-xs px-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Basic</span>
                                    <div className="flex space-x-5">
                                        <span className="font-medium">₹60,000.00</span>
                                        <span className="font-medium">₹1,20,000.00</span>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">House Rent Allowance</span>
                                    <div className="flex space-x-5">
                                        <span className="font-medium">₹60,000.00</span>
                                        <span className="font-medium">₹1,20,000.00</span>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Conveyance Allowance</span>
                                    <div className="flex space-x-16">
                                        <span className="font-medium">₹0.00</span>
                                        <span className="font-medium">₹0.00</span>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Fixed Allowance</span>
                                    <div className="flex space-x-16">
                                        <span className="font-medium">₹0.00</span>
                                        <span className="font-medium">₹0.00</span>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Bonus</span>
                                    <div className="flex space-x-16">
                                        <span className="font-medium">₹0.00</span>
                                        <span className="font-medium">₹0.00</span>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Commission</span>
                                    <div className="flex space-x-16">
                                        <span className="font-medium">₹0.00</span>
                                        <span className="font-medium">₹0.00</span>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-700">Leave Encashment</span>
                                    <div className="flex space-x-16">
                                        <span className="font-medium">₹0.00</span>
                                        <span className="font-medium">₹0.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-2 mt-4 px-2">
                        <div className="flex justify-start items-start space-x-[31%] font-semibold text-xs">
                            <span>Gross Earnings</span>
                            <span>₹1,20,000.00</span>
                        </div>
                        </div>
                    </div>

                    {/* Deductions */}
                    <div className="flex flex-col justify-between h-full">
                        <div>
                        <div className="bg-gray-50 py-3 px-2 mb-4">
                            <div className="flex justify-between font-semibold text-gray-800 text-xs">
                            <span>Deductions</span>
                            <div className="flex space-x-20">
                                <span>Amount</span>
                                <span>YTD</span>
                            </div>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs px-2">
                            <div className="flex justify-between">
                            <span className="text-gray-700">Income Tax</span>
                            <div className="flex space-x-6">
                                <span className="font-medium">₹22,130.00</span>
                                <span className="font-medium">₹2,65,554.00</span>
                            </div>
                            </div>
                        </div>
                        </div>

                        <div className="border-t pt-2 mt-4 px-2">
                        <div className="flex justify-start items-start space-x-[29%] font-semibold text-xs">
                            <span>Total Deductions</span>
                            <span>₹22,130.00</span>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Net Payable */}
            <div className="bg-[#E9F7E7] p-4 px-8 mb-6">
                <div className="flex justify-start space-x-1 items-center">
                    <span className="text-lg font-normal text-gray-800 border-l-2 border-[#21C55D] ps-2">Total Net Payable ₹97,870.00</span>
                    <span className="text-xs text-gray-500">(Indian Rupee Ninety-Seven Thousand Eight Hundred Seventy Only)</span>
                </div>
            </div>

            {/* Formula */}
            <div className="text-sm text-gray-500 px-8">
                **Total Net Payable = Gross Earnings - Total Deductions
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 pt-14">
                -- This is a system-generated document. --
            </div>

            <div className="w-full h-fit p-8">
                <div className="bg-white flex flex-col space-y-3">
                    <div className="flex space-y-1 flex-col">
                        <h2 className="text-normal text-sm font-semibold text-gray-900">Benefits Summary</h2>
                        <p className="text-gray-600 text-xs">
                            This section provides a detailed breakdown of benefit contributions made by both you and your employer.
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200 border-b">
                            <thead className="bg-gray-100">
                                <tr className="text-xs text-gray-700 uppercase tracking-wider">
                                <th className="text-left font-semibold py-1 px-1 whitespace-nowrap">Benefits</th>
                                <th className="text-right font-semibold py-1 px-1 whitespace-nowrap">Employee Contribution</th>
                                <th className="text-right font-semibold py-1 px-1 whitespace-nowrap">Employee YTD</th>
                                <th className="text-right font-semibold py-1 px-1 whitespace-nowrap">Employer Contribution</th>
                                <th className="text-right font-semibold py-1 px-1 whitespace-nowrap">Employer YTD</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-xs text-gray-700">
                                {benefitsDataElegantTemplate.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-1 font-light text-left text-gray-900">{item.benefit}</td>
                                    <td className="py-2 px-1 text-right">{item.employeeContribution}</td>
                                    <td className="py-2 px-1 text-right">{item.employeeYTD}</td>
                                    <td className="py-2 px-1 text-right">{item.employerContribution}</td>
                                    <td className="py-2 px-1 text-right">{item.employerYTD}</td>
                                </tr>
                                ))}
                                <tr className="border-t font-medium text-gray-900">
                                <td className="py-3 px-1 text-left">Total Benefits</td>
                                <td className="py-3 px-1 text-right">₹50</td>
                                <td className="py-3 px-1 text-right"></td>
                                <td className="py-3 px-1 text-right">₹175</td>
                                <td className="py-3 px-1 text-right"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StandardTemplate;