import { ArrowDown, CaretDown, DotsThree, Funnel, Info, WarningCircle, X, ArrowLeft } from "@phosphor-icons/react";
import FilterPage from "../filterPage";
import LoanForm from "./loanForm";
import { useEffect, useState, useMemo } from "react";
import loanStoreManagements from "../../../store/tdPayroll/loan";
import TableReusable from "../setting/tableReusable";
import { loanHeaders, advanceSalaryHeaders } from "../../../../data/dummy";
import PaginationPages from "../paginations";
import LoanDetail from "./loanDetail";


function LoanList({ isAdvance, loanNameUuid, loanName, onBack, showDetail, setShowDetail, setSelectedLoanData, addData, addLoans }) {
  const { getLoan, loanData, loanDataByUuid, getLoanByUuid } = loanStoreManagements();
  const [showFormLoans, setShowFormLoans] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tempUuid, setTempUuid] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  
  // Dynamic initial filter with NEW filter fields
  const [filter, setFilter] = useState({
    employeeUuid: "",
    isSalaryAdvance: isAdvance !== null && isAdvance !== undefined ? isAdvance : "",
    loanNameUuid: loanNameUuid || "",
    // NEW FILTERS
    loanEmployeeUuid: null,
    loanName: null,
    loanStatus: null,
    loanNumber: ''
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
  }, [filter.employeeUuid, filter.isSalaryAdvance, currentPage, isAdvance, loanNameUuid]);

  // Helper function untuk build fetch parameters
  const buildFetchParams = () => {
    const params = {
      limit: 10,
      page: currentPage,
    };

    if (filter.employeeUuid) {
      params.employeeUuid = filter.employeeUuid;
    }

    if (isAdvance !== null && isAdvance !== undefined) {
      params.isSalaryAdvance = isAdvance === true ? 'true' : 'false';
    } else if (filter.isSalaryAdvance !== null && filter.isSalaryAdvance !== undefined && filter.isSalaryAdvance !== "") {
      params.isSalaryAdvance = filter.isSalaryAdvance === true || filter.isSalaryAdvance === 'true' ? 'true' : 'false';
    }

    if (loanNameUuid) {
      params.loanNameUuid = loanNameUuid;
    } else if (filter.loanNameUuid) {
      params.loanNameUuid = filter.loanNameUuid;
    }

    return params;
  };

  // CLIENT-SIDE FILTERING FUNCTION
  const getFilteredLoans = useMemo(() => {
    if (!loanData?.list || !Array.isArray(loanData.list)) return [];
    
    return loanData.list.filter((loan) => {
      // Employee filter (loanEmployeeUuid)
      if (filter.loanEmployeeUuid) {
        const employeeUuid = loan?.Employee?.uuid || loan?.employeeUuid;
        if (employeeUuid !== filter.loanEmployeeUuid) {
          return false;
        }
      }

      // Loan Name filter
      if (filter.loanName) {
        const loanName = loan?.LoanName?.name || loan?.loanType || loan?.loanName;
        if (loanName !== filter.loanName) {
          return false;
        }
      }

      // Loan Status filter
      if (filter.loanStatus && filter.loanStatus !== "All") {
        const status = loan?.status;
        if (status !== filter.loanStatus) {
          return false;
        }
      }

      // Loan Number filter (partial match)
      if (filter.loanNumber) {
        const loanNumber = loan?.loanNumber?.toString() || '';
        if (!loanNumber.includes(filter.loanNumber)) {
          return false;
        }
      }

      return true;
    });
  }, [loanData?.list, filter.loanEmployeeUuid, filter.loanName, filter.loanStatus, filter.loanNumber]);

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
    <div className={`w-full h-screen flex flex-col items-start justify-start relative bg-white`}>
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
              showHeading={false} 
              isAll={true} 
              isHeader={false}
              addData={addData}
              dataTable={loanData?.list}
            />

            <div className="w-full px-1 py-2">
              <div className={`w-full h-screen flex flex-col items-start justify-start relative bg-white`}>
                <TableReusable 
                  dataHeaders={isAdvance ? advanceSalaryHeaders : loanHeaders} 
                  dataTable={getFilteredLoans} 
                  tableFor="loans" 
                  handleView={handleView} 
                />
              </div>
        <div className="w-full h-25 px-1 py-2 bg-white border-t border-gray-200 flex items-center justify-end sticky bottom-0 z-10">
  <PaginationPages 
    totalRecords={loanData?.total || getFilteredLoans.length}
    currentPage={currentPage}
    setCurrentPage={setCurrentPage}
    rowsPerPage={10}
    setRowsPerPage={(value) => {
      // Handle rows per page change if needed
    }}
    rowsPerPageOptions={[10, 20, 50, 100]}
  />
</div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex p-5">
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