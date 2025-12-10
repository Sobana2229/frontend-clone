import { useState } from "react";
import { referenceSideBarSetting } from "../../../../../data/dummy";
import EmployeePortal from "./preference/employeePortal";
import WebTabs from "./preference/webTabs";
import ReimbursementClaimsPreference from "./preference/reimbursementClaimsPreference";
import ItDeclarationPreference from "./preference/itDeclarationPreference";
import PoiPreference from "./preference/poiPreference";
import Employee from "./preference/employee";
import Loan from "./preference/loan";
import SenderEmailPreferences from "./preference/senderEmailPreferences";
import CustomButton from "./preference/customButton";
import FlexibleBenefitPlan from "./preference/flexibleBenefitPlan";

function Preferences() {
    const [activeIndex, setActiveIndex] = useState(referenceSideBarSetting[0]);

    return (
        <div className="w-full h-full flex items-start justify-start">
            <div className="w-[20%] h-full overflow-y-auto flex items-center justify-center border-r">
                <div className="w-full h-full flex flex-col items-start justify-start py-5 px-3 space-y-2">
                    <h1 className="w-full text-left px-3 text-2xl">Preferences</h1>
                    <div className="w-full flex flex-col pb-10 space-y-1">
                        {referenceSideBarSetting?.map((el, idx) => {
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
            {activeIndex === "Employee Portal" && (<EmployeePortal />)}
            {activeIndex === "Web Tabs" && (<WebTabs />)}
            {activeIndex === "FBP Preference" && (<FlexibleBenefitPlan />)}
            {activeIndex === "Reimbursement Claims Preference" && (<ReimbursementClaimsPreference />)}
            {activeIndex === "IT Declaration Preference" && (<ItDeclarationPreference />)}
            {activeIndex === "POI Preference" && (<PoiPreference />)}
            {activeIndex === "Employee" && (<Employee />)}
            {activeIndex === "Loan" && (<Loan />)}
            {activeIndex === "Sender Email Preferences" && (<SenderEmailPreferences />)}
            {activeIndex === "Custom Button" && (<CustomButton />)}
        </div>
    );
}

export default Preferences;
  