import TableInputReimbursements from "./components/tableInput";
import { headers_reimbursements } from "./static/variables";

const containerStyles= {
    wrapper: {
        className: "w-full border border-gray-200 rounded-lg overflow-hidden",
    },
    staticHeader: {
        className: "bg-white p-5"
    },
    tableWrapper: {
        className: "border rounded-lg overflow-hidden"
    },
    table: {
        className: "w-full"
    },
    headerRow: {
        className: "border-b bg-[#F5FAFF] border-gray-200"
    },
    headerCell: {
        className: "text-left px-4 py-3 text-sm font-medium text-[#4A9EFF]"
    },
    addButtonContainer: {
        className: "flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200"
    },
    addButton: {
        className: "px-4 py-2 text-[#1F87FF] text-base font-medium rounded-md"
    }
};

const { 
    wrapper, 
    staticHeader, 
    tableWrapper, 
    table, 
    headerRow, 
    headerCell, 
    addButtonContainer, 
    addButton 
} = containerStyles

const ReimbursementDetailInput = ({ formData, setFormData }) => {
    const {
        employeeUuid,
        claimDate,
        reimbursementDetails
    } = formData;

    const addReimbursementRow = () => {
        const newRow = {
            reimbursementType: "",
            billDate: "",
            billNumber: "",
            claimedAmount: "",
            approvedAmount: "",
            attachments: null,
        };

        setFormData({
            ...formData,
            reimbursementDetails: [...reimbursementDetails, newRow],
        });
    }

    return (
        <>
            {/* wrapper */}
            <div
                className={wrapper.className}
                style={{
                    opacity: employeeUuid && claimDate ? 1 : 0.5,
                }}
            >
                {/* static header when no employee and date selected */}
                {(!employeeUuid || !claimDate) ? (
                    <div className={staticHeader.className}>
                        <div className={tableWrapper.className}>
                            <table className={table.className}>
                                <thead>
                                    <tr className={headerRow.className}>
                                        {headers_reimbursements.map((header, index) => {
                                            return (
                                                <th
                                                    key={index}
                                                    className={headerCell.className}
                                                >
                                                    {header}
                                                </th>
                                            )
                                        })}
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* table detail reimbursement */
                    <TableInputReimbursements formData={formData} setFormData={setFormData} />
                )}

                {/* add another bill */}
                {(employeeUuid && claimDate) && (
                    <div className={addButtonContainer.className}>
                        <button
                            onClick={addReimbursementRow}
                            className={addButton.className}
                        >
                            + Add another bill
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default ReimbursementDetailInput;