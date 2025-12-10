import { useState } from "react";
import { tamplateSideBarSetting } from "../../../../../data/dummy";
import BonusLetter from "./templates/bonusLetter";
import RegularPayslips from "./templates/regularPayslips";
import FinalSettlementPayslip from "./templates/finalSettlementPayslip";
import SalaryCertificate from "./templates/salaryCertificate";
import SalaryRevisionLetterPages from "./templates/salaryRevisionLetter";
import { checkPermission } from "../../../../../helper/globalHelper";
import authStoreManagements from "../../../../store/tdPayroll/auth";

function Templates() {
    const [activeIndex, setActiveIndex] = useState(tamplateSideBarSetting[0]);
    const { user } = authStoreManagements();

    return (
        <div className="w-full h-full flex items-start justify-start">
            {checkPermission(user, "Salary Templates", "Full Access") ? (
                <>
                    <div className="w-[20%] h-full overflow-y-auto flex items-center justify-center border-r">
                        <div className="w-full h-full flex flex-col items-start justify-start py-5 px-3 space-y-2">
                            <h1 className="w-full text-left px-3 text-2xl">Templates</h1>
                            <div className="w-full flex flex-col pb-10 space-y-1">
                                {tamplateSideBarSetting?.map((el, idx) => {
                                    const isActive = activeIndex === el;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveIndex(el)}
                                            className={`w-full py-2 px-4 text-left transition-all duration-300 rounded-md ${
                                                isActive
                                                ? "bg-[#3F8DFB] text-white"
                                                : "bg-white text-black hover:bg-[#a4d1ff] hover:text-white"
                                            }`}
                                        >
                                            {el}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    {activeIndex === "Regular Payslips" && (<RegularPayslips />)}
                    {activeIndex === "Final Settlement Payslip" && (<FinalSettlementPayslip />)}
                    {activeIndex === "Salary Certificate" && (<SalaryCertificate />)}
                    {activeIndex === "Salary Revision Letter" && (<SalaryRevisionLetterPages />)}
                    {activeIndex === "Bonus Letter" && (<BonusLetter />)}
                </>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
}

export default Templates;
  