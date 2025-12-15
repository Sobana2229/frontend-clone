import { useEffect, useState } from 'react';
import { CreditCard, ArrowUpRight, Money } from '@phosphor-icons/react';
import { useLocation } from 'react-router-dom';
import loanStoreManagements from '../../../store/tdPayroll/loan';
import LoanList from '../../component/loan/loanList';
import HeaderReusable from '../../component/setting/headerReusable';
import LoanForm from '../../component/loan/loanForm';
import authStoreManagements from '../../../store/tdPayroll/auth';
import { checkPermission } from '../../../../helper/globalHelper';
import BottomDownSVG from '../../../assets/bottom-down.svg';
import PaginationPages from '../../component/paginations';

function LoanPages() {
  const location = useLocation();
  const { getLoan, loanCard, loanAdvanceSalary } = loanStoreManagements();
  const { user } = authStoreManagements();
  const [cardCurrentPage, setCardCurrentPage] = useState(1);
const cardsPerPage = 10; // number of cards per page

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
  const getPaginatedCards = () => {
  const cards = getFilteredSummaryCards(); // your current filtered cards
  const startIndex = (cardCurrentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  return cards.slice(startIndex, endIndex);
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
      <div className="text-center text-white py-8">
        No {activeSection === 'advance-salary' ? 'advance salary' : 'loan'} data found
      </div>
    );
  }

  return cards.map((card) => (
    <div
      key={card.id}
      className="relative bg-white cursor-pointer transition-all duration-300 hover:shadow-2xl overflow-hidden"
    style={{
  borderRadius: '22.47px',
  padding: '14.98px',
  boxShadow: '0px 40px 40px rgba(0, 0, 0, 0.09)',
  width: '250px',
  height: '200px'
}}

      onClick={() => handleCardClick(card)}
    >
      {/* Top Left Screw */}
      <div className="absolute" style={{ width: '12.36px', height: '12.36px', left: '9.36px', top: '9.36px', background: 'linear-gradient(173.29deg, rgba(255, 255, 255, 0.2) 14.51%, rgba(255, 255, 255, 0) 37.88%), #EDEDED', opacity: 0.4, boxShadow: 'inset 0px -0.26px 0.26px rgba(77, 77, 77, 0.4), inset 0px -1.03px 1.54px rgba(90, 90, 90, 0.25)', borderRadius: '19.47px' }}>
        <div style={{ position: 'absolute', width: '5.41px', height: '5.41px', left: '1.93px', top: '1.16px', background: '#FFFFFF', filter: 'blur(1.54px)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', width: '5.62px', height: '5.62px', left: '3.38px', top: '3.37px', background: '#F3F4F6', boxShadow: 'inset 0px 0.51px 0.51px rgba(0, 0, 0, 0.6)', borderRadius: '50%' }} />
      </div>

      {/* Top Right Screw */}
      <div className="absolute" style={{ width: '12.36px', height: '12.36px', right: '9.36px', top: '9.36px', background: 'linear-gradient(173.29deg, rgba(255, 255, 255, 0.2) 14.51%, rgba(255, 255, 255, 0) 37.88%), #EDEDED', opacity: 0.4, boxShadow: 'inset 0px -0.26px 0.26px rgba(77, 77, 77, 0.4), inset 0px -1.03px 1.54px rgba(90, 90, 90, 0.25)', borderRadius: '19.47px' }}>
        <div style={{ position: 'absolute', width: '5.41px', height: '5.41px', left: '1.93px', top: '1.16px', background: '#FFFFFF', filter: 'blur(1.54px)', borderRadius: '50%' }} />
      </div>

      {/* Bottom Left Screw */}
      <div className="absolute" style={{ width: '12.36px', height: '12.36px', left: '9.36px', bottom: '9.36px', background: 'linear-gradient(173.29deg, rgba(255, 255, 255, 0.2) 14.51%, rgba(255, 255, 255, 0) 37.88%), #EDEDED', opacity: 0.4, boxShadow: 'inset 0px -0.26px 0.26px rgba(77, 77, 77, 0.4), inset 0px -1.03px 1.54px rgba(90, 90, 90, 0.25)', borderRadius: '19.47px' }} />

      {/* Bottom Right Screw */}
      <div className="absolute" style={{ width: '12.36px', height: '12.36px', right: '9.36px', bottom: '9.36px', background: 'linear-gradient(173.29deg, rgba(255, 255, 255, 0.2) 14.51%, rgba(255, 255, 255, 0) 37.88%), #EDEDED', opacity: 0.4, boxShadow: 'inset 0px -0.26px 0.26px rgba(77, 77, 77, 0.4), inset 0px -1.03px 1.54px rgba(90, 90, 90, 0.25)', borderRadius: '19.47px' }} />

      {/* Inner Container */}
      <div style={{ padding: '26.21px', width: '220.04px', height: '170.04px', background: 'rgba(28, 28, 28, 0.05)', border: '0.26px solid rgba(28, 28, 28, 0.05)', boxShadow: '0px 5.15px 10.3px rgba(189, 188, 188, 0.25), -1.03px 1.03px 2.57px rgba(224, 224, 224, 0.2)', backdropFilter: 'blur(5.47px)', borderRadius: '10.81px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
        
        {/* Arrow */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ArrowUpRight size={34} strokeWidth={3} color="#1C1C1C" />
        </div>

        {/* Title */}
        <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '24px', lineHeight: '32px', color: '#1C1C1C' }}>
          {card.name.replace(/ Loan$/, '')}
        </h3>

        {/* Avatars */}
      {/* Bottom-down SVG inside the card */}
<div className=" left-4 bottom-4">
  <img 
    src={BottomDownSVG} 
    alt="Bottom Down Arrow" 
    className="w-18 h-18"  // increase size
  />
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
    <div className="h-screen w-screen flex flex-col bg-white">
      {/* Header - always show except in detail view */}
      {!showDetail && headerProps && (
        <HeaderReusable {...headerProps} />
      )}

      {/* Content area */}
      {showFormLoans ? (
        // CREATE FORM VIEW
        <div className="flex-1 w-full">
          <LoanForm
            selectedLoanData={selectedLoanData}
            setShowFormLoans={setShowFormLoans}
            setSelectedLoanData={setSelectedLoanData}
          />
        </div>
      ) : selectedLoanData ? (
        // DETAIL LIST VIEW (when a card is clicked)
    <div className="flex-1 w-full">
    <LoanList
      isAdvance={selectedLoanData.isSalaryAdvance}
      loanNameUuid={selectedLoanData.loanNameUuid}
      loanName={selectedLoanData.loanName}
      setSelectedLoanData={setSelectedLoanData}
      onBack={handleBackToSummary}
      showDetail={showDetail} 
      setShowDetail={setShowDetail}
      addData={addLoans}
    />
  </div>
      ) : (
        // CARDS VIEW (default view showing all cards)
        <div className="flex-1 ">
          <div className="p-6">
            {!currentData ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-white">Loading {activeSection === 'loans' ? 'loans' : 'advance salary'} data...</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {activeSection === 'loans' ? 'Loan Types' : 'Advance Salary Types'}
                  </h2>
                  
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {renderSummaryCards(getFilteredSummaryCards())}
                </div>
       {/* Pagination for cards */}
    
              </div>
            )}
            
          </div>
          
        </div>
        
      )}
       <div className="flex justify-end mt-6 bottom-2" >
        <PaginationPages 
          totalPages={Math.ceil(getFilteredSummaryCards().length / cardsPerPage)}
          currentPage={cardCurrentPage}
          setCurrentPage={setCardCurrentPage}
        />
      </div>
    </div>
    
  );
}

export default LoanPages;