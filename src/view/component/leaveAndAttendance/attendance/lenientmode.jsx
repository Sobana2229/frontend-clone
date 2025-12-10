function Lenientmode({formData, setFormData, handleRadioChange, handleChange}) {
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-4">
            <div className="space-y-3">
                <label className="flex items-center">
                <input
                    type="radio"
                    name="hoursSettingMode"
                    value="set-manually"
                    checked={formData.hoursSettingMode === "set-manually"}
                    onChange={(e) => handleRadioChange("hoursSettingMode", e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Set manually</span>
                </label>
                <label className="flex items-center">
                <input
                    type="radio"
                    name="hoursSettingMode"
                    value="shift-hours"
                    checked={formData.hoursSettingMode === "shift-hours"}
                    onChange={(e) => handleRadioChange("hoursSettingMode", e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Shift hours</span>
                </label>
            </div>

            <div className="space-y-4">
                {formData.hoursSettingMode === "shift-hours" ? (
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">Expected hours per day :</span>
                    <span className="text-sm text-gray-500">Duration of the shift</span>
                </div>
                ) : (
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-700">Expected hours per day <span className="text-red-500">*</span></span>
                    <input
                    type="time"
                    name="expectedHoursPerDay"
                    value={formData.expectedHoursPerDay}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-24"
                    />
                    <span className="text-sm text-gray-500">hours</span>
                </div>
                )}
            </div>
        </div>
    );
}

export default Lenientmode;