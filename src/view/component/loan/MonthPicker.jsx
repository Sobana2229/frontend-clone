import { useState, useRef, useEffect } from "react";

function MonthPicker({ 
    value, 
    onChange, 
    minDate, 
    disabledMonths = [], // Array of "YYYY-MM" yang disabled
    className = "",
    error = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState(() => {
        if (value) {
            return parseInt(value.split('-')[0]);
        }
        return new Date().getFullYear();
    });
    const dropdownRef = useRef(null);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Parse value to display
    const displayValue = value ? (() => {
        const [year, month] = value.split('-');
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    })() : '';

    // Generate years (current year ± 2 years)
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 2; i <= currentYear + 5; i++) {
        years.push(i);
    }

    // Check if month is disabled
    const isMonthDisabled = (year, monthIndex) => {
        const monthStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
        
        // Check min date
        if (minDate && monthStr < minDate) {
            return true;
        }
        
        // Check disabled months
        if (disabledMonths.includes(monthStr)) {
            return true;
        }
        
        return false;
    };

    const handleMonthSelect = (year, monthIndex) => {
        const monthStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
        if (!isMonthDisabled(year, monthIndex)) {
            onChange(monthStr);
            setIsOpen(false);
        }
    };

    // Update selectedYear when value changes
    useEffect(() => {
        if (value) {
            const year = parseInt(value.split('-')[0]);
            setSelectedYear(year);
        }
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between ${
                    error ? 'border-red-500' : 'border-gray-300'
                } ${className}`}
            >
                <span>{displayValue || 'Select month'}</span>
                <svg 
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-full">
                    {/* Year Selector */}
                    <div className="p-3 border-b">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Year</span>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Month Grid */}
                    <div className="p-3">
                        <div className="grid grid-cols-3 gap-2">
                            {monthNames.map((monthName, index) => {
                                const isDisabled = isMonthDisabled(selectedYear, index);
                                const monthStr = `${selectedYear}-${String(index + 1).padStart(2, '0')}`;
                                const isSelected = value === monthStr;

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleMonthSelect(selectedYear, index)}
                                        disabled={isDisabled}
                                        className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                            isDisabled
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : isSelected
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {monthName.slice(0, 3)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MonthPicker;

