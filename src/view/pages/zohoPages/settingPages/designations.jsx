import { useEffect } from "react";
import { designationsDummy, designationsHeaders } from "../../../../../data/dummy";
import zohoStore from "../../../../store/zohoStoreManagement";
import HeaderReusable from "../../../component/setting/headerReusable";
import TableReusable from "../../../component/setting/tableReusable";
import { useLocation } from "react-router-dom";

function Designations() {
    const { fetchZohoCompanyStructure, dataCompanyStructure, loading } = zohoStore();
    const {pathname} = useLocation();

    useEffect(() => {
        if(!dataCompanyStructure){
          const token = localStorage.getItem("zoho_access_token");
          fetchZohoCompanyStructure(token);
        }
    }, [pathname]);
    return (
        <div className="w-full h-full flex-col flex items-start justify-start">
            <HeaderReusable title="Designations" isAddData={true} addDataTitle="New Designations" isDonwload={true} needIconAddData={true} />
            <TableReusable dataHeaders={designationsHeaders} dataTable={dataCompanyStructure?.designations} tableFor="Designations" />
        </div>
    );
}

export default Designations;
  