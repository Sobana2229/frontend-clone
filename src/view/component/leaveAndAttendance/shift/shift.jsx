import { getDefaultWeekendSchedule } from "../../../../../data/dummy";

function Shift({formData, setFormData, handleChange}) {
    const handleHalfWorkingDayChange = (e) => {
        const isChecked = e.target.checked;
        setFormData(prev => ({
            ...prev,
            halfWorkingDay: isChecked,
            weekendSchedule: getDefaultWeekendSchedule(),
        }));
    };
    const handleWeekendScheduleChange = (day, week, value) => {
        setFormData(prev => {
            const newWeekendSchedule = { ...prev.weekendSchedule };
            if (week === 'All') {
                if (value) {
                    newWeekendSchedule[day] = {
                        All: true,
                        '1st': formData.halfWorkingDay ? 'Full Day' : 'Full Day',
                        '2nd': formData.halfWorkingDay ? 'Full Day' : 'Full Day',
                        '3rd': formData.halfWorkingDay ? 'Full Day' : 'Full Day',
                        '4th': formData.halfWorkingDay ? 'Full Day' : 'Full Day',
                        '5th': formData.halfWorkingDay ? 'Full Day' : 'Full Day'
                    };
                } else {
                    newWeekendSchedule[day] = {
                        All: false,
                        '1st': false,
                        '2nd': false,
                        '3rd': false,
                        '4th': false,
                        '5th': false
                    };
                }
            } else {
                if (prev.halfWorkingDay) {
                    newWeekendSchedule[day] = {
                        ...newWeekendSchedule[day],
                        [week]: value ? 'Full Day' : false
                    };
                } else {
                    newWeekendSchedule[day] = {
                        ...newWeekendSchedule[day],
                        [week]: value
                    };
                }
                if (newWeekendSchedule[day].All) {
                    newWeekendSchedule[day].All = false;
                }
            }
            
            return {
                ...prev,
                weekendSchedule: newWeekendSchedule
            };
        });
    };
    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="mb-4">
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="halfWorkingDay"
                        name="halfWorkingDay"
                        checked={formData.halfWorkingDay}
                        onChange={handleHalfWorkingDayChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="halfWorkingDay" className="text-sm font-medium text-gray-900">
                        Half working day & half weekend
                    </label>
                </div>
                
                {/* Optional: Info text untuk user */}
                <p className="text-xs text-gray-500 mt-1 ml-7">
                    {formData.halfWorkingDay 
                        ? "Checkbox mode: Check for full day weekend" 
                        : "Select mode: Choose full day, half day, or no weekend"
                    }
                </p>
            </div>

            {/* Weekend Schedule Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="text-left p-3 border-r border-gray-200">Day</th>
                            <th className="text-center p-2 border-r border-gray-200">All</th>
                            <th className="text-center p-2 border-r border-gray-200">1st</th>
                            <th className="text-center p-2 border-r border-gray-200">2nd</th>
                            <th className="text-center p-2 border-r border-gray-200">3rd</th>
                            <th className="text-center p-2 border-r border-gray-200">4th</th>
                            <th className="text-center p-2">5th</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(formData.weekendSchedule).map((day, dayIndex) => (
                            <tr key={day} className={dayIndex < 6 ? "border-b border-gray-200" : ""}>
                                <td className="p-3 bg-gray-50 font-medium border-r border-gray-200">
                                    {day}
                                </td>
                                
                                {/* All Column */}
                                <td className="text-center p-2 border-r border-gray-200">
                                    <input
                                        type="checkbox"
                                        checked={formData.weekendSchedule[day].All}
                                        onChange={(e) => handleWeekendScheduleChange(day, 'All', e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </td>
                                
                                {/* 1st-5th Columns - Conditional Rendering */}
                                {['1st', '2nd', '3rd', '4th', '5th'].map((week, weekIndex) => (
                                    <td key={week} className={`text-center p-2 ${weekIndex < 4 ? 'border-r border-gray-200' : ''}`}>
                                        <div className="relative">
                                            {formData.halfWorkingDay ? (
                                                <input
                                                    type="checkbox"
                                                    checked={formData.weekendSchedule[day][week] === 'Full Day'}
                                                    onChange={(e) => handleWeekendScheduleChange(day, week, e.target.checked)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    disabled={formData.weekendSchedule[day].All}
                                                />
                                            ) : (
                                                <select
                                                    value={formData.weekendSchedule[day][week]}
                                                    onChange={(e) => handleWeekendScheduleChange(day, week, e.target.value)}
                                                    className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[80px]"
                                                    disabled={formData.weekendSchedule[day].All}
                                                >
                                                    <option value={false}>-</option>
                                                    <option value="Full Day">Full Day</option>
                                                    <option value="1st Half">1st Half</option>
                                                    <option value="2nd Half">2nd Half</option>
                                                </select>
                                            )}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Shift;