import { useState } from "react";
import { Link, TrashIcon } from "@phosphor-icons/react";
import { headers_reimbursements } from "../static/variables";
import { toast } from "react-toastify";
import { CustomToast } from "../../customToast";
import TablePagination from "../../../component/tablePagination"; // adjust path if needed

const tableRowStyles = {
    row: { className: "border-b border-gray-200" },
    cell: { className: "px-4 py-3 border-l" },
    select: "w-full px-1 py-2 text-[#9CA3AF] bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm rounded-md",
    input: "w-full px-3 py-2 text-[#9CA3AF] bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm rounded-md",
    attachmentContainer: "flex flex-row justify-center items-center",
    attachmentInfo: "flex flex-row items-center gap-1",
    fileLabel: "cursor-pointer text-sm text-gray-700 truncate max-w-[100px]",
    trashIcon: "cursor-pointer flex-shrink-0",
    fileInput: "hidden",
    linkLabel: "cursor-pointer",
};

const TableRowData = ({ detail, index, handleChange }) => {
    const { reimbursementType, billDate, billNumber, claimedAmount, approvedAmount, attachments } = detail;

    const validateFile = (file) => {
        const allowedTypes = ['image/jpeg','image/jpg','image/png'];
        if (!allowedTypes.includes(file.type)) {
            toast(<CustomToast message={`Invalid input: only JPG and PNG files are allowed`} status={"error"} />, {
                autoClose: 3000, closeButton: false, hideProgressBar: true, position: "top-center",
                style: { background: "transparent", boxShadow: "none", padding: 0 }
            });
            return false;
        }
        return true;
    };

    return (
        <tr key={index} className={tableRowStyles.row.className}>
            <td className={tableRowStyles.cell.className}>
                <select
                    value={reimbursementType}
                    onChange={(e) => handleChange(index, 'reimbursementType', e.target.value)}
                    className={tableRowStyles.select}
                >
                    <option value="" disabled>Select</option>
                    <option value="health">Health</option>
                    <option value="transportation">Transportation</option>
                    <option value="food">Food</option>
                </select>
            </td>
            <td className={tableRowStyles.cell.className}>
                <input type="date" value={billDate} onChange={(e) => handleChange(index, 'billDate', e.target.value)} className={tableRowStyles.input} />
            </td>
            <td className={tableRowStyles.cell.className}>
                <input type="number" value={billNumber} onChange={(e) => handleChange(index, 'billNumber', e.target.value)} className={tableRowStyles.input} />
            </td>
            <td className={tableRowStyles.cell.className}>
                <input type="number" value={claimedAmount} onChange={(e) => handleChange(index, 'claimedAmount', e.target.value)} className={tableRowStyles.input} />
            </td>
            <td className={tableRowStyles.cell.className}>
                <input type="number" value={approvedAmount} onChange={(e) => handleChange(index, 'approvedAmount', e.target.value)} className={tableRowStyles.input} />
            </td>
            <td className={tableRowStyles.cell.className}>
                <div className={tableRowStyles.attachmentContainer}>
                    {!attachments ? (
                        <label htmlFor={`file-input-${index}`} className={tableRowStyles.linkLabel}>
                            <Link size={24} color="#4A9EFF" weight="regular" />
                        </label>
                    ) : (
                        <div className={tableRowStyles.attachmentInfo}>
                            <label htmlFor={`file-input-${index}`} className={tableRowStyles.fileLabel} title={attachments.name}>{attachments.name}</label>
                            <TrashIcon size={15} color="#EF4444" weight="regular" className={tableRowStyles.trashIcon} onClick={() => handleChange(index,'attachments',"")} />
                        </div>
                    )}
                    <input type="file" accept=".jpg,.png" id={`file-input-${index}`} className={tableRowStyles.fileInput} onChange={(e)=>{
                        const file = e.target.files[0];
                        if(file && validateFile(file)) handleChange(index,'attachments',file);
                        else e.target.value="";
                    }} />
                </div>
            </td>
        </tr>
    )
}

const TableInputReimbursements = ({ formData, setFormData }) => {
    const { reimbursementDetails } = formData;
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChange = (index, field, value) => {
        const newDetails = [...reimbursementDetails];
        newDetails[index][field] = value;
        setFormData({ ...formData, reimbursementDetails: newDetails });
    };

    // Pagination logic
    const startIndex = (currentPage-1)*rowsPerPage;
    const paginatedData = reimbursementDetails.slice(startIndex, startIndex+rowsPerPage);

    return (
        <div className="bg-white p-5 flex flex-col h-[500px]">

            {/* Scrollable table */}
            <div className="flex-1 overflow-auto border rounded-lg">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-[#F5FAFF] border-gray-200">
                            {headers_reimbursements.map((header, idx) => (
                                <th key={idx} className="text-left px-4 py-3 text-sm font-medium text-[#4A9EFF]">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((detail,index) => (
                            <TableRowData key={startIndex+index} index={startIndex+index} detail={detail} handleChange={handleChange} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination outside scroll */}
            <div className="mt-2">
                <TablePagination
                    totalRecords={reimbursementDetails.length}
                    rowsPerPageOptions={[5,10,20]}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    )
}

export default TableInputReimbursements;
