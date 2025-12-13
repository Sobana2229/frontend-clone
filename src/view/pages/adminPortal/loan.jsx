import { useEffect, useState } from 'react';
import { CreditCard, ArrowUpRight, Money } from '@phosphor-icons/react';
import { useLocation } from 'react-router-dom';
import loanStoreManagements from '../../../store/tdPayroll/loan';
import LoanList from '../../component/loan/loanList';
import HeaderReusable from '../../component/setting/headerReusable';
import LoanForm from '../../component/loan/loanForm';
import authStoreManagements from '../../../store/tdPayroll/auth';
import { checkPermission } from '../../../../helper/globalHelper';

function LoanPages() {
  const location = useLocation();
  const { getLoan, loanCard, loanAdvanceSalary } = loanStoreManagements();
  const { user } = authStoreManagements();
  
  // Determine active section from URL path
  const getInitialSection = () => {
    const path = location.pathname;
    console.log('[LoanPages] Current path:', path);
    
    // Check for advance salary path - MUST check this first
    if (path.includes('/loan/advance-salary')) {
      return 'advance-salary';
    }
    
    // Default to loans for /loan path
    return 'loans';
  };
  
  const [activeSection, setActiveSection] = useState(getInitialSection());
  const [selectedLoanData, setSelectedLoanData] = useState(null);
  const [showFormLoans, setShowFormLoans] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  // Update active section when URL changes
  useEffect(() => {
    const newSection = getInitialSection();
    console.log('[LoanPages] URL changed, setting section to:', newSection);
    setActiveSection(newSection);
    // Reset states when navigating between sections
    setSelectedLoanData(null);
    setShowFormLoans(false);
    setShowDetail(false);
  }, [location.pathname]);

  // Fetch loan data
  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");
    if (!loanCard && access_token) {
      console.log('[LoanPages] Fetching loan card data');
      getLoan(access_token, "card-loan");
    }
  }, [loanCard, getLoan]);

  // Fetch advance salary data
  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");
    if (!loanAdvanceSalary && access_token) {
      console.log('[LoanPages] Fetching advance salary data');
      getLoan(access_token, "card-advance-salary");
    }
  }, [loanAdvanceSalary, getLoan]);

  // Check permissions based on active section
  const hasPermission = () => {
    if (activeSection === 'loans') {
      return checkPermission(user, 'Loan', 'View');
    } else {
      return checkPermission(user, 'Advance Salary', 'View');
    }
  };

  const getCurrentData = () => {
    const data = activeSection === 'loans' ? loanCard : loanAdvanceSalary;
    console.log('[LoanPages] Current data for', activeSection, ':', data);
    return data;
  };

  const getFilteredSummaryCards = () => {
    const currentData = getCurrentData();
    if (!currentData?.summaryCards) {
      console.log('[LoanPages] No summary cards found');
      return [];
    }
    console.log('[LoanPages] Summary cards:', currentData.summaryCards);
    return currentData.summaryCards;
  };

  const handleCardClick = (card) => {
    console.log('[LoanPages] Card clicked:', card.name);
    const currentData = getCurrentData();
    const isSalaryAdvance = card.isSalaryAdvance !== undefined 
      ? card.isSalaryAdvance 
      : currentData?.isSalaryAdvance;
    
    setSelectedLoanData({
      isSalaryAdvance: isSalaryAdvance,
      loanNameUuid: card.isAggregate ? null : getLoanNameUuid(card.id),
      loanName: card.name,
      cardData: card
    });
  };

  const getLoanNameUuid = (loanType) => {
    const currentData = getCurrentData();
    if (!currentData?.groupedData || !currentData.groupedData[loanType]) return null;
    const sampleLoan = currentData.groupedData[loanType].loans[0];
    return sampleLoan?.loanNameUuid || null;
  };

  const handleBackToSummary = () => {
    console.log('[LoanPages] Back to summary - showing cards');
    setSelectedLoanData(null);
    setShowFormLoans(false);
  };

  const addLoans = () => {
    console.log('[LoanPages] Opening create form for:', activeSection);
    setSelectedLoanData({
      isSalaryAdvance: activeSection === 'advance-salary',
      loanNameUuid: null,
      loanName: activeSection === 'advance-salary' ? "Advance Salary" : "Loan",
      cardData: null
    });
    setShowFormLoans(true);
  };

  const handleShowForm = () => {
    console.log('[LoanPages] Toggling form. Current state:', showFormLoans);
    setShowFormLoans(prev => !prev);
    if (showFormLoans) {
      setSelectedLoanData(null);
    }
  };

  const getHeaderProps = () => {
    if (showFormLoans) {
      return {
        title: selectedLoanData 
          ? `Create ${selectedLoanData.loanName}` 
          : activeSection === "loans" ? "Create Loan" : "Create Advance Salary",
        isAddData: true,
        handleBack: handleShowForm
      };
    }
    
    if (selectedLoanData) {
      return {
        title: selectedLoanData.loanName,
        isAddData: true,
        addDataTitle: activeSection === 'advance-salary' 
          ? "Create Advance Salary" 
          : "Create Loan",
        handleShowModal: addLoans,
        handleBack: handleBackToSummary
      };
    }
    
    // Show header in cards view with create button
    return {
      title: activeSection === 'loans' ? 'Loans' : 'Advance Salary',
      isAddData: true,
      addDataTitle: activeSection === 'advance-salary' 
        ? "Create Advance Salary" 
        : "Create Loan",
      handleShowModal: addLoans
    };
  };

  const renderSummaryCards = (cards) => {
    if (!cards.length) {
      return (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-400 mb-4">
            {activeSection === 'loans' ? (
              <CreditCard size={64} className="mx-auto mb-4" />
            ) : (
              <Money size={64} className="mx-auto mb-4" />
            )}
          </div>
          <div className="text-xl font-medium text-gray-700 mb-2">
            No {activeSection === 'advance-salary' ? 'advance salary' : 'loan'} records found
          </div>
          <p className="text-sm text-gray-500">
            Click "Create {activeSection === 'advance-salary' ? 'Advance Salary' : 'Loan'}" to add new records
          </p>
        </div>
      );
    }
    
    return cards.map((card) => (
      <div
        key={card.id}
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-400"
        onClick={() => handleCardClick(card)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardClick(card);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              {activeSection === 'loans' ? (
                <CreditCard size={24} className="text-blue-600" />
              ) : (
                <Money size={24} className="text-green-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              {card.name.replace(/ Loan$/, '')}
            </h3>
          </div>
          <ArrowUpRight size={20} className="text-gray-400" />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="font-semibold text-gray-900">
              ₹{card.totalAmount?.toLocaleString('en-IN') || '0'}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Outstanding</span>
            <span className="font-semibold text-orange-600">
              ₹{card.outstandingAmount?.toLocaleString('en-IN') || '0'}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Paid Amount</span>
            <span className="font-semibold text-green-600">
              ₹{((card.totalAmount || 0) - (card.outstandingAmount || 0))?.toLocaleString('en-IN') || '0'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
            <span className="text-sm text-gray-600">Employees:</span>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                {card.employeeCount > 0 ? '👤' : '0'}
              </div>
              {card.employeeCount > 1 && (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                  👤
                </div>
              )}
              {card.employeeCount > 2 && (
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                  👤
                </div>
              )}
              {card.employeeCount > 3 && (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                  +{card.employeeCount - 3}
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-gray-700 ml-2">
              {card.employeeCount} {card.employeeCount === 1 ? 'employee' : 'employees'}
            </span>
          </div>
        </div>
      </div>
    ));
  };

  const currentData = getCurrentData();
  const headerProps = getHeaderProps();

  // Check if user has permission to view this section
  if (!hasPermission()) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">
            You don't have permission to view {activeSection === 'loans' ? 'Loans' : 'Advance Salary'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header - always show except in detail view */}
      {!showDetail && headerProps && (
        <HeaderReusable {...headerProps} />
      )}

      {/* Content area */}
      {showFormLoans ? (
        // CREATE FORM VIEW
        <div className="flex-1 overflow-auto p-6">
          <LoanForm
            selectedLoanData={selectedLoanData}
            setShowFormLoans={setShowFormLoans}
            setSelectedLoanData={setSelectedLoanData}
          />
        </div>
      ) : selectedLoanData ? (
        // DETAIL LIST VIEW (when a card is clicked)
        <LoanList
          selectedLoanData={selectedLoanData}
          addData={addLoans}
          setShowDetail={setShowDetail}
        />
      ) : (
        // CARDS VIEW (default view showing all cards)
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {!currentData ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading {activeSection === 'loans' ? 'loans' : 'advance salary'} data...</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {activeSection === 'loans' ? 'Loan Types' : 'Advance Salary Types'}
                  </h2>
                  <p className="text-gray-600">
                    Click on any card to view detailed information and manage records
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {renderSummaryCards(getFilteredSummaryCards())}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LoanPages;