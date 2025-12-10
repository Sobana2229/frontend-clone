import { useEffect, useState } from "react";
import HeaderReusable from "../../../component/setting/headerReusable";
import organizationStoreManagements from "../../../../store/tdPayroll/setting/organization";
import { toast } from "react-toastify";
import { checkPermission } from "../../../../../helper/globalHelper";
import authStoreManagements from "../../../../store/tdPayroll/auth";

function EmployeePortalComponents() {
    const { isEnabledWebPortal, isEnabledSelfInput, fetchOrganizationSetting, createOrganizationSetting, isEnabledCheckInOut } = organizationStoreManagements();
    const [isPortalEnabled, setIsPortalEnabled] = useState(false);
    const [isSelfServiceInput, setIsSelfServiceInput] = useState(false);
    const { user } = authStoreManagements();
    const [isCheckInOutEnabled, setIsCheckInOutEnabled] = useState(false);

    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        fetchOrganizationSetting("check-in-out", access_token, true);
    }, []);

    useEffect(() => {
        setIsCheckInOutEnabled(isEnabledCheckInOut);
    }, [isEnabledCheckInOut]);


    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        fetchOrganizationSetting("employee-portal", access_token, true);
    }, []);

    useEffect(() => {
        setIsPortalEnabled(isEnabledWebPortal);
    }, [isEnabledWebPortal]);

    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        fetchOrganizationSetting("self-input", access_token, true);
    }, []);

    useEffect(() => {
        setIsSelfServiceInput(isEnabledSelfInput);
    }, [isEnabledSelfInput]);

    const handleToggleWebPortal = async () => {
        const newValue = !isPortalEnabled;
        setIsPortalEnabled(newValue);
        const access_token = localStorage.getItem("accessToken");
        const response = await createOrganizationSetting(
            { isEnable: newValue }, 
            "employee-portal", 
            access_token
        );
                
        if (response) {
            await fetchOrganizationSetting("employee-portal", access_token, true);
            toast.success(response, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            })
        } 
    };

    const handleToggleSelfServiceInput = async () => {
        const newValue = !isSelfServiceInput;
        setIsSelfServiceInput(newValue);
        const access_token = localStorage.getItem("accessToken");
        const response = await createOrganizationSetting(
            { isEnable: newValue }, 
            "self-input", 
            access_token
        );
                
        if (response) {
            await fetchOrganizationSetting("self-input", access_token, true);
            toast.success(response, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            })
        } 
    };

    const handleToggleCheckInOut = async () => {
        const newValue = !isCheckInOutEnabled;
        setIsCheckInOutEnabled(newValue);
        const access_token = localStorage.getItem("accessToken");
        const response = await createOrganizationSetting(
            { isEnable: newValue }, 
            "check-in-out", 
            access_token
        );
            
        if (response) {
            await fetchOrganizationSetting("check-in-out", access_token, true);
            toast.success(response, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            })
        } 
    };

    return (
        <div className="w-full h-full flex-col flex items-start justify-start">
            <HeaderReusable title="Employee Portal" />

            {checkPermission(user, "Provide Access Protected", "Full Access") ? (
                <div className="w-full p-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        {/* Toggle Setting Item */}
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-base font-medium text-gray-900">
                                        Enable Portal Access
                                    </h3>
                                    {isPortalEnabled && (
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                            ACTIVE
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                                    The Employee portal allows your employees to access their salary information and perform payroll related 
                                    activities like declaring their Flexible Benefit Plan (FBP) and submitting investment proofs for approval.
                                </p>
                            </div>

                            {/* Custom Toggle Switch */}
                            <div className="flex-shrink-0 ml-6">
                                <button
                                    onClick={handleToggleWebPortal}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isPortalEnabled 
                                            ? 'bg-blue-600 hover:bg-blue-700' 
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-pressed={isPortalEnabled}
                                    aria-label={`${isPortalEnabled ? 'Disable' : 'Enable'} portal access`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                                            isPortalEnabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Employee Self-Service Input */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-base font-medium text-gray-900">
                                            Employee Self-Service Input
                                        </h3>
                                        {isEnabledSelfInput && (
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                            ENABLED
                                        </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                                        Allow employees to update their own personal and employment details
                                        (e.g., contact info, bank account, tax ID). This helps reduce manual
                                        admin work and ensures employee records are always up to date.
                                    </p>
                                </div>

                                {/* Custom Toggle Switch */}
                                <div className="flex-shrink-0 ml-6">
                                    <button
                                        onClick={handleToggleSelfServiceInput}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isSelfServiceInput
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-gray-300 hover:bg-gray-400"
                                        }`}
                                        aria-pressed={isSelfServiceInput}
                                        aria-label={`${
                                            isSelfServiceInput ? "Disable" : "Enable"
                                        } self-service input`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                                                isSelfServiceInput ? "translate-x-6" : "translate-x-1"
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Employee Check In/Out Access */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-base font-medium text-gray-900">
                                            Employee Check In/Out Access
                                        </h3>
                                        {isCheckInOutEnabled && (
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                            ENABLED
                                        </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                                        Enable this option to allow employees to record their attendance through the Employee Self-Service Portal. When enabled, the Check In/Out button will appear in their dashboard.
                                    </p>
                                </div>

                                {/* Custom Toggle Switch */}
                                <div className="flex-shrink-0 ml-6">
                                     <button
                                        onClick={handleToggleCheckInOut}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                        isCheckInOutEnabled
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-gray-300 hover:bg-gray-400"
                                        }`}
                                        aria-pressed={isCheckInOutEnabled}
                                        aria-label={`${
                                            isCheckInOutEnabled ? "Disable" : "Enable"
                                        } check-in/out access`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                                                isCheckInOutEnabled ? "translate-x-6" : "translate-x-1"
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Section */}
                        {isPortalEnabled && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="text-sm font-medium text-blue-800">Portal Access Enabled</h4>
                                            <p className="mt-1 text-sm text-blue-700">
                                                Employees can now access their portal to view salary information and manage benefits.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p>No data available</p>
            )}

        </div>
    );
}

export default EmployeePortalComponents;