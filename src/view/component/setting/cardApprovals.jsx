function CardApprovals() {
    return (
        <div className="w-full flex flex-col space-y-2 items-start justify-center border-[1px] shadow-sm p-5 rounded-md duration-300 ease-in-out transition-all hover:border-2 hover:shadow-md">
            <div className="flex items-center justify-start space-x-2">
                <input type="radio" />
                <h1>Simple Approval</h1>
            </div>
            <p>In this approval flow, any approver with Pay Run approval permission can approve.</p>
        </div>
  );
}

export default CardApprovals;
  