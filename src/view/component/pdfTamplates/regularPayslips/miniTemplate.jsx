import { useRef } from "react";
import { benefitsDataElegantTemplate } from "../../../../../data/dummy";

function MiniTemplate({imgUrl="", availableDetailTamplate, logoScale}) {
    const contentRef = useRef(null);

    return (
        <div ref={contentRef} className="w-full max-w-4xl mx-auto bg-white p-8 font-sans shadow-md border">
            {/* Header */}
            <div className="flex justify-between items-center border p-4 pb-2">
                <div>
                    <h1 className="text-2xl font-normal text-gray-800 mb-1">emaar2</h1>
                    <p className="text-sm text-black leading-relaxed max-w-xl">
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
            <div className="text-center border-x border-b py-2">
                <h2 className="text-lg font-semibold text-gray-800">Payslip for the month of May 2025</h2>
            </div>

            {/* Pay Summary */}
            <div className="border-x p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 uppercase tracking-wide">PAY SUMMARY</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div className="space-y-1">
                        <div className="flex">
                            <span className="text-gray-500 w-32">Employee Name</span>
                            <span className="text-gray-700">: Preet Setty</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-32">Designation</span>
                            <span className="text-gray-700">: Software Engineer</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-32">Date of Joining</span>
                            <span className="text-gray-700">: 21-09-2014</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-32">Paid Days</span>
                            <span className="text-gray-700">: 28</span>
                        </div>
                        <div className="flex col-span-2">
                            <span className="text-gray-500 w-32">PF A/C Number</span>
                            <span className="text-gray-700">: AA/AAA/0000000/000/0000000</span>
                        </div>
                        <div className="flex col-span-2">
                            <span className="text-gray-500 w-32">ESI Number</span>
                            <span className="text-gray-700">: 1234567890</span>
                        </div>
                        <div className="flex col-span-2">
                            <span className="text-gray-500 w-32">Work Location</span>
                            <span className="text-gray-700">: Head Office</span>
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <div className="flex">
                            <span className="text-gray-500 w-32">Employee ID</span>
                            <span className="text-gray-700">: emp012</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-32">Department</span>
                            <span className="text-gray-700">: Product Development</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-32">Bank Account No</span>
                            <span className="text-gray-700">: 101010101010101</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-32">LOP Days</span>
                            <span className="text-gray-700">: 3</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-32">UAN</span>
                            <span className="text-gray-700">: 101010101010</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-32">PAN</span>
                            <span className="text-gray-700">: AAAAA0000A</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Earnings and Deductions Table */}
            <div className="grid grid-cols-2 border">
                {/* Earnings */}
                <div className="flex flex-col justify-between h-full border-r">
                    <div>
                        <div className="bg-gray-50 py-3 px-2 mb-4 border-b">
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

                    <div className="border-t py-2 mt-4 px-2">
                        <div className="flex justify-start items-start space-x-[31%] font-semibold text-xs">
                            <span>Gross Earnings</span>
                            <span>₹1,20,000.00</span>
                        </div>
                    </div>
                </div>

                {/* Deductions */}
                <div className="flex flex-col justify-between h-full">
                    <div>
                        <div className="bg-gray-50 py-3 px-2 mb-4 border-b">
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

                    <div className="border-t py-2 mt-4 px-2">
                        <div className="flex justify-start items-start space-x-[29%] font-semibold text-xs">
                            <span>Total Deductions</span>
                            <span>₹22,130.00</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Net Payable */}
            <div className="text-center border-x border-b py-2 bg-gray-100 space-y-1">
                <div className="text-base font-normal text-gray-800">
                    Total Net Payable ₹97,870.00 (Indian Rupee Ninety-Seven Thousand Eight Hundred Seventy Only)
                </div>
                <div className="text-center text-xs text-gray-500">
                    **Total Net Payable = Gross Earnings - Total Deductions
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 py-10">
                -- This is a system-generated document. --
            </div>

            <div className="w-full h-fit">
                <div className="bg-white flex flex-col space-y-3">
                    <div className="flex space-y-1 flex-col">
                        <h2 className="text-normal text-sm font-semibold text-gray-900">Benefits Summary</h2>
                        <p className="text-gray-600 text-xs">
                            This section provides a detailed breakdown of benefit contributions made by both you and your employer.
                        </p>
                    </div>
                    <div className="overflow-x-auto border">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr className="text-xs">
                                    <th className="text-left py-3 px-3 font-semibold text-gray-700 uppercase tracking-wider">BENEFITS</th>
                                    <th className="text-right py-3 px-3 font-semibold text-gray-700 uppercase tracking-wider">EMPLOYEE<br />CONTRIBUTION</th>
                                    <th className="text-right py-3 px-3 font-semibold text-gray-700 uppercase tracking-wider">EMPLOYEE YTD</th>
                                    <th className="text-right py-3 px-3 font-semibold text-gray-700 uppercase tracking-wider">EMPLOYER<br />CONTRIBUTION</th>
                                    <th className="text-right py-3 px-3 font-semibold text-gray-700 uppercase tracking-wider">EMPLOYER YTD</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-100">
                            {benefitsDataElegantTemplate.map((item, index) => (
                                <tr key={index} className="text-xs">
                                    <td className="py-4 px-3 font-light text-gray-900">{item.benefit}</td>
                                    <td className="py-4 text-right px-3 text-gray-700">{item.employeeContribution}</td>
                                    <td className="py-4 text-right px-3 text-gray-700">{item.employeeYTD}</td>
                                    <td className="py-4 text-right px-3 text-gray-700">{item.employerContribution}</td>
                                    <td className="py-4 text-right px-3 text-gray-700">{item.employerYTD}</td>
                                </tr>
                            ))}

                            <tr className="font-normal text-gray-900 border-t-2 border-gray-300 text-xs">
                                <td className="py-2 px-3 font-semibold">Total Benefits</td>
                                <td className="py-2 text-right px-3">₹50</td>
                                <td className="py-2 text-right px-3"></td>
                                <td className="py-2 text-right px-3">₹175</td>
                                <td className="py-2 text-right px-3"></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MiniTemplate;