import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import employeePortalStoreManagements from '../../../store/tdPayroll/employeePortal';
import TableReusable from '../setting/tableReusable';
import PaginationPages from '../paginations';
import { regulationEmployeeHeaders } from '../../../../data/dummy';
import { toast } from "react-toastify";
import { CustomToast } from '../customToast';
import authStoreManagements from '../../../store/tdPayroll/auth';
import { useLocation, useParams } from 'react-router-dom';
import employeeStoreManagements from '../../../store/tdPayroll/employee';
import subSidebarStoreManagements from '../../../store/tdPayroll/setting/subSidebarStoreManagements';
import FilterPage from '../filterPage';
import ReuseableInput from '../reuseableInput';

// ngikutin reimbursement employee portal
const initialPeriodDayjs = dayjs().format("YYYY-MM")

const RegulationEmployee = ({employeeUuid, fetchType}) => {
    const { createRegulation, getRegulation, dataEmployeeRegulationList, updateRegulation, getOneRegulation } = employeePortalStoreManagements();
    const { getEmployeeOverview, dataEmployeesOptions } = employeeStoreManagements();
    const [combinedData, setCombinedData] = useState([]);
    const {pathname} = useLocation();
    const { id } = useParams();
    const { user } = authStoreManagements();
    const [showForm, setShowForm] = useState(false);
    const [attendanceData, setAttendanceData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingUuid, setEditingUuid] = useState(null);
    const [formData, setFormData] = useState({
        dateFrom: '',
        dateTo: '',
        reason: '',
        actualHours: {}
    });

    const [filter, setFilter] = useState({
        period: initialPeriodDayjs,
        employeeUuid: "",
        status: "all",
    });
    
    // Reset to page 1 when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filter.period, filter.employeeUuid, filter.status]);
    
    const targetUuid = id ? id : employeeUuid;
    // console.log("QCRegularization>>>", {filter, formData})

    useEffect(() => {
        if (!dataEmployeesOptions) {
            const access_token = localStorage.getItem("accessToken");
            getEmployeeOverview(access_token, "employeeOptions");
        }
    }, []);

    // Combine leave data with employee names
    useEffect(() => {
        if (
            dataEmployeeRegulationList &&
            dataEmployeesOptions
        ) {
            const combined =
                dataEmployeeRegulationList.list.map(regulation => {
                    const employee =
                        dataEmployeesOptions.find(emp => emp.value === regulation.employeeUuid);

                    return {
                        ...regulation,
                        employeeName: employee ? employee.label : 'Unknown'
                    };
                });
            setCombinedData(combined);
        }
    }, [dataEmployeeRegulationList, dataEmployeesOptions])

    // Populate actualHours form with initial range date
    useEffect(() => {
        if (formData.dateFrom && formData.dateTo) {
            setFormData(prev => ({
                ...prev,
                actualHours: {}
            }));
            getDateRange().forEach(date => {
                const actualHour = formData.actualHours[date];
                
                // Actual Hours Check-In
                const actualHour_checkInDate = actualHour?.checkInDate || date;
                const actualHour_checkInHour = actualHour?.checkInTime?.split(':')[0] || '02';
                const actualHour_checkInMinute = actualHour?.checkInTime?.split(':')[1] || '00';
                const actualHour_checkInAmPm = actualHour?.checkInAmPm || 'AM';
               
                handleActualHourChange(date, 'checkInDate', actualHour_checkInDate);
                handleActualHourChange(date, 'checkInTime', `${actualHour_checkInHour}:${actualHour_checkInMinute}`);
                handleActualHourChange(date, 'checkInAmPm', actualHour_checkInAmPm);

                // Actual Hours Check-Out
                const actualHour_checkOutDate = actualHour?.checkOutDate || date;
                const actualHour_checkOutHour = actualHour?.checkOutTime?.split(':')[0] || '03';
                const actualHour_checkOutMinute = actualHour?.checkOutTime?.split(':')[1] || '00';
                const actualHour_checkOutAmPm = actualHour?.checkOutAmPm || 'PM';

                handleActualHourChange(date, 'checkOutDate', actualHour_checkOutDate);
                handleActualHourChange(date, 'checkOutTime', `${actualHour_checkOutHour}:${actualHour_checkOutMinute}`);
                handleActualHourChange(date, 'checkOutAmPm', actualHour_checkOutAmPm);
            });
        }
    }, [attendanceData, formData.dateFrom, formData.dateTo]);

    useEffect(() => {
        const access_token = localStorage.getItem("accessToken");
        const params = {
            limit: 10, 
            page: currentPage,
        };
        
        // Add filter parameters
        if (filter.period) {
            params.period = filter.period;
        }
        if (filter.employeeUuid && filter.employeeUuid !== "") {
            params.employeeUuid = filter.employeeUuid;
        }
        if (filter.status && filter.status !== "all") {
            params.status = filter.status;
        }
        
        const targetData = fetchType ? fetchType : 
                            targetUuid ? "admin-portal" : 
                            "employee-portal";
        getRegulation(access_token, params, targetData, targetUuid)
    }, [targetUuid, fetchType, currentPage, filter]);

    const handleEmployeeSelect = async (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            employeeUuid: selectedOption.value,
        }))
    };

    const getSelectedValue = (options, valueKey) => {
        if (!options || !Array.isArray(options)) return null;        
        return options.find(option => option.value === formData[valueKey]) || null;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleActualHourChange = (date, field, value) => {
        setFormData(prev => ({
            ...prev,
            actualHours: {
                ...prev.actualHours,
                [date]: {
                    ...prev.actualHours[date],
                    [field]: value
                }
            }
        }));
    };

    const convertTo12Hour = (time24h) => {
        if (!time24h) return { time: '12:00', ampm: 'AM' };
        const [hours, minutes] = time24h.split(':');
        let hour12 = parseInt(hours);
        const ampm = hour12 >= 12 ? 'PM' : 'AM';
        if (hour12 === 0) {
            hour12 = 12;
        } else if (hour12 > 12) {
            hour12 -= 12;
        }
        return {
            time: `${hour12.toString().padStart(2, '0')}:${minutes}`,
            ampm: ampm
        };
    };

    const convertTo24Hour = (time12h, ampm) => {
        const [hours, minutes] = time12h.split(':');
        let hours24 = parseInt(hours);
        
        if (ampm === 'AM' && hours24 === 12) {
            hours24 = 0;
        } else if (ampm === 'PM' && hours24 !== 12) {
            hours24 += 12;
        }
        
        return `${hours24.toString().padStart(2, '0')}:${minutes}`;
    };

    const populateFormFromResponse = (response) => {
        const dateFrom = dayjs(response.dateFrom).format('YYYY-MM-DD');
        const dateTo = dayjs(response.dateTo).format('YYYY-MM-DD');
        const actualHours = {};
        response.EmployeeRegilastionDetails?.forEach(detail => {
            const date = dayjs(detail.date).format('YYYY-MM-DD');
            const checkInConverted = convertTo12Hour(detail.actualCheckIn);
            const checkOutConverted = convertTo12Hour(detail.actualCheckOut);
            actualHours[date] = {
                checkInTime: checkInConverted.time,
                checkInAmPm: checkInConverted.ampm,
                checkOutTime: checkOutConverted.time,
                checkOutAmPm: checkOutConverted.ampm
            };
        });
        
        setFormData({
            dateFrom: dateFrom,
            dateTo: dateTo,
            reason: response.reason || '',
            actualHours: actualHours,
            employeeUuid: response?.employeeUuid,
        });
    };

    const handleEdit = async (uuid, type) => {
        const access_token = localStorage.getItem("accessToken");
        if(type === "edit"){
            try {
                const access_token = localStorage.getItem("accessToken");
                const response = await getOneRegulation(access_token, uuid);
                
                if(response) {
                    // ✅ FORMAT RESPONSE sebelum populate
                    const formattedResponse = {
                    ...response,
                    EmployeeRegilastionDetails: response.EmployeeRegilastionDetails?.map(detail => ({
                        ...detail,
                        actualCheckIn: detail.actualCheckIn 
                        ? detail.actualCheckIn.split('T')[1]  // Extract "15:00:00"
                        : null,
                        actualCheckOut: detail.actualCheckOut 
                        ? detail.actualCheckOut.split('T')[1]  // Extract "15:30:00"
                        : null,
                        loggedCheckIn: detail.loggedCheckIn 
                        ? detail.loggedCheckIn.split('T')[1]
                        : null,
                        loggedCheckOut: detail.loggedCheckOut 
                        ? detail.loggedCheckOut.split('T')[1]
                        : null,
                    })) || []
                    };
                    
                    formSubSidebarState("edit");
                    populateFormFromResponse(formattedResponse);
                    setIsEditMode(true);
                    setEditingUuid(uuid);
                    setShowForm(true);
                } else {
                    toast(<CustomToast message="Failed to fetch regulation data" status="error" />, {
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
                }
            } catch (error) {
            toast(<CustomToast message="Error fetching regulation data" status="error" />, {
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
            }
        } else {
            const payload = {
                status: type
            }
            const targetData = fetchType ? fetchType : 
                        targetUuid ? "admin-portal" : 
                        "employee-portal";
            const response = await updateRegulation(access_token, payload, targetData, uuid);
            
            if(response){
                const params = {
                    limit: 10, 
                    page: currentPage,
                };
                await getRegulation(access_token, params, targetData, targetUuid)
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
            }
        }
    };

    const handleSubmit = async () => {
        const access_token = localStorage.getItem("accessToken");
        if (!formData.dateFrom || !formData.dateTo || !formData.reason.trim()) {
            toast(<CustomToast message="Please fill in all required fields" status="error" />, {
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
            return;
        }

        const dateRange = getDateRange();
        const missingHours = dateRange.filter(date => {
            const hours = formData.actualHours[date];
            return !hours || !hours.checkInTime || !hours.checkOutTime;
        });

        if (missingHours.length > 0) {
            toast(<CustomToast message="Please fill in check-in and check-out times for all dates" status="error" />, {
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
            return;
        }
        
        const regulationData = {
            dateFrom: formData.dateFrom,
            dateTo: formData.dateTo,
            reason: formData.reason,
            details: Object.entries(formData.actualHours).map(([date, hours]) => {
                const attendance = attendanceData[date];
                const checkIn24 = convertTo24Hour(hours.checkInTime, hours.checkInAmPm);
                const checkOut24 = convertTo24Hour(hours.checkOutTime, hours.checkOutAmPm);
                
                return {
                    date,
                    loggedCheckIn: attendance?.checkIn || null,
                    loggedCheckOut: attendance?.checkOut || null,
                    actualCheckIn: `${date}T${checkIn24}:00`,
                    actualCheckOut: `${date}T${checkOut24}:00`
                };
            })
        };
        
        const targetData = fetchType ? fetchType : 
                    targetUuid ? "admin-portal" : 
                    "employee-portal";
        
        try {
            let response;
            if (isEditMode && editingUuid) {
                response = await updateRegulation(access_token, regulationData, targetData, editingUuid);
            } else {
                response = await createRegulation(access_token, regulationData, targetData, formData?.employeeUuid || targetUuid);
            }
            
            if(response){
                const params = {
                    limit: 10, 
                    page: currentPage,
                };
                await getRegulation(access_token, params, targetData, targetUuid)
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
                defaultSubSidebarState();
                resetForm();
            }
        } catch (error) {
            toast(<CustomToast message="Error submitting regulation" status="error" />, {
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
        }
    };

    const resetForm = () => {
        setFormData({
            dateFrom: '',
            dateTo: '',
            reason: '',
            actualHours: {},
            employeeUuid: ""
        });
        setShowForm(false);
        setIsEditMode(false);
        setEditingUuid(null);
        setAttendanceData({});
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return dayjs(dateString).format('DD MMM YYYY');
    };

    const getDayName = (dateString) => {
        if (!dateString) return '';
        return dayjs(dateString).format('ddd').toUpperCase();
    };

    const getDateRange = () => {
        if (!formData.dateFrom || !formData.dateTo) return [];
        
        const dates = [];
        let current = dayjs(formData.dateFrom);
        const end = dayjs(formData.dateTo);
        
        while (current.isBefore(end) || current.isSame(end, 'day')) {
            dates.push(current.format('YYYY-MM-DD'));
            current = current.add(1, 'day');
        }
        
        return dates;
    };

    const addRegularization = () => {
        setShowForm(true);
        setIsEditMode(false);
        setEditingUuid(null);
        formSubSidebarState("add");
    }

    const handleCancel = () => {
        resetForm();
        defaultSubSidebarState();
    }

    // Sub side bar state management
    const { setSubSidebarState, resetSubSidebarState } = subSidebarStoreManagements();

    // define what to show on header subsidebar
    useEffect(() => {
        defaultSubSidebarState();
        return () => {
            resetSubSidebarState();
        };
    }, [filter]);

    const defaultSubSidebarState = () => {
        // reset sub sidebar to "regularization default"
        setSubSidebarState({
            showSubSidebar: true,
            showAddButton: true,
            showX: true,
            showThreeDots: true,
            showHeaderDropDown: true,
            forceHeaderLabel: "",
            headerDropDownProps: {
                filterFor: "regularization requests",
                filter: filter,
                setFilter: setFilter,
            },
            addButtonFunction: addRegularization,
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
            forceHeaderLabel: action === "add" ? "Add Regularization" : "Regularization Request (Editing)"
        });
    }

    return (
        <div 
            className="
                w-full h-full 
                flex items-start justify-start
                overflow-hidden
            "

        >
            <div 
                className="
                    w-full h-full
                    flex flex-col
                "
            >
                {/* <div className="flex items-center justify-between p-6 border-b">
                    <h1 className="text-xl font-semibold">
                        Employee Regulation
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
                        {showForm ? 'Cancel' : 'Add Regulation'}
                    </button>
                </div> */}

                {/* ✅ Add Button for Employee Portal (when not using SubSideBar) */}
                {pathname.includes("/employee-portal") && !pathname.includes("/regularization-attendance") && (
                    <div
                        className="
                            w-full 
                            flex items-center justify-between 
                            p-6 mb-2 mt-2
                            rounded-lg shadow-sm 
                            border-b bg-white
                        "
                    >
                        <h1 className="text-xl font-semibold">Regularization Requests</h1>
                        <button
                            onClick={showForm ? handleCancel : addRegularization}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            {showForm ? 'Cancel' : 'Add Regularization'}
                        </button>
                    </div>
                )}
                {!showForm && (
                    <div
                        className="
                        flex flex-col flex-1
                        h-full w-full
                        relative
                        "
                    >

                        {pathname === "/regularization-attendance" && (
                            <FilterPage
                                isHeader={false}
                                filterFor="leave-approval" /* same filter as leave-approval */
                                addData={null}
                                setFilter={setFilter}
                                filter={filter}
                            />
                        )}
                        
                        <div
                            className={`
                                flex flex-col
                                w-full h-full
                                overflow-hidden
                                ${pathname.includes("/employee-portal") && "pb-32"} 
                            `}
                        >
                            <TableReusable
                                dataHeaders={regulationEmployeeHeaders}
                                dataTable={combinedData}
                                tableFor="employeePortalRegulation"
                                handleEdit={handleEdit}
                                role={user?.role?.name}
                            />
                        </div>

                        <div className="w-full absolute bottom-5 flex items-center justify-end">
                            <PaginationPages
                                totalPages={dataEmployeeRegulationList?.totalPages}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    </div>
                    )}
                    
                    {showForm && (
                        <div 
                            className="
                                h-full w-full
                                overflow-y-auto
                            "
                        >
                            <div 
                                className="
                                    h-full w-full
                                    flex flex-col
                                    space-y-6
                                    bg-white p-6 rounded-lg shadow-md
                                "
                            >

                            {/* Employee Select */}
                            {pathname == "/regularization-attendance" && (
                                <div className="flex w-1/4 pr-2">
                                    {/* <Select
                                            options={dataEmployeesOptions}
                                            onChange={handleEmployeeSelect}
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
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date Range <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-4 max-w-md">
                                        <input
                                            type="date"
                                            value={formData.dateFrom}
                                            onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="date"
                                            value={formData.dateTo}
                                            onChange={(e) => handleInputChange('dateTo', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div> */}
                            {/* Date Range */}
                            <div
                                className="
                                    flex flex-row
                                    gap-4
                                    w-1/2
                                "
                            >
                                <div
                                    className="w-1/2"
                                >
                                    <ReuseableInput
                                        type="date"
                                        label="From Date"
                                        id="dateFrom"
                                        name="dateFrom"
                                        value={formData.dateFrom}
                                        onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                                        placeholder="Start Date"
                                        required={false}
                                        isDisabled={false}
                                        isFocusRing={false}
                                        isBorderLeft={true}
                                        borderColor={"#DC2626"}
                                    />
                                </div>

                                <div
                                    className="w-1/2"
                                >
                                    <ReuseableInput
                                        type="date"
                                        label="To Date"
                                        id="dateTo"
                                        name="dateTo"
                                        value={formData.dateTo}
                                        onChange={(e) => handleInputChange('dateTo', e.target.value)}
                                        placeholder="End Date"
                                        required={false}
                                        isDisabled={false}
                                        isFocusRing={false}
                                        isBorderLeft={true}
                                        borderColor={"#DC2626"}
                                    />
                                </div>

                               
                            </div>

                                {formData.dateFrom && formData.dateTo && (
                                    // <div className="overflow-x-auto">
                                    //     <table className="w-full border-collapse bg-white">
                                    //         <thead>
                                    //             <tr className="bg-gray-50">
                                    //                 <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                                    //                 <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700" colSpan="2">Logged Hours</th>
                                    //                 <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700" colSpan="4">Actual Hours</th>
                                    //             </tr>
                                    //             <tr className="bg-gray-50">
                                    //                 <th className="border border-gray-200 px-4 py-2"></th>
                                    //                 <th className="border border-gray-200 px-4 py-2 text-xs text-gray-600">Check-In</th>
                                    //                 <th className="border border-gray-200 px-4 py-2 text-xs text-gray-600">Check-Out</th>
                                    //                 <th className="border border-gray-200 px-4 py-2 text-xs text-gray-600">Check-In</th>
                                    //                 <th className="border border-gray-200 px-4 py-2 text-xs text-gray-600"></th>
                                    //                 <th className="border border-gray-200 px-4 py-2 text-xs text-gray-600">Check-Out</th>
                                    //                 <th className="border border-gray-200 px-4 py-2 text-xs text-gray-600"></th>
                                    //             </tr>
                                    //         </thead>
                                    //         <tbody>
                                    //             {getDateRange().map((date) => {
                                    //                 const attendance = attendanceData[date];
                                    //                 const actualHour = formData.actualHours[date];
                                                    
                                    //                 return (
                                    //                     <tr key={date}>
                                    //                         <td className="border border-gray-200 px-4 py-3">
                                    //                             <div className="font-medium">{getDayName(date)}</div>
                                    //                             <div className="text-xs text-gray-500">{formatDate(date)}</div>
                                    //                         </td>
                                                            
                                    //                         <td className="border border-gray-200 px-4 py-3 text-center text-sm">
                                    //                             {attendance?.checkIn ? dayjs(attendance.checkIn).format('HH:mm A') : '-'}
                                    //                         </td>
                                    //                         <td className="border border-gray-200 px-4 py-3 text-center text-sm">
                                    //                             {attendance?.checkOut ? dayjs(attendance.checkOut).format('HH:mm A') : '-'}
                                    //                         </td>
                                                            
                                    //                         <td className="border border-gray-200 px-2 py-3">
                                    //                             <div className="flex gap-1">
                                    //                                 <select
                                    //                                     value={actualHour?.checkInTime?.split(':')[0] || '12'}
                                    //                                     onChange={(e) => {
                                    //                                         const minute = actualHour?.checkInTime?.split(':')[1] || '00';
                                    //                                         handleActualHourChange(date, 'checkInTime', `${e.target.value}:${minute}`);
                                    //                                     }}
                                    //                                     className="w-full text-xs border border-gray-300 rounded px-1 py-1"
                                    //                                 >
                                    //                                     {Array.from({length: 12}, (_, i) => {
                                    //                                         const hour = (i + 1).toString().padStart(2, '0');
                                    //                                         return <option key={hour} value={hour}>{hour}</option>;
                                    //                                     })}
                                    //                                 </select>
                                    //                                 <span className="text-xs self-center">:</span>
                                    //                                 <select
                                    //                                     value={actualHour?.checkInTime?.split(':')[1] || '00'}
                                    //                                     onChange={(e) => {
                                    //                                         const hour = actualHour?.checkInTime?.split(':')[0] || '12';
                                    //                                         handleActualHourChange(date, 'checkInTime', `${hour}:${e.target.value}`);
                                    //                                     }}
                                    //                                     className="w-full text-xs border border-gray-300 rounded px-1 py-1"
                                    //                                 >
                                    //                                     {Array.from({length: 60}, (_, i) => {
                                    //                                         const minute = i.toString().padStart(2, '0');
                                    //                                         return <option key={minute} value={minute}>{minute}</option>;
                                    //                                     })}
                                    //                                 </select>
                                    //                             </div>
                                    //                         </td>
                                    //                         <td className="border border-gray-200 px-2 py-3">
                                    //                             <select
                                    //                                 value={actualHour?.checkInAmPm || 'AM'}
                                    //                                 onChange={(e) => handleActualHourChange(date, 'checkInAmPm', e.target.value)}
                                    //                                 className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                    //                             >
                                    //                                 <option value="AM">AM</option>
                                    //                                 <option value="PM">PM</option>
                                    //                             </select>
                                    //                         </td>
                                                            
                                    //                         <td className="border border-gray-200 px-2 py-3">
                                    //                             <div className="flex gap-1">
                                    //                                 <select
                                    //                                     value={actualHour?.checkOutTime?.split(':')[0] || '12'}
                                    //                                     onChange={(e) => {
                                    //                                         const minute = actualHour?.checkOutTime?.split(':')[1] || '00';
                                    //                                         handleActualHourChange(date, 'checkOutTime', `${e.target.value}:${minute}`);
                                    //                                     }}
                                    //                                     className="w-full text-xs border border-gray-300 rounded px-1 py-1"
                                    //                                 >
                                    //                                     {Array.from({length: 12}, (_, i) => {
                                    //                                         const hour = (i + 1).toString().padStart(2, '0');
                                    //                                         return <option key={hour} value={hour}>{hour}</option>;
                                    //                                     })}
                                    //                                 </select>
                                    //                                 <span className="text-xs self-center">:</span>
                                    //                                 <select
                                    //                                     value={actualHour?.checkOutTime?.split(':')[1] || '00'}
                                    //                                     onChange={(e) => {
                                    //                                         const hour = actualHour?.checkOutTime?.split(':')[0] || '12';
                                    //                                         handleActualHourChange(date, 'checkOutTime', `${hour}:${e.target.value}`);
                                    //                                     }}
                                    //                                     className="w-full text-xs border border-gray-300 rounded px-1 py-1"
                                    //                                 >
                                    //                                     {Array.from({length: 60}, (_, i) => {
                                    //                                         const minute = i.toString().padStart(2, '0');
                                    //                                         return <option key={minute} value={minute}>{minute}</option>;
                                    //                                     })}
                                    //                                 </select>
                                    //                             </div>
                                    //                         </td>
                                    //                         <td className="border border-gray-200 px-2 py-3">
                                    //                             <select
                                    //                                 value={actualHour?.checkOutAmPm || 'AM'}
                                    //                                 onChange={(e) => handleActualHourChange(date, 'checkOutAmPm', e.target.value)}
                                    //                                 className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                    //                             >
                                    //                                 <option value="AM">AM</option>
                                    //                                 <option value="PM">PM</option>
                                    //                             </select>
                                    //                         </td>
                                    //                     </tr>
                                    //                 );
                                    //             })}
                                    //         </tbody>
                                    //     </table>
                                    // </div>

                                <div 
                                    className="
                                        max-h-[500px] 
                                        overflow-y-auto 
                                        border border-gray-300 
                                        bg-white
                                        rounded-xl
                                    "
                                >
                                    <table 
                                        className="
                                            w-full 
                                            border-collapse 
                                            bg-white
                                            relative
                                        "
                                    >
                                        <thead
                                            className='
                                                sticky top-0 z-10
                                                bg-white
                                                shadow-[0_1px_0_0_rgb(209,213,219)]
                                            '
                                        >
                                            {/* Main header row */}
                                            <tr className="border-b border-gray-300 shadow-[0_1px_0_0_rgb(209,213,219)]">
                                                <th className="bg-white border-r border-gray-300 px-6 py-4 text-center text-sm font-normal text-gray-700 uppercase tracking-wider" rowSpan="2">
                                                    Attendance Date
                                                </th>
                                                <th className="bg-white border-r border-gray-300 px-6 py-4 text-center text-sm font-normal text-gray-700 uppercase tracking-wider" colSpan="2">
                                                    Logged Hours
                                                </th>
                                                <th className="bg-white px-6 py-4 text-center text-sm font-normal text-gray-700 uppercase tracking-wider" colSpan="4">
                                                    Actual Hours
                                                </th>
                                            </tr>

                                            {/* Sub-header row */}
                                            <tr>
                                                <th className="border-r border-gray-300 px-6 py-3 text-sm font-normal text-gray-600 uppercase">Check-In</th>
                                                <th className="border-r border-gray-300 px-6 py-3 text-sm font-normal text-gray-600 uppercase">Check-Out</th>
                                                <th className="border-r border-gray-300 px-6 py-3 text-sm font-normal text-gray-600 uppercase" colSpan="2">Check-In</th>
                                                <th className="px-6 py-3 text-sm font-normal text-gray-600 uppercase" colSpan="2">Check-Out</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getDateRange().map((date) => {
                                                const attendance = attendanceData[date];
                                                const actualHour = formData.actualHours[date];

                                                return (
                                                    <tr key={date} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                                        {/* Date column */}
                                                        <td className="border-r border-gray-300 px-6 py-4">
                                                            <div className="text-center text-sm font-normal text-gray-700">
                                                                {formatDate(date)} ({getDayName(date)})
                                                            </div>
                                                        </td>

                                                        {/* Logged Hours - Check-In */}
                                                        <td className="border-r border-gray-300 px-6 py-4 text-center text-sm text-gray-700">
                                                            {attendance?.checkIn ? dayjs(attendance.checkIn).format('HH:mm A') : '-'}
                                                        </td>

                                                        {/* Logged Hours - Check-Out */}
                                                        <td className="border-r border-gray-300 px-6 py-4 text-center text-sm text-gray-700">
                                                            {attendance?.checkOut ? dayjs(attendance.checkOut).format('HH:mm A') : '-'}
                                                        </td>

                                                        {/* Actual Hours - Check-In Date */}
                                                        <td className="border-r border-gray-300 px-4 py-4 w-40">
                                                            <input
                                                                type="date"
                                                                value={actualHour?.checkInDate || date}
                                                                onChange={(e) => handleActualHourChange(date, 'checkInDate', e.target.value)}
                                                                className="w-36 text-center text-sm font-normal text-gray-700 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            />
                                                        </td>

                                                        {/* Actual Hours - Check-In Time */}
                                                        <td className="border-r border-gray-300 px-4 py-4 w-40">
                                                            <div className="flex items-center gap-1">
                                                                <select
                                                                    value={actualHour?.checkInTime?.split(':')[0] || '02'}
                                                                    onChange={(e) => {
                                                                        const minute = actualHour?.checkInTime?.split(':')[1] || '00';
                                                                        handleActualHourChange(date, 'checkInTime', `${e.target.value}:${minute}`);
                                                                    }}
                                                                    className="w-12 text-center text-sm font-normal text-gray-700 border border-gray-300 rounded px-1 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                >
                                                                    {Array.from({ length: 12 }, (_, i) => {
                                                                        const hour = (i + 1).toString().padStart(2, '0');
                                                                        return <option key={hour} value={hour}>{hour}</option>;
                                                                    })}
                                                                </select>
                                                                <span className="text-center text-sm font-normal text-gray-700">:</span>
                                                                <select
                                                                    value={actualHour?.checkInTime?.split(':')[1] || '00'}
                                                                    onChange={(e) => {
                                                                        const hour = actualHour?.checkInTime?.split(':')[0] || '02';
                                                                        handleActualHourChange(date, 'checkInTime', `${hour}:${e.target.value}`);
                                                                    }}
                                                                    className="w-12 text-center text-sm font-normal text-gray-700 border border-gray-300 rounded px-1 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                >
                                                                    {Array.from({ length: 60 }, (_, i) => {
                                                                        const minute = i.toString().padStart(2, '0');
                                                                        return <option key={minute} value={minute}>{minute}</option>;
                                                                    })}
                                                                </select>

                                                                <select
                                                                    value={actualHour?.checkInAmPm || 'AM'}
                                                                    onChange={(e) => handleActualHourChange(date, 'checkInAmPm', e.target.value)}
                                                                    className="ml-2 w-14 text-center text-sm font-normal text-gray-700 border border-gray-300 rounded px-1 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                >
                                                                    <option value="AM">AM</option>
                                                                    <option value="PM">PM</option>
                                                                </select>
                                                            </div>
                                                        </td>

                                                        {/* Actual Hours - Check-Out Date */}
                                                        <td className="border-r border-gray-300 px-4 py-4 w-40">
                                                            <input
                                                                type="date"
                                                                value={actualHour?.checkOutDate || date}
                                                                onChange={(e) => handleActualHourChange(date, 'checkOutDate', e.target.value)}
                                                                className="w-36 text-center text-sm font-normal text-gray-700 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            />
                                                        </td>

                                                        {/* Actual Hours - Check-Out Time */}
                                                        <td className="px-4 py-4 w-40">
                                                            <div className="flex items-center gap-1">
                                                                <select
                                                                    value={actualHour?.checkOutTime?.split(':')[0] || '06'}
                                                                    onChange={(e) => {
                                                                        const minute = actualHour?.checkOutTime?.split(':')[1] || '30';
                                                                        handleActualHourChange(date, 'checkOutTime', `${e.target.value}:${minute}`);
                                                                    }}
                                                                    className="w-12 text-center text-sm font-normal text-gray-700 border border-gray-300 rounded px-1 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                >
                                                                    {Array.from({ length: 12 }, (_, i) => {
                                                                        const hour = (i + 1).toString().padStart(2, '0');
                                                                        return <option key={hour} value={hour}>{hour}</option>;
                                                                    })}
                                                                </select>
                                                                <span className="text-center text-sm font-normal text-gray-700">:</span>
                                                                <select
                                                                    value={actualHour?.checkOutTime?.split(':')[1] || '30'}
                                                                    onChange={(e) => {
                                                                        const hour = actualHour?.checkOutTime?.split(':')[0] || '06';
                                                                        handleActualHourChange(date, 'checkOutTime', `${hour}:${e.target.value}`);
                                                                    }}
                                                                    className="w-12 text-center text-sm font-normal text-gray-700 border border-gray-300 rounded px-1 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                >
                                                                    {Array.from({ length: 60 }, (_, i) => {
                                                                        const minute = i.toString().padStart(2, '0');
                                                                        return <option key={minute} value={minute}>{minute}</option>;
                                                                    })}
                                                                </select>
                                                                <select
                                                                    value={actualHour?.checkOutAmPm || 'AM'}
                                                                    onChange={(e) => handleActualHourChange(date, 'checkOutAmPm', e.target.value)}
                                                                    className="ml-2 w-14 text-center text-sm font-normal text-gray-700 border border-gray-300 rounded px-1 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                >
                                                                    <option value="AM">AM</option>
                                                                    <option value="PM">PM</option>
                                                                </select>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                )}

                                {/* Reason */}
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reason <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.reason}
                                        onChange={(e) => handleInputChange('reason', e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter reason for regulation..."
                                    />
                                </div> */}
                            <div className="w-1/2 space-y-2">
                                <label className="block text-base font-medium">
                                    Reason
                                </label>

                                <textarea
                                    value={formData.reason}
                                    name="reason"
                                    onChange={(e) => handleInputChange('reason', e.target.value)}
                                    rows={2}
                                    className="
                                        w-full 
                                        px-3 py-2 
                                        border border-gray-300
                                        border-l-[6px] border-l-[#DC2626]
                                        rounded-md 
                                        focus:outline-none focus:ring-2 focus:ring-blue-500
                                    "
                                    placeholder=""
                                />

                            </div>

                                <div className="flex justify-start space-x-4 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!formData.dateFrom || !formData.dateTo || !formData.reason.trim()}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        {isEditMode ? 'Update Regulation' : 'Submit Regulation'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                
            </div>
        </div>
    );
};

export default RegulationEmployee;
