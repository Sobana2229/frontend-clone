import { useEffect, useState } from 'react';
import GuideLeaveAndAttendance from '../../../component/leaveAndAttendance/guideLeaveAndAttendance';
import HeaderLeaveAndAttendance from '../../../component/leaveAndAttendance/headerLeaveAndAttendance';
import TableReusable from '../../../component/setting/tableReusable';
import { attendanceBreakLeaveAndAttandanceHeaders, attendanceLeaveAndAttandanceHeaders, attendanceLeaveAndAttandanceSidebar, getDefaultWeekendSchedule, holidayLeaveAndAttandanceDummy, holidayLeaveAndAttandanceHeaders, leaveTypeHolidayLeaveAndAttandanceHeaders, leaveTypeLeaveAndAttandanceHeaders, leaveTypesLeaveAndAttandanceSidebar, shiftLeaveAndAttandanceHeaders } from '../../../../../data/dummy';
import Modal from "react-modal";
import FormModal from "../../../component/formModal";
import { toast } from "react-toastify";
import UploadFormFile from '../../../component/uploadFormFile';
import leaveAndAttendanceStoreManagements from '../../../../store/tdPayroll/setting/leaveAndAttendance';
import dayjs from "dayjs";
import PaginationPages from '../../../component/paginations';
import FormHoliday from '../../../component/leaveAndAttendance/formHoliday';
import FormShift from '../../../component/leaveAndAttendance/formShift';
import { convertWeekendScheduleFromAPI, formatAttendanceResponse, transformApplicableForFromDatabase, transformCriteriaBasedEmployees, transformEligibility } from '../../../../../helper/globalHelper';
import FormAttendance from '../../../component/leaveAndAttendance/formAttendance';
import FormAttendancePolicy from '../../../component/leaveAndAttendance/formAttendancePolicy';
import FormLeaveType from '../../../component/leaveAndAttendance/formLeaveType';
import FormAttendanceBreak from '../../../component/leaveAndAttendance/formAttendanceBreak ';
import FormLeaveTypeHoliday from '../../../component/leaveAndAttendance/formLeaveTypeHoliday';
import SetupPreference from '../../../component/leaveAndAttendance/setupPreference';

