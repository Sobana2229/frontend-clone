import {
  CurrencyDollar,
  CalendarBlank,
  CurrencyCircleDollar,
  FileText,
  CaretDown,
} from "@phosphor-icons/react";

function SalaryDetailsSidebar({ activeTab, onTabChange, showDropdown, onToggleDropdown }) {
  const menuItems = [
    {
      id: "salary-structure",
      label: "Salary Structure",
      icon: CurrencyDollar,
      value: "Salary Structure",
      hasDropdown: false,
    },
    {
      id: "payslips",
      label: "Payslips",
      icon: CalendarBlank,
      value: "Payslips",
      hasDropdown: false,
    },
    {
      id: "annual-earnings",
      label: "Annual Earnings",
      icon: CurrencyCircleDollar,
      value: "Annual Earnings",
      hasDropdown: false,
    },
    {
      id: "epf-contribution",
      label: "SPK Contribution Summary",
      icon: FileText,
      value: "SPK Contribution Summary",
      hasDropdown: false,
      subTabs: [
        "EPF Contribution Summary",
        "Employee State Insurance Summary",
        "TN Labour Welfare Fund Summary",
      ],
    },
  ];

  // Check if a menu item is active
  const isMenuItemActive = (item) => {
    if (item.hasDropdown && item.subTabs) {
      return item.subTabs.includes(activeTab);
    }
    return activeTab === item.value;
  };

  return (
    <div className="w-full h-full bg-[#E5E7EB] flex flex-col">
      {/* Header - Title inside sidebar */}
      <div className="px-6 py-6">
        <h1 className="text-xl font-semibold text-[#111827]">Salary Details</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = isMenuItemActive(item);
          const isDropdownOpen = showDropdown[item.id];

          return (
            <div key={item.id} className="relative">
              <button
                onClick={() => {
                  if (item.hasDropdown) {
                    onToggleDropdown(item.id);
                  } else {
                    onTabChange(item.value);
                  }
                }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-white text-[#1F87FF] shadow-sm"
                    : "text-[#6B7280] hover:bg-white/50 hover:text-[#374151]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent
                    size={20}
                    weight="regular"
                    className={isActive ? "text-[#1F87FF]" : "text-[#6B7280]"}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-[#1F87FF]" : "text-[#6B7280]"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {item.hasDropdown && (
                  <CaretDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    } ${isActive ? "text-[#1F87FF]" : "text-[#6B7280]"}`}
                  />
                )}
              </button>

              {/* Dropdown Menu */}
              {item.hasDropdown && isDropdownOpen && (
                <div className="mt-2 ml-4 space-y-1">
                  {item.subTabs?.map((subTab) => {
                    const isSubActive = activeTab === subTab;
                    return (
                      <button
                        key={subTab}
                        onClick={() => onTabChange(subTab)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left rounded-lg transition-all duration-200 ${
                          isSubActive
                            ? "bg-white text-[#1F87FF] shadow-sm"
                            : "text-[#6B7280] hover:bg-white/50 hover:text-[#374151]"
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            isSubActive ? "text-[#1F87FF]" : "text-[#6B7280]"
                          }`}
                        >
                          {subTab}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export default SalaryDetailsSidebar;

