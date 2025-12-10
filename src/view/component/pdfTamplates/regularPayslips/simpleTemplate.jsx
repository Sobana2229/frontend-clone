import { useRef } from "react";
import { benefitsDataElegantTemplate, deductionsElegantTemplate, earningElegantTemplate } from "../../../../../data/dummy";

function SimpleTemplate({imgUrl="", availableDetailTamplate, logoScale}) {
    const contentRef = useRef(null);

    return (
        <div ref={contentRef} className="w-full max-w-4xl mx-auto bg-white p-8 font-sans shadow-md border">
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
            <h2 className="text-base font-semibold text-gray-800 mb-8">Payslip for the month of May 2025</h2>

            {/* Pay Summary */}
            <div className="mb-4 border-b pb-7">
                <h3 className="text-sm font-medium text-gray-800 mb-4">Pay Summary</h3>
                <div className="flex items-start justify-between text-sm pe-10">
                    {/* Employee Details - Left Column */}
                    <div className="space-y-3">
                        {[
                            ['Employee Name', ': Preet Setty'],
                            ['Designation', ': Software Engineer'],
                            ['Date of Joining', ': 21-09-2014'],
                            ['PF A/C Number', ': AA/AAA/0000000/000/0000000'],
                            ['ESI Number', ': 1234567890'],
                            ['Work Location', ': Head Office'],
                        ].map(([label, value]) => (
                            <div className="flex text-xs" key={label}>
                                <span className="text-gray-500 min-w-[8rem] whitespace-nowrap">{label}</span>
                                <span className="font-normal">{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Employee Details - Right Column */}
                    <div className="space-y-3">
                        {[
                            ['Employee ID', ': emp012'],
                            ['Department', ': Product Development'],
                            ['UAN', ': 101010101010'],
                            ['Bank Account No', ': 101010101010101'],
                            ['PAN', ': AAAAA0000A'],
                        ].map(([label, value]) => (
                            <div className="flex text-xs" key={label}>
                                <span className="text-gray-500 min-w-[8rem] whitespace-nowrap">{label}</span>
                                <span className="font-normal">{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Net Pay Display */}
                    <div className="text-xs">
                        <div className="flex">
                            <div className="w-32 py-2 px-3 border text-gray-600 whitespace-nowrap">Paid Days</div>
                            <div className="w-14 py-2 px-3 border text-gray-600">28</div>
                        </div>
                        <div className="flex">
                            <div className="w-32 py-2 px-3 border text-gray-600 whitespace-nowrap">LOP Days</div>
                            <div className="w-14 py-2 px-3 border text-gray-600">3</div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Earnings and Deductions Table */}
            <div className="grid grid-cols-2 mb-8 text-xs">
                {/* Earnings */}
                <div className="">
                    <table className="w-full border-r">
                        <thead className="">
                            <tr className="bg-green-50">
                                <th className="text-left py-3 px-2 font-semibold text-gray-700">EARNINGS</th>
                                <th className="text-right py-3 px-2 font-semibold text-gray-700">AMOUNT</th>
                                <th className="text-right py-3 px-2 font-semibold text-gray-700">YTD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {earningElegantTemplate.map((e) => (
                                <tr key={e?.label}>
                                    <td className="py-2 px-2 text-gray-600">{e?.label}</td>
                                    <td className="py-2 px-2 text-right font-medium">₹{e?.amount.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                                    <td className="py-2 px-2 text-right font-medium">₹{e?.ytd.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Deductions */}
                <div className="">
                    <table className="w-full">
                        <thead className="">
                            <tr className="bg-green-50">
                                <th className="text-left py-3 px-2 font-semibold text-gray-700">DEDUCTIONS</th>
                                <th className="text-right py-3 px-2 font-semibold text-gray-700">AMOUNT</th>
                                <th className="text-right py-3 px-2 font-semibold text-gray-700">YTD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deductionsElegantTemplate.map((d) => (
                                <tr key={d?.label}>
                                    <td className="py-2 px-2 text-gray-600">{d?.label}</td>
                                    <td className="py-2 px-2 text-right font-medium">₹{d?.amount.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                                    <td className="py-2 px-2 text-right font-medium">₹{d?.ytd.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="col-span-2 p-3 pt-3 flex justify-between font-semibold text-gray-800 border-t">
                    <div className="flex items-center space-x-2">
                        <span>Gross Earnings</span>
                        <span>₹1,20,000.00</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span>Total Deductions</span>
                        <span>₹22,180.00</span>
                    </div>
                </div>
            </div>

            {/* Net Payable - Dotted Border Box */}
            <div className="border-2 border-dashed border-green-400 p-4 text-center rounded-md">
                <div className="text-base font-normal text-gray-800 mb-2">
                    Total Net Payable ₹97,870.00 (Indian Rupee Ninety-Seven Thousand Eight Hundred Seventy Only)
                </div>
                <div className="text-xs text-gray-500">
                    **Total Net Payable = Gross Earnings - Total Deductions
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-10 pb-5 text-sm text-gray-500">
                -- This is a system-generated document. --
            </div>

            <div className="w-full h-fit pb-5">
                <div className="bg-white flex flex-col space-y-3">
                    <div className="flex space-y-1 flex-col">
                        <h2 className="text-normal text-sm font-semibold text-gray-900">Benefits Summary</h2>
                        <p className="text-gray-600 text-xs">
                            This section provides a detailed breakdown of benefit contributions made by both you and your employer.
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-b">
                            <thead className="bg-green-50">
                                <tr className="text-xs">
                                    <th className="text-left py-3 px-3 font-semibold text-gray-700 uppercase tracking-wider">BENEFITS</th>
                                    <th className="text-right py-3 px-3 font-semibold text-gray-700 uppercase tracking-wider">EMPLOYEE<br />CONTRIBUTION</th>
                                    <th className="text-right py-3 px-3 font-semibold text-gray-700 uppercase tracking-wider">EMPLOYEE YTD</th>
                                    <th className="text-right py-3 px-3 font-semibold text-gray-700 uppercase tracking-wider">EMPLOYER<br />CONTRIBUTION</th>
                                    <th className="text-right py-3 px-3 font-semibold text-gray-700 uppercase tracking-wider">EMPLOYER YTD</th>
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

                                <tr className="font-normal text-gray-900 text-xs border-t">
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

export default SimpleTemplate;