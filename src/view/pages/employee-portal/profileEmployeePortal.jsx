import React, { useState, useEffect } from 'react';
import { 
  MailboxIcon, 
  Phone, 
  User, 
  Calendar, 
  MapPin, 
  BuildingIcon,
} from '@phosphor-icons/react';
import employeeStoreManagements from '../../../store/tdPayroll/employee';

const ProfileEmployeePortal = ({}) => {
    const { fetchEmployeePersonalDetail, dataEmployeePersonalDetail } = employeeStoreManagements();
    const [isProfessionalTaxEnabled, setIsProfessionalTaxEnabled] = useState(true);

    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        fetchEmployeePersonalDetail(access_token, null, "employee-portal");
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        });
    };

    const ToggleSwitch = ({ enabled, onToggle }) => (
        <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
        >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
        </button>
    );

    const InfoRow = ({ icon: Icon, label, value }) => (
        <div className="flex items-center space-x-3 py-2">
        <Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
        <div className="flex-1">
            <span className="text-sm text-gray-600">{label}:</span>
            <span className="ml-2 text-sm font-medium">{value || "-"}</span>
        </div>
        </div>
    );

    return (
        <div className={`w-full h-screen flex flex-col items-start justify-start`}>
            <div className="w-full bg-gray-50 p-6">
                <div className="w-full mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Profile Card */}
                        <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border">
                            {/* Profile Header */}
                            <div className="p-6 text-center border-b">
                            <div className="h-24 w-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center text-gray-500">
                                <User className="h-12 w-12" />
                            </div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                {`${dataEmployeePersonalDetail?.Employee?.firstName || ''} ${dataEmployeePersonalDetail?.Employee?.middleName || ''} ${dataEmployeePersonalDetail?.Employee?.lastName || ''}`.trim()}
                            </h1>
                            <p className="text-gray-600">({dataEmployeePersonalDetail?.Employee?.employeeId})</p>
                            <p className="text-sm text-gray-500 mt-1">{dataEmployeePersonalDetail?.employmentType}</p>
                            </div>

                            {/* Basic Information */}
                            <div className="p-6 border-b">
                            <h3 className="text-sm font-medium text-gray-900 mb-4">Basic Information</h3>
                            <div className="space-y-1">
                                <InfoRow 
                                icon={MailboxIcon} 
                                label="Email" 
                                value={dataEmployeePersonalDetail?.Employee?.email}
                                />
                                <InfoRow 
                                icon={Phone} 
                                label="Work Phone" 
                                value={dataEmployeePersonalDetail?.Employee?.phoneNumber}
                                />
                                <InfoRow 
                                icon={User} 
                                label="Gender" 
                                value={dataEmployeePersonalDetail?.Employee?.gender}
                                />
                                <InfoRow 
                                icon={Calendar} 
                                label="Date of Joining" 
                                value={dataEmployeePersonalDetail?.Employee?.joinDate ? formatDate(dataEmployeePersonalDetail?.Employee.joinDate) : '-'}
                                />
                                <InfoRow 
                                icon={BuildingIcon} 
                                label="Employment Type" 
                                value={dataEmployeePersonalDetail?.EmploymentType?.name}
                                />
                                <InfoRow 
                                icon={MapPin} 
                                label="Status" 
                                value={dataEmployeePersonalDetail?.employeeStatus}
                                />
                            </div>
                            </div>

                            {/* Settings */}
                            <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium">Professional Tax</span>
                                <ToggleSwitch 
                                enabled={isProfessionalTaxEnabled}
                                onToggle={() => setIsProfessionalTaxEnabled(!isProfessionalTaxEnabled)}
                                />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Portal Access</span>
                                <span className="text-gray-500">
                                {dataEmployeePersonalDetail?.Employee?.isEnablePortalAccess ? 'Enabled' : 'Disabled (Enable)'}
                                </span>
                            </div>
                            </div>
                        </div>
                        </div>

                        {/* Right Column - Information Cards */}
                        <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">Date of Birth</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.dateOfBirth ? formatDate(dataEmployeePersonalDetail?.dateOfBirth) : "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Age</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.age ? `${dataEmployeePersonalDetail?.age} years` : "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Marital Status</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.maritalStatus || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Blood Group</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.bloodGroup || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Citizenship Category</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.Employee?.citizenCategory || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Residential Status</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.residentialStatus || "-"}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-600">Personal Email</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.personalEmail || "-"}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-600">Personal Mobile</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.personalMobile || "-"}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-600">Present Address</label>
                                <p className="font-medium">
                                {[
                                    dataEmployeePersonalDetail?.presentAddressLine1,
                                    dataEmployeePersonalDetail?.presentAddressLine2,
                                    dataEmployeePersonalDetail?.presentDistrict,
                                    dataEmployeePersonalDetail?.presentCountry,
                                    dataEmployeePersonalDetail?.presentPostcode ? `- ${dataEmployeePersonalDetail?.presentPostcode}` : null
                                ].filter(Boolean).join(', ') || "-"}
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-600">Permanent Address</label>
                                <p className="font-medium">
                                {[
                                    dataEmployeePersonalDetail?.permanentAddressLine1,
                                    dataEmployeePersonalDetail?.permanentAddressLine2,
                                    dataEmployeePersonalDetail?.permanentDistrict,
                                    dataEmployeePersonalDetail?.permanentCountry,
                                    dataEmployeePersonalDetail?.permanentPostcode ? `- ${dataEmployeePersonalDetail?.permanentPostcode}` : null
                                ].filter(Boolean).join(', ') || "-"}
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-600">About Me</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.aboutMe || "-"}</p>
                            </div>
                            </div>
                        </div>

                        {/* Work Permit & Documentation */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Work Permit & Documentation</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">IC Type</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.Employee?.icType || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">SPK Account Number</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.Employee?.spkAccountNumber || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Work Permit Details</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.workPermitPassDetails || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Work Permit Expiry</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.workPermitExpiry ? formatDate(dataEmployeePersonalDetail?.workPermitExpiry) : "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">TAP No</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.tapNo || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">SCP No</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.scpNo || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">SPK No</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.spkNo || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">SPK Status</label>
                                <p className="font-medium">
                                {dataEmployeePersonalDetail?.spk ? (
                                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Active</span>
                                ) : (
                                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">Inactive</span>
                                )}
                                </p>
                            </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">Name</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.emergencyContactName || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Relationship</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.emergencyContactRelationship || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Mobile</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.emergencyContactMobile || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Address</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.emergencyContactAddress || "-"}</p>
                            </div>
                            </div>
                        </div>

                        {/* Work Experience */}
                        {dataEmployeePersonalDetail?.WorkExperiences && dataEmployeePersonalDetail?.WorkExperiences.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h2>
                            <div className="space-y-4">
                                {dataEmployeePersonalDetail?.WorkExperiences.map((exp, index) => (
                                <div key={exp.uuid || index} className="border-l-4 border-blue-200 pl-4 py-2">
                                    <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">{exp.jobTitle || "-"}</h3>
                                    {exp.isRelevant && (
                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                        Relevant
                                        </span>
                                    )}
                                    </div>
                                    <p className="text-gray-600 text-sm">{exp.companyName || "-"}</p>
                                    <p className="text-gray-500 text-xs">
                                    {exp.fromDate && exp.toDate ? `${formatDate(exp.fromDate)} - ${formatDate(exp.toDate)}` : "-"}
                                    </p>
                                    <p className="text-sm mt-1">{exp.jobDescription || "-"}</p>
                                </div>
                                ))}
                            </div>
                            </div>
                        )}

                        {/* Education */}
                        {dataEmployeePersonalDetail?.EducationDetails && dataEmployeePersonalDetail?.EducationDetails.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Education</h2>
                            <div className="space-y-4">
                                {dataEmployeePersonalDetail?.EducationDetails.map((edu, index) => (
                                <div key={edu.uuid || index} className="border-l-4 border-purple-200 pl-4 py-2">
                                    <h3 className="font-semibold">{edu.degreeDiploma || "-"}</h3>
                                    <p className="text-gray-600 text-sm">{edu.instituteName || "-"}</p>
                                    <p className="text-gray-500 text-xs">
                                    Specialization: {edu.specialization || "-"}
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                    Completed: {edu.dateOfCompletion ? formatDate(edu.dateOfCompletion) : "-"}
                                    </p>
                                </div>
                                ))}
                            </div>
                            </div>
                        )}

                        {/* Employment Details */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">Probation End Date</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.probationEndDate ? formatDate(dataEmployeePersonalDetail?.probationEndDate) : "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Date of Exit</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.dateOfExit ? formatDate(dataEmployeePersonalDetail?.dateOfExit) : "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">System Role</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.systemRole || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Portal Access</label>
                                <p className="font-medium">
                                {dataEmployeePersonalDetail?.Employee?.isEnablePortalAccess ? (
                                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Enabled</span>
                                ) : (
                                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Disabled</span>
                                )}
                                </p>
                            </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">Account Holder</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.bankAccountHolder || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Bank Name</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.bankName || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Branch</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.bankBranch || "-"}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Account Number</label>
                                <p className="font-medium">{dataEmployeePersonalDetail?.accountNumber || "-"}</p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileEmployeePortal;