import { tamplateTypeDummy, tamplateTypeHeaders } from "../../../../../data/dummy";
import HeaderReusable from "../../../component/setting/headerReusable";
import TableReusable from "../../../component/setting/tableReusable";

function EmailTemplates() {
    return (
        <div className="w-full h-full flex-col flex items-start justify-start">
            <HeaderReusable title="Email Templates" />
            <TableReusable dataHeaders={tamplateTypeHeaders} dataTable={tamplateTypeDummy} tableFor="EmailTemplates" />
        </div>
    );
}

export default EmailTemplates;
  