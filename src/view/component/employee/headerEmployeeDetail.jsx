function HeaderEmployeeDetail({dataEmployeePersonalDetail}) {
  return (
    <div className="w-full bg-white p-5 px-10 rounded-xl space-y-10">
        <div className="w-full flex items-center justify-between">
            <div className="flex-1 flex space-x-10 items-start justify-start">
                <div className="h-32 w-32 rounded-3xl bg-[#EAF3FF] flex items-center justify-center">
                    <span className="text-[60px] font-semibold text-blue-500">
                        {dataEmployeePersonalDetail?.Employee?.firstName?.charAt(0)?.toUpperCase() || 'V'}
                    </span>
                </div>
                <div className="max-w-[480px] w-full flex flex-col items-start justify-start space-y-2">
                    <h1 className="w-full text-3xl font-medium text-[#0F172A] break-words">{`${dataEmployeePersonalDetail?.Employee?.firstName || ''} ${dataEmployeePersonalDetail?.Employee?.middleName || ''} ${dataEmployeePersonalDetail?.Employee?.lastName || ''}`.trim()}</h1>
                    <p className="text-base text-[#374151]">Employee ID : {dataEmployeePersonalDetail?.Employee?.employeeId}</p>
                    <p className="text-base text-[#374151]">{dataEmployeePersonalDetail?.Employee?.Departement?.name}</p>
                </div>
            </div>
            <div className="h-full flex items-center justify-center">
                <div className={`flex items-center justify-center px-10 py-1 ${dataEmployeePersonalDetail?.Employee?.status === "active" ? "bg-green-td-50" : "bg-gray-td-50"} rounded-full`}>
                <p className={`${dataEmployeePersonalDetail?.Employee?.status === "active" ? "text-green-td-600" : "text-gray-td-600"} text-base font-normal`}>{dataEmployeePersonalDetail?.Employee?.status === "active" ? "Active" : "Inactive"}</p>
                </div>
            </div>
        </div>
    </div>
  );
}

export default HeaderEmployeeDetail;