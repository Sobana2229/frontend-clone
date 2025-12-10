import { useRef } from "react";

function BonusLetterTamplates({imgUrl="", availableDetailTamplate, logoScale}) {
    const contentRef = useRef(null);

    return (
        <div
            ref={contentRef}
            className="w-full max-w-4xl mx-auto bg-white p-8 font-sans shadow-md text-sm text-gray-800"
        >
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

            <div className="w-full px-4 pt-7 pb-4 border-b space-y-10">
                <h1 className="text-2xl font-bold">BONUS LETTER</h1>

                <div className="flex justify-between">
                    <p>
                        Dear <strong>Preet Setty</strong>, (Employee ID: emp012)
                    </p>
                    <p>
                        <span className="font-medium">Date:</span>{" "}
                        <span className="font-bold">05/06/2025</span>
                    </p>
                </div>

                <p className="mb-6">
                    We are pleased to inform you the Bonus quantum for the year (2021) is as follows:
                </p>
            </div>

            <div className="w-full p-4 space-y-2 border-b">
                <h2 className="uppercase text-gray-600 font-semibold text-sm tracking-widest">
                    Bonus Details
                </h2>
                <div className="space-y-2">
                    <div className="flex justify-start space-x-[20%] py-1">
                        <span>Bonus Amount</span>
                        <span className="text-green-600 font-bold">: ₹1,00,000.00</span>
                    </div>
                    <div className="flex justify-start space-x-[17%] py-1">
                        <span>Bonus Percentage</span>
                        <span className="text-green-600 font-bold">: 200%</span>
                    </div>
                </div>
            </div>

            <div className="w-full p-4 space-y-7">
                <p className="">
                    The above mentioned amount has been transferred to your company salary account on{" "}
                    <strong>12 April 2021</strong>.
                </p>

                <div className="w-full space-y-2">
                    <p className="">
                        We appreciate your efforts so far and assure you a rewarding career.
                    </p>
                    <p>Congratulations and best wishes!</p>
                </div>
            </div>
        </div>
    );
}

export default BonusLetterTamplates;
