import { useState } from "react";
import { TrashIcon } from "@phosphor-icons/react";
import ReuseableInput from "../../reuseableInput";
import Select from "react-select";
import CustomOption from "../../customOption";
import { checkPermission, flagImage } from "../../../../../helper/globalHelper";
import employeeStoreManagements from "../../../../store/tdPayroll/employee";
import authStoreManagements from "../../../../store/tdPayroll/auth";
import { useLocation } from "react-router-dom";
import { employeeCitizenCategory, employeeDifferentlyAbledType } from "../../../../../data/dummy";
import ToggleAction from "../../toggle";
import { toast } from "react-toastify";
import { CustomToast } from "../../customToast";

function ExtendedPersonalForm({
  setFormData, 
  formData,
  departementOptions,
  workLocationOptions,
  designationOptions,
  employmentTypeOptions,
  phoneNumberData,
  handleDepartementSelect,
  handleWorkLocationSelect,
  handleDesignationSelect,
  setModalDepartement,
  setModalWorkLocations,
  setModalDesignation,
  dataStatePresent,
  dataStatePermanent,
  dataCityPresent,
  dataCityPermanent,
  dataCountryPresent,
  dataCountryPermanent,
  handlePresentCitySelect,
  handlePresentStateSelect,
  handlePresentCountrySelect,
  handlePermanentCitySelect,
  handlePermanentStateSelect,
  handlePermanentCountrySelect
}) {
  const { pathname } = useLocation();
  const { dataEmployeePersonalDetail, reinviteEmployee } = employeeStoreManagements();
  const { user } = authStoreManagements();
  
  // ✅ Reinvite state
  const [showReinviteInput, setShowReinviteInput] = useState(false);
  const [reinviteEmail, setReinviteEmail] = useState('');
  const [isReinviting, setIsReinviting] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'dateOfBirth' && value) {
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setFormData(prev => ({
        ...prev,
        age: age.toString()
      }));
    }
    // Handle Citizen Category changes
    if (name === 'citizenCategory') {
      if (value === 'Brunei Citizen') {
        setFormData(prev => ({
          ...prev,
          icType: 'Yellow'
        }));
      } else if (value === 'Permanent') {
        setFormData(prev => ({
          ...prev,
          icType: 'Purple'
        }));
      } else if (value === 'Foreigner') {
        // Clear SPK Account Number for Foreigner
        setFormData(prev => ({
          ...prev,
          icType: 'Green',
          spkAccountNumber: ''
        }));
      } else {
        // If citizenCategory is cleared, also clear icType
        setFormData(prev => ({
          ...prev,
          icType: ''
        }));
      }
    }
  };

  const handleWorkExperienceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      educationDetails: prev.educationDetails.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperiences: [
        ...prev.workExperiences,
        {
          companyName: '',
          jobTitle: '',
          fromDate: '',
          toDate: '',
          jobDescription: '',
          relevant: 'Select'
        }
      ]
    }));
  };

  const addEducationDetail = () => {
    setFormData(prev => ({
      ...prev,
      educationDetails: [
        ...prev.educationDetails,
        {
          instituteName: '',
          degreeDiploma: '',
          specialization: '',
          dateOfCompletion: '',
          score: ''
        }
      ]
    }));
  };

  const removeWorkExperience = (index) => {
    if (formData.workExperiences.length > 1) {
      setFormData(prev => ({
        ...prev,
        workExperiences: prev.workExperiences.filter((_, i) => i !== index)
      }));
    }
  };

  const removeEducationDetail = (index) => {
    if (formData.educationDetails.length > 1) {
      setFormData(prev => ({
        ...prev,
        educationDetails: prev.educationDetails.filter((_, i) => i !== index)
      }));
    }
  };

  // ✅ Handler untuk Reinvite Employee
  const handleReinvite = async () => {
    if (!reinviteEmail || !reinviteEmail.includes('@')) {
      toast(<CustomToast message="Please enter a valid email address" status={"error"} />, {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
      });
      return;
    }

    setIsReinviting(true);
    try {
      const access_token = localStorage.getItem("accessToken");
      const employeeUuid = dataEmployeePersonalDetail?.employeeUuid || formData?.employeeUuid;
      
      if (!employeeUuid) {
        throw new Error("Employee UUID not found");
      }

      const response = await reinviteEmployee(reinviteEmail, access_token, employeeUuid);
      
      if (response) {
        toast(<CustomToast message={response} status={"success"} />, {
          autoClose: 3000,
          closeButton: false,
          hideProgressBar: true,
          position: "top-center",
        });
        
        // Update formData email
        setFormData(prev => ({
          ...prev,
          email: reinviteEmail
        }));
        
        // Reset state
        setShowReinviteInput(false);
        setReinviteEmail('');
      }
    } catch (error) {
      toast(<CustomToast message={error?.response?.data?.message || error?.message || "Failed to reinvite employee"} status={"error"} />, {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
      });
    } finally {
      setIsReinviting(false);
    }
  };
  
  // Handler untuk "Same as Present Address"
  const handleSameAsPresent = (e) => {
    const checked = e.target.checked;
    if (checked) {
      // Copy all present address fields to permanent
      setFormData(prev => ({
        ...prev,
        sameAsPresentAddress: true,
        permanentAddressLine1: prev.presentAddressLine1,
        permanentAddressLine2: prev.presentAddressLine2,
        permanentCityUuid: prev.presentCityUuid,
        permanentCountryUuid: prev.presentCountryUuid,
        permanentStateUuid: prev.presentStateUuid,
        permanentPostcode: prev.presentPostcode,
      }));
    } else {
      // Uncheck - allow editing permanent address
      setFormData(prev => ({
        ...prev,
        sameAsPresentAddress: false,
      }));
    }
  };

  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      personalDetailPaymentInformation: {
        ...prev.personalDetailPaymentInformation,
        paymentMethod: method,
        ...(method !== 'Bank Transfer' && {
          bankName: '',
          accountHolderName: '',
          accountNumber: '',
        }),
      }
    }));
  };

  const handlePaymentInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personalDetailPaymentInformation: {
        ...prev.personalDetailPaymentInformation,
        [field]: value,
      }
    }));
  };

  return (
    <>
      {pathname == "/add-employees" ? (
        <div className="w-full h-fit flex flex-col items-center justify-center space-y-8">
          <div className="w-full mx-auto space-y-6">
            {/* Row 1 - Employment Type & Date of Exit */}
            <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="w-full flex items-center justify-start space-x-5">
                <ReuseableInput
                  label={"Employment Type"}
                  id="employmentTypeUuid"
                  name="employmentTypeUuid"
                  as="select"
                  value={formData.employmentTypeUuid}
                  onChange={handleInputChange}
                  required={true}
                  isFocusRing={false}
                  isBorderLeft={true}
                  borderColor="red-td-500"
                >
                  <option value="">Select Employment Type</option>
                  {employmentTypeOptions?.map((el) => (
                    <option value={el.value} key={el.value}>{el.label}</option>
                  ))}
                </ReuseableInput>
              </div>
              <div className="w-full flex items-center justify-start space-x-5">
                <ReuseableInput
                  label={"Date of Exit"}
                  id="dateOfExit"
                  name="dateOfExit"
                  type="date"
                  placeholder="dd-MM-yyyy"
                  value={formData.dateOfExit}
                  onChange={handleInputChange}
                  isFocusRing={false}
                />
              </div>
            </div>

            {/* Row 2 - Personal Email & Personal Mobile No */}
            <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="w-full flex items-center justify-start space-x-5">
                <ReuseableInput
                  label={"Personal Email"}
                  id="personalEmail"
                  name="personalEmail"
                  type="email"
                  placeholder="Enter Personal Email"
                  value={formData.personalEmail}
                  onChange={handleInputChange}
                  isFocusRing={false}
                />
              </div>
              <div className="w-full flex flex-col space-y-2">
                <h1 className="text-base font-medium text-[#374151]">Personal Mobile No</h1>
                <div className="flex items-center w-full gap-2">
                  <Select
                    options={phoneNumberData}
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setFormData(prev => ({
                          ...prev,
                          personalMobilePhoneCode: selectedOption.label,
                          personalMobileFlagIso: selectedOption.emoji,
                        }));
                      }
                    }}
                    className="w-40 z-20"
                    value={phoneNumberData?.find(option => option.label === formData.personalMobilePhoneCode)}
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
                        borderLeftWidth: '6px',
                        borderLeftColor: '#B91C1C',
                        borderRadius: '6px',
                        borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: '#d1d5db',
                          borderLeftColor: '#B91C1C',
                        }
                      }),
                    }}
                    menuPortalTarget={document.body}
                  />
                  
                  <ReuseableInput
                    id="personalMobile"
                    name="personalMobile"
                    type="number"
                    placeholder="Enter Mobile Number"
                    value={formData.personalMobile}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 15) {
                        handleInputChange(e);
                      }
                    }}
                    labelUnshow={true}
                    isFocusRing={false}
                    isBorderLeft={true}
                    borderColor="red-td-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Row 3 - date birth and age */}
            <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6 mb-6">
              <div className="w-full flex items-center justify-start space-x-5">
                <ReuseableInput
                  label={"Date of Birth"}
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  isFocusRing={false}
                  isBorderLeft={true}
                  borderColor={"red-td-500"}
                />
              </div>
              <div className="w-full flex items-center justify-start space-x-10">
                <ReuseableInput
                  label={`Age`}
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  isFocusRing={false}
                />
              </div>
            </div>

            {/* Row 4 - Differently Abled Type */}
            <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6 mb-6">
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

            {/* Row 5 - Present Address */}
            <div className="w-full flex flex-col items-start justify-start space-y-4">
              <h1 className="w-full text-base font-medium text-[#374151]">Present Address</h1>
              <div className="w-full space-y-4">
                <ReuseableInput
                  id="presentAddressLine1"
                  name="presentAddressLine1"
                  placeholder="Address Line 1"
                  value={formData.presentAddressLine1}
                  onChange={handleInputChange}
                  labelUnshow={true}
                  isFocusRing={false}
                  isBorderLeft={true}
                  borderColor="red-td-500"
                />

                <ReuseableInput
                  id="presentAddressLine2"
                  name="presentAddressLine2"
                  placeholder="Address Line 2"
                  value={formData.presentAddressLine2}
                  onChange={handleInputChange}
                  labelUnshow={true}
                  isFocusRing={false}
                />
              </div>
              <div className="w-full grid grid-cols-2 gap-4">
                <Select
                  options={dataCountryPresent?.map(c => ({
                    value: c.value,
                    label: c.name,
                  }))}
                  value={
                    formData.presentCountryUuid 
                      ? { 
                          value: formData.presentCountryUuid, 
                          label: dataCountryPresent?.find(c => c.value === formData.presentCountryUuid)?.name || ''
                        }
                      : null
                  }
                  onChange={handlePresentCountrySelect}
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
                      borderLeftColor: '#B91C1C',
                      borderRadius: '6px',
                      borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#d1d5db',
                        borderLeftColor: '#B91C1C',
                      }
                    }),
                  }}
                  menuPortalTarget={document.body}
                />
                <Select
                  options={dataStatePresent?.map(c => ({
                    value: c.id,
                    label: c.name,
                  }))}
                  value={
                    formData.presentStateUuid 
                      ? { 
                          value: formData.presentStateUuid, 
                          label: dataStatePresent?.find(c => c.id === formData.presentStateUuid)?.name || ''
                        }
                      : null
                  }
                  onChange={handlePresentStateSelect}
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
                      borderLeftColor: '#B91C1C',
                      borderRadius: '6px',
                      borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#d1d5db',
                        borderLeftColor: '#B91C1C',
                      }
                    }),
                  }}
                  menuPortalTarget={document.body}
                />
                <Select
                  options={dataCityPresent?.map(c => ({
                    value: c.id,
                    label: c.name,
                  }))}
                  value={
                    formData.presentCityUuid 
                      ? { 
                          value: formData.presentCityUuid, 
                          label: dataCityPresent?.find(c => c.id === formData.presentCityUuid)?.name || ''
                        }
                      : null
                  }
                  onChange={handlePresentCitySelect}
                  placeholder="Select City"
                  className='w-full bg-transparent focus:ring-0 outline-none text-sm'
                  classNames={{
                    control: () => "!rounded-md !bg-white !h-full",
                    valueContainer: () => "!px-2 !py-1.5",
                    indicatorsContainer: () => "!px-1",
                  }}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    control: (base, state) => ({
                      ...base,
                      borderLeftWidth: '6px',
                      borderLeftColor: '#B91C1C',
                      borderRadius: '6px',
                      borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#d1d5db',
                        borderLeftColor: '#B91C1C',
                      }
                    }),
                  }}
                  menuPortalTarget={document.body}
                />
                <ReuseableInput
                  id="presentPostcode"
                  name="presentPostcode"
                  placeholder="Postal Code"
                  value={formData.presentPostcode}
                  onChange={handleInputChange}
                  labelUnshow={true}
                  isFocusRing={false}
                  isBorderLeft={true}
                  borderColor="red-td-500"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-fit flex flex-col items-center justify-center space-y-8">
          <div className="w-full mx-auto space-y-6">
            {(checkPermission(user, "Basic And Personal Details", "Create") || checkPermission(user, "Basic And Personal Details", "Edit")) && (
              <>
                {/* ==================== BASIC INFORMATION SECTION ==================== */}
                <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  </div>
  
                  <div className="w-full flex flex-col items-start justify-start p-6 space-y-5 bg-white">
                    {/* Row 1 - Employee ID & Nick Name */}
                    <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6">
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-1/5 text-base font-medium text-[#374151]">Employee ID</h1>
                        <ReuseableInput
                          id="employeeId"
                          name="employeeId"
                          type="text"
                          placeholder="Enter Employee ID"
                          value={formData.employeeId}
                          onChange={handleInputChange}
                          isFocusRing={false}
                          isBorderLeft={true}
                          borderColor="red-td-500"
                        />
                      </div>
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-1/5 text-base font-medium text-[#374151]">Nick Name</h1>
                        <ReuseableInput
                          id="nickName"
                          name="nickName"
                          type="text"
                          placeholder="Enter Nick Name"
                          value={formData.nickName}
                          onChange={handleInputChange}
                          isFocusRing={false}
                        />
                      </div>
                    </div>
  
                    {/* Row 2 - First Name & Middle Name */}
                    <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6">
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-1/5 text-base font-medium text-[#374151]">First Name</h1>
                        <ReuseableInput
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="Enter First Name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          isFocusRing={false}
                          isBorderLeft={true}
                          borderColor="red-td-500"
                        />
                      </div>
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-1/5 text-base font-medium text-[#374151]">Middle Name</h1>
                        <ReuseableInput
                          id="middleName"
                          name="middleName"
                          type="text"
                          placeholder="Enter Middle Name"
                          value={formData.middleName}
                          onChange={handleInputChange}
                          isFocusRing={false}
                        />
                      </div>
                    </div>
  
                    {/* Row 3 - Last Name & Email Address */}
                    <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6">
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-1/5 text-base font-medium text-[#374151]">Last Name</h1>
                        <ReuseableInput
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Enter Last Name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          isFocusRing={false}
                          isBorderLeft={true}
                          borderColor="red-td-500"
                        />
                      </div>
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-1/5 text-base font-medium text-[#374151]">Email Address</h1>
                        <ReuseableInput
                          id="emailAddress"
                          name="emailAddress"
                          type="email"
                          placeholder="Enter Email Address"
                          value={formData.emailAddress}
                          onChange={handleInputChange}
                          isFocusRing={false}
                          isBorderLeft={true}
                          borderColor="red-td-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* ==================== WORK INFORMATION SECTION ==================== */}
                <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Work Information</h3>
                  </div>
  
                  <div className="w-full flex flex-col items-start justify-start p-6 space-y-5 bg-white">
                    {/* Row 1 - Department & TEKYDOCT Role */}
                    <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6">
                      {/* Department - Dynamic from DB */}
                      <div className="w-full flex items-start justify-center space-x-5">
                        <h1 className="w-1/3 h-full flex items-center justify-start text-base font-medium text-[#374151]">Department</h1>
                        <Select
                          options={departementOptions}
                          onChange={handleDepartementSelect}
                          value={departementOptions.find(opt => opt.value === formData.departementUuid)}
                          className='w-full bg-transparent focus:ring-0 outline-none text-sm'
                          placeholder="Select Department"
                          classNames={{
                            control: () => "!rounded-md !bg-white !h-full",
                            valueContainer: () => "!px-2 !py-1.5",
                            indicatorsContainer: () => "!px-1",
                          }}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            control: (base, state) => ({
                              ...base,
                              borderLeftWidth: '6px',
                              borderLeftColor: '#B91C1C',
                              borderRadius: '6px',
                              borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                              boxShadow: 'none',
                              '&:hover': {
                                borderColor: '#d1d5db',
                                borderLeftColor: '#B91C1C',
                              }
                            }),
                          }}
                          components={{ 
                            Option: (props) => (
                              <CustomOption 
                                props={props} 
                                onCreateNew={() => setModalDepartement(true)}
                                createNewLabel="New Department"
                              />
                            )
                          }}
                          menuPortalTarget={document.body}
                          filterOption={(option, rawInput) => {
                            if (option.value === "create-new-data") {
                              return true;
                            }
                            if (!option.label || typeof option.label !== 'string') {
                              return false;
                            }
                            return option.label.toLowerCase().includes(rawInput.toLowerCase());
                          }}
                        />
                      </div>
                      
                      {/* TEKYDOCT Role */}
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-1/3 text-base font-medium text-[#374151]">TEKYDOCT Role</h1>
                        <ReuseableInput
                          id="roleUuid"
                          name="roleUuid"
                          as="select"
                          value={formData.roleUuid}
                          onChange={handleInputChange}
                          required={true}
                          isFocusRing={false}
                          isBorderLeft={true}
                          borderColor="red-td-500"
                        >
                          <option value="">Select TEKYDOCT Role</option>
                          {dataEmployeePersonalDetail?.roleOrganization?.map((role, index) => (
                            <option value={role?.uuid} key={index}>{role?.name}</option>
                          ))}
                        </ReuseableInput>
                      </div>
                    </div>
  
                    {/* Row 2 - Location & Employment Type */}
                    <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6">
                      {/* Work Location - Dynamic from DB */}
                      <div className="w-full flex items-start justify-center space-x-5">
                        <h1 className="w-1/3 h-full flex items-center justify-start text-base font-medium text-[#374151]">Location</h1>
                        <Select
                          options={workLocationOptions}
                          onChange={handleWorkLocationSelect}
                          value={workLocationOptions?.find(opt => opt.value === formData.workLocationUuid)}
                          className='w-full bg-transparent focus:ring-0 outline-none text-sm'
                          placeholder="Select Location"
                          classNames={{
                            control: () => "!rounded-md !bg-white !h-full",
                            valueContainer: () => "!px-2 !py-1.5",
                            indicatorsContainer: () => "!px-1",
                          }}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            control: (base, state) => ({
                              ...base,
                              borderLeftWidth: '6px',
                              borderLeftColor: '#B91C1C',
                              borderRadius: '6px',
                              borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                              boxShadow: 'none',
                              '&:hover': {
                                borderColor: '#d1d5db',
                                borderLeftColor: '#B91C1C',
                              }
                            }),
                          }}
                          components={{ 
                            Option: (props) => (
                              <CustomOption 
                                props={props} 
                                onCreateNew={() => setModalWorkLocations(true)}
                                createNewLabel="New Work Location"
                              />
                            )
                          }}
                          menuPortalTarget={document.body}
                          filterOption={(option, rawInput) => {
                            if (option.value === "create-new-data") {
                              return true;
                            }
                            if (!option.label || typeof option.label !== 'string') {
                              return false;
                            }
                            return option.label.toLowerCase().includes(rawInput.toLowerCase());
                          }}
                        />
                      </div>
                      
                      {/* Employment Type */}
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-1/3 text-base font-medium text-[#374151]">Employment Type</h1>
                        <ReuseableInput
                          id="employmentTypeUuid"
                          name="employmentTypeUuid"
                          as="select"
                          value={formData.employmentTypeUuid}
                          onChange={handleInputChange}
                          required={true}
                          isFocusRing={false}
                          isBorderLeft={true}
                          borderColor="red-td-500"
                        >
                          <option value="">Select Employment Type</option>
                          {employmentTypeOptions?.map((el) => (
                            <option value={el.value} key={el.value}>{el.label}</option>
                          ))}
                        </ReuseableInput>
                      </div>
                    </div>
  
                    {/* Row 3 - Designation & Employee Status */}
                    <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6">
                      {/* Designation - Dynamic from DB */}
                      <div className="w-full flex items-start justify-center space-x-5">
                        <h1 className="w-1/3 h-full flex items-center justify-start text-base font-medium text-[#374151]">Designation</h1>
                        <Select
                          options={designationOptions}
                          onChange={handleDesignationSelect}
                          value={designationOptions.find(opt => opt.value === formData.designationUuid)}
                          className='w-full bg-transparent focus:ring-0 outline-none text-sm'
                          placeholder="Select Designation"
                          classNames={{
                            control: () => "!rounded-md !bg-white !h-full",
                            valueContainer: () => "!px-2 !py-1.5",
                            indicatorsContainer: () => "!px-1",
                          }}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            control: (base, state) => ({
                              ...base,
                              borderLeftWidth: '6px',
                              borderLeftColor: '#B91C1C',
                              borderRadius: '6px',
                              borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                              boxShadow: 'none',
                              '&:hover': {
                                borderColor: '#d1d5db',
                                borderLeftColor: '#B91C1C',
                              }
                            }),
                          }}
                          components={{ 
                            Option: (props) => (
                              <CustomOption 
                                props={props} 
                                onCreateNew={() => setModalDesignation(true)}
                                createNewLabel="New Designation"
                              />
                            )
                          }}
                          menuPortalTarget={document.body}
                          filterOption={(option, rawInput) => {
                            if (option.value === "create-new-data") {
                              return true;
                            }
                            if (!option.label || typeof option.label !== 'string') {
                              return false;
                            }
                            return option.label.toLowerCase().includes(rawInput.toLowerCase());
                          }}
                        />
                      </div>
                      
                      {/* Employee Status */}
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-1/3 text-base font-medium text-[#374151]">Employee Status</h1>
                        <ReuseableInput
                          id="employeeStatus"
                          name="employeeStatus"
                          as="select"
                          value={formData.employeeStatus}
                          onChange={handleInputChange}
                          required={true}
                          isFocusRing={false}
                          isBorderLeft={true}
                          borderColor="red-td-500"
                        >
                          <option value="">Select Employee Status</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="On Leave">On Leave</option>
                          <option value="Resigned">Resigned</option>
                        </ReuseableInput>
                      </div>
                    </div>
  
                    {/* Row 4 - Date of Joining & Date of Exit */}
                    <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6">
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-[24%] text-base font-medium text-[#374151]">Date of Joining</h1>
                        <ReuseableInput
                          id="dateOfJoining"
                          name="dateOfJoining"
                          type="date"
                          placeholder="dd-MM-yyyy"
                          value={formData.dateOfJoining}
                          onChange={handleInputChange}
                          required={true}
                          isFocusRing={false}
                          isBorderLeft={true}
                          borderColor="red-td-500"
                        />
                      </div>
                      
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-1/3 text-base font-medium text-[#374151]">Date of Exit</h1>
                        <ReuseableInput
                          id="dateOfExit"
                          name="dateOfExit"
                          type="date"
                          placeholder="dd-MM-yyyy"
                          value={formData.dateOfExit}
                          onChange={handleInputChange}
                          isFocusRing={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
  
                {/* ==================== PERSONAL DETAILS - KEEP AS IS FROM FILE ==================== */}
                <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
                  </div>
  
                  <div className="w-full flex flex-col items-start justify-start p-6 space-y-5 bg-white">
                    {/* Row 1 - Date of Birth & Age */}
                    <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6 mb-6">
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-1/5 text-base font-medium text-[#374151]">Date of Birth</h1>
                        <ReuseableInput
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          isFocusRing={false}
                          isBorderLeft={true}
                          borderColor={"red-td-500"}
                        />
                      </div>
                      <div className="w-full flex items-center justify-start space-x-10">
                        <div className="text-base h-full flex items-center justify-center font-medium text-[#374151]">
                          Age
                        </div>
                        <ReuseableInput
                          id="age"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          isFocusRing={false}
                        />
                      </div>
                    </div>
  
                    {/* Row 2 - Gender & Marital Status */}
                    <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6 mb-6">
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-1/5 text-base font-medium text-[#374151]">Gender</h1>
                        <ReuseableInput
                          id="gender"
                          name="gender"
                          as="select"
                          value={formData.gender}
                          onChange={handleInputChange}
                          isFocusRing={false}
                          isBorderLeft={true}
                          borderColor={"red-td-500"}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </ReuseableInput>
                      </div>
                      
                      <div className="w-full flex items-center justify-start space-x-10">
                        <label className="text-base font-medium text-[#374151]">
                          Marital Status
                        </label>
                        <div className="flex items-center space-x-10 py-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="maritalStatus"
                              value="Single"
                              checked={formData.maritalStatus === 'Single'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-base text-[#111827]">Single</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="maritalStatus"
                              value="Married"
                              checked={formData.maritalStatus === 'Married'}
                              onChange={handleInputChange}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-base text-[#111827]">Married</span>
                          </label>
                        </div>
                      </div>
                    </div>
  
                    {/* Row 3 - About Me */}
                    <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6">
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-1/5 text-base font-medium text-[#374151]">About Me</h1>
                        <ReuseableInput
                          as="textarea"
                          id="aboutMe"
                          name="aboutMe"
                          value={formData.aboutMe}
                          onChange={(e) => handleInputChange('aboutMe', e.target.value)}
                          rows={2}
                          isFocusRing={false}
                          isBorderLeft={true}
                          borderColor="red-td-500"
                        />
                      </div>
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-1/5 text-base font-medium text-[#374151]">Father Name</h1>
                        <ReuseableInput
                          id="FatherName"
                          name="FatherName"
                          value={formData.FatherName}
                          onChange={handleInputChange}
                          isFocusRing={false}
                          isBorderLeft={true}
                          borderColor={"red-td-500"}
                        />
                      </div>
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-1/5 text-base font-medium text-[#374151]">Differently Abled Type</h1>
                        <ReuseableInput
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
                      {/* ✅ Employee Status Toggle */}
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-1/5 text-base font-medium text-[#374151]">Employee Status</h1>
                        <div className="flex items-center space-x-3">
                          <span className={`text-sm font-medium ${(formData.status === 'active' || !formData.status) ? 'text-green-600' : 'text-gray-600'}`}>
                            {(formData.status === 'active' || !formData.status) ? 'Active' : 'Inactive'}
                          </span>
                          <ToggleAction
                            isEnabled={formData.status === 'active' || !formData.status}
                            setAction={(isChecked) => {
                              setFormData(prev => ({
                                ...prev,
                                status: isChecked ? 'active' : 'inactive'
                              }));
                            }}
                          />
                        </div>
                      </div>
                      {/* ✅ Enable Portal Access Toggle */}
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-1/5 text-base font-medium text-[#374151]">Enable Portal Access</h1>
                        <div className="flex items-center space-x-3">
                          <span className={`text-sm font-medium ${formData.isEnablePortalAccess ? 'text-green-600' : 'text-gray-600'}`}>
                            {formData.isEnablePortalAccess ? 'Enabled' : 'Disabled'}
                          </span>
                          <ToggleAction
                            isEnabled={formData.isEnablePortalAccess || false}
                            setAction={(isChecked) => {
                              setFormData(prev => ({
                                ...prev,
                                isEnablePortalAccess: isChecked
                              }));
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* ✅ Reinvite Section - Only show if portal access is enabled */}
                      {formData.isEnablePortalAccess && (
                        <div className="w-full flex items-center justify-start space-x-5">
                          <h1 className="w-1/5 text-base font-medium text-[#374151]">Reinvite</h1>
                          <div className="flex-1 flex items-center space-x-2">
                            {!showReinviteInput ? (
                              <button
                                type="button"
                                onClick={() => setShowReinviteInput(true)}
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                              >
                                Reinvite
                              </button>
                            ) : (
                              <>
                                <div className="flex-1">
                                  <ReuseableInput
                                    type="email"
                                    id="reinviteEmail"
                                    name="reinviteEmail"
                                    placeholder="Enter email"
                                    value={reinviteEmail}
                                    onChange={(e) => setReinviteEmail(e.target.value)}
                                    isFocusRing={false}
                                    isBorderLeft={true}
                                    borderColor={"red-td-500"}
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={handleReinvite}
                                  disabled={isReinviting}
                                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                  {isReinviting ? 'Sending...' : 'Send'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowReinviteInput(false);
                                    setReinviteEmail('');
                                  }}
                                  className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
  
                {/* ==================== IDENTITY INFORMATION ==================== */}
                <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Identity Information</h3>
                  </div>
  
                  <div className="w-full flex flex-col items-start justify-start p-6 space-y-5 bg-white">
                    <div className="w-full flex items-center justify-start space-x-5">
                      <h1 className="w-1/5 text-base font-medium text-[#374151]">IC Number</h1>
                      <ReuseableInput
                        id="icNumber"
                        name="icNumber"
                        value={formData.icNumber}
                        onChange={handleInputChange}
                        isFocusRing={false}
                        isBorderLeft={true}
                        borderColor={"red-td-500"}
                      />
                    </div>
                    <div className="w-full flex items-center justify-start space-x-5">
                      <h1 className="w-1/5 text-base font-medium text-[#374151]">Driving License</h1>
                      <ReuseableInput
                        id="drivingLicense"
                        name="drivingLicense"
                        value={formData.drivingLicense}
                        onChange={handleInputChange}
                        isFocusRing={false}
                        isBorderLeft={true}
                        borderColor={"red-td-500"}
                      />
                    </div>
                    <div className="w-full flex items-center justify-start space-x-5">
                      <h1 className="w-1/5 text-base font-medium text-[#374151]">Passport Number</h1>
                      <ReuseableInput
                        id="passportNumber"
                        name="passportNumber"
                        value={formData.passportNumber}
                        onChange={handleInputChange}
                        isFocusRing={false}
                        isBorderLeft={true}
                        borderColor={"red-td-500"}
                      />
                    </div>
                    <div className="w-full flex items-center justify-start space-x-5">
                      <h1 className="w-1/5 text-base font-medium text-[#374151]">Citizen Category</h1>
                      <ReuseableInput
                        id="citizenCategory"
                        name="citizenCategory"
                        value={formData.citizenCategory}
                        onChange={handleInputChange}
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
                    </div>
                    <div className="w-full flex items-center justify-start space-x-5">
                      <h1 className="w-1/5 text-base font-medium text-[#374151]">IC Type</h1>
                      <ReuseableInput
                        id="icType"
                        name="icType"
                        value={formData.icType}
                        onChange={handleInputChange}
                        isFocusRing={false}
                        isBorderLeft={true}
                        borderColor={"red-td-500"}
                        isDisabled={!!formData.citizenCategory}
                      />
                    </div>
                    {(formData.citizenCategory === 'Brunei Citizen' || formData.citizenCategory === 'Permanent') && (
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-1/5 text-base font-medium text-[#374151]">SPK Account Number</h1>
                        <ReuseableInput
                          id="spkAccountNumber"
                          name="spkAccountNumber"
                          value={formData.spkAccountNumber}
                          onChange={handleInputChange}
                          isFocusRing={false}
                          isBorderLeft={true}
                          borderColor={"red-td-500"}
                          required={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
  
                {/* ==================== CONTACT DETAILS SECTION ==================== */}
                <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Contact Details</h3>
                  </div>
  
                  <div className="w-full flex flex-col items-start justify-start p-6 space-y-5 bg-white">
                    {/* Row 1 - Work Phone No 1 & Personal Mobile No */}
                    <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6">
                      {/* Work Phone No 1 */}
                      <div className="w-full flex items-start justify-center space-x-5">
                        <h1 className="w-1/3 h-full flex items-center justify-start text-base font-medium text-[#374151]">Work Phone No 1</h1>
                        <div className="flex items-center w-full gap-2">
                          <Select
                            options={phoneNumberData}
                            onChange={(selectedOption) => {
                              if (selectedOption) {
                                setFormData(prev => ({
                                  ...prev,
                                  workPhone1PhoneCode: selectedOption.label,
                                  workPhone1FlagIso: selectedOption.emoji,
                                }));
                              }
                            }}
                            className="w-40 z-20"
                            value={phoneNumberData?.find(option => option.label === formData.workPhone1PhoneCode)}
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
                                borderLeftWidth: '6px',
                                borderLeftColor: '#B91C1C',
                                borderRadius: '6px',
                                borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                                boxShadow: 'none',
                                '&:hover': {
                                  borderColor: '#d1d5db',
                                  borderLeftColor: '#B91C1C',
                                }
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
                              if (value.length <= 15) {
                                handleInputChange(e);
                              }
                            }}
                            labelUnshow={true}
                            isFocusRing={false}
                            isBorderLeft={true}
                            borderColor="red-td-500"
                          />
                        </div>
                      </div>
  
                      {/* Personal Mobile No */}
                      <div className="w-full flex items-start justify-center space-x-5">
                        <h1 className="w-1/3 h-full flex items-center justify-start text-base font-medium text-[#374151]">Personal Mobile No</h1>
                        <div className="flex items-center w-full gap-2">
                          <Select
                            options={phoneNumberData}
                            onChange={(selectedOption) => {
                              if (selectedOption) {
                                setFormData(prev => ({
                                  ...prev,
                                  personalMobilePhoneCode: selectedOption.label,
                                  personalMobileFlagIso: selectedOption.emoji,
                                }));
                              }
                            }}
                            className="w-40 z-20"
                            value={phoneNumberData?.find(option => option.label === formData.personalMobilePhoneCode)}
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
                                borderLeftWidth: '6px',
                                borderLeftColor: '#B91C1C',
                                borderRadius: '6px',
                                borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                                boxShadow: 'none',
                                '&:hover': {
                                  borderColor: '#d1d5db',
                                  borderLeftColor: '#B91C1C',
                                }
                              }),
                            }}
                            menuPortalTarget={document.body}
                          />
                          
                          <ReuseableInput
                            id="personalMobile"
                            name="personalMobile"
                            type="number"
                            value={formData.personalMobile}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 15) {
                                handleInputChange(e);
                              }
                            }}
                            labelUnshow={true}
                            isFocusRing={false}
                            isBorderLeft={true}
                            borderColor="red-td-500"
                          />
                        </div>
                      </div>
                    </div>
  
                    {/* Row 2 - Work Phone No 2 & Personal Email */}
                    <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6">
                      {/* Work Phone No 2 */}
                      <div className="w-full flex items-start justify-center space-x-5">
                        <h1 className="w-1/3 h-full flex items-center justify-start text-base font-medium text-[#374151]">Work Phone No 2</h1>
                        <div className="flex items-center w-full gap-2">
                          <Select
                            options={phoneNumberData}
                            onChange={(selectedOption) => {
                              if (selectedOption) {
                                setFormData(prev => ({
                                  ...prev,
                                  workPhone2PhoneCode: selectedOption.label,
                                  workPhone2FlagIso: selectedOption.emoji,
                                }));
                              }
                            }}
                            className="w-40 z-20"
                            value={phoneNumberData?.find(option => option.label === formData.workPhone2PhoneCode)}
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
                                '&:hover': {
                                  borderColor: '#d1d5db',
                                }
                              }),
                            }}
                            menuPortalTarget={document.body}
                          />
                          
                          <ReuseableInput
                            id="phoneNumber2"
                            name="phoneNumber2"
                            type="number"
                            placeholder="Enter Mobile Number"
                            value={formData.phoneNumber2}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 15) {
                                handleInputChange(e);
                              }
                            }}
                            labelUnshow={true}
                            isFocusRing={false}
                          />
                        </div>
                      </div>
  
                      {/* Personal Email */}
                      <div className="w-full flex items-center justify-start space-x-5">
                        <h1 className="w-[24%] text-base font-medium text-[#374151]">Personal Email</h1>
                        <ReuseableInput
                          id="personalEmail"
                          name="personalEmail"
                          type="email"
                          placeholder="Enter Personal Email"
                          value={formData.personalEmail}
                          onChange={handleInputChange}
                          isFocusRing={false}
                        />
                      </div>
                    </div>
  
                    {/* Row 3 - Present Address & Permanent Address */}
                    <div className="w-full grid grid-cols-2 gap-x-8 gap-y-6">
                      {/* PRESENT ADDRESS */}
                      <div className="w-full flex flex-col items-start justify-start space-y-4">
                        <div className="w-full flex items-center justify-start space-x-5">
                          <h1 className="w-[24%] text-base font-medium text-[#374151]">Present Address</h1>  
                          <ReuseableInput
                            id="presentAddressLine1"
                            name="presentAddressLine1"
                            placeholder="Address Line 1"
                            value={formData.presentAddressLine1}
                            onChange={handleInputChange}
                            labelUnshow={true}
                            isFocusRing={false}
                            isBorderLeft={true}
                            borderColor="red-td-500"
                          />
                        </div>
                        <div className="w-full flex items-center justify-end">
                          <div className="w-[73%] space-y-4"> 
                            <ReuseableInput
                              id="presentAddressLine2"
                              name="presentAddressLine2"
                              placeholder="Address Line 2"
                              value={formData.presentAddressLine2}
                              onChange={handleInputChange}
                              labelUnshow={true}
                              isFocusRing={false}
                            />
  
                            <Select
                              options={dataCountryPresent?.map(c => ({
                                value: c.value,
                                label: c.name,
                              }))}
                              value={
                                formData.presentCountryUuid 
                                  ? { 
                                      value: formData.presentCountryUuid, 
                                      label: dataCountryPresent?.find(c => c.value === formData.presentCountryUuid)?.name || ''
                                    }
                                  : null
                              }
                              onChange={handlePresentCountrySelect}
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
                                  borderLeftColor: '#B91C1C',
                                  borderRadius: '6px',
                                  borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                                  boxShadow: 'none',
                                  '&:hover': {
                                    borderColor: '#d1d5db',
                                    borderLeftColor: '#B91C1C',
                                  }
                                }),
                              }}
                              menuPortalTarget={document.body}
                            />
  
                            <div className="w-full flex flex-row space-x-4">
                              <Select
                                options={dataStatePresent?.map(c => ({
                                  value: c.id,
                                  label: c.name,
                                }))}
                                value={
                                  formData.presentStateUuid 
                                    ? { 
                                        value: formData.presentStateUuid, 
                                        label: dataStatePresent?.find(c => c.id === formData.presentStateUuid)?.name || ''
                                      }
                                    : null
                                }
                                onChange={handlePresentStateSelect}
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
                                    borderLeftColor: '#B91C1C',
                                    borderRadius: '6px',
                                    borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                                    boxShadow: 'none',
                                    '&:hover': {
                                      borderColor: '#d1d5db',
                                      borderLeftColor: '#B91C1C',
                                    }
                                  }),
                                }}
                                menuPortalTarget={document.body}
                              />
                              <Select
                                options={dataCityPresent?.map(c => ({
                                  value: c.id,
                                  label: c.name,
                                }))}
                                value={
                                  formData.presentCityUuid 
                                    ? { 
                                        value: formData.presentCityUuid, 
                                        label: dataCityPresent?.find(c => c.id === formData.presentCityUuid)?.name || ''
                                      }
                                    : null
                                }
                                onChange={handlePresentCitySelect}
                                placeholder="Select City"
                                className='w-full bg-transparent focus:ring-0 outline-none text-sm'
                                classNames={{
                                  control: () => "!rounded-md !bg-white !h-full",
                                  valueContainer: () => "!px-2 !py-1.5",
                                  indicatorsContainer: () => "!px-1",
                                }}
                                styles={{
                                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                  control: (base, state) => ({
                                    ...base,
                                    borderLeftWidth: '6px',
                                    borderLeftColor: '#B91C1C',
                                    borderRadius: '6px',
                                    borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                                    boxShadow: 'none',
                                    '&:hover': {
                                      borderColor: '#d1d5db',
                                      borderLeftColor: '#B91C1C',
                                    }
                                  }),
                                }}
                                menuPortalTarget={document.body}
                              />
                            </div>
                            
                            <ReuseableInput
                              id="presentPostcode"
                              name="presentPostcode"
                              placeholder="Postal Code"
                              value={formData.presentPostcode}
                              onChange={handleInputChange}
                              labelUnshow={true}
                              isFocusRing={false}
                              isBorderLeft={true}
                              borderColor="red-td-500"
                            />
                          </div>
                        </div>
                      </div>
  
                      {/* PERMANENT ADDRESS */}
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-start space-x-12">
                          <label className="block text-base font-medium">Permanent Address</label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="sameAsPresentAddress"
                              checked={formData.sameAsPresentAddress}
                              onChange={handleSameAsPresent}
                              className="w-4 h-4"
                            />
                            <span className="text-sm text-gray-600">Same as Present Address</span>
                          </label>
                        </div>
                        
                        <div className="w-full flex items-center justify-end">
                          <div className="w-[73%] space-y-4">
                            <ReuseableInput
                              id="permanentAddressLine1"
                              name="permanentAddressLine1"
                              placeholder="Address Line 1"
                              value={formData.permanentAddressLine1}
                              onChange={handleInputChange}
                              labelUnshow={true}
                              isFocusRing={false}
                              isBorderLeft={true}
                              borderColor="red-td-500"
                              isDisabled={formData.sameAsPresentAddress}
                            />
                            
                            <ReuseableInput
                              id="permanentAddressLine2"
                              name="permanentAddressLine2"
                              placeholder="Address Line 2"
                              value={formData.permanentAddressLine2}
                              onChange={handleInputChange}
                              labelUnshow={true}
                              isFocusRing={false}
                              isDisabled={formData.sameAsPresentAddress}
                            />
  
                            <Select
                              options={dataCountryPermanent?.map(c => ({
                                value: c.value,
                                label: c.name,
                              }))}
                              value={
                                formData.permanentCountryUuid 
                                  ? { 
                                      value: formData.permanentCountryUuid, 
                                      label: dataCountryPermanent?.find(c => c.value === formData.permanentCountryUuid)?.name || ''
                                    }
                                  : null
                              }
                              onChange={handlePermanentCountrySelect}
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
                                  borderLeftColor: '#B91C1C',
                                  borderRadius: '6px',
                                  borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                                  boxShadow: 'none',
                                  '&:hover': {
                                    borderColor: '#d1d5db',
                                    borderLeftColor: '#B91C1C',
                                  }
                                }),
                              }}
                              menuPortalTarget={document.body}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <Select
                                options={dataStatePermanent?.map(c => ({
                                  value: c.id,
                                  label: c.name,
                                }))}
                                value={
                                  formData.permanentStateUuid 
                                    ? { 
                                        value: formData.permanentStateUuid, 
                                        label: dataStatePermanent?.find(c => c.id === formData.permanentStateUuid)?.name || ''
                                      }
                                    : null
                                }
                                onChange={handlePermanentStateSelect}
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
                                    borderLeftColor: '#B91C1C',
                                    borderRadius: '6px',
                                    borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                                    boxShadow: 'none',
                                    '&:hover': {
                                      borderColor: '#d1d5db',
                                      borderLeftColor: '#B91C1C',
                                    }
                                  }),
                                }}
                                menuPortalTarget={document.body}
                              />
  
                              <Select
                                options={dataCityPermanent?.map(c => ({
                                  value: c.id,
                                  label: c.name,
                                }))}
                                value={
                                  formData.permanentCityUuid 
                                    ? { 
                                        value: formData.permanentCityUuid, 
                                        label: dataCityPermanent?.find(c => c.id === formData.permanentCityUuid)?.name || ''
                                      }
                                    : null
                                }
                                onChange={handlePermanentCitySelect}
                                placeholder="Select City"
                                className='w-full bg-transparent focus:ring-0 outline-none text-sm'
                                classNames={{
                                  control: () => "!rounded-md !bg-white !h-full",
                                  valueContainer: () => "!px-2 !py-1.5",
                                  indicatorsContainer: () => "!px-1",
                                }}
                                styles={{
                                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                  control: (base, state) => ({
                                    ...base,
                                    borderLeftWidth: '6px',
                                    borderLeftColor: '#B91C1C',
                                    borderRadius: '6px',
                                    borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                                    boxShadow: 'none',
                                    '&:hover': {
                                      borderColor: '#d1d5db',
                                      borderLeftColor: '#B91C1C',
                                    }
                                  }),
                                }}
                                menuPortalTarget={document.body}
                              />
                            </div>
                            
                            <ReuseableInput
                              id="permanentPostcode"
                              name="permanentPostcode"
                              placeholder="Postal Code"
                              value={formData.permanentPostcode}
                              onChange={handleInputChange}
                              labelUnshow={true}
                              isFocusRing={false}
                              isBorderLeft={true}
                              borderColor="red-td-500"
                              isDisabled={formData.sameAsPresentAddress}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
  
            {(checkPermission(user, "Payment Information", "Create") || checkPermission(user, "Payment Information", "Edit")) && (
              <>
                {/* ==================== PAYMENT INFORMATION ==================== */}
                <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
                  </div>
  
                  <div className="w-full flex flex-col items-start justify-start p-6 space-y-5 bg-white">
                    {/* Payment Method Radio Buttons */}
                    <div>
                      <div className="flex items-center space-x-6">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Bank Transfer"
                            checked={formData.personalDetailPaymentInformation?.paymentMethod === 'Bank Transfer'}
                            onChange={(e) => handlePaymentMethodChange(e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">Bank Transfer (Manual Process)</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Cheque"
                            checked={formData.personalDetailPaymentInformation?.paymentMethod === 'Cheque'}
                            onChange={(e) => handlePaymentMethodChange(e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">Cheque</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="Cash"
                            checked={formData.personalDetailPaymentInformation?.paymentMethod === 'Cash'}
                            onChange={(e) => handlePaymentMethodChange(e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">Cash</span>
                        </label>
                      </div>
                    </div>
                  </div>
                    
                  <div className="p-4 space-y-4 bg-white">
                    {/* Bank Transfer Fields */}
                    {formData.personalDetailPaymentInformation?.paymentMethod === 'Bank Transfer' && (
                      <div className="w-full flex flex-col items-start justify-start p-6 space-y-5 bg-white">
                        <div className="w-full flex items-center justify-start space-x-5">
                          <h1 className="w-1/5 text-base font-medium text-[#374151]">Bank Name</h1>
                          <ReuseableInput
                            id="bankName"
                            name="bankName"
                            value={formData.personalDetailPaymentInformation?.bankName || ''}
                            onChange={(e) => handlePaymentInfoChange('bankName', e.target.value)}
                            isFocusRing={false}
                            isBorderLeft={true}
                            borderColor={"red-td-500"}
                          />
                        </div>
                        <div className="w-full flex items-center justify-start space-x-5">
                          <h1 className="w-1/5 text-base font-medium text-[#374151]">Account Holder Name</h1>
                          <ReuseableInput
                            id="accountHolderName"
                            name="accountHolderName"
                            value={formData.personalDetailPaymentInformation?.accountHolderName || ''}
                            onChange={(e) => handlePaymentInfoChange('accountHolderName', e.target.value)}
                            isFocusRing={false}
                            isBorderLeft={true}
                            borderColor={"red-td-500"}
                          />
                        </div>
                        <div className="w-full flex items-center justify-start space-x-5">
                          <h1 className="w-1/5 text-base font-medium text-[#374151]">Account Number</h1>
                          <ReuseableInput
                            id="accountNumber"
                            name="accountNumber"
                            value={formData.personalDetailPaymentInformation?.accountNumber || ''}
                            onChange={(e) => handlePaymentInfoChange('accountNumber', e.target.value)}
                            isFocusRing={false}
                            isBorderLeft={true}
                            borderColor={"red-td-500"}
                          />
                        </div>
                        <div className="w-full flex items-center justify-start space-x-5">
                            <label className="block font-medium">
                                Account Type<span className="text-blue-500">*</span>
                            </label>
                            <div className="flex items-center space-x-6 mt-3">
                                <label className="flex items-center space-x-2">
                                  <input
                                      type="radio"
                                      name="accountType"
                                      value="current"
                                      checked={formData.personalDetailPaymentInformation?.accountType === "current"}
                                      onChange={(e) => handlePaymentInfoChange('accountType', e.target.value)}
                                      className="w-4 h-4"
                                  />
                                  <span>Current</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                      type="radio"
                                      name="accountType"
                                      value="savings"
                                      checked={formData.personalDetailPaymentInformation?.accountType === "savings"}
                                      onChange={(e) => handlePaymentInfoChange('accountType', e.target.value)}
                                      className="w-4 h-4"
                                  />
                                  <span>Savings</span>
                                </label>
                            </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
  
            {(checkPermission(user, "Basic And Personal Details", "Create") || checkPermission(user, "Basic And Personal Details", "Edit")) && (
              <>
                {/* ==================== SYSTEM FIELDS SECTION ==================== */}
                <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">System Fields</h3>
                  </div>
  
                  <div className="w-full flex items-start justify-start p-6 bg-white">
                    <div className="w-1/2">
                      <table>
                        <tr className="h-14">
                          <td>Added By</td>
                          <td className="ps-10">TD E1 - mubeen -</td>
                        </tr>
                        <tr className="h-14">
                          <td>Added Time</td>
                          <td className="ps-10">10-Jul-2025 12:56 Pm</td>
                        </tr>
                        <tr className="h-14">
                          <td>Onboarding Status</td>
                          <td className="ps-10">On Progress</td>
                        </tr>
                      </table>
                    </div>
                    <div className="w-1/2">
                    <table>
                        <tr className="h-14">
                          <td>Modified By</td>
                          <td className="ps-10">TD E1 - mubeen</td>
                        </tr>
                        <tr className="h-14">
                          <td>Modified Time</td>
                          <td className="ps-10">15-Jul-2025 11:37 Am</td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
  
                {/* ==================== WORK EXPERIENCE SECTION ==================== */}
                <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                    <button 
                      onClick={addWorkExperience}
                      className="px-4 py-2 bg-[#EAF3FF] text-[#1F87FF] text-base font-medium rounded-md"
                    >
                      Add Row
                    </button>
                  </div>
                  
                  <div className="bg-white p-5">
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-[#F5FAFF] border-gray-200">
                            <th className="text-left px-4 py-3 text-sm font-medium text-[#4A9EFF]">Company Name</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-[#4A9EFF] border-l">Job Title</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-[#4A9EFF] border-l">From Date</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-[#4A9EFF] border-l">To Date</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-[#4A9EFF] border-l">Job Description</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-[#4A9EFF] border-l">Relevant</th>
                            <th className="w-12 border-l"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.workExperiences.map((experience, index) => (
                            <tr key={index} className="border-b border-gray-200">
                              <td className="px-4 py-3">
                                <input 
                                  type="text" 
                                  value={experience.companyName}
                                  onChange={(e) => handleWorkExperienceChange(index, 'companyName', e.target.value)}
                                  className="w-full px-3 py-2 text-[#9CA3AF] bg-white border border-gray-300 focus:ring-1 focus:ring-[#4A9EFF] border-l focus:border-blue-500 outline-none text-sm rounded-md" 
                                />
                              </td>
                              <td className="px-4 py-3 border-l">
                                <input 
                                  type="text" 
                                  value={experience.jobTitle}
                                  onChange={(e) => handleWorkExperienceChange(index, 'jobTitle', e.target.value)}
                                  className="w-full px-3 py-2 text-[#9CA3AF] bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm rounded-md" 
                                />
                              </td>
                              <td className="px-4 py-3 border-l">
                                <input 
                                  type="date" 
                                  value={experience.fromDate}
                                  onChange={(e) => handleWorkExperienceChange(index, 'fromDate', e.target.value)}
                                  placeholder="dd-MM-yyyy"
                                  className="w-full px-3 py-2 text-[#9CA3AF] bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm rounded-md" 
                                />
                              </td>
                              <td className="px-4 py-3 border-l">
                                <input 
                                  type="date" 
                                  value={experience.toDate}
                                  onChange={(e) => handleWorkExperienceChange(index, 'toDate', e.target.value)}
                                  placeholder="dd-MM-yyyy"
                                  className="w-full px-3 py-2 text-[#9CA3AF] bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm rounded-md" 
                                />
                              </td>
                              <td className="px-4 py-3 border-l">
                                <div className="relative">
                                  <textarea 
                                    value={experience.jobDescription}
                                    onChange={(e) => handleWorkExperienceChange(index, 'jobDescription', e.target.value)}
                                    rows="2"
                                    maxLength={1000}
                                    className="w-full px-3 py-2 text-[#9CA3AF] bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm rounded-md resize-none" 
                                  />
                                  <div className="text-right text-[10px] -mt-1 text-gray-400">
                                    {experience.jobDescription?.length || 0}/1000
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 w-28 py-3 border-l">
                                <select 
                                  value={experience.relevant}
                                  onChange={(e) => handleWorkExperienceChange(index, 'relevant', e.target.value)}
                                  className="w-full px-1 py-2 text-[#9CA3AF] bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm rounded-md" 
                                >
                                  <option value="Select">Select</option>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </td>
                              <td className="px-4 py-3 border-l text-center">
                                <button
                                  onClick={() => removeWorkExperience(index)}
                                  className="w-8 h-8 bg-transparent text-gray-400 rounded flex items-center justify-center mx-auto"
                                >
                                <TrashIcon className="text-2xl hover:text-red-td-400" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
  
                {/* ==================== EDUCATION DETAILS SECTION ==================== */}
                <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Education Details</h3>
                    <button 
                      onClick={addEducationDetail}
                      className="px-4 py-2 bg-[#EAF3FF] text-[#1F87FF] text-base font-medium rounded-md"
                    >
                      Add Row
                    </button>
                  </div>
                  
                  <div className="bg-white p-5">
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-[#F5FAFF] border-gray-200">
                            <th className="text-left px-4 py-3 text-sm font-medium text-[#4A9EFF]">Institute Name</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-[#4A9EFF] border-l">Degree/Diploma</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-[#4A9EFF] border-l">Specialization</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-[#4A9EFF] border-l">Date of Completion</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-[#4A9EFF] border-l">Score</th>
                            <th className="w-12 border-l"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.educationDetails.map((education, index) => (
                            <tr key={index} className="border-b border-gray-200">
                              <td className="px-4 py-3">
                                <input 
                                  type="text" 
                                  value={education.instituteName}
                                  onChange={(e) => handleEducationChange(index, 'instituteName', e.target.value)}
                                  className="w-full px-3 py-2 text-[#9CA3AF] bg-white border border-gray-300 focus:ring-1 focus:ring-[#4A9EFF] focus:border-blue-500 outline-none text-sm rounded-md" 
                                />
                              </td>
                              <td className="px-4 py-3 border-l">
                                <input 
                                  type="text" 
                                  value={education.degreeDiploma}
                                  onChange={(e) => handleEducationChange(index, 'degreeDiploma', e.target.value)}
                                  className="w-full px-3 py-2 text-[#9CA3AF] bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm rounded-md" 
                                />
                              </td>
                              <td className="px-4 py-3 border-l">
                                <input 
                                  type="text" 
                                  value={education.specialization}
                                  onChange={(e) => handleEducationChange(index, 'specialization', e.target.value)}
                                  className="w-full px-3 py-2 text-[#9CA3AF] bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm rounded-md" 
                                />
                              </td>
                              <td className="px-4 py-3 border-l">
                                <input 
                                  type="date" 
                                  value={education.dateOfCompletion}
                                  onChange={(e) => handleEducationChange(index, 'dateOfCompletion', e.target.value)}
                                  className="w-full px-3 py-2 text-[#9CA3AF] bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm rounded-md" 
                                />
                              </td>
                              <td className="px-4 py-3 border-l">
                                <input 
                                  type="text" 
                                  value={education.score}
                                  onChange={(e) => handleEducationChange(index, 'score', e.target.value)}
                                  className="w-full px-3 py-2 text-[#9CA3AF] bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm rounded-md" 
                                />
                              </td>
                              <td className="px-4 py-3 border-l text-center">
                                <button
                                  onClick={() => removeEducationDetail(index)}
                                  className="w-8 h-8 bg-transparent text-gray-400 rounded flex items-center justify-center mx-auto"
                                >
                                  <TrashIcon className="text-2xl hover:text-red-400" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>           
              </>
            )}
          </div>
        </div>
      )}    
    </>
  );
}

export default ExtendedPersonalForm;
