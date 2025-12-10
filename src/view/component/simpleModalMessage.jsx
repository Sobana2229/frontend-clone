import { Info, PencilLine, X } from "@phosphor-icons/react";
import ButtonReusable from "./buttonReusable";
import { useState } from "react";

function SimpleModalMessage({message, showModal, setShowModal, handleConfirm, isDelete=false, title, tempUuid, isInput=false, modalFor}) {
    const [inputUser, setInputUser] = useState('');
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-1/3 bg-white py-5 rounded-md shadow-md">
                {(isDelete && modalFor != "loan") && (
                    <div className="w-full flex items-center justify-start border-b px-5 pb-2 space-x-2">
                        <PencilLine />
                        <h1 className="text-lg font-light capitalize">Delete {title}</h1> 
                        <div className="flex-1 flex items-center justify-end">
                            <button onClick={() => setShowModal(!showModal)} className="h-5 w-5 rounded-full border-2 border-blue-td-500 flex items-center justify-center text-sm text-blue-td-500">
                                X
                            </button>
                        </div>
                    </div>
                )}
                <div className="text-sm space-y-5 px-5 py-5">
                    <div className="w-full flex">
                        {isDelete && (
                            <div className="w-[10%] h-full flex items-center justify-center">
                                <Info className="text-2xl text-yellow-td-400" />
                            </div>
                        )}
                        <p className="w-[90%] text-left text-base">
                            {message}
                        </p>
                    </div>
                    {isInput && (
                        <input 
                            onChange={(e) => setInputUser(e.target.value)}
                            type="text" 
                            className="w-full border-[1px] px-2 py-2 rounded-md" 
                        />
                    )}
                </div>
                <div className="w-full flex items-center justify-between space-x-2 pt-5 border-t px-5">
                    <div className="flex items-start justify-start space-x-2">
                        <ButtonReusable title={isDelete ? "delete" : "save"} action={() => handleConfirm(tempUuid, true, inputUser)} />
                        <ButtonReusable title={"cancel"} action={() => setShowModal(!showModal)} isBLue={false} />
                    </div>
                    {!isDelete && (
                        <span className="text-red-td-300 font-normal">* indicates mandatory fields</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SimpleModalMessage;