import { useRef } from "react";
import { benefitsDataElegantTemplate } from "../../../../../data/dummy";

function LiteTemplate({imgUrl="", availableDetailTamplate, logoScale}) {
    const contentRef = useRef(null);

    return (
        <div ref={contentRef} className="w-full max-w-4xl mx-auto bg-white px-12 py-8 font-sans shadow-md border-t-8 border-blue-500">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-5 border-b border-blue-600 pb-2">
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
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Payslip for the month of May 2025</h2>

            {/* Pay Summary Section */}
            <div className="mb-4 border-b border-blue-600 pb-7">
                <h3 className="text-sm font-semibold text-blue-600 mb-4">Pay Summary</h3>
                
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
                    <div className="flex-shrink-0 text-right w-96 flex items-center justify-center flex-col">
                        <div className="text-sm text-gray-500 mb-1">Total Net Pay</div>
                        <div className="text-4xl font-bold text-gray-800 mb-2">₹97,870.00</div>
                        <div className="text-sm text-gray-500">Paid Days : 28 | LOP Days : 3</div>
                    </div>
                </div>
            </div>

            {/* Earnings Section */}
            <div className="pt-2 p-3 text-sm border-b border-blue-600">
                <div className="grid grid-cols-3 gap-4 mb-2 border-b pb-2">
                    <h3 className="text-blue-600 font-semibold uppercase tracking-wide">EARNINGS</h3>
                    <h3 className="text-blue-600 font-semibold uppercase tracking-wide text-right">AMOUNT</h3>
                    <h3 className="text-blue-600 font-semibold uppercase tracking-wide text-right">YTD</h3>
                </div>
                
                <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-3 gap-4 py-1">
                        <span className="text-gray-800">Basic</span>
                        <span className="text-right text-gray-800">₹60,000.00</span>
                        <span className="text-right text-gray-800">₹1,20,000.00</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-1">
                        <span className="text-gray-800">House Rent Allowance</span>
                        <span className="text-right text-gray-800">₹60,000.00</span>
                        <span className="text-right text-gray-800">₹1,20,000.00</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-1">
                        <span className="text-gray-800">Conveyance Allowance</span>
                        <span className="text-right text-gray-800">₹0.00</span>
                        <span className="text-right text-gray-800">₹0.00</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-1">
                        <span className="text-gray-800">Fixed Allowance</span>
                        <span className="text-right text-gray-800">₹0.00</span>
                        <span className="text-right text-gray-800">₹0.00</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-1">
                        <span className="text-gray-800">Bonus</span>
                        <span className="text-right text-gray-800">₹0.00</span>
                        <span className="text-right text-gray-800">₹0.00</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-1">
                        <span className="text-gray-800">Commission</span>
                        <span className="text-right text-gray-800">₹0.00</span>
                        <span className="text-right text-gray-800">₹0.00</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-1">
                        <span className="text-gray-800">Leave Encashment</span>
                        <span className="text-right text-gray-800">₹0.00</span>
                        <span className="text-right text-gray-800">₹0.00</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2 font-semibold">
                        <span className="text-gray-800">Gross Earnings</span>
                        <span className="text-right text-gray-800">₹1,20,000.00</span>
                        <span className="text-right text-gray-800"></span>
                    </div>
                </div>
            </div>

            {/* Deductions Section */}
            <div className="">
                <div className="grid grid-cols-3 gap-4 mb-2 border-b pt-4 pb-2 mx-2">
                    <h3 className="text-blue-600 font-semibold text-sm uppercase tracking-wide">DEDUCTIONS</h3>
                    <h3 className="text-blue-600 font-semibold text-sm uppercase tracking-wide text-right">(-) AMOUNT</h3>
                    <h3 className="text-blue-600 font-semibold text-sm uppercase tracking-wide text-right">YTD</h3>
                </div>
                
                <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-3 gap-4 py-1">
                        <span className="text-gray-800 px-2">Income Tax</span>
                        <span className="text-right text-gray-800 px-2">₹22,130.00</span>
                        <span className="text-right text-gray-800 px-2">₹2,65,554.00</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-1">
                        <span className="text-gray-800 px-2">EPF Contribution</span>
                        <span className="text-right text-gray-800 px-2">₹25.00</span>
                        <span className="text-right text-gray-800 px-2">₹50.00</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-1">
                        <span className="text-gray-800 px-2">Voluntary Provident Fund</span>
                        <span className="text-right text-gray-800 px-2">₹25.00</span>
                        <span className="text-right text-gray-800 px-2">₹50.00</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2 font-semibold">
                        <span className="text-gray-800 px-2">Total Deductions</span>
                        <span className="text-right text-gray-800 px-2">₹22,130.00</span>
                        <span className="text-right text-gray-800 px-2"></span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-4 font-semibold bg-blue-50">
                        <span className="text-gray-800 whitespace-nowrap">NET PAY (Gross Earnings - Total Deductions)</span>
                        <span className="text-right text-gray-800">₹97,870.00</span>
                    </div>
                </div>
            </div>

            {/* Final Amount Section */}
            <div className="p-5 border-b border-blue-600">
                <div className="text-center">
                    <span className="text-lg font-normal text-gray-800">
                        Total Net Payable ₹97,870.00 
                    </span>
                    <span className="text-sm text-gray-600 ml-1">
                        (Indian Rupee Ninety-Seven Thousand Eight Hundred Seventy Only)
                    </span>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 pt-7 pb-12">
                -- This is a system-generated document. --
            </div>

            <div className="w-full h-fit pb-5">
                <div className="bg-white flex flex-col space-y-3">
                    <div className="flex space-y-1 flex-col border-b border-blue-600 pb-4">
                        <h2 className="text-normal text-sm font-semibold text-gray-900">Benefits Summary</h2>
                        <p className="text-gray-600 text-xs">
                            This section provides a detailed breakdown of benefit contributions made by both you and your employer.
                        </p>
                    </div>
                    <div className="overflow-x-auto border-b border-blue-600 pb-5 px-4">
                        <table className="min-w-full">
                            <thead className="border-b">
                                <tr className="text-xs">
                                    <th className="text-left py-3 px-3 font-semibold text-blue-600 uppercase tracking-wider">BENEFITS</th>
                                    <th className="text-right py-3 px-3 font-semibold text-blue-600 uppercase tracking-wider">EMPLOYEE<br />CONTRIBUTION</th>
                                    <th className="text-right py-3 px-3 font-semibold text-blue-600 uppercase tracking-wider">EMPLOYEE YTD</th>
                                    <th className="text-right py-3 px-3 font-semibold text-blue-600 uppercase tracking-wider">EMPLOYER<br />CONTRIBUTION</th>
                                    <th className="text-right py-3 px-3 font-semibold text-blue-600 uppercase tracking-wider">EMPLOYER YTD</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white">
                                {benefitsDataElegantTemplate.map((item, index) => (
                                    <tr key={index} className="text-xs">
                                        <td className="py-4 px-3 font-light text-gray-900">{item.benefit}</td>
                                        <td className="py-4 text-right px-3 text-gray-700">{item.employeeContribution}</td>
                                        <td className="py-4 text-right px-3 text-gray-700">{item.employeeYTD}</td>
                                        <td className="py-4 text-right px-3 text-gray-700">{item.employerContribution}</td>
                                        <td className="py-4 text-right px-3 text-gray-700">{item.employerYTD}</td>
                                    </tr>
                                ))}

                                <tr className="font-normal text-gray-900 text-xs bg-blue-50">
                                    <td className="py-3 px-3 font-semibold">Total Benefits</td>
                                    <td className="py-3 text-right px-3">₹50</td>
                                    <td className="py-3 text-right px-3"></td>
                                    <td className="py-3 text-right px-3">₹175</td>
                                    <td className="py-3 text-right px-3"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LiteTemplate;