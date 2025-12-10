import { useState, useEffect } from 'react';
import userAndRoleStoreManagements from '../../../../store/tdPayroll/setting/userAndRole';
import { toast } from "react-toastify";
import { CustomToast } from '../../customToast';

function UserForm({ handleCancel, isUpdate, tempData }) {
    const { fetchData, roleData, loading, createData, updateData } = userAndRoleStoreManagements();
    const [formData, setFormData] = useState({
        name: tempData?.name || '',
        email: tempData?.email || '',
        roleUuid: tempData?.roleUuid || ''
    });

    useEffect(() => {
        if (!roleData) {
            const access_token = localStorage.getItem("accessToken");
            fetchData(access_token, "role", {});
        }
    }, []); // only run once

    useEffect(() => {
        if (isUpdate && tempData) {
            setFormData({
                name: tempData.name || '',
                email: tempData.email || '',
                roleUuid: tempData.roleUuid || ''
            });
        }
    }, [isUpdate, tempData]);

    // SUBMIT handler
    const handleSubmit = async () => {
        const access_token = localStorage.getItem("accessToken");
        let response;
        if(isUpdate){
            response = await updateData(formData, access_token, "user", tempData.uuid);
        }else{
            response = await createData(formData, access_token, "user");
        }
        if(response){
            const params = {
                limit: 10, 
                page: 1,
            };
            await fetchData(access_token, "user", params);
            toast(<CustomToast message={response} status="success" />, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                style: {
                    background: "transparent",
                    boxShadow: "none",
                    padding: 0,
                },
            });
            handleCancel();
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-start justify-start bg-gray-50">
            {/* Header */}
            <div className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold text-gray-900">
                        {isUpdate ? 'Edit User' : 'New User'}
                    </h1>
                </div>
                <button
                    onClick={handleCancel}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="max-w-2xl space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder=""
                        />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Email<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder=""
                        />
                    </div>

                    {/* Role Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Role<span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.roleUuid || ''}
                            onChange={(e) => setFormData({ ...formData, roleUuid: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            <option value="">Select</option>
                            {roleData && roleData.map((role) => (
                                <option key={role.uuid} value={role.uuid}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            
            {/* Footer Actions */}
            <div className="sticky bottom-0 w-full bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3 shadow-lg">
                <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                    {isUpdate ? 'Update Role' : 'Create Role'}
                </button>
            </div>
        </div>
    );
}

export default UserForm;
