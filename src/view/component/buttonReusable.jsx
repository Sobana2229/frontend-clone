import LoadingIcon from "./loadingIcon";

function ButtonReusable({title, action, isBLue = true, isLoading=false, disabled=false, isRed=false}) {
    return (
        <button 
            onClick={action} 
            disabled={isLoading || disabled}
            className={`capitalize px-5 py-2 ${
                isBLue ? "bg-blue-td-600 text-white border-2 border-blue-td-600" : 
                isRed ? "bg-red-td-600 text-white border-2 border-red-td-600" : 
                "bg-white text-black border-2"
            } rounded-md`}
            >
                {isLoading ? 
                    <div className="w-5 h-5">
                        <LoadingIcon color="white" /> 
                    </div>
                    : 
                    title
                }
        </button>
    );
}

export default ButtonReusable;