import React, { useEffect, useState } from 'react';
import { Info } from '@phosphor-icons/react';
import HeaderReusable from "../../../../component/setting/headerReusable";
import TableReusable from '../../../../component/setting/tableReusable';
import { senderEmailSettingHeaders } from '../../../../../../data/dummy';
import PaginationPages from '../../../../component/paginations';
import Modal from "react-modal";
import { toast } from "react-toastify";
import FormModal from '../../../../component/formModal';
import senderEmailPreferenceStoreManagements from '../../../../../store/tdPayroll/setting/senderEmailPreference';

function SenderEmailPreference() {
    const { fetchSenderEmailPreference, dataSenderEmailPreference, deleteSenderEmailPreference, getOneSenderEmailPreference, resendInvitationSenderEmailPreference, loading } = senderEmailPreferenceStoreManagements();
    const [currentPage, setCurrentPage] = useState(1);
    const [showFormSenderEmail, setShowFormSenderEmail] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [tempUuid, setTempUuid] = useState("");
    const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

    useEffect(() => {
        if(!dataSenderEmailPreference){
            const params = {
                limit: 10, 
                page: currentPage,
            };
            const access_token = localStorage.getItem("accessToken");
            fetchSenderEmailPreference(access_token, params);
        }
    }, []);

    const handleResendEmail = async (emailId) => {
        const access_token = localStorage.getItem("accessToken");
        const response = await resendInvitationSenderEmailPreference(access_token, emailId);
        if(response){
            toast.success(response, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            });
        }
    };

    const handleShowModal = async () => {
        setFormData({
            name: "",
            departmentCode: "",
            description: "",
        })
        setIsUpdate(false);
        setTempUuid("");
        setShowFormSenderEmail(true)
    }

    const handleEdit = async (emailId) => {
        const access_token = localStorage.getItem("accessToken");
        const response = await getOneSenderEmailPreference(access_token, emailId);
        if(response){
            setFormData({
                name: response?.name,
                email: response?.email
            });
                setShowFormSenderEmail(true);
                setIsUpdate(true);
                setTempUuid(emailId);
        }
    };

    const handleDelete = async (emailId) => {
        const access_token = localStorage.getItem("accessToken");
        const response = await deleteSenderEmailPreference(access_token, emailId);
        if(response){
            const params = {
                limit: 10, 
                page: 1,
            };
            await fetchSenderEmailPreference(access_token, params);
            toast.success(response, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            });
        }
    };
    return (
     <div className="w-full h-screen flex flex-col items-start justify-start relative">
        <HeaderReusable title="Sender Email Preference" isAddData={true} addDataTitle="add sender" handleShowModal={handleShowModal} />
        <div className="w-full bg-white">
            {/* Public Domains Section */}
            <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-medium text-gray-800">Public Domains</h2>
                    <Info className="w-4 h-4 text-gray-400" />
                </div>
                
                <div className="w-full flex items-center border rounded-md">
                    <div className="w-[30%] h-[150px] flex items-start justify-center flex-col p-5">
                        <p className="text-sm text-gray-600 mb-2">EMAILS ARE SENT THROUGH</p>
                        <div className="">
                            <p className="font-medium text-gray-800">Email address of Zoho Payroll</p>
                            <p className="text-sm text-gray-500">(message-service@mail.zohopayroll.com)</p>
                        </div>
                    </div>
                    <div className="flex-1 h-[150px] bg-blue-50 flex items-start justify-start flex-col p-5">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-800">
                                <p>
                                    If you send emails from public domain, they are likely to land in the Spam folder. So, if emails are sent with any of the following email addresses in the From field, emails will be sent from message-service@mail.zohopayroll.com. If you still want to send emails using the public domain, 
                                    <span className="text-blue-600 font-medium cursor-pointer hover:underline ml-1">Change Setting</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <TableReusable dataHeaders={senderEmailSettingHeaders} dataTable={dataSenderEmailPreference?.list} tableFor="senderEmailSetting" handleEdit={handleEdit} handleDelete={handleDelete} resened={handleResendEmail} loading={loading} />
        <div className="w-full absolute bottom-5 flex items-center justify-end">
            <PaginationPages totalPages={dataSenderEmailPreference?.totalPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>

        <Modal
            isOpen={showFormSenderEmail}
            contentLabel="Full Screen Modal"
            ariaHideApp={false}
            style={{
            overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
            },
            content: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: "none",
                backgroundColor: "transparent",
                padding: 0,
                margin: 0,
                overflow: "hidden",
            },
        }}>
            <FormModal
                setShowModal={setShowFormSenderEmail} 
                label={"Sender Email Preference"}
                formFor={"senderemailpreference"}
                data={formData}
                isUpdate={isUpdate}
                tempUuid={tempUuid}
                setIsUpdate={setIsUpdate}
                setTempUuid={setTempUuid}
                titleForm={"Sender Email Preference"}
            />
        </Modal>
     </div>
    );
}

export default SenderEmailPreference;
  