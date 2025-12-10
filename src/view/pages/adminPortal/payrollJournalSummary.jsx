import { useState, useEffect } from "react";
import { Calendar } from "@phosphor-icons/react";
import dayjs from "dayjs";
import PeriodPickerWithQuickOptions from "../../component/reports/PeriodPickerWithQuickOptions";
import JournalEntryTable from "../../component/reports/JournalEntryTable";

function PayrollJournalSummary() {
  const [selectedMonth, setSelectedMonth] = useState(
    dayjs().subtract(1, "month").format("YYYY-MM")
  );

  // Mock data - replace with actual API call
  const [journalData, setJournalData] = useState({
    organizationName: "Emaar 4",
    startDate: "01/09/2025",
    endDate: "30/09/2025",
    payrollJournal: {
      date: "04/09/2025",
      entries: [
        {
          account: "Salaries and Employee Wages",
          debit: 346749.95,
          credit: 0.0,
        },
        {
          account: "Reimbursements Payable",
          debit: 0.0,
          credit: 13000.0,
        },
        {
          account: "Payroll Tax Payable",
          debit: 0.0,
          credit: 14486.0,
        },
        {
          account: "Statutory Deductions Payable",
          debit: 0.0,
          credit: 44705.95,
        },
        {
          account: "Net Salary Payable",
          debit: 0.0,
          credit: 267558.0,
        },
        {
          account: "Tekydoct Payroll - Loan Account",
          debit: 0.0,
          credit: 7000.0,
        },
      ],
    },
    salaryPayment: {
      date: "04/09/2025",
      entries: [
        {
          account: "Net Salary Payable",
          debit: 267558.0,
          credit: 0.0,
        },
      ],
    },
  });

  useEffect(() => {
    // TODO: Fetch data from API based on selectedMonth
    // const fetchJournalData = async () => {
    //   const access_token = localStorage.getItem("accessToken");
    //   // API call here
    // };
    // fetchJournalData();
  }, [selectedMonth]);

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    // Update date range based on selected month
    const monthDate = dayjs(month);
    const startDate = monthDate.startOf("month");
    const endDate = monthDate.endOf("month");
    setJournalData((prev) => ({
      ...prev,
      startDate: startDate.format("DD/MM/YYYY"),
      endDate: endDate.format("DD/MM/YYYY"),
    }));
  };

  const formatPeriodDisplay = (period) => {
    if (!period) return "Select Month";
    const periodDate = dayjs(period);
    const currentMonth = dayjs();
    const prevMonth = currentMonth.subtract(1, "month");

    if (periodDate.isSame(prevMonth, "month")) {
      return "Previous Month";
    }
    if (periodDate.isSame(currentMonth, "month")) {
      return "Current Month";
    }
    return periodDate.format("MMMM YYYY");
  };

  return (
    <div className="w-full h-full bg-[#F9FAFB] flex flex-col overflow-hidden">
      {/* Sticky Top Bar */}
      <div className="flex-shrink-0 sticky top-0 z-10 bg-[#F9FAFB]">
        <div className="w-full flex items-center justify-between h-16 px-6 border-b border-[#E5E7EB] bg-white">
          <h1 className="text-xl font-medium text-[#111827]">Reports</h1>
          <div className="flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-md bg-white">
            <Calendar size={16} className="text-[#6B7280]" />
            <PeriodPickerWithQuickOptions
              selectedPeriod={selectedMonth}
              onPeriodSelect={handleMonthSelect}
              formatPeriodDisplay={formatPeriodDisplay}
            />
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full h-full p-6">
          <div className="w-full h-full flex-col flex items-start justify-start bg-white rounded-xl">
            <div className="w-full p-6">
              {/* Title Section */}
              <div className="text-center mb-8">
                <h2 className="text-lg font-regular text-[#374151] mb-2">
                  {journalData.organizationName}
                </h2>
                <h3 className="text-xl font-regular text-[#1F2937] mb-2">
                  Payroll Journal Summary
                </h3>
                <p className="text-sm font-regular text-[#4B5563]">
                  {journalData.startDate} to {journalData.endDate}
                </p>
              </div>

              {/* Payroll Journal Entry */}
              <JournalEntryTable
                title="PAYROLL JOURNAL"
                date={journalData.payrollJournal.date}
                entries={journalData.payrollJournal.entries}
                showTotal={true}
                showTotalWithoutLabel={true}
              />

              {/* Salary Payment Entry */}
              <JournalEntryTable
                title="SALARY PAYMENT"
                date={journalData.salaryPayment.date}
                entries={journalData.salaryPayment.entries}
                showTotal={true}
                showTotalWithoutLabel={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayrollJournalSummary;
