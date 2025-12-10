import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import payrunStoreManagements from "../../../../store/tdPayroll/payrun";
import payScheduleStoreManagements from "../../../../store/tdPayroll/setting/paySchedule";

dayjs.extend(utc);

function PriorPayrun({ handleBack, setShowPrior }) {
  const { getPayrunData, firstPayrunData } = payrunStoreManagements();
  const { fetchPaySchedule, payScheduleData } = payScheduleStoreManagements();
  const [periods, setPeriods] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!firstPayrunData) {
      getPayrunData(token, {}, "first-payroll");
    }
  }, [firstPayrunData]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!payScheduleData) {
      const params = {
        type: "prior-payroll"
      }
      fetchPaySchedule(token, params);
    }
  }, [payScheduleData]);

  // ✅ FILTER PERIODS DARI PAYSCHEDULEANDPRIORPAYRUN
  useEffect(() => {
    if (!payScheduleData?.PayScheduleAndPriorPayruns) return;

    // Extract values dari PayScheduleAndPriorPayruns
    const priorPayrunValues = payScheduleData.PayScheduleAndPriorPayruns.map(
      item => item.value
    );

    // ✅ SORT BULAN CHRONOLOGICALLY
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const sortedPeriods = priorPayrunValues.sort((a, b) => {
      // Extract month dari period string (e.g., "January 2025" -> "January")
      const monthA = a.split(' ')[0];
      const monthB = b.split(' ')[0];
      
      // Jika bulan sama, sort by year
      if (monthOrder.indexOf(monthA) === monthOrder.indexOf(monthB)) {
        const yearA = parseInt(a.split(' ')[1]);
        const yearB = parseInt(b.split(' ')[1]);
        return yearA - yearB;
      }
      
      // Sort by month order
      return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
    });

    setPeriods(sortedPeriods);
  }, [payScheduleData]);

  return (
    <div className="w-full h-full pt-12 px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Prior Payroll</h1>
        <div className="flex items-center space-x-4">
          <button
            className="text-blue-600 hover:underline border-r pr-4"
            onClick={() => setShowPrior(false)}
          >
            Disable Prior Payroll
          </button>
          <button
            className="w-7 h-7 font-bold text-xl pb-1 bg-gray-100 rounded-full flex items-center justify-center"
            onClick={() => setShowPrior(false)}
          >
            ×
          </button>
        </div>
      </div>

      <p className="mb-6">
        Since you've already paid employees during the current fiscal year, you need to input all employees' YTD
        earnings and tax deducted information on monthly basis before running your payroll. This will ensure
        accurate calculation of taxes.
      </p>

      <div className="border border-gray-300 rounded p-6 mb-6">
        <p className="mb-4 font-semibold text-gray-700">
          The following data of your past payroll are required:
        </p>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <ul className="list-disc list-inside space-y-1">
            <li>Basic</li>
            <li>HRA</li>
            <li>Other Earnings</li>
            <li>Allowances</li>
            <li>Statutory Components</li>
            <li>Deductions</li>
          </ul>
          <ul className="list-disc list-inside space-y-1">
            <li>Loans</li>
            <li>LOP Days</li>
            <li>Reimbursements</li>
          </ul>
        </div>
        <hr className="my-4" />
        <p className="text-sm text-gray-500 mb-2">
          You need to enter these details for each of the following payroll periods
        </p>
        {/* ✅ UPDATED DISPLAY */}
        <div className="flex flex-wrap gap-2">
          {periods && periods.length > 0 ? (
            periods.map((period) => (
              <span
                key={period}
                className="px-3 py-1 text-gray-700 border-r-2"
              >
                {period}
              </span>
            ))
          ) : (
            <span className="text-gray-400">No periods to import</span>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleBack}
          className={`px-4 py-2 rounded ${
            periods && periods.length > 0
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!periods || periods.length === 0}
        >
          Set up Prior Payroll
        </button>
        <button
          onClick={() => setShowPrior(false)}
          className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
}

export default PriorPayrun;
