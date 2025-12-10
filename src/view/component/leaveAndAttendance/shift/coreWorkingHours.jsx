import { TrashIcon } from "@phosphor-icons/react";

function CoreWorkingHours({formData, setFormData, handleChange}) {
    const addCoreHoursSlot = () => {
        setFormData(prev => ({
        ...prev,
        coreHoursSlots: [...prev.coreHoursSlots, { from: '', to: '' }]
        }));
    };

    const removeCoreHoursSlot = (index) => {
        setFormData(prev => ({
        ...prev,
        coreHoursSlots: prev.coreHoursSlots.filter((_, i) => i !== index)
        }));
    };

    const handleCoreHoursChange = (index, field, value) => {
        const updatedSlots = [...formData.coreHoursSlots];
        updatedSlots[index][field] = value;
        setFormData(prev => ({
            ...prev,
            coreHoursSlots: updatedSlots
        }));
    };
    return (
        <div className="flex items-start space-x-3">
            <input
                type="checkbox"
                id="coreWorkingHours"
                name="coreWorkingHours"
                checked={formData.coreWorkingHours}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="flex-1">
                <label htmlFor="coreWorkingHours" className="text-sm font-medium text-gray-900">
                    Core Working Hours
                </label>
                <p className="text-sm text-gray-600">
                    Define the time frames during which employees in this shift are required to be present for work
                </p>

                {/* Core Working Hours Input Fields */}
                {formData.coreWorkingHours && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="space-y-3 mb-4">
                        {formData.coreHoursSlots.map((slot, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <div className="flex-1 grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            From
                                        </label>
                                        <input
                                            type="time"
                                            value={slot.from}
                                            onChange={(e) => handleCoreHoursChange(index, 'from', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            To
                                        </label>
                                        <input
                                            type="time"
                                            value={slot.to}
                                            onChange={(e) => handleCoreHoursChange(index, 'to', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                {formData.coreHoursSlots.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeCoreHoursSlot(index)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <TrashIcon size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={addCoreHoursSlot}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            Add
                        </button>
                    </div>

                    {/* Restrict Breaks Checkbox */}
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="restrictBreaksDuringCore"
                            name="restrictBreaksDuringCore"
                            checked={formData.restrictBreaksDuringCore}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="restrictBreaksDuringCore" className="text-sm font-medium text-gray-900">
                            Restrict breaks during core working hours
                        </label>
                    </div>
                    <p className="text-sm text-gray-600 ml-7 mt-1">
                        Automatic and manual breaks for this shift are not allowed during core working hours.
                    </p>
                </div>
                )}
            </div>
        </div>
    );
}

export default CoreWorkingHours;