function LeaveAndAttendance() {
    const { fetchLeaveAndAttendance, holidayData, loading, fetchOneLeaveAndAttendance, deleteLeaveAndAttendance, shiftData, attendanceData, leaveTypesData, changeStatusLeaveAndAttendance, attendanceBreakData, leaveTypesDataHoliday } = leaveAndAttendanceStoreManagements();
    const [sectionActive, setSectionActive] = useState("");
    const [sideMenuActive, setSideMenuActive] = useState("");
    const [formSection, setFormSection] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);
    const [showUploadFile, setShowUploadFile] = useState(false);
    const [showExportFile, setShowExportFile] = useState(false);
    const [ExportTypeFile, setExportTypeFile] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [tempData, setTempData] = useState({});
    const [tempUuid, setTempUuid] = useState(null);
    const isSectionEmpty = () => {
        if(sectionActive === "attendance") {
            if(sideMenuActive === "Break") {
                return !attendanceBreakData?.list || attendanceBreakData.list.length === 0;
            }
            return !attendanceData?.list || attendanceData.list.length === 0;
        }
        if(sectionActive === "leave-types") {
            return !leaveTypesData?.list || leaveTypesData.list.length === 0;
        }
        
        switch(sectionActive) {
            case "holiday":
                return !holidayData?.list || holidayData.list.length === 0;
            case "shift":
                return !shiftData?.list || shiftData.list.length === 0;
            default:
                return true;
        }
    };

    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        
        const getFetchType = () => {
            if(sectionActive === "attendance" && sideMenuActive === "Break") return "attendance-break";
            if(sectionActive === "holiday") return "leave-type-holiday";
            return sectionActive;
        };
        
        if(sectionActive && isSectionEmpty() && sectionActive !== "preferences") {
            fetchLeaveAndAttendance(access_token, getFetchType(), currentPage);
        }
    }, [currentPage, sectionActive, sideMenuActive]);


    useEffect(() => {
        setCurrentPage(1);
    }, [sectionActive]);

    useEffect(() => {
        if(sectionActive === "attendance"){
            setSideMenuActive("Specific Policies");
        }else if(sectionActive === "leave-types"){
            setSideMenuActive("Leave and Policy");
        }else{
            setSideMenuActive("");
        }
    }, [sectionActive]);

    const handleConfiguration = (section) => {
        if(sideMenuActive) {
            setSideMenuActive("");
            setSectionActive("");
            return;
        }
        
        if(section === sectionActive) {
            setSectionActive("");
            return;
        }
        setSectionActive(section);
    }

    const handleShowForm = (section) => {
        if(section === formSection) {
            setFormSection("")
            resetFormState();
            return;
        }
        resetFormState();
        setShowUploadFile(false);
        
        if(sectionActive === "attendance" && sideMenuActive === "Break") {
            setFormSection("Break");
        } else if(sectionActive === "holiday") {
            setFormSection("Holiday");
        } else {
            setFormSection(section);
        }
    }

    const handleEdit = async (uuid) => {        
        const access_token = localStorage.getItem("accessToken");
        const getQueryType = () => {
            if(sectionActive === "attendance" && sideMenuActive === "Break") return "attendance-break";
            if(sectionActive === "holiday") return "leave-type-holiday";
            return sectionActive;
        };
        const queryType = getQueryType();
        const response = await fetchOneLeaveAndAttendance(access_token, queryType, uuid);
        if(sectionActive === "holiday") {
            const formData = {
                name: response?.name || "",
                startDate: response?.startDate ? dayjs(response?.startDate).format('YYYY-MM-DD') : "",
                endDate: response?.endDate ? dayjs(response?.endDate).format('YYYY-MM-DD') : "",
                lassification: response?.classification || "Holiday",
                description: response?.description || "",
                reminderDays: response?.reminderDays || "",
                notifyEmployees: response?.notifyEmployees || true,
                reprocessLeaveApplications: response?.reprocessLeaveApplications || false,
                applicableFor: response?.applicableFor && response?.applicableFor.length > 0 
                    ? transformApplicableForFromDatabase(response?.applicableFor)
                    : [{ field: 'Shift', value: [] }]
            };
            
            setTempUuid(uuid);
            setTempData(formData);
            setIsUpdate(true);
            setFormSection("Holiday");
        }
        // else if(sectionActive == "holiday"){
        //     const formData = {
        //         holidayName: response?.holidayName,
        //         startDate: dayjs(response?.startDate).format('YYYY-MM-DD'),
        //         endDate: dayjs(response?.endDate).format('YYYY-MM-DD'),
        //         description: response?.description,
        //         workLocation: response?.workLocation,
        //     }
        //     setTempUuid(uuid);
        //     setTempData(formData);
        //     setIsUpdate(true);
        //     setFormSection("Holiday");
        // }
        else if(sectionActive == "shift"){                        
            const formData = {
                shiftName: response?.shiftName || '',
                color: response?.color || '#3B82F6',
                fromTime: response?.fromTime || '09:00',
                toTime: response?.toTime || '18:00',
                coreWorkingHours: response?.CoreHoursSlotShifts?.length > 0,
                coreHoursSlots: response?.CoreHoursSlotShifts || [{ from: '', to: '' }],
                weekendBasedOn: response?.weekendBasedOn || 'location',
                halfWorkingDay: response?.halfWorkingDay || false,
                weekendSchedule: response?.WeekendScheduleShifts 
                    ? convertWeekendScheduleFromAPI(response?.WeekendScheduleShifts)
                    : getDefaultWeekendSchedule(),
                eligibilityCriteria: transformEligibility(response?.EligibilityCriteriaShifts) || [{ field: 'Locations', value: [] }]
            }
            setTempUuid(uuid);
            setTempData(formData);
            setIsUpdate(true);
            setFormSection(sectionActive);
        }else if(sectionActive == "attendance" && sideMenuActive !== "Break"){                
            const formData = {
                settingsName: response?.settingsName || "",
                applicableTo: response?.applicableTo || "Shift",
                selectValue: formatAttendanceResponse(response) || "",
                workingHoursCalculation: response?.workingHoursCalculation || "every-valid-check",
                expectedHoursMode: response?.expectedHoursMode || "strict",
                hoursSettingMode: response?.hoursSettingMode || "shift-hours",
                fullDayHours: response?.fullDayHours || null,
                halfDayHours: response?.halfDayHours || null,
                expectedHoursPerDay: response?.expectedHoursPerDay || null,
                allowOvertimeAndDeviation: response?.allowOvertimeAndDeviation || false,
                imposeMaximumHoursPerDay: response?.imposeMaximumHoursPerDay || false,
                maxHoursPerDay: response?.maxHoursPerDay || null,
                roundOff: response?.roundOff || false,
                roundOffFirstCheckIn: response?.roundOffFirstCheckIn || null,
                roundOffLastCheckOut: response?.roundOffLastCheckOut || null,
                roundOffWorkedHours: response?.roundOffWorkedHours || null,
                gracePeriodPolicy: response?.gracePeriodPolicy || false,
                gracePeriodRules: response?.AttendanceGracePeriodRules?.map(rule => {
                    const deviationConditions = {
                    lateCheckIn: { enabled: false, time: '' },
                    earlyCheckOut: { enabled: false, time: '' },
                    lessWorkingHours: { enabled: false, time: '' },
                    lessCoreHours: { enabled: false, time: '' }
                    };
                    rule.gracePeriodRuleCondition?.forEach(condition => {
                    if (deviationConditions.hasOwnProperty(condition.conditionTy)) {
                        deviationConditions[condition.conditionTy] = {
                        enabled: condition.enabled || false,
                        time: condition.time || ''
                        };
                    }
                    });

                    return {
                    id: rule.uuid,
                    deviationType: rule.deviationType || 'more-than',
                    deviationCount: rule.deviationCount || 0,
                    timePeriod: rule.timePeriod || 'week',
                    multipleValue: rule.multipleValue || 1,
                    multiplePeriod: rule.multiplePeriod || 'month',
                    deductDays: parseFloat(rule.deductDays) || 0.5,
                    leaveTypes: rule.leaveTypes || [],
                    deviationConditions: deviationConditions
                    };
                }) || [],
                regularizationPolicy: response?.regularizationPolicy || "allow-anytime",
                regularizationDaysLimit: response?.regularizationDaysLimit || 5,
                restrictRegularizationDays: response?.restrictRegularizationDays || false,
                maxRegularizationDaysPerMonth: response?.maxRegularizationDaysPerMonth || null,
                effectiveDate: response?.attendancePlan?.effectiveDate 
                    ? dayjs(response?.attendancePlan.effectiveDate).format('YYYY-MM-DD') : "",
                effectiveDateDisplay: response?.attendancePlan 
                    ? dayjs(response?.attendancePlan.effectiveDate).format('YYYY-MM-DD') 
                    : dayjs(response?.updatedAt).format('YYYY-MM-DD'),
            };
            setTempUuid(uuid);
            setTempData(formData);
            setIsUpdate(true);
            setFormSection("attendance");
        } else if(sectionActive === "attendance" && sideMenuActive === "Break") {
            const formData = {
                name: response?.name || "",
                color: response?.color || "#3B82F6",
                icon: response?.icon || "Coffee",
                type: response?.type || "paid",
                fromTime: response?.fromTime ? response?.fromTime.substring(0, 5) : "", // ← FORMAT INI "14:00:00" → "14:00"
                toTime: response?.toTime ? response?.toTime.substring(0, 5) : "", // ← FORMAT INI "15:00:00" → "15:00"
                effectiveDate: response?.effectiveDayBreakPlan?.effectiveDate 
                    ? dayjs(response?.effectiveDayBreakPlan.effectiveDate).format('YYYY-MM-DD') 
                    : "",
                applicableShifts: response?.applicableShifts || [],
                typeDisplay: response?.effectiveDayBreakPlan?.type || response?.type,
                effectiveDateDisplay: response?.effectiveDayBreakPlan ? dayjs(response?.effectiveDayBreakPlan.effectiveDate).format('YYYY-MM-DD') : dayjs(response?.updatedAt).format('YYYY-MM-DD'),
            } 

            setTempUuid(uuid);
            setTempData(formData);
            setIsUpdate(true);
            setFormSection("Break");
        } else if(sectionActive == "leave-types"){
            const formData = {
                leaveName: response?.leaveName || "",
                code: response?.code || "",
                selectType: response?.selectType || "",
                description: response?.description || "",
                showDescription: response?.description ? true : false,
                leaveAllocation: response?.leaveAllocation || "",
                leaveDays: response?.leaveDays || null,
                proRateBalance: response?.proRateBalance || false,
                resetLeaveBalance: response?.resetLeaveBalance || false,
                resetFrequency: response?.resetFrequency || "",
                carryForwardUnused: response?.carryForwardUnused || false,
                maxCarryForwardDays: response?.maxCarryForwardDays || null,
                encashRemaining: response?.encashRemaining || false,
                maxEncashmentDays: response?.maxEncashmentDays || null,
                allowNegativeBalance: response?.allowNegativeBalance || false,
                negativeBalanceType: response?.negativeBalanceType || "Year End Limit",
                allowPastDates: response?.allowPastDates || true,
                pastDateLimit: response?.pastDateLimit || "no-limit",
                pastDaysLimit: response?.pastDaysLimit || null,
                allowFutureDates: response?.allowFutureDates || true,
                futureDateLimit: response?.futureDateLimit || "no-limit",
                futureDaysLimit: response?.futureDaysLimit || null,
                applicableTo: response?.applicableTo || "all-employees",
                criteriaBasedEmployees: transformCriteriaBasedEmployees(response?.CriteriaBasedEmployees) || [
                    { field: 'Shift', value: [] }
                ],
                postponeLeaveCredits: response?.postponeLeaveCredits || false,
                postponeDays: response?.postponeDays || null,
                postponePeriod: response?.postponePeriod || "Year",
                effectiveDate: response?.leaveTypePlan?.effectiveDate 
                    ? dayjs(response?.leaveTypePlan.effectiveDate).format('YYYY-MM-DD') 
                    : "",
                hasExpiryDate: response?.hasExpiryDate || false,
                expiryDate: response?.expiryDate 
                    ? dayjs(response?.expiryDate).format('YYYY-MM-DD') 
                    : "",
                effectiveDateDisplay: response?.leaveTypePlan 
                    ? dayjs(response?.leaveTypePlan.effectiveDate).format('YYYY-MM-DD') 
                    : dayjs(response?.updatedAt).format('YYYY-MM-DD'),
                selectTypeDisplay: response?.leaveTypePlan?.selectType ?? response?.selectType ?? ""
            };

            setTempUuid(uuid);
            setTempData(formData);
            setIsUpdate(true);
            setFormSection(sectionActive);
        }
    }

    const handleChangeActiveStatus = async (uuid, item, type) => {
        const access_token = localStorage.getItem("accessToken");
        const response = await changeStatusLeaveAndAttendance(access_token, type, uuid);
        if(response){ 
            await fetchLeaveAndAttendance(access_token, sectionActive === "attendance" && sideMenuActive === "Break" ? "attendance-break" : sectionActive, 1);
            toast.success(response, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            })
        }
    }

    const handleFileAction = (type) => {
       if(type == "Import") {
        setShowUploadFile(true)
        return;
       }
       setShowExportFile(true);
       setExportTypeFile(type);
    }

    const handleShowUploadForm = () => {
        setShowUploadFile(false)
    }

    const handleDelete = async (uuid) => {
        const access_token = localStorage.getItem("accessToken");
        const getDeleteType = () => {
            if(sectionActive === "attendance" && sideMenuActive === "Break") return "attendance-break";
            if(sectionActive === "holiday") return "leave-type-holiday";
            return sectionActive;
        };
        
        const deleteType = getDeleteType();
        const response = await deleteLeaveAndAttendance(access_token, deleteType, uuid);
        
        if(response){
            await fetchLeaveAndAttendance(access_token, deleteType, 1);
            toast.success(response, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                theme: "colored"
            })
        }
    }

    
    const resetFormState = () => {
        setIsUpdate(false);
        setTempData({});
        setTempUuid(null);
    }  
    return (
        <div className={`w-full h-full flex-col flex items-center ${sectionActive ? "justify-start" : "justify-center"}`}>
            {!sectionActive ? (
                <GuideLeaveAndAttendance handleConfiguration={handleConfiguration} />
            ) : (
                <>
                    <HeaderLeaveAndAttendance section={sectionActive} sideMenuActive={sideMenuActive} handleConfiguration={handleConfiguration} handleShowForm={handleShowForm} activeForm={formSection} handleOption={handleFileAction} showFormUpload={showUploadFile} isUpdate={tempData ? true : false} />
                    {showUploadFile ? (
                        <div className='w-full flex items-start justify-start p-5'>
                            <UploadFormFile handleShowForm={handleShowUploadForm} sampleFile={sectionActive} />     
                        </div>
                    ) : !formSection ? (
                        <div className='w-full h-full flex items-start justify-start'>
                            {(sectionActive === "attendance" && sectionActive !== "leave-types") && (
                                <div className="h-full w-[20%] flex flex-col items-start justify-start border-r">
                                    {sectionActive === "attendance" &&
                                        attendanceLeaveAndAttandanceSidebar?.map((el, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSideMenuActive(el)}
                                            className={`w-full p-3 text-base font-medium border-b duration-300 ease-in-out transition-all ${
                                                sideMenuActive === el ? "bg-gray-300" : ""
                                            } hover:bg-gray-300`}
                                        >
                                            {el}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {sectionActive === "attendance" && sideMenuActive === "Attendance Policy" ? (
                                <div className="w-full h-full relative">
                                    <FormAttendancePolicy />
                                </div>
                            ) : sectionActive === "attendance" && sideMenuActive === "Break" ? (
                                <div className="w-full h-full relative">
                                    <TableReusable dataHeaders={
                                        sectionActive === "attendance" && sideMenuActive === "Break" ? attendanceBreakLeaveAndAttandanceHeaders : []
                                    } dataTable={
                                        sectionActive === "attendance" && sideMenuActive === "Break" ? attendanceBreakData?.list : []
                                    } tableFor={sectionActive === "attendance" && sideMenuActive === "Break" ? "attendance-break" : sectionActive} handleEdit={handleEdit} handleDelete={handleDelete} handleChangeActiveStatus={handleChangeActiveStatus} />

                                    <div className="w-full absolute bottom-5 flex items-center justify-end">
                                        <PaginationPages totalPages={
                                            sectionActive === "attendance" && sideMenuActive === "Break" ? attendanceBreakData?.totalPage : 1
                                        } currentPage={currentPage} setCurrentPage={setCurrentPage} />
                                    </div>
                                </div>
                            ) : sectionActive == "holiday"  ? (
                                <div className="w-full h-full relative">
                                    <TableReusable 
                                        dataHeaders={leaveTypeHolidayLeaveAndAttandanceHeaders}
                                        dataTable={leaveTypesDataHoliday?.list || []}
                                        tableFor="leave-type-holiday"
                                        handleEdit={handleEdit} 
                                        handleDelete={handleDelete} 
                                        handleChangeActiveStatus={handleChangeActiveStatus} 
                                    />

                                    <div className="w-full absolute bottom-5 flex items-center justify-end">
                                        <PaginationPages 
                                            totalPages={leaveTypesDataHoliday?.totalPage || 1}
                                            currentPage={currentPage} 
                                            setCurrentPage={setCurrentPage} 
                                        />
                                    </div>
                                </div>
                            ) : sectionActive == "preferences"  ? (
                                <SetupPreference />
                            ) : (
                                <div className="w-full h-full relative">
                                    <TableReusable dataHeaders={
                                        sectionActive == "shift" ? shiftLeaveAndAttandanceHeaders :
                                        sectionActive == "attendance" ? attendanceLeaveAndAttandanceHeaders :
                                        sectionActive == "leave-types" ? leaveTypeLeaveAndAttandanceHeaders :
                                        []
                                    } dataTable={
                                        sectionActive == "shift" ? shiftData?.list :
                                        sectionActive == "attendance" ? attendanceData?.list :
                                        sectionActive == "leave-types" ? leaveTypesData?.list :
                                        []
                                    } tableFor={sectionActive} handleEdit={handleEdit} handleDelete={handleDelete} handleChangeActiveStatus={handleChangeActiveStatus} />
                                    <div className="w-full absolute bottom-5 flex items-center justify-end">
                                        <PaginationPages totalPages={
                                            sectionActive == "shift" ? shiftData?.totalPage :
                                            sectionActive == "attendance" ? attendanceData?.totalPage :
                                            sectionActive == "leave-types" ? leaveTypesData?.totalPage :
                                            1
                                        } currentPage={currentPage} setCurrentPage={setCurrentPage} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                    
                    <div className="w-full flex items-start justify-start">
                    {formSection === "shift" && <FormShift handleShowForm={handleShowForm} section={sectionActive} data={tempData} tempUuid={tempUuid} isUpdate={isUpdate} />}
                    {(formSection === "attendance" || formSection === "Specific Policies") && <FormAttendance handleShowForm={handleShowForm} section={sectionActive} data={tempData} tempUuid={tempUuid} isUpdate={isUpdate} />}
                    {formSection === "leave-types" && <FormLeaveType handleShowForm={handleShowForm} section={sectionActive} data={tempData} tempUuid={tempUuid} isUpdate={isUpdate} />}
                    {formSection === "Break" && <FormAttendanceBreak handleShowForm={handleShowForm} section={sectionActive} data={tempData} tempUuid={tempUuid} isUpdate={isUpdate} />}
                    {formSection === "Holiday" && <FormLeaveTypeHoliday handleShowForm={handleShowForm} section={sectionActive} data={tempData} tempUuid={tempUuid} isUpdate={isUpdate} />}
                </div>
                </>
            )}

            <Modal
                isOpen={showExportFile}
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
                    setShowModal={setShowExportFile} 
                    isSingle={true}
                    label={ExportTypeFile}
                    titleForm={ExportTypeFile}
                    isExportFile={true}
                />
            </Modal>
        </div>
    );
}

export default LeaveAndAttendance;