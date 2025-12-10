import { useEffect, useState } from "react";
import senderEmailPreferenceStoreManagements from "../../../store/tdPayroll/setting/senderEmailPreference";
import { toast } from "react-toastify";
import LoadingIcon from "../loadingIcon";

function FormSenderEmailPreference({setShowModal, data=null, setIsUpdate, isUpdate=false, setTempUuid, tempUuid}) {
  const { createSenderEmailPreference, fetchSenderEmailPreference, updateSenderEmailPreference, loading } = senderEmailPreferenceStoreManagements();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const access_token = localStorage.getItem("accessToken");
    let response;
    if(isUpdate) {
      response = await updateSenderEmailPreference(formData, access_token, tempUuid);
      setIsUpdate(false);
      setTempUuid("");
    } else {
      response = await createSenderEmailPreference(formData, access_token);
    }
    if(response){
      const params = {
        limit: 10, 
        page: 1,
      };
      await fetchSenderEmailPreference(access_token, params);
      toast.success(response, {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
        theme: "colored"
      });
      setShowModal(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col space-y-4 px-5 pb-5 border-b">
        {/* Name Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your name"
          />
        </div>

        {/* Email Address Field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Email Address<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email address"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between p-5">
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {loading ? 
              <div className="w-full h-5 flex items-center justify-center">
                <LoadingIcon color="white" />
              </div>
              : "Save"
            }
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
        </div>
        <span className="text-sm text-red-500">* indicates mandatory fields</span>
      </div>
    </div>
  );
}

export default FormSenderEmailPreference;