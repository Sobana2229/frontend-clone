import employeeStoreManagements from "../../../store/tdPayroll/employee";
import ReuseableInput from "../reuseableInput";
import { useEffect } from "react";

function ReimburseBasicInput({
    formData,
    setFormData
}) {

    const { getEmployeeOverview, dataEmployeesOptions } = employeeStoreManagements();

    useEffect(() => {
        if (!dataEmployeesOptions) {
            const access_token = localStorage.getItem("accessToken");
            getEmployeeOverview(access_token, "employeeOptions");
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>  
            {/* employee name */}
            <div
                className="w-1/4"
                style={{border: "2px solid green"}}
            >
                <ReuseableInput
                    label="Employee Name"
                    id="employeeUuid"
                    name="employeeUuid"
                    value={formData.employeeUuid || ""}
                    onChange={handleChange}
                    as="select"
                    isFocusRing={false}
                    isBorderLeft={true}
                    borderColor={"red-td-500"}
                >
                    <option value="" hidden>Select</option>
                    {dataEmployeesOptions?.map((el, idx) => (
                        <option key={idx} value={el.value} className="capitalize">{el.label}</option>
                    ))}
                </ReuseableInput>
            </div>
            
            {/* claim date */}
            {formData.employeeUuid && (
                <div
                    className="w-1/6"
                    style={{ border: "2px solid green" }}
                >
                    <ReuseableInput
                        type="date"
                        label={"Claim Date"}
                        id="claimDate"
                        name="claimDate"
                        value={formData.claimDate || ""}
                        onChange={handleChange}
                        isFocusRing={false}
                        isBorderLeft={true}
                        borderColor={"red-td-500"}
                    />
                </div>
            )}
        </>
    );
}
export default ReimburseBasicInput;