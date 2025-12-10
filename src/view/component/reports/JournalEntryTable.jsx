function JournalEntryTable({ title, date, entries, showTotal = true, showTotalWithoutLabel = false }) {
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "0.00";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return numValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const calculateTotalDebit = () => {
    return entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  };

  const calculateTotalCredit = () => {
    return entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
  };

  return (
    <div className="mb-8">
      {/* Table */}
      <div>
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5FAFF]">
              <th className="px-6 py-4 text-left text-sm font-medium text-[#4A9EFF]">
                {date} - {title}
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-[#4A9EFF]">
                DEBIT
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-[#4A9EFF]">
                CREDIT
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              return (
                <tr
                  key={index}
                  className="bg-white transition-colors hover:bg-[#F9FAFB]"
                >
                  <td className="px-6 py-5 text-left text-sm text-[#374151]">
                    <p className="truncate">{entry.account}</p>
                  </td>
                  <td className="px-6 py-5 text-right text-sm text-[#374151]">
                    <p>{formatCurrency(entry.debit)}</p>
                  </td>
                  <td className="px-6 py-5 text-right text-sm text-[#374151]">
                    <p>{formatCurrency(entry.credit)}</p>
                  </td>
                </tr>
              );
            })}
            {showTotal && (
              <tr className="bg-white transition-colors hover:bg-[#F9FAFB]">
                <td className="px-6 py-5 text-left text-sm font-semibold text-[#374151]">
                  {!showTotalWithoutLabel && <p>Total</p>}
                </td>
                <td className="px-6 py-5 text-right text-sm font-semibold text-[#374151]">
                  <p>{formatCurrency(calculateTotalDebit())}</p>
                </td>
                <td className="px-6 py-5 text-right text-sm font-semibold text-[#374151]">
                  <p>{formatCurrency(calculateTotalCredit())}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default JournalEntryTable;

