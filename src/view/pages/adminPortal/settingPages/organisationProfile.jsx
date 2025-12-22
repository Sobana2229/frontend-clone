import { useEffect, useState } from "react";
import { dummyLoops, OrganisationDateFormat, tabOrganisationProfiles } from "../../../../../data/dummy";
import HeaderReusable from "../../../component/setting/headerReusable";
import { ArrowRight, CaretDownIcon, EnvelopeSimple, Info, NotePencilIcon, Star, UploadSimple, User, WifiHighIcon } from "@phosphor-icons/react";
import CardSetting from "../../../component/setting/cardSetting";
import { useLocation } from "react-router-dom";
import { checkPermission, formatNicknameFromEmail } from "../../../../../helper/globalHelper";
import { toast } from "react-toastify";
import organizationStoreManagements from "../../../../store/tdPayroll/setting/organization";
const baseUrl = import.meta.env.VITE_BASEURL;
import dayjs from "dayjs";
import configurationStoreManagements from "../../../../store/tdPayroll/configuration";
import authStoreManagements from "../../../../store/tdPayroll/auth";
import LoadingIcon from "../../../component/loadingIcon";
import taxStoreManagements from "../../../../store/tdPayroll/setting/tax";
import CustomOption from "../../../component/customOption";
import Modal from "react-modal";
import Select from "react-select";
import FormModal from "../../../component/formModal";
import ReuseableInput from "../../../component/reuseableInput";

