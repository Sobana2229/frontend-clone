import { useRef } from "react";
import { benefitsDataElegantTemplate, deductionsElegantTemplate, earningElegantTemplate } from "../../../../../data/dummy";

function ProfessionalTemplate({imgUrl="", availableDetailTamplate, logoScale}) {
    const contentRef = useRef(null);

    return (
        <div ref={contentRef} className="w-full max-w-4xl mx-auto bg-white p-8 font-sans shadow-md border border-gray-300">
            {/* Header Section */}
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

            {/* Payslip Title and Net Pay */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Payslip for the month of May 2025</h2>
                    
                    {/* Employee Details */}
                    <div className="">
                        <h3 className="text-base font-semibold text-gray-900 mb-2">PREET SETTY, <span className="text-sm font-light">EMP012</span></h3>
                        <p className="text-sm text-gray-700">Software Engineer | Product Development | Date of Joining: 21-09-2014</p>
                    </div>
                </div>
                
                <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">Total Net Pay</div>
                    <div className="text-4xl font-normal text-gray-900">₹97,870.00</div>
                    <div className="text-xs text-gray-500 mt-2">Paid Days: 28 | LOP Days: 3</div>
                </div>
            </div>

            {/* Dotted Line Separator */}
            <div className="border-t border-dotted border-gray-400 mb-8"></div>

           {/* Account Details */}
            <div className="mb-8 w-[80%] text-sm">
                <table className="w-full table-auto text-left">
                    <tbody>
                        <tr>
                            <td className="text-gray-600">PF A/C Number</td>
                            <td className="text-gray-900">: AA/AAA/0000000/000/0000000</td>

                            <td className="text-gray-600">UAN</td>
                            <td className="text-gray-900">: 101010101010</td>
                        </tr>
                        <tr>
                            <td className="text-gray-600">PAN</td>
                            <td className="text-gray-900">: AAAAA0000A</td>

                            <td className="text-gray-600">ESI Number</td>
                            <td className="text-gray-900">: 1234567890</td>
                        </tr>
                        <tr>
                            <td className="text-gray-600">Bank Account No</td>
                            <td className="text-gray-900">: 101010101010101</td>

                            <td className="text-gray-600">Work Location</td>
                            <td className="text-gray-900">: Head Office</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Dotted Line Separator */}
            <div className="border-t border-dotted border-gray-400"></div>

            {/* Earnings and Deductions Table */}
            <div className="grid text-xs">
                {/* Earnings */}
                <div className="p-3">
                    <table className="w-full">
                        <thead className="">
                            <tr className="border-b-2 border-gray-300">
                                <th className="text-left py-3 font-semibold text-gray-700">EARNINGS</th>
                                <th className="text-right py-3 font-semibold text-gray-700">AMOUNT</th>
                                <th className="text-right py-3 font-semibold text-gray-700">YTD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {earningElegantTemplate.map((e) => (
                                <tr key={e?.label}>
                                    <td className="py-2 text-gray-600">{e?.label}</td>
                                    <td className="py-2 text-right font-medium">₹{e?.amount.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                                    <td className="py-2 text-right font-medium">₹{e?.ytd.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Deductions */}
                <div className="p-3">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="text-left py-3 font-semibold text-gray-700">DEDUCTIONS</th>
                                <th className="text-right py-3 font-semibold text-gray-700">AMOUNT</th>
                                <th className="text-right py-3 font-semibold text-gray-700">YTD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deductionsElegantTemplate.map((d) => (
                                <tr key={d?.label}>
                                    <td className="py-2 text-gray-600">{d?.label}</td>
                                        <td className="py-2 text-right font-medium">₹{d?.amount.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                                    <td className="py-2 text-right font-medium">₹{d?.ytd.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="col-span-2 p-3 flex border-t space-x-8 mb-8 justify-between font-semibold text-gray-800">
                    <div className="flex w-1/2 items-start justify-between space-x-2">
                        <span>Gross Earnings</span>
                        <span className="w-[50%]">₹1,20,000.00</span>
                    </div>
                    <div className="flex w-1/2 items-start justify-between space-x-2">
                        <span>Total Deductions</span>
                        <span className="w-[46%]">₹22,180.00</span>
                    </div>
                </div>
            </div>

            {/* Net Payable */}
            <div className="text-center py-4 bg-blue-50 space-y-1">
                <div className="text-base font-normal text-gray-800">
                    Total Net Payable ₹97,870.00 (Indian Rupee Ninety-Seven Thousand Eight Hundred Seventy Only)
                </div>
                <div className="text-center text-xs text-gray-500">
                    **Total Net Payable = Gross Earnings - Total Deductions
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 pt-10 pb-12">
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
                    <div className="overflow-x-auto pb-10">
                        <table className="min-w-full border-b">
                            <thead className="">
                                <tr className="text-xs border-y">
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

                                <tr className="font-normal text-gray-900 border-t text-xs">
                                    <td className="py-4 px-3 font-semibold">Total Benefits</td>
                                    <td className="py-4 text-right px-3">₹50</td>
                                    <td className="py-4 text-right px-3"></td>
                                    <td className="py-4 text-right px-3">₹175</td>
                                    <td className="py-4 text-right px-3"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfessionalTemplate;