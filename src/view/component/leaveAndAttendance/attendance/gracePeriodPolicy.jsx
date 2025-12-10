import { useState } from 'react';
import { allLeaveTypesAttendace } from '../../../../../data/dummy';

function GracePeriodPolicy({formData, setFormData, handleToggleChange}) {
    const [expandedRules, setExpandedRules] = useState({});
    const addNewRule = () => {
        const newRule = {
            id: Date.now(),
            deviationType: 'more-than',
            deviationCount: 0,
            timePeriod: 'week',
            multipleValue: 1,
            multiplePeriod: 'month',
            deductDays: 0.5,
            leaveTypes: [''],
            deviationConditions: {
                lateCheckIn: { enabled: false, time: '' },
                earlyCheckOut: { enabled: false, time: '' },
                lessWorkingHours: { enabled: false, time: '' },
                lessCoreHours: { enabled: false, time: '' }
            }
        };
        setFormData(prev => ({
            ...prev,
            gracePeriodRules: [...(prev.gracePeriodRules || []), newRule]
        }));
        setExpandedRules(prev => ({
            ...prev,
            [newRule.id]: true
        }));
    };

    const updateRule = (ruleId, field, value) => {
        setFormData(prev => ({
            ...prev,
            gracePeriodRules: prev.gracePeriodRules.map(rule =>
                rule.id === ruleId ? { ...rule, [field]: value } : rule
            )
        }));
    };

    const updateDeviationCondition = (ruleId, conditionType, field, value) => {
        setFormData(prev => ({
            ...prev,
            gracePeriodRules: prev.gracePeriodRules.map(rule =>
                rule.id === ruleId 
                    ? {
                        ...rule,
                        deviationConditions: {
                            ...rule.deviationConditions,
                            [conditionType]: {
                                ...rule.deviationConditions[conditionType],
                                [field]: value
                            }
                        }
                    }
                    : rule
            )
        }));
    };

    const toggleExpandRule = (ruleId) => {
        setExpandedRules(prev => ({
            ...prev,
            [ruleId]: !prev[ruleId]
        }));
    };

    const removeRule = (ruleId) => {
        setFormData(prev => ({
            ...prev,
            gracePeriodRules: prev.gracePeriodRules.filter(rule => rule.id !== ruleId)
        }));
        setExpandedRules(prev => {
            const newExpanded = { ...prev };
            delete newExpanded[ruleId];
            return newExpanded;
        });
    };

    const addLeaveType = (ruleId) => {
        const rule = formData.gracePeriodRules?.find(r => r.id === ruleId);
        if (!rule) return;
        
        const availableTypes = allLeaveTypesAttendace.filter(type => !rule.leaveTypes.includes(type));
        
        if (availableTypes.length > 0) {
            setFormData(prev => ({
                ...prev,
                gracePeriodRules: prev.gracePeriodRules.map(rule =>
                    rule.id === ruleId 
                        ? { ...rule, leaveTypes: [...rule.leaveTypes, availableTypes[0]] }
                        : rule
                )
            }));
        }
    };

    const removeLeaveType = (ruleId, leaveIndex) => {
        setFormData(prev => ({
            ...prev,
            gracePeriodRules: prev.gracePeriodRules.map(rule =>
                rule.id === ruleId 
                    ? { ...rule, leaveTypes: rule.leaveTypes.filter((_, i) => i !== leaveIndex) }
                    : rule
            )
        }));
    };

    const updateLeaveType = (ruleId, leaveIndex, value) => {
        setFormData(prev => ({
            ...prev,
            gracePeriodRules: prev.gracePeriodRules.map(rule =>
                rule.id === ruleId 
                    ? { 
                        ...rule, 
                        leaveTypes: rule.leaveTypes.map((type, i) => i === leaveIndex ? value : type)
                    }
                    : rule
            )
        }));
    };

    const getAvailableLeaveTypes = (ruleId, currentLeaveIndex) => {
        const rule = formData.gracePeriodRules?.find(r => r.id === ruleId);
        if (!rule) return allLeaveTypesAttendace;
        
        const selectedTypes = rule.leaveTypes.filter((_, i) => i !== currentLeaveIndex);
        return allLeaveTypesAttendace.filter(type => !selectedTypes.includes(type));
    };

    const safeGracePeriodRules = formData.gracePeriodRules || [];

    return (
        <div className="border-t pt-6">
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Grace period policy</h3>
                </div>
                
                <div className="flex items-center space-x-3">
                    <button
                        type="button"
                        onClick={() => handleToggleChange('gracePeriodPolicy')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            formData.gracePeriodPolicy ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                formData.gracePeriodPolicy ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                    <span className={`text-sm font-medium px-2 py-1 rounded`}>
                        Grace period policy
                    </span>
                </div>

                {/* Grace Period Rules Content */}
                {formData.gracePeriodPolicy && (
                    <div className="space-y-4 mt-6">
                        {safeGracePeriodRules.map((rule, index) => (
                            <div key={rule.id} className="bg-white border border-gray-200 rounded-lg">
                                {/* Rule Header */}
                                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => toggleExpandRule(rule.id)}
                                        className="flex items-center space-x-2 text-sm font-medium text-gray-900"
                                    >
                                        <span>Rule {index + 1}</span>
                                        <svg
                                            className={`w-4 h-4 transition-transform ${expandedRules[rule.id] ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleExpandRule(rule.id)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={expandedRules[rule.id] ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeRule(rule.id)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Rule Content */}
                                {(expandedRules[rule.id] !== false) && (
                                    <div className="p-4 space-y-6">
                                        {/* Consider as deviation when section (at top) */}
                                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                            <h4 className="text-sm font-medium text-gray-900">Consider as deviation when</h4>
                                            
                                            {/* First check-in is late by */}
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    checked={rule.deviationConditions?.lateCheckIn?.enabled || false}
                                                    onChange={(e) => updateDeviationCondition(rule.id, 'lateCheckIn', 'enabled', e.target.checked)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <span className="text-sm text-gray-700 w-44">First check-in is late by</span>
                                                <input
                                                    type="time"
                                                    placeholder="HH:mm"
                                                    value={rule.deviationConditions?.lateCheckIn?.time || ''}
                                                    onChange={(e) => updateDeviationCondition(rule.id, 'lateCheckIn', 'time', e.target.value)}
                                                    className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-center bg-white"
                                                    disabled={!rule.deviationConditions?.lateCheckIn?.enabled}
                                                />
                                                <span className="text-sm text-gray-700">hours</span>
                                            </label>

                                            {/* Last check-out is early by */}
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    checked={rule.deviationConditions?.earlyCheckOut?.enabled || false}
                                                    onChange={(e) => updateDeviationCondition(rule.id, 'earlyCheckOut', 'enabled', e.target.checked)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <span className="text-sm text-gray-700 w-44">Last check-out is early by</span>
                                                <input
                                                    type="time"
                                                    placeholder="HH:mm"
                                                    value={rule.deviationConditions?.earlyCheckOut?.time || ''}
                                                    onChange={(e) => updateDeviationCondition(rule.id, 'earlyCheckOut', 'time', e.target.value)}
                                                    className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-center bg-white"
                                                    disabled={!rule.deviationConditions?.earlyCheckOut?.enabled}
                                                />
                                                <span className="text-sm text-gray-700">hours</span>
                                            </label>

                                            {/* Working hours are less by */}
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    checked={rule.deviationConditions?.lessWorkingHours?.enabled || false}
                                                    onChange={(e) => updateDeviationCondition(rule.id, 'lessWorkingHours', 'enabled', e.target.checked)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <span className="text-sm text-gray-700 w-44">Working hours are less by</span>
                                                <input
                                                    type="time"
                                                    placeholder="HH:mm"
                                                    value={rule.deviationConditions?.lessWorkingHours?.time || ''}
                                                    onChange={(e) => updateDeviationCondition(rule.id, 'lessWorkingHours', 'time', e.target.value)}
                                                    className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-center bg-white"
                                                    disabled={!rule.deviationConditions?.lessWorkingHours?.enabled}
                                                />
                                                <span className="text-sm text-gray-700">hours</span>
                                            </label>

                                            {/* Core Working hours are less by */}
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    checked={rule.deviationConditions?.lessCoreHours?.enabled || false}
                                                    onChange={(e) => updateDeviationCondition(rule.id, 'lessCoreHours', 'enabled', e.target.checked)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <span className="text-sm text-gray-700 w-44">Core Working hours are less by</span>
                                                <input
                                                    type="time"
                                                    placeholder="HH:mm"
                                                    value={rule.deviationConditions?.lessCoreHours?.time || ''}
                                                    onChange={(e) => updateDeviationCondition(rule.id, 'lessCoreHours', 'time', e.target.value)}
                                                    className="w-24 px-2 py-1 border border-gray-300 rounded text-sm text-center bg-white"
                                                    disabled={!rule.deviationConditions?.lessCoreHours?.enabled}
                                                />
                                                <span className="text-sm text-gray-700">hours</span>
                                            </label>
                                        </div>

                                        {/* When number deviations section */}
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-medium text-gray-900">When number deviations is more than</h4>
                                            
                                            {/* Main deviation section with blue background */}
                                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-4">
                                                {/* Deviations are more than */}
                                                <label className="flex items-center space-x-3">
                                                    <input
                                                        type="radio"
                                                        name={`deviationType-${rule.id}`}
                                                        checked={rule.deviationType === 'more-than'}
                                                        onChange={() => updateRule(rule.id, 'deviationType', 'more-than')}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <span className="text-sm text-gray-900">Deviations are more than</span>
                                                    <input
                                                        type="number"
                                                        value={rule.deviationCount || 0}
                                                        onChange={(e) => updateRule(rule.id, 'deviationCount', parseInt(e.target.value) || 0)}
                                                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center bg-white"
                                                        min="0"
                                                    />
                                                    <span className="text-sm text-gray-900">times per</span>
                                                    <select
                                                        value={rule.timePeriod || 'week'}
                                                        onChange={(e) => updateRule(rule.id, 'timePeriod', e.target.value)}
                                                        className="px-3 py-1 border border-gray-300 rounded text-sm bg-white"
                                                    >
                                                        <option value="week">week</option>
                                                        <option value="month">month</option>
                                                    </select>
                                                </label>

                                                {/* Deviations occur on multiples of */}
                                                <label className="flex items-center space-x-3">
                                                    <input
                                                        type="radio"
                                                        name={`deviationType-${rule.id}`}
                                                        checked={rule.deviationType === 'multiples-of'}
                                                        onChange={() => updateRule(rule.id, 'deviationType', 'multiples-of')}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <span className="text-sm text-gray-700">Deviations occur on multiples of</span>
                                                    <input
                                                        type="number"
                                                        value={rule.multipleValue || 1}
                                                        onChange={(e) => updateRule(rule.id, 'multipleValue', parseInt(e.target.value) || 1)}
                                                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center bg-white"
                                                        min="1"
                                                    />
                                                    <span className="text-sm text-gray-700">in a</span>
                                                    <select
                                                        value={rule.multiplePeriod || 'month'}
                                                        onChange={(e) => updateRule(rule.id, 'multiplePeriod', e.target.value)}
                                                        className="px-3 py-1 border border-gray-300 rounded text-sm bg-white"
                                                    >
                                                        <option value="month">month</option>
                                                        <option value="week">week</option>
                                                    </select>
                                                </label>

                                                {/* Warning message */}
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                                                    {rule.deviationType === "more-than" ? (
                                                        <p className="text-sm text-gray-700">
                                                            Leave balance will be deducted when deviations exceed {rule.deviationCount || 0} times in a {rule.timePeriod || 'week'}
                                                        </p>
                                                    ) : (
                                                        <p className="text-sm text-gray-700">
                                                            Leave balance will be deducted on all multiples of 1 in a {rule.multiplePeriod} (Example: 1,2,3)
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Deduct section */}
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-700">Deduct</span>
                                            <select
                                                value={rule.deductDays || 0.5}
                                                onChange={(e) => updateRule(rule.id, 'deductDays', parseFloat(e.target.value))}
                                                className="px-3 py-1 border border-gray-300 rounded text-sm bg-white"
                                            >
                                                <option value="0.5">0.25</option>
                                                <option value="1">0.5</option>
                                                <option value="1.5">1</option>
                                            </select>
                                            <span className="text-sm text-gray-700">days from leave balance in the following order</span>
                                        </div>

                                        {/* Leave types section with light gray background */}
                                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                            {rule.leaveTypes && rule.leaveTypes.map((leaveType, leaveIndex) => (
                                                <div key={leaveIndex} className="flex items-center space-x-2">
                                                    <select
                                                        value={leaveType}
                                                        onChange={(e) => updateLeaveType(rule.id, leaveIndex, e.target.value)}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                                                    >
                                                        <option value="">Select leave type</option>
                                                        {getAvailableLeaveTypes(rule.id, leaveIndex).map(type => (
                                                            <option key={type} value={type}>{type}</option>
                                                        ))}
                                                        {/* Keep current selected value available */}
                                                        {leaveType && !getAvailableLeaveTypes(rule.id, leaveIndex).includes(leaveType) && (
                                                            <option key={leaveType} value={leaveType}>{leaveType}</option>
                                                        )}
                                                    </select>
                                                    {rule.leaveTypes.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeLeaveType(rule.id, leaveIndex)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            
                                            {/* Add button only shows if there are available leave types */}
                                            {(() => {
                                                const rule_current = safeGracePeriodRules.find(r => r.id === rule.id);
                                                const available = allLeaveTypesAttendace.filter(type => !rule_current?.leaveTypes?.includes(type));
                                                return available.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => addLeaveType(rule.id)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        Add
                                                    </button>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add Rule Button */}
                        <button
                            type="button"
                            onClick={addNewRule}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Add Rule
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GracePeriodPolicy;