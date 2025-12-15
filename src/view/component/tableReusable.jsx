function TableReusable({data, tableFor, isTableFull=false}) {
    return (
        <div className="overflow-x-hidden">
            <table className={`table-auto ${isTableFull ? "w-full": "min-w-max divide-y"} divide-gray-200`}>
                {tableFor === "attandanceHour" && (
                    <>
                        <thead>
                            <tr className="bg-gray-50">
                                <th rowSpan={2} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Employee
                                </th>
                                <th rowSpan={2} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Total Worked Hours
                                </th>
                                <th rowSpan={2} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Expected Payable Hours
                                </th>
                                <th scope="col" colSpan={3} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Payable Hours
                                </th>
                                <th rowSpan={2} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Expected Working Hours
                                </th>
                                <th scope="col" colSpan={3} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Worked Hours
                                </th>
                                <th scope="col" colSpan={4} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Paid Off
                                </th>
                                <th scope="col" colSpan={3} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Unpaid Off
                                </th>
                                <th scope="col" colSpan={4} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Overtime
                                </th>
                                <th scope="col" colSpan={3} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Overtime/Deviation
                                </th>
                            </tr>

                            <tr className="bg-gray-50">
                                {/* Payable Hours */}
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Worked Hours</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Paid Off</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Total</th>

                                {/* Worked Hours */}
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Present</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">On Duty</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Total</th>

                                {/* Paid Off */}
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Leave</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Holidays</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Weekends</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Total</th>

                                {/* Unpaid Off */}
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Leave</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Deviation</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Total</th>

                                {/* Overtime */}
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Weekends</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Holidays</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Other</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Total</th>

                                {/* Overtime/Deviation */}
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Overtime</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Deviation</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data?.formatingDatahour?.map((el, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-start space-x-3">
                                            <div className="font-medium text-gray-900">
                                                {el?.user?.id}
                                            </div>
                                            <div className="text-gray-600 flex items-center justify-start space-x-2">
                                                <p>
                                                    {el?.user?.firstName}
                                                </p>
                                                <p>
                                                    {el?.user?.lastName}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el?.totalWorkedHours}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.expectedPayableHours} 
                                    </td>

                                    {/* Payable Hours */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.payableHours?.workedHours}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.payableHours?.paidOff}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.payableHours?.total}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.expectedWorkingHours}
                                    </td>

                                    {/* Worked Hours */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.workedHours?.present}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.workedHours?.onDuty}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.workedHours?.total}
                                    </td>

                                    {/* Paid Off */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.paidOff?.leave}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.paidOff?.holiday}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.paidOff?.weekend}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.paidOff?.total}
                                    </td>

                                    {/* Unpaid Off */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.unpaidOff?.leave}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.unpaidOff?.deviation}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.unpaidOff?.total}
                                    </td>

                                    {/* Overtime */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        <span className="text-green-500">{el.overtime?.weekend}</span>
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        <span className="text-green-500">{el.overtime?.holiday}</span>
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        <span className="text-green-500">{el.overtime?.other}</span>
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        <span className="text-green-500">{el.overtime?.total}</span>
                                    </td>

                                    {/* overtimeOrDeviation */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        <span className="text-green-500">{el.overtimeOrDeviation?.overtime}</span>
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        <span className="text-blue-500">{el.overtimeOrDeviation?.deviation}</span>
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        <span className={el.overtimeOrDeviation?.netTotal?.compare === "red" ? "text-blue-500" : "text-green-500"}>{el.overtimeOrDeviation?.netTotal?.formating}</span>
                                    </td>
                                </tr>
                            ))}
                            
                            {/* Total row */}
                            {data?.formatTotalSumHour && (
                                <tr className="bg-gray-50">                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        Total
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                                        {data?.formatTotalSumHour?.totalWorkedHoursTotal}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                                        {data?.formatTotalSumHour?.expectedPayableHours}
                                    </td>
                                    
                                    {/* Payable Hours Totals */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                                        {data?.formatTotalSumHour?.payableHours?.workedHours}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                                        {data?.formatTotalSumHour?.payableHours?.paidOff}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                                        {data?.formatTotalSumHour?.payableHours?.total}
                                    </td>
                                    
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                                        {data?.formatTotalSumHour?.expectedWorkingHours}
                                    </td>

                                    {/* workedHours */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                                        {data?.formatTotalSumHour?.workedHours?.present}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                                        {data?.formatTotalSumHour?.workedHours?.onDuty}
                                    </td>

                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                                        {data?.formatTotalSumHour?.workedHours?.total}
                                    </td>
                                    
                                    {/* Paid Off Totals */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                                        {data?.formatTotalSumHour?.paidOff?.leave}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                                        {data?.formatTotalSumHour?.paidOff?.holiday}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                                        {data?.formatTotalSumHour?.paidOff?.weekend}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                                        {data?.formatTotalSumHour?.paidOff?.total}
                                    </td>
                                    
                                    {/* Unpaid Off Totals */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                                        {data?.formatTotalSumHour?.unpaidOff?.leave}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                                        {data?.formatTotalSumHour?.unpaidOff?.deviation}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-green-500 font-medium">
                                        {data?.formatTotalSumHour?.unpaidOff?.total}
                                    </td>

                                    {/* overtime */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-green-500 font-medium">
                                        {data?.formatTotalSumHour?.overtime?.weekend}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-green-500 font-medium">
                                        {data?.formatTotalSumHour?.overtime?.holiday}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-green-500 font-medium">
                                        {data?.formatTotalSumHour?.overtime?.other}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-green-500 font-medium">
                                        {data?.formatTotalSumHour?.overtime?.total}
                                    </td>

                                    {/* overtimeOrDeviation */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-green-500 font-medium">
                                        {data?.formatTotalSumHour?.overtimeOrDeviation?.overtime}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-blue-500 font-medium">
                                        {data?.formatTotalSumHour?.overtimeOrDeviation?.deviation}
                                    </td>
                                    <td className={`px-2 py-4 whitespace-nowrap text-center text-sm ${data?.formatTotalSumHour?.overtimeOrDeviation?.netTotal?.compare === "red" ? "text-blue-500" : "text-green-500"} font-medium`}>
                                        {data?.formatTotalSumHour?.overtimeOrDeviation?.netTotal?.formating}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </>
                )}

                {tableFor === "attandanceDay" && (
                    <>
                        <thead>
                            <tr className="bg-gray-50">
                                <th rowSpan={2} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                Employee
                                </th>
                                <th rowSpan={2} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                Expected Payable Days
                                </th>
                                <th colSpan={3} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                Payable Days
                                </th>
                                <th rowSpan={2} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                Expected Working Days
                                </th>
                                <th colSpan={3} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                Worked Days
                                </th>
                                <th colSpan={4} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                Paid Off
                                </th>
                                <th colSpan={3} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                Unpaid Off
                                </th>
                                <th colSpan={3} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                Overtime/Deviation
                                </th>
                            </tr>

                            <tr className="bg-gray-50">
                                <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Worked Days</th>
                                <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Paid Off</th>
                                <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Total</th>

                                <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Present</th>
                                <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">On Duty</th>
                                <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Total</th>

                                <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Leave</th>
                                <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Holidays</th>
                                <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Weekends</th>
                                <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Total</th>

                                <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Leave</th>
                                <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Absent</th>
                                <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Total</th>

                                <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Overtime</th>
                                <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Deviation</th>
                                <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Total</th>
                            </tr>
                            </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {data?.map((el, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-start space-x-3">
                                            <div className="font-medium text-gray-900">
                                                {el?.user?.id}
                                            </div>
                                            <div className="text-gray-600 flex items-center justify-start space-x-2">
                                                <p>
                                                    {el?.user?.firstName}
                                                </p>
                                                <p>
                                                    {el?.user?.lastName}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        {el?.expectedPayableDays}
                                    </td>

                                    {/* Payable Hours */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        {el.payableDays?.workedDays}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        {el.payableDays?.paidOff}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        {el.payableDays?.total}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        {el.expectedWorkingDays}
                                    </td>

                                    {/* Worked Hours */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        {el.workedDays?.present}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        {el.workedDays?.onDuty}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        {el.workedDays?.total}
                                    </td>

                                    {/* Paid Off */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        {el.paidOff?.leave}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        {el.paidOff?.holiday}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        {el.paidOff?.weekend}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        {el.paidOff?.total}
                                    </td>

                                    {/* Unpaid Off */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        {el.unpaidOff?.leave}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        {el.unpaidOff?.absent}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        {el.unpaidOff?.total}
                                    </td>

                                    {/* overtimeOrDeviation */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        <span className="text-green-500">{el.overtimeOrDeviation?.overtime}</span>
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        <span className="text-blue-500">{el.overtimeOrDeviation?.deviation}</span>
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                        <span className={el.overtimeOrDeviation?.result?.compare === "red" ? "text-blue-500" : "text-green-500"}>{el.overtimeOrDeviation?.result?.formating}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                )}

                {tableFor === "lossOfPayDetails" && (
                    <>
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Employee
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Previous Pay Period Balance
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Booked
                                    <br />
                                    Absent + Unpaid
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Total
                                    <br />
                                    Previous + Taken
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Adjustment
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Loss of pay
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Reason
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Carry Over
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {data?.map((el, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-start space-x-3">
                                            <div className="font-medium text-gray-900">
                                                {el?.employee?.id}
                                            </div>
                                            <div className="text-gray-600 flex items-center justify-start space-x-2">
                                                <p>{el?.employee?.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                                        {el?.lopDetail?.PreviousPayPeriodBalance ?? 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                                        {el?.lopDetail?.booked ?? 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                                        {el?.lopDetail?.total ?? 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                                        {el?.lopDetail?.adjustment ?? 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                                        {el?.lopDetail?.lop ?? 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                                        <em className="text-gray-400 italic">-</em>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                                        {el?.lopDetail?.carryOver ?? 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                )}

                {tableFor === "leavesPages" && (
                    <>
                        <thead>
                            <tr className="bg-gray-50">
                                <th rowSpan={2} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Employee
                                </th>
                                <th scope="col" colSpan={2} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Casual Leave
                                </th>
                                <th scope="col" colSpan={2} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Earned Leave
                                </th>
                                <th scope="col" colSpan={2} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Leaves Without Pay
                                </th>
                                <th scope="col" colSpan={2} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Paternity Leave
                                </th>
                                <th scope="col" colSpan={2} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Sabbatical Leave
                                </th>
                                <th scope="col" colSpan={2} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Sick Leave
                                </th>
                            </tr>

                            <tr className="bg-gray-50">
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Paid</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Unpaid</th>

                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Paid</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Unpaid</th>

                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Paid</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Unpaid</th>

                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Paid</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Unpaid</th>

                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Paid</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Unpaid</th>
                                
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Paid</th>
                                <th scope="col" className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-[1px] w-[100px]">Unpaid</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data?.map((el, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap flex items-center justify-start space-x-3">
                                        <div className="h-10 w-10 overflow-hidden rounded-full">
                                            <img className="object-cover" src={el?.employee?.employeePhoto ? el?.employee?.employeePhoto : "https://contacts.zoho.com/file?ID=839307310&fs=thumb"} alt="employeePhoto" />
                                        </div>
                                        <div className="flex items-center justify-start space-x-3">
                                            <h1 className="font-medium text-gray-900">{el?.employee?.employeeId}</h1>
                                            <p className="text-gray-600 flex items-center justify-start space-x-2">
                                                {el?.employee?.name}
                                            </p>
                                        </div>
                                    </td>

                                    {/* casualLeave */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.casualLeave?.paid}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.casualLeave?.unpaid}
                                    </td>

                                    {/* earnedLeave */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.earnedLeave?.paid}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.earnedLeave?.unpaid}
                                    </td>

                                    {/* leavesWithoutPay */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.leavesWithoutPay?.paid}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.leavesWithoutPay?.unpaid}
                                    </td>

                                    {/* paternityLeave */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.paternityLeave?.paid}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.paternityLeave?.unpaid}
                                    </td>

                                    {/* sabbaticalLeave */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.sabbaticalLeave?.paid}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.sabbaticalLeave?.unpaid}
                                    </td>

                                    {/* sickLeave */}
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.sickLeave?.paid}
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-center text-sm text-gray-500 border-l-[1px]">
                                        {el.sickLeave?.unpaid}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                )}
            </table>
        </div>
    );
}

export default TableReusable;