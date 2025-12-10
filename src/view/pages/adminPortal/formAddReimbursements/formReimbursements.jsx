import { useNavigate } from "react-router-dom";
import { XSquareIcon } from "@phosphor-icons/react";
import ReimburseBasicInput from "../../../component/formAddReimbursements/basicInput";
import { useState } from "react";

// DEPRECATED BUT NICE FOR RESOURCE
function FormReimbursements() {
    const [formData, setFormData] = useState({
        employeeUuid: "",
        claimDate: "",
    });

    const navigate = useNavigate();
    const cancelForm = () => {
        try {
            navigate("/reimbursement")
        } catch (error) {
            console.log(error);
        }
    }

    return (
      <div /* main container */
        className="
            w-full 
            h-screen 
            flex 
            flex-col
            justify-start 
            pt-14
            bg-gray-td-200"
        >   
            {/* header container */}
            <div 
                className="
                    w-full"
            >

                <div 
                    className="
                        flex
                        flex-row
                        space-between
                        w-full
                        bg-white
                        py-5"
                >
                
                    {/* title */}
                    <div
                        className="
                            flex 
                            items-center
                            w-full
                            text-xl 
                            font-bold
                            px-5"
                        style={{
                        }}
                    >
                        <h1
                            className="
                            w-full
                            text-xl 
                            font-bold"
                        >
                            New Claim
                        </h1>
                    </div>
                    
                    {/* X button cancel button */}
                    <div
                        className="
                            flex 
                            items-center
                            justify-end
                            w-full
                            px-5"
                        style={{
                        }}
                    >
                        <button onClick={cancelForm}>
                            <XSquareIcon 
                                size={40} 
                                weight="thin"
                            />
                        </button>
                    </div>
                </div>

            </div>

            {/* form container */}
            <div
                className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    w-full 
                    h-full
                    p-5"
            >
                {/* form rounded container */}
                <div
                    className="
                    flex
                    flex-col
                    w-full 
                    h-full
                    rounded-lg
                    bg-white
                    p-10
                    pt-10
                    pb-10
                    gap-10"
                >

                    {/* input container */}
                    <div
                        className="
                            flex
                            flex-row
                            gap-10"
                        style={{border: "2px solid red"}}
                    >
                        <ReimburseBasicInput 
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default FormReimbursements;