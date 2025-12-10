import { useEffect, useState } from "react";
import { accountTypeBankDetails, dummyLoops, OrganisationDateFormat, tabOrganisationProfiles } from "../../../../data/dummy";
import { ArrowClockwise, ArrowRight, CaretDownIcon, EnvelopeSimple, Info, MapPin, Star, UploadSimple } from "@phosphor-icons/react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
const baseUrl = import.meta.env.VITE_BASEURL;
import dayjs from "dayjs";
import Modal from "react-modal";
import Select, { components } from "react-select";
import organizationStoreManagements from "../../../store/tdPayroll/setting/organization";
import HeaderReusable from "../setting/headerReusable";
import CardSetting from "../setting/cardSetting";
import { flagImage, formatNicknameFromEmail } from "../../../../helper/globalHelper";
import configurationStoreManagements from "../../../store/tdPayroll/configuration";
import authStoreManagements from "../../../store/tdPayroll/auth";
import LoadingIcon from "../loadingIcon";
import taxStoreManagements from "../../../store/tdPayroll/setting/tax";
import CustomOption from "../customOption";
import FormModal from "../formModal";
import ButtonReusable from "../buttonReusable";
import ReuseableInput from "../reuseableInput";
import { CustomToast } from "../customToast";
import leaveAndAttendanceStoreManagements from "../../../store/tdPayroll/setting/leaveAndAttendance";

