function RoundOff({formData, setFormData, handleChange}) {
    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 60)) {
            handleChange(e);
        }
    };

    const handleKeyDown = (e) => {
        if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    };

    return (
        <div className="space-y-3">
            <label className="flex items-start">
                <input
                    type="checkbox"
                    name="roundOff"
                    checked={formData.roundOff}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                />
                <div className="ml-2">
                    <span className="text-sm font-medium text-gray-700">Round-off</span>
                    <p className="text-sm text-gray-500 mt-1">Round-off lets you adjust the first check-in, last check-out and working hours based on the minutes you configure for each</p>
                </div>
            </label>

            {formData.roundOff && (
                <div className="ml-6 bg-gray-50 p-4 rounded-md space-y-4">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700 min-w-[200px]">Round off first check-in by up to</span>
                        <input
                            type="number"
                            name="roundOffFirstCheckIn"
                            value={formData.roundOffFirstCheckIn}
                            onChange={handleNumberChange}
                            onKeyDown={handleKeyDown}
                            min="1"
                            max="60"
                            step="1"
                            placeholder="15"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-20"
                        />
                        <span className="text-sm text-gray-500">minutes (1-60)</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700 min-w-[200px]">Round off last check-out by up to</span>
                        <input
                            type="number"
                            name="roundOffLastCheckOut"
                            value={formData.roundOffLastCheckOut}
                            onChange={handleNumberChange}
                            onKeyDown={handleKeyDown}
                            min="1"
                            max="60"
                            step="1"
                            placeholder="15"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-20"
                        />
                        <span className="text-sm text-gray-500">minutes (1-60)</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700 min-w-[200px]">Round off worked hours by up to</span>
                        <input
                            type="number"
                            name="roundOffWorkedHours"
                            value={formData.roundOffWorkedHours}
                            onChange={handleNumberChange}
                            onKeyDown={handleKeyDown}
                            min="1"
                            max="60"
                            step="1"
                            placeholder="15"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-20"
                        />
                        <span className="text-sm text-gray-500">minutes (1-60)</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoundOff;