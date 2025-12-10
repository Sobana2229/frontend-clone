import { dummyLoops } from "../../../../../../data/dummy";
import CardApprovals from "../../../../component/setting/cardApprovals";

function PayRunApprovals() {
    return (
        <div className="w-full flex flex-col items-start justify-start p-5 space-y-4">
            <h1>Select Approval Workflow</h1>
            <div className="w-full flex items-start justify-start">
                <div className="w-full grid grid-cols-4 items-start justify-start gap-5">
                    {dummyLoops?.map((el, idx) => {
                        return (
                            <CardApprovals />
                        );
                    })}
                </div>
            </div>
            <div className="w-full flex items-center justify-between pt-5 border-t-[1px]">
                <button
                    type="button"
                    className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition"
                >
                    Save
                </button>
            </div>
        </div>
    );
}

export default PayRunApprovals;