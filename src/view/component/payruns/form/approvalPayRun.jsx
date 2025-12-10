import React, { useState } from 'react';
import payrunStoreManagements from '../../../../store/tdPayroll/payrun';
import dayjs from 'dayjs';
import LoadingIcon from '../../loadingIcon';

function ApprovalPayRun({ setShowModal, isRecordPayment, submit }) {
  const { payrunThisMonth } = payrunStoreManagements();
  const [postJournalEntries, setPostJournalEntries] = useState(false);
  const [formDataRecord, setFormDataRecord] = useState({
    paymentDate: '',
    paidThroughAccount: 'Bank Account',
    sendPayslipNotification: false,
    countEmployees: payrunThisMonth?.countEmployees
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormDataRecord(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmitAndApprove = async () => {
    // ✅ Validate paymentDate for Record Payment
    if (isRecordPayment) {
      if (!formDataRecord.paymentDate || formDataRecord.paymentDate.trim() === '') {
        setError('Payment Date is required');
        return;
      }
      
      // ✅ Validate date format
      const parsedDate = dayjs(formDataRecord.paymentDate);
      if (!parsedDate.isValid()) {
        setError('Please enter a valid payment date');
        return;
      }
    }

    setIsLoading(true);
    setError('');
    
    try {
      if(!isRecordPayment){
        await submit(postJournalEntries);
      }else{
        await submit(formDataRecord);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isLoading) return; // Prevent cancel during loading
    setShowModal(false);
  };

  return (
    <div className="w-full h-full flex-col flex items-start justify-start relative px-5 pb-5 space-y-6">
      {!isRecordPayment ? (
        <>
          {/* Warning Section */}
          <div className="w-full">
            <p className="text-sm text-gray-700 mb-3">
              On approving this payroll, your employees will not be able to,
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-4">
              <li>Raise any Reimbursement claims for this month</li>
              <li>Declare or update the IT or POI declaration for this month</li>
            </ul>
          </div>

          {/* Post Journal Entries Section */}
          <div className="w-full bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="postJournalEntries"
                checked={postJournalEntries}
                onChange={(e) => setPostJournalEntries(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <label htmlFor="postJournalEntries" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Post Journal Entries
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Once you mark this option, journal entries will be posted in Zoho Books.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full space-y-6">
          {/* Header Message */}
          <div className="w-full">
            <p className="text-sm text-gray-700 mb-6">
              Based on your preferences, payments will be recorded and payslip notifications will be sent accordingly.
            </p>
          </div>

          {/* Payment Date */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Date
              <span className="text-red-500 ml-1">*</span>
              <span className="inline-block w-4 h-4 ml-1">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={formDataRecord.paymentDate}
                onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  error ? 'border-red-500' : 'border-gray-300'
                } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Paid Through Account */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paid Through Account
            </label>
            <select
              value={formDataRecord.paidThroughAccount}
              onChange={(e) => handleInputChange('paidThroughAccount', e.target.value)}
              disabled={isLoading}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
                isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              <option value="Bank Account">Bank Account</option>
              <option value="Cash Account">Cash Account</option>
              <option value="Other Bank Account">Other Bank Account</option>
            </select>
          </div>

          {/* Payment Mode Section */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">Payment Mode</span>
              <span className="text-sm font-medium text-gray-700">Employees</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Cash</span>
              <span className="text-sm text-gray-600">{formDataRecord?.countEmployees}</span>
            </div>
          </div>

          {/* Send Payslip Notification */}
          <div className="w-full">
            <div className="flex items-start space-x-3 mb-3">
              <input
                type="checkbox"
                id="sendPayslipNotification"
                checked={formDataRecord.sendPayslipNotification}
                onChange={(e) => handleInputChange('sendPayslipNotification', e.target.checked)}
                disabled={isLoading}
                className={`mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                  isLoading ? 'cursor-not-allowed opacity-50' : ''
                }`}
              />
              <div>
                <label htmlFor="sendPayslipNotification" className="text-sm font-medium text-gray-900 cursor-pointer flex items-center">
                  Send payslip notification to all employees
                  <span className="inline-block w-4 h-4 ml-1">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </span>
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  The email sent to employees will contain a link that redirects them to the portal to view the payslips. For those without portal access, payslips will be available for download directly from the email.
                </p>
              </div>
            </div>
            
            {/* Warning Message */}
            <div className="flex items-start space-x-3 bg-orange-50 border-l-4 border-orange-400 p-3 rounded">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-orange-800">
                Regardless of whether you choose to send payslip notification email or not, the payslip will be displayed in the Portal once you record the payment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="w-full flex space-x-3 pt-4 border-t">
        <button
          onClick={handleSubmitAndApprove}
          disabled={isLoading}
          className={`px-6 py-2 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center space-x-2 ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
          }`}
        >
          {isLoading && (
            <div className="w-4 h-4">
              <LoadingIcon color="#ffffff" />
            </div>
          )}
          <span>
            {isRecordPayment ? 'Confirm' : 'Submit and Approve'}
          </span>
        </button>
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className={`px-6 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium border border-gray-300 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ApprovalPayRun;
