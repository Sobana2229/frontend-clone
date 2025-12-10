import { Pencil } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import SalaryDetails from "../../../component/formAddEmployees/salaryDetails";
import { useParams } from "react-router-dom";
import { PencilLineIcon } from "@phosphor-icons/react/dist/ssr";
import authStoreManagements from "../../../../store/tdPayroll/auth";
import { checkPermission } from "../../../../../helper/globalHelper";

function SalaryEmployeeDetail() {
  const { user } = authStoreManagements(); 
  const { id } = useParams();
  const [showSalaryDetail, setShowSalaryDetail] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isRevise, setIsRevise] = useState(false);

  const handleCancel = () => {
    setShowSalaryDetail(false);
    setIsRevise(false);
    setIsEditMode(!isEditMode)
  }
  return (
    <div className={`w-full h-fit flex flex-col items-start justify-start p-5`}>
      {checkPermission(user, "Salary Details", "View") ? (
        showSalaryDetail ? (
          <div className="w-full flex items-center justify-center">
            <SalaryDetails 
              cancel={handleCancel} 
              uuid={id}  
              isRevise={isRevise} 
              isEditMode={isEditMode} 
              setIsRevise={setIsRevise} 
              setIsEditMode={setIsEditMode} 
              setShowSalaryDetail={setShowSalaryDetail} 
              showSalaryDetail={showSalaryDetail} 
            />
          </div>
        ) : (
          <div className="flex flex-col items-start justify-start w-full bg-white rounded-lg">
            {checkPermission(user, "Salary Details", "Edit") && (
              !isRevise && (
                <div className="w-full flex items-center justify-start px-10 pt-10 pb-4 space-x-2">
                  <p className="text-xl font-medium">Salary Details</p>
                  <button onClick={() => {
                    setShowSalaryDetail(!showSalaryDetail)
                    setIsEditMode(!isEditMode)
                  }}><PencilLineIcon className="text-2xl" /></button>
                </div>
              )
            )}
            <div className="w-full flex items-center justify-center">
              <SalaryDetails 
                cancel={handleCancel} 
                uuid={id}  
                isRevise={isRevise} 
                isEditMode={isEditMode} 
                setIsRevise={setIsRevise} 
                setIsEditMode={setIsEditMode} 
                setShowSalaryDetail={setShowSalaryDetail} 
                showSalaryDetail={showSalaryDetail} 
              />
            </div>
          </div>
        )
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default SalaryEmployeeDetail;