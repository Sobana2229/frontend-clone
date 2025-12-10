import { useState } from "react";

function RegularizationSettings({ formData, setFormData, handleToggleChange, handleChange }) {
  const [showRestrictDays, setShowRestrictDays] = useState(formData.restrictRegularizationDays || false);

  const handleRegularizationToggle = (field) => {
    if (field === 'restrictRegularizationDays') {
      setShowRestrictDays(!showRestrictDays);
      setFormData(prev => ({
        ...prev,
        [field]: !prev[field]
      }));
    } else {
      handleToggleChange(field);
    }
  };

  return (
    <div className="space-y-6 border-t pt-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Regularization Settings</h3>
        <p className="text-sm text-gray-600 mb-6">
          In situations where check-in or check-out has been missed, choose when employees can request adjustments to ensure accurate records*
        </p>
      </div>

      {/* Regularization Options */}
      <div className="space-y-4">
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="regularizationPolicy"
              value="allow-anytime"
              checked={formData.regularizationPolicy === "allow-anytime"}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Allow Anytime</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="regularizationPolicy"
              value="limit-requests"  
              checked={formData.regularizationPolicy === "limit-requests"}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="ml-2">
              <span className="text-sm text-gray-700">Limit Requests</span>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Tooltip information
              </div>
            </div>
          </label>
        </div>

        {/* Conditional Content for Limit Requests */}
        {formData.regularizationPolicy === "limit-requests" && (
          <div className="ml-6 space-y-4 border-l-2 border-gray-200 pl-4">
            {/* Number of days before current date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Number of days before current date for which attendance can be regularized*
              </label>
              <input
                type="number"
                name="regularizationDaysLimit"
                value={formData.regularizationDaysLimit || 5}
                onChange={handleChange}
                min="1"
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Restrict regularization days checkbox */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="restrictRegularizationDays"
                  checked={formData.restrictRegularizationDays || false}
                  onChange={() => handleRegularizationToggle('restrictRegularizationDays')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Restrict the number of regularization days an employee can make in a month
                </span>
              </label>

              {/* Days input - only show when checkbox is checked */}
              {showRestrictDays && (
                <div className="ml-6 flex items-center space-x-2">
                  <input
                    type="number"
                    name="maxRegularizationDaysPerMonth"
                    value={formData.maxRegularizationDaysPerMonth || ''}
                    onChange={handleChange}
                    min="1"
                    placeholder="Days"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-sm text-gray-700">Days</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegularizationSettings;
