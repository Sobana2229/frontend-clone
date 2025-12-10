import { useRef } from "react";

function SalaryCertificateTamplates({imgUrl="", availableDetailTamplate, logoScale}) {
    const contentRef = useRef(null);

    return (
        <div ref={contentRef} className="w-full max-w-4xl mx-auto bg-white p-8 font-sans shadow-md text-sm text-gray-800">
            {/* Header */}
            <div className="flex justify-between items-center p-4 pb-2 border-b">
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

            {/* Title & Date */}
            <div className="flex flex-col items-start justify-start items-cente mb-4 p-4 space-y-4">
                <h2 className="text-xl font-bold uppercase">Salary Certificate</h2>
                {/* Body Text */}
                <div className="w-full flex items-center justify-between">
                    <p className="leading-relaxed">To Whom it may concern</p>
                    <span className="text-sm">Date: <strong>05/06/2025</strong></span>
                </div>
                <p className="mb-6 leading-relaxed">
                    This is to certify that <strong>Preet Setty</strong> (Employee ID: <strong>emp012</strong>), residing at <strong>4, City Heights, 6th Avenue, Chennai 600021</strong>, is working at <strong>emaar2</strong> and is earning <strong>₹14,40,000.00</strong> as CTC annually. The salary break-up is as given below:
                </p>
            </div>


            {/* Table */}
            <div className="w-full px-4">
                <table className="w-full text-left text-sm mb-6">
                    <thead>
                        <tr className="border-y text-xs">
                            <th className="py-2 font-medium">EARNINGS</th>
                            <th className="py-2 font-medium">MONTHLY AMOUNT</th>
                            <th className="py-2 font-medium">ANNUAL AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="">
                            <td className="py-2">Basic</td>
                            <td className="py-2">₹60,000.00</td>
                            <td className="py-2">₹7,20,000.00</td>
                        </tr>
                        <tr className="">
                            <td className="py-2">House Rent Allowance</td>
                            <td className="py-2">₹60,000.00</td>
                            <td className="py-2">₹7,20,000.00</td>
                        </tr>
                        <tr className="">
                            <td className="py-2">Conveyance Allowance</td>
                            <td className="py-2">₹0.00</td>
                            <td className="py-2">₹0.00</td>
                        </tr>
                        <tr className="">
                            <td className="py-2">Fixed Allowance</td>
                            <td className="py-2">₹0.00</td>
                            <td className="py-2">₹0.00</td>
                        </tr>
                        <tr className="">
                            <td className="py-2">Bonus</td>
                            <td className="py-2">₹0.00</td>
                            <td className="py-2">₹0.00</td>
                        </tr>
                    </tbody>
                    <tfoot className="font-semibold">
                        <tr className="border-y text-xs">
                            <td className="py-2">TOTAL CTC</td>
                            <td className="py-2">₹1,20,000.00</td>
                            <td className="py-2">₹14,40,000.00</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Footer */}
            <p className="text-sm leading-relaxed px-4">
                We hereby confirm that all the above details provided are as per our records. This certificate is being issued upon the request of the above employee for whatever legal purpose it may serve them best.
            </p>
        </div>
    );
}

export default SalaryCertificateTamplates;
