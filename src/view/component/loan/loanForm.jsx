import { useEffect, useState } from "react";
import HeaderReusable from "../setting/headerReusable";
import { toast } from "react-toastify";
import Select from "react-select";
import Modal from "react-modal";
import CustomOption from "../customOption";
import FormModal from "../formModal";
import loanStoreManagements from "../../../store/tdPayroll/loan";
import employeeStoreManagements from "../../../store/tdPayroll/employee";
import ReuseableInput from "../reuseableInput";
import ButtonReusable from "../buttonReusable";
import dayjs from "dayjs";
import { CalendarDots } from "@phosphor-icons/react";
import { employeeLoanEarning } from "../../../../data/dummy";
import { CustomToast } from "../customToast";

function LoanForm({ setShowForm, isAdvance = false, setSelectedLoanData, data, isUpdate, setShowDetail}) {
    const { getLoan, loanNameOptions, createLoans, updateLoans, loading } = loanStoreManagements();
    const { getEmployeeOverview, dataEmployeesOptions } = employeeStoreManagements();
    
    const [formData, setFormData] = useState({
        loanNameUuid: "",
        employeeUuid: "", 
        loanAmount: "",
        isSalaryAdvance: isAdvance, // Set dari prop
        disbursementDate: "",
        reason: "",
        exemptFromPerquisite: false,
        perquisiteRate: null,
        deductionStartDate: "",
        instalmentAmount: ""
    });
    const [modalLoans, setModalLoans] = useState(false);
    const [isLoanAdvance, setIsLoanAdvance] = useState(isAdvance);

    // **FIX: Populate form data when in update mode**
    useEffect(() => {
        if (isUpdate && data) {
            setFormData({
                loanNameUuid: data.loanNameUuid || "",
                employeeUuid: data.employeeUuid || "", 
                loanAmount: data.loanAmount || "",
                isSalaryAdvance: data.isSalaryAdvance || isAdvance,
                disbursementDate: data.disbursementDate ? dayjs(data.disbursementDate).format('YYYY-MM-DD') : "",
                reason: data.reason || "",
                exemptFromPerquisite: data.exemptFromPerquisite || false,
                perquisiteRate: data.perquisiteRate || null,
                deductionStartDate: data.deductionStartDate ? dayjs(data.deductionStartDate).format('YYYY-MM-DD') : "",
                instalmentAmount: data.instalmentAmount || ""
            });
            
            // Set isLoanAdvance state berdasarkan data
            setIsLoanAdvance(data.isSalaryAdvance || isAdvance);
        }
    }, [isUpdate, data, isAdvance]);

    // Update form data ketika isAdvance prop berubah (hanya jika bukan update mode)
    useEffect(() => {
        if (!isUpdate) {
            setIsLoanAdvance(isAdvance);
            setFormData(prev => ({
                ...prev,
                isSalaryAdvance: isAdvance
            }));
        }
    }, [isAdvance, isUpdate]);

    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        const params = {
            loanType: isAdvance || isLoanAdvance ? "advance-salary" : "loans"
        }
        getLoan(access_token, "option", params);
    }, [isAdvance, isLoanAdvance]);

    useEffect(() => {
        if (!dataEmployeesOptions) {
            const access_token = localStorage.getItem("accessToken");
            getEmployeeOverview(access_token, "employeeOptions");
        }
    }, []);

    useEffect(() => {
        // Skip auto-detection jika dalam mode update
        if (isUpdate) return;
        
        // Cek jika loan name yang dipilih adalah Salary Advance
        const findLoan = loanNameOptions.find(loan => loan.value == formData?.loanNameUuid);
        if(findLoan?.label == 'Salary Advance'){
            setIsLoanAdvance(true);
            setFormData(prev => ({
                ...prev,
                isSalaryAdvance: true
            }));
        } else if (!isAdvance) {
            // Hanya reset jika bukan dari prop isAdvance
            setIsLoanAdvance(false);
            setFormData(prev => ({
                ...prev,
                isSalaryAdvance: false
            }));
        }
    }, [formData?.loanNameUuid, isAdvance, isUpdate]);

    const handleInputChange = (field, value) => {
        if (field && typeof field === 'object' && field.target) {
            const { name, value: eTargetValue } = field.target;
            setFormData(prev => ({
                ...prev,
                [name]: eTargetValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleLoanSelect = async (selectedOption) => {
        if(selectedOption.value == "create-new-data"){
            setModalLoans(!modalLoans);
        }else{
            setFormData(prev => ({
                ...prev,
                loanNameUuid: selectedOption.value,
                perquisiteRate: selectedOption.perquisiteRate || null
            }));
        }
    };

    const handleEmployeeSelect = async (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            employeeUuid: selectedOption.value,
        }));
    };

    // **FIX: Update handleSubmit untuk support update mode**
    const handleSubmit = async () => {
        const payload = {
            ...formData,
            isSalaryAdvance: isAdvance || isLoanAdvance,
            paidOffInstalment: formData.loanAmount && formData.instalmentAmount && parseFloat(formData.instalmentAmount) > 0 ? 
                                Math.ceil(parseFloat(formData.loanAmount) / parseFloat(formData.instalmentAmount)) : 1
        };

        const access_token = localStorage.getItem("accessToken");
        let response;

        if (isUpdate && data?.uuid) {
            // Update existing loan
            response = await updateLoans(payload, access_token, "loans", data.uuid);
        } else {
            // Create new loan
            response = await createLoans(payload, access_token, "loans");
        }

        if (response) {
            const params = {
                limit: 10, 
                page: 1,
            };
            const access_token = localStorage.getItem("accessToken");
            await getLoan(access_token, "loan", params);
            await getLoan(access_token, "card-loan");
            
            toast(<CustomToast 
                message={isUpdate ? `${loanLabel} updated successfully!` : response} 
                status={"success"} 
            />, {
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
            if(isUpdate){
                setShowDetail(true);
            }else{
                handleCancel();
                setSelectedLoanData(null);
            }
        }
    };

    const handleCancel = () => {
        setFormData({
            loanNameUuid: "",
            employeeUuid: "", 
            loanAmount: "",
            isSalaryAdvance: isAdvance, // Reset to prop value
            disbursementDate: "",
            reason: "",
            exemptFromPerquisite: false,
            perquisiteRate: null,
            deductionStartDate: "",
            instalmentAmount: ""
        });
        setShowForm();
        setSelectedLoanData(null);
    };

    // **FIX: Helper functions untuk mendapatkan selected values**
    const getSelectedLoanName = () => {
        if (!formData.loanNameUuid) return null;
        return loanNameOptions.find(option => option.value === formData.loanNameUuid);
    };

    const getSelectedEmployee = () => {
        if (!formData.employeeUuid) return null;
        return dataEmployeesOptions?.find(option => option.value === formData.employeeUuid);
    };

    // Dynamic labels based on isAdvance or isLoanAdvance (computed inside return to access state)
    const currentIsAdvance = isAdvance || isLoanAdvance;
    const loanLabel = currentIsAdvance ? "Advance Salary" : "Loan";
    const loanLabelLowercase = currentIsAdvance ? "advance salary" : "loan";

    return (
        <div className="w-full h-full overflow-y-auto flex-col flex items-start justify-start bg-white rounded-xl">
            {/* <HeaderReusable 
                title={isUpdate ? `Edit ${loanLabel}` : `Create ${loanLabel}`} 
                handleCancel={handleCancel} 
            /> */}
            
            <div className="w-full p-6 items-start justify-start bg-white">                
                <div className="overflow-y-auto h-[600px] space-y-10 pb-10">
                    <div className="w-1/2 space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                             {/* Loan Name */}
                             <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {loanLabel} Name
                                </label>
                                <Select
                                    options={loanNameOptions}
                                    value={getSelectedLoanName()} // **FIX: Set selected value**
                                    onChange={handleLoanSelect}
                                    className='w-full bg-transparent focus:ring-0 outline-none text-sm'
                                    classNames={{
                                        control: () =>
                                        "!rounded-md !bg-white !h-full",
                                        valueContainer: () => "!px-2 !py-1.5",
                                        indicatorsContainer: () => "!px-1",
                                    }}
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                        control: (base, state) => ({
                                        ...base,
                                        borderLeftWidth: '6px',
                                        borderLeftColor: '#B91C1C',
                                        borderRadius: '6px',
                                        borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            borderColor: '#d1d5db',
                                            borderLeftColor: '#B91C1C',
                                        }
                                        }),
                                    }}
                                    components={{ 
                                        Option: (props) => (
                                        <CustomOption 
                                            props={props} 
                                            onCreateNew={() => setModalLoans(true)}
                                            createNewLabel={`New ${loanLabel}`}
                                        />
                                        )
                                    }}
                                    menuPortalTarget={document.body}
                                    filterOption={(option, rawInput) => {
                                        if (option.value === "create-new-data") {
                                        return true;
                                        }
                                        if (!option.label || typeof option.label !== 'string') {
                                        return false;
                                        }
                                        return option.label.toLowerCase().includes(rawInput.toLowerCase());
                                    }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Employee Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Employee Name<span className="text-red-500">*</span>
                                </label>
                                <Select
                                    options={dataEmployeesOptions}
                                    value={getSelectedEmployee()} // **FIX: Set selected value**
                                    onChange={handleEmployeeSelect}
                                    className='w-full bg-transparent focus:ring-0 outline-none text-sm'
                                    classNames={{
                                        control: () =>
                                        "!rounded-md !bg-white !h-full",
                                        valueContainer: () => "!px-2 !py-1.5",
                                        indicatorsContainer: () => "!px-1",
                                    }}
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                        control: (base, state) => ({
                                        ...base,
                                        borderLeftWidth: '6px',
                                        borderLeftColor: '#B91C1C',
                                        borderRadius: '6px',
                                        borderColor: state.isFocused ? '#d1d5db' : '#d1d5db',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            borderColor: '#d1d5db',
                                            borderLeftColor: '#B91C1C',
                                        }
                                        }),
                                    }}
                                    menuPortalTarget={document.body}
                                    filterOption={(option, rawInput) => {
                                        if (option.value === "create-new-data") {
                                        return true;
                                        }
                                        if (!option.label || typeof option.label !== 'string') {
                                        return false;
                                        }
                                        return option.label.toLowerCase().includes(rawInput.toLowerCase());
                                    }}
                                />
                            </div>

                            {/* Loan Amount dengan dynamic label */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {loanLabel} Amount<span className="text-red-500">*</span>
                                    <span className="ml-1 text-gray-400 cursor-help" title="Enter loan amount in rupiah">ⓘ</span>
                                </label>
                                <div className="relative">
                                    <ReuseableInput
                                        id="loanAmount"
                                        name="loanAmount"
                                        isDollar={true}
                                        value={formData.loanAmount}
                                        onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                                        placeholder={`Enter ${loanLabel} Amount`}
                                        isFocusRing={false}
                                        isBorderLeft={true}
                                        type="number"
                                        borderColor="red-td-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Disbursement Date */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Disbursement Date<span className="text-red-500">*</span>
                            </label>
                            <ReuseableInput
                                id="disbursementDate"
                                name="disbursementDate"
                                value={formData.disbursementDate}
                                onChange={(e) => handleInputChange('disbursementDate', e.target.value)}
                                isFocusRing={false}
                                isBorderLeft={true}
                                type="date"
                                borderColor="red-td-500"
                            />
                        </div>

                        {/* Reason */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Reason<span className="text-red-500">*</span>
                            </label>
                            <ReuseableInput
                                as="textarea"
                                id="reason"
                                name="reason"
                                value={formData.reason}
                                onChange={(e) => handleInputChange('reason', e.target.value)}
                                rows={2}
                                isFocusRing={false}
                                isBorderLeft={true}
                                borderColor="red-td-500"
                            />
                        </div>

                        <div className="space-y-4 pt-6 border-t">
                            <h3 className="text-2xl font-normal text-gray-900 mb-8">Repayments</h3>
                            <div className="grid grid-cols-1 gap-6">
                                {/* Deduction Start Date */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Deduction Start Date
                                        <span className="text-red-500">*</span>
                                        <span className="ml-1 text-gray-400 cursor-help" title="Enter EMI deduction start date">ⓘ</span>
                                    </label>
                                    <ReuseableInput
                                        id="deductionStartDate"
                                        name="deductionStartDate"
                                        value={formData.deductionStartDate}
                                        onChange={(e) => handleInputChange('deductionStartDate', e.target.value)}
                                        isFocusRing={false}
                                        isBorderLeft={true}
                                        type="date"
                                        borderColor="red-td-500"
                                    />
                                </div>

                                {/* Instalment Amount */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Instalment Amount<span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <ReuseableInput
                                            id="instalmentAmount"
                                            name="instalmentAmount"
                                            isDollar={true}
                                            value={formData.instalmentAmount}
                                            onChange={(e) => handleInputChange('instalmentAmount', e.target.value)}
                                            placeholder="Enter Instalment Amount"
                                            isFocusRing={false}
                                            isBorderLeft={true}
                                            type="number"
                                            borderColor="red-td-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Loan Information */}
                    {formData?.loanAmount && formData?.instalmentAmount && (
                        <div className="w-[90%] bg-blue-td-50 rounded-lg p-4 mt-5">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 text-blue-td-600">
                                    <CalendarDots size={20} />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm">
                                        {`This ${loanLabelLowercase} will be fully paid off in ${
                                            formData.loanAmount && formData.instalmentAmount && parseFloat(formData.instalmentAmount) > 0
                                            ? Math.ceil(parseFloat(formData.loanAmount) / parseFloat(formData.instalmentAmount))
                                            : 1
                                        } instalments. The first deduction for this ${loanLabelLowercase} will be on ${
                                            (formData.deductionStartDate || formData.disbursementDate)
                                            ? dayjs(formData.deductionStartDate || formData.disbursementDate).format("DD/MM/YYYY")
                                            : "Not Set"
                                        }.`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                    <div className="flex space-x-4">
                        <ButtonReusable 
                            title={isUpdate ? "Update" : "Save"} 
                            action={handleSubmit} 
                            isLoading={loading} 
                        />
                        {!loading && <ButtonReusable title={"Cancel"} action={handleCancel} isBLue={false} />}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalLoans}
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
                    setShowModal={setModalLoans} 
                    formFor="loanName"
                    titleForm={`${loanLabel} Name`}
                    data={isAdvance || isLoanAdvance ? "advance-salary" : "loans"}
                />
            </Modal>
        </div>
    );
}

export default LoanForm;