import { useState } from "react";
import authStoreManagements from "../../../store/tdPayroll/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { EnvelopeSimpleIcon, Eye, EyeSlash, Key, LockIcon } from "@phosphor-icons/react"

function LoginPages() {
    const navigate = useNavigate();
    const { login, error, clearError } = authStoreManagements();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [hidePassword, setHidePassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        const response = await login(formData)
        if(response === "user found"){
            setShowPassword(true);
        } else if(response){
            toast.success(response, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            })
            navigate("/")
            clearError();
        }
    };

    const togglePasswordVisibility = () => {
        setHidePassword(!hidePassword);
    };

    return (
        <div className="w-full h-screen bg-white flex py-5 px-4 lg:px-0">
            {/* Left Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center relative">
                <div className="w-full max-w-xl space-y-8 px-4 lg:px-0">
                    {/* Logo */}
                    <div className="flex justify-start">
                        <img 
                            src="/logo.png" 
                            alt="Tekydoct Logo" 
                            className="w-[35%]"
                        />
                    </div>
                    
                    {/* Welcome Back Text */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-medium text-gray-900 mb-2">
                            Welcome Back!
                        </h1>
                        <p className="text-gray-600 text-sm font-light tracking-widest">
                            continue to your company's workspace.
                        </p>
                    </div>
                    
                    {/* Login Form */}
                    <div className="space-y-6">
                        <div className="relative">
                            <label htmlFor="email" className="flex text-base font-light text-gray-700 mb-2 items-center justify-start space-x-2 absolute -top-[17%] left-5 bg-white px-2">
                                <EnvelopeSimpleIcon className=""/>
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
                            <div className={`flex items-center ${(String(error)?.includes("email") || String(error)?.includes("not found")) ? "justify-between" : "justify-end"} mt-1`}>
                                {String(error)?.includes("email") && (
                                    <span className="text-xs text-red-500">{error}</span>
                                )}
                                {String(error)?.includes("not found") && (
                                    <span className="text-xs text-red-500">This account cannot be found. please use a different account or <Link to="/register" className="text-blue-500">sign up</Link> for a new account.</span>
                                )}
                                {showPassword && (
                                    <button onClick={() => {
                                        setShowPassword(false);
                                        setFormData(prev => ({
                                            ...prev,
                                            email: ""
                                        }));
                                        clearError();
                                    }} className="text-blue-600 text-sm hover:underline">
                                        Change
                                    </button>
                                )}
                            </div>
                        </div>
                        {showPassword && (
                            <div className="relative">
                               <label htmlFor="email" className="flex text-base font-light text-gray-700 mb-2 items-center justify-start space-x-2 absolute -top-[17%] left-5 bg-white px-2 z-20">
                                    <Key className=""/>
                                    <span>Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={hidePassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white duration-300 ease-in-out transition-all hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
                                    >
                                        {hidePassword ? (
                                            <EyeSlash size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                                <div className={`flex items-center ${String(error)?.includes("password") ? "justify-between" : "justify-end"} mt-1`}>
                                    {String(error)?.includes("password") && (
                                        <span className="text-xs text-red-500">{error}</span>
                                    )}
                                    <Link to="/forgot-password" className="text-blue-600 text-sm hover:underline">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>
                        )}
                        
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Register Link */}
                    <div className="text-center mt-6">
                        <span className="text-gray-600 text-sm">
                            Don't have a Tekydoct account?{" "}
                        </span>
                        <Link to="/register" className="text-blue-600 hover:underline text-sm font-medium">
                            Sign up now
                        </Link>
                    </div>
                </div>
                {/* Footer */}
                <div className="absolute bottom-10 w-full text-center">
                    <p className="text-base font-light text-gray-500">
                        © 2025, Tekydoct Sdn. Bhd. All Rights Reserved.
                    </p>
                </div>
            </div>
            
            {/* Right Side - Banner */}
            <div className="hidden lg:block w-1/2 relative">
                <img 
                    src="/bannerAuth.png" 
                    alt="Login Banner" 
                    className="absolute right-5 top-0 w-full h-full object-contain rounded-[5%] overflow-hidden"
                />
            </div>
        </div>
    );
}

export default LoginPages;