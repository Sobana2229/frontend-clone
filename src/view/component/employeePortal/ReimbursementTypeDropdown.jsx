import { useState, useEffect, useRef } from "react";
import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react";

function ReimbursementTypeDropdown({ bill, index, formProps }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Calculate optimal width based on longest option text
  const allComponents =
    formProps?.dataReimbursementEmployee?.SalaryDetailComponents || [];
  let optimalWidth = 0;
  allComponents.forEach((el) => {
    if (el?.SalaryComponentReimbursement?.nameInPaysl) {
      const displayName = formProps?.formatReimbursementName(
        el?.SalaryComponentReimbursement?.nameInPaysl
      );
      // Estimate width: ~7px per character + padding + icon space
      const estimatedWidth = (displayName?.length || 0) * 7 + 80;
      if (estimatedWidth > optimalWidth) {
        optimalWidth = estimatedWidth;
      }
    }
  });

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Get selected display name
  const getSelectedDisplayName = () => {
    if (!bill.reimbursementUuid) return "Select";
    const selectedComponent =
      formProps?.dataReimbursementEmployee?.SalaryDetailComponents?.find(
        (el) => el.uuid === bill.reimbursementUuid
      );
    return selectedComponent
      ? formProps?.formatReimbursementName(
          selectedComponent?.SalaryComponentReimbursement?.nameInPaysl
        )
      : "Select";
  };

  // Filter components based on search term
  const getFilteredComponents = () => {
    const search = searchTerm.toLowerCase();
    let filtered = allComponents;

    if (search) {
      filtered = allComponents.filter((el) => {
        if (!el?.SalaryComponentReimbursement?.nameInPaysl) {
          return false;
        }
        const name =
          formProps
            ?.formatReimbursementName(
              el?.SalaryComponentReimbursement?.nameInPaysl
            )
            ?.toLowerCase() || "";
        return name.includes(search);
      });
    } else {
      filtered = allComponents.filter(
        (el) => el?.SalaryComponentReimbursement?.nameInPaysl
      );
    }

    return filtered;
  };

  // Handle selection
  const handleSelect = (uuid) => {
    formProps?.handleBillChange(index, "reimbursementUuid", uuid);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Calculate dropdown position
  const getDropdownPosition = () => {
    if (!dropdownRef.current) return { top: 0, left: 0 };
    const rect = dropdownRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 4,
      left: rect.left,
    };
  };

  const dropdownWidth = optimalWidth > 0 ? optimalWidth : 200;
  const position = isOpen ? getDropdownPosition() : { top: 0, left: 0 };
  const filteredComponents = getFilteredComponents();

  return (
    <div className="relative overflow-visible" ref={dropdownRef}>
      {/* Input Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="pl-[14px] pr-[36px] py-[10px] border border-gray-td-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-td-500 focus:border-blue-td-500 cursor-pointer flex items-center hover:border-blue-td-500 transition-colors relative"
        style={{
          width: optimalWidth > 0 ? `${optimalWidth}px` : "100%",
          minWidth: "200px",
        }}
      >
        <span
          className={`flex-1 min-w-0 truncate ${
            bill.reimbursementUuid ? "text-[#111827]" : "text-[#6B7280]"
          }`}
        >
          {getSelectedDisplayName()}
        </span>
        <CaretDown
          size={20}
          className={`absolute right-[12px] top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="fixed bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-[9999] max-h-[300px] overflow-hidden flex flex-col"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${dropdownWidth}px`,
            minWidth: "200px",
          }}
        >
          {/* Search Bar */}
          <div className="p-2 border-b border-[#E5E7EB]">
            <div className="relative">
              <MagnifyingGlass
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full pl-9 pr-3 py-2 border border-[#D1D5DB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1F87FF] focus:border-[#1F87FF]"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto max-h-[240px] flex flex-col">
            {filteredComponents.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[#6B7280]">
                No results found
              </div>
            ) : (
              filteredComponents.map((el) => {
                const isSelected = bill.reimbursementUuid === el.uuid;
                const displayName = formProps?.formatReimbursementName(
                  el?.SalaryComponentReimbursement?.nameInPaysl
                );

                return (
                  <button
                    key={el?.uuid}
                    type="button"
                    onClick={() => handleSelect(el.uuid)}
                    className={`w-full block text-left px-4 py-2 text-sm transition-colors relative whitespace-nowrap ${
                      isSelected
                        ? "bg-[#1F87FF] text-white"
                        : "text-[#111827] hover:bg-[#F9FAFB] hover:border-l-4 hover:border-blue-td-500"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1F87FF]"></div>
                    )}
                    <span className={isSelected ? "pl-2" : ""}>
                      {displayName}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReimbursementTypeDropdown;
