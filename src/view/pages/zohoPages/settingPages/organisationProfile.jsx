import { useEffect, useState } from "react";
import { dummyLoops, tabOrganisationProfiles } from "../../../../../data/dummy";
import HeaderReusable from "../../../component/setting/headerReusable";
import { ArrowRight, EnvelopeSimple, Info, Star, UploadSimple } from "@phosphor-icons/react";
import CardSetting from "../../../component/setting/cardSetting";
import zohoStore from "../../../../store/zohoStoreManagement";
import { useLocation } from "react-router-dom";
import { formatNicknameFromEmail } from "../../../../../helper/globalHelper";
import { toast } from "react-toastify";
const baseUrl = import.meta.env.VITE_BASEURL;

function OrganisationProfile() {
    const { fetchZohoOrganisationProfile, dataOrganisationProfile, loading, uploadLogoOrganization, logoOrganizationId, error } = zohoStore();
    const {pathname} = useLocation();
    const [activeTab, setActiveTab] = useState(tabOrganisationProfiles[0]);
    const [formData, setFormData] = useState({
        organisationName: "",
        businessLocation: "",
        industry: "",
        dateFormat: "",
        fieldSeparator: "",
        address1: "",
        address2: "",
        state: "",
        city: "",
        pincode: "",
        logo: null,
        contactMailId: ""
    });
    const [logoPreview, setLogoPreview] = useState(null);

    useEffect(() => {
        if(!dataOrganisationProfile){
          const token = localStorage.getItem("zoho_access_token");
          fetchZohoOrganisationProfile(token);
        }
    }, [pathname]);

    useEffect(() => {
        if (dataOrganisationProfile) {
          setFormData(prev => ({
            ...prev,
            organisationName: dataOrganisationProfile.Company || "",
            businessLocation: dataOrganisationProfile.Address?.Country || "",
            industry: "",
            dateFormat: dataOrganisationProfile.DateFormat?.replace(/-/g, "/") || "",
            fieldSeparator: "",
            address1: dataOrganisationProfile.Address?.AddressLine1 || "",
            address2: dataOrganisationProfile.Address?.AddressLine2 || "",
            state: dataOrganisationProfile.Address?.State || "",
            city: dataOrganisationProfile.Address?.City || "",
            pincode: dataOrganisationProfile.Address?.PostalCode || "",
            contactMailId: dataOrganisationProfile?.ContactMailId || "",
            logo: null
          }));
        }
    }, [dataOrganisationProfile]);

    useEffect(() => {
        if(logoOrganizationId){
            setLogoPreview(true)
        }
    }, [logoOrganizationId]);

    useEffect(() => {
        if(error){
            toast.error("Logo uploaded successfully", {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
            })
        }
    }, [error]);
    
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
            data.append('image', formData.logo);
        }
        const token = localStorage.getItem("zoho_access_token");
        const response = await uploadLogoOrganization(token, data);
        if(response){
            toast.success(response?.message, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
            })
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-start justify-start">
            <HeaderReusable isTabsNotTittle={true} tabs={tabOrganisationProfiles} activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="w-full h-full p-5 overflow-y-auto">
                <div className="w-full space-y-10">
                    <div className="w-1/2 flex flex-col space-y-20">
                        <div className="w-full flex flex-col space-y-2">
                            {/* Organisation Logo */}
                            <div className="mb-6 flex flex-col space-y-2">
                                <label className="block text-base font-light">Organisation Logo</label>
                                <div className="flex items-start">
                                    <div className="border border-dashed border-gray-300 rounded p-4 w-56 h-24 flex items-center justify-center relative">
                                        {logoPreview ? (
                                            <div className="relative w-full h-full">
                                                <img 
                                                    src={formData?.logo ? logoPreview : `${baseUrl}/zoho/show-logo-organization/${logoOrganizationId}`}
                                                    alt="Logo Preview" 
                                                    className="w-full h-full object-contain"
                                                />
                                                <button 
                                                    type="button" 
                                                    className="absolute top-0 right-0 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                                    onClick={() => {
                                                        setLogoPreview(null);
                                                        setFormData({...formData, logo: null});
                                                    }}
                                                >
                                                    ×
                                                </button>
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
                                                    className="flex items-center justify-center cursor-pointer text-center space-x-2"
                                                >
                                                <UploadSimple />
                                                    <span className="text-gray-500 text-sm font-light">UPLOAD LOGO</span>
                                                </label>
                                            </>
                                        )}
                                    </div>
                                    <div className="ml-4 flex-1 flex flex-col space-y-2">
                                        <p className="text-gray-700 text-sm font-light">This logo will be displayed on documents such as Payslip and TDS Worksheet.</p>
                                        <p className="text-gray-500 text-xs font-light">Preferred Image Size: 240 × 240 pixels @ 72 DPI, Maximum size of 1MB.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Organisation Name */}
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="organisationName" className="block text-base font-light">
                                    Organisation Name<span className="text-blue-500">*</span>
                                </label>
                                <p className="text-gray-600 text-sm font-light">This is your registered business name which will appear in all the forms and payslips.</p>
                                <input
                                    disabled
                                    type="text"
                                    id="organisationName"
                                    name="organisationName"
                                    value={formData.organisationName}
                                    onChange={handleInputChange}
                                    className="w-full px-2 py-2 border border-gray-300 rounded-md text-base"
                                />
                            </div>

                            {/* Business Location and Industry */}
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1 min-w-64 space-y-2">
                                    <label htmlFor="businessLocation" className="block text-base font-light">
                                        Business Location<span className="text-blue-500">*</span>
                                    </label>
                                    <input
                                        disabled
                                        type="text"
                                        id="businessLocation"
                                        name="businessLocation"
                                        value={formData.businessLocation}
                                        onChange={handleInputChange}
                                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-base"
                                    />
                                </div>
                                <div className="flex-1 min-w-64 space-y-2">
                                    <label htmlFor="industry" className="block text-base font-light">
                                        Industry<span className="text-blue-500">*</span>
                                    </label>
                                    <input
                                        disabled
                                        type="text"
                                        id="industry"
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleInputChange}
                                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-base"
                                    />
                                </div>
                            </div>

                            {/* Date Format and Field Separator */}
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1 min-w-64 space-y-2">
                                    <label htmlFor="dateFormat" className="block text-base font-light">
                                        Date Format<span className="text-blue-500">*</span>
                                    </label>
                                    <input
                                        disabled
                                        type="text"
                                        id="dateFormat"
                                        name="dateFormat"
                                        value={formData.dateFormat}
                                        onChange={handleInputChange}
                                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-base"
                                    />
                                </div>
                                <div className="flex-1 min-w-64 space-y-2">
                                    <label htmlFor="fieldSeparator" className="block text-base font-light">
                                        Field Separator
                                    </label>
                                    <input
                                        disabled
                                        type="text"
                                        id="fieldSeparator"
                                        name="fieldSeparator"
                                        value={formData.fieldSeparator}
                                        onChange={handleInputChange}
                                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-base"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Organisation Address */}
                        <div className="space-y-2">
                            <label className="block text-base font-light">
                                Organisation Address<span className="text-blue-500">*</span>
                            </label>
                            <p className="text-gray-600 text-sm font-light">This will be considered as the address of your primary work location.</p>
                            <div className="space-y-4">
                                <input
                                    disabled
                                    type="text"
                                    id="address1"
                                    name="address1"
                                    value={formData.address1}
                                    onChange={handleInputChange}
                                    className="w-full px-2 py-2 border border-gray-300 rounded-md text-base"
                                />
                                <input
                                    disabled
                                    type="text"
                                    id="address2"
                                    name="address2"
                                    value={formData.address2}
                                    onChange={handleInputChange}
                                    className="w-full px-2 py-2 border border-gray-300 rounded-md text-base"
                                />
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                                <div className="flex-1 min-w-32">
                                    <input
                                        disabled
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-base"
                                    />
                                </div>
                                <div className="flex-1 min-w-32">
                                    <input
                                        disabled
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-base"
                                    />
                                </div>
                                <div className="flex-1 min-w-32">
                                    <input
                                        disabled
                                        type="text"
                                        id="pincode"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-base"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-[80%] space-y-2">
                        <h1 className="block text-base font-light">Filing Address</h1>
                        <p className="text-gray-600 text-sm font-light">This registered address will be used across all Forms and Payslips.</p>
                        <div className="w-full grid grid-cols-2 items-start justify-start gap-5">
                            <CardSetting data={formData} cardFor="organisationProfile" />
                        </div>
                    </div>

                    <div className="w-full space-y-2">
                        <h1 className="block text-base font-light">Contact Information</h1>
                        <div className="w-[80%] border-[1px] rounded-md shadow-md p-5">
                            <div className="w-full flex space-x-10">
                                <div className="flex-1 space-y-5">
                                    <div className="w-full flex flex-col space-y-2">
                                        <h1 className="block text-base font-normal">Primary Contact Email Address</h1>
                                        <p className="text-gray-600 text-sm font-light w-[85%]">This email address receives reminders and email notifications from Zoho Payroll.</p>
                                    </div>
                                    <div className="w-full flex space-x-5">
                                        <div className="flex items-center justify-center">
                                            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Star className="text-2xl text-orange-400" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start justify-center space-y-2">
                                            <p className="text-gray-600 text-base font-medium capitalize">{formatNicknameFromEmail(formData?.contactMailId)}</p>
                                            <h1 className="block text-base font-light">{formData?.contactMailId}</h1>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1 h-40 flex items-center justify-center">
                                    <div className="w-[1px] h-full bg-gray-300"></div>
                                </div>
                                <div className="flex-1 space-y-5">
                                    <div className="w-full flex flex-col space-y-2">
                                        <h1 className="block text-base font-normal">Emails Are Sent Through</h1>
                                        <p className="text-gray-600 text-sm font-light w-[85%]">You can configure the email addresses that would be used in the sender address field for emails sent via Zoho Payroll.</p>
                                    </div>
                                    <div className="w-full flex space-x-5">
                                        <div className="flex items-center justify-center">
                                            <div className="w-14 h-14 rounded-full bg-[#EEF7FF] flex items-center justify-center">
                                                <EnvelopeSimple className="text-2xl text-sky-400" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <h1 className="block text-base font-light">Email address of Zoho Payroll</h1>
                                            <p className="text-gray-600 text-sm font-light">message-service@mail.zohopayroll.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-start p-5 mt-5 bg-[#EEF7FF] rounded-md">
                                <div className="flex space-x-3 items-start justify-center">
                                    <Info className="text-4xl text-sky-400 pb-3" />
                                    <p>Your primary contact's email address belongs to a public domain. So, emails will be sent from <span className="font-medium">message-service@mail.zohopayroll.com</span> to prevent them from landing in the Spam folder. If you still want to send emails using the public domain, <span className="text-blue-500">Change Setting</span></p>
                                </div>
                            </div>
                            <div className="w-full h-[1px] bg-gray-300 my-5"></div>
                            <div className="w-full flex items-center justify-start space-x-2 text-blue-500">
                                <h1>Configure Sender Email Preferences </h1>
                                <ArrowRight className="text-base" />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="w-[80%] flex items-center justify-between pt-5 border-t-[1px]">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition"
                        >
                            Save
                        </button>
                        <p className="text-blue-500 text-sm">* indicates mandatory fields</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrganisationProfile;