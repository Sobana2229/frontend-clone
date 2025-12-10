import { useState } from 'react';
import { CheckIcon, ArrowDownIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { moduleLeaveAndAttendance } from '../../../../data/dummy';
import { checkPermission } from '../../../../helper/globalHelper';
import authStoreManagements from '../../../store/tdPayroll/auth';

function GuideLeaveAndAttendance({handleConfiguration}) {
    const { user } = authStoreManagements();
    const [expandedSections, setExpandedSections] = useState({
        ["leave-types"]: true,
        attendance: true,
        preferences: true,
        balance: true,
        holiday: true,
        shift: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Filter modules berdasarkan permission
    const getFilteredModules = () => {
        return moduleLeaveAndAttendance.filter(module => {
            if (module.id === 'holiday') {
                return checkPermission(user, "Holidays", "Full Access");
            }
            if (module.id === 'attendance') {
                return checkPermission(user, "Attendance Setting", "Full Access");
            }
            if (module.id === 'leave-types') {
                return checkPermission(user, "Leave Setting", "Full Access");
            }
            return true;
        });
    };

    const filteredModules = getFilteredModules();

    const completedModules = filteredModules.filter(module => module.status === 'completed').length;
    const totalModules = filteredModules.length;

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            <>
                {/* Content wrapper dengan scroll */}
                <div className="flex-1 overflow-y-auto px-4 md:px-8">
                    <div className="max-w-4xl mx-auto py-8">
                        {/* Progress Header */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center items-center mb-4">
                                <div className="flex space-x-1">
                                    {[...Array(totalModules)].map((_, index) => (
                                        <div 
                                            key={index}
                                            className={`w-3 h-1 rounded ${
                                                index < completedModules ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                        ></div>
                                    ))}
                                </div>
                                <span className="ml-3 text-sm text-gray-600">
                                    {completedModules} / {totalModules} Completed
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Setup Leave And Attendance Modules</h1>
                            <p className="text-gray-600">Configure the modules based on your organisational requirements.</p>
                        </div>

                        {/* Modules List */}
                        <div className="space-y-4">
                            {filteredModules.map((module) => (
                                <div key={module.id} className={`bg-white rounded-lg border ${module.status === 'completed' ? 'border-green-200' : 'border-gray-200'} overflow-hidden`}>
                                    {/* Module Header */}
                                    <div className={`p-6 ${module.status === 'completed' ? 'bg-green-50' : ''}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                {module.status === 'completed' ? (
                                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                        <CheckIcon className="w-4 h-4 text-white" />
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => toggleSection(module.id)}
                                                        className="w-6 h-6 flex items-center justify-center"
                                                    >
                                                        {expandedSections[module.id] ? 
                                                            <ArrowDownIcon className="w-4 h-4 text-gray-500" /> :
                                                            <ArrowRightIcon className="w-4 h-4 text-gray-500" />
                                                        }
                                                    </button>
                                                )}
                                                <h3 className="text-lg font-semibold text-gray-800">{module.title}</h3>
                                            </div>
                                            {module.status === 'completed' && (
                                                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                                                    View Details
                                                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Module Content */}
                                    {((expandedSections[module.id] && module.status === 'pending') || (module.status === 'completed')) && module.description && (
                                        <div className="px-6 pb-4">
                                            <p className="text-gray-600 mb-4">{module.description}</p>
                                            {module.buttons && module.status === 'pending' && (
                                                <div className="flex space-x-3">
                                                    {module.buttons.map((button, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleConfiguration(module.id)}
                                                            className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                                                button.type === 'primary' 
                                                                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            {button.text}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer - Sticky */}
                <div className="flex-shrink-0 border-t bg-white px-4 md:px-8 py-4">
                    <div className="max-w-4xl mx-auto text-center flex items-center justify-center space-x-2">
                        <p className="text-gray-600">Are all the above modules not required for your organisation?</p>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                            Disable Leave And Attendance
                        </button>
                    </div>
                </div>
            </>
        </div>
    );
}

export default GuideLeaveAndAttendance;