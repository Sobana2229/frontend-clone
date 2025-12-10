import CardSetting from "../../../component/setting/cardSetting";
import { dummyLoops } from "../../../../../data/dummy";
import HeaderReusable from "../../../component/setting/headerReusable";
import { useLocation } from "react-router-dom";
import zohoStore from "../../../../store/zohoStoreManagement";
import { useEffect } from "react";

function WorkLocations() {
    const { fetchZohoOrganisationProfile, dataWorkLocation, loading } = zohoStore();
    const {pathname} = useLocation();

    useEffect(() => {
        if(!dataWorkLocation){
          const token = localStorage.getItem("zoho_access_token");
          fetchZohoOrganisationProfile(token);
        }
    }, [pathname]);

    return (
     <div className="w-full h-full flex-col flex items-start justify-start">
        <HeaderReusable title="Work Locations" isAddData={true} addDataTitle="add work locations" isDonwload={true} />
        <div className="w-full grid grid-cols-3 items-start justify-start p-5 gap-5">
            <CardSetting data={dataWorkLocation} cardFor="workLocations" />     
        </div>
     </div>
    );
}

export default WorkLocations;
  