import { useEffect, useState } from "react";
import configurationStoreManagements from "../../../../store/tdPayroll/configuration";
import { CaretDownIcon } from "@phosphor-icons/react";
import authStoreManagements from "../../../../store/tdPayroll/auth";
import organizationStoreManagements from "../../../../store/tdPayroll/setting/organization";
import { toast } from "react-toastify";
import ReuseableInput from "../../reuseableInput";
import ButtonReusable from "../../buttonReusable";
import { CustomToast } from "../../customToast";

function FormWorkLocation({setClose, data, uuid, setUuid, onUpdateSuccess}) {  
  const { createOrganizationSetting, fetchOrganizationSetting, updateOrganizationSetting, organizationDetail, loading } = organizationStoreManagements();
  const { user } = authStoreManagements();
  const { 
    fetchStateData,
    stateData,
    fetchCityData,
    city 
  } = configurationStoreManagements();
  const [formData, setFormData] = useState({
    workLocationName: data?.workLocationName ||"",
    addressLine1: data?.addressLine1 ||"",
    addressLine2: data?.addressLine2 ||"",
    state: data?.state ||"",
    city: data?.city ||"",
    pincode: data?.pincode ||"",
    addressDetail: data?.addressDetail ||"",
  });

  useEffect(() => {
    if (data && uuid) {
      setFormData(data);
      if (data.state) {
        fetchCityData(data.state);
      }
    } else if (!uuid) {
      setFormData({
        workLocationName: "",
        addressLine1: "",
        addressLine2: "",
        state: "",
        city: "",
        pincode: "",
        addressDetail: ""
      });
    }
  }, [data, uuid]);

  useEffect(() => {
    if (stateData?.length === 0) {
        fetchStateList();
    }
  }, [stateData?.length, fetchStateData]);

  const fetchStateList = async () => {
    const countryId = user?.organization?.organizationDetail?.countryId;
    await fetchStateData(countryId);
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStateSelect = async (e) => {
    const value = e.target.value;
    if (value) {
      setFormData(prev => ({
        ...prev,
        state: value,
        city: ""
      }));
      await fetchCityData(value);
    } else {
      setFormData(prev => ({
        ...prev,
        state: '',
        city: ''
      }));
    }
  };

  const handleCitySelect = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      city: value
    }));
  };

  const handleSave = async () => {
    const access_token = localStorage.getItem("accessToken");
    const body = {
      ...formData,
      state: Number(formData.state),
      city: Number(formData.city)
    }
    
    let response;
    try {
      if (uuid) {
        response = await updateOrganizationSetting(body, "work-location", access_token, uuid);
      } else {
        response = await createOrganizationSetting(body, "work-location", access_token);
      }  
      
      if(response) {
        if (onUpdateSuccess) {
          await onUpdateSuccess();
        } else {
          await fetchOrganizationSetting("work-location", access_token);
        }
        toast(<CustomToast message={typeof response === 'string' ? response : "Data saved successfully"} status={"success"} />, {
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
        if (setUuid) {
          setUuid("");
        }
        setClose(false);
      }
    } catch (error) {
      toast.error("Failed to save data", {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
        theme: "colored"
      });
    }
  };

  const handleCancel = () => {
    setUuid("");
    setClose(false);
  };

  return (
    <div className="w-1/2 p-6 bg-white">
      <div className="w-full space-y-5">
        <label className="block text-xl font-bold">
            Organisation Address<span className="text-blue-td-500">*</span>
        </label>
        <div className="w-full flex flex-col space-y-5">
            {/* Work Location Name */}
            <div className="flex-1 min-w-64 space-y-2">
                <ReuseableInput
                  id="workLocationName"
                  name="workLocationName"
                  placeholder="Work Location Name..."
                  value={formData.workLocationName}
                  onChange={handleInputChange}
                  required
                  isIcon={true}
                  iconFor={"location"}
                />
            </div>
            {/* Address Detail */}
            <div className="flex-1 min-w-64 space-y-2">
                <ReuseableInput
                  id="addressDetail"
                  name="addressDetail"
                  placeholder="Address Detail..."
                  value={formData.addressDetail}
                  onChange={handleInputChange}
                  required
                  isIcon={true}
                  iconFor={"location"}
                />
            </div>
            {/* Address Line 1 */}
            <div className="flex-1 min-w-64 space-y-2">
                <ReuseableInput
                  id="addressLine1"
                  name="addressLine1"
                  placeholder="Address Line 1..."
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  required
                  isIcon={true}
                  iconFor={"location"}
                />
            </div>
            {/* Address Line 1 */}
            <div className="flex-1 min-w-64 space-y-2">
                <ReuseableInput
                  id="addressLine2"
                  name="addressLine2"
                  placeholder="Address Line 2..."
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  required
                  isIcon={true}
                  iconFor={"location"}
                />
            </div>
            {/* City */}
            <div className="flex-1 min-w-64 space-y-2">
                <ReuseableInput
                  id="city"
                  name="city"
                  placeholder="City..."
                  value={formData.city}
                  onChange={handleCitySelect}
                  required
                  as="select"
                  isIcon={true}
                  iconFor={"location"}
                >
                  <option value="" disabled hidden>Select City</option>
                  {city?.map((cityItem) => (
                      <option key={cityItem?.id} value={cityItem?.id}>{cityItem?.name}</option> 
                  ))}
                </ReuseableInput>
            </div>
            {/* State, Pincode */}
            <div className="flex flex-wrap gap-4">
                <ReuseableInput
                  id="pincode"
                  name="pincode"
                  placeholder="Postal Code..."
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  isIcon={true}
                  iconFor={"location"}
                />
                <ReuseableInput
                  id="state"
                  name="state"
                  placeholder="District..."
                  value={formData.state}
                  onChange={handleStateSelect}
                  required
                  as="select"
                  isIcon={true}
                  iconFor={"location"}
                >
                  <option value="" disabled hidden>Select District</option>
                  {stateData?.map((state) => (
                      <option key={state?.id} value={state?.id}>{state?.name}</option> 
                  ))}
                </ReuseableInput>
            </div>
            {/* Business Location */}
            <div className="flex-1 min-w-64 space-y-2">
                <ReuseableInput
                  id="businessLocation"
                  name="businessLocation"
                  placeholder="Business Location..."
                  value={organizationDetail?.Country?.name}
                  required
                  flagIso={organizationDetail?.flagIso}
                  isDisabled={true}
                />
            </div>
        </div>
        {/* Action Buttons */}
        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="w-1/2 flex items-center justify-between">
            <div className="flex items-start justify-start space-x-4">
                <ButtonReusable title={"save"} action={handleSave} isLoading={loading} />
                {!loading && <ButtonReusable title={"cancel"} action={handleCancel} isBLue={false} />}
            </div>
          </div>
          <p className="text-red-td-400 text-sm">* indicates mandatory fields</p>
        </div>
      </div>
    </div>
  );
}

export default FormWorkLocation;