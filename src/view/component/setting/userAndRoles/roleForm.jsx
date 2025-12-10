import { useState, useEffect } from 'react';
import userAndRoleStoreManagements from '../../../../store/tdPayroll/setting/userAndRole';
import { permissionOrder } from '../../../../../data/dummy';
import { toast } from "react-toastify";
import { CustomToast } from '../../customToast';

function RoleForm({ handleCancel, isUpdate, tempData }) {
  const { fetchData, permissionData, loading, createData, updateData } = userAndRoleStoreManagements();
  const [formData, setFormData] = useState({
    roleName: '',
    description: '',
    selectedPermissions: []
  });
  const [categoryToggle, setCategoryToggle] = useState({});

  useEffect(() => {
    if (!permissionData) {
      const access_token = localStorage.getItem("accessToken");
      fetchData(access_token, "permission");
    }
  }, []);

  useEffect(() => {
    if (isUpdate && tempData) {
      setFormData({
        roleName: tempData.name || '',
        description: tempData.description || '',
        selectedPermissions: Array.isArray(tempData.permissions)
          ? tempData.permissions.map((p) => p.uuid)
          : []
      });
    }
  }, [isUpdate, tempData]);

  useEffect(() => {
    if (permissionData && permissionData.length > 0) {
      const toggleState = {};
      permissionData.forEach(category => {
        toggleState[category.categoryUuid] = false;
      });
      setCategoryToggle(toggleState);
    }
  }, [permissionData]);

  // Group permissions by path (table row)
  const groupPermissionsByPath = (permissions) => {
    const grouped = {};
    permissions.forEach(perm => {
      if (!grouped[perm.permissionPath]) {
        grouped[perm.permissionPath] = [];
      }
      grouped[perm.permissionPath].push(perm);
    });
    return grouped;
  };

  // Urutkan permission names sesuai permissionOrder, sisanya di belakang
  const getUniquePermissionNames = (permissions) => {
    const names = Array.from(new Set(permissions.map(p => p.permissionName)));
    names.sort((a, b) => {
      const ia = permissionOrder.indexOf(a);
      const ib = permissionOrder.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    return names;
  };

  // Toggle kategori: hanya ON/OFF dari switch sendiri
  const handleCategoryToggle = (categoryUuid) => {
    const category = permissionData.find(cat => cat.categoryUuid === categoryUuid);
    if (!category) return;
    const permissionUuids = category.permissions.map(perm => perm.permissionUuid);

    setCategoryToggle(prev => ({
      ...prev,
      [categoryUuid]: !prev[categoryUuid]
    }));

    setFormData(prev => ({
      ...prev,
      selectedPermissions: !categoryToggle[categoryUuid]
        // ON: check semua permission di kategori
        ? Array.from(new Set([...prev.selectedPermissions, ...permissionUuids]))
        // OFF: uncheck semua permission di kategori
        : prev.selectedPermissions.filter(uuid => !permissionUuids.includes(uuid))
    }));
  };

  // Handle checkbox individual - FIXED: Full Access hanya check permission di path yang sama
  const handlePermissionChange = (permissionUuid, permissionName, category, permissionPath) => {
    setFormData(prev => {
      const isSelected = prev.selectedPermissions.includes(permissionUuid);
      let newSelected = [...prev.selectedPermissions];

      if (permissionName === "Full Access") {
        // Full Access: hanya select/unselect permission yang punya permissionPath yang sama
        const pathPermissions = category.permissions
          .filter(perm => perm.permissionPath === permissionPath)
          .map(perm => perm.permissionUuid);

        if (isSelected) {
          // Uncheck: hapus semua permission di path ini
          newSelected = newSelected.filter(uuid => !pathPermissions.includes(uuid));
        } else {
          // Check: tambahkan semua permission di path ini
          newSelected = Array.from(new Set([...newSelected, ...pathPermissions]));
        }
      } else {
        // Normal toggle untuk checkbox individual
        if (isSelected) {
          newSelected = newSelected.filter(uuid => uuid !== permissionUuid);
        } else {
          newSelected.push(permissionUuid);
        }
      }

      return {
        ...prev,
        selectedPermissions: newSelected
      };
    });
  };

  const handleRoleNameChange = (e) => {
    setFormData(prev => ({
      ...prev,
      roleName: e.target.value
    }));
  };

  const handleDescriptionChange = (e) => {
    setFormData(prev => ({
      ...prev,
      description: e.target.value
    }));
  };

  // SUBMIT handler
  const handleSubmit = async () => {
    const access_token = localStorage.getItem("accessToken");
    let response;
    if (isUpdate) {
      response = await updateData(formData, access_token, "role", tempData.uuid);
    } else {
      response = await createData(formData, access_token, "role");
    }
    if (response) {
      const params = {
        limit: 10,
        page: 1,
      };
      await fetchData(access_token, "role", params);
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

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">Loading permissions...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-start justify-start bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-900">
            {isUpdate ? 'Edit Role' : 'New Role'}
          </h1>
        </div>
        <button
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="w-full flex-1 overflow-y-auto px-6 py-6">
        {/* Role Name */}
        <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Role Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.roleName}
            onChange={handleRoleNameChange}
            placeholder="Enter role name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Description */}
        <div className="mb-8 bg-white p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Max 500 Characters"
            maxLength={500}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/500 characters
          </p>
        </div>
        {/* Permission Categories */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Permission Categories
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Choose what this role can access or manage.
          </p>
          {permissionData && permissionData.length > 0 ? (
            <div className="space-y-4">
              {permissionData.map(category => {
                const groupedPermissions = groupPermissionsByPath(category.permissions);
                const uniquePermissionNames = getUniquePermissionNames(category.permissions);
                return (
                  <div key={category.categoryUuid} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    {/* Category Header */}
                    <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {category.categoryName}
                      </h3>
                      {/* <button
                        onClick={() => handleCategoryToggle(category.categoryUuid)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          categoryToggle[category.categoryUuid] ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            categoryToggle[category.categoryUuid] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button> */}
                    </div>
                    {/* Permissions Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                              Path
                            </th>
                            {uniquePermissionNames.map(permName => (
                              <th
                                key={permName}
                                className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap"
                              >
                                {permName}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(groupedPermissions)
                            .filter(([path]) => !(path === "Reimbursement Summary" || path === "Employee Organisation"))
                            .map(([path, perms]) => (
                              <tr key={path} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                                  {path === "Reimbursement And FBP Settings" ? "Reimbursement" :
                                    path === "Attendance Setting" ? "Attendance" :
                                    path === "Leave Setting" ? "Leave" 
                                    : path}
                                </td>
                                {uniquePermissionNames.map(permName => {
                                  const permission = perms.find(p => p.permissionName === permName);
                                  const isChecked = permission
                                    ? formData.selectedPermissions.includes(permission.permissionUuid)
                                    : false;
                                  return (
                                    <td
                                      key={`${path}-${permName}`}
                                      className="px-4 py-3 text-center"
                                    >
                                      {permission ? (
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={() => handlePermissionChange(
                                            permission.permissionUuid,
                                            permission.permissionName,
                                            category,
                                            permission.permissionPath
                                          )}
                                          className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                                        />
                                      ) : (
                                        <span className="text-gray-300">-</span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-sm bg-white p-4 rounded-lg border border-gray-200">
              No permissions available
            </p>
          )}
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

export default RoleForm;
