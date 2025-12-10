import { useEffect, useState } from "react";
import loanStoreManagements from "../../../store/tdPayroll/loan";
import payScheduleStoreManagements from "../../../store/tdPayroll/setting/paySchedule";
import payrunStoreManagements from "../../../store/tdPayroll/payrun";
import ButtonReusable from "../buttonReusable";
import { toast } from "react-toastify";
import { CustomToast } from "../customToast";
import ReuseableInput from "../reuseableInput";
import MonthPicker from "./MonthPicker";

function FormPauseLoan({setShowModal, data}) {
    const { loading, pauseLoan, getLoanPause, loanPauseData } = loanStoreManagements();
    const { fetchPaySchedule, payScheduleData } = payScheduleStoreManagements();
    const { getPayrunData, payrunDataHistory } = payrunStoreManagements();
    
    const [formData, setFormData] = useState({
        pauseInstalment: 'scheduled',
        pauseDate: '',
        resumeDate: '',
        reason: ''
    });
    const [errors, setErrors] = useState({});
    const [disabledMonths, setDisabledMonths] = useState([]);
    const [minPauseDate, setMinPauseDate] = useState('');
    
    const currentDate = new Date();
    const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

    // ✅ Helper: Parse startMonth "November-2025" to "2025-11"
    const parseStartMonth = (startMonth) => {
        if (!startMonth) return null;
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const [monthName, year] = startMonth.split('-');
        const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
        if (monthIndex !== -1 && year) {
            return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
        }
        return null;
    };

    // ✅ Fetch PaySchedule and Payrun data
    useEffect(() => {
        const fetchData = async () => {
            const access_token = localStorage.getItem("accessToken");
            await fetchPaySchedule(access_token);
            await getPayrunData(access_token, { limit: 10, page: 1 }, 'history');
        };
        fetchData();
    }, []);

    // ✅ Calculate disabled months and min date
    useEffect(() => {
        if (payScheduleData && payrunDataHistory) {
            const disabled = [];
            let minDate = null;
            
            const payruns = payrunDataHistory?.data || [];
            const latestPayrun = payruns.length > 0 ? payruns[0] : null;
            
            // ✅ Get startMonth from PaySchedule
            const startMonth = payScheduleData?.startMonth;
            const startMonthParsed = startMonth ? parseStartMonth(startMonth) : null;
            
            if (latestPayrun) {
                const paymentDate = new Date(latestPayrun.paymentDate);
                const payrunMonth = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, '0')}`;
                
                if (latestPayrun.status === 'paid') {
                    // ✅ Status paid → disable semua bulan sebelum payrun + 1 month
                    const nextMonth = new Date(paymentDate);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    minDate = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}`;
                    
                    // Disable semua bulan sebelum minDate
                    if (startMonthParsed) {
                        const start = new Date(startMonthParsed + '-01');
                        const end = new Date(minDate + '-01');
                        end.setMonth(end.getMonth() - 1);
                        
                        let current = new Date(start);
                        while (current <= end) {
                            const monthStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
                            disabled.push(monthStr);
                            current.setMonth(current.getMonth() + 1);
                        }
                    }
                } else {
                    // ✅ Status draft/paymentDue → disable semua bulan sebelum payrun month (November bisa dipilih)
                    minDate = payrunMonth;
                    
                    // Disable semua bulan sebelum payrun month (tidak termasuk payrun month itu sendiri)
                    if (startMonthParsed) {
                        const start = new Date(startMonthParsed + '-01');
                        const end = new Date(payrunMonth + '-01');
                        end.setMonth(end.getMonth() - 1); // Kurangi 1 bulan agar payrun month tidak disabled
                        
                        let current = new Date(start);
                        while (current <= end) {
                            const monthStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
                            // ✅ Pastikan tidak disable payrun month itu sendiri
                            if (monthStr < payrunMonth) {
                                disabled.push(monthStr);
                            }
                            current.setMonth(current.getMonth() + 1);
                        }
                    }
                }
            } else if (startMonthParsed) {
                // ✅ Belum ada payrun → disable semua bulan sebelum startMonth
                minDate = startMonthParsed;
            }
            
            setMinPauseDate(minDate || currentYearMonth);
            setDisabledMonths(disabled);
        } else if (payScheduleData) {
            // Only PaySchedule available
            const startMonth = payScheduleData?.startMonth;
            if (startMonth) {
                const parsed = parseStartMonth(startMonth);
                setMinPauseDate(parsed || currentYearMonth);
            } else {
                setMinPauseDate(currentYearMonth);
            }
        }
    }, [payScheduleData, payrunDataHistory, currentYearMonth]);

    useEffect(() => {
        if(!loanPauseData){
            const access_token = localStorage.getItem("accessToken");
            getLoanPause(access_token, data);
        }else{
            const pauseInstalment = loanPauseData.pauseInstalment || 'scheduled';
            // ✅ For immediately, if pauseDate is null, set to currentMonth
            const pauseDate = pauseInstalment === 'immediately' && !loanPauseData.pauseDate
                ? currentYearMonth
                : (loanPauseData.pauseDate || '');
            
            setFormData({
                pauseInstalment,
                pauseDate,
                resumeDate: loanPauseData.resumeDate || '',
                reason: loanPauseData.reason || ''
            });
        }
    }, [data, loanPauseData, currentYearMonth]);

    const handleInputChange = (field, value) => {
        setFormData(prev => {
            const updated = {
                ...prev,
                [field]: value
            };
            
            // ✅ Auto-set pauseDate to currentMonth when "immediately" is selected
            if (field === 'pauseInstalment' && value === 'immediately') {
                updated.pauseDate = currentYearMonth;
            }
            
            return updated;
        });
        
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = async () => {
        const access_token = localStorage.getItem("accessToken");
        
        // ✅ Ensure pauseDate is set for immediately (currentMonth)
        const finalPauseDate = formData.pauseInstalment === 'immediately' 
            ? currentYearMonth 
            : formData.pauseDate;
        
        const submitData = {
            pauseInstalment: formData.pauseInstalment,
            pauseDate: finalPauseDate, // ✅ Always send pauseDate (currentMonth for immediately)
            resumeDate: formData.resumeDate,
            reason: formData.reason
        };

        const response = await pauseLoan(access_token, submitData, data);
        if(response){
            const access_token = localStorage.getItem("accessToken");
            await getLoanPause(access_token, data);
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
            setFormData({
                pauseInstalment: 'scheduled',
                pauseDate: '',
                resumeDate: '',
                reason: ''
            })
            setShowModal(false)
        }
    };

    const cancel = () => {
        setShowModal(false)
    }

    return (
        <div className="w-full h-full flex-col flex items-start justify-start relative space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between w-full p-4 border-b">
                <h2 className="text-lg font-semibold">Pause Loan Instalment</h2>
                <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
            </div>
            <div className="w-full px-5">
                <div className="w-full space-y-6 pb-5">
                    {/* Pause Instalment From */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Pause Instalment From <span className="text-red-500">*</span>
                        </label>
                        
                        <div className="space-y-3">
                            <label className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    name="pauseInstalment"
                                    value="immediately"
                                    checked={formData.pauseInstalment === 'immediately'}
                                    onChange={(e) => handleInputChange('pauseInstalment', e.target.value)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Immediately</span>
                            </label>
                            
                            <label className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    name="pauseInstalment"
                                    value="scheduled"
                                    checked={formData.pauseInstalment === 'scheduled'}
                                    onChange={(e) => handleInputChange('pauseInstalment', e.target.value)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">On Scheduled Month</span>
                            </label>
                        </div>

                        {/* Scheduled Month Selection */}
                        {formData.pauseInstalment === 'scheduled' && (
                            <div className="mt-4">
                                <MonthPicker
                                    value={formData.pauseDate}
                                    onChange={(value) => handleInputChange('pauseDate', value)}
                                    minDate={minPauseDate || currentYearMonth}
                                    disabledMonths={disabledMonths}
                                    error={!!errors.pauseDate}
                                />
                                {errors.pauseDate && (
                                    <p className="mt-1 text-sm text-red-600">{errors.pauseDate}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Resume On */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Resume On
                            <span className="ml-2 inline-flex items-center justify-center w-4 h-4 bg-gray-400 text-white rounded-full text-xs">
                                ?
                            </span>
                        </label>
                        
                        <input
                            type="month"
                            value={formData.resumeDate}
                            onChange={(e) => handleInputChange('resumeDate', e.target.value)}
                            min={formData.pauseInstalment === 'scheduled' ? formData.pauseDate : currentYearMonth}
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.resumeDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.resumeDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.resumeDate}</p>
                        )}
                    </div>

                    {/* Reason */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Reason <span className="text-red-500">*</span>
                        </label>
                        <ReuseableInput
                            as="textarea"
                            id="reason"
                            name="reason"
                            placeholder="Payment has been paused Now and resume later month"
                            value={formData.reason}
                            onChange={(e) => handleInputChange('reason', e.target.value)}
                            rows={2}
                            isFocusRing={false}
                            isBorderLeft={true}
                            borderColor="red-td-500"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-5 border-t w-full flex items-center justify-start space-x-3 pb-10">
                    <ButtonReusable title={"Save"} action={handleSubmit} isLoading={loading} />
                    {!loading && <ButtonReusable title={"Cancel"} action={cancel} isBLue={false} />}
                </div>
            </div>
        </div>
    );
}

export default FormPauseLoan;