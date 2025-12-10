import { Link, TrashIcon, XCircleIcon } from "@phosphor-icons/react";
import { headers_reimbursements } from "../static/variables";
import { toast } from "react-toastify";
import { CustomToast } from "../../customToast";

const tableRowStyles = {
    row: {
        className: "border-b border-gray-200"
    },
    cell: {
        className: "px-4 py-3 border-l"
    },
    select: {
        className: "w-full px-1 py-2 text-[#9CA3AF] bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm rounded-md"
    },
    input: {
        className: "w-full px-3 py-2 text-[#9CA3AF] bg-white border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm rounded-md"
    },
    attachmentContainer: {
        className: "flex flex-row justify-center items-center"
    },
    attachmentInfo: {
        className: "flex flex-row items-center gap-1"
    },
    fileLabel: {
        className: "cursor-pointer text-sm text-gray-700 truncate max-w-[100px]"
    },
    trashIcon: {
        className: "cursor-pointer flex-shrink-0"
    },
    fileInput: {
        className: "hidden"
    },
    linkLabel: {
        className: "cursor-pointer"
    }
};

const { 
    row, 
    cell,
    select,
    input,
    attachmentContainer,
    attachmentInfo,
    fileLabel,
    trashIcon,
    fileInput,
    linkLabel
} = tableRowStyles;

const TableRowData = ({ detail, index, handleChange }) => {
    const {
        reimbursementType,
        billDate,
        billNumber,
        claimedAmount,
        approvedAmount,
        attachments,
    } = detail;

    // handle validate file type
    const validateFile = (file) => {
        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png'
        ];

        if (!allowedTypes.includes(file.type)) {
            toast(<CustomToast message={`Invalid input: only JPG and PNG files are allowed`} status={"error"} />, {
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
            return false;
        }

        return true;
    };

    return (
        <tr key={index} className={row.className}>

            {/* Reimbursement Type */}
            <td className={cell.className}>
                <select
                    value={reimbursementType}
                    onChange={(e) => handleChange(
                        index,
                        'reimbursementType',
                        e.target.value
                    )}
                    className={select.className}
                >
                    <option value="" disabled>Select</option>
                    <option value="health">Health</option>
                    <option value="transportation">Transportation</option>
                    <option value="food">Food</option>
                </select>
            </td>

            {/* Bill Date */}
            <td className={cell.className}>
                <input
                    type="date"
                    value={billDate}
                    onChange={(e) => handleChange(
                        index,
                        'billDate',
                        e.target.value
                    )}
                    placeholder="dd-MM-yyyy"
                    className={input.className}
                />
            </td>

            {/* Bill Number */}
            <td className={cell.className}>
                <input
                    type="number"
                    value={billNumber}
                    onChange={(e) => handleChange(
                        index,
                        'billNumber',
                        e.target.value
                    )}
                    className={input.className}
                />
            </td>

            {/* Bill Amount */}
            <td className={cell.className}>
                <input
                    type="number"
                    value={claimedAmount}
                    onChange={(e) => handleChange(
                        index,
                        'claimedAmount',
                        e.target.value
                    )}
                    className={input.className}
                />
            </td>

            {/* Approved Amount */}
            <td className={cell.className}>
                <input
                    type="number"
                    value={approvedAmount}
                    onChange={(e) => handleChange(
                        index,
                        'approvedAmount',
                        e.target.value
                    )}
                    className={input.className}
                />
            </td>

            {/* Attachments */}
            <td className={cell.className}>
                <div className={attachmentContainer.className}>
                    {!attachments ? (
                        <label
                            htmlFor={`file-input-${index}`}
                            className={linkLabel.className}
                        >
                            <Link size={24} color="#4A9EFF" weight="regular" />
                        </label>
                    ) : (
                        <div className={attachmentInfo.className}>
                            <label
                                htmlFor={`file-input-${index}`}
                                className={fileLabel.className}
                                title={attachments.name}
                            >
                                {attachments.name}
                            </label>

                            <TrashIcon
                                size={15}
                                color="#EF4444"
                                weight="regular"
                                className={trashIcon.className}
                                onClick={() => handleChange(index, 'attachments', "")}
                            />
                        </div>
                    )}

                    <input
                        type="file"
                        accept=".pdf,.jpg,.png"
                        id={`file-input-${index}`}
                        className={fileInput.className}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const isValid = validateFile(file);
                                if (isValid) {
                                    handleChange(
                                        index,
                                        'attachments',
                                        file
                                    );
                                } else {
                                    e.target.value = "";
                                }
                            }
                        }}
                    />
                </div>
            </td>
        </tr>
    )
}

const TableInputReimbursements = ({ formData, setFormData }) => {
    const { reimbursementDetails } = formData;

    const handleChange = (index, field, value) => {
        const currentDetails = [...reimbursementDetails];
        currentDetails[index][field] = value;

        setFormData({
            ...formData,
            reimbursementDetails: currentDetails,
        });
    }
    
    return (
        <div className="bg-white p-5">
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full">

                    {/* table header */}
                    <thead>
                        <tr className="border-b bg-[#F5FAFF] border-gray-200">
                            {headers_reimbursements.map((header) => {
                                return <th className="text-left px-4 py-3 text-sm font-medium text-[#4A9EFF]">{header}</th>
                            })}
                        </tr>
                    </thead>

                    {/* dynamic table rows */}
                    <tbody>
                        {reimbursementDetails.map((detail, index) => (
                            <TableRowData 
                                key={index}
                                index={index} 
                                detail={detail}
                                handleChange={handleChange} 
                            />
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    )
}

export default TableInputReimbursements;