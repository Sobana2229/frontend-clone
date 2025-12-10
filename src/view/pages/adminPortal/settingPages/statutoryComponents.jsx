import { useEffect, useState } from "react";
import { tabsStatutoryComponents } from "../../../../../data/dummy";
import HeaderReusable from "../../../component/setting/headerReusable";
import ButtonReusable from "../../../component/buttonReusable";
import FormSpkStatutoryComponents from "../../../component/setting/StatutoryComponents/formSpkStatutoryComponents";
import statutoryComponentStoreManagements from "../../../../store/tdPayroll/setting/statutoryComponent";
import EmployeesProvidentFundDisplay from "../../../component/setting/StatutoryComponents/employeesProvidentFundDisplay";

function StatutoryComponents() {
    const { fetchStatutoryComponent, statutoryComponentSpk } = statutoryComponentStoreManagements();
    const [showForm, setShowForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    
    useEffect(() => {
        if(!fetchStatutoryComponent){
            const access_token = localStorage.getItem("accessToken");
            fetchStatutoryComponent(access_token, "spk");
        }
    }, []);
    
    return (
        <>
            {!showForm ? (
                <div className="w-full h-full flex-col flex items-start justify-start bg-white rounded-md pb-10">
                    <EmployeesProvidentFundDisplay data={statutoryComponentSpk} setShowForm={setShowForm} setIsEdit={setIsEdit} />
                </div>
            ) : (
                <FormSpkStatutoryComponents setShowForm={setShowForm} isEdit={isEdit} />
            )}
            
        </>
    );
}

export default StatutoryComponents;
  