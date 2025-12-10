import { useEffect, useState } from "react";
import organizationStoreManagements from "../../../../store/tdPayroll/setting/organization";
import { toast } from "react-toastify";
import { CustomToast } from "../../customToast";

function FormDepartment({ setShowModal, isSetting=false, data=null, setIsUpdate, isUpdate=false, setTempUuid, tempUuid }) {
  const { createOrganizationSetting, fetchOrganizationSetting, updateOrganizationSetting, deleteOrganizationSetting } = organizationStoreManagements();
  const [formData, setFormData] = useState({
    name: "",
    departmentCode: "",
    description: "",
  });

  useEffect(() => {
    if(data){
      setFormData(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDepartementSubmit = async () => {
    const access_token = localStorage.getItem("accessToken");
    let response;
    if(isUpdate) {
      response = await updateOrganizationSetting(formData, "departement", access_token, tempUuid);
      setIsUpdate(false);
      setTempUuid("");
    } else {
      response = await createOrganizationSetting(formData, "departement", access_token);
    }
    if(response){
      await fetchOrganizationSetting("departement", access_token, isSetting);
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
      setShowModal(false);
    }
  }

  const handleCancel = () => {
    setShowModal(false);
  };
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white space-y-5">
      <div className="w-full flex justify-between items-center space-x-4">
        {/* Department Name */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">
            Department Name <span className="text-blue-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Department Code */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Department Code
          </label>
          <input
            type="text"
            name="departmentCode"
            value={formData.departmentCode}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={250}
          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Max 250 characters"
        />
      </div>

      {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleDepartementSubmit}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Save
            </button>
            {setShowModal && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-white text-gray-700 border duration-300 ease-in-out transition-all border-gray-300 rounded-md hover:bg-gray-50"
                >
                Cancel
              </button>
            )}
          </div>
          <p className="text-sm text-blue-500">
            * indicates mandatory fields
          </p>
        </div>
    </div>
  );
}

export default FormDepartment;