import { useEffect, useRef } from 'react';

function ViewSplitUpPopUp({ setShowSplitup, isEmployee=false, subComponents, isDisplay=false }) {
    const popupRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowSplitup(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setShowSplitup]);

    return (
        <div 
            ref={popupRef}
            className={`absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-4 ${isDisplay ? "w-[300px]" : "w-1/2"} top-10 right-0`}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-normal text-blue-td-500">CONTRIBUTION RATE</span>
                <button 
                    onClick={() => setShowSplitup(false)}
                    className="text-red-td-500 text-lg font-semibold">
                    X
                </button>
            </div>
            
            <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-normal text-gray-700 py-2 border-y border-gray-200">
                    <span>SUB COMPONENTS</span>
                    <span>{isEmployee ? "EMPLOYEE'S CONTRIBUTION" : "EMPLOYER'S CONTRIBUTION"}</span>
                </div>
                {subComponents?.map((el, indx) => {
                    return(
                        <div key={indx} className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-blue-td-500">{el?.salaryGroup}</span>
                            </div>
                            <span className="text-xs font-normal text-gray-900">{el?.contributionRate}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default ViewSplitUpPopUp;