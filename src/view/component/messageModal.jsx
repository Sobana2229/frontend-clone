import { SignOut, Warning, X } from "@phosphor-icons/react"
import LoadingIcon from "./loadingIcon"

function MessageModal({setShowModal, message, toggle, submit, uuid, isLoading=false, logout, isLogout=false, subMessage}) {
  return (
    <>
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-[600px] bg-white rounded-lg shadow-lg">
          {!isLoading &&
            <div className="w-full h-16 flex items-center justify-between border-b px-5">
                {(!toggle && !isLogout) && 
                  <div className="flex items-center justify-start space-x-3">
                    <Warning size={20} className="text-[#E00038]" />
                    <h1 className="text-base font-medium">Error</h1>
                  </div>
                }
                {(!toggle && isLogout) && 
                  <div className="flex items-center justify-start space-x-3">
                    <SignOut size={20} weight="fill" className="text-[#E00038]" />
                    <h1 className="text-base font-medium">Log Out</h1>
                  </div>
                }
                <button onClick={() => setShowModal(false)}>
                  <X size={18} className="text-[#E00038]" />
                </button>
            </div>
          }

          <div className="w-full flex flex-col items-center justify-center p-10">
              <h1 className="text-xl font-medium w-full break-words text-center">{message}</h1>
              {isLoading && 
                <div className="h-[200px] w-[200px] mt-10">
                  <LoadingIcon color="red" />
                </div>
              }
            {subMessage && 
              <h1 className="text-sm font-medium w-full break-words text-center mt-5">{subMessage}</h1>
            }
          </div>
          {submit && 
            <div className="w-full flex items-center justify-center pb-10">
              <button 
                className="px-5 py-2 bg-[#E00038] text-white rounded-md flex items-center justify-center"
                onClick={() => submit(uuid)}
              >
                Procced
              </button>
            </div>
          }
          {logout && 
            <div className="w-full flex items-center justify-center pb-10">
              <button 
                className="px-5 py-2 bg-[#E00038] text-white rounded-md flex items-center justify-center"
                onClick={logout}
              >
                Procced
              </button>
            </div>
          }
        </div>
      </div>
    </>
  )
}

export default MessageModal
    