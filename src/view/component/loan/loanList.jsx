import { ArrowDown, CaretDown, DotsThree, Funnel, Info, WarningCircle, X, ArrowLeft } from "@phosphor-icons/react";
import FilterPage from "../filterPage";
import LoanForm from "./loanForm";
import { useEffect, useState } from "react";
import loanStoreManagements from "../../../store/tdPayroll/loan";
import TableReusable from "../setting/tableReusable";
import { loanHeaders, advanceSalaryHeaders } from "../../../../data/dummy";
import PaginationPages from "../paginations";
import LoanDetail from "./loanDetail";


function LoanList({ isAdvance, loanNameUuid, loanName, onBack, showDetail, setShowDetail, setSelectedLoanData}) {
  const { getLoan, loanData, loanDataByUuid, getLoanByUuid } = loanStoreManagements();
  const [showFormLoans, setShowFormLoans] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tempUuid, setTempUuid] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  
  // Dynamic initial filter berdasarkan props
  const [filter, setFilter] = useState({
    employeeUuid: "",
    isSalaryAdvance: isAdvance !== null && isAdvance !== undefined ? isAdvance : "",
    loanNameUuid: loanNameUuid || "",
  });
  
  // Update filter when props change
  useEffect(() => {
    setFilter(prev => ({
      ...prev,
      isSalaryAdvance: isAdvance !== null && isAdvance !== undefined ? isAdvance : prev.isSalaryAdvance,
      loanNameUuid: loanNameUuid || prev.loanNameUuid,
    }));
  }, [isAdvance, loanNameUuid]);

  // Initial fetch dengan dynamic params
  useEffect(() => {
    const params = buildFetchParams();
    const access_token = localStorage.getItem("accessToken");
    getLoan(access_token, "loan", params);
  }, [isAdvance, loanNameUuid]);

  // Filter-based fetch
  useEffect(() => {
    const params = buildFetchParams();
    const access_token = localStorage.getItem("accessToken");
    getLoan(access_token, "loan", params);
  }, [filter, currentPage, isAdvance, loanNameUuid]);

  // Helper function untuk build fetch parameters
  const buildFetchParams = () => {
    const params = {
      limit: 10,
      page: currentPage,
    };

    // Add filters berdasarkan kondisi
    if (filter.employeeUuid) {
      params.employeeUuid = filter.employeeUuid;
    }

    // Handle isSalaryAdvance filtering
    if (isAdvance !== null && isAdvance !== undefined) {
      // Jika isAdvance di-set dari props, gunakan itu (convert boolean to string for query param)
      params.isSalaryAdvance = isAdvance === true ? 'true' : 'false';
    } else if (filter.isSalaryAdvance !== null && filter.isSalaryAdvance !== undefined && filter.isSalaryAdvance !== "") {
      // Jika ada filter manual dari user
      params.isSalaryAdvance = filter.isSalaryAdvance === true || filter.isSalaryAdvance === 'true' ? 'true' : 'false';
    }

    // Handle loanNameUuid filtering
    if (loanNameUuid) {
      // Jika loanNameUuid di-set dari props (specific loan type)
      params.loanNameUuid = loanNameUuid;
    } else if (filter.loanNameUuid) {
      // Jika ada filter manual dari user
      params.loanNameUuid = filter.loanNameUuid;
    }

    return params;
  };

  const handleView = async (uuid, item, type) => {
    setTempUuid(uuid);
    const access_token = localStorage.getItem("accessToken");
    await getLoanByUuid(access_token, uuid)
    setShowDetail(true);
  }

  const handleShowForm = () => {
    setShowFormLoans(!showFormLoans);
    setShowDetail(false);
  }

  return (
    <div className={`w-full h-screen flex flex-col items-start justify-start relative bg-gray-td-100`}>
      {showDetail ? (
        <LoanDetail 
          setShowDetail={setShowDetail} 
          setShowFormLoans={handleShowForm} 
          data={loanDataByUuid} 
          dataList={loanData?.list} 
          tempUuid={tempUuid} 
          handleView={handleView} 
          setIsUpdate={setIsUpdate}
          setSelectedLoanData={setSelectedLoanData}
          isAdvance={isAdvance}
          loanNameUuid={loanNameUuid}
        />
      ) : (
        !showFormLoans ? (
          <>
            <FilterPage 
              filterFor={"Loans"} 
              onlyAll={true} 
              setFilter={setFilter} 
              filter={filter} 
              isAll={true} 
              isHeader={false}
            />

            <div className="w-full px-10 py-2">
              <div className="w-full h-[700px] bg-white relative overflow-y-auto rounded-xl overflow-hidden">
                <TableReusable 
                  dataHeaders={isAdvance ? advanceSalaryHeaders : loanHeaders} 
                  dataTable={loanData?.list} 
                  tableFor="loans" 
                  handleView={handleView} 
                />
                <div className="w-full absolute bottom-5 flex items-center justify-end">
                  <PaginationPages 
                    totalPages={loanData?.totalPage} 
                    currentPage={currentPage} 
                    setCurrentPage={setCurrentPage} 
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full p-5">
            <LoanForm 
              setShowForm={handleShowForm} 
              isAdvance={isAdvance}
              data={loanDataByUuid} 
              isUpdate={isUpdate}
              setShowDetail={setShowDetail}
            />
          </div>
        )
      )}
    </div>
  );
}

export default LoanList;