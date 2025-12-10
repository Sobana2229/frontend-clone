function TableReusableStikcyRows({data, tableFor, isTableFull=false}) {
    return (
        <div className="absolute top-0 left-0">
            <table className={`table-auto min-w-max divide-y divide-gray-200`}>
                {tableFor === "attandanceHour" && (
                    <>
                        <thead>
                            <tr className="bg-gray-50">
                                <th className={`px-6 ${data?.formatingDatahour?.length <= 1 ? "h-[74px]" : "py-[16.5%]"} text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]`}>
                                    Employee
                                </th>
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
                                </tr>
                            ))}
                            {data?.formatTotalSumHour && (
                                <tr className="bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        Total
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
                                <th className="px-6 py-[16.5%] text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-[1px]">
                                    Employee
                                </th>
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
                                </tr>
                            ))}
                            {data?.formatTotalSumHour && (
                                <tr className="bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        Total
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </>    
                )}
            </table>
        </div>
    );
}

export default TableReusableStikcyRows;