function OrganisationProfile({handleShowForm}) {
    const { loading, fetchoOganizationDetail, organizationDetail, updateOganizationDetail, createOrganizationSetting, natureOfBusinessOptions, fetchOrganizationSetting, bankNameOptions, designationOptions } = organizationStoreManagements();
    const { fetchTax, taxCompanyData } = taxStoreManagements();
    const { user } = authStoreManagements();
    const { 
        fetchStateData,
        stateData,
        fetchCityData,
        fetchIndustryData,
        industry,
        city,
        phoneNumberData, 
        fetchPhoneNumberData
    } = configurationStoreManagements();
    const {pathname} = useLocation();
    const [formData, setFormData] = useState({
        name: "",
        businessLocation: "",
        industry: "",
        dateFormat: "",
        fieldSeparator: "",
        addressLine1: "",
        addressLine2: "",
        state: "",
        city: "",
        pincode: "",
        logo: null,
        contactMailId: "",
        bankAccountName: "",
        bankAccountNumber: "",
        website: "",
        foreignWorkers: 0,
        localWorkers: 0,
        companyEmail: "",
        companyPhone: "",
        phoneCode: '',
        flagIso: "",
        workLocationName: "",
        addressDetail: "",
        branchName: "",
        accountType: "",
        currency: "",
        phoneCodeContactPerson: "",
        designationUuid: "",
        workEmailContactPerson: "",
        firstName: "",
        lastName: "",
        phoneContactPerson: "",
    });
    const [logoPreview, setLogoPreview] = useState(null);
    const [existingLogo, setExistingLogo] = useState(null);
    const [modalFillingAddress, setModalFillingAddress] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        if (phoneNumberData?.length === 0) {
            fetchPhoneNumberData();
        }
    }, [phoneNumberData.length, fetchPhoneNumberData]);

    useEffect(() => {
        if(designationOptions?.length === 0) {
            const access_token = localStorage.getItem("accessToken");
            fetchOrganizationSetting("designation", access_token);
        }
    }, []);

    useEffect(() => {
        if(taxCompanyData){
            setFormData(prev => ({
                ...prev,
                rocNumber: taxCompanyData.rocNumber || '',
                incorporationDate: taxCompanyData.incorporationDate
                    ? new Date(taxCompanyData.incorporationDate).toISOString().split('T')[0] 
                    : '',
                scpAccountNo: taxCompanyData.scpAccountNo || '',
                tapAccountNo: taxCompanyData.tapAccountNo || '',
            }))
        }else{
            const access_token = localStorage.getItem("accessToken");
            fetchTax(access_token, "company");
        }
    }, [taxCompanyData]);

    useEffect(() => {
        if(natureOfBusinessOptions?.length === 0){
            const access_token = localStorage.getItem("accessToken");
            fetchOrganizationSetting("nature-of-business", access_token);
        }
    }, [natureOfBusinessOptions]);

    useEffect(() => {
        if(bankNameOptions?.length === 0){
            const access_token = localStorage.getItem("accessToken");
            fetchOrganizationSetting("bank-name", access_token);
        }
    }, [bankNameOptions]);

    useEffect(() => {
        if (!organizationDetail) {
            const token = localStorage.getItem("accessToken");
            fetchoOganizationDetail(token);
        }
    }, [pathname, organizationDetail, fetchoOganizationDetail]);

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
        if (organizationDetail) {
            const currentSeparator = formData.fieldSeparator || "-";
            
            setFormData(prev => ({
                ...prev,
                name: organizationDetail?.name || "",
                businessLocation: organizationDetail?.Country?.name || "",
                industry: organizationDetail?.Industry?.uuid,
                dateFormat: organizationDetail?.dateFormat,
                fieldSeparator: currentSeparator,
                addressLine1: organizationDetail.addressLine1 || "",
                addressLine2: organizationDetail.addressLine2 || "",
                state: organizationDetail.State?.id || "",
                city: organizationDetail.City?.id || "",
                pincode: organizationDetail.postalCode || "",
                contactMailId: organizationDetail?.user?.email || "",
                bankNameUuid: organizationDetail?.bankNameUuid || "",
                natureOfBusinessesUuid: organizationDetail?.natureOfBusinessesUuid || "",
                bankAccountName: organizationDetail?.bankAccountName || "",
                bankAccountNumber: organizationDetail?.bankAccountNumber || "",
                website: organizationDetail?.website || "",
                foreignWorkers: organizationDetail?.foreignWorkers || 0,
                localWorkers: organizationDetail?.localWorkers || 0,
                companyEmail: organizationDetail?.companyEmail || "",
                companyPhone: organizationDetail?.companyPhone || "",
                phoneCode: organizationDetail?.phoneCode || "+673",
                flagIso: organizationDetail?.flagIso || "🇧🇳",
                workLocationName: organizationDetail?.workLocationName || "",
                addressDetail: organizationDetail?.addressDetail || "",
                branchName: organizationDetail?.branchName || "",
                accountType: organizationDetail?.accountType || "",
                currency: organizationDetail?.currency || "",
                phoneCodeContactPerson: organizationDetail?.phoneCodeContactPerson || "+673",
                designationUuid: organizationDetail?.designationUuid || "",
                workEmailContactPerson: organizationDetail?.workEmailContactPerson || "",
                firstName: organizationDetail?.firstName || "",
                lastName: organizationDetail?.lastName || "",
                phoneContactPerson: organizationDetail?.phoneContactPerson || "",
            }));

            if (organizationDetail.State?.id && (!city || city.length === 0)) {
                fetchCityData(organizationDetail.State.id);
            }
        }
    }, [organizationDetail]);

    useEffect(() => {
        if (organizationDetail) {
            setExistingLogo(organizationDetail?.profileImagePath || null);
        }
    }, [organizationDetail]);

    useEffect(() => {
        if (industry?.length === 0) {
            const token = localStorage.getItem("accessToken");
            fetchIndustryData(token);
        }
    }, [pathname, industry]);
    return (
        <div className="w-full h-full flex flex-col items-start justify-start">
            {checkPermission(user, "Organization Profile", "Full Access") ? (
                <div className="w-full h-fit grid grid-cols-[2fr_1fr] grid-rows-[min-content] gap-5">
                    {/* Organisation Logo */}
                    <div className="flex-1 bg-white p-5 rounded-md relative">
                        <button onClick={() => handleShowForm("organisation form")} className="absolute top-3 right-3">
                            <NotePencilIcon className="text-3xl" />
                        </button>
                        {/* Organisation Logo */}
                        <div className="flex flex-col space-y-3">
                            <label className="block text-lg font-medium">Organisation Logo</label>
                            <div className="flex items-start">
                                <div className="rounded w-fit h-fit max-h-24 max-w-56 flex items-start justify-start relative">
                                    {logoPreview || existingLogo && (
                                        <div className="relative w-fit h-fit max-h-24 max-w-56">
                                            <img 
                                                src={logoPreview || `${baseUrl}${existingLogo}`}
                                                alt="Logo Preview" 
                                                className="w-fit h-fit max-h-24 max-w-56 object-contain"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="w-[85%] h-fit space-y-5 mt-5">
                            {/* Organisation Name */}
                            <ReuseableInput
                                label="Organisation Name"
                                id="name"
                                name="name"
                                placeholder="Organisation Name..."
                                value={formData.name}
                                required
                                isDisabled={true}
                            />
                            <div className="w-full flex items-start justify-start space-x-5">
                                {/* ROC Number */}
                                <ReuseableInput
                                    label="Nature Of Business"
                                    id="natureOfBusinessesUuid"
                                    name="natureOfBusinessesUuid"
                                    placeholder="Select Nature Of Business..."
                                    value={
                                        natureOfBusinessOptions?.find(
                                        (option) => option.value === formData.natureOfBusinessesUuid
                                        )?.label || ""
                                    }
                                    required
                                    isDisabled={true}
                                />

                                {/* Industry */}
                                <ReuseableInput
                                    label="Industry"
                                    id="industry"
                                    name="industry"
                                    placeholder="Select The Industry..."
                                    value={
                                        industry?.find((option) => option.uuid === formData.industry)?.name || ""
                                    }
                                    required
                                    isDisabled={true}
                                />
                            </div>
                            <ReuseableInput
                                label="Date Format"
                                id="dateFormat"
                                name="dateFormat"
                                placeholder="Select The Date Format..."
                                value={formData.dateFormat}
                                required
                                isDisabled={true}
                            />
                        </div>
                    </div>

                    {/* Organisation Tax Details */}
                    <div className="bg-white border border-gray-td-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-end mb-10 relative">
                            <h1 className="absolute top-0 left-0 text-lg font-semibold text-gray-td-900">Organisation Tax Details</h1>
                            <div className="flex flex-col items-start justify-start space-y-2 py-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-blue-td-50 border-2 border-blue-td-600 flex items-center justify-center text-blue-td-600">
                                        <User />
                                    </div>
                                    <span className="text-sm text-gray-td-600">Local Employee</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-gray-td-50 border-2 border-gray-td-600 flex items-center justify-center text-gray-td-600">
                                        <User />
                                    </div>
                                    <span className="text-sm text-gray-td-600">Foreign Employee</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* SVG Semi-circular Progress Chart */}
                        <div className="relative flex justify-center py-2 mb-10">
                            <div className="relative">
                                <svg width="300" height="160" viewBox="0 0 300 160">
                                    <defs>
                                        <path
                                        id="arcPath"
                                        d="M 20 140 A 130 130 0 0 1 280 140"
                                        fill="none"
                                        />
                                    </defs>

                                    {(() => {
                                        const foreign = formData?.foreignWorkers || 0;
                                        const local = formData?.localWorkers || 0;
                                        const total = foreign + local;
                                        const arcLength = 408;
                                        const foreignLength = (foreign / total) * arcLength;
                                        const localLength = (local / total) * arcLength;
                                        return (
                                        <>
                                            {/* Background (semua abu-abu dulu) */}
                                            <use
                                                href="#arcPath"
                                                stroke="#D5D7DA"
                                                strokeWidth="16"
                                                strokeLinecap="round"
                                            />

                                            {/* Foreign arc (biru, mulai dari kiri) */}
                                            <use
                                                href="#arcPath"
                                                stroke="#1F87FF"
                                                strokeWidth="16"
                                                strokeLinecap="round"
                                                strokeDasharray={`${foreignLength} ${arcLength}`}
                                                strokeDashoffset="0"
                                            />

                                            {/* Local arc (abu-abu, sisanya setelah foreign) */}
                                            <use
                                                href="#arcPath"
                                                stroke="#9CA3AF"
                                                strokeWidth="16"
                                                strokeLinecap="round"
                                                strokeDasharray={`${localLength} ${arcLength}`}
                                                strokeDashoffset={-foreignLength}
                                            />
                                        </>
                                        );
                                    })()}
                                </svg>

                                {/* Center text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center mt-20">
                                    <span className="text-xs text-gray-500 mb-1">All Employees</span>
                                    <span className="text-3xl font-bold text-gray-900">
                                        {(formData?.foreignWorkers || 0) + (formData?.localWorkers || 0)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tax Details Grid */}
                        <div className="w-full">
                            <div className="w-full flex items-start justify-between border-b py-2">
                                <p className="text-sm text-gray-td-500">ROC Number</p>
                                <p className="text-sm font-medium text-gray-td-900">{formData.rocNumber}</p>
                            </div>
                            <div className="w-full flex items-start justify-between border-b py-2">
                                <p className="text-sm text-gray-td-500">TAP</p>
                                <p className="text-sm font-medium text-gray-td-900">{formData.tapAccountNo}</p>
                            </div>
                            <div className="w-full flex items-start justify-between border-b py-2">
                                <p className="text-sm text-gray-td-500">SCP</p>
                                <p className="text-sm font-medium text-gray-td-900">{formData.scpAccountNo}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Organisation Address */}
                    <div className="flex-1 bg-white p-5 rounded-md relative">
                        <button onClick={() => handleShowForm("organisation form")} className="absolute top-3 right-3">
                            <NotePencilIcon className="text-3xl" />
                        </button>
                        <label className="block text-lg font-medium">Organisation Address</label>
                        <div className="w-[85%] h-fit space-y-4 mt-5">
                            {/* Organisation Name */}
                            <ReuseableInput
                                id="addressLine1"
                                name="addressLine1"
                                placeholder="Address Line 1..."
                                value={formData.addressLine1}
                                required
                                isDisabled={true}
                            />
                            <ReuseableInput
                                id="addressLine2"
                                name="addressLine2"
                                placeholder="Address Line 2..."
                                value={formData.addressLine2}
                                required
                                isDisabled={true}
                            />
                            <div className="w-full flex items-start justify-start space-x-5">
                                <ReuseableInput
                                    id="pincode"
                                    name="pincode"
                                    placeholder="Postal Code..."
                                    value={formData.pincode}
                                    required
                                    isDisabled={true}
                                />
                                <ReuseableInput
                                    id="state"
                                    name="state"
                                    placeholder="District..."
                                    value={stateData?.find((s) => s.id === formData.state)?.name || ""}
                                    required
                                    isDisabled={true}
                                />
                                <ReuseableInput
                                    id="city"
                                    name="city"
                                    placeholder="City..."
                                    value={city?.find((s) => s.id === formData.city)?.name || ""}
                                    required
                                    isDisabled={true}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Person */}
                    <div className="bg-white border border-gray-td-200 rounded-lg p-6 shadow-sm relative">
                    <button onClick={() => handleShowForm("organisation form")} className="absolute top-3 right-3">
                            <NotePencilIcon className="text-3xl" />
                        </button>
                        <label className="block text-lg font-medium">Contact Person</label>
                        <div className="w-[85%] h-fit space-y-4 mt-5">
                            {/* Organisation Name */}
                            <ReuseableInput
                                id="fullName"
                                name="fullName"
                                placeholder="Full Name..."
                                value={`${formData.firstName} ${formData.lastName}`}
                                required
                                isDisabled={true}
                            />
                            <ReuseableInput
                                id="workEmailContactPerson"
                                name="workEmailContactPerson"
                                placeholder="Work Email..."
                                value={formData.workEmailContactPerson}
                                required
                                isDisabled={true}
                            />
                            <ReuseableInput
                                id="phoneContactPerson"
                                name="phoneContactPerson"
                                placeholder="Work Phone..."
                                value={formData.phoneContactPerson}
                                required
                                isDisabled={true}
                            />
                        </div>
                    </div>

                    {/* Organisation Bank Details */}
                    <div className="flex-1 bg-white p-5 rounded-md relative">
                        <button onClick={() => handleShowForm("organisation form")} className="absolute top-3 right-3">
                            <NotePencilIcon className="text-3xl" />
                        </button>
                        <label className="block text-lg font-medium">Organisation Bank Details</label>
                        <div className="w-[85%] h-fit space-y-4 mt-5">
                            {/* Organisation Name */}
                            <ReuseableInput
                                id="addressLine1"
                                name="addressLine1"
                                placeholder="Bank Name..."
                                value={
                                    bankNameOptions?.find(
                                    (option) => option.value === formData.bankNameUuid
                                    )?.label || ""
                                }
                                required
                                isDisabled={true}
                            />
                            <ReuseableInput
                                id="bankAccountName"
                                name="bankAccountName"
                                placeholder="Bank Account Name..."
                                value={formData.bankAccountName}
                                required
                                isDisabled={true}
                            />
                            <ReuseableInput
                                id="bankAccountNumber"
                                name="bankAccountNumber"
                                placeholder="Bank Account Number..."
                                value={formData.bankAccountNumber}
                                required
                                isDisabled={true}
                            />
                        </div>
                    </div>

                    {/* Bank Name */}
                    {/* Bank Name */}
<div className="w-full h-full">
    <div className="w-full h-full">
        {/* Credit Card */}
        <div className="relative w-full h-full rounded-[30px] overflow-hidden shadow-xl">
            {/* Base Background - Dark */}
            <div className="absolute inset-0 bg-[#16084C]"></div>
            
            {/* Overlay Background - Darker */}
            <div className="absolute inset-0 bg-[#080E1D]"></div>

            {/* Gradient Blobs */}
            <div 
                className="absolute w-[411.47px] h-[358.25px]" 
                style={{
                    left: '-113.98px',
                    top: '-168.82px',
                    background: '#8F00FF',
                    filter: 'blur(50.6104px)',
                    transform: 'matrix(-0.86, -0.51, 0.61, -0.8, 0, 0)',
                    zIndex: 2
                }}
            ></div>

            <div 
                className="absolute w-[411.47px] h-[358.25px]" 
                style={{
                    left: '96.37px',
                    top: '-86.43px',
                    background: 'rgba(32, 81, 254, 0.8)',
                    filter: 'blur(50.6104px)',
                    transform: 'matrix(-0.86, -0.51, 0.61, -0.8, 0, 0)',
                    zIndex: 2
                }}
            ></div>

            <div 
                className="absolute w-[384.27px] h-[248.19px]" 
                style={{
                    left: '208.05px',
                    top: '64.46px',
                    background: 'rgba(36, 79, 234, 0.8)',
                    filter: 'blur(70.8545px)',
                    transform: 'matrix(-0.76, -0.66, 0.74, -0.67, 0, 0)',
                    zIndex: 2
                }}
            ></div>

            <div 
                className="absolute w-[353.38px] h-[222.42px]" 
                style={{
                    left: '169.29px',
                    top: '35.47px',
                    background: 'rgba(18, 72, 255, 0.75)',
                    filter: 'blur(53.9844px)',
                    transform: 'matrix(-0.86, -0.51, 0.61, -0.8, 0, 0)',
                    zIndex: 2
                }}
            ></div>

            <div 
                className="absolute w-[603.11px] h-[248.79px]" 
                style={{
                    left: '-10.79px',
                    top: '-91.62px',
                    background: '#121212',
                    filter: 'blur(53.9844px)',
                    transform: 'matrix(-0.86, -0.51, 0.61, -0.8, 0, 0)',
                    zIndex: 2
                }}
            ></div>

            {/* Noise Texture Overlay */}
            <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{
                    zIndex: 4,
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
                }}
            ></div>

            {/* Card Content */}
            <div className="relative h-full p-6 flex flex-col justify-between text-white" style={{ zIndex: 3 }}>
                {/* Top Section - Bank Name & Contactless */}
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-lg font-medium" style={{ textShadow: '0px 4px 4px rgba(92, 92, 92, 0.25)' }}>
                            Bank Name
                        </p>
                    </div>
                    <div className="flex space-x-1">
                        {/* Contactless Symbol */}
                        <div className="rotate-90">
                            <WifiHighIcon className="text-3xl" />
                        </div>
                    </div>
                </div>

                {/* Middle Section - Card Number */}
                <div className="flex-1 flex items-center">
                    <div 
                        className="text-3xl font-bold tracking-wider group cursor-pointer"
                        style={{
                            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.68) 0%, #FFFFFF 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            textShadow: '0px 2.29088px 4.73px rgba(8, 43, 69, 0.16)',
                            letterSpacing: '0.04em'
                        }}
                    >
                        <span className="group-hover:hidden">**** **** **** ****</span>
                        <span className="hidden group-hover:inline">{formData.bankAccountNumber}</span>
                    </div>
                </div>

                {/* Bottom Section - Divider & Company Name */}
                <div className="flex flex-col w-full pt-5 space-y-3">
                    {/* Divider Line */}
                    <div 
                        className="w-full h-[1px]" 
                        style={{ 
                            background: 'rgba(249, 249, 249, 0.21)',
                            transform: 'rotate(-0.99deg)'
                        }}
                    ></div>
                    
                    <div className="flex justify-between items-center w-full">
                        <p className="text-sm font-medium" style={{ textShadow: '0px 4px 4px rgba(92, 92, 92, 0.25)' }}>
                            Your Company Name
                        </p>
                        <div
                            className="px-[9px] py-[9px] relative"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <Info className="text-xl" />
                            {showTooltip && (
                                <div className="absolute w-[300px] h-fit -top-4 -left-[310px] bg-white text-black font-light p-2 rounded-md space-y-2">
                                    <h1 className="text-sm font-medium">Visual Card</h1>
                                    <p className="text-xs w-full whitespace-normal">
                                        This card is for visual representation only and has no functional use.
                                    </p>
                                    <div className="absolute w-3 h-3 rotate-45 bg-white top-5 -translate-y-1/2 -right-1"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

                    {/* Filling Address */}
                    <div className="flex-1 bg-white p-5 rounded-md relative">
                        <button onClick={() => handleShowForm("organisation form")} className="absolute top-3 right-3">
                            <NotePencilIcon className="text-3xl" />
                        </button>
                        <label className="block text-lg font-medium">Filling Address</label>
                        <div className="w-[85%] h-fit space-y-4 mt-5">
                            {/* Organisation Name */}
                            <ReuseableInput
                                id="addressLine1"
                                name="addressLine1"
                                placeholder="Address Line 1..."
                                value={organizationDetail?.WorkLocation?.addressLine1}
                                required
                                isDisabled={true}
                            />
                            <ReuseableInput
                                id="addressLine2"
                                name="addressLine2"
                                placeholder="Address Line 2..."
                                value={organizationDetail?.WorkLocation?.addressLine2}
                                required
                                isDisabled={true}
                            />
                            <div className="w-full flex items-start justify-start space-x-5">
                                <ReuseableInput
                                    id="pincode"
                                    name="pincode"
                                    placeholder="Postal Code..."
                                    value={organizationDetail?.WorkLocation?.postalCode}
                                    required
                                    isDisabled={true}
                                />
                                <ReuseableInput
                                    id="state"
                                    name="state"
                                    placeholder="District..."
                                    value={stateData?.find((s) => s.id === organizationDetail?.WorkLocation?.stateId)?.name || ""}
                                    required
                                    isDisabled={true}
                                />
                                <ReuseableInput
                                    id="city"
                                    name="city"
                                    placeholder="City..."
                                    value={city?.find((s) => s.id === organizationDetail?.WorkLocation?.cityId)?.name || ""}
                                    required
                                    isDisabled={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No data available</p>
            )}
            <Modal
                isOpen={modalFillingAddress}
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
                    setShowModal={setModalFillingAddress} 
                    formFor={"fillingaddress"}
                />
            </Modal>
        </div>
    );
}

export default OrganisationProfile
;