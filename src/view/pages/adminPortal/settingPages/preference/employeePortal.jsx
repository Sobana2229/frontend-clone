import { useState } from "react";
import { EnvelopeSimple, Eye, Gear } from "@phosphor-icons/react";
import HeaderReusable from "../../../../component/setting/headerReusable";

function EmployeePortal() {
    const [portalAccess, setPortalAccess] = useState(true);
    const [showDocuments, setShowDocuments] = useState(false);
    
    return (
        <div className="w-full h-full flex flex-col items-start justify-start overflow-y-auto relative">
            <div className="w-full h-14 absolute top-0 left-0">
                <HeaderReusable title="Employee Portal" />
            </div>
            <div className="w-full h-full max-w-3xl p-6 space-y-20 pt-20">
                {/* Portal Access Section */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-normal">Enable Portal Access</h2>
                            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">ACTIVE</span>
                        </div>
                        {/* Toggle */}
                        <div
                            onClick={() => setPortalAccess(!portalAccess)}
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                                portalAccess ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                        >
                            <div
                                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                                    portalAccess ? 'translate-x-6' : 'translate-x-0'
                                }`}
                            ></div>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm font-light">
                        The employee portal allows your employees to access their salary information and 
                        perform payroll related activities like declaring their Flexible Benefit Plan (FBP) and 
                        submitting investment proofs for approval.
                    </p>
                </div>
                
                {/* Document Management */}
                <div className="space-y-2">
                    <h2 className="text-base font-normal">Document Management</h2>
                    <div className="flex items-start gap-2">
                        <input 
                            type="checkbox" 
                            className="mt-1"
                            checked={showDocuments}
                            onChange={() => setShowDocuments(!showDocuments)}
                        />
                        <div>
                            <div className="text-sm font-normal">Show documents in employee portal</div>
                            <div className="text-gray-600 text-sm font-light">Enable this option to make documents visible for employees to access in the employee portal.</div>
                        </div>
                    </div>
                </div>
                
                {/* Portal Contact Information */}
                <div className="space-y-2">
                    <h2 className="text-base font-normal">Portal Contact Information</h2>
                    <p className="text-gray-600 text-sm font-normal">
                        This is the email address to which your employees can send queries through the portal.
                    </p>
                    <div className="border rounded-md p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-500">
                                <EnvelopeSimple className="text-lg" />
                            </div>
                            <div>
                                <div className="font-medium">Aalijlal Ganteng</div>
                                <div className="text-gray-600">aalijlal.ganteng@gmail.com</div>
                            </div>
                        </div>
                        <button className="text-blue-500 font-medium text-sm flex items-center justify-center space-x-2">
                            <Gear />
                            <p>Manage Contacts</p>
                        </button>
                    </div>
                </div>
                
                {/* Banner Message */}
                <div className="space-y-10 pb-10">
                    <div className="w-full flex flex-col space-y-2">
                        <h2 className="text-base font-normal">Banner Message</h2>
                        <p className="text-gray-600 text-sm font-light">
                            Send important notifications or announcements to your employees using this 
                            space. The message you enter here will be displayed at the top of the Home 
                            page in the Employee Self-service Portal. 
                            <span className="flex items-center gap-1 text-blue-500 cursor-pointer mt-1">
                                <Eye className="text-base" />
                                <span>View Sample Preview</span>
                            </span>
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-light">Enter Banner Message</label>
                            <textarea 
                                className="w-full border rounded-md p-3 min-h-24"
                                placeholder="Type your message here..."
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-light">Select till when this message must be displayed in the portal</label>
                            <input 
                                type="text" 
                                className="w-full border rounded-md p-3"
                                placeholder="dd/MM/yyyy"
                            />
                        </div>
                        
                    </div>

                    <div>
                        <button className="bg-blue-500 text-white px-6 py-2 rounded-md flex items-center gap-2">
                            <span>Save</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeePortal;