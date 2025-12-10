import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonReusable from "../../component/buttonReusable";
import { ArrowDown, ClockClockwise, DotsThree, Funnel, Info, MagnifyingGlass, WarningCircle, X } from "@phosphor-icons/react";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import zohoStore from "../../../store/zohoStoreManagement";
import LoadingIcon from "../../component/loadingIcon";
import Modal from "react-modal";
import SimpleModalMessage from "../../component/simpleModalMessage";
import { modalRestrictionEmployee } from "../../../../data/dummy";
import { formatFullDateAndHours } from "../../../../helper/globalHelper";
const baseUrl = import.meta.env.VITE_BASEURL;
const token = localStorage.getItem("zoho_access_token");

function ZohoEmployeesPage() {
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const [empty, setEmpty] = useState(false);
  const { dataEmployees, loading, error, fetchZohoEmployees, asyncDataZohoApi } = zohoStore();
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showModalRestrictions, setShowModalRestrictions] = useState(false);
  const dropdownRef = useRef(null);
  const [syncDate, setSyncDate] = useState(Date.now());
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAddEmployee(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (dataEmployees?.length === 0) {
        const token = localStorage.getItem("zoho_access_token");
        await fetchZohoEmployees(token);
        setSyncDate(Date.now());
      }
    };
  
    fetchData();
  }, [pathname]);

  useEffect(() => {
    const token = localStorage.getItem("zoho_access_token");
    fetchZohoEmployees(token, false, search);
  }, [search]);

  const addEmployees = () => {
    navigate("/add-employees");
  }

  const asyncDataZohoApiCall = async () => {
    let token = localStorage.getItem("zoho_access_token")
    await asyncDataZohoApi(token);
    setSyncDate(Date.now());
  }
  return (
    <div className={`w-full h-screen flex ${!empty ? "items-start" : "items-center"} justify-center pt-12`}>
      {dataEmployees?.length  <= 0 ? (
        <div className="flex h-full items-center justify-center space-x-5">
          <ButtonReusable title={"add data"} action={addEmployees} />
          <ButtonReusable title={"import data"} isBLue={false} />
        </div>
      ) 
      : (
        <div className="w-full">
          <div className="w-full bg-white border-b pt-2 border-gray-200">
            <div className="flex items-center justify-between p-4">
              {/* filter old */}
              {/* <div className="flex items-center space-x-2">
                <h2 className="text-lg font-medium text-gray-800">Active Employees</h2>
                <CaretDown weight="fill" className="text-lg" />
              </div> */}
              <div className="w-[300px] flex items-center justify-center py-1.5 px-2 rounded-md space-x-3 bg-[#EDEDF7] border-[1px]">
                <MagnifyingGlass />
                <input type="text" onChange={(e) => setSearch(e.target.value)} placeholder="search by email..." className="w-full bg-transparent focus:ring-0 outline-none text-sm" />
              </div>
              
              <div className="flex items-center space-x-5">
                <div className="flex items-center text-orange-500 space-x-3">
                  <WarningCircle className="text-lg" />
                  <span>You have 1 incomplete employees.</span>
                  <button className="text-blue-600 hover:underline">View</button>
                </div>

                <div className="flex items-center justify-center space-x-3">
                  <div className="flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 relative rounded-md">
                    <button onClick={
                      ()=> {
                        // addEmployees()
                        asyncDataZohoApiCall();
                      }}
                      className="px-4 py-2"
                    >
                      <p>Instant Sync</p>
                    </button>
                    <button ref={dropdownRef} onClick={
                      ()=> {
                        setShowAddEmployee(true)
                      }}
                      className="h-full px-2 py-3"
                    >
                      <CaretDown className="font-bold text-base" weight="fill" />
                    </button>

                    {showAddEmployee && (
                      <div className="absolute top-11 right-0 w-[200px] bg-white border-[1px] p-2 rounded-md shadow-md">
                        <button onClick={()=>setShowModalRestrictions(true)} className="bg-blue-600 text-white w-full py-2 flex items-center justify-center space-x-2 rounded-md hover:bg-blue-700">
                          Add Employee
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-md border">
                    <DotsThree className="text-3xl" />
                  </button>
                  
                  <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-md border">
                    <Funnel className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="">

            </div>
            {/* filter old */}
            {/* <div className="flex items-center p-4 border-t border-gray-200">
              <span className="text-sm text-gray-500 mr-4">FILTER BY :</span>
              
              <div className="flex space-x-4">
                <div className="relative flex items-center text-gray-600 border border-gray-300 rounded px-3 py-1">
                  <span>Select Work Location</span>
                  <ArrowDown className="ml-2 h-4 w-4" />
                </div>
                
                <div className="relative flex items-center text-gray-600 border border-gray-300 rounded px-3 py-1">
                  <span>Select Department</span>
                  <ArrowDown className="ml-2 h-4 w-4" />
                </div>
                
                <div className="relative flex items-center text-gray-600 border border-gray-300 rounded px-3 py-1">
                  <span>Select Designation</span>
                  <ArrowDown className="ml-2 h-4 w-4" />
                </div>
                
                <div className="relative flex items-center text-blue-600">
                  <span>More Filters</span>
                </div>
              </div>
              
              <div className="ml-auto">
                <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div> */}
          </div>
          <div className="w-full flex items-center justify-start space-x-2 py-2 px-2">
            <div className="w-5 h-5 border-b-[1px]">
              <img src="https://store-images.s-microsoft.com/image/apps.19071.0081b760-2601-4483-b69f-a3627b1a1b36.c381bc22-ca81-493f-aa31-6177a0c5a47d.eafacce7-825d-46fe-a2bf-182c9e3df4db" alt="zoho_people_logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-base font-light">Employee Basic Details are managed and synced from Zoho People:</h1>
            <ClockClockwise className="text-base font-light" />
            <p className="text-base font-light">last sync: <span>{formatFullDateAndHours(syncDate)}</span></p>
          </div>
          {loading ? (
            <div className="w-full h-[500px] flex items-center justify-center">
              <div className="h-20 w-20">
                <LoadingIcon color="#3F8DFB" />
              </div>
            </div>
          ) : (
            <div className="w-full bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 w-8">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EMPLOYEE NAME
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      WORK EMAIL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DEPARTMENT
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      EMPLOYEE STATUS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {!dataEmployees?.message && dataEmployees?.map((employee) => (
                    <tr key={employee["Employee ID"]} onClick={() => navigate(`/employees/${employee["Employee ID"]}`)} className="cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                              <img className="w-full h-full" src={employee?.photo == "-1" ? "https://contacts.zoho.com/file?ID=839307310&fs=thumb" : `${baseUrl}/zoho/show-employee-photo/${employee?.photo}?accessToken=${token}`} alt="user_profiles" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-blue-600">
                              {employee["First Name"]} - {employee["Employee ID"]}
                            </div>
                            <div className="text-sm text-gray-500">{employee["Designation"]}</div>
                          </div>
                        </div>
                      </td>
                      {employee["Onboarding Status"] === "Completed" ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{employee["Email address"] || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{employee["Department"]}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-green-500">{employee["Employee Status"]}</span>
                          </td>
                        </>
                      ) : (
                        <td className="px-6 py-4 whitespace-nowrap" colSpan={3}>
                          <div className="flex bg-[#FFFAF5] px-2 py-3 items-center justify-center">
                            <div className="flex items-center text-orange-500 text-sm space-x-3">
                              <Info weight="fill" className="text-lg" />
                              <span>This employee's profile is incomplete.</span>
                              <button className="text-blue-600 hover:underline">Complete now</button>
                            </div>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* modal */}
      <Modal
          isOpen={showModalRestrictions}
          contentLabel="Full Screen Modal"
          ariaHideApp={false}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            },
            content: {
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: "none",
              backgroundColor: "transparent",
            },
          }}
        >
          <SimpleModalMessage message={modalRestrictionEmployee} showModal={showModalRestrictions} setShowModal={setShowModalRestrictions} />
        </Modal>
    </div>
  );
}

export default ZohoEmployeesPage;