function OrganisationProfileForm({setShowFormOrganizationProfiles, showFormOrganizationProfiles}) {
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
    const { 
        fetchWorkLocationOptions,
        workLocationOptions 
    } = leaveAndAttendanceStoreManagements();
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
        workLocationUuid: "",
    });
    const [logoPreview, setLogoPreview] = useState(null);
    const [existingLogo, setExistingLogo] = useState(null);
    const [modalNatureOfBusiness, setModalNatureOfBusiness] = useState(false);
    const [modalBankName, setModalBankName] = useState(false);
    const [modalDesignation, setModalDesignation] = useState(false);

    useEffect(() => {
        if (phoneNumberData?.length === 0) {
            fetchPhoneNumberData();
        }
    }, [phoneNumberData.length, fetchPhoneNumberData]);

    useEffect(() => {
        if(!Array.isArray(workLocationOptions) || workLocationOptions?.length === 0) {
            const access_token = localStorage.getItem("accessToken");
            fetchWorkLocationOptions(access_token);
        }
    }, [workLocationOptions]);

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
            // Prioritize country from organizationDetail if available, otherwise use user organization country
            const countryId = organizationDetail?.Country?.id || user?.organization?.organizationDetail?.countryId;
            if (countryId) {
                await fetchStateData(countryId);
            }
        };

        const countryId = organizationDetail?.Country?.id || user?.organization?.organizationDetail?.countryId;
        if (stateData?.length === 0 && countryId) {
            fetchStateList();
        } else if (organizationDetail?.Country?.id && organizationDetail?.Country?.id !== user?.organization?.organizationDetail?.countryId) {
            // If organizationDetail has different country, refetch state data
            fetchStateList();
        }
    }, [stateData?.length, user?.organization?.organizationDetail?.countryId, organizationDetail?.Country?.id, fetchStateData]);
    
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
                city: "", // Reset city first, will be set after fetchCityData
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
                workLocationUuid: organizationDetail?.workLocationUuid || "",
            }));

            // Always fetch city data if state exists
            if (organizationDetail.State?.id) {
                fetchCityData(organizationDetail.State.id);
            }
        }
    }, [organizationDetail]);

    // Set city value after city data is fetched and available
    useEffect(() => {
        if (organizationDetail?.City?.id && city?.length > 0 && formData.state) {
            // Only set city if it exists in the fetched city list
            const cityExists = city.some(cityItem => cityItem.id === Number(organizationDetail.City.id));
            if (cityExists && !formData.city) {
                setFormData(prev => ({
                    ...prev,
                    city: organizationDetail.City.id
                }));
            }
        }
    }, [city, organizationDetail?.City?.id, formData.state]);

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

    const handlePhoneCodeSelect = async (selectedOption) => {
        if (selectedOption) {
            setFormData(prev => ({
                ...prev,
                phoneCode: selectedOption.label,
                businessLocation: selectedOption.name,
                flagIso: selectedOption.emoji,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                phoneCode: '',
                businessLocation: '',
                flagIso: '',
            }));
        }
    };

    const handlePhoneCodeContactPersonSelect = async (selectedOption) => {
        if (selectedOption) {
            setFormData(prev => ({
                ...prev,
                phoneCodeContactPerson: selectedOption.label,
        }));
        } else {
            setFormData(prev => ({
                ...prev,
                phoneCodeContactPerson: '',
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 1024 * 1024) {
            alert("File size should not exceed 1MB");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setLogoPreview(reader.result);
        };
        reader.readAsDataURL(file);
        setFormData(prev => ({
            ...prev,
            logo: file
        }));
    };
    
    const handleSubmit = async () => {
        const data = new FormData();
        if (formData.logo) {
            data.append("logo", formData.logo);
        }
        data.append("name", formData.name);
        data.append("industry", formData.industry);
        data.append("addressLine1", formData.addressLine1);
        data.append("addressLine2", formData.addressLine2 || "");
        // ✅ Send empty string if city/state is empty - backend will parse it to null
        data.append("city", formData.city ? Number(formData.city).toString() : "");
        data.append("state", formData.state ? Number(formData.state).toString() : "");
        data.append("pincode", formData.pincode || "");
        data.append("bankNameUuid", formData.bankNameUuid || "");
        data.append("natureOfBusinessesUuid", formData.natureOfBusinessesUuid || "");
        data.append("bankAccountName", formData.bankAccountName || "");
        data.append("bankAccountNumber", formData.bankAccountNumber || "");
        data.append("website", formData.website || "");
        data.append("companyEmail", formData.companyEmail || "");
        data.append("companyPhone", formData.companyPhone || "");
        data.append("phoneCode", formData.phoneCode || "");
        data.append("flagIso", formData.flagIso || "");
        data.append("dateFormat", formData.dateFormat || "");
        data.append("workLocationName", formData.workLocationName || "");
        data.append("addressDetail", formData.addressDetail || "");
        data.append("branchName", formData.branchName || "");
        data.append("accountType", formData.accountType || "");
        data.append("currency", formData.currency || "");
        data.append("phoneCodeContactPerson", formData.phoneCodeContactPerson || "");
        data.append("designationUuid", formData.designationUuid || "");
        data.append("workEmailContactPerson", formData.workEmailContactPerson || "");
        data.append("firstName", formData.firstName || "");
        data.append("lastName", formData.lastName || "");
        data.append("phoneContactPerson", formData.phoneContactPerson || "");
        data.append("workLocationUuid", formData.workLocationUuid || "");
        const token = localStorage.getItem("accessToken");
        const response = await updateOganizationDetail(data, token);
        if(response){
            await fetchoOganizationDetail(token);
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
            setShowFormOrganizationProfiles(false)
        }
    };

    const handleNatureOfBusinessSubmit = async (name) => {
        const formData = { name };
        const access_token = localStorage.getItem("accessToken");
        const response = await createOrganizationSetting(formData, "nature-of-business", access_token);
        if(response){
            await fetchOrganizationSetting("nature-of-business", access_token);
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
            setModalNatureOfBusiness(false);
        }
    }

    const handleNatureOfBusinessSelect = async (selectedOption) => {
        if(selectedOption.value == "create-new-data"){
            setModalNatureOfBusiness(!modalNatureOfBusiness);
        }else{
            setFormData(prev => ({
                ...prev,
                natureOfBusinessesUuid: selectedOption.value,
            }));
        }
    };

    const handleBankNameSubmit = async (name) => {
        const formData = { name };
        const access_token = localStorage.getItem("accessToken");
        const response = await createOrganizationSetting(formData, "bank-name", access_token);
        if(response){
            await fetchOrganizationSetting("bank-name", access_token);
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
            setModalBankName(false);
        }
    }

    const handleBankNameSelect = async (selectedOption) => {
        if(selectedOption.value == "create-new-data"){
            setModalBankName(!modalBankName);
        }else{
            setFormData(prev => ({
                ...prev,
                bankNameUuid: selectedOption.value,
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
            setModalDesignation(false);
        }
    }

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

    const CustomControl = (props) => (
        <components.Control {...props}>
            <span className="pr-1 pl-2 text-xl">
                <MapPin />
            </span>
            {props.children}
        </components.Control>
    );
    
    return (
        <div className="w-full flex-1 flex flex-col items-start justify-start bg-gray-td-200 overflow-y-auto">
            <div className="w-full flex-1 p-5 bg-white rounded-md">
                <div className="w-full space-y-10">
                    <div className="w-1/2 flex flex-col space-y-10">
                        {/* Organisation Profile Section */}
                        <div className="w-full flex flex-col space-y-5">
                                {/* Organisation Logo */}
                                <div className="mb-6 flex flex-col space-y-2">
                                    <label className="block text-base font-light">Organisation Logo</label>
                                    <div className="flex items-start">
                                        <div className="border border-blue-td-500 rounded w-56 h-24 flex items-center justify-center relative">
                                            {logoPreview || existingLogo ? (
                                                <div className="relative w-full h-full">
                                                    <img 
                                                        src={logoPreview || `${baseUrl}${existingLogo}`}
                                                        alt="Logo Preview" 
                                                        className="w-full h-full object-contain"
                                                    />
                                                    {/* Action buttons overlay */}
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
                                                        <button 
                                                            type="button" 
                                                            className="bg-red-td-50 rounded px-2 py-1 text-red-td-500 font-medium flex items-center justify-center space-x-2"
                                                            onClick={() => {
                                                                setLogoPreview(null);
                                                                setExistingLogo(null);
                                                                setFormData({...formData, logo: null});
                                                                // Clear the file input
                                                                const fileInput = document.getElementById('logo-upload');
                                                                if (fileInput) fileInput.value = '';
                                                            }}
                                                        >
                                                            <ArrowClockwise size={14} weight="fill" />
                                                            <span>Remove</span>
                                                        </button>
                                                        <label 
                                                            htmlFor="logo-reupload" 
                                                            className="bg-blue-td-50 rounded px-2 py-1 text-blue-td-500 font-medium flex items-center justify-center space-x-2"
                                                        >
                                                            <ArrowClockwise size={14} weight="fill" />
                                                            <span>Reupload</span>
                                                        </label>
                                                        <input
                                                            type="file" 
                                                            accept="image/*" 
                                                            id="logo-reupload" 
                                                            className="hidden" 
                                                            onChange={handleLogoUpload}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <input
                                                        type="file" 
                                                        accept="image/*" 
                                                        id="logo-upload" 
                                                        className="hidden" 
                                                        onChange={handleLogoUpload}
                                                    />
                                                    <label 
                                                        htmlFor="logo-upload" 
                                                        className="flex flex-col items-center justify-center cursor-pointer text-center space-y-2"
                                                    >
                                                        <UploadSimple size={24} className="text-gray-400" />
                                                        <span className="text-blue-500 text-sm font-medium underline">Upload Logo</span>
                                                    </label>
                                                </>
                                            )}
                                        </div>
                                        <div className="ml-4 flex-1 flex flex-col space-y-2">
                                            <p className="text-gray-700 text-sm font-light">This logo will be displayed on documents such as Payslip and ESS portal.</p>
                                            <p className="text-gray-500 text-xs font-light">Preferred Image Size: 240 × 240 pixels @ 72 DPI, Maximum size of 1MB. Accepted File Formats: PNG, JPG, and JPEG.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Organisation Name */}
                                <div className="flex-1 min-w-64 space-y-2">
                                    <ReuseableInput
                                        label="Organisation Name"
                                        id="name"
                                        name="name"
                                        placeholder="Organisation Name..."
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        isInfo={true}
                                        infoDescription={"Enter your registered business name as per ROC. This name will appear on all official forms and payslips."}
                                        isIcon={true}
                                        iconFor={"suitcase"}
                                    />
                                </div>

                                {/* Email and Phone */}
                                <div className="flex flex-wrap gap-4">
                                    {/* email */}
                                    <ReuseableInput
                                        label="Company Email Address"
                                        id="companyEmail"
                                        name="companyEmail"
                                        placeholder="Company Email Address..."
                                        value={formData.companyEmail}
                                        onChange={handleInputChange}
                                        required
                                        isIcon={true}
                                        iconFor={"email"}
                                    />
                                    {/* Phone */}
                                    <div className="flex-1 min-w-64 space-y-2">
                                        <label htmlFor="phoneNumber" className="block text-base font-normal">
                                            Company Phone Number <span className="text-blue-td-500">*</span>
                                        </label>
                                        <div className="flex items-center group">
                                            <Select
                                                options={phoneNumberData}
                                                onChange={handlePhoneCodeSelect}
                                                className="w-30 z-20"
                                                value={phoneNumberData.find((option) => option.label === `+${formData.phoneCode}`)}
                                                formatOptionLabel={(option, { context }) => (
                                                    <div className="flex items-center">
                                                        <img src={flagImage({ emoji: option.emoji, country: option.country })} className="w-10 mr-2 object-contain" />
                                                        {context === "menu" ? (
                                                            <span>{option.country} +{option.label}</span>
                                                        ) : (
                                                            <span>{option.label}</span>
                                                        )}
                                                    </div>
                                                )}
                                                classNames={{
                                                    control: () =>
                                                    "!rounded-none !rounded-l-md !border-2 !border-gray-300 !duration-300 !ease-in-out !transition-all !bg-white !shadow-none !h-full group-hover:!border-blue-td-500 group-hover:!shadow-md group-hover:!shadow-blue-300 focus:!border-blue-td-500",
                                                    valueContainer: () => "!px-2 !py-1",
                                                    indicatorsContainer: () => "!px-1",
                                                }}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                            />
                                            <input
                                                type="number"
                                                id="companyPhone"
                                                name="companyPhone"
                                                value={formData.companyPhone}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value.length <= 7) {
                                                        handleInputChange(e);
                                                    }
                                                }}
                                                className="flex-1 px-4 py-2 border-2 border-l-0 border-gray-300 rounded-r-md bg-white 
                                                focus:outline-none focus:ring-2 focus:ring-blue-td-500 focus:border-blue-td-500 
                                                duration-300 ease-in-out transition-all 
                                                group-hover:border-blue-td-500 group-hover:shadow-md group-hover:shadow-blue-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Nature of Business And  Industry*/}
                                <div className="flex flex-wrap gap-4">
                                    {/* Nature of Business */}
                                    <div className="flex-1 min-w-64 space-y-2">
                                        <label htmlFor="rocNumber" className="block text-base font-light">
                                            Nature of Business<span className="text-blue-td-500">*</span>
                                        </label>
                                        <Select
                                            options={natureOfBusinessOptions}
                                            onChange={handleNatureOfBusinessSelect}
                                            value={natureOfBusinessOptions?.find(option => option.value === formData.natureOfBusinessesUuid) || null}
                                            className='w-full bg-transparent border focus:ring-0 outline-none text-sm rounded-lg'
                                            classNames={{
                                            control: () =>
                                                "!rounded-none !rounded-lg !border !border-gray-300 !bg-white !shadow-none !h-full",
                                            valueContainer: () => "!px-2 !py-1",
                                            indicatorsContainer: () => "!px-1",
                                            }}
                                            styles={{
                                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                            }}
                                            components={{ 
                                            Option: (props) => (
                                                <CustomOption 
                                                    props={props} 
                                                    onCreateNew={() => setModalNatureOfBusiness(true)}
                                                    createNewLabel="New Nature of Business"
                                                />
                                            )
                                            }}
                                            menuPortalTarget={document.body}
                                            filterOption={(option, rawInput) => {
                                                if (option.value === "create-new-data") {
                                                    return true;
                                                }
                                                return option.label.toLowerCase().includes(rawInput.toLowerCase());
                                            }}
                                        />
                                    </div>
                                    {/* Industry */}
                                    <div className="flex-1 min-w-64 space-y-2">
                                        <ReuseableInput
                                            label="Industry"
                                            id="industry"
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleInputChange}
                                            as="select"
                                        >
                                            <option value="" hidden>Select The Industry</option>
                                            {industry?.map(el => {
                                                return (
                                                    <option value={el.uuid} key={el.uuid}>{el.name}</option>
                                                )
                                            })}
                                        </ReuseableInput>
                                    </div>
                                </div>

                                {/* Business Location */}
                                <div className="flex-1 min-w-64 space-y-2">
                                    <ReuseableInput
                                        label="Business Location"
                                        id="businessLocation"
                                        name="businessLocation"
                                        placeholder="Business Location..."
                                        value={formData.businessLocation}
                                        onChange={handleInputChange}
                                        required
                                        flagIso={formData?.flagIso}
                                    />
                                </div>

                                {/* Website */}
                                <div className="flex-1 min-w-64 space-y-2">
                                    <ReuseableInput
                                        label="Website"
                                        id="website"
                                        name="website"
                                        placeholder="Website..."
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        required
                                        isInfo={true}
                                        infoDescription={"Enter your company’s website domain. Make sure to include the full address, e.g., www.yourdomain.com"}
                                    />
                                </div>

                                {/* Date Format */}
                                <div className="flex-1 min-w-64 space-y-2">
                                    <ReuseableInput
                                        label="Date Format"
                                        id="dateFormat"
                                        name="dateFormat"
                                        value={formData.dateFormat}
                                        onChange={handleInputChange}
                                        as="select"
                                        isInfo={true}
                                        infoDescription={"Ensure this date format is consistent across all payslips, ESS portal, and other reports."}
                                    >
                                        <option value="">Select The Date Format</option>
                                        {OrganisationDateFormat?.map(el => (
                                            <option value={el}>{el}</option>
                                        ))}
                                    </ReuseableInput>
                                </div>
                        </div>

                        {/* Organisation Address Section */}
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
                                    </div>
                                    {/* Business Location */}
                                    <div className="flex-1 min-w-64 space-y-2">
                                        <ReuseableInput
                                            label="Business Location"
                                            id="businessLocation"
                                            name="businessLocation"
                                            placeholder="Business Location..."
                                            value={formData.businessLocation}
                                            onChange={handleInputChange}
                                            required
                                            flagIso={formData?.flagIso}
                                        />
                                    </div>
                            </div>
                        </div>

                        {/* Organisation Bank Details Section */}
                        <div className="w-full space-y-5">
                            <label className="block text-xl font-bold">
                                Organisation Bank Details<span className="text-blue-td-500">*</span>
                            </label>
                            <div className="w-full flex flex-col space-y-5">
                                    <div className="flex-1 min-w-64 space-y-2">
                                        {/* bank Name */}
                                        <Select
                                            options={bankNameOptions}
                                            onChange={handleBankNameSelect}
                                            value={bankNameOptions?.find(
                                                (option) => option.value === formData.bankNameUuid
                                            ) || null}
                                            className="w-full bg-transparent border focus:ring-0 outline-none text-sm rounded-lg"
                                            classNames={{
                                                control: () =>
                                                "!rounded-none !rounded-lg !border !border-gray-300 !bg-white !shadow-none !h-full",
                                                valueContainer: () => "!px-2 !py-1",
                                                indicatorsContainer: () => "!px-1",
                                            }}
                                            styles={{
                                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                            }}
                                            components={{
                                                Control: CustomControl,
                                                Option: (props) => (
                                                <CustomOption
                                                    props={props}
                                                    onCreateNew={() => setModalBankName(true)}
                                                    createNewLabel="New Nature of Business"
                                                />
                                                ),
                                            }}
                                            menuPortalTarget={document.body}
                                            filterOption={(option, rawInput) => {
                                                if (option.value === "create-new-data") {
                                                return true;
                                                }
                                                return option.label.toLowerCase().includes(rawInput.toLowerCase());
                                            }}
                                        />
                                        {/* Bank Account Name */}
                                        <ReuseableInput
                                            label={"Bank Account Name"}
                                            id="bankAccountName"
                                            name="bankAccountName"
                                            placeholder="Bank Account Name..."
                                            value={formData.bankAccountName}
                                            onChange={handleInputChange}
                                            required
                                            isIcon={true}
                                            iconFor={"location"}
                                            isInfo={true}
                                            infoDescription={"Account name as per bank records, used for managing payslips and complying with legal processes."}
                                            labelUnshow={true}
                                        />
                                        {/* Bank Account Number */}
                                        <ReuseableInput
                                            id="bankAccountNumber"
                                            name="bankAccountNumber"
                                            placeholder="Bank Account Number..."
                                            value={formData.bankAccountNumber}
                                            onChange={handleInputChange}
                                            required
                                            isIcon={true}
                                            iconFor={"location"}
                                        />
                                        {/* Branch Name */}
                                        <ReuseableInput
                                            id="branchName"
                                            name="branchName"
                                            placeholder="Branch Name..."
                                            value={formData.branchName}
                                            onChange={handleInputChange}
                                            required
                                            isIcon={true}
                                            iconFor={"location"}
                                        />
                                        {/* Account Type */}
                                        <ReuseableInput
                                            id="accountType"
                                            name="accountType"
                                            value={formData.accountType}
                                            onChange={handleInputChange}
                                            as="select"
                                            isIcon={true}
                                            iconFor={"location"}
                                        >
                                            <option value="" hidden>Account Type</option>
                                            {accountTypeBankDetails?.map(el => {
                                                return (
                                                    <option value={el} key={el}>{el}</option>
                                                )
                                            })}
                                        </ReuseableInput>
                                        {/* Currency */}
                                        <ReuseableInput
                                            id="currency"
                                            name="currency"
                                            placeholder="Currency..."
                                            value={formData.currency}
                                            onChange={handleInputChange}
                                            required
                                            isIcon={true}
                                            iconFor={"location"}
                                        />
                                    </div>
                            </div>
                        </div>

                        {/* Contact Person Section */}
                        <div className="w-full space-y-5">
                            <label className="block text-xl font-bold">
                                Contact Person<span className="text-blue-td-500">*</span>
                            </label>
                            <div className="w-full flex flex-col space-y-5">
                                    {/* name */}
                                    <div className="flex flex-wrap gap-4">
                                        {/* First Name */}
                                        <ReuseableInput
                                            id="firstName"
                                            name="firstName"
                                            placeholder="First Name..."
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            isIcon={true}
                                            iconFor={"location"}
                                        />
                                        {/* Last Name */}
                                        <ReuseableInput
                                            id="lastName"
                                            name="lastName"
                                            placeholder="Last Name..."
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            isIcon={true}
                                            iconFor={"location"}
                                        />
                                    </div>
                                    {/* Designation */}
                                    <div className="flex-1 min-w-64 space-y-2">
                                        <div className="flex items-center group">
                                            <Select
                                                options={designationOptions}
                                                onChange={handleDesignationSelect}
                                                value={designationOptions.find((option) => option.value === `${formData.designationUuid}`)}
                                                className='w-full bg-transparent border focus:ring-0 outline-none text-sm rounded-lg'
                                                classNames={{
                                                    control: () =>
                                                        "!rounded-none !rounded-lg !border !border-gray-300 !bg-white !shadow-none !h-full",
                                                    valueContainer: () => "!px-2 !py-1",
                                                    indicatorsContainer: () => "!px-1",
                                                }}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                                components={{
                                                    Control: CustomControl,
                                                    Option: (props) => (
                                                    <CustomOption
                                                        props={props}
                                                        onCreateNew={() => setModalDesignation(true)}
                                                        createNewLabel="New Designation"
                                                    />
                                                    ),
                                                }}
                                                menuPortalTarget={document.body}
                                                filterOption={(option, rawInput) => {
                                                    if (option.value === "create-new-data") {
                                                        return true;
                                                    }
                                                    return option.label.toLowerCase().includes(rawInput.toLowerCase());
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {/* Work Email */}
                                    <div className="flex-1 min-w-64 space-y-2">
                                        <ReuseableInput
                                            id="workEmailContactPerson"
                                            name="workEmailContactPerson"
                                            placeholder="Work Email..."
                                            value={formData.workEmailContactPerson}
                                            onChange={handleInputChange}
                                            required
                                            isIcon={true}
                                            iconFor={"location"}
                                        />
                                    </div>
                                    {/* Phone */}
                                    <div className="flex-1 min-w-64 space-y-2">
                                        <div className="flex items-center group">
                                            <Select
                                                options={phoneNumberData}
                                                onChange={handlePhoneCodeContactPersonSelect}
                                                className="w-30 z-20"
                                                value={phoneNumberData.find((option) => option.label === `${formData.phoneCodeContactPerson}`)}
                                                formatOptionLabel={(option, { context }) => (
                                                    <div className="flex items-center">
                                                        <img src={flagImage({ emoji: option.emoji, country: option.country })} className="w-10 mr-2 object-contain" />
                                                        {context === "menu" ? (
                                                            <span>{option.country} +{option.label}</span>
                                                        ) : (
                                                            <span>{option.label}</span>
                                                        )}
                                                    </div>
                                                )}
                                                classNames={{
                                                    control: () =>
                                                    "!rounded-none !rounded-l-md !border-2 !border-gray-300 !duration-300 !ease-in-out !transition-all !bg-white !shadow-none !h-full group-hover:!border-blue-td-500 group-hover:!shadow-md group-hover:!shadow-blue-300 focus:!border-blue-td-500",
                                                    valueContainer: () => "!px-2 !py-1",
                                                    indicatorsContainer: () => "!px-1",
                                                }}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                }}
                                            />
                                            <input
                                                type="number"
                                                id="phoneContactPerson"
                                                name="phoneContactPerson"
                                                value={formData.phoneContactPerson}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value.length <= 7) {
                                                        handleInputChange(e);
                                                    }
                                                }}
                                                className="flex-1 px-4 py-2 border-2 border-l-0 border-gray-300 rounded-r-md bg-white duration-300 ease-in-out transition-all right-0 outline-none group-hover:border-blue-td-500 group-hover:shadow-md group-hover:shadow-blue-300"
                                            />
                                        </div>
                                    </div>
                            </div>
                        </div>

                        {/* Filling Address Section */}
                        <div className="w-full space-y-5">
                            <label className="block text-xl font-bold">
                                Filling Address<span className="text-blue-td-500">*</span>
                            </label>
                            <div className="w-full flex flex-col space-y-5">
                                <div className="flex-1 min-w-64 space-y-2">
                                    <label htmlFor="workLocationUuid" className="block text-base font-light">
                                        Selecting Filing Location<span className="text-blue-td-500">*</span>
                                    </label>
                                    <ReuseableInput
                                        id="workLocationUuid"
                                        name="workLocationUuid"
                                        value={formData.workLocationUuid}
                                        onChange={handleInputChange}
                                        required
                                        as="select"
                                        isIcon={true}
                                        iconFor={"location"}
                                    >
                                        <option value="" disabled hidden>Select Filing Location</option>
                                        {workLocationOptions?.map((el) => (
                                            <option key={el?.value} value={el?.value}>{el?.label}</option>
                                        ))}
                                    </ReuseableInput>
                                    <div className="text-xs text-gray-500 mt-2">
                                        <p><strong>Note:</strong> Your filing address should be one of your work locations.</p>
                                        <p>To use a new address, simply add it in <span className="text-blue-500">Settings &gt; Work Locations</span>.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Submit Button */}
                    <div className="w-1/2 flex items-center justify-between pt-5 border-t-[1px]">
                        <div className="flex items-start justify-start space-x-4">
                            <ButtonReusable title={"save"} action={handleSubmit} isLoading={loading} />
                            {!loading && <ButtonReusable title={"cancel"} action={()=>setShowFormOrganizationProfiles(false)} isBLue={false} />}
                        </div>
                        <p className="text-red-td-400 text-sm">* indicates mandatory fields</p>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalNatureOfBusiness}
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
                    setShowModal={setModalNatureOfBusiness} 
                    submit={handleNatureOfBusinessSubmit}
                    isSingle={true}
                    label={"Nature of Business"}
                    titleForm={"Nature of Business"}
                />
            </Modal>

            <Modal
                isOpen={modalBankName}
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
                    setShowModal={setModalBankName} 
                    submit={handleBankNameSubmit}
                    isSingle={true}
                    label={"Bank Name"}
                    titleForm={"Bank Name"}
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
        </div>
    );
}

export default OrganisationProfileForm;