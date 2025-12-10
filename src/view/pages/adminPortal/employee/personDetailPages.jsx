import React, { useState, useEffect } from 'react';
import { 
  MailboxIcon, 
  Phone, 
  User, 
  Calendar, 
  MapPin, 
  BuildingIcon,
  Users,
  GraduationCap,
  Briefcase,
  CreditCard,
  Pencil,
  GenderMale,
  EnvelopeSimple,
  PencilLine,
} from '@phosphor-icons/react';
import PersonalDetails from '../../../component/formAddEmployees/personalDetails';
import { useParams } from 'react-router-dom';
import employeeStoreManagements from '../../../../store/tdPayroll/employee';
import { toast } from "react-toastify";
import { CustomToast } from '../../../component/customToast';
import ToggleAction from '../../../component/toggle';
import authStoreManagements from '../../../../store/tdPayroll/auth';
import { checkPermission } from '../../../../../helper/globalHelper';

const PersonDetailPages = ({ isEmployeePortal = false }) => {
  const { updateEmployee, fetchEmployeePersonalDetail, loading, dataEmployeePersonalDetail, dataEmployeePaymentInformation } = employeeStoreManagements();
  const [editingSection, setEditingSection] = useState(null);
  const { user } = authStoreManagements();
  const [paymentInformation, setPaymentInformation] = useState(null);
  const { id } = useParams();
  
  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");
    if (isEmployeePortal) {
      fetchEmployeePersonalDetail(access_token, null, "employee-portal");
    } else {
      fetchEmployeePersonalDetail(access_token, id);
    }
  }, [id, isEmployeePortal]);

  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");
    if (isEmployeePortal) {
      // Payment information might be included in personal detail for employee portal
      // Or fetch separately if needed
    } else {
      fetchEmployeePersonalDetail(access_token, id, "payment-information");
    }
  }, [id, isEmployeePortal]);

  // Extract employeeData from response
  const employeeData = dataEmployeePersonalDetail?.employeeData || dataEmployeePersonalDetail?.Employee || {};

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const cancelForm = () => {
    setEditingSection(null);
  }

  const handleEditClick = (section) => {
    setEditingSection(section);
  }

  const handleUpdatePortalAccess = async (uuid, toggleStatus) => {
    const payload = {
      isEnablePortalAccess: toggleStatus,
    } 
    const access_token = localStorage.getItem("accessToken");
    const response = await updateEmployee(payload, access_token, uuid);
    if(response){
      await fetchEmployeePersonalDetail(access_token, uuid)
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
      setEditingSection(null);
    }
  };

  const SectionCard = ({ title, editIcon, children, sectionName, isPayment }) => {
    // Helper function to check if user has permission
    const hasPermission = () => {
      // Employee portal: allow edit for own profile (no permission check needed)
      if (isEmployeePortal) {
        return true;
      }
      
      const basicPermission = checkPermission(user, "Basic And Personal Details", "Create") || checkPermission(user, "Basic And Personal Details", "Edit");
      const paymentPermission = checkPermission(user, "Payment Information", "Create") || checkPermission(user, "Payment Information", "Edit");
      
      // Kalau isPayment true, check Payment Information permission, kalau gak ada isPayment check Basic And Personal Details
      return isPayment ? paymentPermission : basicPermission;
    };

    return (
      <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {hasPermission() && (
              editIcon && (
                <button 
                  onClick={() => {
                    handleEditClick(sectionName)
                    if(isPayment){
                      setPaymentInformation(isPayment);
                    }else{
                      setPaymentInformation(false);
                    }
                  }}
                  className="text-[#6B7280]"
                >
                  <PencilLine size={23} />
                </button>
              )
            )}
          </div>
        {children}
      </div>
    );
  };

  const InfoField = ({ label, value }) => (
    <div className="w-full flex items-center justify-start text-sm">
      <div className="w-1/2 font-medium text-[#111827]">{label}</div>
      <div className="w-1/2 font-normal text-[#374151]">{value || "-"}</div>
    </div>
  );

  // If any section is being edited, show the form
  if (editingSection) {
    return (
      <div className="w-full bg-[#EAEAEA] p-5">
        <PersonalDetails cancel={cancelForm} uuid={isEmployeePortal ? null : id} isPaymentInformation={paymentInformation} />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#EAEAEA] p-8">
        <div className={`w-full mx-auto space-y-6 ${isEmployeePortal ? 'pt-[23%]' : ''}`}>
          {dataEmployeePersonalDetail && (
            <>
              {/* Basic Information Card */}
              <SectionCard title="Basic information" editIcon sectionName="Basic Information">
                <div className="flex items-start space-x-12">
                  {/* Avatar and Name */}
                  <div className="flex-shrink-0">
                    <div className="h-32 w-32 rounded-3xl bg-[#EAF3FF] flex items-center justify-center">
                      <span className="text-[60px] font-semibold text-blue-500">
                        {(employeeData?.firstName || dataEmployeePersonalDetail?.Employee?.firstName || '')?.charAt(0)?.toUpperCase() || ''}
                      </span>
                    </div>
                  </div>
                  
                  {/* Employee Info */}
                  <div className="w-[60%] grid grid-cols-2 gap-x-6">
                    <div className='justify- border-gray-[#D1D5DB]'>
                      <div className="max-w-[480px] w-full">
                        <h3 className="text-xl font-medium text-[#0F172A] break-words">
                          {`${employeeData?.firstName || dataEmployeePersonalDetail?.Employee?.firstName || ''} ${employeeData?.middleName || dataEmployeePersonalDetail?.Employee?.middleName || ''} ${employeeData?.lastName || dataEmployeePersonalDetail?.Employee?.lastName || ''}`.trim()}
                        </h3>
                        <p className="text-sm text-gray-400 font-normal">
                          Employee ID : {employeeData?.employeeId || dataEmployeePersonalDetail?.Employee?.employeeId || ''}
                        </p>
                      </div>
                      <div className="mt-3 space-y-2 text-[#6B7280]">
                        <div className="flex items-center space-x-2 text-xs">
                          <GenderMale className="h-4 w-4 text-gray-400" />
                          <span className="">{employeeData?.gender || dataEmployeePersonalDetail?.Employee?.gender || ''}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          <EnvelopeSimple className="h-4 w-4 text-gray-400" />
                          <span className="">{employeeData?.email || dataEmployeePersonalDetail?.Employee?.email || ''}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="">{employeeData?.phoneNumber || dataEmployeePersonalDetail?.Employee?.phoneNumber || ''}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-s-2 space-y-2 ps-20">
                      <InfoField 
                        label="Place of birth" 
                        value={dataEmployeePersonalDetail?.placeOfBirth || ''} 
                      />
                      <InfoField 
                        label="Date of birth" 
                        value={dataEmployeePersonalDetail?.dateOfBirth ? new Date(dataEmployeePersonalDetail?.dateOfBirth).toLocaleDateString('en-GB') : ''} 
                      />
                      <InfoField 
                        label="Age" 
                        value={dataEmployeePersonalDetail?.age ? `${dataEmployeePersonalDetail?.age}` : ''} 
                      />
                      <InfoField 
                        label="Blood group" 
                        value={dataEmployeePersonalDetail?.bloodGroup || ''} 
                      />
                      <InfoField 
                        label="Employee status" 
                        value={
                          <span className="text-sm font-normal text-[#0FA38B]">
                            {employeeData?.status || dataEmployeePersonalDetail?.Employee?.status || dataEmployeePersonalDetail?.employeeStatus || ''}
                          </span>
                        } 
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Address and Emergency Contact Row */}
              <div className="grid grid-cols-2 gap-6">
                {/* Address Card */}
                <SectionCard title="Address" editIcon sectionName="Address">
                  <div className="space-y-4">
                    <InfoField 
                      label="Permanent address" 
                      value={
                        [
                          dataEmployeePersonalDetail?.permanentAddressLine1,
                          dataEmployeePersonalDetail?.permanentAddressLine2,
                          dataEmployeePersonalDetail?.permanentDistrict,
                          dataEmployeePersonalDetail?.permanentCountry,
                          dataEmployeePersonalDetail?.permanentPostcode ? `${dataEmployeePersonalDetail?.permanentPostcode}` : null
                        ].filter(Boolean).join(', ') || ''
                      } 
                    />
                    <InfoField 
                      label="Residential address" 
                      value={
                        [
                          dataEmployeePersonalDetail?.presentAddressLine1,
                          dataEmployeePersonalDetail?.presentAddressLine2,
                          dataEmployeePersonalDetail?.presentDistrict,
                          dataEmployeePersonalDetail?.presentCountry,
                          dataEmployeePersonalDetail?.presentPostcode ? `${dataEmployeePersonalDetail?.presentPostcode}` : null
                        ].filter(Boolean).join(', ') || ''
                      } 
                    />
                  </div>
                </SectionCard>

                {/* Emergency Contact Card */}
                <SectionCard title="Emergency contact" editIcon sectionName="Emergency Contact">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <InfoField 
                        label="Name" 
                        value={dataEmployeePersonalDetail?.emergencyContactName || ''} 
                      />
                      <InfoField 
                        label="Relationship" 
                        value={dataEmployeePersonalDetail?.emergencyContactRelationship || ''} 
                      />
                    </div>
                    <InfoField 
                      label="Phone Number" 
                      value={dataEmployeePersonalDetail?.emergencyContactMobile || ''} 
                    />
                  </div>
                </SectionCard>
              </div>

              {/* Work Location and Tax Details Row */}
              <div className="grid grid-cols-2 gap-6">
                {/* Work Location Card */}
                <SectionCard title="Work Location" editIcon sectionName="Work Location">
                  <div className="space-y-4">
                    {dataEmployeePersonalDetail?.WorkExperiences && dataEmployeePersonalDetail?.WorkExperiences.length > 0 ? (
                      dataEmployeePersonalDetail?.WorkExperiences.map((exp, index) => (
                        <div key={exp.uuid || index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#D1D5DB] mt-3 relative">
                            {index != dataEmployeePersonalDetail?.WorkExperiences.length - 1 && (
                              <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-0.5 h-[90px] bg-[#D1D5DB]"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium capitalize text-gray-900 text-lg">{exp.jobTitle || ''}</h4>
                            <p className="text-sm text-[#374151]">{exp.companyName || ''}</p>
                            <p className="text-sm text-[#6B7280]">
                              {exp.fromDate && exp.toDate 
                                ? `${new Date(exp.fromDate).getFullYear()} - ${new Date(exp.toDate).getFullYear()}` 
                                : ''}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-[#6B7280]">No work experience data available</div>
                    )}
                  </div>
                </SectionCard>

                {/* Tax Details Card */}
                <SectionCard title="Tax Details" editIcon sectionName="Tax Details">
                  <div className="border rounded-lg overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b">
                      <div className="w-1/2 px-4 py-3 text-sm font-medium text-left text-[#111827] bg-[#F5FAFF]">
                        Contribution Details
                      </div>
                      <div className="w-1/2 py-3 text-sm font-medium text-left text-[#111827] bg-[#F5FAFF]">
                        Employee Details
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="w-full border-b px-4 py-2">
                          <InfoField 
                            label={
                              <span className="text-sm font-normal text-[#374151]">Name</span>
                            } 
                            value={`${employeeData?.firstName || dataEmployeePersonalDetail?.Employee?.firstName || ''}`} 
                          />
                        </div>
                        <div className="w-full border-b px-4 py-2">
                          <InfoField 
                            label={
                              <span className="text-sm font-normal text-[#374151]">SPK Number</span>
                            } 
                            value={dataEmployeePersonalDetail?.spkNo || employeeData?.spkAccountNumber || ''} 
                          />
                        </div>
                        <div className="w-full border-b px-4 py-2">
                          <InfoField 
                            label={
                              <span className="text-sm font-normal text-[#374151]">SPK Status</span>
                            } 
                            value={
                              <span className="text-sm font-normal text-[#0FA38B]">
                                {dataEmployeePersonalDetail?.spk || employeeData?.isStatutoryComponents ? 'Enable' : 'Disable'}
                              </span>
                            } 
                          />
                        </div>
                        <div className="w-full border-b px-4 py-2">
                          <InfoField 
                            label={
                              <span className="text-sm font-normal text-[#374151]">Citizenship</span>
                            } 
                            value={employeeData?.citizenCategory || ''} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </div>

              {/* Education and Payment Information Row */}
              <div className="grid grid-cols-2 gap-6">
                {/* Education Card */}
                <SectionCard title="Education" editIcon sectionName="Education">
                  <div className="space-y-4">
                    {dataEmployeePersonalDetail?.EducationDetails && dataEmployeePersonalDetail?.EducationDetails.length > 0 ? (
                      dataEmployeePersonalDetail?.EducationDetails.map((edu, index) => (
                        <div key={edu.uuid || index} className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#D1D5DB] relative">
                              {index != dataEmployeePersonalDetail?.EducationDetails.length - 1 && (
                                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-0.5 h-[120px] bg-[#D1D5DB]"></div>
                              )}
                            </div>
                            <h4 className="font-medium capitalize text-gray-900 text-lg">{edu.degreeDiploma || ''}</h4>
                          </div>
                          <p className="text-sm text-[#374151] ml-4">{edu.specialization || ''}</p>
                          <p className="text-sm text-[#374151] ml-4">Score ({edu.grade || ''})</p>
                          <p className="text-sm text-[#6B7280] ml-4">
                            {edu.dateOfCompletion 
                              ? `${new Date(edu.dateOfCompletion).getFullYear()}` 
                              : ''}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-[#6B7280]">No education data available</div>
                    )}
                  </div>
                </SectionCard>

                {/* Payment Information Card */}
                <SectionCard title="Payment Information" editIcon sectionName="Employee Bank Details" isPayment={true}>
                  <div className="space-y-4">
                    <InfoField 
                      label="Payment Method" 
                      value={dataEmployeePaymentInformation?.paymentMethod || '-'} 
                    />
                    
                    {dataEmployeePaymentInformation?.paymentMethod === "Bank Transfer" && (
                      <>
                        <InfoField 
                          label="Bank Name" 
                          value={dataEmployeePaymentInformation?.bankName || '-'} 
                        />
                        <InfoField 
                          label="Account Number" 
                          value={dataEmployeePaymentInformation?.accountNumber || '-'} 
                        />
                        <InfoField 
                          label="Account Holder Name" 
                          value={dataEmployeePaymentInformation?.accountHolderName || '-'} 
                        />
                      </>
                    )}
                    
                    {!dataEmployeePaymentInformation && (
                      <div className="text-sm text-orange-600">
                        Payment information not set up yet
                      </div>
                    )}
                  </div>
                </SectionCard>
              </div>
            </>
          )}
          
          {dataEmployeePaymentInformation && (
            <>
              {/* Employee Bank Details Card */}
              <SectionCard title="Employee Bank Details" editIcon sectionName="Employee Bank Details" isPayment={true} >  
                  {/* Content */}
                  {dataEmployeePaymentInformation?.paymentMethod === "Bank Transfer" ? (
                    <div className="border rounded-lg overflow-hidden">
                      {/* Tabs */}
                      <div className="flex border-b">
                        <div className="w-1/2 px-4 py-3 text-sm font-medium text-left text-[#111827] bg-[#F5FAFF]">
                          Bank Details
                        </div>
                        <div className="w-1/2 py-3 text-sm font-medium text-left text-[#111827] bg-[#F5FAFF]">
                          Employee Bank Details
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-2">
                            <div className="w-full border-b px-4 py-2">
                            <InfoField 
                              label={
                                <span className="text-sm font-normal text-[#374151]">Bank Name</span>
                              } 
                              value={dataEmployeePaymentInformation?.bankName || ''} 
                            />
                          </div>
                          <div className="w-full border-b px-4 py-2">
                            <InfoField 
                              label={
                                <span className="text-sm font-normal text-[#374151]">Bank Account Number</span>
                              } 
                              value={dataEmployeePaymentInformation?.accountNumber || ''} 
                            />
                          </div>
                          <div className="w-full border-b px-4 py-2">
                            <InfoField 
                              label={
                                <span className="text-sm font-normal text-[#374151]">Bank Account Holder Name</span>
                              } 
                              value={dataEmployeePaymentInformation?.accountHolderName || ''} 
                            />
                          </div>
                        </div>
                      </div>
                  </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-2">
                          <div className="w-full border-b px-4 py-2">
                            Payment Method: {dataEmployeePaymentInformation?.paymentMethod}
                        </div>
                      </div>
                    </div>
                  )}
              </SectionCard>
            </>
          )}
        </div>
    </div>
  );
};

export default PersonDetailPages;
