import { useEffect, useState } from "react";
import HeaderReusable from "../headerReusable";
import { Info } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import Select from "react-select";
import CustomOption from "../../customOption";
import FormModal from "../../formModal";
import Modal from "react-modal";
import salaryComponentStoreManagements from "../../../../store/tdPayroll/setting/salaryComponent";
import { CustomToast } from "../../customToast";
import ReuseableInput from "../../reuseableInput";

function FormReimbursementSalaryComponents({ setShowForm, showForm, isCreate, setIsCreate }) {
    const { createOptionSalaryComponent, fetchOptionSalaryComponent, reimbursementTypeOptions, loading, createSalaryComponent, dataReimbursement, updateSalaryComponent } = salaryComponentStoreManagements();
    const [formData, setFormData] = useState({
        reimbursementType: '',
        nameInPayslip: '',
        includeFlexibleBenefit: false,
        restrictFBPOverride: false,
        isCarryForward: true,
        amount: 0,
        markAsActive: false
    });
    const [modalReimbursementType, setModalReimbursementType] = useState(false);

    useEffect(() => {
        if (isCreate) {
            setFormData({
                reimbursementType: '',
                nameInPayslip: '',
                includeFlexibleBenefit: false,
                restrictFBPOverride: false,
                isCarryForward: false,
                amount: 0,
                markAsActive: false
            });
        } else {
            setFormData({
                ...dataReimbursement,
                reimbursementType: dataReimbursement?.reimbursementTypeUuid
            });
        }
    }, [isCreate]);

    useEffect(() => {
        if(reimbursementTypeOptions?.length == 0){
            const access_token = localStorage.getItem("accessToken");
            fetchOptionSalaryComponent(access_token, "reimbursementType");
        }
    }, [reimbursementTypeOptions]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleReimbursementTypeSelect = async (selectedOption) => {
        if(selectedOption.value == "create-new-data"){
            setModalReimbursementType(!modalReimbursementType);
        }else{
        setFormData(prev => ({
            ...prev,
            reimbursementType: selectedOption.value,
        }));
        }
    };

    const handleReimbursementTypeSubmit = async (name) => {
        const formData = { name }
        const access_token = localStorage.getItem("accessToken");
        const response = await createOptionSalaryComponent(formData, "reimbursementType", access_token);
        if(response){
            await fetchOptionSalaryComponent(access_token, "reimbursement");
            toast(<CustomToast message={response} status={"success"} />, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                style: {
                    background: 'transparent',
                    boxShadow: 'none',
                    padding: 0
                }
            });
            setModalReimbursementType(false);
        }
    }

    const handleSubmit = async () => {
        const access_token = localStorage.getItem("accessToken");
        let response;
        try {
            if(!isCreate && dataReimbursement?.uuid){
                response = await updateSalaryComponent(formData, access_token, "reimbursement", dataReimbursement?.uuid);
            } else {
                response = await createSalaryComponent(formData, access_token, "reimbursement");
            }
            if(response){
                await fetchOptionSalaryComponent(access_token, "reimbursement");
                toast(<CustomToast message={response} status={"success"} />, {
                    autoClose: 3000,
                    closeButton: false,
                    hideProgressBar: true,
                    position: "top-center",
                    style: {
                        background: 'transparent',
                        boxShadow: 'none',
                        padding: 0
                    }
                });
                setShowForm("");
            }
        } catch (error) {
            toast(<CustomToast message={error.message || "Failed to save reimbursement component"} status={"error"} />, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                style: {
                    background: 'transparent',
                    boxShadow: 'none',
                    padding: 0
                }
            });
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setIsCreate(false);
    };

    const getSelectedValue = () => {
        if (!formData?.reimbursementType || !Array.isArray(reimbursementTypeOptions)) return null;
        return reimbursementTypeOptions.find(option => option.value === formData.reimbursementType) || null;
    };

    return (
        <div className="w-full h-full flex-col flex items-start justify-start bg-white rounded-lg">
            <HeaderReusable title={`${isCreate ? "New" : "Update"} ${showForm}`} />
            
            <div className="w-full p-6 bg-white">
                <div className="space-y-6">
                    {/* Reimbursement Type */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Reimbursement Type
                        </label>
                        <Select
                            options={reimbursementTypeOptions}
                            onChange={handleReimbursementTypeSelect}
                            value={getSelectedValue()}
                            className='w-1/2 bg-transparent border focus:ring-0 outline-none text-sm rounded-lg border-l-[6px] border-l-blue-td-500'
                            classNames={{
                            control: () =>
                                    "!rounded-none !rounded-lg !border !border-gray-300 !bg-white !shadow-none !h-full",
                                valueContainer: () => "!px-2 !py-1",
                                indicatorsContainer: () => "!px-1",
                            }}
                            styles={{
                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                            components={{ 
                            Option: (props) => (
                                <CustomOption 
                                    props={props} 
                                    onCreateNew={() => setModalReimbursementType(true)}
                                    createNewLabel="New Reimbursement Type"
                                />
                            )
                            }}
                            menuPortalTarget={document.body}
                            filterOption={(option, rawInput) => {
                                if (option.value === "create-new-data") {
                                    return true;
                                }
                                return option.label.toLowerCase().includes(rawInput.toLowerCase());
                            }}
                        />
                    </div>

                    {/* Name in Payslip */}
                    <div className="w-1/2">
                        <ReuseableInput
                            label="Name in Payslip"
                            id="nameInPayslip"
                            name="nameInPayslip"
                            value={formData.nameInPayslip}
                            onChange={handleInputChange}
                            isFocusRing={false}
                            isBorderLeft={true}
                        />
                    </div>

                    {/* Include as Flexible Benefit Plan */}
                    <div className="space-y-3">
                        {/* <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                name="includeFlexibleBenefit"
                                checked={formData.includeFlexibleBenefit}
                                onChange={handleInputChange}
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div className="flex-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Include this as a Flexible Benefit Plan component
                                </label>
                                <p className="text-sm text-gray-500 mt-1">
                                    FBP allows your employees to personalise their salary structure by choosing how much they want to receive under each FBP component.
                                </p>
                            </div>
                        </div> */}

                        {/* Conditional FBP Restriction Option */}
                        {formData.includeFlexibleBenefit && (
                            <div className="ml-7 space-y-2">
                                <div className="flex items-start space-x-3">
                                    <input
                                        type="checkbox"
                                        name="restrictFBPOverride"
                                        checked={formData.restrictFBPOverride}
                                        onChange={handleInputChange}
                                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="text-sm font-medium text-gray-700">
                                        Restrict employee from overriding the FBP amount
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Unclaimed Reimbursement Handling */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            How do you want to handle unclaimed reimbursement?
                        </label>
                        <div className="space-y-2">
                            {/* <div className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    name="isCarryForward"
                                    value="true"
                                    checked={formData.isCarryForward === true}
                                    onChange={() => setFormData(prev => ({ ...prev, isCarryForward: true }))}
                                />
                                <label className="text-sm text-gray-700">
                                    Carry forward and encash at the end of the fiscal year
                                </label>
                            </div> */}
                            <div className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    name="isCarryForward"
                                    value="false"
                                    checked={formData.isCarryForward === false}
                                    onChange={() => setFormData(prev => ({ ...prev, isCarryForward: false }))}
                                />
                                <label className="text-sm text-gray-700">
                                    Do not carry forward and encash monthly
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Enter Amount */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            {formData.includeFlexibleBenefit ? 'Enter Maximum Amount' : 'Enter Amount'} <span className="text-red-500">*</span>
                        </label>
                        <div className="flex">
                            <div className="w-1/5">
                                <ReuseableInput
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    isFocusRing={false}
                                    isDollar={true}
                                />
                            </div>
                            <span className="inline-flex items-center px-3 text-sm text-gray-500">
                                per month
                            </span>
                        </div>

                        {/* Conditional Note for FBP */}
                        {formData.restrictFBPOverride && (
                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-700">
                                    <strong>Note:</strong> Employees will not be able to edit this amount in their FBP declarations once it is selected.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Mark as Active */}
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            name="markAsActive"
                            checked={formData.markAsActive}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="text-sm font-medium text-gray-700">
                            Mark this as Active
                        </label>
                    </div>

                    {/* Note */}
                    <div className="bg-orange-200 rounded-md p-2">
                        <p className="text-sm text-gray-td-400">
                            <strong className="text-black">Note:</strong> As you've already associated this component with one or more employees, you can only edit the Name in Payslip and Amount. The changes made to Amount will apply only to new employees.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between space-x-3 pt-4">
                        <div className="flex items-center justify-start space-x-3">
                            <button
                                type="button"
                                disabled={loading}
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                        {/* Mandatory fields indicator */}
                        <p className="text-xs text-red-500 mt-2">
                            * indicates mandatory fields
                        </p>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalReimbursementType}
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
                    setShowModal={setModalReimbursementType} 
                    submit={handleReimbursementTypeSubmit}
                    isSingle={true}
                    label={"Reimbursement Name"}
                    titleForm={"Reimbursement"}
                />
                </Modal>
        </div>
    );
}

export default FormReimbursementSalaryComponents;