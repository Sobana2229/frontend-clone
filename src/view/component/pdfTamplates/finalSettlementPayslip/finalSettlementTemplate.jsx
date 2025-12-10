import { useRef } from "react";
import { benefitsDataElegantTemplate } from "../../../../../data/dummy";

function FinalSettlementTemplate({imgUrl="", availableDetailTamplate, logoScale}) {
    const contentRef = useRef(null);

    return (
        <div ref={contentRef} className="w-full max-w-4xl mx-auto bg-white p-8 font-sans shadow-md text-sm text-gray-800">
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
                <h2 className="text-lg font-normal text-gray-800">Full and Final Settlement</h2>
            </div>


            {/* PAY SUMMARY */}
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
                            <span className="text-gray-500 w-32">Pay Period</span>
                            <span className="text-gray-700">: May 2025</span>
                        </div>
                        <div className="flex col-span-2">
                            <span className="text-gray-500 w-32">Final Settlement Date</span>
                            <span className="text-gray-700">: 31/05/2025</span>
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
                            <span className="text-gray-500 w-32">PAN</span>
                            <span className="text-gray-700">: AAAAA0000A</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-32">PF A/C Number</span>
                            <span className="text-gray-700">: AA/AAA/0000000/000/0000000</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-32">UAN</span>
                            <span className="text-gray-700">: 101010101010</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-32">Paid Days</span>
                            <span className="text-gray-700">: 28</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-32">LOP Days</span>
                            <span className="text-gray-700">: 3</span>
                        </div>
                    </div>
                </div>
            </div>

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
                            <td className="border border-gray-300 px-3 py-1 text-gray-800">Basic</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹60,000.00</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹1,20,000.00</td>
                            <td className="border border-gray-300 px-3 py-1 text-gray-800">Income Tax</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹22,130.00</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹2,65,554.00</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-1 text-gray-800">House Rent Allowance</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹60,000.00</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹1,20,000.00</td>
                            <td className="border border-gray-300 px-3 py-1 text-gray-800">EPF Contribution</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹250</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹50</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-1 text-gray-800">Conveyance Allowance</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 px-3 py-1 text-gray-800">Voluntary Provident Fund</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹250</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹50</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-1 text-gray-800">Fixed Allowance</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 px-3 py-1 text-gray-300"></td>
                            <td className="border border-gray-300 px-3 py-1 text-gray-300"></td>
                            <td className="border border-gray-300 px-3 py-1 text-gray-300"></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-1 text-gray-800">Bonus</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 px-3 py-1 text-gray-300"></td>
                            <td className="border border-gray-300 px-3 py-1 text-gray-300"></td>
                            <td className="border border-gray-300 px-3 py-1 text-gray-300"></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-1 text-gray-800">Commission</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 px-3 py-1 text-gray-300"></td>
                            <td className="border border-gray-300 px-3 py-1 text-gray-300"></td>
                            <td className="border border-gray-300 px-3 py-1 text-gray-300"></td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-1 text-gray-800">Leave Encashment</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹0.00</td>
                            <td className="border border-gray-300 px-3 py-1 text-gray-300"></td>
                            <td className="border border-gray-300 px-3 py-1 text-gray-300"></td>
                            <td className="border border-gray-300 px-3 py-1 text-gray-300"></td>
                        </tr>
                        <tr className="font-semibold">
                            <td className="border border-gray-300 px-3 py-1 text-gray-800">Gross Earnings</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹1,20,000.00</td>
                            <td className="border border-gray-300 px-3 py-1 text-gray-300"></td>
                            <td className="border border-gray-300 px-3 py-1 text-gray-800">Total Deductions</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹22,130.00</td>
                            <td className="border border-gray-300 px-3 py-1 text-gray-300"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div className="">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border-x flex-1 border-gray-300 px-3 py-1 text-left font-semibold text-gray-800">NET PAY</th>
                            <th className="border-x w-[26.9%] border-gray-300 px-3 py-1 text-right font-semibold text-gray-800">AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-3 py-1 text-gray-800">Gross Earnings</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹1,20,000.00</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-1 text-gray-800">Total Deductions</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">(-) ₹22,130.00</td>
                        </tr>
                        <tr className="font-semibold">
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">Total Net Payable</td>
                            <td className="border border-gray-300 px-3 py-1 text-right text-gray-800">₹97,870.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Net Payable */}
            <div className="text-center border-x border-b py-3 space-y-1">
                <div className="text-base font-normal text-gray-800">
                    Total Net Payable ₹97,870.00 (Indian Rupee Ninety-Seven Thousand Eight Hundred Seventy Only)
                </div>
                <div className="text-center text-xs text-gray-500">
                    **Total Net Payable = Gross Earnings - Total Deductions
                </div>
            </div>

            {/* DECLARATION */}
            <div className="border-x px-2 pt-2 pb-5 text-xs space-y-3 border-b">
                <p className="mb-4">Note:</p>
                <div className="flex justify-start space-x-[24%] mb-2">
                    <span>Prepared By:</span>
                    <span>Checked By:</span>
                    <span>Authorised By:</span>
                </div>

                <div className="">
                    <h4 className="font-semibold">Declaration By the Receiver</h4>
                    <p>
                        I, the undersigned, hereby state that I have received the above said amount as my full and final
                        settlement out of my own free will and choice on tendering my resignation and I assure that I have
                        no grievances, disputes, demands and claims about my legal dues, back wages, reinstatement or
                        reemployment against the company.
                    </p>
                    <div className="mt-3 w-[80%] flex items-center justify-end ">
                        <span className="font-medium">Employee's Signature:</span>
                    </div>
                </div>
            </div>

            <p className="text-center text-xs pt-10 pb-14 text-gray-400">
                -- This is a system-generated document. --
            </p>

            <div className="w-full h-fit">
                <div className="bg-white flex flex-col">
                    <div className="flex space-y-1 flex-col p-2 border-x border-t">
                        <h2 className="text-normal text-sm font-semibold text-gray-900">Benefits Summary</h2>
                        <p className="text-gray-600 text-xs">
                            This section provides a detailed breakdown of benefit contributions made by both you and your employer.
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200 border-b text-xs">
                            <thead className="">
                                <tr className="text-xs text-gray-700 uppercase border tracking-wider">
                                <th className="text-left font-semibold py-2 px-1 border whitespace-nowrap">Benefits</th>
                                <th className="text-right font-semibold py-2 px-1 border whitespace-nowrap">Employee Contribution</th>
                                <th className="text-right font-semibold py-2 px-1 border whitespace-nowrap">Employee YTD</th>
                                <th className="text-right font-semibold py-2 px-1 border whitespace-nowrap">Employer Contribution</th>
                                <th className="text-right font-semibold py-2 px-1 border whitespace-nowrap">Employer YTD</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-xs text-gray-700">
                                {benefitsDataElegantTemplate.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-1 border font-light text-left text-gray-900">{item.benefit}</td>
                                    <td className="py-2 px-1 border text-right">{item.employeeContribution}</td>
                                    <td className="py-2 px-1 border text-right">{item.employeeYTD}</td>
                                    <td className="py-2 px-1 border text-right">{item.employerContribution}</td>
                                    <td className="py-2 px-1 border text-right">{item.employerYTD}</td>
                                </tr>
                                ))}
                                <tr className="border-t font-medium text-gray-900">
                                <td className="py-2 px-1 border text-left">Total Benefits</td>
                                <td className="py-2 px-1 border text-right">₹50</td>
                                <td className="py-2 px-1 border text-right"></td>
                                <td className="py-2 px-1 border text-right">₹175</td>
                                <td className="py-2 px-1 border text-right"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FinalSettlementTemplate;
