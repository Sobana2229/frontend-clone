import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Modal from "react-modal";
import FormModal from "../../formModal";
import payrunStoreManagements from "../../../../store/tdPayroll/payrun";
import dayjs from "dayjs";

function FormDetailDownload({handleView, }) {
    const { getDownloadhistoryDetailPayrun, payrunDownloadHistory } = payrunStoreManagements();
    const [showModalExport, setShowModalExport] = useState(false);
    useEffect(() => {
        if(!payrunDownloadHistory){
        const access_token = localStorage.getItem("accessToken");
        getDownloadhistoryDetailPayrun(access_token);
        }
    }, [])
    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* Header with Close Button */}
            <div className="w-full flex justify-between items-center relative p-6 pe-10">
                <h1 className="text-xl font-medium">Download Detail </h1>
                <button onClick={handleView} className="absolute top-3 right-3 font-bold text-gray-400 hover:text-gray-600">X</button>
            </div>

            <div className="w-full flex items-center justify-between px-5">
                <button onClick={() => {
                    setShowModalExport(true);
                }} className="font-bold text-gray-400 hover:text-gray-600 border px-4 py-2">Export Data</button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto space-y-5 py-6 px-3">
                {payrunDownloadHistory?.length > 0 &&
                    payrunDownloadHistory.map((el) => (
                    <div
                        key={el?.uuid}
                        className="w-full flex items-start justify-start px-2 flex-col bg-blue-td-200"
                    >
                        <h1>Download By: {
                            el?.User ? el?.User?.name
                            : `${el?.Employee?.firstName ?? ""} ${el?.Employee?.middleName ?? ""} ${el?.Employee?.lastName ?? ""}`
                        }
                        </h1>
                        <p>Date: {el?.dateDownload
                            ? dayjs(el.dateDownload).format("DD/MM/YYYY HH:mm:ss")
                            : "-"}
                        </p>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={showModalExport}
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
                    setShowModal={setShowModalExport} 
                    formFor={"exportPayrunDetail"}
                />
            </Modal>
        </div>
    );
}

export default FormDetailDownload;
