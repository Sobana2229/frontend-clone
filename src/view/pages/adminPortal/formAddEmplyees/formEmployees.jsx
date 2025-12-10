import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formStepAddEmployees } from "../../../../../data/dummy";
import BasicDetails from "../../../component/formAddEmployees/basicDetails";
import SalaryDetails from "../../../component/formAddEmployees/salaryDetails";
import PersonalDetails from "../../../component/formAddEmployees/personalDetails";
import PaymentInformations from "../../../component/formAddEmployees/paymentInformations";
import employeeStoreManagements from "../../../../store/tdPayroll/employee";
import { useEffect } from "react";

function FormEmployees() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [stepComplated, setStepComplated] = useState([]);
    const [tempUuid, setTempUuid] = useState(null);
    const { findOneEmployee, tempDataNewEmployee, resetTempData } = employeeStoreManagements();
    const [showSalaryDetail, setShowSalaryDetail] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isRevise, setIsRevise] = useState(false);
    const { pathname } = useLocation();
    
    useEffect(() => {
        if (pathname == "/add-employees") {
            setIsRevise(false)
            setShowSalaryDetail(false)
            setIsEditMode(true)
            // ✅ Reset tempDataNewEmployee when entering add-employees page
            resetTempData();
            // ✅ Reset local state
            setStep(1);
            setStepComplated([]);
            setTempUuid(null);
        }
    }, [pathname]);

    useEffect(() => {
        if (!isEditMode && step == 2) {
            setStep(3);
        }
    }, [isEditMode]);

    useEffect(() => {
        if(tempUuid){
            const access_token = localStorage.getItem("accessToken");
            findOneEmployee(access_token, 
                tempUuid
            )
        }
    }, [tempUuid]);
    
    const submitFormSalaryDetails = () => {
        try {
            setStep(3)
        } catch (error) {
            console.log(error);
        }
    }

    const cancelForm = () => {
        try {
            navigate("/employees")
        } catch (error) {
            console.log(error);
        }
    }

    // Function untuk handle click step button
    const handleStepClick = (stepNumber) => {
        // Cek apakah step sebelumnya udah complete
        if (stepNumber > 1 && !stepComplated.includes(stepNumber - 1)) {
            return; // Tidak bisa akses kalau step sebelumnya belum complete
        }
        setStep(stepNumber);
    }
    return (
      <div className="w-full h-screen flex flex-col items-center justify-start pt-14">
        <div className="w-full p-10 bg-gray-td-200">
            <div className="w-full bg-white rounded-xl overflow-hidden overflow-y-auto">
                <h1 className="w-full text-center text-xl font-bold py-10">
                    {tempDataNewEmployee ? `${tempDataNewEmployee?.firstName} ${tempDataNewEmployee?.middleName} ${tempDataNewEmployee?.lastName}` : "Add Employee"}
                </h1>
                <div className="flex w-full items-center justify-center space-x-2 border-b pb-10">
                    {formStepAddEmployees.map((el, idx) =>{
                        const stepNumber = idx + 1;
                        // Step disabled kalau step sebelumnya belum complete
                        const isDisabled = stepNumber > 1 && !stepComplated.includes(stepNumber - 1);
                        const isCompleted = stepComplated.includes(stepNumber);
                        
                        return (
                            <React.Fragment key={idx}>
                                <button 
                                    onClick={() => handleStepClick(stepNumber)} 
                                    disabled={isDisabled}
                                    className={`flex items-center justify-center flex-col space-y-2 ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                >
                                    <div className={`h-10 w-10 rounded-full border flex items-center justify-center font-bold ${
                                        isCompleted 
                                            ? "bg-blue-td-500 text-white border-blue-td-500" 
                                            : isDisabled 
                                                ? "bg-gray-300 text-gray-500 border-gray-300" 
                                                : "border-gray-400"
                                    }`}>
                                        {isCompleted ? "✓" : stepNumber}
                                    </div>
                                    <h1 className={`text-center w-full ${isDisabled ? 'text-gray-400' : 'text-black'}`}>
                                        {el}
                                    </h1>
                                </button>
                                {/*  */}
                                {idx !== formStepAddEmployees.length - 1 && (
                                    <div className={`w-20 h-[1px] ${
                                        stepComplated.includes(stepNumber) && stepComplated.includes(stepNumber + 1)
                                            ? "bg-blue-td-500" 
                                            : "bg-gray-td-300"
                                    } mb-[2%]`}></div>
                                )}
                            </React.Fragment>
                        )
                    })}
                </div>
                {step === 1 && (<BasicDetails cancel={cancelForm} setStep={setStep} step={step} setTempUuid={setTempUuid} isAdding={true} setStepComplated={setStepComplated} />)}
                {step === 2 && (<SalaryDetails 
                    submit={submitFormSalaryDetails} 
                    cancel={cancelForm} 
                    setStep={setStep} 
                    step={step} 
                    uuid={tempUuid} 
                    isAdding={true} 
                    isRevise={isRevise} 
                    isEditMode={isEditMode} 
                    setIsRevise={setIsRevise} 
                    setIsEditMode={setIsEditMode} 
                    setShowSalaryDetail={setShowSalaryDetail} 
                    showSalaryDetail={showSalaryDetail}
                    setStepComplated={setStepComplated}
                />)}
                {step === 3 && (<PersonalDetails 
                    cancel={cancelForm} 
                    setStep={setStep} 
                    uuid={tempUuid} 
                    isAdding={true} 
                    setStepComplated={setStepComplated}
                    isAddEmployee={true} 
                />)}
                {step === 4 && (<PaymentInformations 
                    cancel={cancelForm} 
                    setStep={setStep} 
                    step={step} 
                    isAdding={true} 
                    setStepComplated={setStepComplated} 
                    uuid={tempUuid}
                />)}
            </div>
        </div>
      </div>
    );
}

export default FormEmployees;