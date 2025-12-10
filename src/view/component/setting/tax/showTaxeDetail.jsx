import { NotePencil } from "@phosphor-icons/react";
import { useEffect } from "react";
import { useState } from "react";

function ShowTaxeDetail({data, setShowForm}) {
    const [taxData, setTaxData] = useState({
        organisationType: "",
        rocNumber: "",
        tapAccountNumber: "",
        scpAccountNumber: "",
        taxPaymentFrequency: "",
        deductorType: "",
        deductorName: "",
        deductorIdNumber: "",
    });

    useEffect(() => {
        if(data){
           setTaxData(data);
        }
    }, [data]);

    return (
        <div className="w-full flex items-start justify-start">
            <div className="w-1/3 bg-white rounded-xl p-10 px-10 shadow-sm border border-gray-200">
                {/* Header */}
                <div className="flex items-center justify-start space-x-10 mb-6">
                    <h2 className="text-2xl font-bold text-blue-600">
                        Organisation Tax Details
                    </h2>
                    <button onClick={() => setShowForm(true)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                        <NotePencil size={25} />
                    </button>
                </div>

                {/* Organisation Tax Details */}
                <div className="space-y-10 mb-8">
                    <div className="flex justify-between items-center">
                        <div className="w-1/2">
                            <span className="text-base font-medium text-gray-600">Organisation Type</span>
                        </div>
                        <div className="w-1/2">
                            <span className="text-base text-gray-900 font-medium">{taxData.organisationType}</span>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <div className="w-1/2">
                            <span className="text-base font-medium text-gray-600">ROC Number</span>
                        </div>
                        <div className="w-1/2">
                            <span className="text-base text-gray-900 font-medium">{taxData.rocNumber}</span>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <div className="w-1/2">
                            <span className="text-base font-medium text-gray-600">TAP Account Number</span>
                        </div>
                        <div className="w-1/2">
                            <span className="text-base text-gray-900 font-medium">{taxData.tapAccountNumber}</span>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <div className="w-1/2">
                            <span className="text-base font-medium text-gray-600">SCP Account Number</span>
                        </div>
                        <div className="w-1/2">
                            <span className="text-base text-gray-900 font-medium">{taxData.scpAccountNumber}</span>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <div className="w-1/2">
                            <span className="text-base font-medium text-gray-600">Tax Payment Frequency</span>
                        </div>
                        <div className="w-1/2">
                            <span className="text-base text-gray-900 font-medium">{taxData.taxPaymentFrequency}</span>
                        </div>
                    </div>
                </div>

                {/* Tax Deductor Details */}
                <div className="space-y-10 pt-5 border-t">
                    <h2 className="text-2xl font-bold text-blue-600">
                        Tax Deductor Details
                    </h2>
                    
                    <div className="flex justify-between items-center">
                        <div className="w-1/2">
                            <span className="text-base font-medium text-gray-600">Type</span>
                        </div>
                        <div className="w-1/2">
                            <span className="text-base text-gray-900 font-medium">{taxData.deductorType}</span>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <div className="w-1/2">
                            <span className="text-base font-medium text-gray-600">Deductor's Name</span>
                        </div>
                        <div className="w-1/2">
                            <span className="text-base text-gray-900 font-medium">{taxData.deductorName}</span>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <div className="w-1/2">
                            <span className="text-base font-medium text-gray-600">Deductor's ID Number</span>
                        </div>
                        <div className="w-1/2">
                            <span className="text-base text-gray-900 font-medium">{taxData.deductorIdNumber}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowTaxeDetail;