import { DotsThreeOutline, Flag, Pencil, User} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import ReuseableInput from "../reuseableInput";
import organizationStoreManagements from "../../../store/tdPayroll/setting/organization";

function CardSetting({ data, cardFor, handleEdit, handleActionPopUp }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)
    const { organizationDetail } = organizationStoreManagements();

    useEffect(() => {
        const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
            setMenuOpen(false)
        }
        }
            document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleAction = (uuid, type) => {
        setMenuOpen(false)
        handleActionPopUp(uuid, type);
    }
    return (
    <div className={`bg-white w-full rounded-lg overflow-hidden shadow-md space-y-4 border-l-8 
        ${data?.isAddressFilled ? "border-green-td-600" : 
        data?.status === "inactive" ? "border-gray-td-600" : 
        "border-blue-td-600"}`
    }>
        <div className="w-full h-fit p-5 space-y-5">
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center justify-start space-x-3">
                    <h1 className="font-bold text-base">{data?.workLocationName}</h1>
                    {data?.isAddressFilled && (
                        <div className="flex justify-start items-center space-x-1 text-green-td-500">
                            <Flag weight="fill" />
                            <p>{data?.isAddressFilled && "Filling Address"}</p>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-center space-x-2">
                    <button onClick={() => {
                        handleEdit(data?.uuid)
                    }} className="">
                        <Pencil className="text-base" />
                    </button>
                    <button onClick={() => {
                        setMenuOpen(!menuOpen) 
                    }} className="">
                        <DotsThreeOutline weight="fill" className="text-base rotate-90" />
                    </button>
                    <div className="relative" ref={menuRef}>
                        {/* Dropdown menu */}
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-50">
                                <button
                                    onClick={() => handleAction(data?.uuid)}
                                    className="w-full text-left text-black px-4 py-2 duration-100 ease-in-out transition-all hover:bg-blue-td-50 hover:text-blue-600 hover:border-l-4 hover:border-blue-td-600"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleAction(data?.uuid, "status")}
                                    className="w-full text-left text-black px-4 py-2 duration-100 ease-in-out transition-all hover:bg-blue-td-50 hover:text-blue-600 hover:border-l-4 hover:border-blue-td-600"
                                >
                                    Mark as {data?.status== "inactive" ? "Active" : 'Inactive'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {data && (
                <div className="w-full flex flex-col space-y-3">
                    <ReuseableInput
                        id="addressLine1"
                        name="addressLine1"
                        placeholder="Address Line 1..."
                        value={data?.addressLine1}
                        required
                        isIcon={true}
                        iconFor={"location"}
                        isDisabled={true}
                    />
                    <ReuseableInput
                        id="addressLine2"
                        name="addressLine2"
                        placeholder="Address Line 2..."
                        value={data?.addressLine2}
                        required
                        isIcon={true}
                        iconFor={"location"}
                        isDisabled={true}
                    />
                    <ReuseableInput
                        id="businessLocation"
                        name="businessLocation"
                        placeholder="Business Location..."
                        value={organizationDetail?.Country?.name}
                        required
                        flagIso={organizationDetail?.flagIso}
                        isDisabled={true}
                    />
                </div>
            )}
        </div>
        <div className="w-full flex items-center justify-end ps-5 relative">
            <div className={`flex items-center text-xs justify-center 
                ${data?.isAddressFilled ? "text-green-td-600 bg-green-td-50 border-green-td-600" : 
                data?.status === "inactive" ? "text-gray-td-600 bg-gray-td-50 border-gray-td-600" : 
                "text-blue-td-600 bg-blue-td-50 border-blue-td-600"} space-x-1 p-1.5  border-l-4`
            }>
                <User className="text-base" />
                <p>{data?.totalEmployee}</p>
                <p>Employees</p>
            </div>
        </div>
    </div>
  );
}

export default CardSetting;
  