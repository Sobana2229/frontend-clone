import { useEffect } from "react";
import settingTemplateStoreManagements from "../../store/tdPayroll/setting/templates";
import BonusLetterTamplates from "./pdfTamplates/bonusLetter/salaryRevisionLetter";
import FinalSettlementTemplate from "./pdfTamplates/finalSettlementPayslip/finalSettlementTemplate";
import ElegantTemplate from "./pdfTamplates/regularPayslips/elegantTemplate";
import LiteTemplate from "./pdfTamplates/regularPayslips/liteTemplate";
import MiniTemplate from "./pdfTamplates/regularPayslips/miniTemplate";
import ProfessionalTemplate from "./pdfTamplates/regularPayslips/professionalTemplate";
import SimpleSpreadsheetTemplate from "./pdfTamplates/regularPayslips/simpleSpreadsheetTemplate";
import SimpleTemplate from "./pdfTamplates/regularPayslips/simpleTemplate";
import StandardTemplate from "./pdfTamplates/regularPayslips/standardTemplate";
import SalaryCertificateTamplates from "./pdfTamplates/salaryCertificate/finalSettlementTemplate";
import SalaryRevisionLetter from "./pdfTamplates/salaryRevisionLetter/salaryRevisionLetter";
const baseUrl = import.meta.env.VITE_BASEURL;

const PdfDocument = ({name = "", availableDetailTamplate, logoScale}) => {
  const { imgTamplateSetting, loading, uploadImgTamplateSetting, fetchImgTamplateSetting } = settingTemplateStoreManagements();
  useEffect(() => {
    if(!imgTamplateSetting){
      fetchImgTamplateSetting()
    }
  }, []);

  return (
    <>
      {/* regularPayslips */}
      {name === "Elegant Template" && ( <ElegantTemplate imgUrl={baseUrl + imgTamplateSetting} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />)}
      {name === "Standard Template" && ( <StandardTemplate imgUrl={baseUrl + imgTamplateSetting} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />)}
      {name === "Mini Template" && ( <MiniTemplate imgUrl={baseUrl + imgTamplateSetting} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />)}
      {name === "Simple Template" && ( <SimpleTemplate imgUrl={baseUrl + imgTamplateSetting} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />)}
      {name === "Lite Template" && ( <LiteTemplate imgUrl={baseUrl + imgTamplateSetting} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />)}
      {name === "Simple Spreadsheet Template" && ( <SimpleSpreadsheetTemplate imgUrl={baseUrl + imgTamplateSetting} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />)}
      {name === "Professional Template" && ( <ProfessionalTemplate imgUrl={baseUrl + imgTamplateSetting} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />)}

      {/* Final Settlement Payslip */}
      {name === "Final Settlement Template" && ( <FinalSettlementTemplate imgUrl={baseUrl + imgTamplateSetting} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />)}

      {/* Salary Certificate */}
      {name === "Standard Template Salary Certificate" && ( <SalaryCertificateTamplates imgUrl={baseUrl + imgTamplateSetting} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />)}

      {/* Salary Revision Letter */}
      {name === "Standard Template Salary Revision Letter" && ( <SalaryRevisionLetter imgUrl={baseUrl + imgTamplateSetting} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />)}

      {/* Bonus Letter */}
      {name === "Standard Template Bonus Letter" && ( <BonusLetterTamplates imgUrl={baseUrl + imgTamplateSetting} availableDetailTamplate={availableDetailTamplate} logoScale={logoScale} />)}
    </>
  );
};

export default PdfDocument;