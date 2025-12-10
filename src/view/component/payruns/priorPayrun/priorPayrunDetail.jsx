import React, { useState } from "react";
import PriorPayrunEmployeeInformation from "./detail/employeeInformation";
import PriorPayrunPayInformation from "./detail/payInformation";
import PriorSummary from "./detail/priorSummary";

const TABS = [
  { id: "employee", label: "1. Employee Information" },
  { id: "pay", label: "2. Pay Information" },
  { id: "summary", label: "3. Summary" },
];

function PriorPayrunDetail({ handleBack, setShowPrior }) {
  const [activeTab, setActiveTab] = useState("employee");
  const [maxStep, setMaxStep] = useState(0);

  const handleTabClick = (id, idx) => {
    if (idx <= maxStep) {
      setActiveTab(id);
    }
  };

  const goToNext = () => {
    if (activeTab === "employee") {
      setMaxStep(1);
      setActiveTab("pay");
    }
  };

  return (
    <div className="w-full h-full pt-12 px-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Prior Payroll Details</h2>
        <div className="flex items-center space-x-4">
          <button
            className="text-blue-600 hover:underline border-r pr-4"
            onClick={handleBack}
          >
            Disable Prior Payroll
          </button>
          <button
            className="w-7 h-7 font-bold text-xl pb-1 bg-gray-100 rounded-full flex items-center justify-center"
            onClick={handleBack}
          >
            ×
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6 flex gap-8">
        {TABS.map((tab, idx) => (
          <button
            key={tab.id}
            disabled={idx > maxStep}
            className={`text-base pb-2 transition-colors ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                : idx <= maxStep
                ? "text-gray-600 hover:text-blue-600"
                : "text-gray-300 cursor-not-allowed"
            }`}
            onClick={() => handleTabClick(tab.id, idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "employee" && (
        <PriorPayrunEmployeeInformation
          onComplete={goToNext}
          setShowPrior={setShowPrior}
        />
      )}

      {activeTab === "pay" && (
        <PriorPayrunPayInformation
          onComplete={() => {
          }}
          setShowPrior={setShowPrior}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === "summary" && (
        <PriorSummary
          onComplete={() => {
          }}
          setShowPrior={setShowPrior}
        />
      )}
    </div>
  );
}

export default PriorPayrunDetail;
