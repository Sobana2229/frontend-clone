import { CurrencyDollar, EnvelopeSimple, Info, MagnifyingGlass, MapPin, Percent, Suitcase } from "@phosphor-icons/react";
import { useState } from "react";
import { flagImage } from "../../../helper/globalHelper";
import Select from "react-select";

function ReuseableInput({ 
  label, 
  id,
  name,
  placeholder = "", 
  value, 
  onChange, 
  onBlur,
  required = false, 
  description,
  as = "input",
  children,
  isDisabled = false,
  isInfo = false,
  infoDescription,
  isIcon = false,
  iconFor,
  flagIso,
  labelUnshow = false,
  type="text",
  isFocusRing=false,
  isBorderLeft=false,
  isDollar=false,
  isPercentage=false,
  borderColor,
  rows = 3,
  cols,
  resize = "vertical",
  isDays = false,
  // for react-select
  selectOptionsReact = [],
  handleSelectChangeReact,
  selectedValueReact,
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const iconHandler = (name) => {
    switch(name) {
      case "email":
        return <EnvelopeSimple />
      case "suitcase":
        return <Suitcase />
      case "location":
        return <MapPin />
      case "search":
        return <MagnifyingGlass />
      default:
        return null;
    }
  }

  const getBorderLeftStyle = () => {
    if (!isBorderLeft) return {};
    const color = borderColor || "#1F87FF";
    return { borderLeft: `6px solid ${color}` };
  };

  const getResizeClass = () => {
    switch (resize) {
      case "none":
        return "resize-none";
      case "both":
        return "resize";
      case "horizontal":
        return "resize-x";
      case "vertical":
        return "resize-y";
      default:
        return "resize-y";
    }
  };

  return (
    <div className="flex-1 min-w-50 space-y-2">
      {!labelUnshow && label && (
        <label htmlFor={id} className="block text-base font-medium">
          {label}
          {required && <span className="text-blue-td-500">*</span>}
        </label>
      )}
      {description && (
        <p className="text-gray-td-600 text-sm font-light mb-1">
          {description}
        </p>
      )}

      {as === "select" ? (
        <div className="w-full relative flex items-center justify-start">
          {isIcon && (
            <div
              className={`absolute text-xl left-2 top-1/2 transform -translate-y-1/2 cursor-pointer`}
            >
              {iconHandler(iconFor)}
            </div>
          )}
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            disabled={isDisabled}
            style={getBorderLeftStyle()}
            className={`w-full ${
              flagIso ? "pl-14 pe-2" : isIcon ? "pl-10 pe-2" : "px-2"
            } py-2.5 ${
              isInfo ? "border-y border-s rounded-s-md" : "border rounded-md"
            } bg-white border-${borderColor ? borderColor : "gray-td-300"} text-base ring-0 outline-none
              ${isBorderLeft ? "border-l-[6px]" : ""}`}
          >
            {children}
          </select>
          {isInfo && (
            <div
              className="px-[9px] py-[9px] border-y border-r border-gray-td-300 rounded-r-md relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Info className="text-xl" />
              {showTooltip && (
                <div className="absolute w-[300px] h-fit -top-4 left-[200%] bg-black text-white font-light p-2 rounded-md space-y-2">
                  <h1 className="text-sm font-medium">{label}</h1>
                  <p className="text-xs">{infoDescription}</p>
                  <div className="absolute w-3 h-3 rotate-45 bg-black top-5 -translate-y-1/2 left-[-5px]"></div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : as === "textarea" ? (
        <div className="w-full relative">
          {isIcon && (
            <div
              className={`absolute text-xl left-2 top-3 cursor-pointer z-10`}
            >
              {iconHandler(iconFor)}
            </div>
          )}
          {flagIso && (
            <div
              className={`absolute text-xl left-2 top-3 cursor-pointer z-10`}
            >
              <img
                src={flagImage({ emoji: flagIso })}
                className="w-10 object-contain"
              />
            </div>
          )}
          <div className="relative flex-col">
            <textarea
              id={id}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              disabled={isDisabled}
              rows={rows}
              cols={cols}
              maxLength={1000}
              style={{ resize: "none", ...getBorderLeftStyle() }}
              className={`w-full ${
                flagIso ? "pl-14 pe-2" : isIcon ? "pl-10 pe-2" : "px-2"
              } py-2 border bg-white border-gray-td-300 rounded-md text-base focus:outline-none ${getResizeClass()}
                ${isFocusRing && "focus:ring-2 focus:ring-blue-td-500"} 
                ${isBorderLeft ? "border-l-[6px]" : ""}`}
            />
            <div className="w-full items-center justify-end text-xs flex text-gray-td-400">
              {value?.length || 0}/1000
            </div>
          </div>
          {isInfo && (
            <div
              className="absolute text-xl right-2 top-3 cursor-pointer z-10"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Info />
              {showTooltip && (
                <div className="absolute w-[300px] h-fit -top-4 left-[200%] bg-black text-white font-light p-2 rounded-md space-y-2">
                  <h1 className="text-sm font-medium">{label}</h1>
                  <p className="text-xs w-full whitespace-normal">
                    {infoDescription}
                  </p>
                  <div className="absolute w-3 h-3 rotate-45 bg-black top-5 -translate-y-1/2 left-[-5px]"></div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : as === "react-select" ? (
          <div className="w-full relative flex items-center justify-start">
            {isIcon && (
              <div
                className={`absolute text-xl left-2 top-1/2 transform -translate-y-1/2 cursor-pointer`}
              >
                {iconHandler(iconFor)}
              </div>
            )}
              <Select
                isDisabled={isDisabled}
                options={selectOptionsReact}
                onChange={handleSelectChangeReact}
                value={selectedValueReact}
                className='w-full bg-transparent focus:ring-0 outline-none text-sm rounded-lg'
                placeholder={placeholder}
                classNames={{
                  control: () => "!rounded-md !bg-white !h-full",
                  valueContainer: () => "!px-2 !py-1.5",
                  indicatorsContainer: () => "!px-1",
                }}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base, state) => ({
                    ...base,
                    borderLeftWidth: '6px',
                    borderLeftColor: borderColor || 'gray-td-300',
                    borderRadius: '6px',
                    borderColor: '#d1d5db',
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: '#d1d5db',
                      borderLeftColor: borderColor || '#1F87FF',
                    }
                  }),
                }}
                menuPortalTarget={document.body}
                filterOption={(option, rawInput) => {
                  if (option.value === "create-new-data") {
                    return true;
                  }
                  if (!option.label || typeof option.label !== 'string') {
                    return false;
                  }
                  return option.label.toLowerCase().includes(rawInput.toLowerCase());
                }}
              />
            {isInfo && (
              <div
                className="px-[9px] py-[9px] border-y border-r border-gray-td-300 rounded-r-md relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <Info className="text-xl" />
                {showTooltip && (
                  <div className="absolute w-[300px] h-fit -top-4 left-[200%] bg-black text-white font-light p-2 rounded-md space-y-2">
                    <h1 className="text-sm font-medium">{label}</h1>
                    <p className="text-xs">{infoDescription}</p>
                    <div className="absolute w-3 h-3 rotate-45 bg-black top-5 -translate-y-1/2 left-[-5px]"></div>
                  </div>
                )}
              </div>
            )}
          </div>
      )
      : 
      (
        <div className="w-full relative">
          {isIcon && (
            <div
              className={`absolute text-xl left-2 top-1/2 transform -translate-y-1/2 cursor-pointer`}
            >
              {iconHandler(iconFor)}
            </div>
          )}
          {flagIso && (
            <div
              className={`absolute text-xl left-2 top-1/2 transform -translate-y-1/2 cursor-pointer`}
            >
              <img
                src={flagImage({ emoji: flagIso })}
                className="w-10 object-contain"
              />
            </div>
          )}
          <input
            type={type}
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={isDisabled}
            style={getBorderLeftStyle()}
            className={`w-full ${
              flagIso ? "pl-14 pe-2" : isIcon ? "pl-10 pe-2" : "px-2"
            } py-2 border bg-white rounded-md text-base focus:outline-none
              ${type == "number" && isDollar && "ps-10"}
              ${isFocusRing && "focus:ring-2 focus:ring-blue-td-500"} 
              ${isBorderLeft ? "border-l-[6px]" : ""}`}
          />
          {isInfo && (
            <div
              className="absolute text-xl right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Info />
              {showTooltip && (
                <div className="absolute w-[300px] h-fit -top-4 left-[200%] bg-black text-white font-light p-2 rounded-md space-y-2">
                  <h1 className="text-sm font-medium">{label}</h1>
                  <p className="text-xs w-full whitespace-normal">
                    {infoDescription}
                  </p>
                  <div className="absolute w-3 h-3 rotate-45 bg-black top-5 -translate-y-1/2 left-[-5px]"></div>
                </div>
              )}
            </div>
          )}

          {(isDollar || isPercentage || isDays) && (
            <div
              style={isBorderLeft ? getBorderLeftStyle() : {}}
              className={`absolute text-xl ${
                isDollar ? "rounded-l-md left-0" : "rounded-r-md right-0"
              } top-1/2 transform -translate-y-1/2 h-full px-2 flex items-center justify-center border ${
                isBorderLeft
                  ? "border-l-[6px] text-gray-td-400"
                  : "bg-gray-td-50"
              }`}
            >
              {isDollar ? (
                <CurrencyDollar size={15} />
              ) : isPercentage ? (
                <Percent size={15} />
              ) : (
                <p className="text-sm">Days</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default ReuseableInput;