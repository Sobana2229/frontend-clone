import { ArrowDown, CalendarBlankIcon, CaretLeftIcon, DotsThree, Funnel, X } from "@phosphor-icons/react";
import React, { useEffect, useRef, useState } from "react";
import { fileOptions, LeaveAndAttandanceLocations } from "../../../../data/dummy";

function HeaderLeaveAndAttendance({section, sideMenuActive, handleConfiguration, handleShowForm, activeForm, handleOption, showFormUpload, isUpdate=false}) {
    const [showFilter, setShowFilter] = useState(false);
    const [showOption, setShowOption] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [selectedYear, setSelectedYear] = useState(2025);
    const [selectedLocation, setSelectedLocation] = useState("all");
    const dropdownRef = useRef(null);
    const yearDropdownRef = useRef(null);
    const locationDropdownRef = useRef(null);
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = currentYear - 4; i <= currentYear + 1; i++) {
        yearOptions.push(i);
    }

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowOption(false);
        }
      };
      if (showOption) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showOption]);

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        setShowYearDropdown(false);
    };

    const handleLocationSelect = (location) => {
        setSelectedLocation(location.value);
        setShowLocationDropdown(false);
    };

    const getSelectedLocationLabel = () => {
        const location = LeaveAndAttandanceLocations.find(loc => loc.value === selectedLocation);
        return location ? location.label : "All Locations";
    };
    return (
      <>
        {(activeForm || showFormUpload) ? (
          <div className="w-full bg-white border-b py-2 border-gray-200">
            <div className="flex items-center justify-between p-1">
              {/* filter old */}
              <div className="flex items-center justify-center px-5">
                <h2 className="text-lg font-medium text-gray-800 capitalize">{showFormUpload ? `${section === "attendance" && sideMenuActive ? sideMenuActive : section} - Select File` : `${isUpdate ? "Update" : "Add"} ${section === "attendance" && sideMenuActive ? sideMenuActive : section}`} </h2>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full bg-white border-b py-2 border-gray-200">
            <div className="flex items-center justify-between p-2">
              {/* filter old */}
              <button onClick={() => handleConfiguration(section)} className="flex items-center justify-center space-x-2 ps-3">
                <div className="w-6 h-6 flex items-center justify-center bg-blue-50 rounded-full">
                  <CaretLeftIcon weight="fill" className="text-sm font-bold text-blue-500" />
                </div>
                <h2 className="text-lg font-medium text-gray-800 capitalize">{sideMenuActive || section}</h2>
              </button>
              
              <div className="flex items-center space-x-5">
                <div className="flex items-center justify-center space-x-3">
                  <div className="flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 relative rounded-md">
                    <button onClick={
                      ()=> {
                        const sectionToPass = section === "attendance" && sideMenuActive ? sideMenuActive : section;
                        handleShowForm(sectionToPass)
                      }}
                      className="px-3 py-1.5"
                    >
                      <p className="text-sm">+ Add New</p>
                    </button>
                  </div>
                  
                  <div onClick={() => setShowOption(!showOption)} className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-md border relative" ref={dropdownRef}>
                    <DotsThree className="text-xl" />
                    {showOption && (
                      <div className="w-[150px] mt-2 h-fit absolute right-0 top-full rounded-md border flex flex-col justify-start items-start bg-white p-1 z-50">
                        {fileOptions?.map((option, index) => (
                          <React.Fragment key={index}>
                            <button
                              onClick={() => handleOption(option)}
                              className="p-2 w-full text-sm font-light text-black hover:bg-gray-100 flex items-center justify-start"
                            >
                              {index === 0 ? option : `Export as ${option}`}
                            </button>
                            {index === 0 && <div className="w-full h-[1px] bg-gray-300 px-2"></div>}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button onClick={() => setShowFilter(!showFilter)} className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-md border">
                    <Funnel className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
            
            {showFilter && (
              <div className="flex items-center px-4 py-2 border-t border-gray-200">
                <span className="text-xs text-gray-500 mr-4">FILTER BY :</span>
                
                <div className="flex space-x-4">
                  {/* Year Dropdown */}
                  <div className="relative flex items-center text-gray-600 space-x-2 border-r pr-4" ref={yearDropdownRef}>
                    <CalendarBlankIcon className="h-3 w-3" />
                    <button 
                      onClick={() => setShowYearDropdown(!showYearDropdown)}
                      className="text-sm hover:text-gray-800 flex items-center space-x-1"
                    >
                      <span>{selectedYear}</span>
                      <ArrowDown className="h-3 w-3" />
                    </button>
                    
                    {showYearDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-20 bg-white border rounded-md shadow-lg z-10">
                        {yearOptions.map((year) => (
                          <button
                            key={year}
                            onClick={() => handleYearSelect(year)}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                              selectedYear === year ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Location Dropdown */}
                  <div className="relative flex items-center text-gray-600 space-x-2" ref={locationDropdownRef}>
                    <button 
                      onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                      className="text-sm hover:text-gray-800 flex items-center space-x-1"
                    >
                      <span>{getSelectedLocationLabel()}</span>
                      <ArrowDown className="h-3 w-3" />
                    </button>
                    
                    {showLocationDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                        {LeaveAndAttandanceLocations.map((location) => (
                          <button
                            key={location.value}
                            onClick={() => handleLocationSelect(location)}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                              selectedLocation === location.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            {location.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="ml-auto">
                  <button onClick={() => setShowFilter(false)} className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </>
    );
}

export default HeaderLeaveAndAttendance;
  