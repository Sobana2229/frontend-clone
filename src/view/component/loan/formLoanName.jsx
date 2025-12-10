import { PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import loanStoreManagements from "../../../store/tdPayroll/loan";
import ReuseableInput from "../reuseableInput";
import { CustomToast } from "../customToast";

function FormLoanName({ setShowModal, isSetting=false, data=null, setIsUpdate, isUpdate=false, setTempUuid, tempUuid }) {
  const { createLoans, getLoan, loanNameData } = loanStoreManagements();
  const [formData, setFormData] = useState({
    name: "",
    perquisiteRate: null
  });

  useEffect(() => {
    if(!loanNameData){
      const access_token = localStorage.getItem("accessToken");
      getLoan(access_token, "name");
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    const access_token = localStorage.getItem("accessToken");
    const payload = {
      ...formData,
      perquisiteRate: formData.perquisiteRate ? formData.perquisiteRate : null,
      isAdvanceSalary: data === "loans" ? "false" : "true"
    }
    const response = await createLoans(payload, access_token, "name");
    if (response) {
      await getLoan(access_token, "name");
      await getLoan(access_token, "option");
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
      setFormData({
        name: "",
        perquisiteRate: null
      });
      setShowModal(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      perquisiteRate: null
    });
    setShowModal(false);
  };

  const handleEdit = (uuid) => {
    console.log(uuid);
  };

  const handleDelete = (uuid) => {
    console.log(uuid);
  };

  return (
    <div className="w-full pb-5 bg-white space-y-5 rounded-md">
      {/* Header Table */}
      <div className="space-y-4 px-5 pb-5">
        {/* <div className="grid grid-cols-2 gap-4 pb-3 border-b border-gray-200">
          <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Loan Name
          </div>
          <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Perquisite Rate
          </div>
        </div> */}

        {/* Data Table */}
        {/* <div className="w-full max-h-[300px] overflow-y-auto">
          {loanNameData?.map((loan) => (
            <div key={loan?.uuid} className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100 pe-5">
              <div className="text-sm text-gray-900 capitalize">
                {loan.name}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{loan.perquisiteRate}</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(loan?.uuid)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <PencilIcon />
                  </button>
                  <button 
                    onClick={() => handleDelete(loan?.uuid)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div> */}

        {/* Input Form */}
        <div className="grid grid-cols-1 gap-">
          <div>
            <ReuseableInput
              label="Loan Name"
              id="name"
              name="name"
              placeholder="Enter loan name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              isFocusRing={false}
              isBorderLeft={true}
              borderColor="red-td-500"
            />
          </div>
          {/* <div>
            <input
              type="number"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              value={formData.perquisiteRate}
              onChange={(e) => handleInputChange('perquisiteRate', e.target.value)}
            />
          </div> */}
        </div>

        {/* Info Box */}
        {/* <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-yellow-600 font-bold">ⓘ</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                Perquisite Rate is required for all type of loans with loan amount greater than 
                $20,000 except Medical Loan. Any change in Perquisite Rate, will be applied to all 
                the employees who has availed that Loan.
              </p>
            </div>
          </div>
        </div> */}
      </div>
      {/* Action Buttons */}
      <div className="flex justify-start px-5 space-x-3 pt-4 border-t">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default FormLoanName;