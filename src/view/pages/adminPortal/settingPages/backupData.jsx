import { useState } from "react";
import { backupDataHeaders, tabBackupData } from "../../../../../data/dummy";
import HeaderReusable from "../../../component/setting/headerReusable";
import { HardDrive } from "@phosphor-icons/react";

function BackupData() {
    const [activeTab, setActiveTab] = useState(tabBackupData[0]);
    const [backupData, setBackupData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleBackupData = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="w-full h-full flex flex-col items-start justify-start">
            <HeaderReusable isTabsNotTittle={true} tabs={tabBackupData} activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === "Backup Data" ? (
                <div className="w-full p-5 flex items-start justify-start flex-col space-y-5">
                    <div className="py-5 px-5 flex justify-between items-center bg-[#F4F9FE] rounded-md">
                        <div className="flex flex-col space-y-2">
                            <h1 className="text-xl font-medium">Back up your data</h1>
                            <p className="w-full md:w-4/5 text-sm font-light text-gray-500">Get a backup copy of the data in your Zoho Payroll organisation sent to your email as a CSV file. Click here to view a list of all the modules included in this data backup.</p>
                        </div>
                        <div className="flex h-full items-center justify-center ml-4">
                            <button 
                                className={`w-32 py-2 rounded-md text-white ${isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} transition-colors`}
                                onClick={handleBackupData}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : 'Back Up Data'}
                            </button>
                        </div>
                    </div>
                    <div className="w-full flex items-start justify-start">
                        <div className="w-full flex items-center justify-start space-x-3 px-5">
                            <HardDrive size={32} className="" />
                            <h1 className="text-xl font-medium">Backup history</h1>
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-t">
                                    {backupDataHeaders.map((header, index) => (
                                        <th key={index} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-b">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {backupData.length > 0 ? (
                                    backupData.map((data, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.backupTime}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.userName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.fileType}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${data.exportStatus === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {data.exportStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:text-blue-700">
                                                {data.downloadLink && (
                                                    <a href={data.downloadLink} className="font-medium">Download</a>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                                            You've not made any back-ups yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="w-full p-5 flex items-start justify-start flex-col space-y-5">
                    <div className=" w-[93%] py-5 px-5 flex justify-between items-center bg-[#F4F9FE] rounded-md">
                        <div className="flex flex-col space-y-2">
                            <h1 className="text-xl font-medium">Backup Audit Trail</h1>
                            <p className="w-full md:w-4/5 text-sm font-light text-gray-500">Zoho Payroll backs up your Audit Trail activity into a ZIP file and emails you a download link. The link includes only the activity between the current and previous backup dates.</p>
                        </div>
                        <div className="flex h-full items-center justify-center ml-4">
                            <button 
                                className={`w-52 py-2 rounded-md text-white ${isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} transition-colors`}
                                onClick={handleBackupData}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : 'Back Up your Audit Trail'}
                            </button>
                        </div>
                    </div>
                    <div className="w-full flex items-start justify-start">
                        <div className="w-full flex items-center justify-start space-x-3 px-5">
                            <HardDrive size={32} className="" />
                            <h1 className="text-xl font-medium">Backup history</h1>
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-t">
                                    {backupDataHeaders.map((header, index) => (
                                        <th key={index} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-b">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {backupData.length > 0 ? (
                                    backupData.map((data, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.backupTime}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.userName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.fileType}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${data.exportStatus === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {data.exportStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:text-blue-700">
                                                {data.downloadLink && (
                                                    <a href={data.downloadLink} className="font-medium">Download</a>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                                            You've not made any back-ups yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BackupData;