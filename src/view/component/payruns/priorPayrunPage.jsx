import React, { useState } from "react";
import PriorPayrun from "./priorPayrun/priorPayrun";
import PriorPayrunDetail from "./priorPayrun/priorPayrunDetail";

function PriorPayrunPages({setShowPrior}) {
  const [activeTab, setActiveTab] = useState("priorPayrun");

  return (
    <div className="w-full h-full">
      {activeTab === "priorPayrun" && (
        <PriorPayrun handleBack={() => setActiveTab("priorPayrunDetail")} setShowPrior={setShowPrior} />
      )}
      {activeTab === "priorPayrunDetail" && (
        <PriorPayrunDetail handleBack={() => setActiveTab("priorPayrun")} setShowPrior={setShowPrior} />
      )}
    </div>
  );
}

export default PriorPayrunPages;
