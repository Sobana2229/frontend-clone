import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import employeePortalStoreManagements from '../../../store/tdPayroll/employeePortal';
import TableReusable from '../setting/tableReusable';
import PaginationPages from '../paginations';
import { leaveEmployeeHeaders } from '../../../../data/dummy';
import { toast } from "react-toastify";
import { CustomToast } from '../customToast';
import authStoreManagements from '../../../store/tdPayroll/auth';
import ReuseableInput from '../reuseableInput';
import { checkPermission } from '../../../../helper/globalHelper';
import { useLocation, useParams } from 'react-router-dom';
import employeeStoreManagements from '../../../store/tdPayroll/employee';
import Select from "react-select";
import FilterPage from '../filterPage';
import subSidebarStoreManagements from '../../../store/tdPayroll/setting/subSidebarStoreManagements';

// ngikutin reimbursement employee portal
const initialPeriodDayjs = dayjs().format("YYYY-MM")

const LeaveEmployee = ({employeeUuid, fetchType}) => {
    const { createLeave, getLeave, dataEmployeeLeave, updateLeave, getLeaveLimit, dataEmployeeLeaveList, getLeaveList, getOneLeave, dataEmployeeLeaveLimit } = employeePortalStoreManagements();
    const { getEmployeeOverview, dataEmployeesOptions } = employeeStoreManagements();
    const [combinedData, setCombinedData] = useState([]);
    const { setSubSidebarState, resetSubSidebarState } = subSidebarStoreManagements();
    const {pathname} = useLocation();
    const { user } = authStoreManagements();
    const { id } = useParams();
    const [showForm, setShowForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingUuid, setEditingUuid] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [tempUuid, setTempUuid] = useState(null);
    const [formData, setFormData] = useState({
        dateFrom: '',
        dateTo: '',
        reason: '',
        leaveUuid: null
    });
    const [isLeaveDisabled, setIsLeaveDisabled] = useState(true);

    const [filter, setFilter] = useState({
        period: initialPeriodDayjs,
        employeeUuid: "",
        status: "all",
    });

    // console.log("QC>>>", {filter, formData})

    const targetUuid = id ? id : employeeUuid;
    const targetFetch = id ? "employee" : fetchType;
    
    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        if (!dataEmployeesOptions) {
            getEmployeeOverview(access_token, "employeeOptions");
        }
    }, []);

    useEffect(() => {
        if(!dataEmployeeLeave){
            const access_token = localStorage.getItem("accessToken");
            getLeave(access_token, "options")
        }
    }, [targetUuid, targetFetch]);

    useEffect(() => {
        // if(!dataEmployeeLeaveList){
            const access_token = localStorage.getItem("accessToken");
            const params = {
                    limit: 10, 
                    page: currentPage,
                };
            getLeaveList(access_token, params, targetFetch, targetUuid)
        // }
    }, [targetUuid, targetFetch, currentPage]);

    // define what to show on header subsidebar
    useEffect(() => {
        defaultSubSidebarState();
        return () => {
            resetSubSidebarState();
        };
    }, [filter]);

    // Check if employee selected then enable leave type select
    useEffect(() => {
        if (formData.employeeUuid || pathname !== "/leave-approval") { /* pake path dulu demi employee, kalo di admin mesti select employee dlu */
            setIsLeaveDisabled(false);
        }
        else {
            setIsLeaveDisabled(true);
            setFormData(prev => ({
                ...prev,
                leaveUuid: ''
            })) ;
        }
    }, [formData.employeeUuid]);

    // Combine leave data with employee names
    useEffect(() => {
        if (
            dataEmployeeLeaveList &&
            dataEmployeesOptions
        ) {
            const combined =
                dataEmployeeLeaveList.list.map(leave => {
                    const employee =
                        dataEmployeesOptions.find(emp => emp.value === leave.employeeUuid);

                    return {
                        ...leave,
                        employeeName: employee ? employee.label : 'Unknown'
                    };
                });
            setCombinedData(combined);
        }
    }, [dataEmployeeLeaveList, dataEmployeesOptions])

    const handleEmployeeSelect = async (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            employeeUuid: selectedOption.value,
            leaveUuid: ""  
        }))
        setTempUuid(selectedOption.value);
    };

    const handleLeaveTypeSelect = async (selectedOption) => {
        const value = selectedOption.value;
        const access_token = localStorage.getItem("accessToken");
        const params = {
            tempUuid: tempUuid ? tempUuid : targetUuid
        }
        await getLeaveLimit(access_token, value, params)
        setFormData(prev => ({
            ...prev,
            leaveUuid: selectedOption.value,
        }))
    }

    const getSelectedValue = (options, valueKey) => {
        if (!options || !Array.isArray(options)) return null;        
        return options.find(option => option.value === formData[valueKey]) || null;
    };

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = async (uuid, type) => {
        const access_token = localStorage.getItem("accessToken");
        let response;
        if (type !== "edit") {
            const body = {
                status: type
            }
            response = await updateLeave(access_token, body, uuid);
        } else {
            formSubSidebarState("edit");
            setShowForm(true);
            const leaveData = await getOneLeave(access_token, uuid)
            if (leaveData) {
                setFormData({
                    dateFrom: dayjs(leaveData.dateFrom).format('YYYY-MM-DD'),
                    dateTo: dayjs(leaveData.dateTo).format('YYYY-MM-DD'),
                    reason: leaveData.reason || '',
                    leaveUuid: leaveData.leaveUuid || null,
                    employeeUuid: leaveData.employeeUuid || null
                });
                setEditingUuid(uuid);
                setIsEditMode(true);
                setTempUuid(leaveData?.targetUuid || null);
            }
            return;
        }  
        if(response){
            const params = {
                limit: 10, 
                page: currentPage,
            };
            await getLeaveList(access_token, params, targetFetch, targetUuid)
            const successMessage = isEditMode ? 'Regulation updated successfully' : 'Regulation created successfully';
            toast(<CustomToast message={response || successMessage} status="success" />, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                style: {
                    background: "transparent",
                    boxShadow: "none",
                    padding: 0,
                },
            });
            resetForm();
        }
    };

    const handleSubmit = async () => {
        const access_token = localStorage.getItem("accessToken");
        const targetData = targetFetch ? targetFetch : 
                            targetUuid ? "admin-portal" : 
                            "employee-portal";
        let response;
        if(isEditMode && editingUuid){
            response = await updateLeave(access_token, formData, editingUuid);
        }else{
            response = await createLeave(access_token, formData, targetData, formData?.employeeUuid || targetUuid);
        }
        if(response){
            const params = {
                limit: 10, 
                page: currentPage,
            };
            await getLeaveList(access_token, params, targetFetch, targetUuid)
            toast(<CustomToast message={response} status="success" />, {
                autoClose: 3000,
                closeButton: false,
                hideProgressBar: true,
                position: "top-center",
                style: {
                    background: "transparent",
                    boxShadow: "none",
                    padding: 0,
                },
            });
            resetForm();
            defaultSubSidebarState();
        }
    };

    const resetForm = () => {
        setFormData({
            dateFrom: '',
            dateTo: '',
            reason: '',
            leaveUuid: '',  // ✅ CHANGE FROM null TO ""
            employeeUuid: '' // ✅ ADD INI
        });
        setShowForm(false);
        setIsEditMode(false);
        setEditingUuid(null);
        setTempUuid(null);  // ✅ ADD INI
    };
    const fullDate = (dateString) => {
        return dayjs(dateString).format("MM/DD/YYYY (dddd)")
    }
    const getDayName = (dateString) => {
        return dayjs(dateString).format("dddd");
    }
    const getYear = (dateString) => {
        return dayjs(dateString).format("YYYY");
    }
    const fullDateWithMonthAbbrev = (dateString) => {
        return dayjs(dateString).format('D MMM YYYY');
    }
    const weekendChecks = () => {
        return (
            getDayName(formData.dateFrom) === "Saturday" ||
            getDayName(formData.dateFrom) === "Sunday" ||
            getDayName(formData.dateTo) === "Saturday" ||
            getDayName(formData.dateTo) === "Sunday"
        )
    }
    const dayDiffs = () => {
        let diff = (dayjs(formData.dateTo).diff(dayjs(formData.dateFrom), 'day') || 0) + 1;
        if (diff < 0) diff = 0;
        return diff;
    }

    const addLeave = () => {
        formSubSidebarState("add");
        setShowForm(true);
        setIsEditMode(false);
        setEditingUuid(null);
    }

    const handleCancel = () => {
        defaultSubSidebarState();
        resetForm();
    }

    const defaultSubSidebarState = () => {
        // reset sub sidebar to "leave page default"
        setSubSidebarState({
            showSubSidebar: true,
            showAddButton: true,
            showX: true,
            showThreeDots: true,
            showHeaderDropDown: true,
            forceHeaderLabel: "",
            headerDropDownProps: {
                filterFor: "leave requests",
                filter: filter,
                setFilter: setFilter,
            },
            addButtonFunction: addLeave,
            cancelButtonFunction: handleCancel,
        })
    }

    const formSubSidebarState = (action="add") => {
        setSubSidebarState({
            showSubSidebar: false,
            showAddButton: false,
            showX: true,
            showThreeDots: false,
            showHeaderDropDown: false,
            forceHeaderLabel: action === "add" ? "Leave Request" : "Leave Request (Editing)"
        });
    }

    return (
        <div className={`
                w-full h-full flex items-start justify-start relative overflow-hidden
                ${pathname === "/leave-approval" ? "bg-gray-td-100" : ""}`}
        >
            {checkPermission(user, "Leave", "View") ? (
                <div className="w-full h-full max-h-full"
                >
                
                {/*header for employee portal and when showForm - deprecated, use headerReusable through subsidebar*/}

                    <div
                        className="
                            w-full h-full
                            overflow-hidden
                        "
                    >
                        {pathname !== "/leave-approval" && (
                            <div
                                className="
                                    w-full
                                    pl-10 pr-10 pb-2
                                "
                            >
                                <div className="flex items-center justify-between p-6 border-b bg-white rounded-lg shadow-sm">
                                    <h1 className="text-xl font-semibold">
                                        Leaves
                                        {isEditMode && <span className="text-sm text-blue-600 ml-2">(Editing)</span>}
                                    </h1>
                                    <button
                                        onClick={() => {
                                            if (showForm) {
                                                resetForm();
                                            } else {
                                                setShowForm(true);
                                                setIsEditMode(false);
                                                setEditingUuid(null);
                                            }
                                        }}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        {showForm ? 'Cancel' : 'Add Leaves'}
                                    </button>
                                </div>
                            </div>
                        )}
                        {!showForm && (
                            <>
                                {/* FILTER BAR (conditional for leave-approval)*/}
                                {pathname === "/leave-approval" && (
                                    <FilterPage
                                        isHeader={false}
                                        filterFor="leave-approval"
                                        addData={null}
                                        setFilter={setFilter}
                                        filter={filter}
                                    />
                                )}

                                <div 
                                    className='
                                        w-full h-full
                                        p-10 pt-0
                                    '
                                >
                                    <TableReusable
                                        dataHeaders={leaveEmployeeHeaders}
                                        dataTable={combinedData}
                                        tableFor="employeePortalLeave"
                                        handleEdit={handleEdit}
                                    />
                                </div>

                                <div className="w-full absolute bottom-5 flex items-center justify-end">
                                    <PaginationPages 
                                        totalPages={dataEmployeeLeaveList?.totalPages} 
                                        currentPage={currentPage} 
                                        setCurrentPage={setCurrentPage} 
                                    />
                                </div>
                            </>
                        )}
                        
                        {showForm && (
                            <div 
                                className="
                                    max-w-full 
                                    p-6 pr-11 pl-11
                                    overflow-auto
                                "
                            >
                                <div className="
                                    h-full 
                                    bg-white p-6 rounded-lg shadow-md
                                    flex
                                    justify-between
                                    items-start
                                    gap-14"
                                >   

                                    {/* form container */}
                                    <div
                                        className='
                                            w-2/3
                                            flex flex-col flex-shrink-0
                                            gap-6'
                                    >
                                        {/* Employee Selection (only admin) ngambil dari regulation employee*/}
                                        {pathname == "/leave-approval" && (
                                            <div className="w-full">
                                                {/* <Select
                                                    options={dataEmployeesOptions}
                                                    onChange={handleEmployeeSelect} // FIXED: Correct handler
                                                    value={getSelectedValue(dataEmployeesOptions, 'employeeUuid')}
                                                    className='w-full bg-transparent focus:ring-0 outline-none text-sm rounded-lg'
                                                    placeholder="Select an Employee"
                                                    classNames={{
                                                        control: () => "!rounded-md !bg-white !h-full",
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
                                                /> */}

                                                <ReuseableInput
                                                    label="Employee Name"
                                                    id="employeeName"
                                                    name="employeeName"
                                                    as="react-select"
                                                    selectOptionsReact={dataEmployeesOptions}
                                                    handleSelectChangeReact={handleEmployeeSelect}
                                                    selectedValueReact={getSelectedValue(dataEmployeesOptions, 'employeeUuid')}
                                                    isDisabled={false}
                                                    required={false}
                                                    isFocusRing={false}
                                                    isBorderLeft={true}
                                                    borderColor={"#DC2626"}
                                                    placeholder="Select an Employee"
                                                />
                                            </div>
                                        )}

                                        {/* Leave Type */}
                                        <div className="w-full">
                                            <ReuseableInput
                                                label="Leave Type"
                                                id="leaveUuid"
                                                name="leaveUuid"
                                                as="react-select"
                                                selectOptionsReact={
                                                    dataEmployeeLeave.map((el) => ({
                                                        value: el.uuid,
                                                        label: el.leaveName,
                                                        name: "leaveUuid",
                                                    }))
                                                }
                                                handleSelectChangeReact={handleLeaveTypeSelect}
                                                selectedValueReact={
                                                    getSelectedValue(
                                                        dataEmployeeLeave.map((el) => ({
                                                            value: el.uuid,
                                                            label: el.leaveName,
                                                            name: "leaveUuid",
                                                        })),
                                                        'leaveUuid'
                                                    )}
                                                isFocusRing={false}
                                                isBorderLeft={true}
                                                borderColor={isLeaveDisabled ? null : "#DC2626"}
                                                placeholder="Select Leave Type"
                                                isDisabled={isLeaveDisabled}
                                            />
                                        </div>

                                        {/* Date Range */}
                                        <div
                                            className="w-full"
                                        >
                                            <div className="grid grid-cols-2 gap-4 max-w-full w-full">
                                                <ReuseableInput
                                                    type="date"
                                                    label="From Date"
                                                    id="dateFrom"
                                                    name="dateFrom"
                                                    value={formData.dateFrom}
                                                    onChange={handleInputChange}
                                                    placeholder="Start Date"
                                                    required={false}
                                                    isDisabled={false}
                                                    isFocusRing={false}
                                                    isBorderLeft={true}
                                                    borderColor={"#DC2626"}
                                                />
                                                
                                                <ReuseableInput
                                                    type="date"
                                                    label="To Date"
                                                    id="dateTo"
                                                    name="dateTo"
                                                    value={formData.dateTo}
                                                    onChange={handleInputChange}
                                                    placeholder="End Date"
                                                    required={false}
                                                    isDisabled={false}
                                                    isFocusRing={false}
                                                    isBorderLeft={true}
                                                    borderColor={"#DC2626"}
                                                />

                                            </div>
                                        </div>

                                        {/* Remaining Days Info */}
                                        {(dataEmployeeLeaveLimit && formData.leaveUuid && formData.dateFrom && formData.dateTo) && (
                                            <div
                                                className="
                                                w-full
                                                flex
                                                flex-col 
                                                items-center 
                                                justify-center
                                                rounded-md
                                                p-4"
                                                style={{ backgroundColor: "#f7faff" }}
                                            >

                                                {/* day and weekend info */}
                                                <div
                                                    className="
                                                    flex
                                                    flex-row
                                                    items-center 
                                                    justify-between
                                                    w-full 
                                                    border-b 
                                                    border-gray-300
                                                    px-2 
                                                    pb-2 
                                                    mb-4
                                                ">
                                                    <div
                                                        className='w-1/2'
                                                    >
                                                        <h1>{fullDate(formData?.dateFrom)} - </h1>
                                                        <h1>{fullDate(formData?.dateTo)}</h1>
                                                    </div>

                                                    {/* weekend info */}
                                                    <div
                                                        className='w-1/2'
                                                    >
                                                        <ReuseableInput
                                                            label=""
                                                            id=""
                                                            name=""
                                                            value={
                                                                weekendChecks() ? "Weekend" : "Weekday"
                                                            }
                                                            isDisabled={true}
                                                            required={false}
                                                            isFocusRing={false}
                                                            isBorderLeft={true}
                                                            borderColor={weekendChecks() ? "#DC2626" : "#D1D5DB"}
                                                        />
                                                    </div>
                                                </div>

                                                {/* remaining balance and leave info */}
                                                <div
                                                    className="
                                                    flex
                                                    flex-row
                                                    items-center 
                                                    justify-between 
                                                    w-full 
                                                    px-2
                                                "

                                                >
                                                    <h1>Total Applied Leave Days:</h1>
                                                    <div
                                                        className='w-1/2'
                                                    >
                                                        <h1>{dayDiffs()}</h1>
                                                    </div>
                                                    {/* <h1>used Days: {dataEmployeeLeaveLimit?.balance?.usedDays}</h1>
                                                <h1>total: {dataEmployeeLeaveLimit?.balance?.allocatedDays}</h1> */}
                                                </div>

                                                <div
                                                    className="
                                                    flex
                                                    flex-row
                                                    items-center 
                                                    justify-between 
                                                    w-full 
                                                    px-2
                                                "

                                                >
                                                    <h1>Remaining Balance:</h1>
                                                    <div
                                                        className='w-1/2'
                                                    >
                                                        <h1>{dataEmployeeLeaveLimit?.balance?.remainingDays}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Reason */}
                                        <div className="w-full space-y-2">
                                            <label className="block text-base font-medium">
                                                Reason {/* <span className="text-red-500">*</span> */}
                                            </label>
                                            <textarea
                                                value={formData.reason}
                                                name="reason"
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder=""
                                            />
                                        </div>

                                        <div className="flex justify-start space-x-4 pt-4 border-t border-gray-200">
                                            <button
                                                onClick={handleSubmit}
                                                disabled={!formData.dateFrom || !formData.dateTo || !formData.reason.trim()}
                                                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                            >
                                                {isEditMode ? 'Update Leave' : 'Submit Leave'}
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Sick Leave Summary */}
                                    {(dataEmployeeLeaveLimit && formData.leaveUuid && formData.dateFrom && formData.dateTo) && (
                                        <div
                                            className="
                                            flex flex-col flex-shrink-0 items-center
                                            w-1/4 h-fit
                                            rounded-md
                                            p-6 gap-4
                                            bg-[#fefbf3]
                                        "
                                        >

                                            {/* Sick Leave */}
                                            <div
                                                className="
                                                w-full 
                                                text-start
                                                border-b 
                                                border-gray-300 
                                                pb-4
                                                "
                                            >
                                                <h1
                                                    className="text-xl font-semibold"
                                                >
                                                    Sick Leave Summary
                                                </h1>
                                                <h2
                                                    className="text-sm text-gray-600"
                                                >
                                                    As of {fullDateWithMonthAbbrev(formData?.dateFrom)}
                                                </h2>
                                            </div>

                                            {/* total days */}
                                            <div
                                                className="
                                                w-full
                                                flex
                                                flex-col 
                                                items-center 
                                                justify-center
                                                border-b 
                                                border-gray-300 
                                                pb-4 gap-2
                                                "
                                            >
                                                <div
                                                    className="
                                                    flex
                                                    flex-row
                                                    items-center 
                                                    justify-between 
                                                    w-full
                                                "
                                                >
                                                    <h1
                                                        className="text-xl font-semibold"
                                                    >
                                                        Total Days
                                                    </h1>

                                                    <h1
                                                        className="text-lg font-normal"
                                                    >
                                                        {dataEmployeeLeaveLimit?.balance?.allocatedDays}
                                                    </h1>
                                                </div>

                                                <div
                                                    className="
                                                    mt-2
                                                    flex
                                                    flex-row
                                                    items-center 
                                                    justify-between 
                                                    w-full
                                                "

                                                >
                                                    <h1
                                                        className="
                                                            border-l-4 
                                                            border-l-[#34dab3] 
                                                            pl-1
                                                        "
                                                    >
                                                        Available Days
                                                    </h1>
                                                    <h1
                                                        className="text-lg font-normal"
                                                    >
                                                        {dataEmployeeLeaveLimit?.balance?.remainingDays}
                                                    </h1>
                                                </div>

                                                <div
                                                    className="
                                                    flex
                                                    flex-row
                                                    items-center 
                                                    justify-between 
                                                    w-full
                                                "

                                                >
                                                    <h1
                                                        className="
                                                            border-l-4 
                                                            border-l-[#4a9eff] 
                                                            pl-1
                                                        "
                                                    >
                                                        Booked Now
                                                    </h1>
                                                    <h1
                                                        className="text-lg font-normal"
                                                    >
                                                        {dayDiffs()}
                                                    </h1>
                                                </div>
                                            </div>

                                            {/* remaining balance */}
                                            <div
                                                className="
                                                w-full
                                                flex
                                                flex-col 
                                                items-center 
                                                justify-center
                                                border-b 
                                                border-gray-300 
                                                pb-4
                                                "
                                            >
                                                {/* remaining balance and leave info */}
                                                <div
                                                    className="
                                                    flex
                                                    flex-row
                                                    items-center 
                                                    justify-between 
                                                    w-full
                                                "
                                                >
                                                    <h1
                                                        className="text-lg text-gray-600"
                                                    >
                                                        Remaining Balance
                                                    </h1>

                                                    <h1
                                                        className="text-lg font-normal"
                                                    >
                                                        {dataEmployeeLeaveLimit?.balance?.remainingDays - dayDiffs() < 0 ? 0 : dataEmployeeLeaveLimit?.balance?.remainingDays - dayDiffs()}
                                                    </h1>
                                                </div>

                                                <div
                                                    className="
                                                    flex
                                                    flex-row
                                                    items-center 
                                                    justify-between 
                                                    w-full
                                                ">
                                                    <h2
                                                        className="text-sm text-gray-600"
                                                    >
                                                        As of {fullDateWithMonthAbbrev(formData?.dateTo)}
                                                    </h2>
                                                </div>
                                            </div>

                                            {/* yearly projection */}
                                            <div
                                                className="
                                                mt-4
                                                w-full
                                                bg-[#ffd08f]
                                                p-4
                                                border-l-8
                                                border-l-[#ff8800]"
                                            >
                                                <div className="w-full text-start">
                                                    <h1 className="text-lg font-semibold">
                                                        Yearly Projection ({getYear(formData?.dateTo)}-12-31)
                                                    </h1>
                                                    <h2 className="text-sm text-gray-600">
                                                        Estimated Balance: {dataEmployeeLeaveLimit?.balance?.remainingDays} Days
                                                    </h2>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p>No data available</p>
            ) }
        </div>
    );
};

export default LeaveEmployee;