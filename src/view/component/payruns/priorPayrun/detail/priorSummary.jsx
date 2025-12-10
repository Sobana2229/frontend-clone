import { useEffect } from "react";
import payrunStoreManagements from "../../../../../store/tdPayroll/payrun";
import { toast } from "react-toastify";
import { CustomToast } from "../../../customToast";

function PriorSummary({ setShowPrior, setActiveTab }) {
  const {
    getPayrunData,
    createPriorPayrun,
    priorPayrun,      // { unmappedFields: number, periods: string[] }
    loading,
    error
  } = payrunStoreManagements();

  // Fetch the summary on mount
  useEffect(() => {
    if (!priorPayrun) {
      const access_token = localStorage.getItem("accessToken");
      getPayrunData(access_token, {}, "prior-payrun");
    }
  }, [priorPayrun, getPayrunData]);

  const handleCancel = () => {
    setShowPrior(false);
  };

  const handleSubmit = async () => {
    const access_token = localStorage.getItem("accessToken");
    const response = await createPriorPayrun(access_token);
    if (response) {
      await getPayrunData(access_token, { limit: 10, page: 1 }, "history");
      toast(<CustomToast message={response} status={"success"} />, {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0
        }
      });
      setShowPrior(false);
    }
  };

  if (loading) {
    return <p>Loading summary…</p>;
  }
  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  return (
    <div className="pb-10">
      <h3 className="text-lg font-semibold mb-4">Prior Payrun Summary</h3>

      <p className="mb-2">
        <span className="font-medium">Unmapped fields:</span>{" "}
        {priorPayrun?.unmappedFields ?? 0}
      </p>

      <div className="mb-4">
        <span className="font-medium">Periods imported:</span>
        {priorPayrun?.periods?.length ? (
          <ul className="list-disc list-inside mt-1">
            {priorPayrun.periods.map(period => (
              <li key={period}>{period}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 mt-1">No periods found.</p>
        )}
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Import
        </button>
        <button
          onClick={handleCancel}
          className="border px-4 py-2 rounded"
        >
          Set up Later
        </button>
      </div>
    </div>
  );
}

export default PriorSummary;
