function ShiftMargin({formData, setFormData, handleChange}) {
    const formatTimeRange = (fromTime, toTime) => {
        if (!fromTime || !toTime) return '';
            const formatTime = (time) => {
            const [hours, minutes] = time.split(':');
            const hour12 = hours % 12 || 12;
            const ampm = hours < 12 ? 'AM' : 'PM';
            return `${hour12}:${minutes} ${ampm}`;
        };
        return `${formatTime(fromTime)} - ${formatTime(toTime)}`;
    };
    return (
        <div className="flex items-start space-x-3">
            <input
                type="checkbox"
                id="shiftMargin"
                name="shiftMargin"
                checked={formData.shiftMargin}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="flex-1">
                <label htmlFor="shiftMargin" className="text-sm font-medium text-gray-900">
                Shift Margin
                </label>
                <p className="text-sm text-gray-600">
                Define boundaries within which payable hours will be calculated
                </p>

                {/* Shift Margin Input Fields */}
                {formData.shiftMargin && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hours before the shift starts
                        </label>
                        <input
                        type="time"
                        name="shiftMarginBefore"
                        value={formData.shiftMarginBefore}
                        onChange={handleChange}
                        placeholder="HH:mm"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hours after the shift ends
                        </label>
                        <input
                        type="time"
                        name="shiftMarginAfter"
                        value={formData.shiftMarginAfter}
                        onChange={handleChange}
                        placeholder="HH:mm"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                        Check-in/check-out entries only within {formatTimeRange(formData.fromTime, formData.toTime)} will be considered as payable hours
                    </p>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}

export default ShiftMargin;