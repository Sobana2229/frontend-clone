import { useEffect, useState } from "react";
import { employeeCitizenCategory, employeeGender } from "../../../../data/dummy";
import ButtonReusable from "../buttonReusable";
import Modal from "react-modal";
import Select from "react-select";
import FormModal from "../formModal";
import organizationStoreManagements from "../../../store/tdPayroll/setting/organization";
import configurationStoreManagements from "../../../store/tdPayroll/configuration";
import { toast } from "react-toastify";
import employeeStoreManagements from "../../../store/tdPayroll/employee";
import CustomOption from "../customOption";
import ReuseableInput from "../reuseableInput";
import { flagImage } from "../../../../helper/globalHelper";
import { useLocation } from "react-router-dom";
import CustomDatePicker from "../CustomDatePicker";
function BasicDetails({cancel, setStep, step, setTempUuid, isAdding, setStepComplated=[]}) {
  const { pathname } = useLocation();
  const { 
    designationOptions, 
    departementOptions, 
    createOrganizationSetting, 
    fetchOrganizationSetting, 
    workLocationOptions 
  } = organizationStoreManagements();
  const { 
    phoneNumberData,
    fetchPhoneNumberData
  } = configurationStoreManagements();
  const { creatEmployee, loading } = employeeStoreManagements();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    employeeId: "",
    joinDate: "",
    email: "",
    phoneNumber: "",
    phoneCode: null,
    flagIso: null,
    gender: "",
    workLocationUuid: "",
    designationUuid: "",
    departementUuid: "",
    citizenCategory: "",
    icType: "",
    isEnablePortalAccess: false,
    isStatutoryComponents: false,
    spkAccountNumber: "",
    stepComplated: Number(step)
  });
  
  const [emailError, setEmailError] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [modalWorkLocations, setModalWorkLocations] = useState(false);
  const [modalDesignation, setModalDesignation] = useState(false);
  const [modalDepartement, setModalDepartement] = useState(false);
  const [phoneDigitLimit, setPhoneDigitLimit] = useState(7); // Default to Brunei (7 digits)

  useEffect(() => {
    if(designationOptions?.length === 0) {
      const access_token = localStorage.getItem("accessToken");
      fetchOrganizationSetting("designation", access_token);
    }
  }, []);

  useEffect(() => {
    if(departementOptions?.length === 0) {
      const access_token = localStorage.getItem("accessToken");
      fetchOrganizationSetting("departement", access_token);
    }
  }, []);

  useEffect(() => {
    if(workLocationOptions?.length === 0) {
      const access_token = localStorage.getItem("accessToken");
      fetchOrganizationSetting("work-location", access_token);
    }
  }, []);

  useEffect(() => {
    if(!phoneNumberData || phoneNumberData.length === 0) {
      const access_token = localStorage.getItem("accessToken");
      fetchPhoneNumberData(access_token);
    } else {
      // Set Brunei as default when data loads
      const bruneiData = phoneNumberData.find(phone => phone.label === "+673");
      if (bruneiData && !formData.phoneCode) {
        setFormData(prev => ({
          ...prev,
          phoneCode: bruneiData.label,
          flagIso: bruneiData.emoji,
        }));
        setPhoneDigitLimit(7); // Brunei default
      }
    }
  }, [phoneNumberData]);

  useEffect(() => {
    if (formData.citizenCategory && formData.citizenCategory !== "Foreigner") {
      setFormData(prev => ({
        ...prev,
        isStatutoryComponents: true
      }));
    } else if (formData.citizenCategory === "Foreigner") {     
      setFormData(prev => ({
        ...prev,
        isStatutoryComponents: false,
        spkAccountNumber: ""
      }));
    }
  }, [formData.citizenCategory]);

  const getPhoneDigitLimit = (phoneCode) => {
    const digitLimits = {
      "+91": 10,   // India
      "+673": 7,   // Brunei
      "+1": 10,    // USA/Canada
      "+44": 10,   // UK
      "+65": 8,    // Singapore
    };
    return digitLimits[phoneCode] || 15; // Default to 15 if not in list
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    if (name === "citizenCategory") {
      updatedFormData.icType = getIcTypeByCitizenCategory(value);
    }
    if (name === "isStatutoryComponents" && !checked) {
      updatedFormData.spkAccountNumber = "";
    }
    
    // Email validation on change
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value.length > 0) {
        setEmailValid(emailRegex.test(value));
        setEmailError(!emailRegex.test(value));
      } else {
        setEmailValid(false);
        setEmailError(false);
      }
    }
    
    setFormData(updatedFormData);
  };

  const handleEmailBlur = () => {
    setEmailValid(false);
    setEmailError(false);
  };
