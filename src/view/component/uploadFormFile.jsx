import React, { useState, useRef } from 'react';
import { ArrowDownIcon, UploadIcon, FileIcon, XIcon } from '@phosphor-icons/react';
import organizationStoreManagements from '../../store/tdPayroll/setting/organization';
import { toast } from "react-toastify";
import leaveAndAttendanceStoreManagements from '../../store/tdPayroll/setting/leaveAndAttendance';

function UploadFormFile({handleShowForm, sampleFile}) {
  const { uploadFileOrganization, loading: loadingOrganization, fetchOrganizationSetting, createOrganizationSetting } = organizationStoreManagements();
  const { uploadFileLeaveAndAttendance, loading: loadingLeaveAndAttendance, fetchLeaveAndAttendance } = leaveAndAttendanceStoreManagements();
  const [formData, setFormData] = useState({
    file: null,
    characterEncoding: 'UTF-8 (Unicode)',
    fileName: ''
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file) {
      const allowedTypes = ['.csv', '.tsv', '.xls', '.xlsx'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (allowedTypes.includes(fileExtension)) {
        setFormData(prev => ({
          ...prev,
          file: file,
          fileName: file.name
        }));
      } else {
        alert('Please select a CSV, TSV, XLS, or XLSX file.');
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleEncodingChange = (e) => {
    setFormData(prev => ({
      ...prev,
      characterEncoding: e.target.value
    }));
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null,
      fileName: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!formData.file) return;
    const formDataObj = new FormData();
    formDataObj.append('file', formData.file);
    formDataObj.append('characterEncoding', formData.characterEncoding);
    formDataObj.append('fileName', formData.fileName);
    const access_token = localStorage.getItem("accessToken");
    let response;
    if(sampleFile === "holiday"){
      response = await uploadFileLeaveAndAttendance(formDataObj, access_token, sampleFile);
    } else {
      response = await uploadFileOrganization(formDataObj, access_token, sampleFile);
    }
    if(response){
      toast.success(response, {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
        theme: "colored"
      })
      setFormData({
        file: null,
        characterEncoding: 'UTF-8 (Unicode)',
        fileName: ''
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if(sampleFile === "holiday"){
        await fetchLeaveAndAttendance(access_token, sampleFile, 1);
      }else{
        await fetchOrganizationSetting(sampleFile, access_token, true);
      }
      handleShowForm();
    }
  };

  const handleCancel = () => {
    setFormData({
      file: null,
      characterEncoding: 'UTF-8 (Unicode)',
      fileName: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    handleShowForm();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-fit bg-white ${sampleFile == "work-location" && "p-5 rounded-md"}`}>
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          Download a{" "}
          <a 
            href={`/sample/${sampleFile === "designation" ? "sample_designation.csv" 
              : sampleFile === "departement" ? "sample_department.csv" 
              : sampleFile === "work-location" ? "sample_work_location.csv" 
              : sampleFile === "holiday" ? "sample_holidays.csv" : "invalid_sample"}`}
            download 
            className="text-blue-600 underline cursor-pointer"
          >
            sample file
          </a>{" "}
          and compare it with your import file to ensure that the file is ready to import.
        </p>
        
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : formData.file 
              ? 'border-green-400 bg-green-50' 
              : 'border-gray-300 bg-gray-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.tsv,.xls,.xlsx"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          {formData.file ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <FileIcon size={48} className="text-green-600" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">{formData.fileName}</p>
                <p className="text-xs text-gray-500">{formatFileSize(formData.file.size)}</p>
              </div>
              <button
                onClick={handleRemoveFile}
                className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                disabled={loadingLeaveAndAttendance || loadingOrganization}
              >
                <XIcon size={16} />
                Remove file
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <UploadIcon size={48} className="text-gray-400" />
              </div>
              <div className="space-y-2">
                <p className="text-base font-medium text-gray-700">
                  Drop files here or click here to upload
                </p>
                <p className="text-sm text-gray-500">
                  Maximum File Size: 5 MB | File Format: CSV or TSV or XLS
                </p>
              </div>
              <button
                onClick={handleClickUpload}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                // disabled={loadingLeaveAndAttendance || loadingOrganization}
              >
                Choose File
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Character Encoding */}
      {/* <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Character Encoding*
        </label>
        <div className="relative">
          <select
            value={formData.characterEncoding}
            onChange={handleEncodingChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            disabled={loading}
          >
            <option value="UTF-8 (Unicode)">UTF-8 (Unicode)</option>
            <option value="ASCII">ASCII</option>
            <option value="ISO-8859-1">ISO-8859-1</option>
            <option value="Windows-1252">Windows-1252</option>
          </select>
          <ArrowDownIcon 
            size={16} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
          />
        </div>
      </div> */}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="w-fit flex space-x-2 items-center">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
            disabled={loadingLeaveAndAttendance || loadingOrganization}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!formData.file || loadingLeaveAndAttendance || loadingOrganization}
          >
            {(loadingLeaveAndAttendance || loadingOrganization) ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm text-red-500">* indicates mandatory fields</span>
        </div>
      </div>
    </div>    
  );
}

export default UploadFormFile;