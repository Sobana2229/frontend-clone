import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FormWorkLocation from "../setting/Organisation/formWorkLocation";
import organizationStoreManagements from "../../../store/tdPayroll/setting/organization";

function WorkLocationForm({setShowFormOrganizationProfiles, data, isUpdate=false, tempUuid, setTempUuid}) {
    const {pathname} = useLocation();
    const { fetchOrganizationSetting, workLocationList, loading } = organizationStoreManagements();
    
    useEffect(() => {
        if(workLocationList.length === 0){
            const access_token = localStorage.getItem("accessToken");
            fetchOrganizationSetting("work-location", access_token, true);
        }
    }, [pathname]);
    
    const handleRefreshData = async () => {
        const access_token = localStorage.getItem("accessToken");
        await fetchOrganizationSetting("work-location", access_token, true);
    };

    const handleCloseForm = () => {
        setShowFormOrganizationProfiles("");
    };
    return (
        <div className="w-full flex-1 flex flex-col items-start justify-start p-5 bg-gray-td-200 overflow-y-auto">
            <div className="w-full flex-1 p-5 bg-white rounded-md">
                {isUpdate ? (
                    <FormWorkLocation 
                        setClose={handleCloseForm}
                        isSetting={true} 
                        data={data} 
                        uuid={tempUuid} 
                        setUuid={setTempUuid}
                        onUpdateSuccess={handleRefreshData}
                    />
                ) : (
                    <FormWorkLocation 
                        setClose={handleCloseForm}
                        formFor={"worklocations"}
                        titleForm={"Work Locations"}
                        onUpdateSuccess={handleRefreshData}
                    />
                )}
            </div>
        </div>
    );
}

export default WorkLocationForm;