const getIcTypeByCitizenCategory = (category) => {
  const icTypeMapping = {
    "Brunei Citizen": "Yellow",
    "Permanent": "Purple",
    "Foreigner": "Green"
  };
  return icTypeMapping[category] || "";
};
  const submitFormBasicDetails = async () => {
    // Validate SPK Account Number for Brunei Citizen and Permanent
    if ((formData.citizenCategory === 'Brunei Citizen' || formData.citizenCategory === 'Permanent') && 
        (!formData.spkAccountNumber || formData.spkAccountNumber.trim() === '')) {
      toast.error("SPK Account Number is required for Brunei Citizen and Permanent residents", {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
        theme: "colored"
      });
      return;
    }

    const access_token = localStorage.getItem("accessToken");
    const response = await creatEmployee(formData, access_token)
    if(response){
      setTempUuid(response?.uuid);
      toast.success(response?.msg, {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
        theme: "colored"
      })
      setStep(2)
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        employeeId: "",
        joinDate: "",
        email: "",
        phoneNumber: "",
        phoneCode: null,
        flagIso: null,
        gender: "",
        workLocationUuid: "",
        designationUuid: "",
        departementUuid: "",
        citizenCategory: "",
        icType: "",
        isEnablePortalAccess: false,
        isStatutoryComponents: false,
        spkAccountNumber: "",
        stepComplated: Number(step)
      });
      if (pathname == "/add-employees") {
        setStepComplated(prev => [...prev, 1]);
      }
    }
  }

  const handleWorkLocationSelect = async (selectedOption) => {
    if(selectedOption.value == "create-new-data"){
      setModalWorkLocations(!modalWorkLocations);
    }else{
      setFormData(prev => ({
        ...prev,
        workLocationUuid: selectedOption.value,
      }));
    }
  };

  const handleDepartementSelect = async (selectedOption) => {
    if(selectedOption.value == "create-new-data"){
      setModalDepartement(!modalDepartement);
    }else{
      setFormData(prev => ({
        ...prev,
        departementUuid: selectedOption.value,
      }));
    }
  };

  const handleDesignationSelect = async (selectedOption) => {
    if(selectedOption.value == "create-new-data"){
      setModalDesignation(!modalDesignation);
    }else{
      setFormData(prev => ({
        ...prev,
        designationUuid: selectedOption.value,
      }));
    }
  };

  const handleDesignationSubmit = async (name) => {
    const formData = { name }
    const access_token = localStorage.getItem("accessToken");
    const response = await createOrganizationSetting(formData, "designation", access_token);
    if(response){
      await fetchOrganizationSetting("designation", access_token);
      toast.success(response, {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
        theme: "colored"
      })
      setModalDesignation(false);
    }
  }
  
  return (
    <>
      <div className="w-full h-fit px-20 py-10">
        <div className={`${isAdding ? "w-full" : "w-[70%]"} flex flex-col items-center justify-center space-y-10`}>
          <div className="w-full space-y-3">
            <label className="font-medium" htmlFor="">Employee Name</label>
            <div className="w-full flex items-center justify-start space-x-8">
              <ReuseableInput
                placeholder="first name"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                isFocusRing={false}
                isBorderLeft={true}
                borderColor={"red-td-500"}
              />
              <ReuseableInput
                placeholder="middle name"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                isFocusRing={false}
              />
              <ReuseableInput
                placeholder="last name"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                isFocusRing={false}
                isBorderLeft={true}
                borderColor={"red-td-500"}
              />
            </div>
          </div>

          <div className="w-full flex items-center justify-center space-x-8">
            <ReuseableInput
              label={"Employee ID"}
              placeholder="Enter Employee ID"
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              isFocusRing={false}
              isBorderLeft={true}
              borderColor={"red-td-500"}
            />
         <div className="flex-1 min-w-50 space-y-2">
  <label htmlFor="joinDate" className="block text-base font-medium">
    Date of Joining
  </label>
  <CustomDatePicker
    selected={formData.joinDate ? new Date(formData.joinDate) : null}
    onChange={(date) => {
      const formattedDate = date ? date.toISOString().split('T')[0] : '';
      handleChange({
        target: {
          name: 'joinDate',
          value: formattedDate
        }
      });
    }}
    placeholder="Select Date of Joining"
    isBorderLeft={true}
    borderColor="red-td-500"
  />
</div>
          </div>

          <div className="w-full flex items-center justify-center space-x-8 pb-5 border-b">
            <ReuseableInput
              label={"Work Email"}
              placeholder="abc@xyz.com"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              isFocusRing={false}
              isBorderLeft={true}
              borderColor={"red-td-500"}
              emailValid={emailValid}
              emailError={emailError}
            />
            <div className="w-[49%] flex flex-col items-start justify-center">
              <label className="block text-base font-medium mb-2" htmlFor="phoneNumber">
                Mobile Number
              </label>
              <div className="flex items-center w-full gap-2">
                <Select
                  options={phoneNumberData}
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      const limit = getPhoneDigitLimit(selectedOption.label);
                      setPhoneDigitLimit(limit);
                      setFormData(prev => ({
                        ...prev,
                        phoneCode: selectedOption.label,
                        flagIso: selectedOption.emoji,
                      }));
                    }
                  }}
                  className="w-40 z-20"
                  value={phoneNumberData?.find(option => option.label === formData.phoneCode)}
                  formatOptionLabel={(option, context) => (
                    <div className="flex items-center">
                      <img 
                        src={flagImage({ emoji: option.emoji, country: option.country })} 
                        className="w-6 mr-2 object-contain" 
                        alt={option.country}
                      />
                      {context.context === 'menu' ? (
                        <span>{option.country} {option.label}</span>
                      ) : (
                        <span>{option.label}</span>
                      )}
                    </div>
                  )}
                  classNames={{
                    control: () => "!rounded-md !border-2 !border-gray-300 !bg-white !h-full",
                    valueContainer: () => "!px-2 !py-1",
                    indicatorsContainer: () => "!px-1",
                  }}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    control: (base, state) => ({
                      ...base,
                      borderRadius: '6px',
                      borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                      boxShadow: 'none',
                      
                    }),
                  }}
                  menuPortalTarget={document.body}
                />
                
                <ReuseableInput
                  id="phoneNumber"
                  name="phoneNumber"
                  type="number"
                  placeholder="Enter Mobile Number"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= phoneDigitLimit) {
                      handleChange(e);
                    }
                  }}
                  labelUnshow={true}
                  isFocusRing={false}
                  isBorderLeft={true}
                  borderColor={"red-td-500"}
                />
              </div>
            </div>
          </div>

          <div className="w-full flex items-center justify-center space-x-8">
            <ReuseableInput
              label="Gender"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              as="select"
              isFocusRing={false}
              isBorderLeft={true}
              borderColor={"red-td-500"}
            >
              <option value="" hidden>Select</option>
              {employeeGender?.map((gender, idx) => (
                <option key={idx} value={gender} className="capitalize">{gender}</option>
              ))}
            </ReuseableInput>
            <div className="w-[49%] flex flex-col items-start justify-center">
              <label className="block text-base font-medium mb-2" htmlFor="">Work Location</label>
              <Select
                options={workLocationOptions}
                onChange={handleWorkLocationSelect}
                className='w-full bg-transparent focus:ring-0 outline-none text-sm'
                classNames={{
                  control: () =>
                    "!rounded-md !bg-white !h-full",
                  valueContainer: () => "!px-2 !py-1.5",
                  indicatorsContainer: () => "!px-1",
                }}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base, state) => ({
                    ...base,
                    borderLeftWidth: '6px',
                    borderLeftColor: '#dc2626',
                    borderRadius: '6px',
                    borderColor: '#d1d5db',
                    boxShadow: 'none',
                    '&:hover': {
                      borderLeftColor: '#dc2626',
                    }
                  }),
                }}
                components={{ 
                  MenuList: ({ children }) => {
                    const childArray = Array.isArray(children) ? children : [children];
                    
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', height: '250px' }}>
                        <div style={{ flex: 1, overflowY: 'auto', minHeight: '150px' }}>
                          {childArray}
                        </div>
                        <div
                          style={{
                            padding: '10px 12px',
                            backgroundColor: '#f3f4f6',
                            borderTop: '1px solid #e5e7eb',
                            cursor: 'pointer',
                            fontWeight: 500,
                            textAlign: 'center',
                            flexShrink: 0,
                          }}
                          onClick={() => setModalWorkLocations(true)}
                        >
                          + New Work Location
                        </div>
                      </div>
                    );
                  },
                  Option: (props) => (
                    <CustomOption 
                      props={props}
                    />
                  )
                }}
                menuPortalTarget={document.body}
                filterOption={(option, rawInput) => {
                  if (option.value === "create-new-data") {
                    return false;
                  }
                  if (!option.label || typeof option.label !== 'string') {
                    return false;
                  }
                  return option.label.toLowerCase().includes(rawInput.toLowerCase());
                }}
              />
            </div>
          </div>

          <div className="w-full flex items-center justify-center space-x-8 pb-5 border-b">
            <div className="w-[49%] flex flex-col items-start justify-center">
              <label className="block text-base font-medium mb-2" htmlFor="">Designation</label>
              <Select
                options={designationOptions}
                onChange={handleDesignationSelect}
                className='w-full bg-transparent focus:ring-0 outline-none text-sm'
                classNames={{
                  control: () =>
                    "!rounded-md !bg-white !shadow-none !h-full",
                  valueContainer: () => "!px-2 !py-1.5",
                  indicatorsContainer: () => "!px-1",
                }}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base, state) => ({
                    ...base,
                    borderLeftWidth: '6px',
                    borderLeftColor: '#dc2626',
                    borderRadius: '8px',
                    borderColor: '#d1d5db',
                    boxShadow: 'none',
                  '&:hover': {
                      borderLeftColor: '#dc2626',
                    }
                  }),
                }}
                components={{ 
                  MenuList: ({ children }) => {
                    const childArray = Array.isArray(children) ? children : [children];
                    
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', height: '250px' }}>
                        <div style={{ flex: 1, overflowY: 'auto', minHeight: '150px' }}>
                          {childArray}
                        </div>
                        <div
                          style={{
                            padding: '10px 12px',
                            backgroundColor: '#f3f4f6',
                            borderTop: '1px solid #e5e7eb',
                            cursor: 'pointer',
                            fontWeight: 500,
                            textAlign: 'center',
                            flexShrink: 0,
                          }}
                          onClick={() => setModalDesignation(true)}
                        >
                          + New Designation
                        </div>
                      </div>
                    );
                  },
                  Option: (props) => (
                    <CustomOption 
                      props={props}
                    />
                  )
                }}
                menuPortalTarget={document.body}
                filterOption={(option, rawInput) => {
                  if (option.value === "create-new-data") {
                    return false;
                  }
                  return option.label.toLowerCase().includes(rawInput.toLowerCase());
                }}
              />
            </div>
            <div className="w-[49%] flex flex-col items-start justify-center">
              <label className="block text-base font-medium mb-2" htmlFor="">Departement</label>
              <Select
                options={departementOptions}
                onChange={handleDepartementSelect}
                className='w-full bg-transparent focus:ring-0 outline-none text-sm'
                classNames={{
                  control: () =>
                    "!rounded-md !bg-white !shadow-none !h-full",
                  valueContainer: () => "!px-2 !py-1.5",
                  indicatorsContainer: () => "!px-1",
                }}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base, state) => ({
                    ...base,
                    borderLeftWidth: '6px',
                    borderLeftColor: '#dc2626',
                    borderRadius: '8px',
                    borderColor: '#d1d5db',
                    boxShadow: 'none',
                    '&:hover': {
                      borderLeftColor: '#dc2626',
                    }
                   
                  }),
                }}
                components={{ 
                  MenuList: ({ children }) => {
                    const childArray = Array.isArray(children) ? children : [children];
                    
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', height: '250px' }}>
                        <div style={{ flex: 1, overflowY: 'auto', minHeight: '150px' }}>
                          {childArray}
                        </div>
                        <div
                          style={{
                            padding: '10px 12px',
                            backgroundColor: '#f3f4f6',
                            borderTop: '1px solid #e5e7eb',
                            cursor: 'pointer',
                            fontWeight: 500,
                            textAlign: 'center',
                            flexShrink: 0,
                          }}
                          onClick={() => setModalDepartement(true)}
                        >
                          + New Department
                        </div>
                      </div>
                    );
                  },
                  Option: (props) => (
                    <CustomOption 
                      props={props}
                    />
                  )
                }}
                menuPortalTarget={document.body}
                filterOption={(option, rawInput) => {
                  if (option.value === "create-new-data") {
                    return false;
                  }
                  return option.label.toLowerCase().includes(rawInput.toLowerCase());
                }}
              />
            </div>
          </div>

          <div className="w-full flex items-center justify-center space-x-8">
            <ReuseableInput
              label="Citizen Category"
              id="citizenCategory"
              name="citizenCategory"
              value={formData.citizenCategory}
              onChange={handleChange}
              as="select"
              isFocusRing={false}
              isBorderLeft={true}
              borderColor={"red-td-500"}
            >
              <option value="" hidden>Select</option>
              {employeeCitizenCategory?.map((citizen, idx) => (
                <option key={idx} value={citizen} className="capitalize">
                  {citizen}
                </option>
              ))}
            </ReuseableInput>
            <ReuseableInput
              label="IC Type"
              id="icType"
              name="icType"
              value={formData.icType}
              isDisabled={true}
              isFocusRing={false}
            />
          </div>

          {(formData.citizenCategory && formData.citizenCategory !== "Foreigner") && (
            <div className="w-full bg-blue-td-50 rounded-lg p-4 space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-normal text-black mb-1">
                    Statutory Components
                  </h3>
                  <p className="text-sm font-light text-gray-td-500 leading-relaxed">
                    Enable the necessary benefits and tax applicable for this employee.
                  </p>
                </div>
                
                <div className="ml-6">
                  <button
                    type="button"
                    onClick={() => {
                      const newValue = !formData.isStatutoryComponents;
                      handleChange({
                        target: {
                          name: 'isStatutoryComponents',
                          value: newValue
                        }
                      });
                    }}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ease-in-out ${
                      formData.isStatutoryComponents 
                        ? 'bg-blue-td-500' 
                        : 'bg-gray-td-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
                        formData.isStatutoryComponents 
                          ? 'translate-x-6' 
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {formData.isStatutoryComponents && (
                <div className="w-full mt-4">
                  <h4 className="text-base font-light text-gray-700 mb-3">
                    Employees Skim Perlindungan Kebajikan
                  </h4>
                  <label className="block text-sm font-medium mb-2 text-gray-td-500">
                    SPK Account Number
                  </label>
                  <div className="w-1/2">
                    <ReuseableInput
                      id="spkAccountNumber"
                      name="spkAccountNumber"
                      value={formData.spkAccountNumber}
                      onChange={handleChange}
                      placeholder="Enter SPK Account Number"
                      isFocusRing={true}
                      isBorderLeft={true}
                      borderColor="red-td-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="w-full bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  Enable Portal Access
                </h3>
                <p className="text-sm text-gray-600">
                  The employee will be able to view payslips, submit their IT declaration and create reimbursement claims through the employee portal.
                </p>
              </div>
              
              <div className="ml-4">
                <button
                  type="button"
                  onClick={() => {
                    const newValue = !formData.isEnablePortalAccess;
                    handleChange({
                      target: {
                        name: 'isEnablePortalAccess',
                        value: newValue
                      }
                    });
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
                    formData.isEnablePortalAccess 
                      ? 'bg-green-td-400' 
                      : 'bg-gray-td-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                      formData.isEnablePortalAccess 
                        ? 'translate-x-6' 
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
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
        <div className="pt-5 border-t w-full flex items-center justify-start space-x-8 pb-10 mt-10">
          <ButtonReusable title={"Save and Continue"} action={submitFormBasicDetails} isLoading={loading} />
          {!loading && <ButtonReusable title={"cancel"} action={cancel} isBLue={false} />}
        </div>
      </div>
      <Modal
        isOpen={modalWorkLocations}
        contentLabel="Full Screen Modal"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: "none",
            backgroundColor: "transparent",
            padding: 0,
            margin: 0,
            overflow: "hidden",
          },
        }}>
        <FormModal
          setShowModal={setModalWorkLocations} 
          formFor={"worklocations"}
          titleForm={"Work Locations"}
        />
      </Modal>

      <Modal
        isOpen={modalDesignation}
        contentLabel="Full Screen Modal"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: "none",
            backgroundColor: "transparent",
            padding: 0,
            margin: 0,
            overflow: "hidden",
          },
        }}>
        <FormModal
          setShowModal={setModalDesignation} 
          submit={handleDesignationSubmit}
          isSingle={true}
          label={"Designation"}
          titleForm={"Designation"}
        />
      </Modal>

      <Modal
        isOpen={modalDepartement}
        contentLabel="Full Screen Modal"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: "none",
            backgroundColor: "transparent",
            padding: 0,
            margin: 0,
            overflow: "hidden",
          },
        }}>
        <FormModal
          setShowModal={setModalDepartement} 
          titleForm={"Departement"}
          formFor={"departement"}
        />
      </Modal>
    </>
  );
}
export default BasicDetails;