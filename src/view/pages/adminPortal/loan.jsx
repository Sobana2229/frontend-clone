import { useEffect, useState } from 'react';
import { 
  CreditCard, 
  ArrowUpRight,
  Money
} from '@phosphor-icons/react';
import loanStoreManagements from '../../../store/tdPayroll/loan';
import LoanList from '../../component/loan/loanList';
import HeaderReusable from '../../component/setting/headerReusable';
import LoanForm from '../../component/loan/loanForm';
import authStoreManagements from '../../../store/tdPayroll/auth';
import { checkPermission } from '../../../../helper/globalHelper';

function LoanPages() {
  const { getLoan, loanCard, loanAdvanceSalary } = loanStoreManagements();
  const [activeSection, setActiveSection] = useState(loanCard ? 'loans' : 'advance-salary');
  const [selectedLoanData, setSelectedLoanData] = useState(null);
  const [showFormLoans, setShowFormLoans] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const { user } = authStoreManagements();

  useEffect(() => {
    if(!loanCard){
      const access_token = localStorage.getItem("accessToken");
      getLoan(access_token, "card-loan");
    }
  }, []);

  useEffect(() => {
    if(!loanAdvanceSalary){
      const access_token = localStorage.getItem("accessToken");
      getLoan(access_token, "card-advance-salary");
    }
  }, []);

  const getSidebarItems = () => {
    const items = [
      {
        id: 'loans',
        title: 'Loans',
        icon: <CreditCard size={20} />,
        permission: { module: 'Loan', action: 'View' }
      },
      {
        id: 'advance-salary',
        title: 'Advance Salary', // Fixed typo
        icon: <Money size={20} />,
        permission: { module: 'Advance Salary', action: 'View' }
      }
    ];

    return items.filter(item => 
      checkPermission(user, item.permission.module, item.permission.action)
    );
  };

  const sidebarItems = getSidebarItems();

  const getCurrentData = () => {
    return activeSection === 'loans' ? loanCard : loanAdvanceSalary;
  };

  const getFilteredSummaryCards = () => {
    const currentData = getCurrentData();
    if (!currentData?.summaryCards) return [];
    return currentData.summaryCards;
  };

  const handleCardClick = (card) => {
    const currentData = getCurrentData();
    
    // Use card.isSalaryAdvance if available, otherwise use currentData.isSalaryAdvance
    const isSalaryAdvance = card.isSalaryAdvance !== undefined 
      ? card.isSalaryAdvance 
      : currentData.isSalaryAdvance;
    
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
    setSelectedLoanData(null);
    setShowFormLoans(false);
  };

  const addLoans = () => {
    setSelectedLoanData({
      isSalaryAdvance: activeSection === 'advance-salary',
      loanNameUuid: null,
      loanName: activeSection === 'advance-salary' ? "Advance Salary" : "Loan",
      cardData: null
    });
    
    setShowFormLoans(!showFormLoans);
  }

  const handleShowForm = () => {
    setShowFormLoans(!showFormLoans);
  }

  const getHeaderProps = () => {
    if (showFormLoans) {
      return {
        title: selectedLoanData ? 
          `Create ${selectedLoanData.loanName}` : 
          (activeSection === "loans" ? "Create Loan" : "Create Advance Salary"),
        isAddData: false,
        handleBack: handleShowForm
      };
    }
    
    if (selectedLoanData) {
      return {
        title: selectedLoanData.loanName,
        isAddData: true,
        addDataTitle: `Create ${activeSection === 'advance-salary' ? 'Advance Salary' : 'Loan'}`,
        handleShowModal: addLoans,
        handleBack: handleBackToSummary
      };
    }
    
    // Return null for cards view - no header needed
    return null;
  };

  const renderSummaryCards = (cards) => {
    if (!cards.length) {
      return (
        <div className="text-center text-gray-500 py-8">
          No {activeSection === 'advance-salary' ? 'advance salary' : 'loan'} data found
        </div>
      );
    }

    return cards.map((card) => (
      <div
        key={card.id}
        className={`bg-white h-[400px] w-full rounded-2xl p-4 border cursor-pointer hover:shadow-lg transition-shadow`}
        onClick={() => handleCardClick(card)}
      >
        <div className={`w-full h-full rounded-xl flex flex-col justify-between p-5 relative bg-gray-50`}>
          <div className="w-3 h-3 border-2 rounded-full absolute top-2 left-2 bg-white"></div>
          <div className="w-3 h-3 border-2 rounded-full absolute top-2 right-2 bg-white"></div>
          <div className="w-3 h-3 border-2 rounded-full absolute bottom-2 left-2 bg-white"></div>
          <div className="w-3 h-3 border-2 rounded-full absolute bottom-2 right-2 bg-white"></div>
          
          <div className="flex justify-end items-start mb-4">
            <ArrowUpRight size={70} className="text-gray-400" />
          </div>

          <div className="">
            <h3 className="text-4xl font-semibold text-gray-800 mb-4">
              {card.name.replace(/ Loan$/, '')}
            </h3>

            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-white font-medium">👤</span>
                </div>
                <div className="w-10 h-10 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-white font-medium">👤</span>
                </div>
                <div className="w-10 h-10 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-white font-medium">👤</span>
                </div>
              </div>
              <span className="text-xl font-medium">
                +{card.employeeCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const currentData = getCurrentData();
  const headerProps = getHeaderProps();

  return (
    <div className="w-full h-full flex flex-col items-start justify-start overflow-hidden">
      {/* Only show header when NOT in cards view */}
      {!showDetail && headerProps && (
        <HeaderReusable {...headerProps} />
      )}
      
      {showFormLoans ? (
        <div className="w-full flex-1 bg-white">
          <div className="w-full p-5">
            <LoanForm 
              setShowForm={handleShowForm} 
              isAdvance={selectedLoanData?.isSalaryAdvance}
              setSelectedLoanData={setSelectedLoanData}
            />
          </div>
        </div>
      ) : selectedLoanData ? (
        <LoanList 
          isAdvance={selectedLoanData.isSalaryAdvance}
          loanNameUuid={selectedLoanData.loanNameUuid}
          loanName={selectedLoanData.loanName}
          setSelectedLoanData={setSelectedLoanData}
          onBack={handleBackToSummary}
          showDetail={showDetail} 
          setShowDetail={setShowDetail}
        />
      ) : (
        <div className="flex w-full flex-1 items-start justify-start bg-white">
          {/* Sidebar */}
          <div className="w-64 flex flex-col p-5 h-full border-r border-gray-200 bg-white">
            <div className="">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Benefits</h2>
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg duration-300 ease-in-out transition-all cursor-pointer ${
                      activeSection === item.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSelectedLoanData(null);
                      setShowFormLoans(false);
                    }}
                  >
                    {item.icon}
                    <span className="font-medium">{item.title}</span>
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Cards View */}
          <div className="flex-1 h-full p-8 bg-white overflow-auto">
            {checkPermission(user, "Payslips", "View") ? (
              !currentData ? (
                <div className="text-center text-gray-500">Loading...</div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-6">
                    {renderSummaryCards(getFilteredSummaryCards())}
                  </div>
                </>
              )
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LoanPages;