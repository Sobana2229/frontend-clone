import React, { useState, useEffect, useRef } from 'react';
import { Folder, File, Plus, Trash, DotsThree, FunnelSimple, PencilSimple, X, DownloadSimple } from '@phosphor-icons/react';
import { toast } from 'react-toastify';
import documentStoreManagements from '../../../store/tdPayroll/document';
import { checkPermission } from '../../../../helper/globalHelper';
import authStoreManagements from '../../../store/tdPayroll/auth';

function DocumentPages() {
    const { user } = authStoreManagements();
    const { 
        createFolder, 
        getFolderList, 
        deleteFolder, 
        updateFolder, 
        uploadDocument,
        getDocumentList,
        getAllDocuments,
        deleteDocument,
        folderListOrg, 
        loading, 
        error, 
        clearError 
    } = documentStoreManagements();
    
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);
    const [newFolderName, setNewFolderName] = useState('');
    const [editingFolder, setEditingFolder] = useState(null);
    const [showFolderMenu, setShowFolderMenu] = useState(null);
    const [showDocumentMenu, setShowDocumentMenu] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const menuRef = useRef(null);
    const docMenuRef = useRef(null);
    const [documents, setDocuments] = useState([]);
    const baseUrl = import.meta.env.VITE_BASEURL;

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowFolderMenu(null);
            }
            if (docMenuRef.current && !docMenuRef.current.contains(event.target)) {
                setShowDocumentMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch folder list on mount
    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        getFolderList(access_token, 'org');
    }, []);

    // Fetch documents when folder selected or show all documents
    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        if (selectedFolder) {
            fetchDocuments(access_token, selectedFolder.uuid);
        } else {
            fetchAllDocuments(access_token);
        }
    }, [selectedFolder]);

    // Fetch documents by folder
    const fetchDocuments = async (access_token, folderUuid) => {
        const response = await getDocumentList(access_token, 'org', folderUuid);
        if (response) {
            setDocuments(response.map((doc, index) => ({
                id: index + 1,
                fileName: doc.fileName,
                folderName: selectedFolder.name,
                name: doc.originalName,
                uploadedOn: new Date(doc.uploadedOn).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }),
                filePath: doc.filePath,
                fileSize: doc.fileSize,
                folderUuid: folderUuid
            })));
        }
    };

    // Fetch all documents from all folders
    const fetchAllDocuments = async (access_token) => {
        const response = await getAllDocuments(access_token, 'org');
        if (response) {
            setDocuments(response.map((doc, index) => ({
                id: index + 1,
                fileName: doc.fileName,
                folderName: doc.folderName,
                name: doc.originalName,
                uploadedOn: new Date(doc.uploadedOn).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }),
                filePath: doc.filePath,
                fileSize: doc.fileSize,
                folderUuid: doc.folderUuid
            })));
        }
    };

    // Handle add/edit folder
    const handleSaveFolder = async () => {
        const access_token = localStorage.getItem("accessToken");
        let response;
        
        if (editingFolder) {
            response = await updateFolder({ name: newFolderName }, access_token, 'org', editingFolder.uuid);
        } else {
            response = await createFolder({ name: newFolderName }, access_token, 'org');
        }
        
        if (response) {
            await getFolderList(access_token, 'org');
            
            toast.success(response, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            });
            
            setNewFolderName('');
            setEditingFolder(null);
            setShowFolderModal(false);
        }
    };

    // Handle edit folder click
    const handleEditFolder = (folder) => {
        setEditingFolder(folder);
        setNewFolderName(folder.name);
        setShowFolderModal(true);
        setShowFolderMenu(null);
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadFile(file);
        }
    };

    // Handle upload form submit
    const handleUploadSubmit = async () => {
        if (!uploadFile) {
            toast.error('Please select a file', {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            });
            return;
        }

        if (!selectedFolder) {
            toast.error('Please select a folder', {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            });
            return;
        }

        const access_token = localStorage.getItem("accessToken");
        const formData = new FormData();
        formData.append('file', uploadFile);

        console.log('=== Uploading to folder:', selectedFolder.uuid);
        
        const response = await uploadDocument(formData, access_token, 'org', selectedFolder.uuid);
        
        if (response) {
            toast.success('Document uploaded successfully', {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            });

            // Refresh document list
            await fetchDocuments(access_token, selectedFolder.uuid);
            
            setUploadFile(null);
            setShowUploadModal(false);
        }
    };

    // Handle delete folder
    const handleDeleteFolder = async (folderUuid) => {
        const access_token = localStorage.getItem("accessToken");
        const response = await deleteFolder(access_token, 'org', folderUuid);
        
        if (response) {
            await getFolderList(access_token, 'org');
            
            toast.success(response, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            });
            
            if (selectedFolder?.uuid === folderUuid) {
                setSelectedFolder(null);
            }
        }
        setShowFolderMenu(null);
    };

    // Handle delete document
    const handleDeleteDocument = async (doc) => {
        const access_token = localStorage.getItem("accessToken");
        const folderUuid = selectedFolder ? selectedFolder.uuid : doc.folderUuid;
        const response = await deleteDocument(access_token, 'org', folderUuid, doc.fileName);
        
        if (response) {
            toast.success(response, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            });
            
            // Refresh document list
            if (selectedFolder) {
                await fetchDocuments(access_token, selectedFolder.uuid);
            } else {
                await fetchAllDocuments(access_token);
            }
        }
        setShowDocumentMenu(null);
    };

    // Handle preview file
    const handlePreviewFile = (doc) => {
        setPreviewFile(doc);
        setShowPreviewModal(true);
    };

    // Check if file is image
    const isImageFile = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);
    };

    // Check if file is PDF
    const isPdfFile = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        return ext === 'pdf';
    };

    return (
        <div className="
            w-full flex h-screen 
            bg-gray-td-100
            pt-16
            "
        >
            {checkPermission(user, "Document", "View") ? (
                <>
                    {/* Left Sidebar */}
                    <div className="
                            w-64 bg-gray-td-100 
                            border-r 
                            border-gray-200 p-4">

                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Documents</h2>
                            
                            {/* All Documents Button */}
                            <button
                                onClick={() => setSelectedFolder(null)}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-2 transition-colors ${
                                    !selectedFolder 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <File size={20} weight="duotone" />
                                <span>All Documents</span>
                            </button>
                        </div>

                        {/* Org Folder Section */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Folder size={20} weight="duotone" />
                                    <span className="font-medium">Org Folder</span>
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingFolder(null);
                                        setNewFolderName('');
                                        setShowFolderModal(true);
                                    }}
                                    className="p-1 hover:bg-purple-100 rounded-lg transition-colors"
                                    disabled={loading}
                                >
                                    <Plus size={20} weight="bold" className="text-purple-600" />
                                </button>
                            </div>

                            {/* Folder List */}
                            <div className="space-y-1 ml-2">
                                {folderListOrg?.map(folder => (
                                    <div
                                        key={folder.uuid}
                                        className={`flex items-center justify-between group px-3 py-2 rounded-lg cursor-pointer transition-colors relative ${
                                            selectedFolder?.uuid === folder.uuid
                                                ? 'bg-purple-50 text-purple-600'
                                                : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        <span onClick={() => setSelectedFolder(folder)} className="flex-1">
                                            {folder.name}
                                        </span>
                                        <button
                                            onClick={() => setShowFolderMenu(showFolderMenu === folder.uuid ? null : folder.uuid)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                                        >
                                            <DotsThree size={16} weight="bold" />
                                        </button>

                                        {/* Folder Menu Popup */}
                                        {showFolderMenu === folder.uuid && (
                                            <div 
                                                ref={menuRef}
                                                className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[120px]"
                                            >
                                                <button
                                                    onClick={() => handleEditFolder(folder)}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <PencilSimple size={16} />
                                                    <span>Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteFolder(folder.uuid)}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash size={16} />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-6">
                        <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-800">
                                        {selectedFolder ? selectedFolder.name : 'All Documents'}
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {documents.length} document(s)
                                    </p>
                                </div>
                                {selectedFolder && (
                                    <button
                                        onClick={() => setShowUploadModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        <Plus size={20} weight="bold" />
                                        Add Documents
                                    </button>
                                )}
                            </div>
                            
                            {/* Table */}
                            <div className="flex-1 overflow-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 text-left">
                                                <input type="checkbox" className="rounded" />
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                File Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Folder Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Name
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                                Uploaded On
                                            </th>
                                            <th className="px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {documents.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                                    {selectedFolder ? 'No documents in this folder' : 'No documents available'}
                                                </td>
                                            </tr>
                                        ) : (
                                            documents?.map(doc => (
                                                <tr key={doc.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="px-4 py-3">
                                                        <input type="checkbox" className="rounded" />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div 
                                                            onClick={() => handlePreviewFile(doc)}
                                                            className="flex items-center gap-2 text-sm text-blue-600 hover:underline cursor-pointer"
                                                        >
                                                            <File size={18} />
                                                            {doc.fileName}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{doc.folderName}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{doc.name}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{doc.uploadedOn}</td>
                                                    <td className="px-4 py-3 relative">
                                                        <button 
                                                            onClick={() => setShowDocumentMenu(showDocumentMenu === doc.id ? null : doc.id)}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        >
                                                            <DotsThree size={20} weight="bold" />
                                                        </button>

                                                        {/* Document Menu Popup */}
                                                        {showDocumentMenu === doc.id && (
                                                            <div 
                                                                ref={docMenuRef}
                                                                className="absolute right-8 top-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 min-w-[140px]"
                                                            >
                                                                <button
                                                                    onClick={() => {
                                                                        handlePreviewFile(doc);
                                                                        setShowDocumentMenu(null);
                                                                    }}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                                >
                                                                    <File size={16} />
                                                                    <span>Preview</span>
                                                                </button>
                                                                <a
                                                                    href={`${baseUrl}${doc.filePath}`}
                                                                    download={doc.fileName}
                                                                    onClick={() => setShowDocumentMenu(null)}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                                >
                                                                    <DownloadSimple size={16} />
                                                                    <span>Download</span>
                                                                </a>
                                                                <button
                                                                    onClick={() => handleDeleteDocument(doc)}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                                >
                                                                    <Trash size={16} />
                                                                    <span>Delete</span>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p>No data available</p>
            )}

            {/* Add/Edit Folder Modal */}
            {showFolderModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingFolder ? 'Edit Folder' : 'Add New Folder'}
                        </h3>

                        <div>
                            <input
                                type="text"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                placeholder="Folder name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
                                disabled={loading}
                            />
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowFolderModal(false);
                                        setNewFolderName('');
                                        setEditingFolder(null);
                                        clearError();
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveFolder}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    {loading ? (editingFolder ? 'Updating...' : 'Creating...') : (editingFolder ? 'Update' : 'Add Folder')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload File Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Upload Document</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                File *
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
                            />
                            {uploadFile && (
                                <p className="text-xs text-gray-500 mt-1 mb-4">
                                    Selected: {uploadFile.name}
                                </p>
                            )}

                            <div className="flex gap-2 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowUploadModal(false);
                                        setUploadFile(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUploadSubmit}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
                                    disabled={loading || !uploadFile}
                                >
                                    {loading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {showPreviewModal && previewFile && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{previewFile.fileName}</h3>
                                <p className="text-sm text-gray-500">Uploaded on {previewFile.uploadedOn}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowPreviewModal(false);
                                    setPreviewFile(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto p-4 bg-gray-50">
                            {isImageFile(previewFile.fileName) ? (
                                <div className="flex items-center justify-center h-full">
                                    <img 
                                        src={`${baseUrl}${previewFile.filePath}`}
                                        alt={previewFile.fileName}
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                    />
                                </div>
                            ) : isPdfFile(previewFile.fileName) ? (
                                <iframe
                                    src={`${baseUrl}${previewFile.filePath}`}
                                    className="w-full h-full rounded-lg"
                                    title={previewFile.fileName}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <File size={64} className="mb-4" />
                                    <p className="text-lg mb-2">Preview not available for this file type</p>
                                    <a
                                        href={`${baseUrl}${previewFile.filePath}`}
                                        download={previewFile.fileName}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Download File
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between p-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Size: {(previewFile.fileSize / 1024).toFixed(2)} KB</span>
                            </div>
                            <div className="flex gap-2">
                                <a
                                    href={`${baseUrl}${previewFile.filePath}`}
                                    download={previewFile.fileName}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Download
                                </a>
                                <button
                                    onClick={() => {
                                        setShowPreviewModal(false);
                                        setPreviewFile(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DocumentPages;
