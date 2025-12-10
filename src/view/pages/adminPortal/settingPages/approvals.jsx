import { useState } from "react";
import { dummyLoops, tabApprovalSettings } from "../../../../../data/dummy";
import HeaderReusable from "../../../component/setting/headerReusable";
import CardApprovals from "../../../component/setting/cardApprovals";
import PayRunApprovals from "./approvals/payRun";
import SalaryRevisionApprovals from "./approvals/salaryRevision";

function Approvals() {
    const [activeTab, setActiveTab] = useState(tabApprovalSettings[0]);

    return (
        <div className="w-[80%] h-full flex-col flex items-start justify-start">
            <HeaderReusable title="Approvals" tabs={tabApprovalSettings} activeTab={activeTab} setActiveTab={setActiveTab} needTabs={true} />
            {activeTab === "Pay Run" ? (
                <PayRunApprovals />
            ): (
                <SalaryRevisionApprovals />
            )}
        </div>
    );
}

export default Approvals;
  