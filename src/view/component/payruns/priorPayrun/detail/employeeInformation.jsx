import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import employeeStoreManagements from "../../../../../store/tdPayroll/employee";

function PriorPayrunEmployeeInformation({ onComplete, setShowPrior }) {
  const { pathname } = useLocation();
  const { dataEmployeeAll, loading, fetchEmployeeList } = employeeStoreManagements();

  useEffect(() => {
    if (dataEmployeeAll?.length === 0) {
      const token = localStorage.getItem("accessToken");
      fetchEmployeeList(token, { all: true });
    }
  }, [pathname, dataEmployeeAll, fetchEmployeeList]);

  const totalEmployees = dataEmployeeAll?.length || 0;
  const activeEmployees = dataEmployeeAll?.filter(emp => emp?.status === "active")?.length || 0;
  const exitedEmployees = dataEmployeeAll?.filter(emp => emp?.status === "exited")?.length || 0;

  return (
    <div>
      <p className="mb-4">
        Ensure that you have added details of both current and dismissed employees you have paid this year.
      </p>
      <div className="flex gap-12 mb-8 text-gray-700">
        <div>
          <div className="text-base">Total Employees</div>
          <div className="text-2xl font-semibold mt-1">{totalEmployees}</div>
        </div>
        <div>
          <div className="text-base">Active Employees</div>
          <div className="text-2xl font-semibold mt-1">{activeEmployees}</div>
        </div>
        <div>
          <div className="text-base">Exited Employees</div>
          <div className="text-2xl font-semibold mt-1">{exitedEmployees}</div>
        </div>
        <Link to="/add-employees" className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 self-start">
          Add Employee
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading employees...</div>
      ) : dataEmployeeAll?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No employees found.</div>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2">EMPLOYEE NAME</th>
              <th className="py-2">WORK EMAIL</th>
              <th className="py-2">EMPLOYEE STATUS</th>
            </tr>
          </thead>
          <tbody>
            {dataEmployeeAll.map(emp => (
              <tr key={emp?.uuid} className="border-b border-gray-100">
                <td className="py-2">
                  {emp?.firstName} {emp?.middleName ? emp.middleName + " " : ""}{emp?.lastName}
                </td>
                <td className="py-2">{emp?.email}</td>
                <td className={`py-2 ${emp?.status === "active" ? "text-green-600" : "text-red-500"}`}>
                  {emp?.status?.charAt(0)?.toUpperCase()}{emp?.status?.slice(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex gap-4 mt-6">
        <button
          onClick={onComplete}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Next
        </button>
        <button
          onClick={() => setShowPrior(false)}
          className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
        >
          Set up Later
        </button>
      </div>
    </div>
  );
}

export default PriorPayrunEmployeeInformation;
