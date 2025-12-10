import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import configurationStoreManagements from '../../../store/tdPayroll/configuration';
import Select from "react-select";
import Modal from "react-modal";
import FormModal from '../../component/formModal';
import authStoreManagements from '../../../store/tdPayroll/auth';
import LoadingIcon from '../../component/loadingIcon';
import { toast } from "react-toastify";
import { CaretDownIcon, User, EnvelopeSimpleIcon, Phone, Lock, Eye, EyeSlash } from '@phosphor-icons/react';
import { validateField } from '../../../../data/dummy';

function RegisterPage() {
    const navigation = useNavigate();
    const { phoneNumberData, fetchPhoneNumberData, fetchStateData, stateData } = configurationStoreManagements();
    const { registerOtp, register, loading: authLoadinog, resendOtp, error } = authStoreManagements();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        email: '',
        phoneNumber: '',
        phoneCode: '+673',
        password: '',
        country: 33,
        state: '',
        agreedToTerms: true,
        marketingConsent: false
    });
    const [modalOtp, setModalOtp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({
        hasLowerCase: false,
        hasUpperCase: false,
        hasSpecial: false,
        hasNumber: false,
        hasMinLength: false
    });
    const [errorValidatePassword, setErrorValidatePassword] = useState(false);
    const [errorValidatePhoneNumber, setErrorValidatePhoneNumber] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [inputUser, setInputUser] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isResendOtp, setIsResendOtp] = useState(false);
    const [inputValidation, setInputValidation] = useState({
        firstName: false,
        lastName: false, 
        companyName: false,
        email: false,
        phoneNumber: false,
        password: false
    });

    useEffect(() => {
        if (formData.country && !stateData?.length) {
            fetchStateData(formData.country);
        }
    }, [formData.country, stateData?.length, fetchStateData]);

    useEffect(() => {
        if (phoneNumberData?.length === 0) {
            fetchPhoneNumberData();
        }
    }, [phoneNumberData.length, fetchPhoneNumberData]);

    useEffect(() => {
        if (isResendOtp && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanResend(true);
        }
    }, [countdown, isResendOtp]);

    const validatePassword = (password) => {
        const errors = {
            hasLowerCase: /[a-z]/.test(password),
            hasUpperCase: /[A-Z]/.test(password), 
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            hasNumber: /\d/.test(password),
            hasMinLength: password.length >= 8
        };
        setPasswordErrors(errors);
        return errors;
    };

    const updateValidationStatus = (name, value) => {
        const isValid = validateField(name, value);
        setInputValidation(prev => ({
            ...prev,
            [name]: isValid
        }));
    };

    const handlePhoneCodeSelect = async (selectedOption) => {
        if (selectedOption) {
            setFormData(prev => ({
                ...prev,
                phoneCode: selectedOption.label,
                country: Number(selectedOption.value)
            }));
            await fetchStateData(selectedOption.value);
        } else {
            setFormData(prev => ({
                ...prev,
                phoneCode: '',
                country: ''
            }));
        }
    };

    const handleInputChange = async (eOrValue, index) => {
        if (typeof index === "number") {
            let value = eOrValue;
            if (!/^\d*$/.test(value)) return;
            value = value.slice(-1);
            const newInputUser = [...inputUser];
            newInputUser[index] = value;
            setInputUser(newInputUser);
            if (value && index < inputUser.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
            return;
        }

        const e = eOrValue;
        const { name, value, type, checked } = e.target;
        
        if (name === "password") {
            const validationResult = validatePassword(value);
            setTimeout(() => {
                updateValidationStatus(name, value);
            }, 100);
        } else {
            updateValidationStatus(name, value);
        }

        if (name === "country") {
            setFormData((prev) => ({
                ...prev,
                [name]: Number(value),
            }));
            await fetchStateData(value);
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const validateForm = (formData) => {
        const errors = {};
        if (!formData.password?.trim()) {
            errors.password = "Please enter your password";
        } else if (!Object.values(passwordErrors).every(valid => valid)) {
            errors.password = "Password doesn't meet all requirements";
        }
        if (!formData.phoneNumber?.trim()) {
            errors.phoneNumber = "Please enter your phone number";
        } else if (formData.phoneNumber.trim().length > 7) {
            errors.phoneNumber = "Phone number cannot exceed 7 characters";
        }
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    };

    const handleSendOtp = async () => {
        const validation = validateForm(formData);    
        if (!validation.isValid) {
            setErrorValidatePassword(validation?.errors.password);
            setErrorValidatePhoneNumber(validation?.errors.phoneNumber);
            return;
        }

        const response = await registerOtp(formData);
        if(response){
            setCurrentStep(2);
            setIsResendOtp(true);
            setCountdown(60);
            setCanResend(false);
            toast.success(response, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            })
            setModalOtp(true);
        }
    };

    const handleRegister = async () => {
        formData.otp = inputUser.join('');;
        formData.type = "user";
        formData.state = Number(formData.state);
        const response = await register(formData);
        if(response){
            toast.success(response, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            })
            setModalOtp(false);
            setFormData({
                firstName: '',
                lastName: '',
                companyName: '',
                email: '',
                phoneNumber: '',
                phoneCode: '',
                password: '',
                country: '',
                state: '',
                agreedToTerms: false,
                marketingConsent: false
            });
            navigation("/register-organization");
        }
    };

    const handleResendOtp = async () => {
        setIsResendOtp(true);
        setCountdown(60);
        setCanResend(false);
        const response = await resendOtp(formData);
        if(response){
            toast.success(response, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            })
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !inputUser[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newInputUser = [...inputUser];
        for (let i = 0; i < 6; i++) {
            newInputUser[i] = pastedData[i] || '';
        }
        setInputUser(newInputUser);
        const lastIndex = Math.min(pastedData.length - 1, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    const SuccessIcon = () => (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
        </div>
    );
    return (
        <div className="w-full h-screen bg-white flex py-5">
            {/* Left Side - Banner */}
            <div className="w-1/2 relative">
                <img 
                    src="/bannerAuth.png" 
                    alt="Login Banner" 
                    className="absolute right-5 top-0 w-full h-full object-contain rounded-[5%] overflow-hidden"
                />
            </div>
            
            {/* Right Side - Registration Form */}
            <div className="w-1/2 flex flex-col items-center justify-center space-y-14">
                {/* Header with step indicator */}
                <div className={`w-full max-w-xl mx-auto flex ${modalOtp ? "justify-end" : "justify-between"} items-center -mb-10`}>
                    {!modalOtp && (
                        <div className="flex justify-start">
                            <img 
                                src="/logo.png" 
                                alt="Tekydoct Logo" 
                                className="h-10"
                            />
                        </div>
                    )}
                    <div className="text-base text-gray-500 flex flex-col items-end justify-end space-y-2">
                        <p>
                            {currentStep}/2
                        </p>
                        <div className={`w-[300%] bg-gray-200 h-2 rounded-full overflow-hidden`}>
                            <div className={`${currentStep == 1 ? "w-1/2" : "w-full"} h-full bg-blue-500 rounded-full`}></div>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                {!modalOtp ? (
                    <div className="overflow-y-auto px-2">
                        <div className="max-w-xl mx-auto">
                            {/* Welcome Text */}
                            <div className="mb-6">
                                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                                    Let's get Started.
                                </h1>
                                <p className="text-sm text-gray-600">
                                    No credit card required.
                                </p>
                            </div>
                            
                            <div className="space-y-5">
                                {/* First Name & Last Name */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <label htmlFor="firstName" className="flex text-base font-light text-gray-700 mb-2 items-center justify-start space-x-2 absolute -top-[25%] left-5 bg-white px-2">
                                            <User className="w-4 h-4"/>
                                            <span>First Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white duration-300 ease-in-out transition-all hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                                        />
                                        {inputValidation.firstName && <SuccessIcon />}
                                        {String(error)?.includes("first") && <span className="text-xs text-red-500">{error}</span>}
                                    </div>
                                    <div className="relative">
                                        <label htmlFor="lastName" className="flex text-base font-light text-gray-700 mb-2 items-center justify-start space-x-2 absolute -top-[25%] left-5 bg-white px-2">
                                            <User className="w-4 h-4"/>
                                            <span>Last Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white duration-300 ease-in-out transition-all hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                                        />
                                        {inputValidation.lastName && <SuccessIcon />}
                                        {String(error)?.includes("last") && <span className="text-xs text-red-500">{error}</span>}
                                    </div>
                                </div>

                                {/* Company Name */}
                                <div className="relative">
                                    <label htmlFor="companyName" className="flex text-base font-light text-gray-700 mb-2 items-center justify-start space-x-2 absolute -top-[25%] left-5 bg-white px-2">
                                        <User className="w-4 h-4"/>
                                        <span>Company Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white duration-300 ease-in-out transition-all hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                                    />
                                    {inputValidation.companyName && <SuccessIcon />}
                                    {String(error)?.includes("company") && <span className="text-xs text-red-500">{error}</span>}
                                </div>

                                {/* Email */}
                                <div className="relative">
                                    <label htmlFor="email" className="flex text-base font-light text-gray-700 mb-2 items-center justify-start space-x-2 absolute -top-[25%] left-5 bg-white px-2">
                                        <EnvelopeSimpleIcon className="w-4 h-4"/>
                                        <span>Email Address</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white duration-300 ease-in-out transition-all hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                                    />
                                    {inputValidation.email && <SuccessIcon />}
                                    {String(error)?.includes("email") && <span className="text-xs text-red-500">{error}</span>}
                                </div>

                                {/* Phone */}
                                <div className="relative">
                                    <div className="flex items-center">
                                        <Select
                                            options={phoneNumberData}
                                            onChange={handlePhoneCodeSelect}
                                            className='w-28 z-20'
                                            value={phoneNumberData.find((option) => option.label === formData.phoneCode)}
                                            classNames={{
                                                control: () =>
                                                    "!rounded-none !rounded-l-md !border-2 !border-gray-300 !bg-white !shadow-none !h-full hover:!border-blue-500 focus:!border-blue-500",
                                                valueContainer: () => "!px-2 !py-2",
                                                indicatorsContainer: () => "!px-1",
                                            }}
                                            styles={{
                                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                            }}
                                        />
                                        <input
                                            type="number"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value.length <= 7) {
                                                handleInputChange(e);
                                                }
                                            }}
                                            className="flex-1 px-4 py-3 border-2 border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white duration-300 ease-in-out transition-all hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                                        />
                                        {inputValidation.phoneNumber && <SuccessIcon />}
                                    </div>
                                    <div className={`flex items-center justify-start mt-1`}>
                                        <span className="text-xs text-red-500">{errorValidatePhoneNumber}</span>
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="relative">
                                    <label htmlFor="password" className={`flex text-base font-light text-gray-700 mb-2 items-center justify-start space-x-2 absolute ${formData.password ? '-top-[10%]' : '-top-[25%]'} left-5 bg-white px-2 z-10`}>
                                        <Lock className="w-4 h-4"/>
                                        <span>Password</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white duration-300 ease-in-out transition-all hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-[40%] transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <EyeSlash size={20} />
                                            ) : (
                                                <Eye size={20} />
                                            )}
                                        </button>
                                        <div className={`flex items-center justify-start mt-1`}>
                                            <span className="text-xs text-red-500">{errorValidatePassword}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Password Requirements */}
                                    {formData.password && (
                                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-3 h-3 rounded-full flex items-center justify-center ${passwordErrors.hasLowerCase ? 'bg-green-500' : 'bg-gray-300'}`}>
                                                    {passwordErrors.hasLowerCase && (
                                                        <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className={passwordErrors.hasLowerCase ? 'text-green-600' : 'text-gray-500'}>One lowercase character</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-3 h-3 rounded-full flex items-center justify-center ${passwordErrors.hasSpecial ? 'bg-green-500' : 'bg-gray-300'}`}>
                                                    {passwordErrors.hasSpecial && (
                                                        <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className={passwordErrors.hasSpecial ? 'text-green-600' : 'text-gray-500'}>One special character</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-3 h-3 rounded-full flex items-center justify-center ${passwordErrors.hasUpperCase ? 'bg-green-500' : 'bg-gray-300'}`}>
                                                    {passwordErrors.hasUpperCase && (
                                                        <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className={passwordErrors.hasUpperCase ? 'text-green-600' : 'text-gray-500'}>One uppercase character</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-3 h-3 rounded-full flex items-center justify-center ${passwordErrors.hasNumber ? 'bg-green-500' : 'bg-gray-300'}`}>
                                                    {passwordErrors.hasNumber && (
                                                        <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className={passwordErrors.hasNumber ? 'text-green-600' : 'text-gray-500'}>One numerical number</span>
                                            </div>
                                            <div className="flex items-center space-x-2 col-span-2">
                                                <div className={`w-3 h-3 rounded-full flex items-center justify-center ${passwordErrors.hasMinLength ? 'bg-green-500' : 'bg-gray-300'}`}>
                                                    {passwordErrors.hasMinLength && (
                                                        <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className={passwordErrors.hasMinLength ? 'text-green-600' : 'text-gray-500'}>8 characters minimum</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Country and State */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <label htmlFor="country" className="flex text-base font-light text-gray-700 mb-2 items-center justify-start space-x-2 absolute -top-[25%] left-5 bg-white px-2">
                                            <span>Select Country</span>
                                        </label>
                                        <select 
                                            id="country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white duration-300 ease-in-out transition-all hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                                        >
                                            <option value="" disabled hidden></option>
                                            {phoneNumberData?.map((country) => (
                                                <option key={country?.value} value={country?.value}>
                                                    {country?.name}
                                                </option>
                                            ))}
                                        </select>
                                        <CaretDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        {String(error)?.includes("country") && <span className="text-xs text-red-500">{error}</span>}
                                    </div>
                                    
                                    <div className="relative">
                                        <label htmlFor="state" className="flex text-base font-light text-gray-700 mb-2 items-center justify-start space-x-2 absolute -top-[25%] left-5 bg-white px-2">
                                            <span>Select District</span>
                                        </label>
                                        <select
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white duration-300 ease-in-out transition-all hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                                        >
                                            <option value="" disabled hidden></option>
                                            {stateData?.map((state) => (
                                                <option key={state?.id} value={state?.id}>
                                                    {state?.name}
                                                </option>
                                            ))}
                                        </select>
                                        <CaretDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        {String(error)?.includes("state") && <span className="text-xs text-red-500">{error}</span>}
                                    </div>
                                </div>

                                {/* Terms Agreement */}
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border-2 transition-all duration-200 ${formData.agreedToTerms ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                                            {formData.agreedToTerms && (
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <input
                                            type="checkbox"
                                            name="agreedToTerms"
                                            checked={formData.agreedToTerms}
                                            onChange={handleInputChange}
                                            className="hidden"
                                        />
                                        <label 
                                            onClick={() => setFormData(prev => ({...prev, agreedToTerms: !prev.agreedToTerms}))}
                                            className="text-sm text-gray-600 cursor-pointer"
                                        >
                                            I agree to the{' '}
                                            <a href="#" className="text-blue-500 hover:underline">
                                                Terms of Services
                                            </a>{' '}
                                            and{' '}
                                            <a href="#" className="text-blue-500 hover:underline">
                                                Privacy Policy
                                            </a>
                                        </label>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border-2 transition-all duration-200 ${formData.marketingConsent ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                                            {formData.marketingConsent && (
                                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <input
                                            type="checkbox"
                                            name="marketingConsent"
                                            checked={formData.marketingConsent}
                                            onChange={handleInputChange}
                                            className="hidden"
                                        />
                                        <label 
                                            onClick={() => setFormData(prev => ({...prev, marketingConsent: !prev.marketingConsent}))}
                                            className="text-sm text-gray-600 cursor-pointer"
                                        >
                                            I agree to receive product updates, news, and other marketing communications, unsubscribe anytime
                                        </label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleSendOtp}
                                    disabled={authLoadinog}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center font-medium transition duration-200"
                                >
                                    {authLoadinog ? (
                                        <div className="h-6 w-6 flex items-center justify-center"> 
                                            <LoadingIcon color="white" /> 
                                        </div> 
                                    ) : (
                                        "Create my account"
                                    )} 
                                </button>
                            </div>

                            {/* Sign in link */}
                            <div className="mt-6 text-center text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-500 hover:underline font-medium">
                                    Sign in
                                </Link>
                            </div>

                            {/* Footer */}
                            <div className="mt-8 text-center">
                                <p className="text-xs text-gray-500">
                                    © 2025, Tekydoct Sdn. Bhd. All Rights Reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-4xl mx-auto flex justify-between items-center pe-20 pt-10">
                        <div className="w-full space-y-20">
                            {/* Welcome Text */}
                            <div className="">
                                <h1 className="text-4xl font-semibold text-gray-900 mb-2">
                                    Start your free account today.
                                </h1>
                            </div>

                            {/* Verify Text */}
                            <div className="">
                                <h2 className="text-lg font-medium text-gray-900 mb-5">
                                    Verify your sign up
                                </h2>
                                <div className="w-1/2 text-base text-gray-600 space-y-1">
                                    <p>
                                        Please enter the one-time password (OTP) we sent to{' '}
                                        <span className="font-medium text-gray-900">{formData.email}</span>{' '}
                                        to complete your sign-up.{' '}
                                        <button 
                                            className="text-blue-600 hover:text-blue-700"
                                            onClick={() => {
                                                setCurrentStep(1);
                                                setModalOtp(false);
                                            }}
                                        >
                                            Change
                                        </button>
                                    </p>
                                </div>
                            </div>

                            {/* OTP Input */}
                            <div className="flex items-center justify-center pb-10">
                                <div className="w-fit flex flex-col items-end justify-center">
                                    <div className="flex justify-center space-x-3 mb-4">
                                        {inputUser.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => (inputRefs.current[index] = el)}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleInputChange(e.target.value, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                onPaste={handlePaste}
                                                className={`w-20 h-20 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error === "Invalid OTP" ? "border-red-300" : "border-gray-300"}  transition-all duration-200`}
                                                autoComplete="off"
                                            />
                                        ))}
                                    </div>

                                    {/* Resend OTP */}
                                    <div className="flex justify-end">
                                        {!canResend ? (
                                            <p className="text-xs text-blue-600">
                                                Resend an OTP in <span className="font-medium">00:{countdown.toString().padStart(2, '0')}</span>
                                            </p>
                                        ) : (
                                            <button  
                                                className="text-xs text-blue-600 hover:text-blue-700 font-medium" 
                                                onClick={handleResendOtp}
                                            > 
                                                Resend an OTP
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleRegister}
                                disabled={authLoadinog}
                                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white`}
                            >
                                {authLoadinog ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5">
                                            <LoadingIcon color="white" />
                                        </div>
                                        <span className="ml-2">Verifying...</span>
                                    </div>
                                ) : "Let's Get Started"}
                            </button>

                            {/* Footer */}
                            <div className="mt-8 text-center">
                                <p className="text-xs text-gray-500">
                                    © 2025, Tekydoct Sdn. Bhd. All Rights Reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* <Modal
                isOpen={modalOtp}
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
                    },
                }}
            >
                <FormModal 
                    message={"OTP"} 
                    setShowModal={setModalOtp} 
                    submit={handleRegister} 
                    isLoading={authLoadinog} 
                    isResendOtp={true} 
                    resendOtp={handleResendOtp} 
                    formFor={"otp"} 
                />
            </Modal> */}
        </div>
    );
}

export default RegisterPage;