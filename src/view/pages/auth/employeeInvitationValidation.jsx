import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import employeeStoreManagements from "../../../store/tdPayroll/employee";
import LoadingIcon from "../../component/loadingIcon";

function EmployeeInvitationValidation() {
    const navigate = useNavigate();
    const { token } = useParams();
    const { loading, checkValidationToken } = employeeStoreManagements();
    const [showBtn, setShowBtn] = useState(false);

    useEffect(() => {
        if (token) {
            checking();
        }
    }, []);

    const checking = async () => {
        const response = await checkValidationToken(token);
        if(response?.message){
            setShowBtn(true)
        }
    };

    const handleAcceptInvitation = async () => {
        navigate("/login");
    }; 
    return (
        <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Employee Invitation
                    </h2>
                    <p className="text-gray-600">
                        You have been invited to join the team. Click the button below to accept your invitation.
                    </p>
                </div>
                
                {(!loading && showBtn) ? (
                    <button
                        onClick={handleAcceptInvitation}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing...
                            </>
                        ) : (
                            "Redirect to login pages"
                        )}
                    </button>
                ) : (
                    <div className="w-full h-10 flex items-center justify-center">
                        <LoadingIcon color="blue" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmployeeInvitationValidation;