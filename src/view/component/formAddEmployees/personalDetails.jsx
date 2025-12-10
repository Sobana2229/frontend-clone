import { useEffect, useState } from "react";
import ButtonReusable from "../buttonReusable";
import EmploymentDetails from "./personDetail/employmentDetails";
import ExtendedPersonalForm from "./personDetail/extendedPersonalForm";
import employeeStoreManagements from "../../../store/tdPayroll/employee";
import { toast } from "react-toastify";
import organizationStoreManagements from "../../../store/tdPayroll/setting/organization";
import Modal from "react-modal";
import FormModal from "../formModal";
import configurationStoreManagements from "../../../store/tdPayroll/configuration";
import { CustomToast } from "../customToast";
import { useLocation } from "react-router-dom";

function PersonalDetails({
    cancel, 
    setStep,
    uuid, 
    isAdding, 
    isPaymentInformation, 
    setStepComplated,
    isAddEmployee
}) {
    const { pathname } = useLocation();
    const { updateEmployee, fetchEmployeePersonalDetail, dataEmployeePersonalDetail, dataEmployeePaymentInformation } = employeeStoreManagements();
    const { 
        designationOptions, 
        departementOptions, 
        workLocationOptions,
        employmentTypeOptions,
        fetchOrganizationSetting,
    } = organizationStoreManagements();
    const { 
        fetchStateData,
        stateData,
        fetchCityData,
        city,
        phoneNumberData,
        fetchPhoneNumberData
    } = configurationStoreManagements();
    const [modalWorkLocations, setModalWorkLocations] = useState(false);
    const [modalDesignation, setModalDesignation] = useState(false);
    const [modalDepartement, setModalDepartement] = useState(false);
    const [dataCityPresent, setDataCityPresent] = useState([]);
    const [dataStatePresent, setDataStatePresent] = useState([]);
    const [dataCountryPresent, setDataCountryPresent] = useState([]);
    const [dataCityPermanent, setDataCityPermanent] = useState([]);
    const [dataStatePermanent, setDataStatePermanent] = useState([]);
    const [dataCountryPermanent, setDataCountryPermanent] = useState([]);
    const [formData, setFormData] = useState({
        personalDetailPaymentInformation: {
            paymentMethod: 'Bank Transfer', // 'Bank Transfer' | 'Cheque' | 'Cash'
            bankName: '',
            accountHolderName: '',
            accountNumber: '',
        },
        
        nickname: '',
        probationEndDate: '',
        statutoryComponents: {
            spk: false,
        },
        employmentTypeUuid: '',
        // ✅ REMOVED: citizenshipCategory, idType, idNumber (moved to Employee table)
        workPermitPassDetails: '',
        employeeStatus: 'Active',
        dateOfExit: '',
        systemRole: 'Employee Self Service',
        workPermitExpiry: '',
        tapNo: '',
        scpNo: '',
        spkNo: '',

        // Personal Info
        dateOfBirth: '',
        age: '',
        gender: '',  // TAMBAHAN INI
        maritalStatus: 'Single',
        residentialStatus: 'Resident',
        aboutMe: '',
        bloodGroup: '',
        personalMobile: '',
        personalEmail: '',
        
        // Emergency Contact
        emergencyContactName: '',
        emergencyContactRelationship: '',
        emergencyContactMobile: '',
        emergencyContactAddress: '',
        
        // Present Address
        presentAddressLine1: '',
        presentAddressLine2: '',
        presentPostcode: '',
        presentStateUuid: null,  // TAMBAHAN INI
        presentCountryUuid: null,
        presentCityUuid: null,  // TAMBAHAN INI
        
        // Permanent Address
        permanentAddressLine1: '',
        permanentAddressLine2: '',
        permanentPostcode: '',
        permanentCountryUuid: null,
        permanentCityUuid: null,  // TAMBAHAN INI
        permanentStateUuid: null,  // TAMBAHAN INI
        sameAsPresentAddress: false,  // TAMBAHAN INI
        
        // Work Experience (Array)
        workExperiences: [{
            companyName: '',
            jobTitle: '',
            fromDate: '',
            toDate: '',
            jobDescription: '',
            relevant: 'Select'
        }],
        
        // Education Details (Array)
        educationDetails: [{
            instituteName: '',
            degreeDiploma: '',
            specialization: '',
            dateOfCompletion: '',
            score: 0  // TAMBAHAN INI
        }],

        // Other fields - DI LUAR ARRAY
        FatherName: '',
        differentlyAbledType: 'None',

        // Basic Information
        employeeId: '',
        nickName: '',
        firstName: '',
        middleName: '',
        lastName: '',
        emailAddress: '',

        // Work Information
        departementUuid: '',
        roleUuid: '',
        workLocationUuid: '',
        designationUuid: '',
        dateOfJoining: '',
        
        // ✅ Employee Status (for Employees model - active/inactive)
        status: 'active',
        
        // ✅ Enable Portal Access
        isEnablePortalAccess: false,

        // Identity Information - TAMBAHAN INI
        icNumber: '',
        drivingLicense: '',
        passportNumber: '',

        // Contact Details - TAMBAHAN INI
        phoneNumber: '',
        workPhone1PhoneCode: '+673',
        workPhone1FlagIso: '',
        phoneNumber2: '',
        workPhone2PhoneCode: '+673',
        workPhone2FlagIso: '',
        personalMobilePhoneCode: '+673',
        personalMobileFlagIso: '',
    });
    
    useEffect(() => {
        const fetchCities = async () => {
            if(formData.presentStateUuid) {
                const data = await fetchCityData(formData.presentStateUuid);
                setDataCityPresent(data);
            }
            if(formData.permanentStateUuid) {
                const data = await fetchCityData(formData.permanentStateUuid);
                setDataCityPermanent(data);
            }
        };
        fetchCities();
    }, [formData.presentStateUuid, formData.permanentStateUuid]);

    useEffect(() => {
        const fetchStates = async () => {
            // UBAH INI - harusnya country bukan city
            if(formData.presentCountryUuid) {  // UBAH dari presentCityUuid
                const data = await fetchStateData(formData.presentCountryUuid);
                setDataStatePresent(data);  // UBAH dari setDataCityPresent
            }
            if(formData.permanentCountryUuid) {  // UBAH dari permanentCityUuid
                const data = await fetchStateData(formData.permanentCountryUuid);
                setDataStatePermanent(data);  // UBAH dari setDataCityPermanent
            }
        };
        fetchStates();
    }, [formData.presentCountryUuid, formData.permanentCountryUuid]); // UBAH dependency

    useEffect(() => {
        const fetchCountry = async () => {
            const data = await fetchPhoneNumberData();
            setDataCountryPresent(data);
            setDataCountryPermanent(data);
        };
        fetchCountry();           
    }, [phoneNumberData?.length, fetchPhoneNumberData]);
    
    useEffect(() => {
        if(dataEmployeePersonalDetail && uuid) {
            setFormData({
                nickname: dataEmployeePersonalDetail?.nickname,
                probationEndDate: dataEmployeePersonalDetail?.probationEndDate
                    ? new Date(dataEmployeePersonalDetail?.probationEndDate).toISOString().split('T')[0] 
                    : '',
                statutoryComponents: {
                    spk: dataEmployeePersonalDetail?.spk,
                },
                employmentTypeUuid: dataEmployeePersonalDetail?.EmploymentType?.uuid,
                // ✅ REMOVED: citizenshipCategory, idType, idNumber (moved to Employee table - use employeeData?.citizenCategory, employeeData?.icType, employeeData?.spkAccountNumber)
                workPermitPassDetails: dataEmployeePersonalDetail?.workPermitPassDetails,
                employeeStatus: dataEmployeePersonalDetail?.employeeStatus,
                dateOfExit: dataEmployeePersonalDetail?.dateOfExit
                    ? new Date(dataEmployeePersonalDetail?.dateOfExit).toISOString().split('T')[0] 
                    : '',
                systemRole: dataEmployeePersonalDetail?.systemRole,
                workPermitExpiry: dataEmployeePersonalDetail?.workPermitExpiry
                    ? new Date(dataEmployeePersonalDetail?.workPermitExpiry).toISOString().split('T')[0] 
                    : '',
                tapNo: dataEmployeePersonalDetail?.tapNo,
                scpNo: dataEmployeePersonalDetail?.scpNo,
                spkNo: dataEmployeePersonalDetail?.spkNo,

                // Personal Info
                dateOfBirth: dataEmployeePersonalDetail?.dateOfBirth
                    ? new Date(dataEmployeePersonalDetail?.dateOfBirth).toISOString().split('T')[0] 
                    : '',
                age: dataEmployeePersonalDetail?.age,
                // Ambil gender dari employeeData (bukan lagi dari relasi Employee)
                gender: dataEmployeePersonalDetail?.employeeData?.gender || '',
                maritalStatus: dataEmployeePersonalDetail?.maritalStatus,
                residentialStatus: dataEmployeePersonalDetail?.residentialStatus,
                aboutMe: dataEmployeePersonalDetail?.aboutMe,
                bloodGroup: dataEmployeePersonalDetail?.bloodGroup,
                personalMobile: dataEmployeePersonalDetail?.personalMobile,
                personalEmail: dataEmployeePersonalDetail?.personalEmail,
                
                // Emergency Contact
                emergencyContactName: dataEmployeePersonalDetail?.emergencyContactName,
                emergencyContactRelationship: dataEmployeePersonalDetail?.emergencyContactRelationship,
                emergencyContactMobile: dataEmployeePersonalDetail?.emergencyContactMobile,
                emergencyContactAddress: dataEmployeePersonalDetail?.emergencyContactAddress,
                
                // Present Address - UPDATE INI
                presentAddressLine1: dataEmployeePersonalDetail?.presentAddressLine1 || '',
                presentAddressLine2: dataEmployeePersonalDetail?.presentAddressLine2 || '',
                presentPostcode: dataEmployeePersonalDetail?.presentPostcode || '',
                presentCountryUuid: dataEmployeePersonalDetail?.presentCountryUuid || null,
                presentCityUuid: dataEmployeePersonalDetail?.presentCityUuid || null,  // TAMBAHAN INI
                presentStateUuid: dataEmployeePersonalDetail?.presentStateUuid || null,  // TAMBAHAN INI
                
                // Permanent Address - UPDATE INI
                permanentAddressLine1: dataEmployeePersonalDetail?.permanentAddressLine1 || '',
                permanentAddressLine2: dataEmployeePersonalDetail?.permanentAddressLine2 || '',
                permanentPostcode: dataEmployeePersonalDetail?.permanentPostcode || '',
                permanentCountryUuid: dataEmployeePersonalDetail?.permanentCountryUuid || null,
                permanentCityUuid: dataEmployeePersonalDetail?.permanentCityUuid || null,
                permanentStateUuid: dataEmployeePersonalDetail?.permanentStateUuid || null,
                sameAsPresentAddress: dataEmployeePersonalDetail?.sameAsPresentAddress  || false,

                // Other fields
                differentlyAbledType: dataEmployeePersonalDetail?.differentlyAbledType || 'None',
                FatherName: dataEmployeePersonalDetail?.FatherName || '',
                
                // Work Experience (Array)
                workExperiences: dataEmployeePersonalDetail?.WorkExperiences?.map(exp => ({
                    companyName: exp.companyName || '',
                    jobTitle: exp.jobTitle || '',
                    fromDate: exp.fromDate 
                        ? new Date(exp.fromDate).toISOString().split('T')[0] 
                        : '',
                    toDate: exp.toDate 
                        ? new Date(exp.toDate).toISOString().split('T')[0] 
                        : '',
                    jobDescription: exp.jobDescription || '',
                    relevant: exp.isRelevant ? 'Yes' : 'No'
                })) || [{
                    companyName: '',
                    jobTitle: '',
                    fromDate: '',
                    toDate: '',
                    jobDescription: '',
                    relevant: 'Select'
                }],
                
                // Education Details (Array)
                educationDetails: dataEmployeePersonalDetail?.EducationDetails?.map(edu => ({
                    instituteName: edu.instituteName || '',
                    degreeDiploma: edu.degreeDiploma || '',
                    specialization: edu.specialization || '',
                    dateOfCompletion: edu.dateOfCompletion
                        ? new Date(edu.dateOfCompletion).toISOString().split('T')[0] 
                        : '',
                    score: edu.score || 0
                })) || [{
                    instituteName: '',
                    degreeDiploma: '',
                    specialization: '',
                    dateOfCompletion: '',
                    score: 0
                }],

                // Basic Information (ambil dari employeeData)
                employeeId: dataEmployeePersonalDetail?.employeeData?.employeeId || '',
                nickName: dataEmployeePersonalDetail?.nickname || '',
                firstName: dataEmployeePersonalDetail?.employeeData?.firstName || '',
                middleName: dataEmployeePersonalDetail?.employeeData?.middleName || '',
                lastName: dataEmployeePersonalDetail?.employeeData?.lastName || '',
                emailAddress: dataEmployeePersonalDetail?.employeeData?.email || '',

                // Work Information (ambil dari employeeData)
                departementUuid: dataEmployeePersonalDetail?.employeeData?.departementUuid || '',
                roleUuid: dataEmployeePersonalDetail?.employeeData?.roleUuid || '',
                workLocationUuid: dataEmployeePersonalDetail?.employeeData?.workLocationUuid || '',
                designationUuid: dataEmployeePersonalDetail?.employeeData?.designationUuid || '',
                dateOfJoining: dataEmployeePersonalDetail?.employeeData?.joinDate
                    ? new Date(dataEmployeePersonalDetail?.employeeData?.joinDate).toISOString().split('T')[0] 
                    : '',
                
                // ✅ Employee Status (for Employees model)
                status: dataEmployeePersonalDetail?.employeeData?.status || 'active',
                
                // ✅ Enable Portal Access
                isEnablePortalAccess: dataEmployeePersonalDetail?.employeeData?.isEnablePortalAccess || false,

                // Contact Details
                phoneNumber: dataEmployeePersonalDetail?.employeeData?.phoneNumber || '',
                // gunakan workPhone1PhoneCode kalau ada, fallback ke phoneCode, lalu default
                workPhone1PhoneCode: dataEmployeePersonalDetail?.employeeData?.workPhone1PhoneCode 
                    || dataEmployeePersonalDetail?.employeeData?.phoneCode 
                    || '+673',
                workPhone1FlagIso: dataEmployeePersonalDetail?.employeeData?.workPhone1FlagIso 
                    || dataEmployeePersonalDetail?.employeeData?.flagIso 
                    || '',
                phoneNumber2: dataEmployeePersonalDetail?.employeeData?.phoneNumber2 || '',
                workPhone2PhoneCode: dataEmployeePersonalDetail?.employeeData?.workPhone2PhoneCode || '+673',
                workPhone2FlagIso: dataEmployeePersonalDetail?.employeeData?.workPhone2FlagIso || '',
                personalMobilePhoneCode: dataEmployeePersonalDetail?.personalMobilePhoneCode || '+673',
                personalMobileFlagIso: dataEmployeePersonalDetail?.personalMobileFlagIso || '',

                // Identity
                icNumber: dataEmployeePersonalDetail?.icNumber || '',
                drivingLicense: dataEmployeePersonalDetail?.drivingLicense || '',
                passportNumber: dataEmployeePersonalDetail?.passportNumber || '',
                citizenCategory: dataEmployeePersonalDetail?.employeeData?.citizenCategory || '',
                icType: dataEmployeePersonalDetail?.employeeData?.icType || '',
                spkAccountNumber: dataEmployeePersonalDetail?.employeeData?.spkAccountNumber || '',
            });
        } else {
            const access_token = localStorage.getItem("accessToken");
            fetchEmployeePersonalDetail(access_token, uuid);
        }
    }, [uuid, dataEmployeePersonalDetail]);

    useEffect(() => {
        if(dataEmployeePaymentInformation) {
            setFormData(prev => ({
                ...prev,
                personalDetailPaymentInformation: {
                    paymentMethod: dataEmployeePaymentInformation?.paymentMethod || 'Bank Transfer',
                    bankName: dataEmployeePaymentInformation?.bankName || '',
                    accountHolderName: dataEmployeePaymentInformation?.accountHolderName || '',
                    accountNumber: dataEmployeePaymentInformation?.accountNumber || '',
                    accountType: dataEmployeePaymentInformation?.accountType || '',
                },
            }));
        } else {    
            const access_token = localStorage.getItem("accessToken");
            fetchEmployeePersonalDetail(access_token, uuid, "payment-information");
        }
    }, [uuid, dataEmployeePaymentInformation]);
    
    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        
        if(designationOptions?.length === 0) {
            fetchOrganizationSetting("designation", access_token);
        }
        
        if(departementOptions?.length === 0) {
            fetchOrganizationSetting("departement", access_token);
        }
        
        if(workLocationOptions?.length === 0) {
            fetchOrganizationSetting("work-location", access_token);
        }

        if(employmentTypeOptions?.length === 0) {
            fetchOrganizationSetting("employee-type", access_token, false, null, true);
        }
    }, []);

    // Handler untuk select changes
    const handleWorkLocationSelect = (selectedOption) => {
        if(selectedOption.value === "create-new-data"){
        setModalWorkLocations(true);
        } else {
        setFormData(prev => ({
            ...prev,
            workLocationUuid: selectedOption.value,
        }));
        }
    };

    const handleDepartementSelect = (selectedOption) => {
        if(selectedOption.value === "create-new-data"){
        setModalDepartement(true);
        } else {
        setFormData(prev => ({
            ...prev,
            departementUuid: selectedOption.value,
        }));
        }
    };

    const handleDesignationSelect = (selectedOption) => {
        if(selectedOption.value === "create-new-data"){
        setModalDesignation(true);
        } else {
        setFormData(prev => ({
            ...prev,
            designationUuid: selectedOption.value,
        }));
        }
    };

    // present
    const handlePresentCitySelect = (selectedOption) => {
        if (selectedOption) {
        setFormData(prev => ({
            ...prev,
            presentCityUuid: selectedOption.value,
        }));
        }
    };

    const handlePresentStateSelect = async (selectedOption) => {
        const { value, label } = selectedOption;
        if (value) {
        setFormData(prev => ({
            ...prev,
            presentStateUuid: value,
            presentCityUuid: ""
        }));
        const data = await fetchCityData(value);
        setDataCityPresent(data);
        } else {
        setFormData(prev => ({
            ...prev,
            presentStateUuid: '',
            presentCityUuid: ''
        }));
        }
    };

    const handlePresentCountrySelect = async (selectedOption) => {
        const { value, label } = selectedOption;
        if (value) {
        setFormData(prev => ({
            ...prev,
            presentCountryUuid: value,
            presentStateUuid: "",
            presentCityUuid: ""
        }));
        const data = await fetchStateData(value);
        setDataStatePresent(data);
        } else {
        setFormData(prev => ({
            ...prev,
            presentCountryUuid: '',
            presentStateUuid: '',
            presentCityUuid: ''
        }));
        }
    };

    // permanent
    const handlePermanentCitySelect = (selectedOption) => {
        if (selectedOption) {
        setFormData(prev => ({
            ...prev,
            permanentCityUuid: selectedOption.value,
        }));
        }
    };

    const handlePermanentStateSelect = async (selectedOption) => {
        const { value, label } = selectedOption;
        if (value) {
        setFormData(prev => ({
            ...prev,
            permanentStateUuid: value,
            permanentCityUuid: ""
        }));
        const data = await fetchCityData(value);
        setDataCityPermanent(data);
        } else {
        setFormData(prev => ({
            ...prev,
            permanentStateUuid: '',
            permanentCityUuid: ''
        }));
        }
    };

    const handlePermanentCountrySelect = async (selectedOption) => {
        const { value, label } = selectedOption;
        if (value) {
        setFormData(prev => ({
            ...prev,
            permanentCountryUuid: value,
            permanentStateUuid: "",
            permanentCityUuid: ""
        }));
        const data = await fetchStateData(value);
        setDataStatePermanent(data);
        } else {
        setFormData(prev => ({
            ...prev,
            permanentCountryUuid: '',
            permanentStateUuid: '',
            permanentCityUuid: ''
        }));
        }
    };

    const handleSubmit = async () => { 
        // Validate SPK Account Number for Brunei Citizen and Permanent
        if ((formData.citizenCategory === 'Brunei Citizen' || formData.citizenCategory === 'Permanent') && 
            (!formData.spkAccountNumber || formData.spkAccountNumber.trim() === '')) {
            toast(<CustomToast message="SPK Account Number is required for Brunei Citizen and Permanent residents" status={"error"} />, {
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
            return;
        }

        const access_token = localStorage.getItem("accessToken");
        const params = {
            isPaymentInformation,
            isAddEmployee
        };
        const response = await updateEmployee(formData, access_token, uuid, params);
        if(response){
            await fetchEmployeePersonalDetail(access_token, uuid);
            if(isPaymentInformation){
                await fetchEmployeePersonalDetail(access_token, uuid, "payment-information");
            }
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
            if (pathname == "/add-employees") {
                setStepComplated(prev => [...prev, 3]);
                setStep(4);
            }
        }
    };

    const handleCancel = () => {
        cancel();
    };
    return (
        <div className="bg-[#F9FAFB] p-4 space-y-10 rounded-lg">
            {/* <EmploymentDetails setFormData={setFormData} formData={formData} isAdding={isAdding} /> */}
            {/* disabled for now */}
            <ExtendedPersonalForm 
                personalDetailPaymentInformation={formData.personalDetailPaymentInformation}
                setFormData={setFormData} 
                formData={formData}
                departementOptions={departementOptions}
                workLocationOptions={workLocationOptions}
                designationOptions={designationOptions}
                employmentTypeOptions={employmentTypeOptions}
                phoneNumberData={phoneNumberData}
                handleDepartementSelect={handleDepartementSelect}
                handleWorkLocationSelect={handleWorkLocationSelect}
                handleDesignationSelect={handleDesignationSelect}
                setModalDepartement={setModalDepartement}
                setModalWorkLocations={setModalWorkLocations}
                setModalDesignation={setModalDesignation}
                dataStatePresent={dataStatePresent}
                dataStatePermanent={dataStatePermanent}
                dataCityPresent={dataCityPresent}
                dataCityPermanent={dataCityPermanent}
                dataCountryPresent={dataCountryPresent}
                dataCountryPermanent={dataCountryPermanent}
                handlePresentCitySelect={handlePresentCitySelect}
                handlePresentStateSelect={handlePresentStateSelect}
                handlePresentCountrySelect={handlePresentCountrySelect}
                handlePermanentCitySelect={handlePermanentCitySelect}
                handlePermanentStateSelect={handlePermanentStateSelect}
                handlePermanentCountrySelect={handlePermanentCountrySelect}
            />
            {/* Submit Buttons */}
            <div className="py-5 border-t w-full flex items-center justify-start space-x-3">
                <ButtonReusable title={"Save"} action={handleSubmit} />
                <ButtonReusable title={"cancel"} action={handleCancel} isBLue={false} />
            </div>

            {/* Modal Work Location */}
            <Modal
                isOpen={modalWorkLocations}
                contentLabel="Work Location Modal"
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
            <FormModal
                setShowModal={setModalWorkLocations} 
                formFor={"worklocations"}
                titleForm={"Work Locations"}
            />
            </Modal>

            {/* Modal Designation */}
            <Modal
                isOpen={modalDesignation}
                contentLabel="Designation Modal"
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
            <FormModal
                setShowModal={setModalDesignation} 
                isSingle={true}
                label={"Designation"}
                titleForm={"Designation"}
            />
            </Modal>

            {/* Modal Department */}
            <Modal
                isOpen={modalDepartement}
                contentLabel="Department Modal"
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
            <FormModal
                setShowModal={setModalDepartement} 
                titleForm={"Departement"}
                formFor={"departement"}
            />
            </Modal>
        </div>
    );
}

export default PersonalDetails;