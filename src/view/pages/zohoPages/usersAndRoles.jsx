import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RoleSettingDummy, RoleSettingHeaders, tabsUserAndRoles, userSettingDummy, userSettingHeaders } from "../../../../../data/dummy";
import HeaderReusable from "../../../component/setting/headerReusable";
import TableReusable from "../../../component/setting/tableReusable";
import zohoStore from "../../../../store/zohoStoreManagement";

function UsersAndRoles() {
    const [activeTab, setActiveTab] = useState(tabsUserAndRoles[0]);
    const { fetchZohoUserAndRoles, dataUserAndRoles, loading } = zohoStore();
    const {pathname} = useLocation();

    useEffect(() => {
        if(!dataUserAndRoles){
          const token = localStorage.getItem("zoho_access_token");
          fetchZohoUserAndRoles(token);
        }
    }, [pathname]);

    return (
        <div className="w-full h-full flex-col flex items-start justify-start">
            <HeaderReusable title="Users & Roles" tabs={tabsUserAndRoles} activeTab={activeTab} setActiveTab={setActiveTab} needTabs={true} isAddData={true} addDataTitle="Invite User" />
            {activeTab === "Users" ? (
                <TableReusable dataHeaders={userSettingHeaders} dataTable={dataUserAndRoles?.users} tableFor="UserSettings" />
            ) : (
                <TableReusable dataHeaders={RoleSettingHeaders} dataTable={dataUserAndRoles?.roles} tableFor="RoleSettings" />
            )}
        </div>
    );
}

export default UsersAndRoles;
  