function CustomOption({ 
  props, 
  onCreateNew, 
  createNewLabel = "Create New Item" 
}) {
  const { data, innerRef, innerProps } = props;
  
  if (data.value === 'create-new-data') {
    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="flex items-center space-x-2 p-3 text-blue-600 hover:bg-blue-50 cursor-pointer border-t"
        onClick={onCreateNew}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>{createNewLabel}</span>
      </div>
    );
  }

  return (
    <div
      ref={innerRef}
      {...innerProps}
      className={`p-3 cursor-pointer ${
        props.isSelected ? 'bg-blue-600 text-white' : props.isFocused ? 'bg-blue-50' : 'hover:bg-gray-50'
      }`}
    >
      {data.label}
    </div>
  );
}

export default CustomOption;