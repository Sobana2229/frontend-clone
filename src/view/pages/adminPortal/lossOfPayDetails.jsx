import { useLocation, useNavigate } from "react-router-dom";
import zohoStore from "../../../store/zohoStoreManagement";
import { useEffect, useState } from "react";
import LoadingIcon from "../../component/loadingIcon";
import TableReusable from "../../component/tableReusable";
import MonthlyNavigator from "../../component/monthlyNavigator";
import dayjs from "dayjs";

function LossOfPayDetails() {
  const { dataLossOfPayDetails, loading, fetchLossOfPayDetails } = zohoStore();
  const {pathname} = useLocation();
  const [monthOffset, setMonthOffset] = useState(0);
  const baseStart = dayjs().startOf("month");
  const startDate = baseStart.add(monthOffset, "month");
  const endDate = startDate.endOf("month");

  useEffect(() => {
    if(dataLossOfPayDetails?.length === 0){
      const token = localStorage.getItem("zoho_access_token");
      fetchLossOfPayDetails(token, {
        startDate: startDate.format("DD-MMM-YYYY"),
        endDate: endDate.format("DD-MMM-YYYY"),
      });
    }
  }, [pathname]);

  const handleMonthChange = (delta) => {
    const newOffset = monthOffset + delta;
    setMonthOffset(newOffset);

    const newStart = baseStart.add(newOffset, "month");
    const newEnd = newStart.endOf("month");
    const token = localStorage.getItem("zoho_access_token");

    fetchLossOfPayDetails(token, {
      startDate: newStart.format("DD-MMM-YYYY"),
      endDate: newEnd.format("DD-MMM-YYYY"),
    });
  };
  
  return (
    <div
      className={`w-full h-screen flex ${
        dataLossOfPayDetails?.length < 15 ? "items-start" : "items-center"
      } justify-center pt-14 px-2`}
    >
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="h-20 w-20">
            <LoadingIcon color="#3F8DFB" />
          </div>
        </div>
      ) : dataLossOfPayDetails?.length <= 0 ? (
        <div className="flex flex-col h-full items-center justify-start space-x-5">
          <MonthlyNavigator
            startDate={startDate}
            endDate={endDate}
            onMonthChange={handleMonthChange}
          />
          {/* Empty state */}
          <div className="text-center">
            <p className="text-lg font-medium text-gray-600">No leaves data available</p>
            <p className="text-sm text-gray-500">Try selecting a different week</p>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="w-full bg-white">
            <MonthlyNavigator
              startDate={startDate}
              endDate={endDate}
              onMonthChange={handleMonthChange}
            />
            <div className="w-full bg-white rounded-lg shadow-sm">
                <TableReusable data={dataLossOfPayDetails} tableFor="lossOfPayDetails" isTableFull={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LossOfPayDetails;