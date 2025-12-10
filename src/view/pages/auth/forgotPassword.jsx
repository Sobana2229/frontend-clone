import { EnvelopeSimpleIcon } from '@phosphor-icons/react';
import { useState, useRef, useEffect } from 'react';
import authStoreManagements from '../../../store/tdPayroll/auth';
import LoadingIcon from '../../component/loadingIcon';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const { forgotPassword, loading, error, clearError } = authStoreManagements();
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [inputUser, setInputUser] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isResendOtp, setIsResendOtp] = useState(false);
    const [isResetPassword, setIsResetPassword] = useState("");
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({
        hasLowerCase: false,
        hasUpperCase: false,
        hasSpecial: false,
        hasNumber: false,
        hasMinLength: false
    });

    useEffect(() => {
        if (isResendOtp && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanResend(true);
        }
    }, [countdown, isResendOtp]);

    const handleSubmit = async () => {
        const response = await forgotPassword({email}, "sendOtp");
        if(response?.includes("sent")){
            setShowOtpForm(true);
            setIsResendOtp(true);
            toast.success(response, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            })
        }
    };

    const handleInputChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;
        const newInputUser = [...inputUser];
        newInputUser[index] = value.slice(-1);
        setInputUser(newInputUser);
        
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
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

    const handleOtpSubmit = async () => {
        const otpCode = inputUser.join('');
        const response = await forgotPassword({email, otp: otpCode}, "verifyOtp");
        if(response){
            setIsResetPassword(response?.accessToken)
        }
    };

    const handleResendOtp = async () => {
        const response = await forgotPassword({email}, "resendOtp");
        if(response?.includes("sent")){
            setCountdown(60);
            setCanResend(false);
            setInputUser(['', '', '', '', '', '']);
        }
    };

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

    const handlePasswordChange = (value) => {
        setNewPassword(value);
        validatePassword(value);
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            return;
        }        
        const allValid = Object.values(passwordErrors).every(valid => valid);
        if (!allValid) {
            return;
        }

        const response = await forgotPassword({
            accessToken: isResetPassword,
            newPassword: newPassword
        }, "resetPassword");
        
        if (response) {
            navigate("/login")
            clearError();
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-gray-50">
            {!isResetPassword ? (
                <>
                    {!showOtpForm ? (
                        <div className="w-full max-w-2xl mx-auto p-8">
                            <div className="bg-white rounded-lg shadow-sm border p-8">
                                {/* Logo */}
                                <div className="mb-8 flex items-center justify-start">
                                    <img 
                                        src="/logo.png" 
                                        alt="TEKYDOCT Logo" 
                                        className="h-9"
                                    />
                                </div>

                                {/* Header */}
                                <div className="mb-8">
                                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                                        Forgot Password
                                    </h1>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Please enter your registered email to change your requested password.
                                        We will send you a verification code to book a new password.
                                    </p>
                                </div>

                                {/* Form using div */}
                                <div className="space-y-6">
                                    <div className='relative'>
                                        <label htmlFor="email" className="flex text-base font-light text-gray-700 mb-2 items-center justify-start space-x-2 absolute -top-[25%] left-5 bg-white px-2">
                                            <EnvelopeSimpleIcon className=""/>
                                            <span>Email Address</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white duration-300 ease-in-out transition-all hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                                        />
                                    </div>

                                    <div className="w-full flex items-center justify-center">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className={`w-1/2 py-2 px-4 rounded-md font-medium flex items-center justify-center transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white`}
                                        >
                                            {loading ? (
                                                <div className="w-5 h-5">
                                                    <LoadingIcon color="white" />
                                                </div>
                                            ) : "Next"}
                                        </button>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="mt-8 text-center">
                                    <p className="text-xs text-gray-500">
                                        © 2025 TekynDoc Pte. All Rights Reserved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full max-w-2xl mx-auto p-8">
                            <div className="bg-white rounded-lg shadow-sm border p-8">
                                {/* Logo */}
                                <div className="mb-8 flex items-center justify-start">
                                    <img 
                                        src="/logo.png" 
                                        alt="TEKYDOCT Logo" 
                                        className="h-9"
                                    />
                                </div>

                                {/* Header */}
                                <div className="mb-8">
                                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                                        Enter Verification Code
                                    </h1>
                                    <div className="text-xs text-gray-600">
                                        <p>
                                            A verification code has been sent to <span className="font-medium text-gray-900">{email}</span>. 
                                            <button 
                                                className="text-blue-600 hover:text-blue-700 ml-1"
                                                onClick={() => setShowOtpForm(false)}
                                            >
                                                Change
                                            </button>
                                        </p>
                                        <p>Please enter the verification code.</p>
                                    </div>
                                </div>

                                {/* OTP Input */}
                                <div className="mb-6">
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
                                                className={`w-16 h-16 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error === "Invalid OTP" ? "border-red-300" : "border-gray-300"} transition-all duration-200`}
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

                                {/* Verify Button */}
                                <div className="mb-8">
                                    <button
                                        onClick={handleOtpSubmit}
                                        disabled={loading || inputUser.some(digit => !digit)}
                                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white`}
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="w-5 h-5">
                                                    <LoadingIcon color="white" />
                                                </div>
                                                <span className="ml-2">Verifying...</span>
                                            </div>
                                        ) : "Verify"}
                                    </button>
                                </div>

                                {/* Footer */}
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">
                                        © 2025 Tekydoct Sdn. Bhd. All Rights Reserved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="w-full flex items-center justify-center">
                    <div className="w-full max-w-4xl p-8">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            {/* Logo */}
                            <div className="mb-8 flex items-center justify-start">
                                <img 
                                    src="/logo.png" 
                                    alt="TEKYDOCT Logo" 
                                    className="h-9"
                                />
                            </div>

                            {/* Header */}
                            <div className="mb-8">
                                <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Choose a new password
                                </h1>
                                <div className="text-sm text-gray-600">
                                    <p>Please enter your new password.</p>
                                    <p>After resetting your password, please Sign in again with the new password.</p>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Use at</h3>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordErrors.hasLowerCase ? 'bg-green-500' : 'bg-gray-300'}`}>
                                            {passwordErrors.hasLowerCase && (
                                                <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span>One lowercase character</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordErrors.hasSpecial ? 'bg-green-500' : 'bg-gray-300'}`}>
                                            {passwordErrors.hasSpecial && (
                                                <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span>One special character</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordErrors.hasUpperCase ? 'bg-green-500' : 'bg-gray-300'}`}>
                                            {passwordErrors.hasUpperCase && (
                                                <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span>One uppercase character</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordErrors.hasNumber ? 'bg-green-500' : 'bg-gray-300'}`}>
                                            {passwordErrors.hasNumber && (
                                                <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span>One numerical number</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 col-span-2">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordErrors.hasMinLength ? 'bg-green-500' : 'bg-gray-300'}`}>
                                            {passwordErrors.hasMinLength && (
                                                <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span>8 characters minimum</span>
                                    </div>
                                </div>
                            </div>

                            {/* Password Inputs */}
                            <div className="space-y-4 mb-8">
                                {/* New Password */}
                                <div className="relative">
                                    <div className="flex items-center relative">
                                        <svg className="w-5 h-5 text-gray-400 absolute left-3 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Enter Password*"
                                            value={newPassword}
                                            onChange={(e) => handlePasswordChange(e.target.value)}
                                            className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white duration-300 ease-in-out transition-all hover:border-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 z-10"
                                        >
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                {showNewPassword ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                ) : (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                )}
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="relative">
                                    <div className="flex items-center relative">
                                        <svg className="w-5 h-5 text-gray-400 absolute left-3 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Enter Confirm Password*"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`w-full pl-10 pr-12 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white duration-300 ease-in-out transition-all hover:border-blue-500 ${
                                                confirmPassword && newPassword !== confirmPassword 
                                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 z-10"
                                        >
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                {showConfirmPassword ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                ) : (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                )}
                                            </svg>
                                        </button>
                                    </div>
                                    {confirmPassword && newPassword !== confirmPassword && (
                                        <p className="mt-2 text-sm text-red-600">Passwords do not match</p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mb-8">
                                <button
                                    onClick={handleResetPassword}
                                    disabled={loading || !Object.values(passwordErrors).every(valid => valid) || newPassword !== confirmPassword}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5">
                                                <LoadingIcon color="white" />
                                            </div>
                                            <span className="ml-2">Updating...</span>
                                        </div>
                                    ) : "Back to Sign in"}
                                </button>
                            </div>

                            {/* Footer */}
                            <div className="text-center">
                                <p className="text-xs text-gray-500">
                                    © 2025 Tekydoct Sdn. Bhd. All Rights Reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ForgotPassword;