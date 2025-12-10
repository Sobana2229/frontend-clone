import { useLocation } from "react-router-dom";
import { dapartementDummy, dapartementHeaders } from "../../../../../data/dummy";
import zohoStore from "../../../../store/zohoStoreManagement";
import HeaderReusable from "../../../component/setting/headerReusable";
import TableReusable from "../../../component/setting/tableReusable";
import { useEffect } from "react";

function Departments() {
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
            <HeaderReusable title="Departments" isAddData={true} addDataTitle="New Departments" isDonwload={true} needIconAddData={true} />
            <TableReusable dataHeaders={dapartementHeaders} dataTable={dataCompanyStructure?.departments} tableFor="Departments" />
        </div>
    );
}

export default Departments;
  