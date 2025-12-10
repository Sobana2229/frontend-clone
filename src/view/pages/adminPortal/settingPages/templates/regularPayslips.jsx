import { Eye, Pencil } from "@phosphor-icons/react";
import { templateRegularPayslipsList } from "../../../../../../data/dummy";
import HeaderReusable from "../../../../component/setting/headerReusable";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { useEffect, useState } from "react";
import ElegantTemplate from "../../../../component/pdfTamplates/regularPayslips/elegantTemplate";
import settingTemplateStoreManagements from "../../../../../store/tdPayroll/setting/templates";
import StandardTemplate from "../../../../component/pdfTamplates/regularPayslips/standardTemplate";
import MiniTemplate from "../../../../component/pdfTamplates/regularPayslips/miniTemplate";
import SimpleTemplate from "../../../../component/pdfTamplates/regularPayslips/simpleTemplate";
import LiteTemplate from "../../../../component/pdfTamplates/regularPayslips/liteTemplate";
import SimpleSpreadsheetTemplate from "../../../../component/pdfTamplates/regularPayslips/simpleSpreadsheetTemplate";
import ProfessionalTemplate from "../../../../component/pdfTamplates/regularPayslips/professionalTemplate";
const baseUrl = import.meta.env.VITE_BASEURL;

function RegularPayslips() {
    const [showModal, setShowModal] = useState(false);
    const [logoScale, setLogoScale] = useState({ value: 1, size: 'w-16 h-16' });
    const [currentTamplates, setCurrentTamplates] = useState("");
    const { imgTamplateSetting, fetchImgTamplateSetting, fetchAvailableDetailTamplate, availableDetailTamplate } = settingTemplateStoreManagements();
    useEffect(() => {
      if(!imgTamplateSetting){
        fetchImgTamplateSetting()
      }
    }, []);

    useEffect(() => {
        if (availableDetailTamplate) {
          setLogoScale(JSON.parse(availableDetailTamplate.logo_scale))
        }
    }, [availableDetailTamplate]);

    useEffect(() => {
        if (currentTamplates) {
          fetchAvailableDetailTamplate(currentTamplates);
        }
    }, [currentTamplates]);
    
    return (
        <div className="w-full h-full flex flex-col items-start justify-start space-y-4">
            <HeaderReusable title="Regular Payslips" />
        
            <div className="w-[90%] grid grid-cols-4 gap-10 p-5">
                {templateRegularPayslipsList?.map((el, idx) => {
                    let tamplatesName = el.split(" ").join("_");
                    return (
                        <div key={idx} className="w-full h-full space-y-2">
                            <h1>{el}</h1>
                            <div className="w-full h-[300px] rounded-md shadow-md overflow-hidden relative group">
                                <img
                                    className={`w-full h-full object-contain duration-300 ease-in-out transition-all group-hover:scale-110 group-hover:blur-sm`}
                                    src={`/settingTamplates/` + `${tamplatesName}.png`}
                                    alt="thumbnail"
                                />

                                <div className="absolute bottom-[-50px] group-hover:bottom-0 left-0 w-full h-12 flex items-center justify-center space-x-4 z-10 bg-black bg-opacity-70 transition-all duration-300 ease-in-out">
                                    <button onClick={() => {
                                        setShowModal(!showModal)
                                        setCurrentTamplates(tamplatesName.split("_").join(" "))
                                    }}
                                    className="p-2 rounded-md bg-white text-black font-medium"><Eye/></button>
                                    <Link to={"/templates/" + `${tamplatesName}-${idx}`} className="p-2 rounded-md bg-white text-black font-medium"><Pencil/></Link>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <Modal
                isOpen={showModal}
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
                }}
                >
                <div className="w-full h-full relative">
                    <div className="w-full h-14 flex items-center justify-between px-10 bg-black fixed">
                        <h1 className="text-xl font-bold text-white">{currentTamplates}</h1>
                        <button className="h-10 w-10 rounded-full flex font-bold items-center justify-center bg-gray-500 text-gray-300" onClick={() => setShowModal(false)}>X</button>
                    </div>
                    <div className="w-full h-full pt-14">
                        <div className="w-full h-full flex items-start justify-center overflow-y-auto p-4">
                            {currentTamplates === "Elegant Template" && ( <ElegantTemplate imgUrl={baseUrl + imgTamplateSetting} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />)}
                            {currentTamplates === "Standard Template" && ( <StandardTemplate imgUrl={baseUrl + imgTamplateSetting} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />)}
                            {currentTamplates === "Mini Template" && ( <MiniTemplate imgUrl={baseUrl + imgTamplateSetting} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />)}
                            {currentTamplates === "Simple Template" && ( <SimpleTemplate imgUrl={baseUrl + imgTamplateSetting} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />)}
                            {currentTamplates === "Lite Template" && ( <LiteTemplate imgUrl={baseUrl + imgTamplateSetting} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />)}
                            {currentTamplates === "Simple Spreadsheet Template" && ( <SimpleSpreadsheetTemplate imgUrl={baseUrl + imgTamplateSetting} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />)}
                            {currentTamplates === "Professional Template" && ( <ProfessionalTemplate imgUrl={baseUrl + imgTamplateSetting} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />)}
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default RegularPayslips;
  