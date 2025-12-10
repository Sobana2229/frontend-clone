import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonReusable from "../../component/buttonReusable";
import { EnvelopeSimple } from "@phosphor-icons/react";
import LoadingIcon from "../../component/loadingIcon";
import { tableHeadEmployee, workLocations } from "../../../../data/dummy";
import employeeStoreManagements from "../../../store/tdPayroll/employee";
import PaginationPages from "../../component/paginations";
import FilterPage from "../../component/filterPage";
import ToggleAction from "../../component/toggle";
import { toast } from "react-toastify";
import { CustomToast } from "../../component/customToast";

function EmployeesPage() {
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const { dataEmployees, loading, fetchEmployeeList, totalPage, updateEmployee } = employeeStoreManagements();
  const [currentPage, setCurrentPage] = useState(1);
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);
  const [filter, setFilter] = useState({
    workLocationUuid: "",
    designationUuid: "",
    departementUuid: "",
    status: "all",
  });
  const isFilterEmpty = Object.values(filter).every((v) => !v);


  // ✅ Single useEffect to handle all fetch scenarios
  useEffect(() => {
    const params = {
      workLocationUuid: filter.workLocationUuid,
      designationUuid: filter.designationUuid,
      departementUuid: filter.departementUuid,
      status: filter.status,
      limit: 10, 
      page: currentPage,
    };
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchEmployeeList(token, params);
    }
  }, [filter, currentPage, pathname]); // ✅ Include pathname to refresh when navigating back from add-employees


  const handleUpdatePortalAccess = async (uuid, toggleStatus) => {
    const payload = {
      isEnablePortalAccess: toggleStatus,
    } 
    const access_token = localStorage.getItem("accessToken");
    const response = await updateEmployee(payload, access_token, uuid);
    if(response){
      await fetchEmployeeList(access_token);
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
  };
  const addEmployees = () => {
    navigate("/add-employees");
  }

  const filteredEmployees = showIncompleteOnly 
    ? dataEmployees?.list?.filter(emp => emp?.stepComplated !== 3)
    : dataEmployees?.list;
    
  return (
    <div className={`w-full h-screen flex items-start justify-center pt-16 overflow-hidden bg-gray-td-100`}>
      {loading ? 
        <div className="w-full h-screen flex items-center justify-center">
          <div className="w-20 h-20">
            <LoadingIcon color="blue" /> 
          </div>
        </div>
        : 
        (dataEmployees?.length  <= 0 && isFilterEmpty) ? (
          <div className="flex h-full items-center justify-center space-x-5">
            <ButtonReusable title={"add data"} action={addEmployees} />
            <ButtonReusable title={"import data"} isBLue={false} />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col">
            <FilterPage 
              filterFor="employee" 
              addData={addEmployees} 
              setFilter={setFilter} 
              filter={filter}
              showIncompleteOnly={showIncompleteOnly}
              setShowIncompleteOnly={setShowIncompleteOnly}
            />
            {loading ? (
              <div className="w-full h-[500px] flex items-center justify-center">
                <div className="h-20 w-20">
                  <LoadingIcon color="#3F8DFB" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-1 overflow-hidden px-10">
                <div className="flex-1 overflow-y-auto rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg">
                        {tableHeadEmployee?.map((el, idx) =>
                          el === "action" ? (
                            <th
                              key={`head-${idx}`}
                              scope="col"
                              className={`px-6 py-6 bg-[#F5FAFF] text-blue-td-500 ${el == "Consider for SPK" ? "text-center" : "text-left"} text-sm font-medium uppercase tracking-wider border-b-[1px]`}
                            >
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                              />
                            </th>
                          ) : (
                            <th
                              key={`head-${idx}`}
                              scope="col"
                              className={`px-6 py-6 bg-[#F5FAFF] text-blue-td-500 ${el == "Consider for SPK" ? "text-center" : "text-left"} text-sm font-medium uppercase tracking-wider border-b-[1px]`}
                            >
                              {el}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEmployees?.map((employee) => (
                        <tr key={employee["uuid"]} className={
                          employee["stepComplated"] !== 3 ? "bg-[#FFF9F2]" : undefined
                        }>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                          </td>
                          <td onClick={() => navigate(`/employees/${employee["uuid"]}`)} className="px-6 py-4 cursor-pointer align-top">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-td-50 flex items-center justify-center text-blue-td-500 overflow-hidden">
                                  <p>
                                    {employee?.firstName?.charAt(0).toUpperCase()}
                                  </p>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-blue-600 break-words max-w-xl whitespace-normal">
                                  {employee["firstName"]} {employee["middleName"]} {employee["lastName"]} - {employee["employeeId"]}
                                </div>
                                <div className="text-sm text-gray-500">{employee["Designation"]["name"]}</div>
                              </div>
                            </div>
                          </td>
                          {employee["stepComplated"] === 3 ? (
                            <>
                              <td onClick={() => navigate(`/employees/${employee["uuid"]}`)} className="px-6 py-4 whitespace-nowrap cursor-pointer">
                                <div className="text-sm text-gray-td-400">
                                  <div className="relative group ps-[20%]">
                                    <EnvelopeSimple size={25} className="text-gray-td-400 cursor-pointer" />
                                    
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-[27%] transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 whitespace-nowrap">
                                      {employee["email"] || 'No email'}
                                      
                                      {/* Arrow */}
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td onClick={() => navigate(`/employees/${employee["uuid"]}`)} className="px-6 py-4 whitespace-nowrap cursor-pointer">
                                <div className="text-lg font-normal text-gray-td-400">{employee["Designation"]["name"]}</div>
                              </td>
                              <td onClick={() => navigate(`/employees/${employee["uuid"]}`)} className="px-6 py-4 whitespace-nowrap cursor-pointer">
                                <div className="flex flex-col items-start justify-start space-y-2 ps-[20%]">
                                      <div className={`flex items-center justify-center px-10 py-1 ${employee["status"]?.toLowerCase() === "active" ? "bg-green-td-50" : "bg-gray-td-50"} rounded-full`}>
                                          <p className={`${employee["status"]?.toLowerCase() === "active" ? "text-green-td-600" : "text-gray-td-600"} text-sm font-normal`}>{employee["status"]?.toLowerCase() === "active" ? "Active" : "Inactive"}</p>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div 
                                  className="flex flex-col items-start justify-start space-y-2 ps-[20%]"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ToggleAction 
                                    isEnabled={employee?.isEnablePortalAccess} 
                                    handleSubmit={handleUpdatePortalAccess} 
                                    data={employee} 
                                  />
                                </div>
                              </td>
                            </>
                          ) : (
                            <td className="px-6 py-4 whitespace-nowrap" colSpan={4}>
                              <div className="flex px-2 py-3 items-center justify-center">
                                <div className="flex items-center text-orange-500 text-base space-x-3">
                                  <span className="">This Employee's Profile is incomplete.</span>
                                  <button 
                                    onClick={() => navigate(`/employees/${employee["uuid"]}`)}
                                    className="text-blue-600 hover:underline cursor-pointer"
                                  >
                                    Complete now
                                  </button>
                                </div>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="w-full flex items-center justify-end py-4">
                  <PaginationPages totalPages={dataEmployees?.totalPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
}


export default EmployeesPage;
