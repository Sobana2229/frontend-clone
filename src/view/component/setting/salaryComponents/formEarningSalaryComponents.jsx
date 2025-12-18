import { useEffect, useState } from "react";
import HeaderReusable from "../headerReusable";
import { Info } from "@phosphor-icons/react";
import salaryComponentStoreManagements from "../../../../store/tdPayroll/setting/salaryComponent";
import { toast } from "react-toastify";
import FormCustomAllowance from "./earning/formCustomAllowance";
import FormCustomBonus from "./earning/formBonus";
import { salaryComponentEarningType } from "../../../../../data/dummy";
import FormEarningDefault from "./earning/formEarningDefault";
import { CustomToast } from "../../customToast";
import ReuseableInput from "../../reuseableInput";

function FormEarningSalaryComponents({
  setShowForm,
  showForm,
  isCreate,
  setIsCreate
}) {
  const {
    createSalaryComponent,
    fetchSalaryComponent,
    loading,
    dataEarning,
    updateSalaryComponent,
    clearData
  } = salaryComponentStoreManagements();

  const [formData, setFormData] = useState({
    earningType: "",
    earningName: "",
    nameInPayslip: "",
    payType: "",
    calculationType: "",
    amount: 0,
    customFormula: "",
    isActive: false,
    isSchedule: false,
    isSalaryStructure: false,
    isTaxable: false,
    taxDeductionPreference: "",
    isProRataBasis: false,
    considerSpk: false,
    spkContribution: "",
    showInPayslip: true,
    maxAmount: 0,
    isFBPComponent: false,
    restrictFBPOverride: false
  });

  /* -------------------- EFFECTS (UNCHANGED) -------------------- */
  useEffect(() => {
    if (isCreate) {
      clearData();
      setFormData({
        earningType: "",
        earningName: "",
        nameInPayslip: "",
        payType: "",
        calculationType: "",
        amount: 0,
        customFormula: "",
        isActive: false,
        isSchedule: false,
        isSalaryStructure: false,
        isTaxable: false,
        taxDeductionPreference: "",
        isProRataBasis: false,
        considerSpk: false,
        spkContribution: "",
        showInPayslip: true,
        maxAmount: 0,
        isFBPComponent: false,
        restrictFBPOverride: false
      });
    } else {
      const isBonusType =
        dataEarning?.earningType === "Bonus" ||
        dataEarning?.earningType === "Commission" ||
        dataEarning?.earningType === "Gift Coupon";

      setFormData({
        earningType: dataEarning?.earningType || "",
        earningName: dataEarning?.earningName || "",
        nameInPayslip: dataEarning?.nameInPayslip || "",
        payType: dataEarning?.payType || "",
        calculationType: dataEarning?.calculationType || "",
        amount: dataEarning?.amount ?? 0,
        customFormula: dataEarning?.customFormula || "",
        isActive: dataEarning?.isActive ?? false,
        isSchedule: dataEarning?.isSchedule ?? isBonusType,
        isSalaryStructure: dataEarning?.isSalaryStructure ?? false,
        isTaxable: dataEarning?.isTaxable ?? false,
        taxDeductionPreference: dataEarning?.taxDeductionPreference || "",
        isProRataBasis: dataEarning?.isProRataBasis ?? false,
        considerSpk: dataEarning?.considerSpk ?? false,
        spkContribution: dataEarning?.spkContribution || "",
        showInPayslip: dataEarning?.showInPayslip ?? true,
        maxAmount: dataEarning?.maxAmount ?? 0,
        isFBPComponent: dataEarning?.isFBPComponent ?? false,
        restrictFBPOverride: dataEarning?.restrictFBPOverride ?? false
      });
    }
  }, [isCreate, dataEarning]);

  /* -------------------- HANDLERS (UNCHANGED) -------------------- */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async () => {
    const access_token = localStorage.getItem("accessToken");
    try {
      const response = !isCreate && dataEarning?.uuid
        ? await updateSalaryComponent(formData, access_token, "earning", dataEarning.uuid)
        : await createSalaryComponent(formData, access_token, "earning");

      if (response) {
        await fetchSalaryComponent(access_token, "earning");
        toast(<CustomToast message={response} status="success" />, {
          autoClose: 3000,
          closeButton: false,
          hideProgressBar: true,
          position: "top-center",
          style: { background: "transparent", boxShadow: "none", padding: 0 }
        });
        handleCancel();
      }
    } catch (err) {
      toast(<CustomToast message="Failed to save salary component" status="error" />, {
        autoClose: 3000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
        style: { background: "transparent", boxShadow: "none", padding: 0 }
      });
    }
  };

  const handleCancel = () => {
    setShowForm("");
    setIsCreate(false);
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="w-full h-full bg-white rounded-lg flex flex-col overflow-y-auto">
      <HeaderReusable title={`${!isCreate ? "Update" : "New"} ${showForm}`} />

      <div className="flex-1 px-8 py-6">
        {/* EARNING TYPE */}
        <div className="flex items-center gap-4 border-b pb-6">
          <div className="w-[420px]">
            <ReuseableInput
              label="Earning Type"
              id="earningType"
              name="earningType"
              value={formData.earningType}
              onChange={handleInputChange}
              as="select"
              isBorderLeft
            >
              <option value="" hidden>Select</option>
              {salaryComponentEarningType.map((el, idx) => (
                <option key={idx} value={el}>{el}</option>
              ))}
            </ReuseableInput>
          </div>

          <div className="mt-6 flex items-center gap-2 bg-blue-50 text-sm text-gray-600 px-4 py-2 rounded-md">
            <Info size={16} />
            <span>Fixed amount paid at the end of every month.</span>
          </div>
        </div>

        {/* DYNAMIC FORMS */}
        {formData.earningType && (
          <div className="mt-6">
            {(formData.earningType !== "Bonus" &&
              formData.earningType !== "Commission" &&
              formData.earningType !== "Custom Allowance" &&
              formData.earningType !== "Gift Coupon") && (
              <FormEarningDefault
                formData={formData}
                setFormData={setFormData}
                handleInputChange={handleInputChange}
                earningType={formData.earningType}
              />
            )}

            {formData.earningType === "Custom Allowance" && (
              <FormCustomAllowance
                formData={formData}
                setFormData={setFormData}
                handleInputChange={handleInputChange}
              />
            )}

            {(formData.earningType === "Bonus" ||
              formData.earningType === "Commission" ||
              formData.earningType === "Gift Coupon") && (
              <FormCustomBonus
                formData={formData}
                setFormData={setFormData}
                handleInputChange={handleInputChange}
                earningType={formData.earningType}
              />
            )}
          </div>
        )}

        {/* NOTE */}
        {formData.earningType && (
          <div className="mt-6 bg-yellow-50 border borders border-yellow-200 p-4 rounded-md text-sm text-gray-700">
            <strong>Note:</strong> As you've already associated this component with one or more employees,
            you can only edit the Name and Amount/Percentage. Changes apply only to new employees.
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="px-8 py-4 border-t flex items-center gap-4">
        <button
          disabled={loading || !formData.earningName}
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save
        </button>

        <button
          onClick={handleCancel}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>

        <span className="ml-auto text-sm text-red-500">
          | Indicates Mandatory Fields.
        </span>
      </div>
    </div>
  );
}

export default FormEarningSalaryComponents;
