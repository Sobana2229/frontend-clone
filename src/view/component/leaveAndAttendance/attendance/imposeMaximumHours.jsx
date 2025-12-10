function ImposeMaximumHours({formData, setFormData, handleChange}) {
    return (
        <div className="space-y-3">
            <label className="flex items-center">
                <input
                    type="checkbox"
                    name="imposeMaximumHoursPerDay"
                    checked={formData.imposeMaximumHoursPerDay}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Impose maximum hours per day</span>
            </label>

            {formData.imposeMaximumHoursPerDay && (
                <div className="ml-6 bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700">Per Day <span className="text-red-500">*</span></span>
                        <input
                            type="time"
                            name="maxHoursPerDay"
                            value={formData.maxHoursPerDay}
                            onChange={handleChange}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-24"
                        />
                        <span className="text-sm text-gray-500">hours</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ImposeMaximumHours;