import { useState, useEffect, useRef } from "react";
import leaveAndAttendanceStoreManagements from "../../../store/tdPayroll/setting/leaveAndAttendance";
import { toast } from "react-toastify";

function FormHoliday({handleShowForm, section, data = {}, tempUuid, isUpdate=false}) {
  const { fetchWorkLocationOptions, workLocationOptions, loading, createLeaveAndAttendance, fetchLeaveAndAttendance, updateLeaveAndAttendance } = leaveAndAttendanceStoreManagements();
  const [formData, setFormData] = useState({
    holidayName: "",
    startDate: "",
    endDate: "",
    description: "",
    workLocation: [],
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    if (data) {
      setFormData({
        holidayName: data.holidayName || "",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        description: data.description || "",
        workLocation: Array.isArray(data.workLocation) ? data.workLocation : [],
      });
    }
  }, [data]);

  useEffect(() => {
    if(!Array.isArray(workLocationOptions) || workLocationOptions?.length === 0) {
      const access_token = localStorage.getItem("accessToken");
      fetchWorkLocationOptions(access_token);
    }
  }, []);  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationSelect = (locationValue) => {
    setFormData((prev) => {
      const currentWorkLocation = Array.isArray(prev?.workLocation) ? prev.workLocation : [];
      let newLocations = [...currentWorkLocation];
      
      if (locationValue === "all") {
        newLocations = ["all"];
      } else {
        newLocations = newLocations.filter(loc => loc !== "all");
        
        if (newLocations.includes(locationValue)) {
          newLocations = newLocations.filter(loc => loc !== locationValue);
        } else {
          newLocations.push(locationValue);
        }
      }
      
      return {
        ...prev,
        workLocation: newLocations,
      };
    });
  };

  const removeLocation = (locationValue) => {
    setFormData((prev) => ({
      ...prev,
      workLocation: Array.isArray(prev.workLocation) ? prev.workLocation.filter(loc => loc !== locationValue) : [],
    }));
  };

  const getLocationLabel = (value) => {
    if (!Array.isArray(workLocationOptions)) return value;
    const location = workLocationOptions && workLocationOptions?.find(loc => loc.value === value);
    return location ? location.label : value;
  };

  const handleSubmit = async () => {
    const access_token = localStorage.getItem("accessToken");
    let response;
    if(isUpdate){
      response = await updateLeaveAndAttendance(formData, access_token, section, tempUuid);
    }else{
      response = await createLeaveAndAttendance(formData, access_token, section);
    }
    if(response){
      await fetchLeaveAndAttendance(access_token, section, 1);
      toast.success(response, {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
        theme: "colored"
      })
      handleShowForm();
    }
  };

  return (
    <div className="w-full flex items-start justify-normal">
      <div className="w-full max-w-lg space-y-4 bg-white p-6">
        {/* Holiday Name */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">
            Holiday Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="holidayName"
            value={formData.holidayName}
            onChange={handleChange}
            placeholder="Enter holiday name"
            className="border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Date */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">
            Date <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            rows="3"
            className="border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Work Locations - Multi Select */}
        <div className="flex flex-col relative" ref={dropdownRef}>
          <label className="text-sm font-medium mb-1">
            This Holiday is applicable for?
          </label>
          
          {/* Selected Locations Display */}
          <div onClick={() => setShowDropdown(true)} className={`border rounded ${!Array.isArray(formData.workLocation) || formData.workLocation?.length === 0 ? "h-9" : "h-fit"} bg-white flex flex-wrap items-start gap-2 p-2`}>
            {!Array.isArray(formData.workLocation) || formData.workLocation?.length === 0 ? (
              <div className="text-gray-400 text-sm w-full h-full flex items-center justify-start px-5">Select work locations...</div>
            ) : (
              formData.workLocation?.map((locationValue) => (
                <span
                  key={locationValue}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  {getLocationLabel(locationValue)}
                  <button
                    type="button"
                    onClick={() => removeLocation(locationValue)}
                    className="text-blue-600 hover:text-blue-800 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Dropdown Options */}
          {showDropdown && Array.isArray(workLocationOptions) && (
            <div className="absolute top-full left-0 max-h-[150px] w-full overflow-y-auto bg-white border z-10">
              {workLocationOptions.map((location) => (
                <div
                  key={location.value}
                  onClick={() => handleLocationSelect(location.value)}
                  className={`px-3 py-2 hover:bg-blue-50 hover:text-black cursor-pointer text-sm ${
                    Array.isArray(formData.workLocation) && formData.workLocation?.includes(location.value)
                      ? "bg-blue-500 text-white"
                      : "text-gray-700"
                  }`}
                >
                  {location.label}
                </div>
              ))}
            </div>
          )}

          {/* Loading state for dropdown */}
          {showDropdown && !Array.isArray(workLocationOptions) && (
            <div className="absolute top-full left-0 w-full bg-white border z-10 p-3">
              <div className="text-gray-500 text-sm">Loading locations...</div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setFormData({
                  holidayName: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                  workLocation: [],
                });
                handleShowForm(section);
              }}
              className="border px-4 py-2 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-red-500">* indicates mandatory fields</p>
        </div>
      </div>
    </div>
  );
}

export default FormHoliday;