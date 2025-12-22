import { useEffect } from "react";
import organizationStoreManagements from "../../../../store/tdPayroll/setting/organization";
import ReuseableInput from "../../reuseableInput";
import { employeeDifferentlyAbledType } from "../../../../../data/dummy";
import configurationStoreManagements from "../../../../store/tdPayroll/configuration";
import authStoreManagements from "../../../../store/tdPayroll/auth";

function EmploymentDetails({setFormData, formData, isAdding}) {
  const { user } = authStoreManagements();
  const { 
    fetchOrganizationSetting, 
    employmentTypeOptions,
  } = organizationStoreManagements();
  const { 
    fetchStateData,
    stateData,
    fetchCityData,
    city,
  } = configurationStoreManagements();

  useEffect(() => {
    if(employmentTypeOptions?.length === 0) {
      const access_token = localStorage.getItem("accessToken");
      fetchOrganizationSetting("employee-type", access_token, false, null, true);
    }
  }, []);

  useEffect(() => {
    const fetchStateList = async () => {
      const countryId = user?.organization?.organizationDetail?.countryId;
      if (countryId) {
        await fetchStateData(countryId);
      }
    };

    if (stateData?.length === 0 && user?.organization?.organizationDetail?.countryId) {
      fetchStateList();
    }
  }, [stateData?.length, user?.organization?.organizationDetail?.countryId, fetchStateData]);

  useEffect(() => {
    const fetchCityList = async () => {
      if (formData.stateId && formData.stateId !== '') {
        await fetchCityData(formData.stateId);
      }
    };
    fetchCityList();
  }, [formData.stateId, fetchCityData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'spk') {
        setFormData(prev => ({
          ...prev,
          statutoryComponents: {
            ...prev.statutoryComponents,
            [name]: checked
          }
        }));
      }
    } else if (name === 'dateOfBirth' && value) {
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setFormData(prev => ({
        ...prev,
        dateOfBirth: value,
        age: age.toString()
      }));
    } else {
      // ✅ FIX: Use citizenCategory (from Employee table) instead of citizenshipCategory
      if ((name === 'citizenshipCategory' || name === 'citizenCategory') && value === 'Foreign') {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          statutoryComponents: {
            ...prev.statutoryComponents,
            spk: false
          },
          spkNo: ""
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
  };

  const handleCitySelect = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      cityId: value
    }));
  };

  const handleStateSelect = async (e) => {
    const value = e.target.value;    
    if (value) {
      setFormData(prev => ({
        ...prev,
        stateId: value,
        cityId: ""
      }));
      await fetchCityData(value);
    } else {
      setFormData(prev => ({
        ...prev,
        stateId: '',
        cityId: ''
      }));
    }
  };

  return (
    <>
     <div className="w-full h-fit px-20 py-10">
        <div className="w-full flex flex-col items-center justify-center space-y-8">
          {/* Row 1 */}
          <div className="w-full">
            <div className={`${isAdding ? "w-full" : "w-[70%]"} grid grid-cols-2 gap-10`}>
              <ReuseableInput
                label="Employment Type"
                id="employmentTypeUuid"
                name="employmentTypeUuid"
                value={formData.employmentTypeUuid}
                onChange={handleInputChange}
                as="select"
                isFocusRing={false}
                isBorderLeft={true}
                borderColor={"red-td-500"}
              >
                {employmentTypeOptions?.map((el, idx) => (
                  <option value={el.value} key={el.value}>{el.label}</option>
                ))}
              </ReuseableInput>
              <ReuseableInput
                label={"Date of Exit"}
                type="date"
                id="dateOfExit"
                name="dateOfExit"
                value={formData.dateOfExit}
                onChange={handleInputChange}
                isFocusRing={false}
                isBorderLeft={true}
                borderColor={"red-td-500"}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="w-full">
            <div className={`${isAdding ? "w-full" : "w-[70%]"} grid grid-cols-2 gap-10`}>
              <ReuseableInput
                label={"Personal Email Address"}
                id="personalEmail"
                name="personalEmail"
                value={formData.personalEmail}
                onChange={handleInputChange}
                isFocusRing={false}
                isBorderLeft={true}
                borderColor={"red-td-500"}
                placeholder="abc@xyz.com"
              />
              <ReuseableInput
                label={"Personal Mobile Number"}
                id="personalMobile"
                name="personalMobile"
                value={formData.personalMobile}
                onChange={handleInputChange}
                isFocusRing={false}
                isBorderLeft={true}
                borderColor={"red-td-500"}
                placeholder="Enter Mobile Number"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="w-full">
            <div className={`${isAdding ? "w-full" : "w-[70%]"} grid grid-cols-2 gap-10`}>
              <ReuseableInput
                label={"Date of Birth"}
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                isFocusRing={false}
                isBorderLeft={true}
                borderColor={"red-td-500"}
              />
              <ReuseableInput
                label={"Age"}
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                isFocusRing={false}
                isBorderLeft={true}
                borderColor={"red-td-500"}
                isDisabled={true}
                placeholder="Enter Your Age"
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="w-full">
            <div className={`${isAdding ? "w-full" : "w-[70%]"} grid grid-cols-2 gap-10`}>
              <ReuseableInput
                label={"Father's Name"}
                id="FatherName"
                name="FatherName"
                value={formData.FatherName}
                onChange={handleInputChange}
                isFocusRing={false}
                isBorderLeft={true}
                borderColor={"red-td-500"}
                placeholder="Enter Your Father's name"
              />
              <ReuseableInput
                label="Differently Abled Type"
                id="differentlyAbledType"
                name="differentlyAbledType"
                value={formData.differentlyAbledType}
                onChange={handleInputChange}
                as="select"
                isFocusRing={false}
                isBorderLeft={true}
                borderColor={"red-td-500"}
              >
                {employeeDifferentlyAbledType?.map((el, idx) => (
                  <option value={el} key={idx}>{el}</option>
                ))}
              </ReuseableInput>
            </div>
          </div>

          {/* Row 5 */}
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4">Residential Address</h3>
            <div className={`${isAdding ? "w-full" : "w-[70%]"} space-y-4`}>
              <ReuseableInput
                id="presentAddressLine1"
                name="presentAddressLine1"
                value={formData.presentAddressLine1}
                onChange={handleInputChange}
                isFocusRing={false}
                isBorderLeft={true}
                borderColor={"red-td-500"}
                placeholder="Address Line 1"
              />
              <ReuseableInput
                id="presentAddressLine2"
                name="presentAddressLine2"
                value={formData.presentAddressLine2}
                onChange={handleInputChange}
                isFocusRing={false}
                placeholder="Address Line 2"
              />
            </div>
          </div>

          {/* Row 6 */}
          <div className="w-full">
            <div className={`${isAdding ? "w-full" : "w-[70%]"} grid grid-cols-3 gap-5`}>
              <ReuseableInput
                id="pinCode"
                name="pinCode"
                placeholder="Postal Code..."
                value={formData.pinCode}
                onChange={handleInputChange}
                isBorderLeft={true}
                borderColor={"red-td-500"}
              />

              <ReuseableInput
                id="stateId"
                name="stateId"
                placeholder="District..."
                value={formData.stateId}
                onChange={handleStateSelect}
                as="select"
                isBorderLeft={true}
                borderColor={"red-td-500"}
              >
                <option value="" disabled hidden>Select District</option>
                {stateData?.map((state) => (
                  <option key={state?.id} value={state?.id}>{state?.name}</option> 
                ))}
              </ReuseableInput>

              <ReuseableInput
                id="cityId"
                name="cityId"
                placeholder="City..."
                value={formData.cityId}
                onChange={handleCitySelect}
                as="select"
                isBorderLeft={true}
                borderColor={"red-td-500"}
              >
                <option value="" disabled hidden>Select City</option>
                {city?.map((cityItem) => (
                  <option key={cityItem?.id} value={cityItem?.id}>{cityItem?.name}</option> 
                ))}
              </ReuseableInput>            
            </div>
          </div>

          {/* Required Field Indicator */}
          <div className="w-full flex justify-center mt-6">
            <div className="flex items-center gap-2 text-sm text-gray-td-600">
              <div className="w-6 h-6 border-l-4 border-red-td-500"></div>
              <span>Required Field</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmploymentDetails;