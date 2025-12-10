// Update ToggleAction component untuk handle tanpa data parameter
function ToggleAction({isEnabled, handleSubmit, data, color, setAction, Action}) {
    const handleToggle = (e) => {
        const isChecked = e.target.checked;
        e.stopPropagation();
        
        // Jika ada handleSubmit dan data, gunakan flow lama
        if (handleSubmit && data) {
            handleSubmit(data["uuid"], isChecked);
        }
        // Jika ada setAction, gunakan flow baru
        else if (setAction) {
            setAction(isChecked);
        }
    };

    // Determine checked state
    const checkedState = isEnabled !== undefined ? isEnabled : Action;

    const customStyles = color ? {
        '--tw-ring-color': color,
    } : {};

    return (
        <label 
            className="relative inline-flex items-center cursor-pointer"
            onClick={(e) => e.stopPropagation()}
        >
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checkedState}
                onChange={handleToggle}
                onClick={(e) => e.stopPropagation()}
            />
            <div 
                className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                    color == "orange" ? "peer-focus:ring-[#FF8800] peer-checked:bg-[#FF8800]" :
                    "peer-focus:ring-blue-500 peer-checked:bg-blue-600"
                }`}
                style={customStyles}
            ></div>
        </label>
    );
}

export default ToggleAction