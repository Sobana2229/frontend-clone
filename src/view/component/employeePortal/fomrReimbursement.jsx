import React, { useEffect, useState } from 'react';
import ButtonReusable from '../buttonReusable';
import employeePortalStoreManagements from '../../../store/tdPayroll/employeePortal';
import { toast } from "react-toastify";
import { CustomToast } from '../customToast';

function FormReimbursementEmployeePortal({handleCancel, data, isUpdate, tempUuid}) {
    const { dataReimbursementEmployee, createReimbursementEmployee, getReimbursementEmployee, loading, modifyReimbursementEmployee } = employeePortalStoreManagements();
    const [formData, setFormData] = useState({
        claimDate: '',
        bills: [
            {
                reimbursementUuid: '',
                billDate: '',
                billNo: '',
                billAmount: 0,
                remarks: '',
                attachments: []
            }
        ]
    });
    const [previewImages, setPreviewImages] = useState([[]]);
    const [deletedFiles, setDeletedFiles] = useState([]);

    useEffect(() => {
        if (data && data.bills) {
            // EDIT MODE - populate dengan multiple bills dari 1 claim
            setFormData({
                claimDate: data.claimDate ? new Date(data.claimDate).toISOString().split('T')[0] : '',
                bills: data.bills.map(bill => ({
                    reimbursementUuid: bill.salaryDetailComponentUuid || '',
                    billDate: bill.billDate ? new Date(bill.billDate).toISOString().split('T')[0] : '',
                    billNo: bill.billNo || '',
                    billAmount: parseFloat(bill.billAmount) || 0,
                    remarks: bill.remarks || '',
                    attachments: []
                }))
            });
            
            // Set preview images untuk setiap bill
            const allPreviews = data.bills.map(bill => {
                if (bill.attachments && bill.attachments.length > 0) {
                    return bill.attachments
                        .filter(attachment => ['.png', '.jpg', '.jpeg', '.gif'].includes(attachment.extension))
                        .map(attachment => ({
                            url: `${import.meta.env.VITE_BASEURL}${attachment.url}`,
                            name: attachment.filename,
                            isExisting: true,
                            serverId: attachment.filename
                        }));
                }
                return [];
            });
            setPreviewImages(allPreviews);
        } else if (data) {
            // FALLBACK: Old single record structure (backward compatibility)
            setFormData({
                claimDate: data.claimDate ? new Date(data.claimDate).toISOString().split('T')[0] : '',
                bills: [{
                    reimbursementUuid: data.salaryDetailComponentUuid || '',
                    billDate: data.billDate ? new Date(data.billDate).toISOString().split('T')[0] : '',
                    billNo: data.billNo || '',
                    billAmount: parseFloat(data.billAmount) || 0,
                    remarks: data.remarks || '',
                    attachments: []
                }]
            });
            
            if (data.attachments && data.attachments.length > 0) {
                const existingPreviews = data.attachments
                    .filter(attachment => ['.png', '.jpg', '.jpeg', '.gif'].includes(attachment.extension))
                    .map(attachment => ({
                        url: `${import.meta.env.VITE_BASEURL}${attachment.url}`,
                        name: attachment.filename,
                        isExisting: true,
                        serverId: attachment.filename
                    }));
                setPreviewImages([existingPreviews]);
            } else {
                setPreviewImages([[]]);
            }
        } else {
            // CREATE MODE - reset to initial state
            setFormData({
                claimDate: '',
                bills: [
                    {
                        reimbursementUuid: '',
                        billDate: '',
                        billNo: '',
                        billAmount: 0,
                        remarks: '',
                        attachments: []
                    }
                ]
            });
            setPreviewImages([[]]);
            setDeletedFiles([]);
        }
    }, [data]);

    const handleClaimDateChange = (e) => {
        setFormData({
            ...formData,
            claimDate: e.target.value
        });
    };

    const handleBillChange = (index, field, value) => {
        const updatedBills = [...formData.bills];
        updatedBills[index][field] = value;
        setFormData({
            ...formData,
            bills: updatedBills
        });
    };

    const handleFileChange = (billIndex, files) => {
        const newFiles = Array.from(files);
        const updatedBills = [...formData.bills];
        
        const existingFiles = updatedBills[billIndex].attachments || [];
        const combinedFiles = [...existingFiles, ...newFiles];
        
        updatedBills[billIndex].attachments = combinedFiles;
        setFormData({
            ...formData,
            bills: updatedBills
        });

        const newPreviewImages = [...previewImages];
        const existingPreviews = newPreviewImages[billIndex] || [];
        
        let loadedCount = 0;
        const newPreviews = [];
        
        newFiles.forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    newPreviews[index] = {
                        file: file,
                        url: e.target.result,
                        name: file.name,
                        isExisting: false
                    };
                    
                    loadedCount++;
                    
                    if (loadedCount === newFiles.filter(f => f.type.startsWith('image/')).length) {
                        const combinedPreviews = [...existingPreviews, ...newPreviews.filter(Boolean)];
                        newPreviewImages[billIndex] = combinedPreviews;
                        setPreviewImages([...newPreviewImages]);
                    }
                };
                reader.readAsDataURL(file);
            } else {
                loadedCount++;
            }
        });

        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs[billIndex].value = '';
    };

    const addBill = () => {
        setFormData({
            ...formData,
            bills: [
                ...formData.bills,
                {
                    reimbursementUuid: '',
                    billDate: '',
                    billNo: '',
                    billAmount: 0,
                    remarks: '',
                    attachments: []
                }
            ]
        });
        setPreviewImages([...previewImages, []]);
    };

    const removeBill = (index) => {
        if (formData.bills.length > 1) {
            const updatedBills = formData.bills.filter((_, i) => i !== index);
            const updatedPreviews = previewImages.filter((_, i) => i !== index);
            
            setFormData({
                ...formData,
                bills: updatedBills
            });
            setPreviewImages(updatedPreviews);
        }
    };

    const removeImage = (billIndex, imageIndex) => {
        const updatedPreviews = [...previewImages];
        const imageToRemove = updatedPreviews[billIndex][imageIndex];
        
        if (imageToRemove.isExisting) {
            setDeletedFiles(prev => [...prev, imageToRemove.serverId]);
        } else {
            const existingImagesCount = updatedPreviews[billIndex].filter(p => p.isExisting).length;
            const updatedBills = [...formData.bills];
            const updatedFiles = [...updatedBills[billIndex].attachments];
            
            const newFileIndex = imageIndex - existingImagesCount;
            if (newFileIndex >= 0) {
                updatedFiles.splice(newFileIndex, 1);
                updatedBills[billIndex].attachments = updatedFiles;
                
                setFormData({
                    ...formData,
                    bills: updatedBills
                });
            }
        }
        
        const newPreviews = [...updatedPreviews[billIndex]];
        newPreviews.splice(imageIndex, 1);
        updatedPreviews[billIndex] = newPreviews;
        setPreviewImages(updatedPreviews);
    };

    const handleSumbit = async (status) => {
        const payload = new FormData();
        const access_token = localStorage.getItem("accessToken");
        
        payload.append('claimDate', formData.claimDate);
        
        // NO recordUuid for parent-child structure
        
        formData.bills.forEach((bill, index) => {
            payload.append(`bills[${index}][reimbursementUuid]`, bill.reimbursementUuid);
            payload.append(`bills[${index}][billDate]`, bill.billDate);
            payload.append(`bills[${index}][billNo]`, bill.billNo);
            payload.append(`bills[${index}][billAmount]`, bill.billAmount);
            payload.append(`bills[${index}][remarks]`, bill.remarks);
            payload.append(`bills[${index}][status]`, status);

            if (bill.attachments && bill.attachments.length > 0) {
                bill.attachments.forEach((file) => {
                    payload.append(`attachments_${index}`, file);
                });
            }
        });

        if (deletedFiles.length > 0) {
            deletedFiles.forEach((filename, index) => {
                payload.append(`deletedFiles[${index}]`, filename);
            });
        }
        
        let response;
        if(isUpdate){
            response = await modifyReimbursementEmployee(access_token, "reimbursement", tempUuid, payload);
        } else {
            response = await createReimbursementEmployee(access_token, payload, "reimbursement");
        }
        
        if(response){
            await getReimbursementEmployee(access_token, 'reimbursementList');
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
            
            setFormData({
                claimDate: '',
                bills: [
                    {
                        reimbursementUuid: '',
                        billDate: '',
                        billNo: '',
                        billAmount: 0,
                        remarks: '',
                        attachments: []
                    }
                ]
            });
            setPreviewImages([[]]);
            setDeletedFiles([]);
            
            handleCancel();
        }
    }

    return (
        <div className="w-full h-full flex-col flex items-start justify-start p-6 bg-white">
            {/* Claim Date */}
            <div className="w-full mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claim Date <span className="text-red-500">*</span>
                </label>
                <input
                    type="date"
                    value={formData.claimDate}
                    onChange={handleClaimDateChange}
                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            {/* Bills Section */}
            <div className="w-full h-[700px] overflow-y-auto pb-5">
                <div className="grid grid-cols-6 gap-4 mb-4 text-sm font-medium text-gray-700">
                    <div>Reimbursement Type <span className="text-red-500">*</span></div>
                    <div>Bill Date</div>
                    <div>Bill No</div>
                    <div>Bill Amount <span className="text-red-500">*</span></div>
                    <div>Remarks</div>
                    <div>Attachments</div>
                </div>

                {formData.bills.map((bill, index) => (
                    <div key={index} className="w-full mb-6 p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-6 gap-4 mb-4">
                            {/* Reimbursement Type */}
                            <div>
                                <select
                                    value={bill.reimbursementUuid}
                                    onChange={(e) => handleBillChange(index, 'reimbursementUuid', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select the Reimbursement</option>
                                    {dataReimbursementEmployee?.SalaryDetailComponents.map((el) => (
                                        <option key={el?.uuid} value={el?.uuid}>{el?.SalaryComponentReimbursement?.nameInPaysl}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Bill Date */}
                            <div>
                                <input
                                    type="date"
                                    value={bill.billDate}
                                    onChange={(e) => handleBillChange(index, 'billDate', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Bill No */}
                            <div>
                                <input
                                    type="text"
                                    value={bill.billNo}
                                    onChange={(e) => handleBillChange(index, 'billNo', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Bill Amount */}
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={bill.billAmount}
                                    onChange={(e) => handleBillChange(index, 'billAmount', parseFloat(e.target.value) || 0)}
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            {/* Remarks */}
                            <div>
                                <input
                                    type="text"
                                    value={bill.remarks}
                                    onChange={(e) => handleBillChange(index, 'remarks', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="-"
                                />
                            </div>

                            {/* Attachments */}
                            <div>
                                <div className="flex items-center">
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(index, e.target.files)}
                                            className="hidden"
                                        />
                                        <div className="flex items-center text-blue-500 hover:text-blue-600">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                            </svg>
                                            Attach files
                                        </div>
                                    </label>
                                    {formData.bills.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeBill(index)}
                                            className="ml-2 text-red-500 hover:text-red-600"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Image Previews */}
                        {previewImages[index] && previewImages[index].length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Image Previews:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {previewImages[index].map((preview, imgIndex) => (
                                        <div key={imgIndex} className="relative">
                                            <img
                                                src={preview.url}
                                                alt={preview.name}
                                                className="w-20 h-20 object-cover rounded-md border border-gray-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index, imgIndex)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                            <p className="text-xs text-gray-500 mt-1 truncate w-20">{preview.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Add Another Bill Button */}
                <button
                    type="button"
                    onClick={addBill}
                    className="flex items-center text-blue-500 hover:text-blue-600 font-medium"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Another bill
                </button>
            </div>

            <div className="w-full flex items-center justify-start space-x-2">
                <ButtonReusable title={"save for approval"} isLoading={loading} action={() => handleSumbit('submitted')} />
                <ButtonReusable title={"save as draft"} isLoading={loading} action={() => handleSumbit("draft")} />
                <ButtonReusable title={"cancel"} isLoading={loading} action={handleCancel} isBLue={false}  />
            </div>
        </div>
    );
}

export default FormReimbursementEmployeePortal;