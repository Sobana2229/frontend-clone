import { useRef } from "react";
import { benefitsDataElegantTemplate } from "../../../../../data/dummy";

function SimpleSpreadsheetTemplate({imgUrl="", availableDetailTamplate, logoScale}) {
    const contentRef = useRef(null);

    return (
        <div ref={contentRef} className="w-full max-w-4xl mx-auto bg-white p-8 font-sans shadow-md">
            {/* Header Section */}
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

            {/* Pay Summary Section */}
            <div className="border-x border-b">
                <div className="flex items-center">
                    {/* Employee Details */}
                    <div className="space-y-3 text-sm border-r ps-5 pe-[1.78%] py-4">
                        <h3 className="text-base font-medium text-gray-800 pt-2 pb-2">Pay Summary</h3>

                        <div className="flex">
                            <span className="text-gray-500 w-40">Employee Name</span>
                            <span className="font-normal">: Preet Setty, emp012</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-40">Designation</span>
                            <span className="font-normal">: Software Engineer</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-40">Department</span>
                            <span className="font-normal">: Product Development</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-40">Date of Joining</span>
                            <span className="font-normal">: 21-09-2014</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-40">Pay Period</span>
                            <span className="font-normal">: May 2025</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-40">Pay Date</span>
                            <span className="font-normal">: 31/05/2025</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-40">PF A/C Number</span>
                            <span className="font-normal">: AA/AAA/0000000/000/0000000</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-40">UAN</span>
                            <span className="font-normal">: 101010101010</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-40">ESI Number</span>
                            <span className="font-normal">: 1234567890</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-40">PAN</span>
                            <span className="font-normal">: AAAAA0000A</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-40">Bank Account No</span>
                            <span className="font-normal">: 101010101010101</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-40">Work Location</span>
                            <span className="font-normal">: Head Office</span>
                        </div>
                    </div>

                    {/* Net Pay Display */}
                    <div className="w-96 flex items-center justify-center">
                        <div className="flex-shrink-0 text-center w-full flex items-center justify-center flex-col pe-4 py-4">
                            <div className="text-sm font-normal text-gray-500 mb-1">Total Net Pay</div>
                            <div className="text-4xl font-medium text-gray-600 mb-2">₹97,870.00</div>
                            <div className="text-sm text-gray-500">Paid Days : 28 | LOP Days : 3</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table - Earnings and Deductions */}
            <div className="">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="">
                            <th className="border border-gray-300 p-3 text-left font-semibold text-gray-800">EARNINGS</th>
                            <th className="border border-gray-300 p-3 text-right font-semibold text-gray-800">AMOUNT</th>
                            <th className="border border-gray-300 p-3 text-right font-semibold text-gray-800">YTD</th>
                            <th className="border border-gray-300 p-3 text-left font-semibold text-gray-800">DEDUCTIONS</th>
                            <th className="border border-gray-300 p-3 text-right font-semibold text-gray-800">AMOUNT</th>
                            <th className="border border-gray-300 p-3 text-right font-semibold text-gray-800">YTD</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 p-3 text-gray-800">Basic</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹60,000.00</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹1,20,000.00</td>
                            <td className="border border-gray-300 p-3 text-gray-800">Income Tax</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹22,130.00</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹2,65,554.00</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-3 text-gray-800">House Rent Allowance</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹60,000.00</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹1,20,000.00</td>
                            <td className="border border-gray-300 p-3 text-gray-800">EPF Contribution</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹250</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹50</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-3 text-gray-800">Conveyance Allowance</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 p-3 text-gray-800">Voluntary Provident Fund</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹250</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹50</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-3 text-gray-800">Fixed Allowance</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 p-3 text-gray-300"></td>
                            <td className="border border-gray-300 p-3 text-gray-300"></td>
                            <td className="border border-gray-300 p-3 text-gray-300"></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-3 text-gray-800">Bonus</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 p-3 text-gray-300"></td>
                            <td className="border border-gray-300 p-3 text-gray-300"></td>
                            <td className="border border-gray-300 p-3 text-gray-300"></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-3 text-gray-800">Commission</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 p-3 text-gray-300"></td>
                            <td className="border border-gray-300 p-3 text-gray-300"></td>
                            <td className="border border-gray-300 p-3 text-gray-300"></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-3 text-gray-800">Leave Encashment</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 p-3 text-gray-300"></td>
                            <td className="border border-gray-300 p-3 text-gray-300"></td>
                            <td className="border border-gray-300 p-3 text-gray-300"></td>
                        </tr>
                        <tr className="bg-gray-50 font-semibold">
                            <td className="border border-gray-300 p-3 text-gray-800">Gross Earnings</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹1,20,000.00</td>
                            <td className="border border-gray-300 p-3 text-gray-300"></td>
                            <td className="border border-gray-300 p-3 text-gray-800">Total Deductions</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹22,130.00</td>
                            <td className="border border-gray-300 p-3 text-gray-300"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Net Pay Summary */}
            <div className="">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border-x flex-1 border-gray-300 p-3 text-left font-semibold text-gray-800">NET PAY</th>
                            <th className="border-x w-[26.9%] border-gray-300 p-3 text-right font-semibold text-gray-800">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 p-3 text-gray-800">Gross Earnings</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹1,20,000.00</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-3 text-gray-800">Total Deductions</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">(-) ₹22,130.00</td>
                        </tr>
                        <tr className="font-semibold">
                            <td className="border border-gray-300 p-3 text-right text-gray-800">Total Net Payable</td>
                            <td className="border border-gray-300 p-3 text-right text-gray-800">₹97,870.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Final Amount in Words */}
            <div className="p-4 border-x border-gray-300">
                <div className="text-center">
                    <span className="text-base font-normal text-gray-800">
                        Total Net Payable ₹97,870.00 
                    </span>
                    <span className="text-sm text-gray-600 ml-1">
                        (Indian Rupee Ninety-Seven Thousand Eight Hundred Seventy Only)
                    </span>
                </div>
                <div className="text-center text-xs text-gray-500 mt-2">
                    **Total Net Payable = Gross Earnings - Total Deductions
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 border-t border-gray-300 pt-10 pb-12">
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
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="">
                                <tr className="text-xs">
                                    <th className="text-left py-3 px-3 border font-semibold text-gray-700 uppercase tracking-wider">BENEFITS</th>
                                    <th className="text-right py-3 px-3 border font-semibold text-gray-700 uppercase tracking-wider">EMPLOYEE<br />CONTRIBUTION</th>
                                    <th className="text-right py-3 px-3 border font-semibold text-gray-700 uppercase tracking-wider">EMPLOYEE YTD</th>
                                    <th className="text-right py-3 px-3 border font-semibold text-gray-700 uppercase tracking-wider">EMPLOYER<br />CONTRIBUTION</th>
                                    <th className="text-right py-3 px-3 border font-semibold text-gray-700 uppercase tracking-wider">EMPLOYER YTD</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-100">
                            {benefitsDataElegantTemplate.map((item, index) => (
                                <tr key={index} className="text-xs">
                                    <td className="py-4 px-3 border font-light text-gray-900">{item.benefit}</td>
                                    <td className="py-4 text-right px-3 border text-gray-700">{item.employeeContribution}</td>
                                    <td className="py-4 text-right px-3 border text-gray-700">{item.employeeYTD}</td>
                                    <td className="py-4 text-right px-3 border text-gray-700">{item.employerContribution}</td>
                                    <td className="py-4 text-right px-3 border text-gray-700">{item.employerYTD}</td>
                                </tr>
                            ))}

                            <tr className="font-normal text-gray-900 border-t-2 border-gray-300 text-xs">
                                <td className="py-2 px-3 border font-semibold">Total Benefits</td>
                                <td className="py-2 text-right px-3 border">₹50</td>
                                <td className="py-2 text-right px-3 border"></td>
                                <td className="py-2 text-right px-3 border">₹175</td>
                                <td className="py-2 text-right px-3 border"></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SimpleSpreadsheetTemplate;