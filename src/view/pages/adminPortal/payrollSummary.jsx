import { useState, useEffect } from "react";
import { Calendar, X } from "@phosphor-icons/react";
import dayjs from "dayjs";
import YearPicker from "../../component/reports/YearPicker";

function PayrollSummary() {
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  // Mock data - replace with actual API call
  const [summaryData, setSummaryData] = useState({
    organizationName: "Emaar 4",
    startDate: "01/04/2025",
    endDate: "31/03/2026",
    earnings: [
      { component: "Basic", amount: 1046880.0 },
      { component: "House Rent Allowance", amount: 369440.0 },
      { component: "Conveyance Allowance", amount: 35000.0 },
      { component: "Transport Allowance", amount: 19200.0 },
      { component: "Transport Allowance", amount: 28000.0 },
      { component: "On Site", amount: 118375.0 },
      { component: "Telephone Allowance", amount: 13300.0 },
      { component: "Fixed Allowance", amount: 149260.0 },
      {
        component: "Unclaimed Vehicle Maintenance Reimbursement",
        amount: 94000.0,
      },
      { component: "Unclaimed Dress", amount: 0.0 },
    ],
    totalGrossPay: 0.0, // Will be calculated
    benefits: [
      { component: "SPK Employee Contribution", amount: 0.0 },
      { component: "SPK Employer Contribution", amount: 0.0 },
      { component: "SPK Admin Charges", amount: 0.0 },
      { component: "Employee State Insurance", amount: 0.0 },
      { component: "Labour Welfare Fund", amount: 0.0 },
    ],
    donations: [{ component: "Zakath Sal", amount: 0.0 }],
    deductions: [
      { component: "Business", amount: 0.0 },
      { component: "Gold", amount: 0.0 },
    ],
    taxes: [
      { component: "Income Tax", amount: 53691.0 },
      { component: "TN Professional Tax - Tamil Nadu", amount: 3750.0 },
    ],
    reimbursements: [
      { component: "Fuel Reimbursement", amount: 0.0 },
      { component: "Vehicle Maintenance Reimbursement", amount: 0.0 },
      { component: "Laptop", amount: 0.0 },
      { component: "Dress", amount: 0.0 },
    ],
    netPay: 1660379.0,
  });

  useEffect(() => {
    // TODO: Fetch data from API based on selectedYear
    // const fetchSummaryData = async () => {
    //   const access_token = localStorage.getItem("accessToken");
    //   // API call here
    // };
    // fetchSummaryData();
  }, [selectedYear]);

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    // Update date range based on selected year (assuming financial year April to March)
    const startDate = dayjs(`${year}-04-01`);
    const endDate = startDate.add(1, "year").subtract(1, "day");
    setSummaryData((prev) => ({
      ...prev,
      startDate: startDate.format("DD/MM/YYYY"),
      endDate: endDate.format("DD/MM/YYYY"),
    }));
  };

  const formatYearDisplay = (year) => {
    if (!year) return "Select Year";
    const currentYear = dayjs().year();
    const prevYear = currentYear - 1;

    if (year === prevYear) {
      return "Previous Year";
    }
    if (year === currentYear) {
      return "This Year";
    }
    return year.toString();
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "0.00";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return numValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const calculateTotalEarnings = () => {
    return summaryData.earnings.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
  };

  const calculateTotalGrossPay = () => {
    return calculateTotalEarnings();
  };

  const calculateTotalBenefits = () => {
    return summaryData.benefits.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
  };

  const calculateTotalDonations = () => {
    return summaryData.donations.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
  };

  const calculateTotalDeductions = () => {
    return summaryData.deductions.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
  };

  const calculateTotalTaxes = () => {
    return summaryData.taxes.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const calculateTotalReimbursements = () => {
    return summaryData.reimbursements.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
  };

  // Helper function to render section rows
  const renderSectionRows = (items, sectionKey) => {
    return items.map((item, index) => (
      <tr
        key={`${sectionKey}-${index}`}
        className="bg-white transition-colors hover:bg-[#F9FAFB]"
      >
        <td className="pl-8 pr-2 py-3 text-[16px] text-left text-[#374151] border-b border-[#E5E7EB]">
          {item.component}
        </td>
        <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151] border-b border-[#E5E7EB]">
          ${formatCurrency(item.amount)}
        </td>
      </tr>
    ));
  };

  // Helper function to render total row
  const renderTotalRow = (label, amount, fontSize = "18px") => {
    return (
      <tr className="bg-white relative">
        <td
          className="pl-8 pr-2 py-3 text-[#374151] text-right relative"
          style={{ fontSize }}
        >
          {label}
          <div className="absolute bottom-0 left-1/2 right-0 border-b border-[#E5E7EB]"></div>
        </td>
        <td
          className="pl-2 pr-8 py-3 text-right text-[#374151] relative"
          style={{ fontSize }}
        >
          ${formatCurrency(amount)}
          <div className="absolute bottom-0 left-0 right-0 border-b border-[#E5E7EB]"></div>
        </td>
      </tr>
    );
  };

  // Helper function to render section
  const renderSection = (title, items, calculateTotal, sectionKey) => {
    return (
      <>
        <tr className="bg-white">
          <td className="pl-8 pr-2 py-3 text-[16px] text-left text-[#374151]">
            {title}
          </td>
          <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151]"></td>
        </tr>
        {renderSectionRows(items, sectionKey)}
        {renderTotalRow(`Total ${title}`, calculateTotal())}
      </>
    );
  };

  return (
    <div className="w-full h-full bg-[#F9FAFB] flex flex-col overflow-hidden">
      {/* Sticky Top Bar */}
      <div className="flex-shrink-0 sticky top-0 z-10 bg-[#F9FAFB]">
        <div className="w-full flex items-center justify-between h-16 px-6 border-b border-[#E5E7EB] bg-white">
          <h1 className="text-xl font-medium text-[#111827]">Reports</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-md bg-white">
              <Calendar size={16} className="text-[#6B7280]" />
              <YearPicker
                selectedYear={selectedYear}
                onYearSelect={handleYearSelect}
                formatYearDisplay={formatYearDisplay}
              />
            </div>
            <button
              onClick={() => {
                // Handle clear/reset if needed
              }}
              className="p-2 hover:bg-[#F9FAFB] rounded-md transition-colors"
            >
              <X size={16} className="text-[#6B7280]" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full p-6">
          <div className="w-full flex-col flex items-start justify-start bg-white rounded-xl">
            <div className="w-full p-6">
              {/* Title Section */}
              <div className="text-center mb-8">
                <h2 className="text-lg font-regular text-[#374151] mb-2">
                  {summaryData.organizationName}
                </h2>
                <h3 className="text-xl font-regular text-[#1F2937] mb-2">
                  Payroll Summary
                </h3>
                <p className="text-sm font-regular text-[#4B5563]">
                  {summaryData.startDate} to {summaryData.endDate}
                </p>
              </div>

              {/* Pay Components Table */}
              <div className="mb-6 mx-6">
                <table className="w-full">
                  <colgroup>
                    <col style={{ width: "65%" }} />
                    <col style={{ width: "35%" }} />
                  </colgroup>
                  <thead>
                    <tr className="bg-[#F5FAFF]">
                      <th className="pl-8 pr-2 py-4 text-left text-sm font-medium text-[#4A9EFF]">
                        PAY COMPONENTS
                      </th>
                      <th className="pl-2 pr-8 py-4 text-right text-sm font-medium text-[#4A9EFF]">
                        AMOUNT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Earnings Section */}
                    <tr className="bg-white">
                      <td className="pl-8 pr-2 py-3 text-[16px] text-left text-[#374151]">
                        Earnings
                      </td>
                      <td className="pl-2 pr-8 py-3 text-[16px] text-right text-[#374151]"></td>
                    </tr>
                    {renderSectionRows(summaryData.earnings, "earnings")}
                    {renderTotalRow(
                      "Total Gross Pay",
                      calculateTotalGrossPay()
                    )}

                    {/* Benefits Section */}
                    {renderSection(
                      "Benefits",
                      summaryData.benefits,
                      calculateTotalBenefits,
                      "benefits"
                    )}

                    {/* Donations Section */}
                    {renderSection(
                      "Donations",
                      summaryData.donations,
                      calculateTotalDonations,
                      "donations"
                    )}

                    {/* Deductions Section */}
                    {renderSection(
                      "Deductions",
                      summaryData.deductions,
                      calculateTotalDeductions,
                      "deductions"
                    )}

                    {/* Taxes Section */}
                    {renderSection(
                      "Taxes",
                      summaryData.taxes,
                      calculateTotalTaxes,
                      "taxes"
                    )}

                    {/* Reimbursements Section */}
                    {renderSection(
                      "Reimbursements",
                      summaryData.reimbursements,
                      calculateTotalReimbursements,
                      "reimbursements"
                    )}

                    {/* Net Pay */}
                    <tr className="bg-white border-b border-[#E5E7EB]">
                      <td
                        className="pl-8 pr-2 py-3 text-left text-[#374151]"
                        style={{ fontSize: "20px" }}
                      >
                        Net Pay
                      </td>
                      <td
                        className="pl-2 pr-8 py-3 text-right text-[#374151]"
                        style={{ fontSize: "20px" }}
                      >
                        ${formatCurrency(summaryData.netPay)}
                      </td>
                    </tr>
                    {/* Empty row to maintain consistent background color below Net Pay border */}
                    <tr className="bg-white">
                      <td className="pl-8 pr-2 py-3"></td>
                      <td className="pl-2 pr-8 py-3"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayrollSummary;
