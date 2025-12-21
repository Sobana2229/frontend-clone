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
      className={`p-3 cursor-pointer relative ${
        props.isSelected ? 'bg-blue-600 text-white' : props.isFocused ? 'bg-gray-100' : 'hover:bg-gray-100'
      }`}
    >
      {(props.isFocused || props.isSelected) && (
        <div 
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '40px',
            backgroundColor: '#000000',
            borderRadius: '0 2px 2px 0'
          }}
        />
      )}
      <div style={{ paddingLeft: '8px' }}>
        {data.label}
      </div>
    </div>
  );
}

export default CustomOption;