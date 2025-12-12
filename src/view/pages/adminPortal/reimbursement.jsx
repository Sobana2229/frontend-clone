import { useEffect, useState } from "react";
import reimbursementStoreManagements from "../../../store/tdPayroll/approval/reimbursement";
import PaginationPages from "../../component/paginations";
import TableReusable from "../../component/setting/tableReusable";
import { reimbursementEmployeeApprovalHeaders } from "../../../../data/dummy";
import { toast } from "react-toastify";
import { CustomToast } from "../../component/customToast";
import authStoreManagements from "../../../store/tdPayroll/auth";
import { checkPermission } from "../../../../helper/globalHelper";
import FilterPage from "../../component/filterPage";
import FormReimbursementEmployeePortal from "../../component/employeePortal/formReimbursement";
import subSidebarStoreManagements from "../../../store/tdPayroll/setting/subSidebarStoreManagements";

const styles = {
  tableWrapper: {
    width: "100%",
    height: "100%",
    padding: "0 40px 40px 40px",
  }
};

function Reimbursement() {
  const {
    getReimbursementEmployeeList,
    reimbursementEmployeeList,
    loading,
    modifyReimbursementEmployee
  } = reimbursementStoreManagements();

  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const { user } = authStoreManagements();
  const { setSubSidebarState, resetSubSidebarState } = subSidebarStoreManagements();


  const [filter, setFilter] = useState({
    period: "",
    employeeUuid: "",
    status: "all",
  });

  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");

    if(!reimbursementEmployeeList){
      getReimbursementEmployeeList(access_token, 'reimbursement');
    }
    else if (filter.employeeUuid || filter.period) {
      const params = {
        ...filter,
        page: currentPage,
      };
      getReimbursementEmployeeList(access_token, 'reimbursement', params);
    }
  }, [filter, currentPage]);
  
  // define what to show on header subsidebar
  useEffect(() => {
    defaultSubSidebarState();
    return () => {
      resetSubSidebarState();
    };
  }, [filter]);

  const handleEdit = async (uuid, type, amountApproved) => {
    const access_token = localStorage.getItem("accessToken");
    const payload = amountApproved !== undefined && amountApproved !== null
      ? { amountApproved }
      : {};
    const response = await modifyReimbursementEmployee(access_token, uuid, type, payload);
    if(response){
      await getReimbursementEmployeeList(access_token, 'reimbursement');
      toast(<CustomToast message={response} status={"success"} />, {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0
        }
      });    
    }
  }


  const handleCancel = () => {
    defaultSubSidebarState();
    setShowForm(false);
  }
  
  const addReimbursement = () => {
    setSubSidebarState({ 
      showSubSidebar: false,
      showAddButton: false,
      showX: true,
      showThreeDots: false,
      showHeaderDropDown: false,
      forceHeaderLabel: "New Claim" 
    });
    setShowForm(true);
  }

  const defaultSubSidebarState = () => {
    // reset sub sidebar to "reimbursement page default"
    setSubSidebarState({
      showSubSidebar: true,
      showAddButton: true,
      showX: true,
      showThreeDots: true,
      showHeaderDropDown: true,
      forceHeaderLabel: "",
      headerDropDownProps: {
        filterFor: "claims",
        filter: filter,
        setFilter: setFilter,
      },
      addButtonFunction: addReimbursement,
      cancelButtonFunction: handleCancel,
    })
  }

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div 
      className="
        w-full h-full 
        flex flex-col items-start justify-start 
        bg-white
      "
    >
      {checkPermission(user, "Reimbursements", "View") ? (
        
        !showForm ? (
          <div className="w-full flex-1 flex flex-col overflow-hidden relative">
            {/* FILTER BAR */}
            <FilterPage
              isHeader={false}
              filterFor="claims"
              addData={null}
              setFilter={setFilter}
              filter={filter}
            />

            {/* TABLE */}
            <div style={styles.tableWrapper}>
              <TableReusable
                dataHeaders={reimbursementEmployeeApprovalHeaders}
                dataTable={reimbursementEmployeeList?.list}
                tableFor={"reimbursementEmployeeApproval"}
                handleEdit={handleEdit}
                formatFunction={formatCurrency}
              />
            </div>

            {/* PAGINATION */}
            <div className="absolute bottom-5 right-10 left-10 flex items-center justify-end">
              <PaginationPages
                totalPages={reimbursementEmployeeList?.totalPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        ) : (
            <div className="w-full flex-1 overflow-y-auto p-6">
              <FormReimbursementEmployeePortal
                key={"create"}
                handleCancel={handleCancel}
                data={null}
                isUpdate={false}
                tempUuid={""}
              />
            </div>
        )
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}


export default Reimbursement;