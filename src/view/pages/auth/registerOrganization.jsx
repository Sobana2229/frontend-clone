import { useEffect, useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import configurationStoreManagements from "../../../store/tdPayroll/configuration";
import organizationStoreManagements from "../../../store/tdPayroll/setting/organization";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function RegisterOrganizationPage() {
    const navigate = useNavigate();
    const { 
        phoneNumberData: dataCountry, 
        fetchPhoneNumberData: fetchDataCountry, 
        fetchIndustryData, 
        industry, 
        fetchStateData, 
        stateData,
        fetchCityData,
        city 
    } = configurationStoreManagements();
    const { organizationRegister } = organizationStoreManagements();
    const [formData, setFormData] = useState({
        name: '',
        businessLocation: '',
        industry: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        city: '',
        pincode: '',
        hasRunPayroll: ''
    });

    useEffect(() => {
        if (dataCountry?.length === 0) {
            fetchDataCountry();
        }
    }, [dataCountry.length, fetchDataCountry]);

    useEffect(() => {
        if (industry?.length === 0) {
            fetchIndustryData();
        }
    }, [industry.length, fetchIndustryData]);

    const handleCountrySelect = async (e) => {
        const value = e.target.value;
        if (value) {
            const response = await fetchStateData(value);
            await fetchCityData(response[0]?.id);
            setFormData(prev => ({
                ...prev,
                businessLocation: value,
                state: response[0]?.id,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                businessLocation: '',
            }));
        }
    };

    const handleStateSelect = async (e) => {
        const value = e.target.value;
        if (value) {
            setFormData(prev => ({
                ...prev,
                state: value,
            }));
            await fetchCityData(value);
        } else {
            setFormData(prev => ({
                ...prev,
                state: '',
            }));
        }
    };
    
    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        const payload = {
            ...formData,
            businessLocation: formData.businessLocation === '' ? null : Number(formData.businessLocation),
            city: formData.city === '' ? null : Number(formData.city),
            state: formData.state === '' ? null : Number(formData.state),
        };
        
        const access_token = localStorage.getItem("accessToken");
        const response = await organizationRegister(payload, access_token);
        if(response){
            setFormData({
                name: '',
                businessLocation: '',
                industry: '',
                addressLine1: '',
                addressLine2: '',
                state: '',
                city: '',
                pincode: '',
                hasRunPayroll: ''
            });
            toast.success(response, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            });
            navigate("/");
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
                <div className="space-y-6">
                    {/* Organization Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Organisation Name* 
                            <span className="ml-1 text-gray-400">ⓘ</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="Zaaya Solution Pvt Ltd"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Business Location and Industry */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business Location*
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.businessLocation}
                                    onChange={handleCountrySelect}
                                    className="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >   
                                    <option value="" disabled hidden>Select Country</option>
                                    {dataCountry?.map((country) => (
                                        <option key={country?.value} value={country?.value}>{country?.name}</option>
                                    ))}
                                </select>
                                <CaretDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Industry*
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.industry}
                                    onChange={(e) => handleChange('industry', e.target.value)}
                                    className="w-full p-3 pe-5 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent overflow-hidden text-ellipsis whitespace-nowrap"
                                    style={{ textOverflow: 'ellipsis' }}
                                >
                                <option value="" disabled hidden>Select Industry</option>
                                {industry?.map((industry) => (
                                    <option key={industry.uuid} value={industry.uuid}>
                                        {industry.name}
                                    </option>
                                ))}
                                </select>

                                <CaretDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Organization Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Organisation Address*
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                            This will be configured as the address of your primary work location.
                        </p>
                        <div className="w-full flex flex-col items-center justify-center space-y-2">
                            <input
                                type="text"
                                value={formData.addressLine1}
                                onChange={(e) => handleChange('addressLine1', e.target.value)}
                                placeholder="Address Line 1"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                value={formData.addressLine2}
                                onChange={(e) => handleChange('addressLine2', e.target.value)}
                                placeholder="Address Line 2"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* State, City, Pincode */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="relative">
                            <select
                                value={formData.state}
                                onChange={handleStateSelect}
                                className="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                style={{ textOverflow: 'ellipsis' }}
                            >
                                <option value="" disabled hidden>Select District</option>
                                {stateData?.map((state) => (
                                    <option key={state?.id} value={state?.id}>{state?.name}</option> 
                                ))}
                            </select>
                            <CaretDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <select
                                value={formData.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="" disabled hidden>Select City</option>
                                {city?.map((city) => (
                                    <option key={city?.id} value={city?.id}>{city?.name}</option> 
                                ))}
                            </select>
                            <CaretDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                        </div>

                        <input
                            type="text"
                            value={formData.pincode}
                            onChange={(e) => handleChange('pincode', e.target.value)}
                            placeholder="600013"
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Payroll Question */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Have you run payroll earlier this financial year?*
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="payroll"
                                    value="yes"
                                    checked={formData.hasRunPayroll === 'yes'}
                                    onChange={(e) => handleChange('hasRunPayroll', e.target.value)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    Yes, we've already run payrolls for this financial year.
                                </span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="payroll"
                                    value="no"
                                    checked={formData.hasRunPayroll === 'no'}
                                    onChange={(e) => handleChange('hasRunPayroll', e.target.value)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    No, we'll run this financial year's first payroll with Tekydoct Payroll.
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Save & Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegisterOrganizationPage;